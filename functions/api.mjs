export default async req => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // GraphQL query for market prices
  const query = `
    query MarketPrices {
      marketPrices(date:"${today}") {
        electricityPrices {
          from
          till
          marketPrice
          marketPriceTax
          sourcingMarkupPrice
          energyTaxPrice
          perUnit
        }
        gasPrices {
          from
          till
          marketPrice
          marketPriceTax
          sourcingMarkupPrice
          energyTaxPrice
          perUnit
        }
      }
    }
  `;

  try {
    const res = await fetch("https://frank-graphql-prod.graphcdn.app/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) 
      return new Response(JSON.stringify({ 
        error: `Failed to fetch data: ${res.status}` 
      }), { status: 502, headers: { 'Content-Type': 'application/json' } });

    const jsonResponse = await res.json();
    const data = jsonResponse.data;
    const marketPrices = data?.marketPrices || {};

    const processPrices = (list) => {
      return (list || []).map(item => {
        const totalPrice = (
          item.marketPrice +
          item.marketPriceTax +
          item.sourcingMarkupPrice +
          item.energyTaxPrice
        );
        return {
          from: item.from,
          till: item.till,
          marketPrice: item.marketPrice,
          marketPriceTax: item.marketPriceTax,
          sourcingMarkupPrice: item.sourcingMarkupPrice,
          energyTaxPrice: item.energyTaxPrice,
          total_price: totalPrice,
          perUnit: item.perUnit
        };
      });
    };

    const result = {
      electricity: processPrices(marketPrices.electricityPrices),
      gas: processPrices(marketPrices.gasPrices)
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, must-revalidate',
        'Netlify-CDN-Cache-Control': 'public, max-age=300, must-revalidate',
        'Content-Type': 'application/json'
      }
    });

  } catch (err) {
    console.error("Frank Energie API Error:", err);
    return new Response(JSON.stringify({ 
      error: err.message 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
