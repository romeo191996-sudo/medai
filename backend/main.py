from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("No GEMINI_API_KEY found in .env file")

client = genai.Client(api_key=api_key)

app = FastAPI(title="MedAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://frontend-nine-peach-88.vercel.app" # <-- Replace with your real Vercel URL
], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MedicineRequest(BaseModel):
    medicine_name: str
    language: str = "en"

@app.get("/")
def read_root():
    return {"message": "MedAI Backend is running!"}

@app.post("/api/search")
async def search_medicine(request: MedicineRequest):
    prompt = f"""
    You are a medical AI assistant. The user is asking about the medicine: "{request.medicine_name}".
    
    Provide a detailed, accurate, and easy-to-understand explanation of this medicine.
    You must structure your response exactly like this:
    USES: (Explain what it is used for)
    SIDE_EFFECTS: (List the common side effects)
    WARNINGS: (List important warnings or who should not take it)
    
    Important: 
    1. Do not include any other text or formatting, just the three sections above.
    2. Respond ONLY in the language code: {request.language}. If 'am', respond in Amharic. If 'en', respond in English.
    """
    
       # Swapped the order! 3.5 is working great right now, so we try it first.
    models_to_try = ['gemini-3.5-flash-lite', 'gemini-3.8-flash']
    
    for model_name in models_to_try:
        try:
            print(f"Trying model: {model_name}...")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            print(f"Success with {model_name}!")
            return {"result": response.text}
            
        except Exception as e:
            print(f"Model {model_name} failed: {str(e)}")
            # If this was the last model in the list, we raise the error
            if model_name == models_to_try[-1]:
                raise HTTPException(status_code=500, detail="All AI models are currently busy. Please try again in a minute.")
            # Otherwise, the loop continues to the next model

    # Fallback if the loop somehow finishes without returning
    raise HTTPException(status_code=500, detail="Failed to get a response from AI.")
