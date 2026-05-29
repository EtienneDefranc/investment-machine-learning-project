from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from cachetools import TTLCache, cached
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

# Cache up to 100 stock predictions for 12 hours (43200 seconds)
# This prevents re-training the ML model for the same stock multiple times a day
prediction_cache = TTLCache(maxsize=100, ttl=43200)

@cached(cache=prediction_cache)
def get_cached_prediction(symbol: str):
    """
    Core function that fetches data and trains the model.
    Wrapped in a TTLCache so identical calls within 12 hours are instant.
    """
    df = fetch_daily_data(symbol)
    if len(df) < 100:
        raise ValueError(f"Not enough historical data for {symbol} to train the model reliably.")
    return train_and_predict(df)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Investment ML API"}

@app.get("/api/predict")
def predict_stock(symbol: str):
    """
    Returns predictions for 1d, 5d, 7d, and 30d.
    """
    try:
        results = get_cached_prediction(symbol.upper())
        return {
            "symbol": symbol.upper(),
            "status": "success",
            "data": results
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/api/dashboard")
def get_dashboard():
    """
    Fetches the latest predictions for the popular dashboard stocks in one request.
    Since they are cached, this will be lightning fast after the first load of the day!
    """
    popular_stocks = ["AAPL", "TSLA", "NVDA", "MSFT"]
    dashboard_data = {}
    
    for symbol in popular_stocks:
        try:
            res = get_cached_prediction(symbol)
            dashboard_data[symbol] = {
                "current_price": res["current_price"],
                "trend_5d": res["classification_5d"]
            }
        except Exception:
             # If one fails, we just send null so the dashboard doesn't crash completely
            dashboard_data[symbol] = None
            
    return {
        "status": "success",
        "data": dashboard_data
    }

# If running directly (e.g. for testing)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
