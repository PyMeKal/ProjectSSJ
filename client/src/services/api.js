const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export async function getStats() {
  return requestJson("/api/stats", "API 요청 실패");
}

export async function getTimeParticipation(params = {}) {
  return requestJson(`/api/stats/time?${toQueryString(params)}`, "시간별 분석 요청 실패");
}

export async function getKeywordParticipation(keyword) {
  return requestJson(`/api/stats/keyword?${toQueryString({ keyword })}`, "키워드별 분석 요청 실패");
}

export async function getAppRoutes() {
  return requestJson("/api/app-routes", "라우트 요청 실패");
}

async function requestJson(path, fallbackMessage) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message ?? `${fallbackMessage}: ${response.status}`);
  }

  return body;
}

function toQueryString(params) {
  return new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  ).toString();
}
