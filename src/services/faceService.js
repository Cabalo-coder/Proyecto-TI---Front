const API_URL = "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("token");

// Subir imagen
export const uploadFace = async (student_id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${API_URL}/faces/upload?student_id=${student_id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    }
  );

  return res.json();
};