import React from 'react';
import { Router } from 'react-router-dom';
import { render } from 'react-dom';

import reportWebVitals from './reportWebVitals';

import { history } from './_helpers';
import { accountService } from './_services';
import { App } from './app/Index';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// setup fake backend
// import { configureFakeBackend } from './_helpers';
// configureFakeBackend();

function startApp() {
  render(
    <Router history={history}>
      <App />
    </Router>,
    document.getElementById('app')
  );
}

// attempt silent token refresh before startup
accountService.refreshToken().finally(startApp);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
