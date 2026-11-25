// NestEgg views: one function per page. Each returns HTML for #app.
// All figures come from data.js and the planner state in main.js.

import {
  CATEGORIES, GOALS, HOUSEHOLDS, MONTHS, NEEDS, RULE_503020, TIPS, TRANSACTIONS,
  categoryByKey, healthScore, healthVerdict, money, moneyCents,
  savingsRate, totalExpenses, totalIncome,
} from './data.js';
import { donutChart, monthBars, ruleBars, savingsGauge } from './charts.js';

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function statCard(label, value, sub) {
  return `<div class="stat"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong><span class="stat-sub">${sub}</span></div>`;
}

function alertBox(household) {
  const income = totalIncome(household);
  const spent = totalExpenses(household);
  const rate = savingsRate(household);
  const top = CATEGORIES.map((c) => ({ ...c, value: household.expenses[c.key] || 0 }))
    .sort((a, b) => b.value - a.value)[0];
  const alerts = [];
  if (spent > income) alerts.push(`<li class="alert-bad"><strong>Over budget:</strong> spending is ${money(spent - income)} above this month's income. Open the Planner and try a what-if cut.</li>`);
  if (rate < 10) alerts.push(`<li class="alert-bad"><strong>Savings rate ${rate.toFixed(1)}%:</strong> below the 10% floor most advisers suggest. The tips page finds about $400 a month for this household.</li>`);
  if (top && top.value / income > 0.3) alerts.push(`<li class="alert-warn"><strong>${top.label} takes ${Math.round((top.value / income) * 100)}% of income.</strong> Anything over 30% deserves a second look.</li>`);
  if (alerts.length === 0) alerts.push(`<li class="alert-good"><strong>On track:</strong> savings rate ${rate.toFixed(1)}% and no category over 30% of income. The biggest win left is groceries — see the tips.</li>`);
  return `<section class="card alerts"><h2>What needs attention</h2><ul>${alerts.join('')}</ul></section>`;
}

export function dashboard(household) {
  const income = totalIncome(household);
  const spent = totalExpenses(household);
  const left = income - spent;
  const rate = savingsRate(household);
  const score = healthScore(household);
  const verdict = healthVerdict(score);
  const needs = NEEDS.reduce((a, k) => a + (household.expenses[k] || 0), 0);
  return `<section class="hero">
    <div>
      <p class="eyebrow">November 2026 · ${escape(household.name)}</p>
      <h1>Every dollar has a job.</h1>
      <p class="lede">This household brings in <strong>${money(income)}</strong> and spends <strong>${money(spent)}</strong>, leaving <strong>${money(left)}</strong> — a savings rate of <strong>${rate.toFixed(1)}%</strong>. Here is the month at a glance.</p>
      <p class="hero-cta"><a class="btn" href="#/planner">Open the planner →</a> <a class="btn ghost" href="#/tracker">See November spending</a></p>
    </div>
    <div class="score-box">
      <span class="score-number">${score}</span>
      <span class="score-label">Budget health · ${verdict.label}</span>
      <p>${verdict.text}</p>
    </div>
  </section>
  <section class="stats">
    ${statCard('Income', money(income), 'take-home + side income')}
    ${statCard('Spent', money(spent), 'all categories, November')}
    ${statCard('Left to save', money(left), `${rate.toFixed(1)}% of income`)}
    ${statCard('Biggest cost', money(Math.max(...Object.values(household.expenses))), 'housing, as usual')}
  </section>
  <div class="grid-2">
    <section class="card"><h2>Where the money goes</h2>${donutChart(household.expenses)}</section>
    <section class="card"><h2>Six months: income vs spending</h2>${monthBars(MONTHS)}
      <p class="card-note">Spending has fallen three months in a row while income stayed flat — the meal plan and the bus pass are doing the work.</p></section>
  </div>
  <div class="grid-2">
    <section class="card"><h2>Savings rate</h2>${savingsGauge(rate)}
      <p class="card-note">The 50/30/20 rule aims for 20% saved. This household is at ${rate.toFixed(1)}% — ${rate >= 20 ? 'above the rule, keep it up.' : 'below the rule; the planner shows what closes the gap.'}</p></section>
    ${alertBox(household)}
  </div>
  <section class="card"><h2>Needs, wants and savings — against the 50/30/20 rule</h2>
    ${ruleBars((needs / income) * 100, ((spent - needs) / income) * 100, rate)}
    <p class="card-note">Needs ${money(needs)} · Wants ${money(spent - needs)} · Savings ${money(left)}. The rule is a compass, not a law — a family with two children in childcare will always run needs above 50%.</p>
  </section>
  <section class="card link-cards"><h2>Keep going</h2><div class="links">
    <a href="#/planner"><strong>Planner</strong><span>Change any number and watch the month re-balance.</span></a>
    <a href="#/scenarios"><strong>Households</strong><span>Three real budgets: a young family, a single professional, retirees.</span></a>
    <a href="#/goals"><strong>Goals</strong><span>Four savings goals, with a date for each one.</span></a>
    <a href="#/tips"><strong>Saving tips</strong><span>Eight moves worth about $450 a month for this household.</span></a>
  </div></section>`;
}

