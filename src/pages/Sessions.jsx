import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getCourses } from "../services/courseService";
import {
  createSession,
  getSessionsByCourse,
  getAllSessions
} from "../services/sessionService";

function Sessions() {
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);

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

    const data = {
      course_id: parseInt(courseId),
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
    };

    await createSession(data);

    alert("Clase creada ✅");
    loadSessions(courseId);
  };

  return (
    <DashboardLayout>
      <h1>Sesiones de Clase</h1>

      {/* 🔹 FORM */}
      <form onSubmit={handleCreateSession}>
        <select
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            loadSessions(e.target.value);
          }}
        >
          <option value="">Selecciona un curso</option>
          {courses.map((c) => (
            <option key={c.course_id} value={c.course_id}>
              {c.course_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
        />

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <button type="submit">Crear Sesión</button>
      </form>

      <hr />

      {/* 🔹 LISTA */}
      <h3>Sesiones</h3>

      {sessions.map((s) => (
        <div key={s.session_id}>
          📅 {s.session_date} | 🕒 {s.start_time} - {s.end_time}
        </div>
      ))}
    </DashboardLayout>
  );
}

export default Sessions;