import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://port-0-react-project2-mn3yw0gl2efd3fa1.sel3.cloudtype.app';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);