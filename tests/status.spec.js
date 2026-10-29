import { test, expect } from '@playwright/test';
import { scenarios } from '../src/scenarios.js';

for (const [name, scenario] of Object.entries(scenarios)) {
  test(`${name} scenario displays coherent synthetic metrics`, async ({
    page,
  }, testInfo) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: scenario.state, exact: true })
      .click();
    await expect(
      page.getByRole('heading', { name: scenario.title }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: scenario.state, exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#disk-free')).toHaveText(
      String(100 - scenario.diskUsed),
    );
    await expect(
      page.getByRole('progressbar', { name: 'Fictional disk used in GB' }),
    ).toHaveAttribute('aria-valuenow', String(scenario.diskUsed));
    await expect(page.locator('#requests-used')).toHaveText(
      scenario.requests.toLocaleString('en-US'),
    );
    await expect(page.locator('#tokens-used')).toHaveText(
      scenario.tokens.toLocaleString('en-US'),
    );
    await expect(page.locator('#queue')).toHaveText(String(scenario.queue));
    await expect(page.locator('#notes li')).toHaveCount(3);
    await expect(page.getByRole('status')).toContainText(
      `${scenario.state} synthetic scenario selected`,
    );
    await expect(page.locator('body')).toHaveJSProperty(
      'scrollWidth',
      await page.locator('body').evaluate((body) => body.clientWidth),
    );
    await page.screenshot({
      path: testInfo.outputPath(`${name}-${testInfo.project.name}.png`),
      fullPage: true,
      animations: 'disabled',
    });
  });
}

test('repeated switches, keyboard activation, disclosure dismissal and reload', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  const warning = page.getByRole('button', { name: 'Warning', exact: true });
  await warning.click({ clickCount: 3 });
  await expect(page.locator('#disk-free')).toHaveText('18');
  await page.getByRole('button', { name: 'Degraded', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#requests-remaining')).toHaveText(
    '0 demo units remaining',
  );
  const disclosure = page.locator('summary');
  await disclosure.click();
  await expect(
    page.getByRole('heading', { name: 'No real system is being monitored.' }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath(`disclosure-${testInfo.project.name}.png`),
    fullPage: true,
  });
  await disclosure.click();
  await expect(page.locator('details')).not.toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Healthy', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#disk-free')).toHaveText('72');
  await warning.click();
  await page.reload();
  await expect(page.locator('#disk-free')).toHaveText('72');
  await expect(page.locator('details')).not.toHaveAttribute('open', '');
});

test('demo makes no external requests and uses no browser storage', async ({
  page,
}) => {
  /** @type {string[]} */
  const external = [];
  /** @type {string[]} */
  const errors = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4173/')) {
      external.push(request.url());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Degraded', exact: true }).click();
  await page.getByRole('button', { name: 'Warning', exact: true }).click();
  await page.getByRole('button', { name: 'Healthy', exact: true }).click();
  await expect(
    page.getByText('SIMULATED DATA', { exact: false }),
  ).toBeVisible();
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
});
