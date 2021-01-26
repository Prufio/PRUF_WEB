/*!

=========================================================
* Material Dashboard PRO React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import detectEthereumProvider from '@metamask/detect-provider'
import AdminLayout from "layouts/Admin.js";

import "assets/scss/material-dashboard-pro-react.scss?v=1.9.0";


ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path="/admin" component={AdminLayout} />
      <Redirect from="/" to="/admin/home" />
    </Switch>
 </HashRouter>,
  document.getElementById("root")
);
