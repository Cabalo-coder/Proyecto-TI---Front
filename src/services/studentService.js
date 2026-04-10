const API_URL = "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("token");

// Crear estudiante
export const createStudent = async (data) => {
  const res = await fetch(`${API_URL}/students/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// Obtener secciones
export const getSections = async () => {
  const res = await fetch(`${API_URL}/sections/`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};