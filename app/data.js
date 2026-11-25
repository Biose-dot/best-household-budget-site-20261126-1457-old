// NestEgg data: the figures every page works from. All amounts are US dollars
// for one month, November 2026. Nothing here is fetched: the site runs offline.

export const CATEGORIES = [
  { key: 'housing', label: 'Housing', color: '#1e4d3b', hint: 'Rent or mortgage, insurance, property tax' },
  { key: 'groceries', label: 'Groceries', color: '#2e7d5b', hint: 'Supermarket, market stall, pantry staples' },
  { key: 'transport', label: 'Transport', color: '#c98a2e', hint: 'Fuel, fares, car upkeep, parking' },
  { key: 'childcare', label: 'Childcare', color: '#8a5a2b', hint: 'Nursery, after-school care, school costs' },
  { key: 'utilities', label: 'Utilities', color: '#5b8a72', hint: 'Electricity, water, gas, internet, phone' },
  { key: 'dining', label: 'Dining out', color: '#c25e3a', hint: 'Restaurants, takeaway, coffee out' },
  { key: 'entertainment', label: 'Entertainment', color: '#7a6aa8', hint: 'Streaming, cinema, outings, games' },
  { key: 'health', label: 'Health', color: '#3a7d8c', hint: 'Pharmacy, dentist, gym, insurance top-ups' },
  { key: 'clothing', label: 'Clothing', color: '#a86a8c', hint: 'Clothes and shoes for the whole household' },
  { key: 'subscriptions', label: 'Subscriptions', color: '#6b7f59', hint: 'Apps, memberships, cloud storage' },
  { key: 'personal', label: 'Personal', color: '#946b2d', hint: 'Haircuts, toiletries, gifts, pocket money' },
  { key: 'other', label: 'Everything else', color: '#8c8c7a', hint: 'The small stuff that adds up' },
];

export const MONTHS = [
  { month: 'Jun', income: 6400, spent: 5280 },
  { month: 'Jul', income: 6400, spent: 5410 },
  { month: 'Aug', income: 6550, spent: 5195 },
  { month: 'Sep', income: 6400, spent: 5060 },
  { month: 'Oct', income: 6400, spent: 4985 },
  { month: 'Nov', income: 6400, spent: 5145 },
];

// Three real households. Each one loads into the Planner with one click.
export const HOUSEHOLDS = [
  {
    id: 'rivera',
    name: 'The Rivera family',
    tagline: 'Two parents, two children, one mortgage — and a holiday fund to fill.',
    household: '2 adults + 2 children · Own home · November 2026',
    income: { 'Take-home pay': 5800, 'Weekend market stall': 600 },
    expenses: {
      housing: 1850, groceries: 720, transport: 480, childcare: 650,
      utilities: 260, dining: 240, entertainment: 180, health: 210,
      clothing: 120, subscriptions: 85, personal: 200, other: 150,
    },
    savingsTarget: 1255,
    note: 'The Riveras run about 67% needs, 13% wants, 20% saved — childcare pushes needs well above the 50% rule, and that is normal for a young family. Their biggest lever is groceries — a weekly meal plan cut $140 a month.',
  },
  {
    id: 'chen',
    name: 'Maya Chen',
    tagline: 'One salary, one flat, and a deposit fund growing faster than rent.',
    household: '1 adult · Rented flat · November 2026',
    income: { 'Take-home pay': 3900, 'Freelance design': 300 },
    expenses: {
      housing: 1350, groceries: 380, transport: 220, childcare: 0,
      utilities: 150, dining: 260, entertainment: 140, health: 130,
      clothing: 90, subscriptions: 65, personal: 180, other: 90,
    },
    savingsTarget: 1145,
    note: 'Maya saves 27% of her income. Her rule: every freelance dollar goes straight to the deposit fund, before it can be spent.',
  },
  {
    id: 'okafor',
    name: 'The Okafors',
    tagline: 'Retired, mortgage-free, and budgeting so the pension lasts.',
    household: '2 adults · Retired · Mortgage-free · November 2026',
    income: { 'Pension': 2900, 'Part-time bookkeeping': 950 },
    expenses: {
      housing: 950, groceries: 520, transport: 260, childcare: 0,
      utilities: 210, dining: 150, entertainment: 110, health: 340,
      clothing: 70, subscriptions: 45, personal: 140, other: 100,
    },
    savingsTarget: 955,
    note: 'The Okafors keep a $955 monthly buffer for travel and grandchildren. Health is their largest rising cost, so they review it every quarter.',
  },
];

