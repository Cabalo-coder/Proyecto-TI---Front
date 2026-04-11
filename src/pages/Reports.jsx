import DashboardLayout from "../components/layout/DashboardLayout";
import { Box, Card, CardContent, Typography } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

function Reports() {
  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Card className="glass-surface lift-on-hover animate-fade-up">
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <AssessmentIcon sx={{ fontSize: 54, color: "primary.main", mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Reportes
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Aquí se mostrará el panel de reportes y métricas del sistema.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default Reports;