# trmnl-frank-energie-plugin
A TRMNL Frank Energie plugin to display electricity and gas prices

## References

- Marktprijzen API: https://reversed.notion.site/Marktprijzen-API-89ce600a88ac4abe8c2ad89d3167a83e
- Home Assistant Frank Energie const.py: https://raw.githubusercontent.com/bajansen/home-assistant-frank_energie/412c1c61eebeaa89e2b067b0d93042e446b55a01/custom_components/frank_energie/const.py
- Home Assistant Frank Energie repo: https://github.com/bajansen/home-assistant-frank_energie/
- TRMNL repo: https://github.com/usetrmnl/trmnlp
- TRMNL Private Plugins Templates: https://docs.usetrmnl.com/go/private-plugins/templates

## TRMNL Information

TRMNL uses a "flavor" of Liquid optimized for e-ink (800x480 resolution).

### File Purposes

- full.liquid: Full-screen layout (800x480)
- half_horizontal.liquid: Top/Bottom split layout
- quadrant.liquid: 1/4 screen layout
- settings.yml: Defines variables and polling URLs

## Development Commands

- Install dependencies: `pipenv install`
- Run the app: `pipenv run main.py`
- Test API: `curl http://localhost:3000/api`
- Test TRMNL: `trmnlp serve`

## Device and Framework Info

- TRMNL OG Device: 800x480 pixel, black and white, 2-bit grayscale display.
- Design System: https://usetrmnl.com/blog/design-system
- Framework: https://usetrmnl.com/framework
- Responsive Design (Important for TRMNL X): https://usetrmnl.com/framework/responsive
  - Reason: TRMNL X is bigger,  as well as other devices that use TRMNL Firmware; ensure responsiveness for better design policy.
- Charts: https://usetrmnl.com/framework/docs/chart

## Design Thought Process

### API Data Overview

- Granular dataset: From 23:00 previous day to 23:00 current day, with total_price and other values.
- perUnit value: Electricity = KWH, Gas = M3.
- Data Structure: Gas and electricity have same datapoints, simplifying extraction.

### Display Intent

- Show rolling 24 hours from current time to next 00:00 (or until available).
- Example: At 13:00, display from 13:00 to 00:00.
- Limitation: API likely doesn't provide next day, so stop at 00:00.
