from google import genai
client = genai.Client(api_key='AIzaSyCCu0Zxeh9XlS94BydbM_t-lZCdepVGNN4')
try:
    response = client.models.generate_content(model='gemini-3.5-flash', contents='what is a machine?')
    print("Success 3.5-flash genai:", response.text)
except Exception as e:
    print("Error:", e)
