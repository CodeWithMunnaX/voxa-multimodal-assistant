import asyncio
from google import genai
from google.genai import types

async def test():
    client = genai.Client(api_key='AIzaSyCCu0Zxeh9XlS94BydbM_t-lZCdepVGNN4')
    
    contents = [
        {"role": "user", "parts": [{"text": "Hello"}]},
        {"role": "model", "parts": [{"text": "Hi there!"}]},
        {"role": "user", "parts": [{"text": "What is a machine?"}]}
    ]
    
    config = types.GenerateContentConfig(
        system_instruction="You are an AI",
        temperature=0.7,
        max_output_tokens=2048,
    )
    
    response = await client.aio.models.generate_content(
        model='gemini-3.5-flash',
        contents=contents,
        config=config
    )
    print("Success:", response.text)

asyncio.run(test())
