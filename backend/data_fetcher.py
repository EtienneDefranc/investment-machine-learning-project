import os
import requests
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

TIINGO_API_KEY = os.getenv("TIINGO_API_KEY", "c675ff95f2da75c194dde05dc7e03e529b80b15e") 

def fetch_daily_data(symbol: str) -> pd.DataFrame:
    """
    Fetches daily time series data from Tiingo for a given symbol.
    """
    url = f"https://api.tiingo.com/tiingo/daily/{symbol}/prices"
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Token {TIINGO_API_KEY}'
    }
    
    # Fetch data starting from 2005 to give our ML model plenty of historical data!
    params = {
        "startDate": "2005-01-01" 
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 404:
        raise ValueError(f"Ticker '{symbol}' not found on Tiingo.")
        
    response.raise_for_status()
    data = response.json()
    
    if not data:
         raise ValueError(f"No data returned for '{symbol}'")
         
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # Set the index to the date
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    
    # The dataframe naturally has open, high, low, close, volume. We will use the adjusted ones to account for stock splits.
    df = df[['adjOpen', 'adjHigh', 'adjLow', 'adjClose', 'adjVolume']].copy()
    
    # Rename them back to standard names so ml_model.py doesn't need to change!
    df.rename(columns={
        "adjOpen": "open",
        "adjHigh": "high",
        "adjLow": "low",
        "adjClose": "close",
        "adjVolume": "volume"
    }, inplace=True)
    
    # Ensure they are floats
    df = df.astype(float)
    
    # Sort chronological (oldest first for rolling calculations)
    df.sort_index(ascending=True, inplace=True)
    
    return df
