import chrono from "chrono-node";

export interface ParsedVoiceResult {
  title: string;
  reminderAt?: Date;
}

export function parseVoiceText(text: string): ParsedVoiceResult {
  let cleaned = text.toLowerCase().trim();

  cleaned = cleaned
    .replace(/^remind me to\s+/i, "")
    .replace(/^remember to\s+/i, "")
    .replace(/^please\s+/i, "")
    .trim();

  const results = chrono.parse(cleaned);
  let reminderAt: Date | undefined;

  if (results.length > 0) {
    const result = results[0];
    reminderAt = result.start.date();

    cleaned =
      cleaned.slice(0, result.index) +
      cleaned.slice(result.index + result.text.length);

    cleaned = cleaned
      .replace(/\s+/g, " ")
      .replace(/\b(at|on|by|for|tomorrow|today|next)\b\s*$/i, "")
      .trim();
  }

  if (!cleaned || cleaned.length < 2) {
    cleaned = "Untitled task";
  }

  return {
    title: cleaned,
    reminderAt
  };
}
