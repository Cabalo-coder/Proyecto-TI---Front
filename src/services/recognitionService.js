import { apiRequest, getToken } from "./api";

// RECONOCER ROSTRO (GENERAL)

export const recognizeFace = async (descriptor) => {
  return apiRequest("/recognition/", {
    method: "POST",
    token: getToken(),
    body: { descriptor },
  });
};


// MARCAR ASISTENCIA (INDIVIDUAL)

export const recognizeAttendance = async (descriptor) => {
  return apiRequest("/attendance/recognize", {
    method: "POST",
    token: getToken(),
    body: { descriptor },
  });
};


// ASISTENCIA GRUPAL (IMAGEN)

export const recognizeGroup = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/group/recognize", {
    method: "POST",
    token: getToken(),
    body: formData,
  });
};