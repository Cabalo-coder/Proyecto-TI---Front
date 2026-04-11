import { apiRequest, getToken } from "./api";

// Subir imagen
export const uploadFace = async (student_id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest(`/faces/upload?student_id=${student_id}`, {
    method: "POST",
    token: getToken(),
    body: formData,
  });
};