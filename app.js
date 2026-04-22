/**
 * Home Maintenance Tracker — app.js
 *
 * Data model
 * ----------
 * DEFAULT_TASKS       (from tasks-data.js) — immutable seed data, keyed by month (1-12).
 * STATE.userState     (localStorage)       — per-task overlay + user-added tasks:
 *   {
 *     overlay: {               // keyed by task id
 *       "<id>": { completed, completedAt, deadline, notes }
 *     },
 *     customTasks: [           // user-added tasks
 *       { id, title, description, category, priority, estTimeMin, month, custom: true }
 *     ],
 *     completedDates: {}       // maps YYYY-MM-DD of completion (for analytics/future)
 *   }
 *
 * No backend. Everything is in localStorage under key "hm_state_v1".
 */

const STORAGE_KEY = 'hm_state_v1';

/* -------------------- Feedback config -------------------- */
/**
 * How feedback is delivered. You can use any combination.
 *
 *   GA events      — always on (uses the same gtag placeholder as the rest of the app).
 *                    Check GA4 → Engagement → Events for "paid_interest" and "feedback_submitted".
 *   Form endpoint  — paste a Formspree (https://formspree.io/f/xxxx) or Web3Forms URL to
 *                    have each submission emailed to you as JSON.
 *   Mailto         — if both of the above are empty, submit opens a pre-filled email
 *                    to FEEDBACK_CONFIG.fallbackEmail.
 */
const FEEDBACK_CONFIG = {
  formEndpoint: '',                // e.g. 'https://formspree.io/f/abcdxyz'
  fallbackEmail: 'o76ls7kwg@mozmail.com',
};

const FEEDBACK_FEATURES = [
  { id: 'sync',          label: 'Sync across devices & household',       description: 'My spouse and I see the same list on every device.' },
  { id: 'reminders',     label: 'Email or SMS reminders',                description: 'Ping me the Sunday before each task is due.' },
  { id: 'gcal',          label: 'Google Calendar / iCal export',         description: 'Auto-add deadlines to my calendar.' },
  { id: 'zip_climate',   label: 'ZIP-based climate tuning',              description: 'Shift timing by my frost dates — Duluth vs Kansas City are weeks apart.' },
  { id: 'weather',       label: 'Weather-aware alerts',                  description: '"Hard freeze Thursday — disconnect your hoses."' },
  { id: 'receipts',      label: 'Photo receipts & warranty vault',       description: 'Snap a service receipt; I never lose it at resale time.' },
  { id: 'home_profile',  label: 'Home profile (septic, pool, sprinkler)', description: 'Tailored tasks for what I actually own.' },
  { id: 'pro_market',    label: 'Local pro directory & booking',         description: 'Vetted HVAC / chimney / sprinkler pros in my ZIP.' },
  { id: 'home_binder',   label: 'Annual "home binder" PDF',              description: 'One-click summary of what I did this year for resale or refi.' },
  { id: 'cost_tracking', label: 'Cost tracking & benchmarks',            description: '"You spent $X — average for your home size is $Y."' },
];

const STATE = {
  currentView: 'dashboard', // 'dashboard' | 'months'
  currentMonth: new Date().getMonth() + 1, // 1-12
  filterCategory: '',
  filterStatus: 'all',
  userState: {
    overlay: {},
    customTasks: [],
  },
};

/* -------------------- Persistence -------------------- */

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data && typeof data === 'object') {
      STATE.userState.overlay = data.overlay || {};
      STATE.userState.customTasks = data.customTasks || [];
    }
  } catch (err) {
    console.warn('Failed to load state', err);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE.userState));
  } catch (err) {
    console.warn('Failed to save state', err);
  }
}

/* -------------------- Task helpers -------------------- */

