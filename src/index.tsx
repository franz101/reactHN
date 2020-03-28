import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer, { RootState } from './reducers';
import { IAction } from './types';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Collection from './Collection';
import Story from './Story';
import User from './User';

import Default from './components/Default';
import Navigation from './components/Navigation';
import About from './components/About';
import NoMatch from './components/NoMatch';

const middleware = [thunk];
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore<RootState, IAction, any, any>(
  reducer,
  composeEnhancers(applyMiddleware(...middleware))
);

const root: JSX.Element = (
  <Provider store={store}>
    <Router>
      <div>
        <Navigation />
        <main>
          <Switch>
            <Route exact path="/" component={Default} />
            <Route path="/item/:id" component={Story} />
            <Route path="/user/:id" component={User} />
            <Route path="/news/:page?" render={props => <Collection {...props} type='news' />} />
            <Route path="/newest/:page?" render={props => <Collection {...props} type='newest' />} />
            <Route path="/show/:page?" render={props => <Collection {...props} type='show' />} />
            <Route path="/ask/:page?" render={props => <Collection {...props} type='ask' />} />
            <Route path="/jobs/:page?" render={props => <Collection {...props} type='jobs' />} />
            <Route exact path="/about" component={About} />
            <Route component={NoMatch} />
          </Switch>
        </main>
      </div>
    </Router>
  </Provider>
);

ReactDOM.render(root, document.getElementById('root'));
serviceWorker.register();
