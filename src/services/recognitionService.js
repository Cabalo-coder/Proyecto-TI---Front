const API_URL = "http://127.0.0.1:8000";

// RECONOCER ROSTRO (GENERAL)

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


// MARCAR ASISTENCIA (INDIVIDUAL)

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


// ASISTENCIA GRUPAL (IMAGEN)

export const recognizeGroup = async (file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/group/recognize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, 
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.detail || "Error en reconocimiento grupal");

  return data;
};