import React from 'react'
import ReactDOM from 'react-dom/client'
// 1. Import BrowserRouter and rename it to Router
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap the entire App with the Router component */}
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)