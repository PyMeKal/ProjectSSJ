import { buildRatioResponse } from "./ratioResponse.js";
import { countMessagesBySender } from "./statsQueryService.js";
import { createBadRequest, requireInteger, requirePattern } from "./validation.js";

const TIME_SCOPES = new Set(["day", "month", "year", "all"]);

export async function getTimeParticipation(db, query = {}) {
  const scope = query.scope ?? "all";

  if (!TIME_SCOPES.has(scope)) {
    throw createBadRequest("scope는 day, month, year, all 중 하나여야 합니다.");
  }

  const { whereSql, replacements, period } = buildTimeFilter(scope, query);
  const rows = await countMessagesBySender(db, whereSql, replacements);

  return buildRatioResponse({
    type: "time",
    scope,
    period,
    rows,
  });
}

function buildTimeFilter(scope, query) {
  if (scope === "all") {
    return {
      whereSql: "",
      replacements: {},
      period: { label: "all" },
    };
  }

  if (scope === "day") {
    const date = requirePattern(query.date, /^\d{4}-\d{2}-\d{2}$/, "date는 YYYY-MM-DD 형식이어야 합니다.");

    return {
      whereSql: "where sent_date = :date",
      replacements: { date },
      period: { label: "day", date },
    };
  }

  if (scope === "month") {
    const { year, month } = parseMonthQuery(query);

    return {
      whereSql: "where sent_year = :year and sent_month = :month",
      replacements: { year, month },
      period: { label: "month", year, month },
    };
  }

  const year = requireInteger(query.year, "year를 숫자로 입력해 주세요.");

  return {
    whereSql: "where sent_year = :year",
    replacements: { year },
    period: { label: "year", year },
  };
}

function parseMonthQuery(query) {
  if (query.month && /^\d{4}-\d{2}$/.test(query.month)) {
    const [year, month] = query.month.split("-").map(Number);
    return { year, month };
  }

  return {
    year: requireInteger(query.year, "year를 숫자로 입력해 주세요."),
    month: requireInteger(query.month, "month를 숫자 또는 YYYY-MM 형식으로 입력해 주세요."),
  };
}
