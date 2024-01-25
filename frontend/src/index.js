import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "./layouts/Auth.js";
import AdminLayout from "./layouts/Admin.js";

ReactDOM.render(
  <BrowserRouter>
      {/* Use the Switch component to render only the first Route or Redirect that matches the location */}
    <Switch>
      <Route path={`/auth`} component={AuthLayout} />
      <Route path={`/admin`} component={AdminLayout} />
      {/* <Route path={`/rtl`} component={RTLLayout} /> */}
      <Redirect from={`/`} to="/admin/dashboard" />
      {/* Add a wildcard route to catch unknown paths */}
      <Route path="*" render={() => <Redirect to="/auth/signin" />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
