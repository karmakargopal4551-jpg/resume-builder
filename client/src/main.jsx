import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import  {Provider} from 'react-redux'
import { store } from "./app/store.js";

// Suppress browser extension errors
window.addEventListener('error', (e) => {
  if (e.message.includes('Cannot find menu item')) {
    e.preventDefault();
  }
});

createRoot(document.getElementById('root')).render(
  <Provider store ={store}>
    <BrowserRouter>
    <App /> 
    </BrowserRouter>
  </Provider>
  
)