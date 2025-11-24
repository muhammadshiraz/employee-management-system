# Employee Management System

*A lightweight, modular frontend application built with modern JavaScript (ES6+) and no frontend frameworks.*

This project is a small but complete Employee Management System built with **pure JavaScript**, structured into logical layers (API, Models, Services, UI Components). The goal was to keep the architecture clean, maintainable and easy to extend, while still covering all functional requirements such as search, filtering, pagination, data export, and smooth table rendering with virtual scrolling.

---

## Overview

The application loads employee data from a public API and displays it in a dynamic, interactive dashboard-style UI. Users can:

* Search employees by name, email, role, department, etc.
* Filter by one or multiple departments
* Navigate using pagination and configurable page sizes
* Export the current (filtered) view to CSV or JSON
* Scroll large datasets efficiently with virtualized rows
* Fall back to a local JSON file if the remote API is unavailable

The project does not require any bundlers or frameworks. Everything is written in modular ES6 JavaScript and runs in any modern browser.

---

## Main Features

### ✔ Clean modular architecture

UI, data, models, services and helpers live in separate folders to avoid mixing responsibilities.

### ✔ Remote API + Local fallback

The app fetches from:
`https://dummyjson.com/users`

If the remote API ever fails (offline, rate limit, etc.), it automatically loads data from:

`api-data/employees.json`

This makes the project self-contained and always functional.

### ✔ Practical UI functionality

* Fast debounced search
* Multi-select department filter
* Sortable-like display (not actual sorting yet, but designed to allow it)
* Paginated table
* Smooth scrolling using a virtualized table body
* CSV and JSON exporters

### ✔ Dashboard-style UI/UX

The styles are custom-built (no external CSS libraries).
The layout uses soft shadows, subtle gradients, glass-like surface effects and a dark admin-panel feel.

---

## Project Structure

```
employee-management-system/
├── index.html
├── css/
│   └── styles.css
├── api-data/
│   └── employees.json
├── js/
│   ├── app.js
│   ├── api/
│   │   └── EmployeeAPI.js
│   ├── models/
│   │   ├── Employee.js
│   │   └── EmployeeCollection.js
│   ├── services/
│   │   └── DataService.js
│   ├── components/
│   │   ├── TableComponent.js
│   │   ├── SearchComponent.js
│   │   └── PaginationComponent.js
│   └── utils/
│       └── helpers.js
└── README.md
```

### A quick summary of the modules

| Layer          | Description                                                |
| -------------- | ---------------------------------------------------------- |
| **API**        | Fetches data from remote source and handles local fallback |
| **Models**     | Normalizes employee data and handles filtering logic       |
| **Services**   | Middle layer that connects API + Models                    |
| **Components** | Search, table (virtual scrolling), pagination              |
| **Utils**      | Debounce, CSV/JSON export, small DOM helpers               |

---

## Running the Project Locally

Because this is an ES module project, it must be served over HTTP (not opened directly as a file).
Any simple static server works.

### Option 1: VSCode Live Server (easiest)

1. Open the project in VSCode
2. Install “Live Server” extension (if not already installed)
3. Right-click on **index.html** → *Open with Live Server*
4. Browser will open automatically

This is the most convenient method during development.

---

### Option 2: Node.js

If you have Node installed:

```bash
npx serve
```

Then open the URL printed in your terminal
(e.g. `http://localhost:3000`).

---

### Option 3: Python

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000/employee-management/`

---

## Deploying to Vercel

The project is completely static, so deployment is very simple.

### How to deploy

1. Push the project to GitHub
2. Go to the Vercel dashboard
3. Click **New Project**
4. Import your GitHub repository
5. For **Framework Preset**, choose **“Other”**
6. For **Root Directory**, select the project folder if needed
7. For **Build Command**, leave it empty (no build step required)
8. For **Output Directory**, use:

   ```
   .
   ```
9. Deploy

Vercel will give you a live URL such as:

```
https://employee-management.vercel.app
```

This URL can be shared directly.

### Deploying via CLI (optional)

If you prefer the terminal:

```bash
npm i -g vercel
cd employee-management
vercel
```

Follow the prompts, and you’re done.

---

## Notes for Reviewers

This project intentionally avoids frameworks to demonstrate:

* Strong understanding of browser APIs
* Ability to structure applications without React/Vue
* Clean architecture and separation of concerns
* Performance considerations (virtual scrolling)
* Practical UX design decisions

It is easy to extend the project with features such as sorting, editing rows, column customization, or routing.

---

## Final Thoughts

The solution balances clarity, structure, and interactivity without relying on third-party libraries. It is built to be understandable at a glance while still showing good engineering discipline.

If you’d like additional enhancements (sorting, inline editing, user detail modal, animations, or theming), the architecture is ready for it.