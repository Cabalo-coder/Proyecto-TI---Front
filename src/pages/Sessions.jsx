import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getCourses } from "../services/courseService";
import {
  createSession,
  getSessionsByCourse,
  getAllSessions
} from "../services/sessionService";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AddIcon from "@mui/icons-material/Add";
import ScheduleIcon from "@mui/icons-material/Schedule";

function Sessions() {
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [courseId, setCourseId] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // cargar cursos
    useEffect(() => {
    const fetchData = async () => {
        // 🔹 cargar cursos
        const coursesData = await getCourses();
        setCourses(Array.isArray(coursesData) ? coursesData : []);

        // 🔹 cargar sesiones
        const sessionsData = await getAllSessions();
        setSessions(Array.isArray(sessionsData) ? sessionsData : []);
    };

    fetchData();
    }, []);

  // cargar sesiones
  const loadSessions = async (id) => {
    const data = await getSessionsByCourse(id);
    setSessions(data);
  };

  // crear sesión
  const handleCreateSession = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = {
      course_id: parseInt(courseId),
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      await createSession(data);
      setSuccess("Clase creada correctamente");
      loadSessions(courseId);
    } catch (err) {
      setError(err.message || "No se pudo crear la sesión");
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ display: "grid", gap: 3, maxWidth: 1100, mx: "auto" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Sesiones de clase
          </Typography>
          <Typography color="text.secondary">
            Crea y revisa sesiones con un diseño más claro y ordenado.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}
        {success ? <Alert severity="success">{success}</Alert> : null}

        <Card className="glass-surface lift-on-hover animate-fade-up">
          <CardContent>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <EventAvailableIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Crear sesión
              </Typography>
            </Stack>

            <Box component="form" onSubmit={handleCreateSession} sx={{ display: "grid", gap: 2 }}>
              <TextField
                select
                label="Curso"
                value={courseId}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  loadSessions(e.target.value);
                }}
                fullWidth
              >
                <MenuItem value="">Selecciona un curso</MenuItem>
                {courses.map((c) => (
                  <MenuItem key={c.course_id} value={c.course_id}>
                    {c.course_name}
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Box sx={{ flex: 1, display: "grid", gap: 0.75 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                    Fecha
                  </Typography>
                  <TextField
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <Box sx={{ flex: 1, display: "grid", gap: 0.75 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                    Hora inicio
                  </Typography>
                  <TextField
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <Box sx={{ flex: 1, display: "grid", gap: 0.75 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                    Hora fin
                  </Typography>
                  <TextField
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Stack>

              <Button type="submit" variant="contained" startIcon={<AddIcon />}>
                Crear sesión
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card className="glass-surface lift-on-hover animate-fade-up" sx={{ animationDelay: "80ms" }}>
          <CardContent>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <ScheduleIcon color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Sesiones
              </Typography>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1.2}>
              {sessions.map((s) => (
                <Box
                  key={s.session_id}
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: "rgba(152,193,217,0.18)",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  📅 {s.session_date} | 🕒 {s.start_time} - {s.end_time}
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default Sessions;