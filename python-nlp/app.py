from fastapi import FastAPI
from pydantic import BaseModel
from nlp_engine import parse_voice_command

app = FastAPI()

class VoiceInput(BaseModel):
    text: str

@app.post("/parse")
def parse_command(data: VoiceInput):

    result = parse_voice_command(data.text)

    return result
