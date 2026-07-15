# TaskPro
# TaskPro — React Task Manager Dashboard

TaskPro is a responsive, professional-grade task management dashboard built using **React (Vite)**, **Tailwind CSS**, and **Lucide Icons**. 

The project is designed with a decoupled architecture. This means the user interface is completely independent of the data source. You can run the entire application offline (simulating database actions via `localStorage`) or connect it directly to a live **Laravel REST API** with a single configuration switch.

---

## 🛠️ Features We Built

### 1. Authentication & Route Security
* **React Context API:** Designed a centralized `AuthContext.jsx` that manages logging in, logging out, and state initialization.
* **Synchronous Route Guard:** Created a robust `ProtectedRoute.jsx` component that protects administrative routes. It contains synchronous `localStorage` checks to eliminate standard React state-rendering race conditions (preventing accidental redirect loops on login).

### 2. Administrative Layout
* **Responsive Layout:** Structured a layout containing a fixed top navigation bar (displaying current user status) and a dynamic, collapsing **Sidebar** with backdrop overlay controls for mobile viewports.

### 3. Interactive Analytics Dashboard
* **Metrics Cards:** Real-time progress counters displaying **Total**, **Pending**, **In Progress**, and **Completed** tasks.
* **Completion Progress Gauge:** A visual progress bar calculating real-time task completion ratios.
* **Recent Activity Log:** Displays a feed of the most recently updated project tasks.

### 4. Full Task Workspace (CRUD)
* **Status Badge Component:** A unified badge system mapping progress states (`pending`, `in_progress`, `completed`) to specific Tailwind color palettes.
* **Workspace Board:** Built a fully operational task console with keyword searching, status-tab filters, quick click-to-cycle status updates, and deletion.
* **Re-usable Task Modal:** An interactive form configured to dynamically handle both task creation and editing flawlessly.

### 5. Architectural Services & Configuration
* **Central Axios Client:** Set up a centralized API service (`api.js`) that automatically attaches Bearer tokens to request headers and intercepts session timeouts.
* **Dual-Mode Services:** Built both `authService.js` and `taskService.js` with dual behaviors (Mock data vs Axios requests) controlled by a clean environment switch.
* **ESLint Configuration:** Adjusted the root compiler settings (`eslint.config.js`) to disable legacy prop-types verification, ensuring a 100% clean, warning-free build terminal.

---

## 🚀 How to Run the Project

### 1. Install Dependencies
2. Choose Your Database Connection Mode
TaskPro can run in offline demo mode or connect directly to a backend.

Open both src/services/authService.js and src/services/taskService.js.

Locate the USE_MOCK variable at the top of the files:

Run Offline (Uses local browser storage — default):
JavaScript
const USE_MOCK = true;
Connect to your Laravel API:
JavaScript
const USE_MOCK = false;
3. Run the Development Server
Launch the local Vite server:

Bash
npm run dev
Open the local URL provided in your terminal (typically http://localhost:5173).

🔑 Test Credentials (Offline Mock Mode)
When running the project with USE_MOCK = true, use these credentials to access the dashboard:

Email: test@example.com

Password: password123
Open your terminal in the frontend project folder and install the required packages:
```bash
npm install
