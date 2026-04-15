import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getDailyReport, getDashboardReport, getStudentHistoryReport } from "../services/reportService";
import { getTeacherStructure } from "../services/studentService";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Select,
  Stack,
  Typography,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupsIcon from "@mui/icons-material/Groups";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const metricCards = [
  {
    key: "total_students",
    label: "Total estudiantes",
    icon: <GroupsIcon />,
    tone: "#3D5A80",
  },
  {
    key: "attendance_today",
    label: "Asistieron hoy",
    icon: <HowToRegIcon />,
    tone: "#EE6C4D",
  },
  {
    key: "percentage",
    label: "Porcentaje",
    icon: <TrendingUpIcon />,
    tone: "#2A9D8F",
  },
];

const formatDateTime = (value) => {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatDateOnly = (value) => {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

function Reports() {
  const [dashboard, setDashboard] = useState(null);
  const [daily, setDaily] = useState([]);
  const [studentStructure, setStudentStructure] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentHistory, setStudentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");

  const students = useMemo(() => {
    const result = [];

    studentStructure.forEach((course) => {
      course.sections?.forEach((section) => {
        section.students?.forEach((student) => {
          result.push({
            id: student.id,
            name: student.name,
            carne: student.carne,
            courseName: course.course_name,
            sectionName: section.section_name,
          });
        });
      });
    });

    return result;
  }, [studentStructure]);

  const loadReports = async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboardData, dailyData, structureData] = await Promise.all([
        getDashboardReport(),
        getDailyReport(),
        getTeacherStructure(),
      ]);

      setDashboard(dashboardData);
      setDaily(Array.isArray(dailyData) ? dailyData : []);
      setStudentStructure(structureData?.courses || []);
    } catch (err) {
      console.error(err);
      setError(err?.message || "No se pudieron cargar los reportes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      if (!selectedStudentId) {
        setStudentHistory([]);
        return;
      }

      setHistoryLoading(true);
      try {
        const data = await getStudentHistoryReport(selectedStudentId);
        setStudentHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err?.message || "No se pudo cargar el historial del estudiante");
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, [selectedStudentId]);

  const attendedToday = dashboard?.attendance_today || 0;
  const totalStudents = dashboard?.total_students || 0;
  const percentage = dashboard?.percentage || 0;
  const absentToday = Math.max(totalStudents - attendedToday, 0);

  return (
    <DashboardLayout>
      <Box sx={{ display: "grid", gap: 3, maxWidth: 1320, mx: "auto" }}>
        <Box sx={{ display: "grid", gap: 1, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Reportes
          </Typography>
          <Typography color="text.secondary">
            Resumen rápido, historial individual y asistencias de hoy en un solo panel.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}

        <Card className="glass-surface lift-on-hover animate-fade-up">
          <CardContent sx={{ display: "grid", gap: 2.4 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <AssessmentIcon sx={{ color: "primary.main" }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Resumen general
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resumen general rápido del día.
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 2,
              }}
            >
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="glass-surface" sx={{ p: 2 }}>
                      <Skeleton variant="text" width="60%" height={34} />
                      <Skeleton variant="rounded" height={22} />
                      <Skeleton variant="text" width="40%" />
                    </Card>
                  ))
                : metricCards.map((metric) => (
                    <Card key={metric.key} className="glass-surface" sx={{ p: 2.2, position: "relative", overflow: "hidden" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          inset: "auto -30px -40px auto",
                          width: 110,
                          height: 110,
                          borderRadius: "50%",
                          bgcolor: `${metric.tone}22`,
                          filter: "blur(4px)",
                        }}
                      />

                      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ position: "relative" }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 3,
                            display: "grid",
                            placeItems: "center",
                            color: metric.tone,
                            bgcolor: `${metric.tone}14`,
                          }}
                        >
                          {metric.icon}
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {metric.label}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.05 }}>
                            {metric.key === "percentage" ? `${percentage}%` : dashboard?.[metric.key] ?? 0}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ mt: 2.2, position: "relative" }}>
                        {metric.key === "percentage" ? (
                          <>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(percentage, 100)}
                              sx={{ height: 10, borderRadius: 999, bgcolor: "rgba(61,90,128,0.12)" }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                              (asistieron / total estudiantes) * 100
                            </Typography>
                          </>
                        ) : metric.key === "attendance_today" ? (
                          <Typography variant="body2" color="text.secondary">
                            Cuántos asistieron hoy de los estudiantes del profesor.
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Cantidad total de estudiantes registrados en tu estructura.
                          </Typography>
                        )}
                      </Box>
                    </Card>
                  ))}
            </Box>

            <Card className="glass-surface" sx={{ p: 2.2, bgcolor: "rgba(61,90,128,0.05)" }}>
              <Stack spacing={1.2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EventAvailableIcon color="secondary" />
                  <Typography sx={{ fontWeight: 800 }}>Lectura rápida</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Hoy llegaron {attendedToday} de {totalStudents} estudiantes, con un porcentaje global de {percentage}%.
                </Typography>
              </Stack>
            </Card>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" },
            gap: 3,
          }}
        >
          <Card className="glass-surface lift-on-hover animate-fade-up">
            <CardContent sx={{ display: "grid", gap: 2 }}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <PersonSearchIcon sx={{ color: "secondary.main" }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Historial del estudiante
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Selecciona un estudiante para ver todas sus asistencias.
                  </Typography>
                </Box>
              </Stack>

              <Select
                value={selectedStudentId}
                displayEmpty
                onChange={(e) => setSelectedStudentId(e.target.value)}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="">Selecciona un estudiante</MenuItem>
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name} - {student.courseName} / {student.sectionName} ({student.carne})
                  </MenuItem>
                ))}
              </Select>

              <Divider />

              {historyLoading ? (
                <Stack spacing={1.2}>
                  <Skeleton variant="rounded" height={64} />
                  <Skeleton variant="rounded" height={64} />
                  <Skeleton variant="rounded" height={64} />
                </Stack>
              ) : studentHistory.length ? (
                <Stack spacing={1.2}>
                  {studentHistory.map((item, index) => (
                    <Card key={`${item.session_id}-${index}`} variant="outlined" sx={{ borderRadius: 3, borderColor: "rgba(61,90,128,0.16)" }}>
                      <CardContent sx={{ py: 1.6, display: "grid", gap: 0.8 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                          <Typography sx={{ fontWeight: 800 }}>
                            {item.student_name}
                          </Typography>
                          <Chip label={item.status} color={item.status === "Present" ? "success" : "default"} size="small" />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Curso: {item.course_name} | Sesión #{item.session_id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fecha: {formatDateTime(item.date)}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">Selecciona un estudiante para ver su historial.</Alert>
              )}
            </CardContent>
          </Card>

          <Card className="glass-surface lift-on-hover animate-fade-up" sx={{ animationDelay: "80ms" }}>
            <CardContent sx={{ display: "grid", gap: 2 }}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <CalendarMonthIcon sx={{ color: "primary.main" }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Asistencias de hoy
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Listado de todas las asistencias marcadas hoy.
                  </Typography>
                </Box>
              </Stack>

              <Card className="glass-surface" sx={{ p: 2, bgcolor: "rgba(238,108,77,0.05)" }}>
                <Typography variant="h3" sx={{ fontWeight: 900 }}>
                  {attendedToday}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  asistentes hoy de {totalStudents} estudiantes.
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(percentage, 100)}
                  sx={{ mt: 1.5, height: 10, borderRadius: 999 }}
                />
              </Card>

              <Divider />

              <Stack spacing={1.2} sx={{ maxHeight: 560, overflow: "auto", pr: 0.5 }}>
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} variant="rounded" height={84} />
                  ))
                ) : daily.length ? (
                  daily.map((item, index) => (
                    <Card key={`${item.session_id}-${item.student_id}-${index}`} variant="outlined" sx={{ borderRadius: 3, borderColor: "rgba(41,50,65,0.12)" }}>
                      <CardContent sx={{ py: 1.5, display: "grid", gap: 0.6 }}>
                        <Stack direction="row" justifyContent="space-between" gap={1} alignItems="flex-start">
                          <Box>
                            <Typography sx={{ fontWeight: 800 }}>
                              {item.student_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.course_name} · Sesión #{item.session_id}
                            </Typography>
                          </Box>
                          <Chip label={item.status} color={item.status === "Present" ? "success" : "default"} size="small" />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          Entrada: {formatDateTime(item.check_in_time)}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Alert severity="info">Hoy no hay asistencias registradas.</Alert>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Card className="glass-surface lift-on-hover animate-fade-up">
          <CardContent sx={{ display: "grid", gap: 1.2 }}>
            <Typography sx={{ fontWeight: 800 }}>
              ¿Qué significa este panel?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dashboard: total de estudiantes, asistencia de hoy y porcentaje general. Historial: línea de tiempo por estudiante. Diario: todas las asistencias marcadas en el día con estudiante, sesión y hora.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Ejemplo:</strong> si hoy asistieron 15 de 20 estudiantes, el porcentaje será 75%.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default Reports;
