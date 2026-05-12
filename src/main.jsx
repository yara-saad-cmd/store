import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './page/App'
import React from 'react'
import ReactDOM from "react-dom/client"
import { BrowserRouter } from 'react-router-dom'
import Cartprovider from './components/context/contextcart'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/'>
   <Cartprovider>
    <App/>
   </Cartprovider>
   </BrowserRouter>
    
  </React.StrictMode>

)


// import React from "react";
// import ReactDOM from "react-dom/client";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <h1>TEST</h1>
// );