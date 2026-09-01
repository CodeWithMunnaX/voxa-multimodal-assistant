import asyncio
import google.generativeai as genai
genai.configure(api_key='AIzaSyCCu0Zxeh9XlS94BydbM_t-lZCdepVGNN4')
async def test():
  try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = await model.generate_content_async('hi')
    print("Success 1.5-flash:", response.text)
  except Exception as e:
    print("Error:", e)
asyncio.run(test())
