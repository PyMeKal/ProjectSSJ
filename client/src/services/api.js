const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export async function getStats() {
  const response = await fetch(`${API_BASE_URL}/api/stats`);

  return parseJsonResponse(response, "API 요청 실패");
}

export async function getTimeParticipation(params = {}) {
  const response = await fetch(`${API_BASE_URL}/api/stats/time?${toQueryString(params)}`);

  return parseJsonResponse(response, "시간별 분석 요청 실패");
}

export async function getKeywordParticipation(keyword) {
  const response = await fetch(`${API_BASE_URL}/api/stats/keyword?${toQueryString({ keyword })}`);

  return parseJsonResponse(response, "키워드별 분석 요청 실패");
}

export async function getAppRoutes() {
  const response = await fetch(`${API_BASE_URL}/api/app-routes`);

  return parseJsonResponse(response, "라우트 요청 실패");
}

function toQueryString(params) {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== ""),
  ).toString();
}

async function parseJsonResponse(response, fallbackMessage) {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message ?? `${fallbackMessage}: ${response.status}`);
  }

  return body;
}
