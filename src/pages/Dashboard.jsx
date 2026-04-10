import DashboardLayout from "../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <h1>Bienvenido al sistema 👋</h1>
      <p>Aquí podrás ver estadísticas y controlar la asistencia.</p>

      <button onClick={() => navigate("/attendance")}>
        Tomar Asistencia
      </button>
    </DashboardLayout>
  );
}

export default Dashboard;