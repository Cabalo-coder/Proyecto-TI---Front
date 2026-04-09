import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerRequest } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerRequest(form.name, form.email, form.password);

      alert("Registro exitoso 🚀");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h2>Registro de Profesor</h2>

      <form onSubmit={handleRegister}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;