import { apiRequest, getToken } from "./api";

// Crear sesión
export const createSession = async (data) => {
  return apiRequest("/sessions/", {
    method: "POST",
    token: getToken(),
    body: data,
  });
};

// Obtener sesiones por curso
export const getSessionsByCourse = async (course_id) => {
  return apiRequest(`/sessions/course/${course_id}`, {
    token: getToken(),
  });
};

export const getAllSessions = async () => {
  return apiRequest("/sessions/", {
    token: getToken(),
  });
};