## Employee Dashboard (AG Grid + React)

A React 19 + Vite app showcasing an employee analytics dashboard powered by AG Grid v34. It includes sorting, filtering, pagination, and custom cell renderers with a clean UI.

### Tech Stack
- React 19, Vite 7, Tailwind CSS 4
- AG Grid Community/Enterprise v34, AG Charts Enterprise

### Prerequisites
- Node.js 18+ and npm 9+

### Getting Started
1. Install dependencies:
```
npm install
```
2. Start the dev server:
```
npm run dev
```
3. Open the printed local URL in your browser.

### Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run eslint

### Project Structure
```
.
├─ src/
│  ├─ components/
│  │  └─ Dashboard.jsx
│  ├─ data/
│  │  └─ employeeData.js
│  ├─ App.jsx
│  └─ index.css
├─ index.html
├─ package.json
└─ vite.config.js
```

### AG Grid Configuration Notes
This project uses AG Grid's ModuleRegistry. Registered modules are declared at the top of `src/components/Dashboard.jsx`.

If you enable a new AG Grid feature and see error #200, import and register the corresponding module. Example:
```
import { SomeFeatureModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ SomeFeatureModule ]);
```
### Styles/Themes:
  - This project uses the legacy theme via `provideGlobalGridOptions({ theme: 'legacy' })` and `ag-theme-alpine` CSS classes.

### Customization Pointers
- Columns: Edit `columnDefs` in `Dashboard.jsx`
- Custom renderers: `StatusRenderer`, `SalaryRenderer`, `PerformanceRenderer`, `SkillsRenderer`
- Data source: `src/data/employeeData.js`
- Pagination: Toggle via `pagination` and `paginationPageSize` on `<AgGridReact />`



