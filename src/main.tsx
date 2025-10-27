import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";

import App from "./App.tsx";

import "react-toastify/dist/ReactToastify.min.css";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";

import "react-datetime/css/react-datetime.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        transition={Slide}
      />
    </Provider>
  </React.StrictMode>
);
