import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles.css';
import { EmissionsTrackerPage } from './pages/EmissionsTrackerPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <EmissionsTrackerPage />
  </React.StrictMode>,
);