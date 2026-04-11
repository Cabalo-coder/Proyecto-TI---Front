import DashboardLayout from "../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getCourses } from "../services/courseService";

function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los cursos");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const rows = useMemo(
    () =>
      courses.map((course, index) => ({
        id: course.course_id ?? index + 1,
        course_name: course.course_name ?? "Sin nombre",
        teacher_id: course.teacher_id ?? "-",
      })),
    [courses]
  );

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "course_name", headerName: "Curso", flex: 1, minWidth: 180 },
    { field: "teacher_id", headerName: "Profesor", width: 140 },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ display: "grid", gap: 3 }}>
        <Card sx={{ borderRadius: 3, backgroundColor: "#0f172a", color: "white" }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Home
            </Typography>
            <Typography sx={{ mt: 1, opacity: 0.9 }}>
              Administra cursos y toma asistencia desde un solo panel.
            </Typography>

            <Button
              variant="contained"
              color="warning"
              sx={{ mt: 3 }}
              onClick={() => navigate("/attendance")}
            >
              Tomar asistencia
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Cursos registrados
            </Typography>

            {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

            <Box sx={{ height: 380, width: "100%" }}>
              {loading ? (
                <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSizeOptions={[5, 10]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 5, page: 0 },
                    },
                  }}
                  disableRowSelectionOnClick
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default Dashboard;