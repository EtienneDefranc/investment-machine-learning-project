from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from data_fetcher import fetch_daily_data
from ml_model import train_and_predict

app = FastAPI(title="Investment ML API")

# Allow CORS for local development and Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this to the Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Investment ML API"}

@app.get("/api/predict")
def predict_stock(symbol: str):
    """
    Fetches data for the given symbol, trains the model on the fly, 
    and returns predictions for 1d, 5d, 7d, and 30d.
    """
    try:
        # Fetch Data
        df = fetch_daily_data(symbol)
        
        if len(df) < 100:
            raise HTTPException(status_code=400, detail="Not enough historical data to train the model reliably.")
            
        # Train and Predict
        results = train_and_predict(df)
        
        return {
            "symbol": symbol.upper(),
            "status": "success",
            "data": results
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# If running directly (e.g. for testing)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
