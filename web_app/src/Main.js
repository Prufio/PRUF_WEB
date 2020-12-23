import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import { ClickAwayListener } from '@material-ui/core';
import Web3 from "web3";
import Home from "./Home";
import HomeMobile from "./Mobile/HomeMobile";
import buildContracts from "./Resources/Contracts";
import buildWindowUtils from "./Resources/WindowUtils";
import NonCustodialComponent from "./Resources/NonCustodialComponent";
import NonCustodialUserComponent from "./Resources/NonCustodialUserComponent";
import AdminComponent from "./Resources/AdminComponent";
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
import { isMobile } from "react-device-detect";
import { isFirefox } from "is-firefox";
import { isSafari } from "is-safari";
import Jdenticon from 'react-jdenticon';
import Robohash from 'react-robohash';
import Form from "react-bootstrap/Form";

class Main extends Component {
  constructor(props) {
    super(props);

    this.renderContent = () => {
      if (isSafari && !isMobile) {
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
      if (isSafari && isMobile) {
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
                                      else { alert("You do not currently have a Web3 provider installed, we recommend MetaMask"); }
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
                                      onClick={() => { alert(this.state.assetClassReport) }}>
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
                                      // onClick={() => { alert("This functionality has been disabled until Alpha-Testing begins") }}
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
              {this.state.assetHolderMenuBool === true && (
                <button
                  className="imageButton"
                  title="Back to Home!"
                  onClick={() => { window.location.href = '/#/' }}
                >
                  <img
                    className="downSizeLogo"
                    src={require("./Resources/Images/PrufTokenMinter.png")}
                    alt="Pruf Logo" />
                </button>
              )}
              {this.state.assetHolderUserMenuBool === true && (
                <button
                  className="imageButton"
                  title="Back to Home!"
                  onClick={() => { window.location.href = '/#/' }}
                >
                  <img
                    className="downSizeLogo"
                    src={require("./Resources/Images/PrufTokenHolder.png")}
                    alt="Pruf Logo" />
                </button>
              )}
              {this.state.assetClassHolderMenuBool === true && (
                <button
                  className="imageButton"
                  title="Back to Home!"
                  onClick={() => { window.location.href = '/#/' }}
                >
                  <img
                    className="downSizeLogo"
                    src={require("./Resources/Images/PrufACAdmin.png")}
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
                      December 23, 2020
                  </h3>
                    <h3>
                      <a onClick={() => { window.open("https://pruf.io", "_blank") }}> © pruf.io </a>
                    </h3>
                    <h3>
                      {this.state.routeRequest === "noAddr"
                        ? <a onClick={() => { window.open("https://github.com/Prufio", "_blank") }}> Version A1.2.0 </a>
                        : <a href='/#/DnvkxiOAFy_vDC' className="siteInfoBoxExtra" /* onClick={() => { window.location.href = '/#/DnvkxiOAFy_vDC' } }*/> Version A1.2.0 </a>}
                    </h3>
                    <Form.Check
                      type="checkbox"
                      className="checkBoxParticles"
                      id="inlineFormCheck"
                      onChange={() => { this.particles() }}
                    />
                    <h3 className="textParticles">
                      Particles Off
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
                  <ClickAwayListener onClickAway={() => { this.setState({ settingsMenu: false }) }}>
                    <div className="hamburgerMenuLink">
                      <a className="hamburgerMenuLinkContentSettings"><Settings size={35} onClick={() => { this.settingsMenu() }} /></a>
                    </div>
                  </ ClickAwayListener>
                  <div>
                    {this.state.settingsMenu === true && (
                      <div>
                        <div className="hamburgerDropdownSettings">
                          {/* {this.state.assetClassHolderBool === false && this.state.assetHolderBool === false && this.state.IDHolderBool === false && (
                            <Button
                              size="lg"
                              variant="toggle"
                              onClick={() => {
                                this.setState({ settingsMenu: false })
                                if (window.ethereum) {
                                  if (window.confirm("Either you need to log into your ethereum provider, or you do not hold any PRuF assets. Click 'OK' to learn more on our website.")) {
                                    window.open('https://pruf.io/')
                                  }
                                }
                                else {
                                  if (window.confirm("You do not currently have a Web3 provider installed. We recommend MetaMask; if you would like to be redirected to their officail site, press 'OK'")) {
                                    window.open('https://metamask.io/')
                                  }
                                }

                              }
                              }
                            >
                              No Menu Options
                            </Button>
                          )} */}

                          {this.state.assetClassHolderBool === true && this.state.assetClassHolderMenuBool === false && (
                            <Button
                              size="lg"
                              variant="toggle"
                              onClick={() => { this.toggleMenu("ACAdmin") }}
                            >
                              AC Admin Menu
                            </Button>
                          )}

                          {this.state.IDHolderBool === false && this.state.assetHolderBool === true && this.state.assetHolderUserMenuBool === false && (
                            <Button
                              size="lg"
                              variant="toggle"
                              onClick={() => { this.toggleMenu("NCUser") }}
                            >
                              Token Holder Menu
                            </Button>
                          )}

                          {/* {this.state.faucetBool === false && this.state.routeRequest !== "noAddr" && (
                            <Button
                              size="lg"
                              variant="toggle"
                              onClick={() => { this.toggleMenu("faucet") }}
                            >
                              Faucet Menu
                            </Button>
                          )}
                             */}
                          {this.state.IDHolderBool === true && this.state.assetHolderMenuBool === false && (
                            <Button
                              size="lg"
                              variant="toggle"
                              onClick={() => { this.toggleMenu("NC") }}
                            >
                              Token Minter Menu
                            </Button>
                          )}

                          {this.state.basicMenuBool === false && this.state.routeRequest !== "noAddr" && (
                            <Button
                              size="lg"
                              variant="toggle"
                              onClick={() => { this.toggleMenu("basic") }}
                            >
                              Basic Menu
                            </Button>)}

                          {/* {this.state.isAuthUser === false && this.state.authorizedUserMenuBool === false && (
                            <Button
                              size="lg"
                              variant="toggle"
                              onClick={() => { this.toggleMenu("authUser"); }}
                            >
                              Cusdodian Sign-In
                            </Button>)} */}
                          {/* {this.state.isAuthUser === true && this.state.authorizedUserMenuBool === false && (
                            <Button
                              size="lg"
                              variant="toggle"
                              onClick={() => { this.toggleMenu("authUser") }}
                            >
                              Cusdodian Menu
                            </Button>)} */}

                        </div>
                      </div>
                    )}
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
                                else { alert("You do not currently have a Web3 provider installed, we recommend MetaMask"); }
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
                                onClick={() => { this.faucet() }}>
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
                                onClick={() => { this.assetClassDashboard() }}>
                                {this.state.assetClassBalance}
                              </Button>
                              <Button
                                variant="userButton"
                                onClick={() => { this.faucet() }}>
                                Get AC
                              </Button>
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
                                onClick={() => { this.assetDashboard() }}>
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
                  </div>
                </div>
              )}
              <ul className="headerForm">
                {window._contracts !== undefined && (
                  <nav>
                    {this.state.noAddrMenuBool === true && (<NoAddressComponent />)}
                    {this.state.assetHolderMenuBool === true && (<NonCustodialComponent />)}
                    {this.state.assetHolderUserMenuBool === true && (<NonCustodialUserComponent />)}
                    {this.state.assetClassHolderMenuBool === true && (<AdminComponent />)}
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

    //Watchdog which keeps state consistent with other components
    this.updateWatchDog = setInterval(() => {

      //every tick ensure user auth level/user type is correct
      if (this.state.isAuthUser !== window.isAuthUser && window.isAuthUser !== undefined && this.state.runWatchDog === true) {
        this.setState({ isAuthUser: window.isAuthUser })
      }

      if (this.state.isACAdmin !== window.isACAdmin && this.state.runWatchDog === true) {
        this.setState({ isACAdmin: window.isACAdmin })
      }

      if (this.state.custodyType !== window.custodyType && this.state.runWatchDog === true) {
        this.setState({ custodyType: window.custodyType })
      }

      //Reset balance values to reflect in render
      if (window.balances !== undefined && this.state.runWatchDog === true) {
        if (
          Object.values(window.balances) !==
          Object.values({ assetClass: this.state.assetClassBalance, asset: this.state.assetBalance, ID: this.state.IDTokenBalance })) {
          this.setState({
            assetClassBalance: window.balances.assetClassBalance,
            assetBalance: window.balances.assetBalance,
            IDTokenBalance: window.balances.IDTokenBalance,
            prufBalance: window.balances.prufTokenBalance,
            assetHolderBool: window.assetHolderBool,
            assetClassHolderBool: window.assetClassHolderBool,
            IDHolderBool: window.IDHolderBool,
            custodyType: window.custodyType,
            hasFetchedBalances: window.hasFetchedBalances
          })
        }
      }

      if (this.state.ETHBalance !== window.ETHBalance && this.state.runWatchDog === true) {
        this.setState({ ETHBalance: window.ETHBalance })
      }

      // Remote menu switcher
      if (window.menuChange !== undefined && this.state.runWatchDog === true) {
        console.log(window.menuChange)
        this.setState({ menuChange: window.menuChange })
      }

      //^^^
      if (this.state.menuChange !== undefined && this.state.runWatchDog === true) {
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

        else if (!isMobile && this.state.menuChange === "ACAdmin" && this.state.runWatchDog === true) {
          window.routeRequest = "ACAdmin"
          this.setState({ routeRequest: "ACAdmin" })
          this.setState({
            mobileMenuBool: false,
            assetHolderMenuBool: false,
            faucetBool: false,
            assetHolderUserMenuBool: false,
            basicMenuBool: false,
            assetClassHolderMenuBool: true,
            noAddrMenuBool: false,
            authorizedUserMenuBool: false
          })
          this.setState({ menuChange: undefined });
        }

        else if (!isMobile && this.state.menuChange === "NC" && this.state.IDHolderBool === true && this.state.runWatchDog === true) {
          window.routeRequest = "NCAdmin"
          this.setState({ routeRequest: "NCAdmin" })
          this.setState({
            mobileMenuBool: false,
            assetHolderMenuBool: true,
            faucetBool: false,
            assetHolderUserMenuBool: false,
            basicMenuBool: false,
            assetClassHolderMenuBool: false,
            noAddrMenuBool: false,
            authorizedUserMenuBool: false
          })
          this.setState({ menuChange: undefined });
        }

        else if (!isMobile && this.state.menuChange === "NC" && this.state.IDHolderBool === false && this.state.runWatchDog === true) {
          window.routeRequest = "NCUser"
          this.setState({ routeRequest: "NCUser" })
          this.setState({
            mobileMenuBool: false,
            faucetBool: false,
            assetHolderMenuBool: false,
            assetHolderUserMenuBool: true,
            basicMenuBool: false,
            assetClassHolderMenuBool: false,
            noAddrMenuBool: false,
            authorizedUserMenuBool: false
          })

          this.setState({ menuChange: undefined });
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

      //Catch updated assets case and rebuild asset inventory 
      if (window.assets !== undefined && this.state.runWatchDog === true) {
        if (window.assets.ids.length > 0 && window.assets.names.length === 0 && this.state.buildReady === true) {
          if (window.ipfsCounter >= window.aTknIDs.length && window.resetInfo === false) {
            console.log("WD: rebuilding assets (Last Step)")
            alert("WD: rebuilding assets (Last Step) ")
            this.buildAssets()
          }
        }
      }

      //If reset was remotely requested, begin full asset recount  
      if (window.resetInfo === true && this.state.runWatchDog === true) {
        window.hasLoadedAssetClasses = false;
        window.hasLoadedAssets = false;
        this.setState({ buildReady: false, runWatchDog: false })
        console.log("WD: setting up assets (Step one)")
        this.setUpAssets()
        window.resetInfo = false
      }

      //In the case of a completed recount and rough asset build, make asset info usable for app
      if (window.aTknIDs !== undefined && this.state.buildReady === false && this.state.runWatchDog === true) {
        if (window.ipfsCounter >= window.aTknIDs.length && this.state.runWatchDog === true && window.aTknIDs.length > 0) {
          console.log("Assets are ready for rebuild")
          alert("WD: Assets Deemed ready for rebuild.")
          this.setState({ buildReady: true})
        }
      }

      //Assets finished rebuilding, flip rebuild switch
      else if ((this.state.buildReady === true && window.ipfsCounter < window.aTknIDs.length) ||
        (this.state.buildReady === true && this.state.runWatchDog === false)) {
        console.log("Assets finished rebuilding, no longer reaady for rebuild")
        this.setState({ buildReady: false })
      }
    }, 100)

    //Local menu toggler for navlinks
    this.toggleMenu = async (menuChoice) => {

      console.log("Here")


      if (window.menuChange === undefined) {
        window.location.href = '/#/';
      }

      console.log(menuChoice)

      if (menuChoice === 'ACAdmin') {
        window.routeRequest = "ACAdmin"
        await this.setState({ routeRequest: "ACAdmin" });
        await this.setState({
          mobileMenuBool: false,
          faucetBool: false,
          assetClassHolderMenuBool: true,
          assetHolderMenuBool: false,
          assetHolderUserMenuBool: false,
          basicMenuBool: false,
          noAddrMenuBool: false,
          authorizedUserMenuBool: false,
          settingsMenu: false
        })
        window.menuChange = undefined;
      }

      else if (menuChoice === 'basic') {
        window.routeRequest = "basic"
        await this.setState({ routeRequest: "basic" });
        await this.setState({
          mobileMenuBool: false,
          faucetBool: false,
          basicMenuBool: true,
          assetHolderMenuBool: false,
          assetHolderUserMenuBool: false,
          assetClassHolderMenuBool: false,
          noAddrMenuBool: false,
          authorizedUserMenuBool: false,
          settingsMenu: false
        })
        window.menuChange = undefined;
      }

      else if (menuChoice === 'mobileBasic') {
        window.routeRequest = "mobileBasic"
        await this.setState({ routeRequest: "mobileBasic" });
        await this.setState({
          mobileMenuBool: true,
          faucetBool: false,
          basicMenuBool: false,
          assetHolderMenuBool: false,
          assetHolderUserMenuBool: false,
          assetClassHolderMenuBool: false,
          noAddrMenuBool: false,
          authorizedUserMenuBool: false,
          settingsMenu: false
        })
        window.menuChange = undefined;
      }

      else if (menuChoice === 'faucet') {
        window.routeRequest = "faucet"
        await this.setState({ routeRequest: "faucet" });
        await this.setState({
          mobileMenuBool: false,
          faucetBool: true,
          basicMenuBool: false,
          assetHolderMenuBool: false,
          assetHolderUserMenuBool: false,
          assetClassHolderMenuBool: false,
          noAddrMenuBool: false,
          authorizedUserMenuBool: false,
          settingsMenu: false
        })
        window.menuChange = undefined;
      }

      else if (menuChoice === 'NC') {
        window.routeRequest = "NCAdmin"
        await this.setState({ routeRequest: "NCAdmin" })
        await this.setState({
          mobileMenuBool: false,
          faucetBool: false,
          assetHolderMenuBool: true,
          assetHolderUserMenuBool: false,
          basicMenuBool: false,
          assetClassHolderMenuBool: false,
          noAddrMenuBool: false,
          authorizedUserMenuBool: false,
          settingsMenu: false
        })
        window.menuChange = undefined;
      }

      else if (menuChoice === 'NCUser') {
        console.log(menuChoice)
        window.routeRequest = "NCUser"
        await this.setState({ routeRequest: "NCUser" })
        await this.setState({
          mobileMenuBool: false,
          faucetBool: false,
          assetHolderMenuBool: false,
          assetHolderUserMenuBool: true,
          basicMenuBool: false,
          assetClassHolderMenuBool: false,
          noAddrMenuBool: false,
          authorizedUserMenuBool: false,
          settingsMenu: false
        })
        window.menuChange = undefined;
      }

      else if (menuChoice === 'authUser') {
        window.routeRequest = "authUser"
        await this.setState({ routeRequest: "authUser" });
        await this.setState({
          mobileMenuBool: false,
          faucetBool: false,
          authorizedUserMenuBool: true,
          assetHolderMenuBool: false,
          assetHolderUserMenuBool: false,
          assetClassHolderMenuBool: false,
          noAddrMenuBool: false,
          basicMenuBool: false,
          settingsMenu: false
        })
        window.menuChange = undefined;
        if (!this.state.isAuthUser) { window.location.href = '/#/login' }
      }

    }

    //Faucet bool switch
    this.faucet = () => {
      this.setState({ userMenu: undefined });
      this.toggleMenu("faucet");
      window.location.href = '/#/faucet';
    }

    //dashBoard bool switch
    this.assetDashboard = () => {
      this.setState({ userMenu: undefined });
      this.toggleMenu("basic");
      window.location.href = '/#/asset-dashboard'
    }

    this.assetClassDashboard = () => {
      this.setState({ userMenu: undefined });
      this.toggleMenu("basic");
      window.location.href = '/#/ac-dashboard'
    }

    //Set up held assets for rebuild. Recount when necessary
    this.setUpAssets = async () => {
      window.hasNoAssets = false;
      window.hasNoAssetClasses = false;
      let report = "AC Nodes Held:\n";
      window.ipfsCounter = 0;
      window.ipfsHashArray = [];
      window.assets = { descriptions: [], ids: [], assetClassNames: [], assetClasses: [], countPairs: [], statuses: [], names: [], displayImages: [] };

      window.assetClasses = { names: [], exData: [], discounts: [], custodyTypes: [], roots: [], ids: [], identicons: [], identiconsLG: [] }
      window.hasLoadedAssetClasses = false;
      window.assetTokenInfo = {
        assetClass: undefined,
        idxHash: undefined,
        name: undefined,
        photos: undefined,
        text: undefined,
        status: undefined,
      }

      //Case of recount
      if (window.recount === true) {
        window.aTknIDs = [];
        window.acTknIDs = [];
        if (window.balances !== undefined) window.balances.assetBalance = undefined;
        window.recount = false
        await window.utils.getETHBalance();
        return this.setUpTokenVals(true)
      }

      //If there are balances to get, lock them into state
      if (window.balances !== undefined) {
        this.setState({
          assetClassBalance: window.balances.assetClassBalance,
          assetBalance: window.balances.assetBalance,
          IDTokenBalance: window.balances.IDTokenBalance,
          prufBalance: window.balances.prufTokenBalance,
          assetHolderBool: window.assetHolderBool,
          assetClassHolderBool: window.assetClassHolderBool,
          IDHolderBool: window.IDHolderBool,
          custodyType: window.custodyType,
          hasFetchedBalances: window.hasFetchedBalances
        })
      }

      //Do a full update if the balances are returning undefined at this stage (They should never do this)
      if (window.balances === undefined) {
        console.log("balances undefined, trying to get them...");
        //if (window.addr === undefined) { return this.forceUpdate }
        return this.setUpTokenVals(true);
      }
      console.log("SA: In setUpAssets")

      let tempDescObj = {}
      let tempDescriptionsArray = [];
      let tempNamesArray = [];

      //Get all asset token profiles for parsing
      alert("IN SETUP ASSETS")
      await window.utils.getAssetTokenInfo()
      window.assetClasses = await window.utils.getAssetClassTokenInfo()

      if (window.aTknIDs === undefined) { return }

      for (let i = 0; i < window.aTknIDs.length; i++) {
        tempDescObj["desc" + i] = []
        await this.getIPFSJSONObject(window.ipfsHashArray[i], tempDescObj["desc" + i])
      }

      console.log("Temp description obj: ", tempDescObj)

      for (let x = 0; x < window.aTknIDs.length; x++) {
        let tempArray = tempDescObj["desc" + x]
        await tempDescriptionsArray.push(tempArray)
      }

      window.assets.descriptions = tempDescriptionsArray;
      window.assets.names = tempNamesArray;
      window.assets.ids = window.aTknIDs;

      console.log("Asset setUp Complete. Turning on watchDog.")

      //Build an AC report for provisional placeholder on AC node bal
      if (window.assetClasses !== undefined) {
        if (window.assetClasses.ids !== undefined) {
          for (let i = 0; i < window.assetClasses.ids.length; i++) {
            report += ((i + 1) + ".) " + window.assetClasses.names[i]
              + "\nCustody type: " + window.assetClasses.custodyTypes[i]
              + "\nroot ACN: " + window.assetClasses.roots[i]
              + "\nnode ID: " + window.assetClasses.ids[i]
              + "\nshare: " + window.assetClasses.discounts[i] / 100 + "%\n----------\n")
          }
        }
        else {
          report = "No AC nodekeys held by user";
        }
      }

      //{ names, custodyTypes, exData, roots, discounts, ids: tknIDArray }
      this.setState({ assetClassReport: report })

      await this.setState({ runWatchDog: true })
      console.log("IPFS operation count: ", window.ipfsCounter)
      console.log("Prebuild Assets: ", window.assets)
      console.log("Bools...", this.state.assetHolderBool, this.state.assetClassHolderBool, this.state.IDHolderBool)
      alert("PREBUILD FINISHED" + this.state.runWatchDog + window.balances.assetBalance)
      //console.log(window.assets.ids, " aTkn-> ", window.aTknIDs)
    }

    this.mintID = async () => {
      await window.contracts.PARTY.methods
        .GET_ID()
        .send({ from: window.addr })
        .on("error", function (_error) {
          alert("Something went wrong when minting ID!")
        })
        .on("receipt", (receipt) => {
          window.resetInfo = true;
          window.recount = true;
        });
    }

    this.setBlueIcons = () => {
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
    }

    this.setGreenIcons = () => {
      window.jdenticon_config = {
        hues: [126],
        lightness: {
          color: [0.42, 0.72],
          grayscale: [0.37, 0.86]
        },
        saturation: {
          color: 0.75,
          grayscale: 0.74
        },
        backColor: "#ffffffff"
      };
    }

    //Rebuild fetched assets, preparing them for use by the app
    this.buildAssets = async () => {
      console.log("BA: In buildAssets. IPFS operation count: ", window.ipfsCounter)
      alert("BA: In buildAssets. IPFS operation count: " + window.ipfsCounter)

      alert("Some Vars: atkns" + window.aTknIDs.length + " acs" + window.assetClasses.ids.length)
      window.ipfsCounter = 0;
      let tempDescArray = [];
      let emptyDesc = { photo: {}, text: {}, name: "" }

      //Get objects from unparsed asset data for reference in the app 
      for (let i = 0; i < window.aTknIDs.length; i++) {
        //console.log(window.assets.descriptions[i][0])
        if (window.assets.descriptions[i][0] !== undefined) {
          tempDescArray.push(JSON.parse(window.assets.descriptions[i][0]))
        }
        else {
          tempDescArray.push(emptyDesc)
        }
      }

      //Get specifically name from the ipfs object of each asset (if it exists)
      let tempNameArray = [];
      for (let x = 0; x < window.aTknIDs.length; x++) {
        if (tempDescArray[x].name === "" || tempDescArray[x].name === undefined) {
          tempNameArray.push("Not Available")
        }
        else {
          tempNameArray.push(tempDescArray[x].name)
        }

      }
      let identicons = [], AC_Identicons = [];
      let identiconsLG = [], AC_IdenticonsLG = [];

      //In case of no images set in ipfs
      if(window.aTknIDs !== undefined){
        alert("Found A Tokens")
        for (let e = 0; e < window.aTknIDs.length; e++) {
          identicons.push(<Jdenticon size="115" value={window.aTknIDs[e]} />)
        }
  
        for (let e = 0; e < window.aTknIDs.length; e++) {
          identiconsLG.push(<Jdenticon size="230" value={window.aTknIDs[e]} />)
        }
      }
      
      if(window.assetClasses.ids !== undefined){
        alert("Found AC Tokens")
        for (let e = 0; e < window.assetClasses.ids.length; e++){
          AC_Identicons.push(<Jdenticon size="115" value={window.assetClasses.ids[e]} />)
        }
  
        for (let e = 0; e < window.assetClasses.ids.length; e++){
          AC_IdenticonsLG.push(<Jdenticon size="230" value={window.assetClasses.ids[e]} />)
        }
      }


      let tempDisplayArray = [];
      //Set up displayImages
      for (let j = 0; j < window.aTknIDs.length; j++) {
        if (tempDescArray[j].photo.DisplayImage === undefined && Object.values(tempDescArray[j].photo).length === 0) {
          tempDisplayArray.push("")
        }

        else if (tempDescArray[j].photo.DisplayImage === undefined && Object.values(tempDescArray[j].photo).length > 0) {
          tempDisplayArray.push(Object.values(tempDescArray[j].photo)[0])
        }

        else {
          tempDisplayArray.push(tempDescArray[j].photo.DisplayImage)
        }
      }

      window.assetClasses.identicons = AC_Identicons;
      window.assetClasses.identiconsLG = AC_IdenticonsLG;
      window.assets.identiconsLG = identiconsLG;
      window.assets.identicons = identicons;
      window.assets.descriptions = tempDescArray;
      window.assets.names = tempNameArray;
      window.assets.displayImages = tempDisplayArray;
      window.hasLoadedAssets = true;
      window.hasLoadedAssetClasses = true;
      console.log("BA: Assets after rebuild: ", window.assets)
      console.log("BA: AssetClasses after rebuild: ", window.assetClasses)
      return alert("Assets Built: " + window.assets.ids.length)
    }

    //Count up user tokens, takes  "willSetup" bool to determine whether to call setUpAssets() after count
    this.setUpTokenVals = async (willSetup) => {
      window.balances = {}
      console.log("STV: Setting up balances")

      await window.utils.determineTokenBalance()
      await console.log(window.balances)
      if (willSetup) {
        return this.setUpAssets()
      }
    }

    //Get a single asset's ipfs description file contents using "lookup" (the destination hash) and "descElement" for the array to append 

    this.getIPFSJSONObject = (lookup, descElement) => {
      //console.log(lookup)
      window.ipfs.cat(lookup, async (error, result) => {
        if (error) {
          console.log(lookup, "Something went wrong. Unable to find file on IPFS");
          descElement.push(undefined)
          window.ipfsCounter++
          //console.log(window.ipfsCounter)
        } else {
          //console.log(lookup, "Here's what we found for asset description: ", result);
          descElement.push(result)
          window.ipfsCounter++
          //console.log(window.ipfsCounter)
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
              window.balances = {};

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


            if (window.location.href !== "/#/asset-dashboard") { window.location.href = "/#" }

            window.addr = e[0];
            window.assetClass = undefined;
            window.isAuthUser = false;
            window.isACAdmin = false;
            self.setState({ addr: e[0] });
            window.recount = true;
            window.resetInfo = true;

            //self.setUpContractEnvironment(window.web3);
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
          await this.setUpAssets()
        }


        console.log("bools...", window.assetHolderBool, window.assetClassHolderBool, window.IDHolderBool)
        //console.log("Wallet balance in ETH: ", window.ETHBalance)
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
    this.settingsMenu = async () => {
      if (this.state.settingsMenu === false) {
        this.setState({
          settingsMenu: true,
          userMenu: false
        })
      }
      else {
        this.setState({ settingsMenu: false })
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
    let timeOutCounter = 0;
    let _web3, _ipfs;
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
    if(!refString.includes("0x") || refString.substring(refString.indexOf('0x'), refString.length).length < 66){
      window.location.href = '/#/';
    } else {
      if(isMobile){
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
    clearInterval(this.updateWatchDog);
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

    return this.renderContent();
  }
}

export default Main;
