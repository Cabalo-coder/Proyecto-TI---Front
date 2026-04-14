import { apiRequest, getToken } from "./api";

// Crear estudiante
export const createStudent = async (data) => {
  return apiRequest("/students/", {
    method: "POST",
    token: getToken(),
    body: data,
  });
};

// Obtener secciones
export const getSections = async () => {
  return apiRequest("/sections/", {
    token: getToken(),
  });
};

export const getTeacherStructure = async () => {
  return apiRequest("/students/my-structure", {
    token: getToken(),
  });
};