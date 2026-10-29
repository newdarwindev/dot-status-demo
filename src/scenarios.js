/** @typedef {'healthy' | 'warning' | 'degraded'} ScenarioName */
/** @typedef {{ title: string, description: string, state: string, diskUsed: number, requests: number, tokens: number, uptime: string, tasks: number, queue: number, notes: string[] }} Scenario */
/** @type {Record<ScenarioName, Scenario>} */
export const scenarios = {
  healthy: {
    title: 'All systems comfortable',
    description: 'Plenty of headroom for the next good idea.',
    state: 'Healthy',
    diskUsed: 28,
    requests: 320,
    tokens: 84000,
    uptime: '4d 12h',
    tasks: 128,
    queue: 2,
    notes: [
      'Disk space has plenty of room in this example.',
      'Both illustrative allocations have headroom.',
      'A small fictional queue is ready to move.',
    ],
  },
  warning: {
    title: 'A little attention needed',
    description: 'The fictional worker is getting close to its comfort zone.',
    state: 'Warning',
    diskUsed: 82,
    requests: 830,
    tokens: 148000,
    uptime: '2d 06h',
    tasks: 94,
    queue: 14,
    notes: [
      'Only 18 GB of fictional disk space remains.',
      'Request allocation is 83% used in this example.',
      'A growing synthetic queue suggests extra waiting.',
    ],
  },
  degraded: {
    title: 'This scenario needs a pause',
    description: 'A deliberately stressed example, not a real incident.',
    state: 'Degraded',
    diskUsed: 97,
    requests: 1000,
    tokens: 196000,
    uptime: '0d 03h',
    tasks: 42,
    queue: 38,
    notes: [
      'Fictional disk space is almost full: 3 GB left.',
      'The illustrative request allocation is exhausted.',
      'The invented task queue has a substantial backlog.',
    ],
  },
};
export const sampleTimestamp = '2026-10-29T09:41:00Z';
/** @param {string | undefined} name @returns {ScenarioName} */
export function scenarioName(name) {
  if (name === 'warning' || name === 'degraded') {
    return name;
  }
  return 'healthy';
}
/** @param {number} used @param {number} capacity */
export function allocation(used, capacity) {
  if (!Number.isFinite(used) || !Number.isFinite(capacity) || capacity <= 0) {
    throw new RangeError(
      'Allocation values must be finite and capacity positive.',
    );
  }
  const bounded = Math.min(capacity, Math.max(0, used));
  return {
    used: bounded,
    remaining: capacity - bounded,
    percent: Math.round((bounded / capacity) * 10000) / 100,
  };
}
