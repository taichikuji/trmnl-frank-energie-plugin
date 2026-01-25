import requests
import json
from datetime import datetime
from flask import Flask, jsonify
import subprocess
import sys

app = Flask(__name__)

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

    # Process electricity prices
    electricity_output = []
    for item in electricity_prices:
        total_price = (
            item["marketPrice"] +
            item["marketPriceTax"] +
            item["sourcingMarkupPrice"] +
            item["energyTaxPrice"]
        )
        electricity_output.append({
            "from": item["from"],
            "till": item["till"],
            "marketPrice": item["marketPrice"],
            "marketPriceTax": item["marketPriceTax"],
            "sourcingMarkupPrice": item["sourcingMarkupPrice"],
            "energyTaxPrice": item["energyTaxPrice"],
            "total_price": total_price,
            "perUnit": item["perUnit"]
        })

    # Process gas prices
    gas_output = []
    for item in gas_prices:
        total_price = (
            item["marketPrice"] +
            item["marketPriceTax"] +
            item["sourcingMarkupPrice"] +
            item["energyTaxPrice"]
        )
        gas_output.append({
            "from": item["from"],
            "till": item["till"],
            "marketPrice": item["marketPrice"],
            "marketPriceTax": item["marketPriceTax"],
            "sourcingMarkupPrice": item["sourcingMarkupPrice"],
            "energyTaxPrice": item["energyTaxPrice"],
            "total_price": total_price,
            "perUnit": item["perUnit"]
        })

    # Output dict
    return {
        "electricity": electricity_output,
        "gas": gas_output
    }

@app.route('/api', methods=['GET'])
def get_prices():
    return jsonify(fetch_prices())

if __name__ == "__main__":
    try:
        subprocess.run([sys.executable, '-m', 'gunicorn', '--bind', '0.0.0.0:3000', 'main:app'], check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        app.run(host='0.0.0.0', port=3000, debug=True)