function getAllTasksForMonth(month) {
  const defaults = DEFAULT_TASKS[month] || [];
  const custom = STATE.userState.customTasks.filter(t => t.month === month);
  return [...defaults, ...custom].map(task => {
    const overlay = STATE.userState.overlay[task.id] || {};
    return {
      ...task,
      month,
      completed: !!overlay.completed,
      completedAt: overlay.completedAt || null,
      deadline: overlay.deadline || null,
      notes: overlay.notes || '',
      custom: !!task.custom,
    };
  });
}

function getAllTasks() {
  const all = [];
  for (let m = 1; m <= 12; m++) all.push(...getAllTasksForMonth(m));
  return all;
}

function isOverdue(task) {
  if (task.completed) return false;
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();
  if (task.deadline) {
    // Deadline string: YYYY-MM-DD
    return new Date(task.deadline + 'T23:59:59') < today;
  }
  // Default rule: a task is overdue if its month is in the past within the current year.
  // (We compare only within the current calendar year to avoid permanent red flags.)
  return task.month < todayMonth && todayYear === new Date().getFullYear();
}

function setTaskOverlay(id, patch) {
  const cur = STATE.userState.overlay[id] || {};
  STATE.userState.overlay[id] = { ...cur, ...patch };
  saveState();
}

function toggleComplete(id) {
  const cur = STATE.userState.overlay[id] || {};
  const newCompleted = !cur.completed;
  setTaskOverlay(id, {
    completed: newCompleted,
    completedAt: newCompleted ? new Date().toISOString() : null,
  });
  trackEvent(newCompleted ? 'task_completed' : 'task_uncompleted', { task_id: id });
}

function deleteCustomTask(id) {
  STATE.userState.customTasks = STATE.userState.customTasks.filter(t => t.id !== id);
  delete STATE.userState.overlay[id];
  saveState();
  trackEvent('task_deleted', { task_id: id });
}

function addCustomTask({ title, description, month, category, priority, estTimeMin }) {
  const id = 'custom-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
  STATE.userState.customTasks.push({
    id,
    title,
    description,
    category,
    priority,
    estTimeMin: Number(estTimeMin) || 30,
    month: Number(month),
    custom: true,
  });
  saveState();
  trackEvent('task_added', { category, month: Number(month) });
  return id;
}

/* -------------------- Analytics -------------------- */

function trackEvent(eventName, params = {}) {
  if (typeof gtag === 'function') {
    try { gtag('event', eventName, params); } catch (e) { /* no-op */ }
  }
}

function trackView(viewName) {
  if (typeof gtag === 'function') {
    try { gtag('event', 'page_view', { page_title: viewName, page_location: location.href }); } catch (e) {}
  }
}

/* -------------------- Rendering -------------------- */

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

function renderTaskItem(task, opts = {}) {
  const li = el('li', 'task-item' + (task.completed ? ' completed' : ''));
  li.dataset.taskId = task.id;
  li.tabIndex = 0;
  li.setAttribute('role', 'button');

  const check = el('span', 'check');
  check.setAttribute('aria-label', task.completed ? 'Mark incomplete' : 'Mark complete');
  check.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleComplete(task.id);
    render();
  });
  li.appendChild(check);

  const body = el('div', 'task-body');
  body.appendChild(el('p', 'task-title', task.title));

  if (opts.showDescription) {
    body.appendChild(el('p', 'task-desc', task.description || ''));
  }

  const meta = el('div', 'task-meta');
  meta.appendChild(chip('priority-' + task.priority, task.priority.toUpperCase()));
  if (task.category) meta.appendChild(categoryChip(task.category));
  if (opts.showMonth) meta.appendChild(el('span', 'muted', MONTH_NAMES_SHORT[task.month - 1]));
  if (isOverdue(task)) meta.appendChild(chip('overdue', 'OVERDUE'));
  if (task.deadline) meta.appendChild(el('span', 'muted', '📅 ' + formatDate(task.deadline)));
  body.appendChild(meta);
  li.appendChild(body);

  li.addEventListener('click', () => openTaskDetail(task.id));
  li.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openTaskDetail(task.id);
    }
  });

  return li;
}

function chip(extraClass, text) {
  const c = el('span', 'chip ' + extraClass, text);
  return c;
}

