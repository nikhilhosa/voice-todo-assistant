import re
import dateparser
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from pydantic import BaseModel
import pytz
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ParseResult(BaseModel):
    intent: str
    title: str
    dueDate: Optional[str] = None  # ISO8601 UTC
    reminderAt: Optional[str] = None  # ISO8601 UTC
    description: Optional[str] = None

class NLPParser:
    def __init__(self):
        self.intents = {
            'create': ['remind', 'reminder', 'task', 'todo', 'remember', 'schedule', 'set'],
            'complete': ['done', 'completed', 'finish', 'finished', 'complete'],
            'delete': ['delete', 'remove', 'cancel']
        }

    def parse(self, text: str, timezone: str = "UTC", language: str = "en") -> ParseResult:
        """Main parsing method with comprehensive time extraction"""
        text_lower = text.lower().strip()
        logger.info(f"Parsing: '{text}' (tz: {timezone})")

        intent = self._detect_intent(text_lower)

        if intent == 'create_task':
            return self._parse_create_task(text_lower, timezone, language)
        elif intent == 'complete_task':
            return self._parse_complete(text_lower)
        elif intent == 'delete_task':
            return self._parse_delete(text_lower)
        else:
            return ParseResult(intent="unknown", title=text[:200])

    def _detect_intent(self, text: str) -> str:
        """Detect intent using keyword matching"""
        create_score = sum(1 for word in self.intents['create'] if word in text)
        complete_score = sum(1 for word in self.intents['complete'] if word in text)
        delete_score = sum(1 for word in self.intents['delete'] if word in text)

        if create_score > 0 and create_score >= complete_score:
            return 'create_task'
        elif complete_score > 0:
            return 'complete_task'
        elif delete_score > 0:
            return 'delete_task'
        return 'unknown'

    def _parse_create_task(self, text: str, timezone: str, language: str) -> ParseResult:
        """Extract task details with robust time parsing"""
        # Remove common prefixes to improve parsing
        clean_text = re.sub(r'^(remind me to|reminder to|remember to|schedule|set) ', '', text, flags=re.IGNORECASE)

        # Extract title (remove time expressions)
        time_patterns = r'\b(in\s+\d+\s*(minutes?|hours?|days?|weeks?)|tomorrow|today|tonight|at\s+\d+|on\s+\w+|next\s+\w+)\b'
        title_match = re.sub(time_patterns, '', clean_text, flags=re.IGNORECASE)
        title = re.sub(r'[^\w\s]', ' ', title_match).strip()
        title = ' '.join(title.split())[:200]  # Clean and truncate

        if not title:
            title = clean_text[:200]

        # Parse time with multiple strategies
        tz = pytz.timezone(timezone)
        now = datetime.now(tz)

        time_strs = [
            clean_text,
            text,  # Original text as fallback
            re.sub(r'remind(er)? me? to?', '', text),  # Remove remind phrases
        ]

        parsed_due = None
        for time_str in time_strs:
            try:
                settings = {
                    'TIMEZONE': timezone,
                    'PREFER_DATES_FROM': 'future',
                    'RETURN_AS_TIMEZONE_AWARE': True,
                    'RELATIVE_BASE': now
                }
                dt = dateparser.parse(time_str, settings=settings)

                if dt and dt > now:
                    dt_utc = dt.astimezone(pytz.UTC)
                    parsed_due = dt_utc.isoformat()
                    logger.info(f"Parsed time: '{time_str}' -> {parsed_due}")
                    break
            except Exception as e:
                logger.debug(f"Time parse failed for '{time_str}': {e}")
                continue

        # reminderAt defaults to dueDate (scheduler handles offsets)
        reminder_at = parsed_due

        return ParseResult(
            intent='create_task',
            title=title or "Task",
            dueDate=parsed_due,
            reminderAt=reminder_at,
            description=text
        )

    def _parse_complete(self, text: str) -> ParseResult:
        title_words = re.findall(r'\b[a-zA-Z]+\b', text)[:5]
        title = ' '.join(title_words)
        return ParseResult(intent='complete_task', title=title)

    def _parse_delete(self, text: str) -> ParseResult:
        title_words = re.findall(r'\b[a-zA-Z]+\b', text)[:5]
        title = ' '.join(title_words)
        return ParseResult(intent='delete_task', title=title)

parser = NLPParser()
