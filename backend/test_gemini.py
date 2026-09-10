import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

print("Key starts with:", os.environ.get("GEMINI_API_KEY", "")[:5])

try:
    client = genai.Client()
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents='hello'
    )
    print("Success:", response.text)
except Exception as e:
    print("Error:", e)
