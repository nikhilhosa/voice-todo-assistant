import chrono from "chrono-node"

export interface DateParseResult {
  dueDate?: Date
  reminderAt?: Date
  cleanedText: string
}

export function parseDateTime(text: string): DateParseResult {

  const results = chrono.parse(text)

  if (!results.length) {
    return {
      cleanedText: text
    }
  }

  const result = results[0]

  const date = result.start.date()

  const start = result.index
  const end = start + result.text.length

  const cleanedText =
    text.slice(0, start) + text.slice(end)

  return {
    dueDate: date,
    reminderAt: date,
    cleanedText: cleanedText.trim()
  }
}
