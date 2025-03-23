import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from './App.jsx';
import { Provider } from "react-redux"; // 引入 Redux Provider
import { store } from "./store.jsx"; // 引入 Redux Store
import { RouterProvider } from 'react-router';
import router from './router/index.jsx';
import '../src/assets/all.scss';
import '../src/assets/_variables.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
      </RouterProvider>
    </Provider>
  </StrictMode>,
)
