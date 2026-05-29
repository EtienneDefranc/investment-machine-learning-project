import os
import requests
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "6WBC1LZRG04WO6CB") # Defaulting to the provided one

def fetch_daily_data(symbol: str, outputsize: str = "compact") -> pd.DataFrame:
    """
    Fetches daily time series data from Alpha Vantage for a given symbol.
    """
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "outputsize": outputsize,
        "apikey": ALPHA_VANTAGE_API_KEY,
        "datatype": "json"
    }
    
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()
    
    key = "Time Series (Daily)"
    if key not in data:
        if "Information" in data:
            raise ValueError(f"API Rate limit or Information message: {data['Information']}")
        elif "Error Message" in data:
            raise ValueError(f"API Error: {data['Error Message']}")
        else:
            raise ValueError(f"Unexpected API response: {data}")
            
    ts_data = data[key]
    
    # Convert to DataFrame
    df = pd.DataFrame.from_dict(ts_data, orient="index")
    df.index = pd.to_datetime(df.index)
    df = df.astype(float)
    
    # Rename columns to be more accessible
    df.rename(columns={
        "1. open": "open",
        "2. high": "high",
        "3. low": "low",
        "4. close": "close",
        "5. volume": "volume"
    }, inplace=True)
    
    # Sort chronological (oldest first for rolling calculations)
    df.sort_index(ascending=True, inplace=True)
    
    return df
