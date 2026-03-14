import spacy
import dateparser

nlp = spacy.load("en_core_web_sm")

def parse_voice_command(text: str):

    cleaned = text.lower()

    for phrase in [
        "remind me to",
        "remember to",
        "please",
        "todo"
    ]:
        cleaned = cleaned.replace(phrase, "")

    cleaned = cleaned.strip()

    doc = nlp(cleaned)

    title_tokens = []
    detected_date = None

    for token in doc:

        parsed_date = dateparser.parse(token.text)

        if parsed_date:
            detected_date = parsed_date
        else:
            title_tokens.append(token.text)

    title = " ".join(title_tokens).strip()

    if not title:
        title = "Untitled task"

    return {
        "title": title,
        "datetime": detected_date
    }
