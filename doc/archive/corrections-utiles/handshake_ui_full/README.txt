This package contains a **visual clone** of the Handshake influence dashboard built with React.

Contents:
* `src/App.jsx` — minimal entry point that mounts the dashboard.
* `src/handshake.css` — dark theme CSS with utilities and styles used throughout the clone.
* `src/components/HandshakeClone.jsx` — main component combining the sidebar, top bar, force‑graph, ranking panel and timeline.

### Installation

1. Copy the `src/` folder into your existing React application (created with Vite or CRA).
2. Install the required packages:
   ```bash
   npm i react-force-graph-2d lucide-react
   ```
3. Import and mount the dashboard in your application:
   ```jsx
   import HandshakeClone from './components/HandshakeClone';
   import './handshake.css';

   export default function App() {
     return <HandshakeClone />;
   }
   ```
4. Start your development server (`npm run dev` or `npm start`) and visit the dashboard.

### Features

* **Dark aesthetic** matching the Handshake example: gradient background, soft panels, neon glow.
* **Interactive force graph** of projects. Clicking a project expands placeholder “Events” and “Influenceurs” nodes radially around it.
* **Hover tooltips** show the label and type of a node.
* **Top bar** replicates filters for score (slider), actors and geography (selects), and search bar.
* **Ranking panel** on the right lists placeholder names with scores and trending indicators.
* **Trends timeline** at the bottom shows a histogram of activity with a simple legend.

### Notes

* This clone focuses on the **visual design**. All data is placeholder.
* Radial expansions are simplified: events and influencers appear around a selected project. You can customise the names and number of items in the `categories` array inside `handleNodeClick`.
* Feel free to style further by editing `handshake.css`.