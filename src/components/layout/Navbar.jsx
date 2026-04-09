import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { logout } = useAuth();

  return (
    <div
      style={{
        height: "60px",
        background: "#f1f5f9",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <h3>Dashboard</h3>

      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}

export default Navbar;