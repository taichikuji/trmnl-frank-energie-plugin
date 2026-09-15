# TRMNL Frank Energie Plugin

A TRMNL plugin that displays current all-in Frank Energie electricity and gas prices.

## Icon

The plugin icon is stored in the TRMNL bundle and referenced from `settings.yml`.

<div align="center">
  <img src="media/icon.svg" alt="Plugin Icon" width="90">
</div>

## Previews

Previews use a snapshot of public market prices and do not represent current rates.

| Full View | Half Horizontal View |
|------------|----------------------|
| ![Full View](media/preview_full.webp) | ![Half Horizontal View](media/preview_half_horizontal.webp) |

| Half Vertical View | Quadrant View |
|-------------------|----------------|
| ![Half Vertical View](media/preview_half_vertical.webp) | ![Quadrant View](media/preview_quadrant.webp) |

| BWRY Full View |
|----------------|
| ![BWRY Full View](media/preview_bwry.webp) |

| TRMNL X Landscape | TRMNL X Portrait |
|-------------------|------------------|
| ![TRMNL X Landscape](media/preview_trmnl_x.webp) | ![TRMNL X Portrait](media/preview_trmnl_x_portrait.webp) |

## Templates

- **shared.liquid**: Resource selection, all-in calculations, time matching, shared components and adaptive chart rendering.
- **full.liquid**: Current, average, lowest and highest prices, the daily chart and the secondary resource.
- **half_horizontal.liquid**: Four primary price metrics beside the daily chart.
- **half_vertical.liquid**: Current price, daily chart, three summary metrics and the secondary resource.
- **quadrant.liquid**: Current, lowest and highest prices without a chart.

The chart uses TRMNL Framework 3.3 paint helpers, so bars, text and grids adapt to grayscale, BWRY, themes and TRMNL X.
