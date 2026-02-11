# trmnl-frank-energie-plugin

## What is this?

A TRMNL Frank Energie plugin to display electricity and gas prices.

## Why?

To learn and develop plugins for my TRMNL device. This particular plugin was developed as a request for a colleague of mine.

## How do I make it work?

### Plugin liquid design information

- `full.liquid`: Default view. Shows electricity at the time of execution, average daily, and a basic graph for the last 24 hours.
- `half_horizontal.liquid` and `half_vertical.liquid`: Same thing as full.liquid, a bit more compressed and chart is smaller but no data lost.
- `quadrant.liquid`: In order to ensure the information is visible, removed the chart. The rest of the data is implemented correctly.

### Development

Use the TRMNL Docker image to run the local template server.

```shell
make serve
```

This starts a local server at http://localhost:4567 that watches for changes in your templates.

## Previews

| Full View | Half Horizontal View |
|------------|----------------------|
| ![Full View](media/preview_full.webp) | ![Half Horizontal View](media/preview_half_horizontal.webp) |

| Half Vertical View | Quadrant View |
|-------------------|----------------|
| ![Half Vertical View](media/preview_half_vertical.webp) | ![Quadrant View](media/preview_quadrant.webp) |

## Design Thought Process

**API Data Overview**
- Granular dataset: From 23:00 previous day to 23:00 current day, with total_price and other values.
- perUnit value: Electricity = KWH, Gas = M3.
- Data Structure: Gas and electricity have same datapoints, simplifying extraction.

**Display Intent**
- API does not provide next upcoming day, data comes from 23:00 from the previous day until 23:00 of the current day.

## Contributing

The project follows a modular architecture, making it easy to add new features.

We welcome contributions from the community!

## References

- [Marktprijzen API](https://reversed.notion.site/Marktprijzen-API-89ce600a88ac4abe8c2ad89d3167a83e)
- [Home Assistant Frank Energie const.py](https://raw.githubusercontent.com/bajansen/home-assistant-frank_energie/412c1c61eebeaa89e2b067b0d93042e446b55a01/custom_components/frank_energie/const.py)
- [Home Assistant Frank Energie repo](https://github.com/bajansen/home-assistant-frank_energie/)
- [TRMNLP repo](https://github.com/usetrmnl/trmnlp)
- [TRMNL Private Plugins Templates Documentation](https://docs.usetrmnl.com/go/private-plugins/templates)

## Uses

- Docker
- Deno