// November spending log for the Rivera household, newest first.
export const TRANSACTIONS = [
  { date: 'Nov 24', merchant: 'GreenMart supermarket', category: 'groceries', amount: 86.40 },
  { date: 'Nov 23', merchant: 'City bus monthly pass', category: 'transport', amount: 72.00 },
  { date: 'Nov 22', merchant: 'Little Owls nursery', category: 'childcare', amount: 325.00 },
  { date: 'Nov 21', merchant: 'Pasta & Co. (family dinner)', category: 'dining', amount: 58.20 },
  { date: 'Nov 20', merchant: 'Power & Light Co.', category: 'utilities', amount: 118.60 },
  { date: 'Nov 19', merchant: 'GreenMart supermarket', category: 'groceries', amount: 94.15 },
  { date: 'Nov 18', merchant: 'Cinema — two tickets', category: 'entertainment', amount: 26.00 },
  { date: 'Nov 17', merchant: 'Fuel — Shell station', category: 'transport', amount: 41.50 },
  { date: 'Nov 16', merchant: 'Pharmacy — prescriptions', category: 'health', amount: 34.80 },
  { date: 'Nov 14', merchant: 'GreenMart supermarket', category: 'groceries', amount: 112.30 },
  { date: 'Nov 12', merchant: 'Streaming bundle', category: 'subscriptions', amount: 28.99 },
  { date: 'Nov 10', merchant: 'Kids’ shoes — Shoe Barn', category: 'clothing', amount: 46.00 },
  { date: 'Nov 08', merchant: 'Takeaway pizza Friday', category: 'dining', amount: 32.75 },
  { date: 'Nov 05', merchant: 'Haircuts — both kids', category: 'personal', amount: 38.00 },
  { date: 'Nov 02', merchant: 'Mortgage — First National', category: 'housing', amount: 1850.00 },
  { date: 'Nov 01', merchant: 'Internet & phone', category: 'utilities', amount: 89.00 },
];

export const GOALS = [
  { name: 'Emergency fund', target: 10000, saved: 6400, monthly: 400, note: 'Six months of essentials, kept in a separate savings account.' },
  { name: 'Family holiday — coast', target: 2400, saved: 1850, monthly: 150, note: 'A week by the sea in July. Booked once the fund hits $2,400.' },
  { name: 'Replace the family car', target: 8000, saved: 2300, monthly: 250, note: 'The old hatchback is on 148,000 miles. Target: buy outright, no loan.' },
  { name: 'House deposit top-up', target: 25000, saved: 9750, monthly: 455, note: 'Extra equity for the next move. Every freelance dollar helps.' },
];

// Saving tips, each tied to a category and priced per month for the Rivera household.
export const TIPS = [
  { category: 'groceries', title: 'Plan five dinners, shop once', save: 140, text: 'A weekly meal plan with a list stops the three extra trips that add $35 a week. Cook double on Sunday and freeze the second batch.' },
  { category: 'dining', title: 'One takeaway night, not three', save: 95, text: 'The Riveras spent $240 eating out. Keeping Friday pizza and cooking the other nights saves about $95 a month — and the kids still get their Friday.' },
  { category: 'subscriptions', title: 'Audit the auto-renewals', save: 32, text: 'Two streaming services, a cloud plan and a gym app nobody opened since August. Cancelling two of them frees $32 a month.' },
  { category: 'transport', title: 'Batch the errands', save: 55, text: 'One combined Saturday run instead of four separate drives saves roughly a tank of fuel a month — about $55 at current prices.' },
  { category: 'utilities', title: 'Drop the thermostat 1°C', save: 28, text: 'One degree lower, jumpers on, and a draught strip on the front door. Heating is the largest utility line in winter.' },
  { category: 'entertainment', title: 'Swap one cinema trip for a film night', save: 24, text: 'Popcorn at home, the same film a month later. Two swaps a month saves $24 and the children argue less about bedtime.' },
  { category: 'health', title: 'Ask for the generic prescription', save: 18, text: 'The same active ingredient, a third of the price. Worth asking the pharmacist every time.' },
  { category: 'personal', title: 'A 48-hour rule for non-essentials', save: 60, text: 'Anything over $30 waits two days. Most of it never gets bought — about $60 a month stays in the account.' },
];

export const RULE_503020 = { needs: 50, wants: 30, savings: 20 };
export const NEEDS = ['housing', 'groceries', 'transport', 'childcare', 'utilities', 'health', 'clothing'];
export const WANTS = ['dining', 'entertainment', 'subscriptions', 'personal', 'other'];

export function money(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function moneyCents(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function categoryByKey(key) {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[CATEGORIES.length - 1];
}

export function totalIncome(household) {
  return Object.values(household.income).reduce((a, b) => a + b, 0);
}

export function totalExpenses(household) {
  return Object.values(household.expenses).reduce((a, b) => a + b, 0);
}

export function savingsRate(household) {
  const income = totalIncome(household);
  return income === 0 ? 0 : ((income - totalExpenses(household)) / income) * 100;
}

// Health score 0–100: savings rate, needs share and buffer all count.
export function healthScore(household) {
  const income = totalIncome(household);
  const spent = totalExpenses(household);
  const rate = income === 0 ? 0 : (income - spent) / income;
  const needs = NEEDS.reduce((a, k) => a + (household.expenses[k] || 0), 0);
  const needsShare = income === 0 ? 1 : needs / income;
  let score = 40 + Math.max(0, Math.min(40, rate * 160));
  if (needsShare <= 0.55) score += 12;
  else if (needsShare <= 0.65) score += 6;
  if (spent <= income) score += 8;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function healthVerdict(score) {
  if (score >= 85) return { label: 'Excellent', text: 'This budget has room to breathe: savings are strong and needs are under control.' };
  if (score >= 70) return { label: 'Healthy', text: 'A solid budget. A small trim in one or two wants would lift the savings rate further.' };
  if (score >= 50) return { label: 'Tight', text: 'The budget works, but there is little slack. Watch the wants — they are the first place to find room.' };
  return { label: 'Overstretched', text: 'Spending is at or above income. Start with the biggest category and one what-if change.' };
}
