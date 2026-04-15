import { apiRequest, getToken } from "./api";

export const getDashboardReport = async () => {
  return apiRequest("/reports/dashboard", {
    token: getToken(),
  });
};

export const getStudentHistoryReport = async (student_id) => {
  return apiRequest(`/reports/student/${student_id}`, {
    token: getToken(),
  });
};

export const getDailyReport = async () => {
  return apiRequest("/reports/daily", {
    token: getToken(),
  });
};
