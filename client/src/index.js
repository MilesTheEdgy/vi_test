import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'core-js';
import { icons } from './assests/icons/index'
import store from "./store"
import { Provider } from 'react-redux';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import { HashRouter } from "react-router-dom"
React.icons = icons

const client = new ApolloClient({
  uri: 'graphql',
  cache: new InMemoryCache()
});

ReactDOM.render(
  <HashRouter>
    <Provider store = {store}>
      <ApolloProvider client = {client}>
        <App/>
      </ApolloProvider>
    </Provider>
  </HashRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
