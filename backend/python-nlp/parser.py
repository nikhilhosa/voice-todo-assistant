import re
import dateparser
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
import pytz
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ParseResult(BaseModel):
    intent: str
    title: str
    dueDate: Optional[str] = None
    reminderAt: Optional[str] = None
    description: Optional[str] = None


class NLPParser:
    def __init__(self):
        self.intents = {
            "create": ["remind", "reminder", "task", "todo", "remember", "schedule", "set"],
            "complete": ["done", "completed", "finish", "finished", "complete"],
            "delete": ["delete", "remove", "cancel"],
        }

    def parse(self, text: str, timezone: str = "UTC", language: str = "en") -> ParseResult:
        """Main parsing method with stronger time extraction"""
        original_text = (text or "").strip()
        text_lower = original_text.lower()

        if not original_text:
            return ParseResult(intent="unknown", title="")

        logger.info(f"Parsing: '{original_text}' (tz: {timezone}, lang: {language})")

        safe_timezone = self._safe_timezone(timezone)
        intent = self._detect_intent(text_lower)

        if intent == "create_task":
            return self._parse_create_task(original_text, safe_timezone, language)
        elif intent == "complete_task":
            return self._parse_complete(original_text)
        elif intent == "delete_task":
            return self._parse_delete(original_text)
        else:
            return ParseResult(intent="unknown", title=original_text[:200], description=original_text)

    def _safe_timezone(self, timezone: str) -> str:
        try:
            pytz.timezone(timezone)
            return timezone
        except Exception:
            logger.warning(f"Invalid timezone '{timezone}', falling back to UTC")
            return "UTC"

    def _detect_intent(self, text: str) -> str:
        create_score = sum(1 for word in self.intents["create"] if word in text)
        complete_score = sum(1 for word in self.intents["complete"] if word in text)
        delete_score = sum(1 for word in self.intents["delete"] if word in text)

        if create_score > 0 and create_score >= complete_score and create_score >= delete_score:
            return "create_task"
        elif complete_score > 0 and complete_score >= delete_score:
            return "complete_task"
        elif delete_score > 0:
            return "delete_task"
        return "unknown"

    def _parse_create_task(self, text: str, timezone: str, language: str) -> ParseResult:
        original_text = text.strip()

        clean_text = re.sub(
            r"^(remind me to|reminder to|remember to|schedule|set)\s+",
            "",
            original_text,
            flags=re.IGNORECASE,
        ).strip()

        tz = pytz.timezone(timezone)
        now = datetime.now(tz)

        parsed_due = None

        # 1) Strong relative-time parsing
        relative_match = re.search(
            r"\bin\s+(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks)\b",
            clean_text,
            flags=re.IGNORECASE,
        )

        if relative_match:
            amount = int(relative_match.group(1))
            unit = relative_match.group(2).lower()

            dt = None
            if unit.startswith("minute"):
                dt = now + timedelta(minutes=amount)
            elif unit.startswith("hour"):
                dt = now + timedelta(hours=amount)
            elif unit.startswith("day"):
                dt = now + timedelta(days=amount)
            elif unit.startswith("week"):
                dt = now + timedelta(weeks=amount)

            if dt:
                parsed_due = dt.astimezone(pytz.UTC).isoformat()
                logger.info(f"Relative time parsed: '{relative_match.group(0)}' -> {parsed_due}")

        # 2) Fallback to dateparser for natural date phrases
        if not parsed_due:
            time_candidates = [
                clean_text,
                original_text,
                re.sub(
                    r"^(remind me to|reminder to|remember to|schedule|set)\s+",
                    "",
                    original_text,
                    flags=re.IGNORECASE,
                ).strip(),
            ]

            for time_str in time_candidates:
                if not time_str:
                    continue

                try:
                    settings = {
                        "TIMEZONE": timezone,
                        "PREFER_DATES_FROM": "future",
                        "RETURN_AS_TIMEZONE_AWARE": True,
                        "RELATIVE_BASE": now,
                    }
                    dt = dateparser.parse(time_str, settings=settings)

                    if dt:
                        if dt.tzinfo is None:
                            dt = tz.localize(dt)

                        if dt > now:
                            parsed_due = dt.astimezone(pytz.UTC).isoformat()
                            logger.info(f"Natural time parsed: '{time_str}' -> {parsed_due}")
                            break
                except Exception as e:
                    logger.debug(f"Time parse failed for '{time_str}': {e}")

        title = re.sub(
            r"\b("
            r"in\s+\d+\s*(minutes?|hours?|days?|weeks?)|"
            r"tomorrow|today|tonight|"
            r"at\s+\d+(?::\d+)?\s*(am|pm)?|"
            r"next\s+\w+|"
            r"on\s+\w+"
            r")\b",
            "",
            clean_text,
            flags=re.IGNORECASE,
        )

        title = re.sub(r"[^\w\s]", " ", title).strip()
        title = " ".join(title.split())[:200]

        if not title:
            title = clean_text[:200] or "Task"

        reminder_at = parsed_due

        return ParseResult(
            intent="create_task",
            title=title,
            dueDate=parsed_due,
            reminderAt=reminder_at,
            description=original_text,
        )

    def _parse_complete(self, text: str) -> ParseResult:
        clean_text = re.sub(
            r"^(mark|marked|task|todo|complete|completed|finish|finished|done)\s+",
            "",
            text.strip(),
            flags=re.IGNORECASE,
        ).strip()

        title = re.sub(r"[^\w\s]", " ", clean_text).strip()
        title = " ".join(title.split())[:200]

        if not title:
            title_words = re.findall(r"\b[a-zA-Z]+\b", text)[:5]
            title = " ".join(title_words)

        return ParseResult(
            intent="complete_task",
            title=title or "Task",
            description=text.strip(),
        )

    def _parse_delete(self, text: str) -> ParseResult:
        clean_text = re.sub(
            r"^(delete|remove|cancel)\s+",
            "",
            text.strip(),
            flags=re.IGNORECASE,
        ).strip()

        title = re.sub(r"[^\w\s]", " ", clean_text).strip()
        title = " ".join(title.split())[:200]

        if not title:
            title_words = re.findall(r"\b[a-zA-Z]+\b", text)[:5]
            title = " ".join(title_words)

        return ParseResult(
            intent="delete_task",
            title=title or "Task",
            description=text.strip(),
        )


parser = NLPParser()
