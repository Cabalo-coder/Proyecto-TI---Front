const API_URL = "http://127.0.0.1:8000";

// 🔍 reconocer rostro
export const recognizeFace = async (descriptor) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/recognition/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ descriptor }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.detail || "Error en reconocimiento");

  return data;
};

// ✅ marcar asistencia
export const recognizeAttendance = async (descriptor) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/attendance/recognize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ descriptor }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.detail || "Error en asistencia");

  return data;
};