export function plannerSummary(h) {
  const income = totalIncome(h);
  const spent = totalExpenses(h);
  const left = income - spent;
  const rate = savingsRate(h);
  const score = healthScore(h);
  const verdict = healthVerdict(score);
  const needs = NEEDS.reduce((a, k) => a + (h.expenses[k] || 0), 0);
  return `<h2>The month, re-balanced</h2>
    <dl class="result-rows">
      <div><dt>Income</dt><dd>${money(income)}</dd></div>
      <div><dt>Spending</dt><dd>${money(spent)}</dd></div>
      <div class="result-left"><dt>Left to save</dt><dd>${money(left)}</dd></div>
      <div><dt>Savings rate</dt><dd>${rate.toFixed(1)}%</dd></div>
      <div><dt>Budget health</dt><dd>${score} · ${verdict.label}</dd></div>
    </dl>
    <p>${verdict.text}</p>
    ${ruleBars((needs / income) * 100, ((spent - needs) / income) * 100, rate)}
    <p class="card-note">Rule targets: needs 50% · wants 30% · savings 20%.</p>`;
}

export function planner(state, onInput) {
  const h = state.household;
  const income = totalIncome(h);
  const spent = totalExpenses(h);
  const incomeRows = Object.entries(h.income)
    .map(([label, v]) => `<label class="money-row"><span>${escape(label)}</span><span class="money-input">$<input type="number" min="0" step="10" value="${v}" data-income="${escape(label)}" aria-label="${escape(label)} income"></span></label>`)
    .join('');
  const expenseRows = CATEGORIES.map((c) => {
    const v = h.expenses[c.key] || 0;
    return `<div class="expense-row">
      <span class="expense-name"><i class="dot" style="background:${c.color}"></i>${c.label}<small>${c.hint}</small></span>
      <input type="range" min="0" max="${Math.max(2000, Math.ceil(v * 1.5 / 50) * 50)}" step="5" value="${v}" data-expense="${c.key}" aria-label="${c.label} amount">
      <span class="money-input">$<input type="number" min="0" step="5" value="${v}" data-expense="${c.key}" aria-label="${c.label} amount"></span>
    </div>`;
  }).join('');
  const whatIf = [
    { id: 'groceries', label: 'Meal-plan groceries −$140', desc: 'Plan five dinners, shop once a week.' },
    { id: 'dining', label: 'One takeaway night −$95', desc: 'Keep Friday pizza, cook the rest.' },
    { id: 'subs', label: 'Cancel two subscriptions −$32', desc: 'The ones nobody opened since August.' },
    { id: 'reset', label: 'Reset to the Rivera budget', desc: 'Back to the original November figures.' },
  ].map((w) => `<button class="whatif" data-whatif="${w.id}"><strong>${w.label}</strong><span>${w.desc}</span></button>`).join('');
  return `<section class="page-head">
    <p class="eyebrow">Planner · ${escape(h.name)}</p>
    <h1>Build the month, line by line.</h1>
    <p class="lede">Move a slider or type a number — every total, chart and verdict on this page updates at once. Nothing is saved to a server; it all happens in your browser.</p>
  </section>
  <div class="planner-grid">
    <section class="card"><h2>Income — ${money(income)} a month</h2>${incomeRows}
      <p class="card-note">Add a line of your own in the Tracker later; for now, edit the two lines this household actually has.</p>
      <h2>Expenses — ${money(spent)} a month</h2><div class="expense-list">${expenseRows}</div></section>
    <div class="planner-side">
      <section class="card result-card" id="planner-result">${plannerSummary(h)}</section>
      <section class="card"><h2>Try a what-if</h2><div class="whatif-list">${whatIf}</div>
        <p class="card-note">Each button changes the numbers above, so you can see the effect before you commit to it in real life.</p></section>
    </div>
  </div>`;
}

