export default async (req, context) => {
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
    const response = await fetch("https://frank-graphql-prod.graphcdn.app/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch data: ${response.status}` }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    const jsonResponse = await response.json();
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
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, must-revalidate", // 5 minutes browser cache
        "Netlify-CDN-Cache-Control": "public, max-age=300, must-revalidate" // 5 minutes Edge cache
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
