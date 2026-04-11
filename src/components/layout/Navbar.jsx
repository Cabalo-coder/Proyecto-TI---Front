import { useAuth } from "../../context/AuthContext";
import { AppBar, Box, Button, Chip, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

function Navbar({ onMenuClick }) {
  const { logout } = useAuth();

  const currentDate = new Date().toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(18px)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            onClick={onMenuClick}
            sx={{ display: { xs: "inline-flex", md: "none" }, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>

          <HomeRoundedIcon sx={{ color: "primary.main" }} />

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
              Home
          </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5, flexWrap: "wrap" }}>
              <Typography variant="body2" color="text.secondary">
                {currentDate}
              </Typography>
              <Chip
                size="small"
                label="Conectado"
                sx={{
                  bgcolor: "rgba(47, 133, 90, 0.12)",
                  color: "#2f855a",
                  fontWeight: 700,
                }}
              />
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={logout}
        >
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;