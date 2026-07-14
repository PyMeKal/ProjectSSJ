import { buildRatioResponse } from "./ratioResponse.js";
import { countMessagesBySender } from "./statsQueryService.js";
import { createBadRequest } from "./validation.js";

export async function getKeywordParticipation(db, query = {}) {
  const keyword = String(query.keyword ?? "").trim();

  if (!keyword) {
    throw createBadRequest("keyword를 입력해 주세요.");
  }

  // Keyword analysis counts messages containing the keyword once per message.
  const rows = await countMessagesBySender(
    db,
    "where message like :keywordPattern escape '\\\\'",
    { keywordPattern: `%${escapeLike(keyword)}%` },
  );

  return buildRatioResponse({
    type: "keyword",
    keyword,
    rows,
  });
}

function escapeLike(value) {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`);
}
