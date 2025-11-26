from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

# Initialize app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
sentiment_pipeline = pipeline("sentiment-analysis")

# Define input schema
class TextInput(BaseModel):
    text: str


# Main sentiment endpoint
@app.post("/sentiment")
def analyze_sentiment(input: TextInput):
    result = sentiment_pipeline(input.text)[0]
    return {"label": result["label"], "score": result["score"]}
