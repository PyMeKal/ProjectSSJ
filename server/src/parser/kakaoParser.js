import { parse } from "kakaotalk-chat-parser";

const KST_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function parseKakaoText(text) {
  let chatRoom;

  try {
    chatRoom = parse([text]);
  } catch (error) {
    throw new Error(`카카오톡 txt 파싱 실패: ${error.message}`);
  }

  // The library also returns system messages. We only import real user messages into Text.
  const userMessages = chatRoom.messages.filter((message) => message.type !== "system" && message.sender);

  return mergeBackdatedMessages(userMessages)
    .map(toImportRow);
}

function mergeBackdatedMessages(messages) {
  const merged = [];

  for (const message of messages) {
    const previous = merged.at(-1);

    if (previous && message.timestamp < previous.timestamp) {
      // If a later line has an older timestamp, treat it as pasted old chat text.
      // Keep the previous message's current timestamp and append the old-looking line to its content.
      previous.content = `${previous.content}\n${formatOriginalMessageLine(message)}`;
      continue;
    }

    merged.push({ ...message });
  }

  return merged;
}

function toImportRow(message) {
  // kakaotalk-chat-parser returns timestamps as UTC Date objects representing KST text times.
  // Convert them back to Korea local fields before saving to MySQL.
  const { year, month, day, hour, minute, second } = getKstParts(message.timestamp);
  const sentDate = `${year}-${month}-${day}`;
  const sentTime = `${hour}:${minute}:${second}`;

  return {
    sentAt: `${sentDate} ${sentTime}`,
    sentDate,
    sentYear: Number(year),
    sentMonth: Number(month),
    sentDay: Number(day),
    sentTime,
    sentHour: Number(hour),
    sender: message.sender.trim(),
    message: message.content.trim(),
  };
}

function formatOriginalMessageLine(message) {
  const { year, month, day, hour, minute } = getKstParts(message.timestamp);

  return `${year}-${month}-${day} ${hour}:${minute}, ` +
    `${message.sender.trim()} : ${message.content.trim()}`;
}

function getKstParts(date) {
  const parts = KST_FORMATTER.formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
}
