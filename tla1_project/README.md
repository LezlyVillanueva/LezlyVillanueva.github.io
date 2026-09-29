# Enterprise Income Category Registration (React Refactor)

A modular React application refactored from a Vanilla JavaScript DOM ledger into a component-driven architecture using **React**, **Vite**, and **Bootstrap 5**.

---

## Submission Links
- **GitHub Repository**: `https://github.com/LezlyVillanueva/LezlyVillanueva.github.io.git`
- **Vercel Live Deployment**: `https://react-income-ledger-sigma.vercel.app/`
---

## Highlights of Added Functional & UI Enhancements

Beyond the baseline Vanilla JS refactor, the following advanced features and design improvements were added to elevate the application:

1. **In-Table Item Management (Edit & Delete Actions)**
   - Added full CRUD capabilities directly in the table, allowing users to modify existing entries or remove categories dynamically with instant DOM re-rendering using `.map()` and `.filter()`.

2. **Category Target Income Amount & Dynamic Total Balance Card**
   - Expanded the registration schema to include an Estimated Target Amount (PHP) field per category and a live-updating Total Target Income summary card computed dynamically using `.reduce()`.

3. **Navy Blue Accent Enterprise UI**
   - Customized Bootstrap 5 styling with clean white card containers and dark navy blue accent headers (`#1B2A4A`) for an enterprise dashboard aesthetic.

---

## AI Implementation & Code Defense

### 1. Features Built with AI Assistance

- **DOM Refactoring to React Hooks**: Converted imperative DOM operations (`document.getElementById`, `insertAdjacentHTML`) into declarative state management using `useState`.
- **State Immutability Patterns**: Applied immutable state array transformations using spread operators (`[...]`), `.filter()` for item deletions, and `.map()` for in-table updates.
- **Derived State Computation**: Utilized array `.reduce()` to derive total target income dynamically from the categories array during render cycles.

---

### 2. Technical Architecture & Defense

#### Declarative State vs. Imperative DOM
In the original Midterm code, DOM elements were targeted using `document.getElementById` and manually appended via `.insertAdjacentHTML()`. In this React refactor:
- Data is owned by central state variables (`catName`, `catDesc`, `catAmount`, `categories`) inside `App.jsx`.
- Updating state via `setCategories` triggers automatic, optimized DOM updates via React's Virtual DOM reconciliation.

#### Guard Clauses & Formatting Logic
- Baseline input validation is preserved using guard clause checks (`!catName || !catDesc`).
- Category names are formatted to uppercase, and string length caps (25 characters) are preserved using `.slice(0, 25) + '...'`.

#### In-Table CRUD State Mechanics
- **Creation**: Appends new entry objects with unique `Date.now()` identifiers into state using array spread syntax.
- **Deletion**: `.filter()` returns a new array reference excluding the target item ID when the delete action is triggered.
- **Editing**: `.map()` iterates over state to replace the matching ID's properties while keeping all other entries untouched.

#### Derived Calculations via Array `.reduce()`
- Total target income is calculated on the fly using `.reduce()` on every re-render (`categories.reduce((sum, item) => sum + item.amount, 0)`), preventing state desynchronization and eliminating redundant state variables.

---

## Tech Stack
- **Framework**: React 18+ (via Vite)
- **Styling**: Bootstrap 5 + Custom CSS (`App.css`)
- **Deployment**: Vercel
- **Version Control**: Git & GitHub