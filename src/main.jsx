import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './page/App'
import CartProvider from './components/context/contextcart'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
)


// import React from "react";
// import ReactDOM from "react-dom/client";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <h1>TEST</h1>
// );