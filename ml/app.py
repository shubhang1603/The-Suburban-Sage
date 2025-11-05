from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()
sentiment_pipeline = pipeline("sentiment-analysis")

class TextInput(BaseModel):
    text: str

@app.post("/sentiment")
def analyze_sentiment(input: TextInput):
    result = sentiment_pipeline(input.text)[0]
    return {"label": result["label"], "score": result["score"]}
