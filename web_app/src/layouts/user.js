import React from "react";
import cx from "classnames";
import swal from "sweetalert";
import Web3 from "web3";
import { isMobile } from "react-device-detect";
import { Switch, Route, Redirect } from "react-router-dom";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Eth from '../assets/img/eth-logo.png'
import {Cached} from '@material-ui/icons'
import Footer from "components/Footer/Footer.js";

// core components
import AdminNavbar from "components/Navbars/userNavbar.js";
import Button from "components/CustomButtons/Button.js";
import Pruf from "../assets/img/pruftoken.png";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import CardFooter from 'components/Card/CardFooter.js'

import routes from "routes.js";

import userStyle from "assets/jss/material-dashboard-pro-react/layouts/userStyle.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

var ps;

const useStyles = makeStyles(styles);
const userStyles = makeStyles(userStyle);

export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const [miniActive, setMiniActive] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(true);
  const [addr, setAddr] = React.useState("");
  const [roots, setRoots] = React.useState(undefined);
  const [useConnected, setUseConnected] = React.useState(false);
  const [transacting, setTransacting] = React.useState(false);
  const [customAddress, setCustomAddress] = React.useState("");
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [logo, setLogo] = React.useState(require("assets/img/logo-white.svg"));
  const [splitter, setSplitter] = React.useState({});
  const [util, setUtil] = React.useState({})
  const updatedEther = false
  const isRefreshingEther = false
  const updatedPruf = false
  const isRefreshingPruf = false
  // styles
  const classes = useStyles();
  const userClasses = userStyles();
  //classes for main panel
  const mainPanelClasses =
    classes.mainPanel +
    " " +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1,
    });

  // ref for main panel div
  const mainPanel = React.createRef();

  const chainListener = () => {
    window.ethereum.on("chainChanged", (chainId) => {
      console.log(chainId);
      window.location.reload();
    });
  };

  const acctListener = () => {
    window.ethereum.on("accountsChanged", (e) => {
      console.log("Accounts changed");
      if (e[0] === undefined || e[0] === null) {
        if (e[0] !== addr) {
          window.location.reload();
        }
      } else if (e[0] !== addr) {
        window.location.reload();
      }
    });
  };

  if (window.ethereum) {
    window.addEventListener("chainListener", chainListener, { once: true });
    window.addEventListener("accountListener", acctListener, { once: true });
  }

  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({
          method: "eth_accounts",
          params: {},
        })
        .then(async (accounts) => {
          console.log(window.web3.utils.toChecksumAddress(accounts[0]));
          setAddr(window.web3.utils.toChecksumAddress(accounts[0]));
        });
    }

    let web3 = require("web3");
    web3 = new Web3(
      web3.givenProvider ||
        "https://kovan.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959"
    );
    window.web3 = web3;

    console.log({ web3 });

    if (navigator.platform.indexOf("Win") > -1) {
      //console.log("*****Using ps*****");
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
      setSps(ps);
      //console.log(ps);
    }

    window.addEventListener("resize", resizeFunction);

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  }, []);

  const split = () => {
    if (useConnected) {
      console.log(`Splitting balance of ${addr}`);
    } else {
      if (window.web3.utils.isAddress(customAddress)) {
        console.log(`Splitting balance of ${customAddress}`);
      } else {
        return swal(`Given value "${customAddress}" is not a valid Ethereum address`);
      }
    }
    setTransacting(true);
    setTimeout(async () => {setTransacting(false); swal("Tokens split successfully!")}, 2000);
  };

  const getActiveRoute = (routes) => {
    let activeRoute = "Token Splitter";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/split") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={() => <prop.component splitter={splitter.methods} />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const handleCustomAddress = (e) => {
    setCustomAddress(e.target.value || undefined)
    if(window.web3.utils.isAddress(e.target.value)){
      getSnapShotInfo(e.target.value)
    }
  }

  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  const refreshBalances = () => {
      if (!props.addr) return
      console.log('Refreshing balances')
      console.log(window.replaceAssetData)

      if (props.prufClient && props.prufClient.get) {
          window.dispatchEvent(props.refresh)
          window.web3.eth.getBalance(props.addr, (error, result) => {
              if (error) {
                  console.log('error')
              } else {
                  setUpdatedEther(window.web3.utils.fromWei(result, 'ether'))
              }
          })

          // eslint-disable-next-line react/prop-types
          props.prufClient.get
              // eslint-disable-next-line react/prop-types
              .assetBalance(props.addr)
              .then(e => {
                  setUpdatedAssets(e)
              })

          // eslint-disable-next-line react/prop-types
          props.prufClient.get
              // eslint-disable-next-line react/prop-types
              .prufBalance(props.addr)
              .then(e => {
                  setUpdatedPruf(e)
              })

          
          forceUpdate()
      } else {
          window.web3.eth.getBalance(props.addr, (error, result) => {
              if (error) {
                  console.log('error')
              } else {
                  setUpdatedEther(window.web3.utils.fromWei(result, 'ether'))
              }
          })
      }

      // eslint-disable-next-line react/prop-types

  }

  const setUpEnvironment = (_addr) => {
    const Splitter_ADDRESS = "", Util_ADDRESS = "";
    const Splitter_ABI = "", Util_ABI = "";

    console.log("Getting things set up...");

    const SPLITTER = new _web3.eth.Contract(Splitter_ABI, Splitter_ADDRESS);
    const UTIL = new _web3.eth.Contract(Util_ABI, Util_ADDRESS);
    setSplitter(SPLITTER)
    setUtil(UTIL)
    
    //UTIL.methods.
  };

  //Count up user tokens, takes  "willSetup" bool to determine whether to call setupAssets() after count
  const getSnapShotInfo = (_addr) => {
    if (!_addr) return swal("Unable to reach user's wallet.");
    console.log("Getting snapshot info");
  };

  return (
    <div className={userClasses.wrapper}>
      <AdminNavbar
        sidebarMinimize={sidebarMinimize.bind(this)}
        miniActive={miniActive}
        brandText={getActiveRoute(routes)}
        {...rest}
      />{" "}
      <br />
      <br />
      <br />
      <br />
      <div className={mainPanelClasses} ref={mainPanel}>
        <div className="splitterForm">
          <br />
            <GridContainer>
                <GridItem xs={12} sm={6} md={6} lg={3}>
                    <Card>
                        <CardHeader stats icon>
                            <CardIcon
                                className="headerIconBack"
                                onClick={() =>
                                    window.open('https://ethereum.org/en/')
                                }
                            >
                                <img className="Icon" src={Eth} alt=""></img>
                            </CardIcon>
                            <p className={classes.cardCategory}>ETH Balance</p>
                            {updatedEther ? (
                                <h3 className={classes.cardTitle}>
                                    {updatedEther.substring(0, 7)}{' '}
                                </h3>
                            ) :
                                props.ether ? (
                                    <h3 className={classes.cardTitle}>
                                        {props.ether.substring(0, 7)}{' '}
                                    </h3>
                                ) : (
                                    <h3 className={classes.cardTitle}>
                                        ~
                                    </h3>
                                )}
                        </CardHeader>
                        <CardFooter stats>
                            {!isRefreshingEther && (
                                <div className="refresh">
                                    <Cached onClick={() => {window.replaceAssetData.refreshBals = true; refreshBalances()}} />
                                </div>
                            )}
                            {isRefreshingEther && (
                                <div className={classes.stats}>
                                    <div className="lds-ellipsisCard">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={6} lg={3}>
                    <Card>
                        <CardHeader color="danger" stats icon>
                            <CardIcon
                                className="headerIconBack"
                                onClick={() => window.open('https://pruf.io/')}
                            >
                                <img className="Icon" src={Pruf} alt=""></img>
                            </CardIcon>
                            <p className={classes.cardCategory}>PRUF Balance</p>
                            {updatedPruf ? (
                                <h3 className={classes.cardTitle}>
                                    <>
                                        {String(
                                            Math.round(
                                                Number(updatedPruf) * 100
                                            ) / 100
                                        )}{' '}
                                    </>
                                </h3>
                            ) : (
                                <h3 className={classes.cardTitle}>
                                    {props.pruf !== '~' ? (
                                        <>
                                            {String(
                                                Math.round(
                                                    
                                                    Number(props.pruf) * 100
                                                ) / 100
                                            )}{' '}
                                        </>
                                    ) : (
                                        <>
                                            {props.pruf} 
                                        </>
                                    )}
                                </h3>
                            )}
                        </CardHeader>
                        <CardFooter stats>
                            {!isRefreshingPruf && (
                                <div className="refresh">
                                    <Cached onClick={() => {window.replaceAssetData.refreshBals = true; refreshBalances()}} />
                                </div>
                            )}
                            {isRefreshingPruf && (
                                <div className={classes.stats}>
                                    <div className="lds-ellipsisCard">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon className="headerIconBack">
                <img className="IconFaucet" src={Pruf} alt=""></img>
              </CardIcon>
              <h5 className={classes.cardIconTitle}>Split Tokens</h5>
            </CardHeader>
            {/* eslint-disable-next-line react/prop-types */}
            {!addr && (
              <CardBody>
                <form>
                  <h3 className="bump">
                    <br />
                    Please{" "}
                    <a
                      onClick={() => {
                        if (window.ethereum) {
                          window.ethereum
                            .request({
                              method: "eth_accounts",
                              params: {},
                            })
                            .then(async (accounts) => {
                              console.log(
                                window.web3.utils.toChecksumAddress(accounts[0])
                              );
                              setAddr(
                                window.web3.utils.toChecksumAddress(accounts[0])
                              );
                            });
                        } else swal("No ethereum provider detected");
                      }}
                    >
                      connect
                    </a>{" "}
                    to an Ethereum provider.
                  </h3>
                </form>
              </CardBody>
            )}
            {/* eslint-disable-next-line react/prop-types */}
            {addr && (
              <CardBody>
                <form>
                  <h3>
                    <input
                      type="checkbox"
                      onChange={() => {
                        console.log(`setting useConnected to ${!useConnected}`);
                        setUseConnected(!useConnected);
                      }}
                    />{" "}
                    {` `}<span className="splitterCheckboxFont">Use connected wallet address</span>
                    <br />
                    {!useConnected ? (
                      <CustomInput
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          value: customAddress,
                          onChange: (e) => {
                            handleCustomAddress(e); // Set undefined to remove entirely
                          },
                          placeholder: `Tokenholder address`,
                        }}
                      />
                    ) : (
                      <></>
                    )}
                    {!transacting ? (
                      <Button color="info" className="MLBGradient" onClick={() => split()}>Split</Button>
                    ) : (
                      <>
                      Splitting tokens
                      <div className="lds-ellipsisIF">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                      <br/>
                      <br/>
                      <Button disabled onClick={() => split()}>
                        Split
                      </Button>
                      </>
                    )}
                  </h3>
                </form>
              </CardBody>
            )}
          </Card>
        </div>
      <Footer fluid />
      </div>
    </div>
  );
}
