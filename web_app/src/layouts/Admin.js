import React from "react";
import cx from "classnames";
import Jdenticon from 'react-jdenticon';
import Web3 from "web3";
import buildContracts from "./../Resources/Contracts";
import buildWindowUtils from "./../Resources/WindowUtils";
import { isMobile, browserName, engineVersion, getUA } from "react-device-detect";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.js";
import { SettingsPowerRounded } from "@material-ui/icons";

var ps;

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const IPFS = require("ipfs-mini")
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [miniActive, setMiniActive] = React.useState(false);
  const [image, setImage] = React.useState(require("assets/img/sidebar-2.jpg"));
  const [color, setColor] = React.useState("blue");
  const [bgColor, setBgColor] = React.useState("black");
  const [isKovan, setIsKovan] = React.useState(true);
  const [buildReady, setBuildReady] = React.useState(false);
  const [ETHBalance, setETHBalance] = React.useState("0");
  const [addr, setAddr] = React.useState("");
  const [isAssetHolder, setIsAssetHolder] = React.useState(false);
  const [isAssetClassHolder, setIsAssetClassHolder] = React.useState(false);
  const [isIDHolder, setIsIDHolder] = React.useState(false);
  
  const [prufBalance, setPrufBalance] = React.useState("0");
  const [assetBalance, setAssetBalance] = React.useState("0");
  const [assetClassBalance, setAssetClassBalance] = React.useState("0");
  const [IDBalance, setIDBalance] = React.useState("0");
  const [hasFetchedBalances, setHasFetchedBalances] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [WD, setWD] = React.useState(false);
  const [hasSetUp, setHasSetUp] = React.useState(false);

  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [logo, setLogo] = React.useState(require("assets/img/logo-white.svg"));
  // styles
  const classes = useStyles();
  const mainPanelClasses =
    classes.mainPanel +
    " " +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1
    });
  // ref for main panel div
  const mainPanel = React.createRef();
  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    if(!isMounted){
      window.balances = {}
      let timeOutCounter = 0;
      window.recount = false;
      let _web3, _ipfs;
  
      _ipfs = new IPFS({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
      });
  
      window.ipfs = _ipfs;
  
      _web3 = require("web3");
      _web3 = new Web3(_web3.givenProvider);
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
        //window.location.href = '/#/admin/home';
      } else {
        window.location.href = '/#/admin/search/' + refString.substring(refString.indexOf('0x'), refString.indexOf('0x') + 66)
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
  
        _web3.eth.getAccounts().then((e) => { setAddr(e[0]); window.addr = e[0] });
        // window.addEventListener("accountListener", acctListener);
        console.log("SETTING STUFF UP...... POSSIBLY AGAIN")
        // setUpContractEnvironment(_web3)
        setIsMounted(true)
      }
  
      //Give me the mobile ethereum-enabled version
      else if (isMobile && window.ethereum) {
  
        console.log(_web3.eth.net.getNetworkType())
  
        console.log("Here")
  
        // window.costs = {}
        // window.additionalElementArrays = {
        //   photo: [],
        //   text: [],
        //   name: ""
        // }
        // window.assetTokenInfo = {
        //   assetClass: undefined,
        //   idxHash: undefined,
        //   name: undefined,
        //   photos: undefined,
        //   text: undefined,
        //   status: undefined,
        // }
        // window.assets = { descriptions: [], ids: [], assetClassNames: [], assetClasses: [], countPairs: [], statuses: [], names: [], displayImages: [] };
        // // window.resetInfo = false;
  
        // _ipfs = IPFS({
        //   host: "ipfs.infura.io",
        //   port: 5001,
        //   protocol: "https",
        // });
  
        // window.ipfs = _ipfs;
  
        // _web3.eth.getAccounts().then((e) => { this.setState({ addr: e[0] }); window.addr = e[0] });
  
        // window.addEventListener("accountListener", acctListener);
        // setUpContractEnvironment(_web3)
  
  
        setIsMounted(true)
      }
  
      //Give me the read-only version
      else {
        console.log("Here")
        window.ipfsCounter = 0;
        _web3 = require("web3");
        _web3 = new Web3("https://api.infura.io/v1/jsonrpc/kovan");
        // setUpContractEnvironment(_web3)
        window.web3 = _web3;
  
        _ipfs = new IPFS({
          host: "ipfs.infura.io",
          port: 5001,
          protocol: "https",
        });
  
        window.ipfs = _ipfs;
  
        setIsMounted(true)
      }
    }

    
    window.addEventListener("resize", resizeFunction);

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
      //window.removeEventListener("balances", balanceListener);
      //window.removeEventListener("assets", assetListener);
      //window.removeEventListener("network", networkListener);
      //window.removeEventListener("accountListener", acctListener);
      //window.removeEventListener("navigator", navTypeListener);
    };
  });
  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  });
  // functions for changeing the states from components
  const handleImageClick = image => {
    setImage(image);
  };
  const handleColorClick = color => {
    setColor(color);
  };
  const handleBgColorClick = bgColor => {
    switch (bgColor) {
      case "white":
        setLogo(require("assets/img/logo.svg"));
        break;
      default:
        setLogo(require("assets/img/logo-white.svg"));
        break;
    }
    setBgColor(bgColor);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };
  const getActiveRoute = routes => {
    let activeRoute = "Default Brand Text";
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
  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"Creative Tim"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        bgColor={bgColor}
        miniActive={miniActive}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(routes)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/admin" to="/admin/dashboard" />
              </Switch>
            </div>
          </div>
        ) : (
          <div className={classes.map}>
            <Switch>
              {getRoutes(routes)}
              <Redirect from="/admin" to="/admin/dashboard" />
            </Switch>
          </div>
        )}
        {getRoute() ? <Footer fluid /> : null}
        <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          handleBgColorClick={handleBgColorClick}
          color={color}
          bgColor={bgColor}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
        />
      </div>
    </div>
  );
}
