// NestEgg router and interactions. Hash routes, one page per section:
//   #/                 Dashboard (November at a glance)
//   #/planner          Interactive budget planner
//   #/scenarios        Three real household budgets
//   #/tracker          November spending log
//   #/goals            Savings goals
//   #/tips             Priced saving tips
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { HOUSEHOLDS, TRANSACTIONS } from './data.js';
import { dashboard, goals, missing, planner, plannerSummary, scenarios, tips, tracker } from './views.js';

const app = document.getElementById('app');

// Planner state: a deep copy of the chosen household, so edits never touch
// the shared data and the Reset button can restore the original figures.
let currentHouseholdId = 'rivera';
let plannerState = structuredClone(HOUSEHOLDS[0]);
const addedExpenses = [];

function householdById(id) {
  return HOUSEHOLDS.find((h) => h.id === id) || HOUSEHOLDS[0];
}

function parseHash() {
  const [path, query] = location.hash.replace(/^#/, '').split('?');
  return { path: path || '/', params: new URLSearchParams(query || '') };
}

function applyWhatIf(id) {
  const e = plannerState.expenses;
  if (id === 'groceries') e.groceries = Math.max(0, e.groceries - 140);
  if (id === 'dining') e.dining = Math.max(0, e.dining - 95);
  if (id === 'subs') e.subscriptions = Math.max(0, e.subscriptions - 32);
  if (id === 'reset') plannerState = structuredClone(householdById(currentHouseholdId));
}

function render() {
  window.__shotReady = false;
  const { path, params } = parseHash();
  const nav = document.querySelectorAll('[data-nav]');
  nav.forEach((a) => a.classList.toggle('current', a.dataset.nav === (path === '/' ? 'dashboard' : path.slice(1))));

  if (path === '/') {
    document.title = 'NestEgg — Household Budget Planner';
    app.innerHTML = dashboard(plannerState);
  } else if (path === '/planner') {
    const wanted = params.get('household');
    if (wanted && wanted !== currentHouseholdId) {
      currentHouseholdId = wanted;
      plannerState = structuredClone(householdById(wanted));
    }
    document.title = 'Planner | NestEgg';
    app.innerHTML = planner({ household: plannerState });
    bindPlanner();
  } else if (path === '/scenarios') {
    document.title = 'Households | NestEgg';
    app.innerHTML = scenarios();
  } else if (path === '/tracker') {
    document.title = 'Tracker | NestEgg';
    const filter = params.get('category') || 'all';
    app.innerHTML = tracker(filter, addedExpenses);
    bindTracker();
  } else if (path === '/goals') {
    document.title = 'Goals | NestEgg';
    app.innerHTML = goals();
  } else if (path === '/tips') {
    document.title = 'Saving tips | NestEgg';
    app.innerHTML = tips();
  } else {
    document.title = 'Not found | NestEgg';
    app.innerHTML = missing();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function bindPlanner() {
  app.querySelectorAll('input[data-expense]').forEach((input) => {
    input.addEventListener('input', () => {
      const key = input.dataset.expense;
      const value = Math.max(0, Number(input.value) || 0);
      plannerState.expenses[key] = value;
      syncPlannerInputs(key, value);
      refreshPlanner();
    });
  });
  app.querySelectorAll('input[data-income]').forEach((input) => {
    input.addEventListener('input', () => {
      plannerState.income[input.dataset.income] = Math.max(0, Number(input.value) || 0);
      refreshPlanner();
    });
  });
  app.querySelectorAll('[data-whatif]').forEach((button) => {
    button.addEventListener('click', () => {
      applyWhatIf(button.dataset.whatif);
      render();
    });
  });
}

// Keep each slider and its number box showing the same value.
function syncPlannerInputs(key, value) {
  app.querySelectorAll(`input[data-expense="${key}"]`).forEach((el) => {
    if (el.value !== String(value)) el.value = value;
  });
}

// Re-render only the result panel and the two totals headings, so a slider
// drag never loses the element being dragged.
function refreshPlanner() {
  const { path } = parseHash();
  if (path !== '/planner') return;
  const result = document.getElementById('planner-result');
  if (result) result.innerHTML = plannerSummary(plannerState);
  const headings = app.querySelectorAll('.planner-grid > .card > h2');
  if (headings[0]) headings[0].textContent = `Income — $${Object.values(plannerState.income).reduce((a, b) => a + b, 0).toLocaleString('en-US')} a month`;
  if (headings[1]) headings[1].textContent = `Expenses — $${Object.values(plannerState.expenses).reduce((a, b) => a + b, 0).toLocaleString('en-US')} a month`;
}

function bindTracker() {
  const form = document.getElementById('add-expense');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    addedExpenses.unshift({
      date: String(data.get('date') || 'Nov 25'),
      merchant: String(data.get('merchant') || '').trim() || 'Unnamed purchase',
      category: String(data.get('category') || 'other'),
      amount: Math.max(0.01, Number(data.get('amount')) || 0.01),
      added: true,
    });
    render();
  });
}

window.addEventListener('hashchange', render);
render();
