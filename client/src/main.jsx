import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Store } from './reduc/Store.jsx';
import {Provider} from 'react-redux'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>  
    <Provider store={Store}>  
    <App />
    </Provider>
  </StrictMode>,
)
