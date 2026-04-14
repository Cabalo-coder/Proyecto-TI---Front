export const API_URL = import.meta.env.VITE_API_URL || "/api";

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
	let data = null;
	let textBody = "";

	if (isJson) {
		try {
			data = await res.json();
		} catch {
			data = null;
		}
	} else {
		try {
			textBody = await res.text();
		} catch {
			textBody = "";
		}
	}

	if (!res.ok || data?.error) {
		let detail = data?.detail || data?.error || textBody;

		if (Array.isArray(detail)) {
			detail = detail.map((item) => item?.msg || JSON.stringify(item)).join(" | ");
		}

		const message =
			detail || `${res.status} ${res.statusText}: request failed on ${path}`;
		throw new Error(message);
	}

	return data;
};
