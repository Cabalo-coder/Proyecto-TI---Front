const API_URL = "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("token");

// Crear sesión
export const createSession = async (data) => {
  const res = await fetch(`${API_URL}/sessions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

// Obtener sesiones por curso
export const getSessionsByCourse = async (course_id) => {
  const res = await fetch(`${API_URL}/sessions/course/${course_id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};

export const getAllSessions = async () => {
  const res = await fetch("http://127.0.0.1:8000/sessions/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.json();
};