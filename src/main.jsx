import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './page/App';
import CartProvider from './components/context/contextcart';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter basename="/">
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

// import React from "react";
// import ReactDOM from "react-dom/client";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <h1>TEST</h1>
// );