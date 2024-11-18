import ReactDOM from 'react-dom/client';
import AppRouter from './utils/Router'
//import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppRouter />
);