function categoryChip(category) {
  const c = el('span', 'chip');
  c.textContent = category;
  const color = (typeof CATEGORY_COLORS !== 'undefined' && CATEGORY_COLORS[category]) || '#334155';
  c.style.background = color;
  return c;
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/* -------------------- Dashboard view -------------------- */

function renderDashboard() {
  const month = STATE.currentMonth;
  const tasks = getAllTasksForMonth(month);
  const completedCount = tasks.filter(t => t.completed).length;
  const openCount = tasks.length - completedCount;

  // All overdue across year
  const overdue = getAllTasks().filter(t => isOverdue(t));

  document.getElementById('hero-eyebrow').textContent =
    'This month · ' + new Date().toLocaleDateString(undefined, { year: 'numeric' });
  document.getElementById('hero-month').textContent = MONTH_NAMES[month - 1];
  document.getElementById('hero-sub').textContent =
    openCount === 0
      ? `Nice! You've knocked out all ${tasks.length} ${MONTH_NAMES[month - 1]} tasks.`
      : `${openCount} open, ${completedCount} done so far.`;

  // Stats
  const stats = document.getElementById('hero-stats');
  stats.innerHTML = '';
  stats.appendChild(makeStat(openCount, 'Open'));
  stats.appendChild(makeStat(completedCount, 'Done'));
  stats.appendChild(makeStat(overdue.length, 'Overdue'));

  // Open tasks this month
  const openList = document.getElementById('dash-open-tasks');
  openList.innerHTML = '';
  const openTasks = tasks.filter(t => !t.completed)
    .sort((a, b) => priorityOrder(b.priority) - priorityOrder(a.priority))
    .slice(0, 6);
  if (openTasks.length === 0) {
    openList.appendChild(emptyItem('All tasks for this month are complete.'));
  } else {
    openTasks.forEach(t => openList.appendChild(renderTaskItem(t)));
  }

  // Overdue
  const overdueList = document.getElementById('dash-overdue-tasks');
  overdueList.innerHTML = '';
  document.getElementById('overdue-count').textContent = overdue.length;
  if (overdue.length === 0) {
    overdueList.appendChild(emptyItem('Nothing overdue. You\'re on top of it!'));
  } else {
    overdue.slice(0, 6).forEach(t => overdueList.appendChild(renderTaskItem(t, { showMonth: true })));
  }

  // Year grid
  const yearGrid = document.getElementById('year-grid');
  yearGrid.innerHTML = '';
  const currentMonth = new Date().getMonth() + 1;
  for (let m = 1; m <= 12; m++) {
    const monthTasks = getAllTasksForMonth(m);
    const done = monthTasks.filter(t => t.completed).length;
    const pct = monthTasks.length ? Math.round((done / monthTasks.length) * 100) : 0;
    const card = el('div', 'month-card' + (m === currentMonth ? ' current' : ''));
    card.appendChild(el('div', 'month-card-name', MONTH_NAMES[m - 1]));
    const bar = el('div', 'month-card-progress');
    const fill = el('div', 'month-card-progress-fill');
    fill.style.width = pct + '%';
    bar.appendChild(fill);
    card.appendChild(bar);
    card.appendChild(el('div', 'month-card-count', `${done} of ${monthTasks.length} done`));
    card.addEventListener('click', () => {
      STATE.currentMonth = m;
      switchView('months');
    });
    yearGrid.appendChild(card);
  }
}

function makeStat(value, label) {
  const wrap = el('div', 'stat');
  const v = el('span', 'stat-value', value);
  const l = el('span', 'stat-label', label);
  wrap.appendChild(v);
  wrap.appendChild(l);
  return wrap;
}

function emptyItem(msg) {
  const li = el('li', 'empty', msg);
  return li;
}

function priorityOrder(p) { return p === 'high' ? 3 : p === 'medium' ? 2 : 1; }

/* -------------------- Months view -------------------- */

function renderMonthsView() {
  const month = STATE.currentMonth;
  document.getElementById('month-title').textContent = MONTH_NAMES[month - 1];

  let tasks = getAllTasksForMonth(month);
  if (STATE.filterCategory) {
    tasks = tasks.filter(t => t.category === STATE.filterCategory);
  }
  if (STATE.filterStatus === 'open') {
    tasks = tasks.filter(t => !t.completed);
  } else if (STATE.filterStatus === 'completed') {
    tasks = tasks.filter(t => t.completed);
  }

  // Sort: open first, then by priority
  tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityOrder(b.priority) - priorityOrder(a.priority);
  });

  const list = document.getElementById('month-task-list');
  list.innerHTML = '';
  if (tasks.length === 0) {
    list.appendChild(emptyItem('No tasks match your filters.'));
    return;
  }
  tasks.forEach(t => list.appendChild(renderTaskItem(t, { showDescription: true })));
}

