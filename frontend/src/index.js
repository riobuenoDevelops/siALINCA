import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'rsuite/lib/styles/index.less';
import "./assets/styles/custom-theme.less";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
