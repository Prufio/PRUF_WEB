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
import AdminLayout from "layouts/Admin.js";

import "assets/scss/material-dashboard-pro-react.scss?v=1.9.0";

let query;
if(window.location.href.includes('0x')){
  query = (window.location.href.substring(window.location.href.indexOf('0x'), window.location.href.indexOf('0x')+66) || "");
} else {
  query = "";
}
console.log(query);
const fullUrl = "/admin/home/" + query

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path="/admin" component={AdminLayout} />
      { fullUrl ? <Redirect from="/" to={fullUrl} /> :  <Redirect from="/" to="/admin/home/" />}
    </Switch>
 </HashRouter>,
  document.getElementById("root")
);
