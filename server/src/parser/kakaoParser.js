const IOS_LINE_PATTERN = /^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.\s*(오전|오후)\s*(\d{1,2}):(\d{2}),\s*(.+?)\s*:\s*([\s\S]*)$/;
const ANDROID_DATE_PATTERN = /^-+\s*(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일.*-+$/;
const ANDROID_LINE_PATTERN = /^\[(.+?)\]\s*\[(오전|오후)\s*(\d{1,2}):(\d{2})\]\s*([\s\S]*)$/;

export function parseKakaoText(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  const messages = [];
  let currentDate = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) continue;

    const androidDateMatch = line.match(ANDROID_DATE_PATTERN);
    if (androidDateMatch) {
      currentDate = toDateString(androidDateMatch[1], androidDateMatch[2], androidDateMatch[3]);
      continue;
    }

    const iosMessage = parseIosLine(line);
    if (iosMessage) {
      messages.push(iosMessage);
      continue;
    }

    const androidMessage = currentDate ? parseAndroidLine(line, currentDate) : null;
    if (androidMessage) {
      messages.push(androidMessage);
      continue;
    }

    appendContinuation(messages, line);
  }

  return messages;
}

function parseIosLine(line) {
  const match = line.match(IOS_LINE_PATTERN);
  if (!match) return null;

  const [, year, month, day, meridiem, hour, minute, sender, message] = match;
  return createMessage({
    date: toDateString(year, month, day),
    meridiem,
    hour,
    minute,
    sender,
    message,
  });
}

function parseAndroidLine(line, currentDate) {
  const match = line.match(ANDROID_LINE_PATTERN);
  if (!match) return null;

  const [, sender, meridiem, hour, minute, message] = match;
  return createMessage({
    date: currentDate,
    meridiem,
    hour,
    minute,
    sender,
    message,
  });
}

function createMessage({ date, meridiem, hour, minute, sender, message }) {
  const sentHour = to24Hour(meridiem, Number(hour));
  const sentAt = `${date} ${String(sentHour).padStart(2, "0")}:${minute}:00`;

  return {
    sentAt,
    sentDate: date,
    sentHour,
    sender: sender.trim(),
    message: message.trim(),
  };
}

function appendContinuation(messages, line) {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) return;

  lastMessage.message = `${lastMessage.message}\n${line.trim()}`.trim();
}

function toDateString(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function to24Hour(meridiem, hour) {
  if (meridiem === "오전") return hour === 12 ? 0 : hour;
  return hour === 12 ? 12 : hour + 12;
}
