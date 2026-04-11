import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../services/authService";
import { AppBar, Box, Button, Container, Paper, TextField, Toolbar, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerRequest(form.name, form.email, form.password);

      alert("Registro exitoso 🚀");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box
      className="page-shell"
      sx={{
        minHeight: "100vh",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#293241", boxShadow: "none" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SchoolIcon />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Asistencia Facial
            </Typography>
          </Box>

          <Button color="inherit" onClick={() => navigate("/")}>
            Volver al login
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper className="glass-surface animate-fade-up lift-on-hover" sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Registro de profesor
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Crea tu acceso para administrar cursos y asistencia.
          </Typography>

          <Box component="form" onSubmit={handleRegister} sx={{ display: "grid", gap: 2 }}>
            <TextField
              type="text"
              name="name"
              label="Nombre"
              value={form.name}
              onChange={handleChange}
              required
            />

            <TextField
              type="email"
              name="email"
              label="Correo"
              value={form.email}
              onChange={handleChange}
              required
            />

            <TextField
              type="password"
              name="password"
              label="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" variant="contained" size="large" color="secondary">
              Registrarse
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;