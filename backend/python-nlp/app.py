from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
from parser import parser, ParseResult
import logging

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Voice NLP Parser", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VoiceInput(BaseModel):
    text: str
    timezone: Optional[str] = "UTC"
    language: Optional[str] = "en"

@app.post("/parse", response_model=ParseResult)
async def parse_voice(input: VoiceInput):
    try:
        result = parser.parse(input.text, input.timezone, input.language)
        logger.info(f"✅ Parsed: '{input.text}' -> {result.intent} '{result.title}'")
        return result
    except Exception as e:
        logger.error(f"❌ Parse error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy", "parser": "ready"}

@app.get("/")
async def root():
    return {"message": "Voice NLP Parser is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)


