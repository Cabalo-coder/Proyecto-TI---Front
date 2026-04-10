import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "220px",
        height: "100vh",
        background: "#1e293b",
        color: "white",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Sistema</h2>

      <p style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
        Dashboard
      </p>

      <p style={{ cursor: "pointer" }} onClick={() => navigate("/attendance")}>
        Asistencia
      </p>

      <p style={{ cursor: "pointer" }} onClick={() => navigate("/reports")}>
        Reportes
      </p>

      <p style={{ cursor: "pointer" }} onClick={() => navigate("/courses")}>
        Cursos
      </p>

      <p style={{ cursor: "pointer" }} onClick={() => navigate("/sessions")}>
        Sesiones
      </p>

      <p style={{ cursor: "pointer" }} onClick={() => navigate("/students")}>
        Estudiantes
      </p>

    </div>
  );
}

export default Sidebar;