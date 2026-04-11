import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  getCourses,
  createCourse,
  createSection,
  getSectionsByCourse,
} from "../services/courseService";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useMemo } from "react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState({});
  const [openCourse, setOpenCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [courseName, setCourseName] = useState("");
  const [sectionName, setSectionName] = useState("A");
  const [selectedCourse, setSelectedCourse] = useState("");

  // 🔄 Cargar cursos
  const fetchCourses = async () => {
    try {
      setError("");
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los cursos");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 📌 Crear curso
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createCourse(courseName);
      setCourseName("");
      await fetchCourses();
    } catch (err) {
      setError(err.message || "No se pudo crear el curso");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Crear sección
  const handleCreateSection = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      alert("Selecciona un curso");
      return;
    }

    try {
      setLoading(true);
      await createSection(sectionName, parseInt(selectedCourse));
      await loadSections(selectedCourse);
    } catch (err) {
      setError(err.message || "No se pudo crear la sección");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Cargar secciones de un curso
  const loadSections = async (course_id) => {
    const data = await getSectionsByCourse(course_id);

    setSections((prev) => ({
      ...prev,
      [course_id]: data,
    }));
  };

  // 📌 Expandir curso
  const handleToggle = (course_id) => {
    if (openCourse === course_id) {
      setOpenCourse(null);
    } else {
      setOpenCourse(course_id);
      loadSections(course_id);
    }
  };

  const sectionOptions = useMemo(() => ["A", "B", "C", "D", "E", "F", "G"], []);

  return (
    <DashboardLayout>
      <Box sx={{ display: "grid", gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Cursos
          </Typography>
          <Typography color="text.secondary">
            Crea cursos y secciones con una experiencia más limpia y fluida.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card className="glass-surface lift-on-hover animate-fade-up">
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <MenuBookIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Crear curso
                  </Typography>
                </Stack>

                <Box component="form" onSubmit={handleCreateCourse} sx={{ display: "grid", gap: 2 }}>
                  <TextField
                    label="Nombre del curso"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    fullWidth
                    required
                  />
                  <Button type="submit" variant="contained" startIcon={<AddIcon />} disabled={loading}>
                    Crear curso
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="glass-surface lift-on-hover animate-fade-up" sx={{ animationDelay: "80ms" }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Crear sección
                </Typography>

                <Box component="form" onSubmit={handleCreateSection} sx={{ display: "grid", gap: 2 }}>
                  <TextField
                    select
                    label="Curso"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    fullWidth
                    required
                  >
                    <MenuItem value="">Selecciona un curso</MenuItem>
                    {courses.map((c) => (
                      <MenuItem key={c.course_id} value={c.course_id}>
                        {c.course_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Sección"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    fullWidth
                    required
                  >
                    {sectionOptions.map((letter) => (
                      <MenuItem key={letter} value={letter}>
                        Sección {letter}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button type="submit" variant="contained" color="secondary" startIcon={<AddIcon />} disabled={loading}>
                    Crear sección
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card className="glass-surface lift-on-hover animate-fade-up" sx={{ animationDelay: "140ms" }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Mis cursos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Haz clic sobre un curso para desplegar sus secciones.
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1.5}>
              {courses.map((course) => (
                <Box key={course.course_id}>
                  <Button
                    fullWidth
                    onClick={() => handleToggle(course.course_id)}
                    endIcon={<ExpandMoreIcon />}
                    sx={{
                      justifyContent: "space-between",
                      background: "rgba(61,90,128,0.08)",
                      color: "text.primary",
                      p: 1.7,
                      borderRadius: 3,
                    }}
                  >
                    {course.course_name}
                  </Button>

                  <Collapse in={openCourse === course.course_id} timeout={260} unmountOnExit>
                    <Box sx={{ pl: 2, pt: 1.5 }}>
                      {sections[course.course_id]?.length > 0 ? (
                        <Stack spacing={1}>
                          {sections[course.course_id].map((sec) => (
                            <Box key={sec.section_id} sx={{ p: 1.2, borderRadius: 2, bgcolor: "rgba(152,193,217,0.20)" }}>
                              Sección {sec.section_name}
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary">No hay secciones</Typography>
                      )}
                    </Box>
                  </Collapse>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default Courses;