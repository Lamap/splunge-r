import React from 'react';
import ReactDOM, { Root } from 'react-dom/client';
import './index.scss';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import common_en from './translations/en.json';
import common_hu from './translations/hu.json';

const root: Root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

i18next.init({
    interpolation: { escapeValue: false }, // React already does escaping
    lng: 'en', // language to use
    resources: {
        en: {
            common: common_en, // 'common' is our custom namespace
        },
        hu: {
            common: common_hu,
        },
    },
});

root.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <App />
        </I18nextProvider>
    </React.StrictMode>,
);