export function scenarios() {
  const cards = HOUSEHOLDS.map((h) => {
    const income = totalIncome(h);
    const spent = totalExpenses(h);
    const rate = savingsRate(h);
    const top = CATEGORIES.map((c) => ({ ...c, value: h.expenses[c.key] || 0 }))
      .sort((a, b) => b.value - a.value).slice(0, 3);
    return `<article class="card household-card">
      <p class="eyebrow">${escape(h.household)}</p>
      <h2>${escape(h.name)}</h2>
      <p class="household-tag">${escape(h.tagline)}</p>
      <dl class="household-figures">
        <div><dt>Income</dt><dd>${money(income)}</dd></div>
        <div><dt>Spending</dt><dd>${money(spent)}</dd></div>
        <div><dt>Saved</dt><dd>${money(income - spent)} · ${rate.toFixed(1)}%</dd></div>
      </dl>
      <h3>Biggest costs</h3>
      <ul class="top-costs">${top.map((c) => `<li><span><i class="dot" style="background:${c.color}"></i>${c.label}</span><b>${money(c.value)}</b></li>`).join('')}</ul>
      <p>${escape(h.note)}</p>
      <p><a class="btn" href="#/planner?household=${h.id}">Load into the planner →</a></p>
    </article>`;
  }).join('');
  return `<section class="page-head">
    <p class="eyebrow">Three households · November 2026</p>
    <h1>Real budgets, not averages.</h1>
    <p class="lede">Averages hide the truth: a family with childcare and a retiree with a pension live in different worlds. Compare three real monthly budgets, then load any of them into the Planner and pull it apart.</p>
  </section>
  <div class="household-grid">${cards}</div>
  <section class="card"><h2>What the three budgets teach</h2>
    <ol class="lessons">
      <li><strong>Housing decides everything.</strong> It is 29% of the Rivera income, 32% of Maya's, 25% of the Okafors'. No grocery trick beats a housing decision.</li>
      <li><strong>One lever is worth more than ten small ones.</strong> For the Riveras, groceries ($720) move the month more than every subscription combined ($85).</li>
      <li><strong>A savings rate above 20% is reachable at every income here</strong> — 19.6% for the Riveras, 27.3% for Maya, 24.8% for the Okafors — because each household automates the transfer on payday.</li>
    </ol></section>`;
}

export function tracker(filter, added = []) {
  const all = [...added, ...TRANSACTIONS];
  const list = filter === 'all' ? all : all.filter((t) => t.category === filter);
  const spent = list.reduce((a, t) => a + t.amount, 0);
  const chips = [{ key: 'all', label: 'All spending' }, ...CATEGORIES.filter((c) => TRANSACTIONS.some((t) => t.category === c.key))]
    .map((c) => `<a class="chip${filter === c.key ? ' active' : ''}" href="#/tracker${c.key === 'all' ? '' : '?category=' + c.key}">${c.label}</a>`)
    .join('');
  const rows = list.map((t) => `<tr><td>${t.date}</td><td>${escape(t.merchant)}${t.added ? ' <em>(added)</em>' : ''}</td><td><span class="cat-tag" style="--cat:${categoryByKey(t.category).color}">${categoryByKey(t.category).label}</span></td><td class="amount">${moneyCents(t.amount)}</td></tr>`).join('');
  return `<section class="page-head">
    <p class="eyebrow">Tracker · November 2026 · The Rivera family</p>
    <h1>Where November actually went.</h1>
    <p class="lede">${all.length} logged purchases, ${moneyCents(spent)} in this view. Add your own below — it joins the table straight away and the totals update.</p>
  </section>
  <section class="card"><h2>Filter by category</h2><div class="chips">${chips}</div>
    <p class="card-note">${list.length} purchase${list.length === 1 ? '' : 's'} · ${moneyCents(spent)} total in this view.</p>
    <div class="table-wrap"><table class="ledger">
      <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="amount">Amount</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="4">Nothing logged in this category yet.</td></tr>'}</tbody>
    </table></div></section>
  <section class="card"><h2>Add a purchase</h2>
    <form id="add-expense" class="add-form">
      <label>Date <input type="text" name="date" value="Nov 25" required></label>
      <label>What <input type="text" name="merchant" placeholder="e.g. GreenMart supermarket" required></label>
      <label>Category <select name="category">${CATEGORIES.map((c) => `<option value="${c.key}">${c.label}</option>`).join('')}</select></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="42.50" required></label>
      <button class="btn" type="submit">Add to November</button>
    </form>
    <p class="card-note">The entry is added to the table above and counted in the totals. It lives only in this browser tab — refresh and the log returns to the sixteen real purchases.</p></section>`;
}

