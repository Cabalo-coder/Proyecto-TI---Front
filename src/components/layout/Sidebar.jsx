import { Box, Button, Stack, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";

function Sidebar({ onNavigate, onClose, mobile = false }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }

    if (onClose) {
      onClose();
    }
  };

  const items = [
    { label: "Home", path: "/dashboard", icon: <HomeIcon /> },
    { label: "Asistencia", path: "/attendance", icon: <CheckCircleIcon /> },
    { label: "Reportes", path: "/reports", icon: <AssessmentIcon /> },
    { label: "Cursos", path: "/courses", icon: <MenuBookIcon /> },
    { label: "Sesiones", path: "/sessions", icon: <EventNoteIcon /> },
    { label: "Estudiantes", path: "/students", icon: <GroupIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        p: 2.2,
        display: "flex",
        flexDirection: "column",
        gap: 2.2,
        position: mobile ? "static" : "sticky",
        top: mobile ? "auto" : 0,
        alignSelf: "flex-start",
        overflowY: mobile ? "visible" : "auto",
        overscrollBehavior: "contain",
        background:
          "linear-gradient(180deg, rgba(41,50,65,0.98) 0%, rgba(61,90,128,0.95) 100%)",
        color: "#fff",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Box
        className="animate-fade-up"
        sx={{
          px: 2.5,
          py: 2.3,
          borderRadius: 4,
          textAlign: "center",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.06) 100%)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 2.2,
            opacity: 0.84,
            display: "block",
          }}
        >
          Sistema
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.02, mt: 0.4 }}>
          Control de Asistencia
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.88, mt: 1.1, px: 0.25 }}>
          Panel de navegación para gestión académica.
        </Typography>
      </Box>

      <Stack spacing={1} sx={{ flex: 1 }}>
        {items.map((item) => (
          <Button
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            startIcon={item.icon}
            sx={{
              justifyContent: "center",
              color: "white",
              px: 2.2,
              py: 1.4,
              borderRadius: 999,
              position: "relative",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.03) 100%)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(14px)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 22px rgba(10,15,30,0.18)",
              textTransform: "none",
              fontWeight: 700,
              letterSpacing: 0.2,
              textAlign: "center",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.08) 28%, transparent 55%)",
                opacity: 0.55,
                pointerEvents: "none",
              },
              "&:hover": {
                transform: "translateX(3px) translateY(-1px)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.06) 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.32), 0 14px 28px rgba(10,15,30,0.24)",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

export default Sidebar;