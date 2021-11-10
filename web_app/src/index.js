/*

=========================================================
* Material Dashboard PRO React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { HashRouter, RouteProps, Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import AdminLayout from "layouts/user.js";
import UAuth from '@uauth/js'
import { CookiesProvider } from "react-cookie";

import "assets/scss/material-dashboard-pro-react.scss?v=1.9.0";

  ReactDOM.render(
    <CookiesProvider>
    <HashRouter>
      <Switch>
        <Route path="/stake" component={AdminLayout} />
        {
          <Redirect
            from="/"
            to="/stake"
          />
        }
      </Switch>
    </HashRouter>
  </CookiesProvider>
 
  ,
    document.getElementById("root")
  );


