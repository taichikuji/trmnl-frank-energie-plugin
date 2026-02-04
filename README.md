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

### Deployment

1. **Using init script (Recommended)**
    Run the initialization script. Ensure that you have docker / docker compose so that no failures occur.
    ```shell
    ./init-dc.sh
    ```

2. **Manual Setup**
    To deploy the API flask wrapper:
    ```shell
    pipenv install
    pipenv run python main.py
    ```
    
    To deploy trmnlp for development (after deploying the API locally):
    ```shell
    bin/trmnlp
    ```

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

## Uses:

- <a href="https://www.python.org/downloads/"><img src="https://img.shields.io/badge/Python-3.12-blue?logo=python&logoColor=white" /></a>
- <a href="https://pypi.org/project/pipenv/"><img src="https://img.shields.io/badge/Pipenv-locked-orange" /></a>

### Dependencies

- Flask
- Requests
- Gunicorn
- Flask-Limiter
- Flask-Caching
