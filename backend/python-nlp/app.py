from fastapi import FastAPI
from pydantic import BaseModel

from parser import parse_voice_command

app = FastAPI()


class VoiceInput(BaseModel):
    text: str
    timezone: str = "UTC"


@app.post("/parse")
async def parse_voice(data: VoiceInput):

    result = parse_voice_command(data.text, data.timezone)

    return result
