import asyncio
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

api_key = "AIzaSyCCu0Zxeh9XlS94BydbM_t-lZCdepVGNN4"
genai.configure(api_key=api_key)

SYSTEM_PROMPT = """
You are Voxa AI.
"""

async def test():
    try:
        model = genai.GenerativeModel('gemini-3.5-flash', system_instruction=SYSTEM_PROMPT)
        contents = [
            {"role": "user", "parts": ["what is a machine?"]},
            {"role": "user", "parts": ["what is a machine?"]}
        ]
        
        response = await model.generate_content_async(
            contents,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=2048,
            )
        )
        print("Success! Response:", response.text)
    except Exception as e:
        print("Error during generation:", str(e))

asyncio.run(test())
