import { expect, test } from 'bun:test';
import { render } from './render.mjs';
import { fixtures, price } from './fixtures.mjs';

const modes = ['full', 'half_horizontal', 'half_vertical', 'quadrant'];

for (const mode of modes) {
  test(`${mode}: renders the selected resource and title bar`, async () => {
    const html = await render(mode, fixtures.normal);
    expect(html).toMatch(/Electricity/);
    expect(html).toMatch(/€\/kWh/);
    expect(html).toMatch(/€0\.2/);
    expect((html.match(/class="layout /g) || []).length).toBe(1);
    expect((html.match(/class="title_bar"/g) || []).length).toBe(1);
    expect(html).toMatch(/<img class="image"[^>]+alt="Frank Energie logo">/);
    expect(html).not.toMatch(/class="instance"|image--adaptive/);
    expect(html).toMatch(/frank-card-rail bg--orange/);
    expect(html).not.toMatch(/undefined|NaN|Liquid error/);
  });

  test(`${mode}: supports Gas as the primary resource`, async () => {
    const html = await render(mode, fixtures.normal, 'Gas');
    expect(html).toMatch(/Gas/);
    expect(html).toMatch(/€\/m³/);
    expect(html).toMatch(/€1\.2/);
  });

  test(`${mode}: handles unavailable primary data`, async () => {
    expect(await render(mode, fixtures.empty)).toMatch(/Price data unavailable/);
    expect(await render(mode, fixtures.missing)).toMatch(/Price data unavailable/);
  });
}

test('statistics use the displayed all-in total', async () => {
  const data = { marketPrices: {
    electricityPrices: [
      price(-1, 0.4, { marketPriceTax: -0.35 }),
      price(0, 0.1, { marketPriceTax: 0.5 })
    ],
    gasPrices: []
  } };
  const html = await render('full', data);
  expect(html).toMatch(/€0\.05/);
  expect(html).toMatch(/€0\.6/);
});

test('constrained layouts keep price text sized for their slots', async () => {
  for (const mode of ['half_horizontal', 'half_vertical', 'quadrant']) {
    expect(await render(mode, fixtures.normal)).not.toMatch(/lg:value--/);
  }
});

test('full and half layouts use adaptive TRMNL charts', async () => {
  for (const mode of ['full', 'half_horizontal', 'half_vertical']) {
    const html = await render(mode, fixtures.normal);
    expect(html.indexOf('highcharts/12.3.0/highcharts.js')).toBeLessThan(html.indexOf('class="frank-chart'));
    expect(html).toMatch(/TRMNLCharts\.watch/);
    expect(html).toMatch(/TRMNLCharts\.paint\("yellow-50"/);
    expect(html).toMatch(/TRMNLCharts\.paint\("orange-50"/);
    expect(html).toMatch(/screen--color-4bwry/);
    expect(html).toMatch(/bwry \? "#ffff00"/);
    expect(html).toMatch(/window\.Highcharts && window\.TRMNLCharts && window\.TRMNLPaint/);
    expect((html.match(/var bwry = isBwry\(\);/g) || []).length).toBe(2);
    expect(html).toMatch(/if \(!window\.TRMNLCharts \|\| !window\.TRMNLPaint\)/);
    expect(html).toMatch(/class="frank-chart w--full grow/);
    expect(html).toMatch(/DOMContentLoaded/);
    expect(html).toMatch(/requestAnimationFrame\(build\)/);
    expect(html).not.toMatch(/color:\s*["']#000000/);
  }
  expect(await render('quadrant', fixtures.normal)).not.toMatch(/Highcharts\.chart/);
});

test('instance names are escaped', async () => {
  const html = await render('full', fixtures.normal, 'Electricity', '<img src=x>');
  expect(html).not.toMatch(/<img src=x>/);
  expect(html).toMatch(/&lt;img src=x&gt;/);
});
