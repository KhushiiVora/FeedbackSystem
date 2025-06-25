const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function request(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });

  if (response.status === 401) {
    throw new Error(response.status);
  }
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "An API error occurred");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return await response.json();
  }

  return response;
}
