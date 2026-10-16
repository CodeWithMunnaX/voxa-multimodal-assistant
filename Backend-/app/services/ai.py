import logging
import asyncio
from openai import AsyncOpenAI
from fastapi import HTTPException
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

SYSTEM_PROMPT = """
You are Voxa AI, a premium, SaaS-grade AI assistant. Your goal is to provide world-class, accurate, and highly structured responses. 
Always maintain a professional, helpful, and concise tone. When writing code, use best practices. When explaining concepts, use clear formatting (Markdown, bullet points).
Do not break character. Do not mention that you are an AI unless explicitly asked.
"""

OPENAI_MODELS = ["gpt-3.5-turbo"]
# Gemini exposes an OpenAI-compatible endpoint, so the same client works with a free Gemini key
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
GEMINI_MODELS = ["gemini-2.5-flash", "gemini-3.5-flash"]


class AIService:
    def _get_client(self) -> tuple[AsyncOpenAI, list[str]]:
        # Reload settings dynamically to catch .env updates
        from app.core.config import Settings
        current_settings = Settings()
        if current_settings.OPENAI_API_KEY:
            return AsyncOpenAI(api_key=current_settings.OPENAI_API_KEY), OPENAI_MODELS
        if current_settings.GEMINI_API_KEY:
            return AsyncOpenAI(api_key=current_settings.GEMINI_API_KEY, base_url=GEMINI_BASE_URL), GEMINI_MODELS
        raise HTTPException(status_code=500, detail="No AI API key configured (set GEMINI_API_KEY or OPENAI_API_KEY).")

    async def generate_response(self, user_message: str, chat_history: list = None, max_retries=3, system_prompt: str = None) -> str:
        client, models = self._get_client()

        # Construct conversation history
        sys_prompt = system_prompt if system_prompt else SYSTEM_PROMPT
        messages = [{"role": "system", "content": sys_prompt}]
        
        if chat_history:
            for msg in chat_history:
                role = "assistant" if msg.role == "assistant" else "user"
                messages.append({"role": role, "content": msg.content})
        
        # Add the current message
        messages.append({"role": "user", "content": user_message})
        
        for attempt in range(max_retries):
            # Rotate models on retry so a busy model (503/429) falls back to the next one
            model = models[attempt % len(models)]
            try:
                response = await client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=2048,
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.warning(f"AI API attempt {attempt + 1} ({model}) failed: {e}")
                if attempt == max_retries - 1:
                    logger.error(f"AI API error after {max_retries} attempts: {e}")
                    raise HTTPException(status_code=500, detail="AI generation failed due to quota or timeout issues.")
                await asyncio.sleep(2 ** attempt)  # Exponential backoff

ai_service = AIService()
