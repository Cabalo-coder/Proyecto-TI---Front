import { apiRequest, getToken } from "./api";

// Obtener cursos del profesor
export const getCourses = async () => {
  return apiRequest("/courses/", {
    token: getToken(),
  });
};

// Crear curso
export const createCourse = async (course_name) => {
  return apiRequest("/courses/", {
    method: "POST",
    token: getToken(),
    body: { course_name },
  });
};

// Crear sección
export const createSection = async (section_name, course_id) => {
  return apiRequest("/sections/", {
    method: "POST",
    token: getToken(),
    body: { section_name, course_id },
  });
};

export const getSectionsByCourse = async (course_id) => {
  return apiRequest(`/sections/course/${course_id}`, {
    token: getToken(),
  });
};