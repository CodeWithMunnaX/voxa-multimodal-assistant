import logging
import asyncio
from google import genai
from google.genai import types
from fastapi import HTTPException
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

SYSTEM_PROMPT = """
You are Voxa AI, a premium, SaaS-grade AI assistant. Your goal is to provide world-class, accurate, and highly structured responses. 
Always maintain a professional, helpful, and concise tone. When writing code, use best practices. When explaining concepts, use clear formatting (Markdown, bullet points).
Do not break character. Do not mention that you are an AI unless explicitly asked.
"""

class GeminiService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        else:
            self.client = None

    async def generate_response(self, user_message: str, chat_history: list = None, max_retries=3) -> str:
        if not self.client:
            raise HTTPException(status_code=500, detail="Gemini API Key is missing. Cannot generate AI response.")
            
        # Construct conversation history
        contents = []
        if chat_history:
            for msg in chat_history:
                # Map 'assistant' back to 'model' for Gemini
                role = "model" if msg.role == "assistant" else "user"
                contents.append({"role": role, "parts": [{"text": msg.content}]})
        
        # Add the current message
        contents.append({"role": "user", "parts": [{"text": user_message}]})
        
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.7,
            max_output_tokens=2048,
        )
        
        for attempt in range(max_retries):
            try:
                response = await self.client.aio.models.generate_content(
                    model='gemini-3.5-flash',
                    contents=contents,
                    config=config
                )
                return response.text
            except Exception as e:
                logger.warning(f"Gemini API attempt {attempt + 1} failed: {e}")
                if attempt == max_retries - 1:
                    logger.error(f"Gemini API error after {max_retries} attempts: {e}")
                    raise HTTPException(status_code=500, detail="AI generation failed due to quota or timeout issues.")
                await asyncio.sleep(2 ** attempt)  # Exponential backoff

gemini_service = GeminiService()