export function goals() {
  const cards = GOALS.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    const remaining = g.target - g.saved;
    const months = Math.ceil(remaining / g.monthly);
    return `<article class="card goal-card">
      <h2>${escape(g.name)}</h2>
      <p class="goal-figures"><strong>${money(g.saved)}</strong> of ${money(g.target)} <span>· ${pct}%</span></p>
      <div class="goal-track" role="img" aria-label="${escape(g.name)} ${pct} percent funded"><div class="goal-fill" style="width:${pct}%"></div></div>
      <p>${escape(g.note)}</p>
      <dl class="goal-meta">
        <div><dt>Still to save</dt><dd>${money(remaining)}</dd></div>
        <div><dt>Monthly</dt><dd>${money(g.monthly)}</dd></div>
        <div><dt>Done in</dt><dd>${months} month${months === 1 ? '' : 's'}</dd></div>
      </dl>
    </article>`;
  }).join('');
  const totalSaved = GOALS.reduce((a, g) => a + g.saved, 0);
  const totalTarget = GOALS.reduce((a, g) => a + g.target, 0);
  return `<section class="page-head">
    <p class="eyebrow">Goals · The Rivera family</p>
    <h1>Four goals, four finish lines.</h1>
    <p class="lede">A budget without a goal is just a list of limits. These four hold ${money(totalSaved)} of ${money(totalTarget)} — 46% funded — with ${money(GOALS.reduce((a, g) => a + g.monthly, 0))} a month flowing into them.</p>
  </section>
  <div class="goal-grid">${cards}</div>
  <section class="card"><h2>How the dates work</h2>
    <p>Each goal's finish date is simple arithmetic: what is left, divided by the monthly contribution. Raise the monthly amount in the Planner and the dates move closer — that is the whole point of budgeting: the numbers on this page are the reason the numbers on the Planner page matter.</p>
    <p><a class="btn" href="#/planner">Adjust the monthly amounts in the Planner →</a></p></section>`;
}

export function tips() {
  const total = TIPS.reduce((a, t) => a + t.save, 0);
  const rows = TIPS.map((t, i) => `<article class="card tip-card">
    <span class="tip-rank">${i + 1}</span>
    <div><h2>${escape(t.title)}</h2>
    <p><span class="cat-tag" style="--cat:${categoryByKey(t.category).color}">${categoryByKey(t.category).label}</span></p>
    <p>${escape(t.text)}</p></div>
    <p class="tip-save">Saves <strong>${money(t.save)}</strong><span>/ month</span></p>
  </article>`).join('');
  return `<section class="page-head">
    <p class="eyebrow">Saving tips · priced for the Rivera household</p>
    <h1>Eight moves worth ${money(total)} a month.</h1>
    <p class="lede">Generic advice is useless; these tips are priced against the Rivera family's actual November spending, biggest saving first. Do the top three and the savings rate jumps from 19.6% to 24.1%.</p>
  </section>
  <div class="tip-grid">${rows}</div>
  <section class="card"><h2>The rule behind all eight</h2>
    <p>Cut the biggest category first, automate the saving on payday, and make the easy choice the default — a meal plan on the fridge, one takeaway night, subscriptions that have to be renewed by hand. Willpower is a bad budgeting tool; defaults are a good one.</p>
    <p><a class="btn" href="#/planner">Test the top three in the Planner →</a></p></section>`;
}

export function missing() {
  return `<section class="page-head"><h1>That page is not in the budget.</h1>
  <p class="lede">There is no page at this address. The site has six sections — start at the Dashboard.</p>
  <p><a class="btn" href="#/">Back to the Dashboard →</a></p></section>`;
}
