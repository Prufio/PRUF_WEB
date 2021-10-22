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
import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { HashRouter, RouteProps, Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import AdminLayout from "layouts/user.js";
import UAuth from '@uauth/js'
import { CookiesProvider } from "react-cookie";

import "assets/scss/material-dashboard-pro-react.scss?v=1.9.0";

const uauth = new UAuth({
  // Client credentials copied from https://unstoppabledomains.com/app-dashboard
  clientID: "Q2pO03hsT5gMk0IxAacVZoloemjGBzvVEzxaofTHnmA=",
  clientSecret: "+2Kdmv50Sl3zGxhV2ZnfCuDYmPfpbE5ulPRHPtzIoO4=",

  // Requested scopes.
  // scope: 'openid email wallet',

  // Redirect Uris copied from https://unstoppabledomains.com/app-dashboard
  redirectUri: "https://staking.pruf.io/callback",
  postLogoutRedirectUri: "https://staking.pruf.io/",
})

const Callback = () => {
  const [redirectTo, setRedirectTo] = useState()

  useEffect(() => {
    // Try to exchange authorization code for access and id tokens.
    uauth
      .loginCallback()
      // Successfully logged and cached user in `window.localStorage`
      .then(response => {
        console.log('loginCallback ->', response)
        setRedirectTo('/#/stake')
      })
      // Failed to exchange authorization code for token.
      .catch(error => {
        console.error('callback error:', error)
        setRedirectTo('/#/stake')
      })
  }, [])

  if (redirectTo) {
    window.location.replace("https://staking.pruf.io/stake")
  }

  return <>Loading...</>
}
  ReactDOM.render(
    // <>
    // {window.location.href.includes("callback") ? 
      <React.StrictMode>
      <BrowserRouter>
        <Switch>
          <Route path="/callback" component={Callback} />
          <Route path="/stake" component={AdminLayout} />
          {
          <Redirect
            from="/"
            to="/stake"
          />
        }
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  //     :
  //   <CookiesProvider>
  //   <HashRouter>
  //     <Switch>
  //       <Route path="/stake" component={AdminLayout} />
  //       {
  //         <Redirect
  //           from="/*"
  //           to="/stake"
  //         />
  //       }
  //     </Switch>
  //   </HashRouter>
  // </CookiesProvider>
  //   }</>
  ,
    document.getElementById("root")
  );


