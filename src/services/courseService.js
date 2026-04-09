const API_URL = "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("token");

// Obtener cursos del profesor
export const getCourses = async () => {
  const res = await fetch(`${API_URL}/courses/`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};

// Crear curso
export const createCourse = async (course_name) => {
  const res = await fetch(`${API_URL}/courses/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ course_name }),
  });

  return res.json();
};

// Crear sección
export const createSection = async (section_name, course_id) => {
  const res = await fetch(`${API_URL}/sections/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ section_name, course_id }),
  });

  return res.json();
};

export const getSectionsByCourse = async (course_id) => {
  const res = await fetch(`http://127.0.0.1:8000/sections/course/${course_id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return res.json();
};