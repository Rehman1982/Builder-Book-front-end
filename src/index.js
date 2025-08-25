import React from "react";
import ReactDOM from "react-dom/client";
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

// require("./bootstrap");

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding Pages to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import Router from "./Router";
import AlertBar from "./context/AlertBar/AlertBar";
import AppProvider from "./context/AppProvider";
import { Provider } from "react-redux";
import { store } from "./app/store";
import reportWebVitals from "./components/reportWebVitals";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AlertBar>
        <AppProvider>
          <Router />
        </AppProvider>
      </AlertBar>
    </Provider>
  </React.StrictMode>
);
// reportWebVitals(console.log);
