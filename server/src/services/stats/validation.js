export function requirePattern(value, pattern, message) {
  const text = String(value ?? "").trim();

  if (!pattern.test(text)) {
    throw createBadRequest(message);
  }

  return text;
}

export function requireInteger(value, message) {
  const number = Number(value);

  if (!Number.isInteger(number)) {
    throw createBadRequest(message);
  }

  return number;
}

export function createBadRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}