/* -------------------- Task detail drawer -------------------- */

let currentDetailId = null;

function openTaskDetail(id) {
  const task = getAllTasks().find(t => t.id === id);
  if (!task) return;
  currentDetailId = id;

  document.getElementById('detail-category').textContent = task.category;
  document.getElementById('detail-title').textContent = task.title;
  document.getElementById('detail-month').textContent = MONTH_NAMES[task.month - 1] +
    (task.custom ? ' · Custom task' : '');
  document.getElementById('detail-description').textContent = task.description || '';
  document.getElementById('detail-priority').textContent =
    task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  document.getElementById('detail-time').textContent = task.estTimeMin
    ? task.estTimeMin + ' min'
    : '—';
  document.getElementById('detail-deadline').value = task.deadline || '';
  document.getElementById('detail-notes').value = task.notes || '';

  const toggleBtn = document.getElementById('detail-toggle-complete');
  toggleBtn.textContent = task.completed ? 'Mark as open' : 'Mark complete';
  toggleBtn.className = 'btn ' + (task.completed ? 'btn-ghost' : 'btn-primary');

  const deleteBtn = document.getElementById('detail-delete');
  deleteBtn.classList.toggle('hidden', !task.custom);

  document.getElementById('task-detail').classList.remove('hidden');
  trackEvent('task_detail_view', { task_id: id, category: task.category });
}

function closeTaskDetail() {
  document.getElementById('task-detail').classList.add('hidden');
  currentDetailId = null;
}

/* -------------------- Add task modal -------------------- */

function openAddTaskModal() {
  const modal = document.getElementById('add-task-modal');
  const form = document.getElementById('add-task-form');
  form.reset();
  document.getElementById('add-month').value = String(STATE.currentMonth);
  modal.classList.remove('hidden');
  trackEvent('add_task_opened');
}

function closeAddTaskModal() {
  document.getElementById('add-task-modal').classList.add('hidden');
}

function populateAddTaskDropdowns() {
  const monthSel = document.getElementById('add-month');
  monthSel.innerHTML = '';
  MONTH_NAMES.forEach((m, i) => {
    const opt = document.createElement('option');
    opt.value = String(i + 1);
    opt.textContent = m;
    monthSel.appendChild(opt);
  });
  const catSel = document.getElementById('add-category');
  catSel.innerHTML = '';
  CATEGORIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    catSel.appendChild(opt);
  });

  // Category filter on months view
  const catFilter = document.getElementById('filter-category');
  // Clear existing options except first
  while (catFilter.children.length > 1) catFilter.removeChild(catFilter.lastChild);
  CATEGORIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    catFilter.appendChild(opt);
  });
}

/* -------------------- Feedback modal -------------------- */

function populateFeedbackChecklist() {
  const wrap = document.getElementById('feature-checklist');
  if (!wrap) return;
  wrap.innerHTML = '';
  FEEDBACK_FEATURES.forEach(feat => {
    const label = el('label', 'feature-option');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = 'features';
    input.value = feat.id;
    const body = el('div', 'feature-option-body');
    body.appendChild(el('span', 'feature-option-label', feat.label));
    body.appendChild(el('span', 'feature-option-desc', feat.description));
    label.appendChild(input);
    label.appendChild(body);
    wrap.appendChild(label);
  });
}

