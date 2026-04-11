import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Box,
  Button,
  Container,
  InputAdornment,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const waterButtonSx = {
    position: "relative",
    overflow: "hidden",
    borderRadius: 999,
    fontWeight: 800,
    letterSpacing: 0.2,
    textTransform: "none",
    color: "#ffffff",
    background:
      "linear-gradient(135deg, rgba(61,90,128,0.96) 0%, rgba(41,50,65,0.98) 65%, rgba(32,41,56,1) 100%)",
    border: "1px solid rgba(255,255,255,0.22)",
    backdropFilter: "blur(14px)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -12px 24px rgba(0,0,0,0.12), 0 14px 28px rgba(41,50,65,0.26)",
    "&::before": {
      content: '""',
      position: "absolute",
      left: "6%",
      right: "6%",
      top: 2,
      height: "48%",
      borderRadius: 999,
      background: "linear-gradient(180deg, rgba(255,255,255,0.38), rgba(255,255,255,0.08))",
      pointerEvents: "none",
    },
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.42), inset 0 -12px 24px rgba(0,0,0,0.14), 0 18px 34px rgba(41,50,65,0.3)",
      background:
        "linear-gradient(135deg, rgba(70,100,142,0.98) 0%, rgba(45,57,76,1) 65%, rgba(34,44,61,1) 100%)",
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginRequest(email, password);
      login(data.access_token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 14% 26%, rgba(224,251,252,0.95) 0%, rgba(224,251,252,0.84) 34%, rgba(152,193,217,0.36) 70%, rgba(238,108,77,0.14) 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          top: -170,
          right: -120,
          background: "radial-gradient(circle, rgba(238,108,77,0.34), transparent 65%)",
          filter: "blur(12px)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: 460,
          height: 460,
          borderRadius: "50%",
          left: -180,
          bottom: -220,
          background: "radial-gradient(circle, rgba(61,90,128,0.30), transparent 65%)",
          filter: "blur(16px)",
        },
      }}
    >
      <AppBar
        position="static"
        sx={{ backgroundColor: "#0f172a", boxShadow: "none", zIndex: 2 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SchoolIcon />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Asistencia Facial
            </Typography>
          </Box>

          <Button sx={{ ...waterButtonSx, px: 2.2, py: 0.7 }} onClick={() => navigate("/register")}>
            Crear cuenta
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 4, md: 6 },
          minHeight: { xs: "calc(100vh - 64px)", md: "calc(100vh - 72px)" },
          display: "grid",
          placeItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Paper
          elevation={0}
          className="glass-surface animate-fade-up"
          sx={{
            width: "100%",
            maxWidth: 1120,
            p: { xs: 3.2, md: 5 },
            borderRadius: 4,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
            gap: { xs: 3, md: 5 },
            alignItems: "center",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.64) 100%)",
          }}
        >
          <Box sx={{ display: "grid", gap: 1.4 }}>
            <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 2.4, fontWeight: 700 }}>
              Acceso seguro
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.02 }}>
              Bienvenido
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
              Inicia sesión para ingresar al panel principal de control y administrar asistencia en tiempo real.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleLogin} sx={{ display: "grid", gap: 2 }}>
            <TextField
              type="email"
              label="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ ...waterButtonSx, mt: 0.8, py: 1.3 }}
            >
              Ingresar
            </Button>

            <Typography sx={{ mt: 1.5, textAlign: "center" }}>
              ¿No tienes cuenta?{" "}
              <Button variant="text" sx={{ fontWeight: 800 }} onClick={() => navigate("/register")}>
              Regístrate
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;