import requests
import json
from datetime import datetime
from flask import Flask, jsonify
import subprocess
import sys
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache

app = Flask(__name__)

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

def process_prices(price_list):
    output = []
    for item in price_list:
        total_price = (
            item["marketPrice"] +
            item["marketPriceTax"] +
            item["sourcingMarkupPrice"] +
            item["energyTaxPrice"]
        )
        output.append({
            "from": item["from"],
            "till": item["till"],
            "marketPrice": item["marketPrice"],
            "marketPriceTax": item["marketPriceTax"],
            "sourcingMarkupPrice": item["sourcingMarkupPrice"],
            "energyTaxPrice": item["energyTaxPrice"],
            "total_price": total_price,
            "perUnit": item["perUnit"]
        })
    return output

@cache.cached(timeout=300)
def fetch_prices():
    # Get today's date in YYYY-MM-DD format
    today = datetime.now().strftime("%Y-%m-%d")

    # GraphQL query for market prices
    query = f"""
    query MarketPrices {{
      marketPrices(date:"{today}") {{
        electricityPrices {{
          from
          till
          marketPrice
          marketPriceTax
          sourcingMarkupPrice
          energyTaxPrice
          perUnit
        }}
        gasPrices {{
          from
          till
          marketPrice
          marketPriceTax
          sourcingMarkupPrice
          energyTaxPrice
          perUnit
        }}
      }}
    }}
    """

    # API endpoint
    url = "https://frank-graphql-prod.graphcdn.app/"

    # Make the POST request
    response = requests.post(url, json={"query": query})

    if response.status_code != 200:
        return {"error": f"Failed to fetch data: {response.status_code}"}

    data = response.json()

    # Extract prices
    market_prices = data.get("data", {}).get("marketPrices", {})

    electricity_prices = market_prices.get("electricityPrices", [])
    gas_prices = market_prices.get("gasPrices", [])

    # Build API output with process_prices()
    electricity_output = process_prices(electricity_prices)
    gas_output = process_prices(gas_prices)

    # Output dict
    return {
        "electricity": electricity_output,
        "gas": gas_output
    }

@app.route('/api', methods=['GET'])
@limiter.limit("10 per minute")
def get_prices():
    return jsonify(fetch_prices())

if __name__ == "__main__":
    try:
        subprocess.run([sys.executable, '-m', 'gunicorn', '--bind', '0.0.0.0:3000', '--access-logfile', '-', '--log-level', 'info', 'main:app'])
    except FileNotFoundError:
        app.run(host='0.0.0.0', port=3000, debug=True)