function openFeedbackModal() {
  const modal = document.getElementById('feedback-modal');
  const form = document.getElementById('feedback-form');
  const thanks = document.getElementById('feedback-thanks');
  form.reset();
  form.classList.remove('hidden');
  thanks.classList.add('hidden');
  modal.classList.remove('hidden');
  trackEvent('feedback_opened');
}

function closeFeedbackModal() {
  document.getElementById('feedback-modal').classList.add('hidden');
}

function buildMailtoUrl(to, payload) {
  const subject = encodeURIComponent('Home Maintenance App — paid feature feedback');
  const bodyLines = [
    'Features I\'d pay for:',
    ...payload.feature_labels.map(l => '  • ' + l),
    '',
    'Price tier: ' + payload.price_tier,
    '',
    'Comment:',
    payload.comment || '(none)',
    '',
    'Email: ' + (payload.email || '(not provided)'),
  ];
  const body = encodeURIComponent(bodyLines.join('\n'));
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

function submitFeedback(e) {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const features = fd.getAll('features');
  const price = fd.get('price') || '';
  const comment = (fd.get('comment') || '').trim();
  const email = (fd.get('email') || '').trim();

  // 1) Fire a GA event per feature so you can tally interest by feature in GA4.
  features.forEach(fid => {
    const meta = FEEDBACK_FEATURES.find(f => f.id === fid) || {};
    trackEvent('paid_interest', {
      feature_id: fid,
      feature_label: meta.label || fid,
      price_tier: price,
    });
  });
  // And one overall event so you can see submission volume.
  trackEvent('feedback_submitted', {
    feature_count: features.length,
    price_tier: price,
    has_comment: comment.length > 0,
    has_email: email.length > 0,
  });

  // 2) Optionally POST to a form endpoint (Formspree, Web3Forms, etc.)
  const payload = {
    features,
    feature_labels: features.map(fid => (FEEDBACK_FEATURES.find(f => f.id === fid) || {}).label || fid),
    price_tier: price,
    comment,
    email,
    submitted_at: new Date().toISOString(),
    page: typeof location !== 'undefined' ? location.href : '',
  };

  if (FEEDBACK_CONFIG.formEndpoint) {
    fetch(FEEDBACK_CONFIG.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(err => console.warn('Feedback POST failed:', err));
  } else if (FEEDBACK_CONFIG.fallbackEmail) {
    // 3) Fallback: open the user's email client with a pre-filled message.
    // Only open a mailto if the user actually checked at least one feature or wrote a comment,
    // otherwise we'd spam them with empty emails.
    if (features.length > 0 || comment.length > 0) {
      window.location.href = buildMailtoUrl(FEEDBACK_CONFIG.fallbackEmail, payload);
    }
  }

  // 4) Show the thank-you state.
  document.getElementById('feedback-form').classList.add('hidden');
  document.getElementById('feedback-thanks').classList.remove('hidden');
}

/* -------------------- View switching -------------------- */

function switchView(view) {
  STATE.currentView = view;
  document.getElementById('view-dashboard').classList.toggle('hidden', view !== 'dashboard');
  document.getElementById('view-months').classList.toggle('hidden', view !== 'months');
  document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  render();
  trackView(view);
  // Scroll up on view switch
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* -------------------- Main render -------------------- */

function render() {
  if (STATE.currentView === 'dashboard') {
    renderDashboard();
  } else if (STATE.currentView === 'months') {
    renderMonthsView();
  }
}

/* -------------------- Event wiring -------------------- */

function wireEvents() {
  // Top nav
  document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
  document.getElementById('btn-add-task').addEventListener('click', openAddTaskModal);
  document.getElementById('brand-home').addEventListener('click', () => switchView('dashboard'));
  document.getElementById('brand-home').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') switchView('dashboard');
  });

  // Month nav
  document.getElementById('prev-month').addEventListener('click', () => {
    STATE.currentMonth = STATE.currentMonth === 1 ? 12 : STATE.currentMonth - 1;
    render();
  });
  document.getElementById('next-month').addEventListener('click', () => {
    STATE.currentMonth = STATE.currentMonth === 12 ? 1 : STATE.currentMonth + 1;
    render();
  });
  document.getElementById('filter-category').addEventListener('change', (e) => {
    STATE.filterCategory = e.target.value;
    render();
  });
  document.getElementById('filter-status').addEventListener('change', (e) => {
    STATE.filterStatus = e.target.value;
    render();
  });

  // Dashboard buttons
  document.querySelectorAll('[data-goto-month]').forEach(btn => {
    btn.addEventListener('click', () => {
      STATE.currentMonth = new Date().getMonth() + 1;
      switchView('months');
    });
  });

  // Detail drawer
  document.querySelectorAll('[data-close-detail]').forEach(el => {
    el.addEventListener('click', closeTaskDetail);
  });
  document.getElementById('detail-toggle-complete').addEventListener('click', () => {
    if (!currentDetailId) return;
    toggleComplete(currentDetailId);
    openTaskDetail(currentDetailId); // refresh the drawer
    render();
  });
  document.getElementById('detail-deadline').addEventListener('change', (e) => {
    if (!currentDetailId) return;
    setTaskOverlay(currentDetailId, { deadline: e.target.value || null });
    render();
  });
  document.getElementById('detail-notes').addEventListener('input', (e) => {
    if (!currentDetailId) return;
    setTaskOverlay(currentDetailId, { notes: e.target.value });
  });
  document.getElementById('detail-delete').addEventListener('click', () => {
    if (!currentDetailId) return;
    if (!confirm('Delete this custom task? This cannot be undone.')) return;
    deleteCustomTask(currentDetailId);
    closeTaskDetail();
    render();
  });

  // Add-task modal
  document.querySelectorAll('[data-close-add]').forEach(el => {
    el.addEventListener('click', closeAddTaskModal);
  });
  document.getElementById('add-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addCustomTask({
      title:       fd.get('title').trim(),
      description: (fd.get('description') || '').trim(),
      month:       fd.get('month'),
      category:    fd.get('category'),
      priority:    fd.get('priority') || 'medium',
      estTimeMin:  fd.get('estTimeMin'),
    });
    closeAddTaskModal();
    render();
  });

  // Feedback
  const openFB = () => openFeedbackModal();
  document.getElementById('feedback-promo-btn').addEventListener('click', openFB);
  document.getElementById('feedback-promo').addEventListener('click', (e) => {
    // Don't double-fire when the inner button is clicked
    if (e.target.closest('#feedback-promo-btn')) return;
    openFB();
  });
  document.getElementById('feedback-promo').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFB(); }
  });
  document.getElementById('feedback-footer-btn').addEventListener('click', openFB);
  document.querySelectorAll('[data-close-feedback]').forEach(el => {
    el.addEventListener('click', closeFeedbackModal);
  });
  document.getElementById('feedback-form').addEventListener('submit', submitFeedback);

  // Reset
  document.getElementById('reset-defaults').addEventListener('click', () => {
    if (!confirm('Reset all progress and remove custom tasks? This cannot be undone.')) return;
    localStorage.removeItem(STORAGE_KEY);
    STATE.userState = { overlay: {}, customTasks: [] };
    trackEvent('reset_defaults');
    render();
  });

  // ESC closes drawers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTaskDetail();
      closeAddTaskModal();
      closeFeedbackModal();
    }
  });
}

/* -------------------- Bootstrap -------------------- */

function init() {
  loadState();
  populateAddTaskDropdowns();
  populateFeedbackChecklist();
  wireEvents();
  render();
  trackView('dashboard');
}

document.addEventListener('DOMContentLoaded', init);
