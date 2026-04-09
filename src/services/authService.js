const API_URL = "http://127.0.0.1:8000";

export const loginRequest = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/teachers/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Error en login");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const registerRequest = async (name, email, password) => {
  try {
    const res = await fetch(`${API_URL}/teachers/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Error en registro");
    }

    return data;
  } catch (error) {
    throw error;
  }
};