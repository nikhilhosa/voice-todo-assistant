import dateparser
import pytz
import re


def detect_intent(text):

    text = text.lower()

    if text.startswith("mark") and "done" in text:
        return "complete_task"

    if text.startswith("delete") or text.startswith("remove"):
        return "delete_task"

    if text.startswith("move") or text.startswith("reschedule"):
        return "update_task"

    return "create_task"


def extract_title(text):

    text = text.lower()

    remove_words = [
        "remind me to",
        "remember to",
        "please",
        "i need to",
        "mark",
        "done",
        "delete",
        "remove",
        "move",
        "reschedule"
    ]

    for w in remove_words:
        text = text.replace(w, "")

    return text.strip()


def extract_datetime(text, timezone):

    settings = {
        "TIMEZONE": timezone,
        "RETURN_AS_TIMEZONE_AWARE": True
    }

    parsed = dateparser.parse(text, settings=settings)

    if not parsed:
        return None

    utc_time = parsed.astimezone(pytz.UTC)

    return utc_time.isoformat()


def parse_voice_command(text, timezone):

    intent = detect_intent(text)

    title = extract_title(text)

    dt = extract_datetime(text, timezone)

    return {
        "intent": intent,
        "title": title,
        "dueDate": dt,
        "reminderAt": dt
    }
