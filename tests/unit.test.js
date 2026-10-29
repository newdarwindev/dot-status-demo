import test from 'node:test';
import assert from 'node:assert/strict';
import {
  allocation,
  scenarioName,
  scenarios,
  sampleTimestamp,
} from '../src/scenarios.js';

test('allocation derives remaining and percentage with safe boundaries', () => {
  assert.deepEqual(allocation(28, 100), {
    used: 28,
    remaining: 72,
    percent: 28,
  });
  assert.deepEqual(allocation(1000, 1000), {
    used: 1000,
    remaining: 0,
    percent: 100,
  });
  assert.deepEqual(allocation(-3, 100), {
    used: 0,
    remaining: 100,
    percent: 0,
  });
  assert.deepEqual(allocation(200, 100), {
    used: 100,
    remaining: 0,
    percent: 100,
  });
});
test('invalid numeric values are rejected', () => {
  assert.throws(() => allocation(1, 0), RangeError);
  assert.throws(() => allocation(1, -1), RangeError);
  assert.throws(() => allocation(NaN, 100), RangeError);
  assert.throws(() => allocation(1, Infinity), RangeError);
});
test('unknown scenarios safely default to healthy', () => {
  assert.equal(scenarioName(undefined), 'healthy');
  assert.equal(scenarioName('<script>'), 'healthy');
  assert.equal(scenarioName('warning'), 'warning');
  assert.equal(scenarioName('degraded'), 'degraded');
});
test('all synthetic fixtures respect capacity and contain three notes', () => {
  for (const scenario of Object.values(scenarios)) {
    assert.ok(scenario.diskUsed >= 0 && scenario.diskUsed <= 100);
    assert.ok(scenario.requests >= 0 && scenario.requests <= 1000);
    assert.ok(scenario.tokens >= 0 && scenario.tokens <= 200000);
    assert.equal(scenario.notes.length, 3);
  }
  assert.equal(scenarios.degraded.requests, 1000);
  assert.equal(sampleTimestamp, '2026-10-29T09:41:00Z');
});
