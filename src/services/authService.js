import { apiRequest } from "./api";

export const loginRequest = async (email, password) => {
  return apiRequest("/teachers/login", {
    method: "POST",
    body: { email, password },
  });
};

export const registerRequest = async (name, email, password) => {
  return apiRequest("/teachers/register", {
    method: "POST",
    body: { name, email, password },
  });
};