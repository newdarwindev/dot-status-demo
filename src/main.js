import './style.css';
import { allocation, scenarioName, scenarios } from './scenarios.js';
/** @param {string} selector */
function element(selector) {
  const node = document.querySelector(selector);
  if (!(node instanceof HTMLElement)) {
    throw new Error(`Missing element: ${selector}`);
  }
  return node;
}
/** @param {string} selector @param {string | number} value */
function setText(selector, value) {
  element(selector).textContent = String(value);
}
/** @param {string} selector @param {number} used @param {number} capacity */
function renderBar(selector, used, capacity) {
  const fill = element(selector);
  fill.style.width = `${allocation(used, capacity).percent}%`;
  fill.parentElement?.setAttribute('aria-valuenow', String(used));
}
/** @param {'requests' | 'tokens'} name @param {number} used @param {number} capacity */
function renderQuota(name, used, capacity) {
  const values = allocation(used, capacity);
  setText(`#${name}-used`, values.used.toLocaleString('en-US'));
  setText(
    `#${name}-remaining`,
    `${values.remaining.toLocaleString('en-US')} demo units remaining`,
  );
  renderBar(`#${name}-fill`, used, capacity);
}
/** @param {import('./scenarios.js').Scenario} scenario */
function renderMetrics(scenario) {
  const free = 100 - scenario.diskUsed;
  setText('#disk-free', free);
  setText('#disk-free-label', `${free} GB`);
  setText('#disk-used', `${scenario.diskUsed} GB`);
  setText(
    '#disk-detail',
    `${scenario.diskUsed} GB used of 100 GB · fictional disk`,
  );
  renderBar('#disk-fill', scenario.diskUsed, 100);
  renderQuota('requests', scenario.requests, 1000);
  renderQuota('tokens', scenario.tokens, 200000);
  setText('#uptime', scenario.uptime);
  setText('#tasks', scenario.tasks);
  setText('#queue', scenario.queue);
}
/** @param {import('./scenarios.js').ScenarioName} name */
function renderScenario(name) {
  const scenario = scenarios[name];
  element('#dashboard').dataset.state = name;
  setText('#summary-title', scenario.title);
  setText('#summary-description', scenario.description);
  setText('#machine-state', scenario.state);
  setText('.status-orb', { healthy: '✓', warning: '!', degraded: '×' }[name]);
  renderMetrics(scenario);
  element('#notes').replaceChildren(...scenario.notes.map(noteElement));
  document.querySelectorAll('[data-scenario]').forEach((button) => {
    button.setAttribute(
      'aria-pressed',
      String(button.getAttribute('data-scenario') === name),
    );
  });
  setText(
    '#announcement',
    `${scenario.state} synthetic scenario selected. ${scenario.title}.`,
  );
}
/** @param {string} text */
function noteElement(text) {
  const item = document.createElement('li');
  item.textContent = text;
  return item;
}
document.querySelectorAll('[data-scenario]').forEach((button) => {
  button.addEventListener('click', () => {
    renderScenario(
      scenarioName(button.getAttribute('data-scenario') ?? undefined),
    );
  });
});
renderScenario('healthy');
