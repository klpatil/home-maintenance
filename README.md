# Midwest Home Maintenance Tracker

A simple, no-backend web app that helps Midwest homeowners stay on top of monthly
home maintenance tasks — lawn care, HVAC, plumbing, roof, safety checks, and
seasonal prep. Defaults are tuned for USDA zones 4b–5b (MN, WI, IA, IL, MI, IN,
OH, MO, NE, ND, SD, KS).

## Features

- **Dashboard** with current-month open tasks, overdue list, and a year-at-a-glance grid
- **Drill down** into any task for description, priority, estimated time, deadline, and notes
- **Default Midwest task library** covering lawn, HVAC, plumbing, roof, safety, exterior, interior, appliance, garage, and seasonal work
- **Add your own tasks** for any month
- **Strikethrough complete** with one click — progress persists in `localStorage`
- **No database, no accounts** — everything stays in the browser
- **Google Analytics (GA4)** tracking scaffolded in
- **Deploys to GitHub Pages** via a GitHub Actions workflow

## Tech stack

- Plain HTML, CSS, and vanilla JavaScript
- Browser `localStorage` for persistence
- GA4 via gtag.js snippet
- No frameworks, no bundler, no npm step

## Local preview

Just open `index.html` in any modern browser. Because it's all static, any of these work too:

```bash
# Python 3 (shipped on most Macs/Linux)
python3 -m http.server 8000

# Node (if you have it)
npx serve .
```

Then visit http://localhost:8000.

## Deploying to GitHub Pages

1. **Create the repo.** Push this folder to a new GitHub repository. The workflow
   assumes the default branch is `main`; edit `.github/workflows/deploy.yml` if yours is different.

2. **Enable Pages with GitHub Actions.**
   - Go to **Settings → Pages**
   - Under **Source**, choose **GitHub Actions**
   - You do **not** need to pick a branch — the workflow handles it

3. **Push to `main`.** The workflow in `.github/workflows/deploy.yml` runs automatically on push and deploys the site. You can also run it manually from the **Actions** tab (`workflow_dispatch`).

4. **Visit your site.** The URL shows up in the workflow run summary once it finishes — typically `https://<your-username>.github.io/<repo-name>/`.

## Paid-feature feedback widget

The dashboard has a "Help shape what's next" card (and a footer link) that opens a
modal with a checklist of future premium features (sync, reminders, calendar,
photo receipts, local pro marketplace, etc.). Users check what they'd pay for
and pick a price tier. **The core app remains free.**

How you see the results:

1. **Google Analytics (always on).** Every checked feature fires a `paid_interest`
   event with `feature_id`, `feature_label`, and `price_tier` params. Each
   submission also fires `feedback_submitted`. Open GA4 → Engagement → Events
   to tally interest by feature.

2. **Form endpoint (optional).** In `app.js`, set
   `FEEDBACK_CONFIG.formEndpoint` to a free-tier form service like
   [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) to
   also get each submission emailed to you as JSON.

3. **Mailto fallback.** If no form endpoint is set, the submit button opens the
   user's email client pre-filled with their choices and sends to
   `FEEDBACK_CONFIG.fallbackEmail`.

No backend required. No paywall. Just a low-friction way to validate demand
before you build anything.

## Google Analytics setup

The GA4 snippet is wired up in `index.html` with the placeholder Measurement ID `G-XXXXXXXXXX`. To activate it:

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)
3. In `index.html`, replace **both** occurrences of `G-XXXXXXXXXX` with your real ID
4. Commit and push — the deploy workflow will publish the updated site

The app sends custom events for completed tasks, added tasks, deleted tasks, drill-downs, and resets so you can see what homeowners actually use.

## Customizing default tasks

Open `tasks-data.js`. Tasks are grouped by month (1–12) as an array of objects:

```js
{
  id: 'may-02',
  title: 'First lawn fertilization',
  description: '…',
  category: 'Lawn',
  priority: 'medium',          // 'high' | 'medium' | 'low'
  estTimeMin: 45
}
```

`id` must be globally unique. `category` must match one of the entries in the
`CATEGORIES` array at the bottom of the file.

## File structure

```
.
├── index.html                  # Shell, dashboard, month view, drawers, GA snippet
├── styles.css                  # Clean/modern theme (blue accent, card layout)
├── app.js                      # State, localStorage, rendering, event wiring
├── tasks-data.js               # Default Midwest task library + constants
├── .github/workflows/deploy.yml
├── .nojekyll                   # Prevents Jekyll processing on Pages
└── README.md
```

## Roadmap ideas

- iCal/Google Calendar export of deadlines
- "Notify me" via browser notifications on the 1st of each month
- Climate-zone presets (Pacific NW, Southwest, Gulf Coast, etc.)
- Photo attachments per task (stored as base64 in localStorage or IndexedDB)
- Share a read-only view of your completed tasks with a spouse

## Credits

Lawn timing (mowing, crabgrass pre-emergent, aeration, seeding, fertilization,
dethatching, broadleaf weed control) follows the University of Minnesota
Extension's lawn care calendar. General home maintenance tasks are drawn from
Family Handyman, Consumer Reports, and state extension services.

## License

MIT.
