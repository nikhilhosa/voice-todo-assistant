export function parseVoiceText(text: string) {

  let cleaned = text.toLowerCase();

  cleaned = cleaned
    .replace("remind me to", "")
    .replace("remember to", "")
    .replace("don't forget to", "")
    .trim();

  return {
    title: cleaned
  };
}
