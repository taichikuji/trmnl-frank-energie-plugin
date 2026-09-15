const hour = 60 * 60 * 1000;
const currentHour = Math.floor(Date.now() / hour) * hour;

function price(offset, marketPrice, extra = {}) {
  return {
    from: new Date(currentHour + offset * hour).toISOString(),
    till: new Date(currentHour + (offset + 1) * hour).toISOString(),
    marketPrice,
    marketPriceTax: extra.marketPriceTax ?? 0,
    sourcingMarkupPrice: extra.sourcingMarkupPrice ?? 0,
    energyTaxPrice: extra.energyTaxPrice ?? 0,
    perUnit: extra.perUnit ?? 'KWH'
  };
}

export const electricity = [
  price(-1, 0.1),
  price(0, 0.2),
  price(1, 0.4),
  price(2, 0.3)
];

export const gas = [
  price(-1, 1.1, { perUnit: 'M3' }),
  price(0, 1.2, { perUnit: 'M3' }),
  price(1, 1.4, { perUnit: 'M3' }),
  price(2, 1.3, { perUnit: 'M3' })
];

export const fixtures = {
  normal: { marketPrices: { electricityPrices: electricity, gasPrices: gas } },
  electricityOnly: { marketPrices: { electricityPrices: electricity, gasPrices: [] } },
  gasOnly: { marketPrices: { electricityPrices: [], gasPrices: gas } },
  empty: { marketPrices: { electricityPrices: [], gasPrices: [] } },
  missing: {}
};

export { price };
