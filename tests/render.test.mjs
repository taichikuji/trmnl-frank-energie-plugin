import test from 'node:test';
import assert from 'node:assert/strict';
import { render } from './render.mjs';
import { fixtures, price } from './fixtures.mjs';

const modes = ['full', 'half_horizontal', 'half_vertical', 'quadrant'];

for (const mode of modes) {
  test(`${mode}: renders the selected resource and title bar`, async () => {
    const html = await render(mode, fixtures.normal);
    assert.match(html, /Electricity/);
    assert.match(html, /€\/kWh/);
    assert.match(html, /€0\.2/);
    assert.equal((html.match(/class="layout /g) || []).length, 1);
    assert.equal((html.match(/class="title_bar"/g) || []).length, 1);
    assert.doesNotMatch(html, /undefined|NaN|Liquid error/);
  });

  test(`${mode}: supports Gas as the primary resource`, async () => {
    const html = await render(mode, fixtures.normal, 'Gas');
    assert.match(html, /Gas/);
    assert.match(html, /€\/m³/);
    assert.match(html, /€1\.2/);
  });

  test(`${mode}: handles unavailable primary data`, async () => {
    assert.match(await render(mode, fixtures.empty), /Price data unavailable/);
    assert.match(await render(mode, fixtures.missing), /Price data unavailable/);
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
  assert.match(html, /€0\.05/);
  assert.match(html, /€0\.6/);
});

test('full and half layouts use adaptive TRMNL charts', async () => {
  for (const mode of ['full', 'half_horizontal', 'half_vertical']) {
    const html = await render(mode, fixtures.normal);
    assert.match(html, /TRMNLCharts\.watch/);
    assert.match(html, /TRMNLCharts\.paint\("yellow-50"/);
    assert.doesNotMatch(html, /color:\s*["']#000000/);
  }
  assert.doesNotMatch(await render('quadrant', fixtures.normal), /Highcharts\.chart/);
});

test('instance names are escaped', async () => {
  const html = await render('full', fixtures.normal, 'Electricity', '<img src=x>');
  assert.doesNotMatch(html, /<img src=x>/);
  assert.match(html, /&lt;img src=x&gt;/);
});
