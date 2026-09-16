# Frank Energie for TRMNL

A TRMNL plugin for today's Frank Energie electricity and gas prices, with full, half and quadrant layouts for TRMNL OG, BWRY and TRMNL X.

Install it [here](https://trmnl.com/recipes/245095)!

## Features

- Current all-in price with the correct €/kWh or €/m³ unit
- Daily average, lowest and highest prices
- Hourly price chart with the current period highlighted
- Electricity or gas as the primary resource
- Palette-aware rendering for grayscale and BWRY displays
- Responsive TRMNL X landscape and portrait layouts
- Clear unavailable-data state

## Local development

Open `TRMNL/` with [TRMNLP](https://github.com/usetrmnl/trmnlp), select a primary resource in `.trmnlp.yml`, and preview all four layouts.

## References

- [Frank Energie dynamic pricing](https://www.frankenergie.nl/nl/dynamisch-energiecontract)
- [Frank Energie price API reference](https://indyjonesnl.github.io/frank-energie-price-history/api/)
- [Home Assistant Frank Energie integration](https://github.com/bajansen/home-assistant-frank_energie/)
- [TRMNL screen templating](https://docs.trmnl.com/go/private-plugins/templates)
- [TRMNL X guide](https://trmnl.com/framework/docs/3.3/trmnl_x_guide)
- [TRMNL color palettes](https://trmnl.com/framework/docs/3.3/color_palettes)
- [TRMNL adaptive charts](https://trmnl.com/framework/docs/3.3/chart)
