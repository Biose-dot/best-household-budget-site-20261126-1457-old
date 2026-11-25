// NestEgg charts: small SVG charts drawn from numbers, no library, no network.
// Every chart is a pure function of its data, so the same numbers always draw
// the same picture.

import { CATEGORIES, money } from './data.js';

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const [sx, sy] = polar(cx, cy, r, startAngle);
  const [ex, ey] = polar(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}

// Donut of spending by category. Centre shows the total.
export function donutChart(expenses, size = 260) {
  const entries = CATEGORIES.map((c) => ({ ...c, value: expenses[c.key] || 0 })).filter((c) => c.value > 0);
  const total = entries.reduce((a, c) => a + c.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  let angle = 0;
  const slices = entries
    .map((c) => {
      const sweep = total === 0 ? 0 : (c.value / total) * 360;
      const start = angle;
      angle += sweep;
      if (sweep <= 0.01) return '';
      if (sweep >= 359.99) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c.color}" stroke-width="34"/>`;
      return `<path d="${arcPath(cx, cy, r, start, angle - 0.6)}" fill="none" stroke="${c.color}" stroke-width="34" stroke-linecap="butt"/>`;
    })
    .join('');
  const legend = entries
    .slice(0, 8)
    .map(
      (c) =>
        `<li><span class="dot" style="background:${c.color}"></span>${c.label}<b>${money(c.value)}</b></li>`,
    )
    .join('');
  return `<div class="donut-wrap">
    <svg class="donut" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category, total ${money(total)}">
      ${slices}
      <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-total">${money(total)}</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-label">spent in November</text>
    </svg>
    <ul class="donut-legend">${legend}</ul>
  </div>`;
}

// Monthly bars: income (light) against spending (dark) for six months.
export function monthBars(months, width = 560, height = 220) {
  const max = Math.max(...months.map((m) => Math.max(m.income, m.spent))) * 1.08;
  const gap = width / months.length;
  const barW = 26;
  const bars = months
    .map((m, i) => {
      const x = i * gap + (gap - barW * 2 - 6) / 2;
      const ih = (m.income / max) * (height - 34);
      const sh = (m.spent / max) * (height - 34);
      return `<rect x="${x.toFixed(0)}" y="${(height - 30 - ih).toFixed(0)}" width="${barW}" height="${ih.toFixed(0)}" rx="3" fill="#c9d6c9"/>
      <rect x="${(x + barW + 6).toFixed(0)}" y="${(height - 30 - sh).toFixed(0)}" width="${barW}" height="${sh.toFixed(0)}" rx="3" fill="#1e4d3b"/>
      <text x="${(i * gap + gap / 2).toFixed(0)}" y="${height - 10}" text-anchor="middle" class="bar-label">${m.month}</text>`;
    })
    .join('');
  return `<svg class="bars" viewBox="0 0 ${width} ${height}" role="img" aria-label="Income against spending, June to November">
    ${bars}
  </svg>
  <p class="chart-key"><span><i class="swatch" style="background:#c9d6c9"></i>Income</span><span><i class="swatch" style="background:#1e4d3b"></i>Spending</span></p>`;
}

// Savings-rate gauge: a half-donut from 0 to 50%.
export function savingsGauge(rate, width = 300, height = 170) {
  const clamped = Math.max(0, Math.min(50, rate));
  const cx = width / 2;
  const cy = height - 14;
  const r = 120;
  const arc = (v) => {
    const end = 180 - (v / 50) * 180;
    return arcPath(cx, cy, r, 180, end);
  };
  return `<svg class="gauge" viewBox="0 0 ${width} ${height}" role="img" aria-label="Savings rate ${rate.toFixed(1)} percent">
    <path d="${arc(50)}" fill="none" stroke="#e7dfcf" stroke-width="22" stroke-linecap="round"/>
    <path d="${arc(clamped)}" fill="none" stroke="#2e7d5b" stroke-width="22" stroke-linecap="round"/>
    <text x="${cx}" y="${cy - 26}" text-anchor="middle" class="gauge-value">${rate.toFixed(1)}%</text>
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="gauge-label">of income saved</text>
  </svg>`;
}

// 50/30/20 comparison bars: needs / wants / savings as shares of income.
export function ruleBars(needs, wants, savings) {
  const row = (label, pct, color, note) => `<div class="rule-row">
    <span class="rule-name">${label}</span>
    <div class="rule-track"><div class="rule-fill" style="width:${Math.min(100, pct).toFixed(1)}%;background:${color}"></div></div>
    <span class="rule-pct">${pct.toFixed(0)}%</span>
    <span class="rule-note">${note}</span>
  </div>`;
  return `<div class="rule-bars">
    ${row('Needs', needs, '#1e4d3b', 'target 50%')}
    ${row('Wants', wants, '#c98a2e', 'target 30%')}
    ${row('Savings', savings, '#2e7d5b', 'target 20%')}
  </div>`;
}
