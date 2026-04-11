export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const getToken = () => localStorage.getItem("token");

export const apiRequest = async (path, options = {}) => {
	const {
		method = "GET",
		body,
		token,
		headers = {},
	} = options;

	const isFormData = body instanceof FormData;

	const requestHeaders = {
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(!isFormData && body ? { "Content-Type": "application/json" } : {}),
		...headers,
	};

	const res = await fetch(`${API_URL}${path}`, {
		method,
		headers: requestHeaders,
		body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
	});

	const contentType = res.headers.get("content-type") || "";
	const isJson = contentType.includes("application/json");
	const data = isJson ? await res.json() : null;

	if (!res.ok || data?.error) {
		const message =
			data?.detail || data?.error || `Request failed with status ${res.status}`;
		throw new Error(message);
	}

	return data;
};
