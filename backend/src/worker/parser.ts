import chrono from "chrono-node";

export interface ParsedVoiceResult {
  title: string;
  reminderAt?: Date;
}

export function parseVoiceText(text: string): ParsedVoiceResult {

  let cleaned = text.toLowerCase();

  cleaned = cleaned
    .replace("remind me to", "")
    .replace("remember to", "")
    .replace("please", "")
    .trim();

  const results = chrono.parse(cleaned);

  let reminder: Date | undefined;

  if (results.length > 0) {

    const result = results[0];

    reminder = result.start.date();

    // Remove detected date phrase from title
    cleaned =
      cleaned.slice(0, result.index) +
      cleaned.slice(result.index + result.text.length);

    cleaned = cleaned.trim();
  }

  if (!cleaned || cleaned.length < 2) {
    cleaned = "Untitled task";
  }

  return {
    title: cleaned,
    reminderAt: reminder
  };
}


