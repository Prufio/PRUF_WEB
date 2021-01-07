import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import { ClickAwayListener } from '@material-ui/core';
import Web3 from "web3";
import Home from "./Home";
import HomeMobile from "./Mobile/HomeMobile";
import buildContracts from "./Resources/Contracts";
import buildWindowUtils from "./Resources/WindowUtils";
import FaucetComponent from "./Resources/FaucetComponent";
import AuthorizedUserComponent from "./Resources/AuthorizedUserComponent";
import AuthorizedUserLogin from "./Resources/AuthorizedUserLogin";
import NoAddressComponent from "./Resources/NoAddressComponent";
import BasicComponent from "./Resources/BasicComponent";
import MobileComponent from "./Resources/MobileComponent";
import ParticleBox from "./Resources/ParticleBox";
import Router from "./Router";
import Button from 'react-bootstrap/Button';
import { Twitter, GitHub, Mail, Send, Menu, Check, Settings, X, User } from 'react-feather';
import { isMobile, browserName, engineVersion, getUA } from "react-device-detect";
import { isFirefox } from "is-firefox";
import { isSafari } from "is-safari";
import Jdenticon from 'react-jdenticon';
import Robohash from 'react-robohash';
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

class Main extends Component {
  constructor(props) {
    super(props);

    this.renderContent = () => {
      var isSafari = require('is-safari');
      if (isSafari && !isMobile) {
        return (
          <div>
            <HashRouter>
              <div className="imageForm">
                <div>
                  {this.state.noAddrMenuBool === true && (
                    <button
                      className="imageButton"
                      title="Back to Home!"
                      onClick={() => { window.location.href = '/#/' }}
                    >
                      <img
                        className="downSizeLogo"
                        src={require("./Resources/Images/PrufReadOnly.png")}
                        alt="Pruf Logo" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <div className="bannerForm">
                  <ClickAwayListener onClickAway={() => { this.setState({ hamburgerMenuMobile: false, userMenuMobile: false }) }}>
                    <ul className="headerForm">
                      {window.contracts !== undefined && (
                        <>
                          <nav>
                            <NoAddressComponent />
                          </nav>

                        </>
                      )}
                    </ul>
                  </ClickAwayListener>
                </div>
              </div>
              <div className="pageForm">
                <div>
                  <Route exact path="/" component={Home} />
                  {Router(this.state.routeRequest)}
                </div>
              </div>
              <NavLink to="/">
              </NavLink>
            </HashRouter>
          </div >
        );
      }
      if (isMobile && isSafari) {
        return (
          <div>
            <HashRouter>
              <div>
                <div className="bannerForm">
                  <ClickAwayListener onClickAway={() => { this.setState({ hamburgerMenuMobile: false, userMenuMobile: false }) }}>
                    <ul className="headerForm">
                      {window.contracts !== undefined && (
                        <>
                          <nav>
                            <NoAddressComponent />
                          </nav>
                        </>
                      )}
                    </ul>
                  </ClickAwayListener>
                </div>
              </div>
              <div className="pageForm">
                <div>
                  <Route exact path="/" component={HomeMobile} />
                  {Router(this.state.routeRequest)}
                </div>
              </div>
              <NavLink to="/">
              </NavLink>
            </HashRouter>
          </div >
        );
      }
      if (isMobile && !isSafari) {
        return (
          <div>
            <HashRouter>
              <div>
                <div className="bannerForm">
                  <ClickAwayListener onClickAway={() => { this.setState({ hamburgerMenuMobile: false, userMenuMobile: false }) }}>
                    <ul className="headerForm">
                      {window.contracts !== undefined && (

                        <>
                          <div className="hamburgerMenuMobile">
                            <a href={window.location.href} className="hamburgerMenuContent"><Menu size={35} onClick={() => { this.hamburgerMenuMobile() }} /></a>
                          </div>

                          <nav>
                            {this.state.hamburgerMenuMobile === true && (
                              <div className="hamburgerDropdownMobile" onClick={() => { this.hamburgerMenuMobile() }}>
                                {this.state.mobileMenuBool === true && (<MobileComponent />)}
                              </div>
                            )}
                            {this.state.mobileMenuBool === false && (<NoAddressComponent />)}
                          </nav>
                          {this.state.mobileMenuBool && (
                            <User
                              className="imageFormUserMobile"
                              size={20}
                              onClick={() => { this.userMenuMobile() }}
                            />)}

                          <style type="text/css">
                            {`

                      .btn-etherscanMobile {
                        background-color: transparent;
                        color: white;
                        margin-top: -0.1rem;
                        font-size: 1.4rem;
                        // height: 1.6rem;
                        width: fit-content;
                      }
                      .btn-etherscanMobile:hover {
                        color: #00a8ff;
                        background-color: transparent;
                      }

                      .btn-userButton {
                        background-color: transparent;
                        color: white;
                        margin-top: -0.5rem;
                        // margin-right: 37rem;
                        font-size: 1.4rem;
                        width: -moz-fit-content;
                        width: fit-content;
                      }
                      .btn-userButton:hover {
                        background-color: transparent;
                        color: #00a8ff;
                      }
                      .btn-userButton:focus {
                        background-color: transparent;
                      }
                      .btn-userButton:active {
                        background-color: transparent;
                        border: transparent;
                      }

                      .btn-toggle {
                        background-color: #002a40;
                        color: white;
                        height: 3rem;
                        width: 18rem;
                        margin-top: -0rem;
                        border-radius: 0;
                        font-weight: bold;
                        font-size: 1.4rem;
                        border-radius: 0rem 0.3rem 0.3rem 0rem;
                      }
                      .btn-toggle:hover {
                        background-color: #23b6ff;
                        color: white !important;
                      }
                      .btn-toggle:focus {
                        background-color: #23b6ff;
                        color: white !important;
                      }
                      .btn-toggle:active {
                        background-color: #23b6ff;
                        color: white !important;
                      }
                      .body {
                        overflow: visible !important;
                      }
                   `}
                          </style>

                          {this.state.userMenuMobile === true && (
                            <div className="userInfoMobile">
                              {this.state.addr === undefined && (
                                <h4 className="userStatFont">
                                  Please
                                  <a
                                    href={window.location.href}
                                    onClick={() => {
                                      this.setState({ userMenu: undefined })
                                      if (window.ethereum) { window.ethereum.enable() }
                                      else { alert("You do not currently have a Web3 provider installed, we recommend MetaMask" ); }
                                    }
                                    }
                                    className="userDataLink">
                                    Log In
                              </a>
                              to View Balances
                                </h4>
                              )}
                              {this.state.addr > 0 && (
                                <>
                                  <h4 className="userStatFont">
                                    Currently serving :
                              <Button
                                      variant="etherscanMobile"
                                      title="Check it out on Etherscan!"
                                      onClick={() => { this.setState({ userMenu: undefined }); window.open("https://kovan.etherscan.io/address/" + this.state.addr) }}>
                                      {this.state.addr.substring(0, 6) + "..." + this.state.addr.substring(37, 42)}
                                    </Button>
                                  </h4>
                                  <br></br>
                                </>
                              )}
                              {this.state.ETHBalance && (
                                <>
                                  <h4 className="userStatFont">
                                    KETH Balance : Ξ{this.state.ETHBalance.substring(0, 6)}
                                    {/* <Button
                                      variant="userButton"
                                      onClick={() => { this.setState({ userMenu: undefined }); window.open("https://faucet.kovan.network/", "_blank") }}>
                                      Get KETH
                                  </Button> */}
                                  </h4>
                                  <br></br>
                                </>
                              )}
                              {this.state.prufBalance && (
                                <>
                                  <h4 className="userStatFont">
                                    PRUF Balance : ü{Math.round(Number(this.state.prufBalance))}
                                    <Button
                                      variant="userButton"
                                      onClick={() => { this.setState({ userMenuMobile: false }); window.location.href = '/#/faucet' }}>
                                      Faucet
                              </Button>
                                  </h4>
                                  <br></br>
                                </>
                              )}
                              {this.state.assetClassBalance && (
                                <>
                                  <h4 className="userStatFont">
                                    AC Nodekeys :
                                <Button
                                      variant="userButton"
                                      // onClick={() => { this.setState({ userMenu: undefined, }); window.location.href = '/#/' }}>
                                      onClick={() => { /* this.assetClassDashboard() */ }}>
                                      {this.state.assetClassBalance}
                                    </Button>
                                    {/* <Button
                                      variant="userButton"
                                      onClick={() => { this.setState({userMenuMobile: false}); window.location.href = '/#/faucet' }}>
                                      Get AC
                              </Button> */}
                                  </h4>
                                  <br></br>
                                </>
                              )}
                              {this.state.assetBalance && (
                                <>
                                  <h4 className="userStatFont">
                                    Assets :
                              <Button
                                      variant="userButton"
                                      onClick={() => { this.setState({ userMenuMobile: false }); window.location.href = '/#/asset-dashboard-mobile' }}>
                                      {this.state.assetBalance}
                                    </Button>
                                  </h4>
                                  <br></br>
                                </>
                              )}
                              {this.state.IDTokenBalance && (
                                <>
                                  <h4 className="userStatFont">
                                    Token Minter : {this.state.IDTokenBalance > 0 && (<Check className="userIDBalance1" />)}
                                    {this.state.IDTokenBalance === "0" && (
                                      <>
                                        <X className="userIDBalance0" />
                                        <Button
                                          variant="userButton"
                                          // onClick={() => { this.setState({ userMenu: undefined }); window.open("https://t.me/prufteam", "_blank") }}>
                                          onClick={() => { this.mintID() }}>
                                          Get ID
                              </Button>
                                      </>
                                    )}
                                    {/* {this.state.IDTokenBalance === "0" && (<X className="userIDBalance0" />)} */}
                                  </h4>
                                  <br></br>
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </ul>
                  </ClickAwayListener>
                </div>
              </div>
              <div className="pageForm">
                <div>
                  <Route exact path="/" component={HomeMobile} />
                  {Router(this.state.routeRequest)}
                </div>
              </div>
              <NavLink to="/">
              </NavLink>
            </HashRouter>
          </div >
        );
      }
      if (!isSafari) {
        return (
          <HashRouter>

            <div className="imageForm">
              <div>
                {this.state.noAddrMenuBool === true && (
                  <button
                    className="imageButton"
                    title="Back to Home!"
                    onClick={() => { window.location.href = '/#/' }}
                  >
                    <img
                      className="downSizeLogo"
                      src={require("./Resources/Images/PrufReadOnly.png")}
                      alt="Pruf Logo" />
                  </button>
                )}
                {this.state.faucetBool === true && (
                  <button
                    className="imageButton"
                    title="Back to Home!"
                    onClick={() => { window.location.href = '/#/' }}
                  >
                    <img
                      className="downSizeLogo"
                      src={require("./Resources/Images/PrufFaucet.png")}
                      alt="Pruf Logo" />
                  </button>
                )}
                {this.state.authorizedUserMenuBool === true && (
                  <button
                    className="imageButton"
                    title="Back to Home!"
                    onClick={() => { window.location.href = '/#/' }}
                  >
                    <img
                      className="downSizeLogo"
                      src={require("./Resources/Images/PrufAssetMinter.png")}
                      alt="Pruf Logo" />
                  </button>
                )}
                {this.state.basicMenuBool === true && (
                  <button
                    className="imageButton"
                    title="Back to Home!"
                    onClick={() => { window.location.href = '/#/' }}
                  >
                    <img
                      className="downSizeLogo"
                      src={require("./Resources/Images/PrufBasic.png")}
                      alt="Pruf Logo" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <div className="bannerForm">
                <div className="hamburgerMenu">
                  <a className="hamburgerMenuContent"><Menu size={35} onClick={() => { this.hamburgerMenu() }} /></a>
                </div>

                {this.state.hamburgerMenu !== undefined && (
                  <div className="hamburgerDropdown">
                    <div className="mediaLink">
                      <a className="mediaLinkContent"><GitHub size={20} onClick={() => { window.open("https://github.com/Prufio", "_blank") }} /></a>
                      <a className="mediaLinkContent"><Mail size={20} onClick={() => { window.open("mailto:support@pruf.io", "_blank") }} /></a>
                      <a className="mediaLinkContent"><Twitter size={20} onClick={() => { window.open("https://www.twitter.com/prufteam", "_blank") }} /></a>
                      <a className="mediaLinkContent" ><Send size={20} onClick={() => { window.open("https://t.me/pruftalk", "_blank") }} /></a>
                    </div>
                    <button
                      className="imageButtonU"
                      onClick={() => { window.open("https://pruf.io", "_blank") }}
                    >
                      <img
                        className="imageFormU"
                        title="Find out More!"
                        src={require("./Resources/Images/favicon pruf no bg.png")}
                        alt="Pruf U" />
                    </button>
                    <div className="siteInfoBox">
                      <h3>
                        dApp Last Updated:
                  </h3>
                      <h3>
                        December 30, 2020
                  </h3>
                      <h3>
                        <a onClick={() => { window.open("https://pruf.io", "_blank") }}> © pruf.io </a>
                      </h3>
                      <h3>
                        {this.state.routeRequest === "noAddr"
                          ? <a onClick={() => { window.open("https://github.com/Prufio", "_blank") }}> Version A1.2.6 </a>
                          : <a href='/#/DnvkxiOAFy_vDC' className="siteInfoBoxExtra" /* onClick={() => { window.location.href = '/#/DnvkxiOAFy_vDC' } }*/> Version A1.2.6 </a>}
                      </h3>

                      <Form.Check
                        type="checkbox"
                        checked={this.state.particles}
                        className="checkBoxParticles"
                        id="inlineFormCheck"
                        onChange={() => { this.particles() }}
                      />

                      <h3 className="textParticles">
                        Particles
                    </h3>
                    </div>
                    <ClickAwayListener onClickAway={() => { this.setState({ userMenu: undefined }) }}>
                      <button
                        className="imageButtonUser"
                        onClick={() => { this.userMenu() }}>
                        {window.addr !== undefined && (
                          <Robohash
                            className="imageFormUser"
                            name={window.addr}
                          />
                        )}
                        {window.addr === undefined && (
                          <User
                            className="imageFormUser"
                            size={30}
                          />
                        )}
                      </button>
                    </ClickAwayListener>
                    <div>
                    </div>
                    <div>

                      {this.state.userMenu === true && (
                        <div className="hamburgerDropdownUserInfo">
                          {this.state.addr === undefined && (
                            <h4 className="userStatFont">
                              Please
                              <a
                                onClick={() => {
                                  this.setState({ userMenu: undefined })
                                  if (window.ethereum) { window.ethereum.enable() }
                                  else { this.setState({ alertBanner: "You do not currently have a Web3 provider installed, we recommend MetaMask" }); }
                                }
                                }
                                className="userDataLink">
                                Log In
                              </a>
                              to View Balances
                            </h4>
                          )}
                          {this.state.addr > 0 && (
                            <>
                              <h4 className="userStatFont">
                                Currently serving :
                              <Button
                                  variant="etherscan"
                                  title="Check it out on Etherscan!"
                                  onClick={() => { this.setState({ userMenu: undefined }); window.open("https://kovan.etherscan.io/address/" + this.state.addr) }}>
                                  {this.state.addr.substring(0, 6) + "..." + this.state.addr.substring(37, 42)}
                                </Button>
                              </h4>
                              <br></br>
                            </>
                          )}
                          {this.state.ETHBalance && (
                            <>
                              <h4 className="userStatFont">
                                ETH Balance : Ξ{this.state.ETHBalance.substring(0, 6)}
                              </h4>
                              <br></br>
                            </>
                          )}
                          {this.state.prufBalance && (
                            <>
                              <h4 className="userStatFont">
                                PRUF Balance : ü{Math.round(Number(this.state.prufBalance))}
                              </h4>
                              <br></br>
                            </>
                          )}
                          {this.state.IDTokenBalance && (
                            <>
                              <h4 className="userStatFont">
                                Token Minter : {this.state.IDTokenBalance > 0 && (<Check className="userIDBalance1" />)}
                                {this.state.IDTokenBalance === "0" && (
                                  <>
                                    <X className="userIDBalance0" />
                                    <Button
                                      variant="userButton"
                                      // onClick={() => { this.setState({ userMenu: undefined }); window.open("https://t.me/prufteam", "_blank") }}>
                                      onClick={() => { this.mintID() }}>
                                      Get ID
                              </Button>
                                  </>
                                )}
                                {/* {this.state.IDTokenBalance === "0" && (<X className="userIDBalance0" />)} */}
                              </h4>
                              <br></br>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <ul className="headerForm">
                  {window._contracts !== undefined && (
                    <nav>
                      {this.state.noAddrMenuBool === true && (<NoAddressComponent />)}
                      {this.state.isAuthUser && this.state.authorizedUserMenuBool === true && (<AuthorizedUserComponent />)}
                      {!this.state.isAuthUser && this.state.authorizedUserMenuBool === true && (<AuthorizedUserLogin />)}
                      {this.state.basicMenuBool === true && (<BasicComponent />)}
                      {this.state.faucetBool === true && (<FaucetComponent />)}
                    </nav>
                  )}
                </ul>
              </div>
            </div>
            <div className="pageForm">
              {this.state.alertBanner !== undefined && (
                <ClickAwayListener onClickAway={() => { this.setState({ alertBanner: undefined }) }}>
                  <Alert className="alertBanner" key={1} variant="danger" onClose={() => this.setState({ alertBanner: undefined })} dismissible>
                    {this.state.alertBanner}
                  </Alert>
                </ClickAwayListener>
              )}

              {this.state.particles === true && (
                <ParticleBox />
              )}

              <style type="text/css">
                {`
                      .btn-primary {
                        background-color: #00a8ff;
                        color: white;
                      }
                      .btn-primary:hover {
                        background-color: #23b6ff;
                        color: white;
                      }
                      .btn-primary:focus {
                        background: #00a8ff;
                      }
                      .btn-primary:active {
                        background: #00a8ff;
                      }

                      .btn-etherscan {
                        background-color: transparent;
                        color: white;
                        margin-top: -1.6rem;
                        font-size: 1.4rem;
                        height: 1.6rem;
                        width: fit-content;
                      }
                      .btn-etherscan:hover {
                        background-color: transparent;
                        color: #00a8ff;
                      }
                      .btn-etherscan:focus {
                        background-color: transparent;
                      }
                      .btn-etherscan:active {
                        background-color: transparent;
                        border: transparent;
                      }

                      .btn-assetDashboard {
                        background-color: transparent;
                        color: white;
                        margin-top: -0.5rem;
                        // margin-right: 37rem;
                        font-size: 1.6rem;
                        width: fit-content;
                      }
                      .btn-assetDashboard:hover {
                        background-color: transparent;
                        color: #00a8ff;
                      }
                      .btn-assetDashboard:focus {
                        background-color: transparent;
                      }
                      .btn-assetDashboard:active {
                        background-color: transparent;
                        border: transparent;
                      }

                      .btn-userButton {
                        background-color: transparent;
                        color: white;
                        margin-top: -0.5rem;
                        // margin-right: 37rem;
                        font-size: 1.4rem;
                        width: fit-content;
                        width: -moz-fit-content;
                      }
                      .btn-userButton:hover {
                        background-color: transparent;
                        color: #00a8ff;
                      }
                      .btn-userButton:focus {
                        background-color: transparent;
                      }
                      .btn-userButton:active {
                        background-color: transparent;
                        border: transparent;
                      }

                      .btn-toggle {
                        background-color: #002a40;
                        color: white;
                        height: 3rem;
                        width: 18rem;
                        margin-top: -0rem;
                        border-radius: 0;
                        font-weight: bold;
                        font-size: 1.4rem;
                        border-radius: 0rem 0.3rem 0.3rem 0rem;
                      }
                      .btn-toggle:hover {
                        background-color: #23b6ff;
                        color: white !important;
                      }
                      .btn-toggle:focus {
                        background-color: #23b6ff;
                        color: white !important;
                      }
                      .btn-toggle:active {
                        background-color: #23b6ff;
                        color: white !important;
                      }
                      .body {
                        overflow: hidden !important;
                      }
                   `}
              </style>
              <div>
                <Route exact path="/" component={Home} />
                {Router(this.state.routeRequest)}
              </div>
            </div>
            <NavLink to="/">
            </NavLink>
          </HashRouter >
        );
      }
    }

    //Watchdog which keeps state consistent with other components
    const updateWatchDog = setInterval(() => {

      if (this.state.ETHBalance !== window.ETHBalance && this.state.runWatchDog === true) {
        console.log("5")
        this.setState({ ETHBalance: window.ETHBalance })
      }

      // Remote menu switcher
      if (window.menuChange !== undefined) {
        console.log("6")
        console.log(window.menuChange)
        this.setState({ menuChange: window.menuChange })
      }

      //^^^
      if (this.state.menuChange !== undefined && this.state.runWatchDog === true) {
        console.log("7")
        window.menuChange = undefined

        if (isMobile && window.ethereum) {
          window.routeRequest = "basicMobile"
          this.setState({ routeRequest: "basicMobile" })
          this.setState({
            mobileMenuBool: true,
            assetHolderMenuBool: false,
            assetHolderUserMenuBool: false,
            basicMenuBool: false,
            assetClassHolderMenuBool: false,
            noAddrMenuBool: false,
            authorizedUserMenuBool: false
          })
        }
        
        else{
          this.setState({})
        }
      }

      //Catch late window.ethereum injection case (MetaMask mobile)
      if (isMobile && window.ethereum && window.routeRequest !== "basicMobile" && this.state.runWatchDog === true) {
        window.routeRequest = "basicMobile"
        this.setState({
          mobileMenuBool: true,
          faucetBool: false,
          noAddrMenuBool: false,
          assetHolderMenuBool: false,
          assetClassHolderMenuBool: false,
          basicMenuBool: false,
          authorizedUserMenuBool: false,
          hasFetchedBalances: false,
          routeRequest: "basicMobile"
        })
        window.web3.eth.getAccounts().then((e) => { this.setState({ addr: e[0] }); window.addr = e[0] });
        window.addEventListener("accountListener", this.acctChanger());
      }

      //if(this.state.hasMounted)console.log(window.aTknIDs,this.state.buildReady,window.ipfsCounter, this.state.runWatchDog)
    }, 500)

    this.netWorkWatchdog = setInterval(() => { if (this.state.runWatchDog === true) { window.web3.eth.net.getNetworkType().then((e) => { if (e === "kovan" && !this.state.isKovan) { this.setState({ isKovan: true }) } else if(e !== "kovan") { this.setState({ isKovan: false }) } }) } }, 800)

    //Local menu toggler for navlinks
    this.toggleMenu = async (menuChoice) => {

      console.log("Here")

    }

    //Set up held assets for rebuild. Recount when necessary

    this.mintID = async () => {
      await window.contracts.PARTY.methods
        .GET_ID()
        .send({ from: window.addr })
        .on("error", function (_error) {
          this.setState({ alertBanner: "Something went wrong when minting ID!" })
        })
        .on("receipt", (receipt) => {
          window.resetInfo = true;
          window.recount = true;
        });
    }
    
    //Get a single asset's ipfs description file contents using "lookup" (the destination hash) and "descElement" for the array to append 

    this.getIPFSJSONObject = (lookup, descElement) => {
      window.ipfs.cat(lookup, async (error, result) => {
        if (error) {
          console.log(lookup, "Something went wrong. Unable to find file on IPFS");
          descElement.push(undefined)
          window.ipfsCounter++
        } else {
          descElement.push(result)
          window.ipfsCounter++
        }
      });
    };

    //Handle an address change, update state accordingly @DEV check redundancy
    this.acctChanger = async () => {
      const ethereum = window.ethereum;
      const self = this;
      var _web3 = require("web3");
      _web3 = new Web3(_web3.givenProvider);
      ethereum.on("accountsChanged", function (accounts) {
        _web3.eth.getAccounts().then((e) => {
          if (window.addr !== e[0]) {
            if (e[0] === undefined || e[0] === null) {
              console.log("Here")
              window.routeRequest = "noAddr"
              self.setState({
                mobileMenuBool: false,
                noAddrMenuBool: true,
                assetHolderMenuBool: false,
                assetClassHolderMenuBool: false,
                basicMenuBool: false,
                faucetBool: false,
                authorizedUserMenuBool: false,
                hasFetchedBalances: false,
                routeRequest: "noAddr"
              })

              window.ETHBalance = undefined
              self.setState({
                assetClassBalance: undefined,
                assetBalance: undefined,
                IDTokenBalance: undefined,
                assetHolderBool: undefined,
                assetClassHolderBool: undefined,
                IDHolderBool: undefined,
                custodyType: undefined,
                hasFetchedBalances: undefined,
                ETHBalance: undefined,
                prufBalance: undefined,
              })

              window.addr = "";

            }

            else if (!isMobile) {
              window.routeRequest = "basic"
              self.setState({ routeRequest: "basic" });
              self.setState({
                mobileMenuBool: false,
                basicMenuBool: true,
                assetHolderMenuBool: false,
                assetHolderUserMenuBool: false,
                assetClassHolderMenuBool: false,
                faucetBool: false,
                noAddrMenuBool: false,
                authorizedUserMenuBool: false,
                settingsMenu: false
              })
            }


            if (window.location.href !== "/#/asset-dashboard") { window.location.href = "/#/" }

            window.addr = e[0];
            self.setState({ addr: e[0] });
            window.recount = true;
            window.resetInfo = true;
            self.setUpTokenVals();
            window.utils.getETHBalance();
            console.log("///////in acctChanger////////");
          }
          else { console.log("Something bit in the acct listener, but no changes made.") }
        });
      });
    };

    //Build contracts for app use. Only storage must be hardcoded, rest are retrieved STOR contract nameSpace
    this.setUpContractEnvironment = async (_web3) => {
      if (window.isSettingUpContracts) { return (console.log("Already in the middle of setUp...")) }
      window.isSettingUpContracts = true;
      _web3.eth.net.getNetworkType().then((e) => { if (e === "kovan") { this.setState({ isKovan: true }) } else { this.setState({ isKovan: false }) } })
      console.log("Setting up contracts")
      if (window.ethereum !== undefined) {
        if (!isMobile) {
          console.log("Here!")
          await this.setState({
            mobileMenuBool: false,
            noAddrMenuBool: false,
            assetHolderMenuBool: false,
            assetClassHolderMenuBool: false,
            basicMenuBool: true,
            authorizedUserMenuBool: false,
            hasFetchedBalances: false,
            routeRequest: "basic"
          })
        }

        else if (isMobile && _web3.eth.net.getNetworkType() != undefined) {
          await this.setState({
            mobileMenuBool: true,
            noAddrMenuBool: false,
            assetHolderMenuBool: false,
            assetClassHolderMenuBool: false,
            basicMenuBool: false,
            authorizedUserMenuBool: false,
            hasFetchedBalances: false,
            routeRequest: "basicMobile"
          })
        }

        else if (window.addr === undefined) {
          await this.setState({
            mobileMenuBool: false,
            noAddrMenuBool: true,
            assetHolderMenuBool: false,
            assetClassHolderMenuBool: false,
            basicMenuBool: false,
            authorizedUserMenuBool: false,
            hasFetchedBalances: false,
            routeRequest: "noAddr"
          })
        }



        window._contracts = await buildContracts(_web3)


        await this.setState({ contracts: window._contracts })
        await window.utils.getContracts()

        if (window.addr !== undefined) {
          await window.utils.getETHBalance();
          await this.setUpTokenVals()
          //await this.setUpAssets()
        }


        console.log("bools...", window.assetHolderBool, window.assetClassHolderBool, window.IDHolderBool)
        window.isSettingUpContracts = false;
        return this.setState({ runWatchDog: true })
      }

      else {
        window.isSettingUpContracts = true;
        window._contracts = await buildContracts(_web3)
        await this.setState({ contracts: window._contracts })
        await window.utils.getContracts()
        window.isSettingUpContracts = false;
        return this.setState({ runWatchDog: true })
      }

    }

    //hamburgerMenu bool switch @DEV Move to this declarations?
    this.hamburgerMenu = async () => {
      if (this.state.hamburgerMenu === undefined) {
        this.setState({
          hamburgerMenu: true,
          userMenu: false,
          settingsMenu: false

        })
      }
      else {
        this.setState({ hamburgerMenu: undefined })
      }
    }

    //hamburgerMenuMobile bool switch @DEV Move to this declarations?
    this.hamburgerMenuMobile = async () => {
      if (this.state.hamburgerMenuMobile === false) {
        this.setState({
          hamburgerMenuMobile: true,
          userMenuMobile: false
        })
      }
      else {
        this.setState({ hamburgerMenuMobile: false })
      }
    }

    //userMenu bool switch @DEV Move to this declarations?
    this.userMenu = async () => {
      if (this.state.userMenu === false) {
        this.setState({
          userMenu: true,
          settingsMenu: false
        })
      }
      else {
        this.setState({ userMenu: false })
      }
    }

    this.setUpTokenVals = async () => {
      const self = this;
      console.log("STV: Setting up balances")

      await window.utils.determineTokenBalance().then(async(e)=>{ console.log(e); 
        if(e !== undefined){
          await self.setState({
            prufBalance: e.prufTokenBalance,
            IDTokenBalance: e.IDTokenBalance,
            hasFetchedBalances: window.hasFetchedBalances
            })
        }
        else{
          this.setState({
            prufBalance: "N/A",
            IDTokenBalance: "N/A",
            hasFetchedBalances: window.hasFetchedBalances
          })
        }
      })

      await console.log(window.balances)
      
    }

    //userMenuMobile bool switch @DEV Move to this declarations?
    this.userMenuMobile = async () => {
      if (this.state.userMenuMobile === false) {
        this.setState({
          userMenuMobile: true,
          hamburgerMenuMobile: false,
        })
      }
      else {
        this.setState({ userMenuMobile: false })
      }
    }

    //settingsMenu bool switch @DEV Move to this declarations?
    this.particles = async () => {
      if (this.state.particles === false) {
        this.setState({
          particles: true,
        })
      }
      else {
        this.setState({ particles: false })
      }
    }

    //Component state declaration
    this.state = {
      IPFS: require("ipfs-mini"),
      isSTOROwner: undefined,
      isBPPOwner: undefined,
      isBPNPOwner: undefined,
      addr: undefined,
      web3: null,
      nameArray: [],
      notAvailable: "N/A",
      STOROwner: "",
      BPPOwner: "",
      BPNPOwner: "",
      APP: "",
      NP: "",
      STOR: "",
      AC_MGR: "",
      ECR_NC: "",
      ECR_MGR: "",
      AC_TKN: "",
      A_TKN: "",
      APP_NC: "",
      NP_NC: "",
      ECR2: "",
      PIP: "",
      RCLR: "",
      assetClass: undefined,
      contractArray: [],
      isAuthUser: false,
      hamburgerMenu: true,
      hamburgerMenuMobile: false,
      assetHolderBool: false,
      IDHolderBool: false,
      mobileMenuBool: false,
      assetClassHolderBool: false,
      assetHolderMenuBool: false,
      assetHolderUserMenuBool: false,
      assetClassHolderMenuBool: false,
      basicMenuBool: false,
      authorizedUserMenuBool: false,
      faucetBool: false,
      hasFetchedBalances: false,
      isACAdmin: undefined,
      runWatchDog: false,
      buildReady: false,
      hasMounted: false,
      routeRequest: "basic",
      userMenuMobile: false,
      userMenu: false,
      settingsMenu: false,
      blueIcons: true,
      particles: true,
    };
  }

  //stuff to do when component mounts in window
  componentDidMount() {
    
    window.balances = {}
    let timeOutCounter = 0;
    window.recount = false;
    let _web3, _ipfs;

    _ipfs = new this.state.IPFS({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });

    window.ipfs = _ipfs;

    _web3 = require("web3");
    _web3 = new Web3(_web3.givenProvider);
    this.setState({ web3: _web3 });
    window.web3 = _web3;

    buildWindowUtils() // get the utils object and make it globally accessible

    const checkForEthereum = () => { //Wait for MetaMask mobile to serve window.ethereum 
      timeOutCounter++;
      setTimeout(() => { if (!window.ethereum && timeOutCounter < 5) checkForEthereum() }, 500);
    }
    checkForEthereum();

    window.jdenticon_config = {
      hues: [196],
      lightness: {
        color: [0.36, 0.70],
        grayscale: [0.24, 0.82]
      },
      saturation: {
        color: 0.75,
        grayscale: 0.10
      },
      backColor: "#ffffffff"
    };

    //Declare a few globals
    window.sentPacket = undefined;
    window.isSettingUpContracts = false;
    window.hasLoadedAssets = false;
    let refString = String(window.location.href);
    if (!refString.includes("0x") || refString.substring(refString.indexOf('0x'), refString.length).length < 66) {
      window.location.href = '/#/';
    } else {
      if (isMobile) {
        window.location.href = '/#/retrieve-record-mobile/' + refString.substring(refString.indexOf('0x'), refString.indexOf('0x') + 66)
      } else {
        console.log(refString)
        window.location.href = '/#/retrieve-record/' + refString.substring(refString.indexOf('0x'), refString.indexOf('0x') + 66)
      }
      console.log("Here is the search:", window.location.hash)
    }
    window.menuChange = undefined;

    //Give me the desktop version
    if (!isMobile && window.ethereum) {
      console.log(_web3.eth.net.getNetworkType())
      console.log("Here")
      window.costs = {}
      window.additionalElementArrays = {
        photo: [],
        text: [],
        name: ""
      }

      //More globals (eth-is-connected specific)
      window.assetTokenInfo = {
        assetClass: undefined,
        idxHash: undefined,
        name: undefined,
        photos: undefined,
        text: undefined,
        status: undefined,
      }

      window.assets = { descriptions: [], ids: [], assetClassNames: [], assetClasses: [], countPairs: [], statuses: [], names: [], displayImages: [] };
      window.resetInfo = false;
      const ethereum = window.ethereum;

      ethereum.enable()

      _web3.eth.getAccounts().then((e) => { this.setState({ addr: e[0] }); window.addr = e[0] });
      window.addEventListener("accountListener", this.acctChanger());
      this.setUpContractEnvironment(_web3)
      this.setState({ hasMounted: true })
    }

    //Give me the mobile ethereum-enabled version
    else if (isMobile && window.ethereum) {

      console.log(_web3.eth.net.getNetworkType())

      console.log("Here")

      window.costs = {}
      window.additionalElementArrays = {
        photo: [],
        text: [],
        name: ""
      }
      window.assetTokenInfo = {
        assetClass: undefined,
        idxHash: undefined,
        name: undefined,
        photos: undefined,
        text: undefined,
        status: undefined,
      }
      window.assets = { descriptions: [], ids: [], assetClassNames: [], assetClasses: [], countPairs: [], statuses: [], names: [], displayImages: [] };
      window.resetInfo = false;

      window.routeRequest = "basicMobile";
      this.setState({
        mobileMenuBool: true,
        noAddrMenuBool: false,
        assetHolderMenuBool: false,
        assetClassHolderMenuBool: false,
        basicMenuBool: false,
        authorizedUserMenuBool: false,
        hasFetchedBalances: false,
        routeRequest: "basicMobile"
      })

      _ipfs = new this.state.IPFS({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
      });

      window.ipfs = _ipfs;

      _web3.eth.getAccounts().then((e) => { this.setState({ addr: e[0] }); window.addr = e[0] });

      window.addEventListener("accountListener", this.acctChanger());
      this.setUpContractEnvironment(_web3)


      this.setState({ hasMounted: true })
    }

    //Give me the read-only version
    else {
      console.log("Here")
      window.ipfsCounter = 0;
      _web3 = require("web3");
      _web3 = new Web3("https://api.infura.io/v1/jsonrpc/kovan");
      this.setUpContractEnvironment(_web3)
      this.setState({ web3: _web3 });
      window.web3 = _web3;

      this.setState({
        mobileMenuBool: false,
        noAddrMenuBool: true,
        assetHolderMenuBool: false,
        assetClassHolderMenuBool: false,
        basicMenuBool: false,
        authorizedUserMenuBool: false,
        hasFetchedBalances: false,
        routeRequest: "noAddr"
      })

      _ipfs = new this.state.IPFS({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
      });

      window.ipfs = _ipfs;

      this.setState({ hasMounted: true })
    }

  }

  //Catch default
  componentDidCatch(error, info) {
    console.log(info.componentStack)
  }

  //Update state so the next render will show the fallback UI
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  //stuff to do when state updates
  componentDidUpdate() {
    if (!window.ethereum && this.state.hasMounted === true && this.state.routeRequest !== "noAddr") {

      window.routeRequest = "noAddr";
      this.setState({
        mobileMenuBool: false,
        noAddrMenuBool: true,
        assetHolderMenuBool: false,
        assetClassHolderMenuBool: false,
        basicMenuBool: false,
        authorizedUserMenuBool: false,
        hasFetchedBalances: false,
        routeRequest: "noAddr"
      })
    }

    if (window.addr !== undefined && !this.state.hasFetchedBalances && window.contracts > 0) {
      this.setUpContractEnvironment(window.web3);
    }

  }

  //stuff do do when component unmounts from the window (should never happen for main unless tab closed)
  componentWillUnmount() {
    //clearInterval(this.updateWatchDog);
    console.log("unmounting component");
  }

  render() {

    //render continuously produces an up-to-date stateful webpage  

    if (this.state.hasError) {
      return (
        <div>
          <h1> OOPS! </h1>
          <h2> An error occoured. Please ensure you are connected to an ethereum provider and reload the page. </h2>
          <h3> NOTE: THIS APPLICATION IS IN ALPHA, IF YOU SEE THIS MESSAGE, PLEASE SEND A REPORT TO support@pruf.io using the icon below </h3>
          <br></br>
          <div className="errorMediaLink">
            <a className="centeredErrorButtons"><Mail size={20} onClick={() => { window.open("mailto:support@pruf.io", "_blank") }} /></a>
          </div>
        </div>)
    }

    if (this.state.isKovan === false) {
      return (
        <div>
          <h1> Please connect to the Kovan testnet and reload the page. </h1>
          <br></br>
        </div>)
    }

    return this.renderContent();
  }
}

export default Main;
