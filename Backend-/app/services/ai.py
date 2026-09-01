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

class AIService:
    def __init__(self):
        self.model = "gpt-3.5-turbo" # Using gpt-3.5-turbo for speed and cost
        
    def _get_client(self):
        # Reload settings dynamically to catch .env updates
        from app.core.config import Settings
        current_settings = Settings()
        if not current_settings.OPENAI_API_KEY:
            raise HTTPException(status_code=500, detail="OpenAI API Key is missing. Cannot generate AI response.")
        import httpx
        return AsyncOpenAI(
            api_key=current_settings.OPENAI_API_KEY,
            http_client=httpx.AsyncClient(verify=False)
        )

    async def generate_response(self, user_message: str, chat_history: list = None, max_retries=3, system_prompt: str = None) -> str:
        client = self._get_client()
            
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
            try:
                response = await client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=2048,
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.warning(f"OpenAI API attempt {attempt + 1} failed: {e}")
                if attempt == max_retries - 1:
                    logger.error(f"OpenAI API error after {max_retries} attempts: {e}")
                    raise HTTPException(status_code=500, detail="AI generation failed due to quota or timeout issues.")
                await asyncio.sleep(2 ** attempt)  # Exponential backoff

ai_service = AIService()
