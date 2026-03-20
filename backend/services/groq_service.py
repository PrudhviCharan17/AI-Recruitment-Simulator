import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODELS = {
    "resume": "qwen/qwen3-32b",
    "interview": "qwen/qwen3-32b",
    "gd": "meta-llama/llama-4-scout-17b-16e-instruct",
    "mail": "meta-llama/llama-4-scout-17b-16e-instruct"   # ← add this
}

def chat(model_key: str, messages: list, temperature: float = 0.7) -> str:
    response = client.chat.completions.create(
        model=MODELS[model_key],
        messages=messages,
        temperature=temperature,
        max_tokens=2048,
    )
    return response.choices[0].message.content

def chat_stream(model_key: str, messages: list, temperature: float = 0.7):
    stream = client.chat.completions.create(
        model=MODELS[model_key],
        messages=messages,
        temperature=temperature,
        max_tokens=1024,
        stream=True,
    )
    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
