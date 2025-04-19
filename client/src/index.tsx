import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <h1 className="text-3xl font-bold underline text-center mt-10">
      Welcome to SaaS Frontend
    </h1>
  </React.StrictMode>
);
