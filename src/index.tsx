import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import * as serviceWorker from "./serviceWorker";

import { Provider } from "react-redux";
import { store } from "./store";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { CollectionFeature } from "./features/collection/Collection";
import { ItemFeature } from "./features/item/Item";
import { UserFeature } from "./features/user/User";
import { DefaultFeature } from "./features/default/Default";

import Navigation from "./components/Navigation";
import About from "./components/About";
import NoMatch from "./components/NoMatch";

const root: JSX.Element = (
  <Provider store={store}>
    <Router basename="/reactHN/build">
      <div>
        <Navigation />
        <main>
          <div className="max-w-screen-lg my-4 mx-auto">
            <Switch>
              <Route exact path={`/`} component={DefaultFeature} />
              <Route
                path={`${process.env.PUBLIC_URL}/item/:id`}
                component={ItemFeature}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/user/:id`}
                component={UserFeature}
              />
              <Route
                path={`/news/:page?`}
                render={(props) => <CollectionFeature {...props} type="news" />}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/newest/:page?`}
                render={(props) => (
                  <CollectionFeature {...props} type="newest" />
                )}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/show/:page?`}
                render={(props) => <CollectionFeature {...props} type="show" />}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/ask/:page?`}
                render={(props) => <CollectionFeature {...props} type="ask" />}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/jobs/:page?`}
                render={(props) => <CollectionFeature {...props} type="jobs" />}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/business/:page?`}
                render={(props) => (
                  <CollectionFeature {...props} type="business" />
                )}
              />
              <Route
                exact
                path={`${process.env.PUBLIC_URL}/about`}
                component={About}
              />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </main>
      </div>
    </Router>
  </Provider>
);

ReactDOM.render(root, document.getElementById("root"));
serviceWorker.register();
