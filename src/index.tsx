import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import './index.scss';
import App from './App';

const root: Root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <div>
        <App />
    </div>,
);
