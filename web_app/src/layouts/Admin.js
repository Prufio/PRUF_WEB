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
  const [ETHBalance, setETHBalance] = React.useState("~");
  const [addr, setAddr] = React.useState("");
  const [isAssetHolder, setIsAssetHolder] = React.useState(false);
  const [isAssetClassHolder, setIsAssetClassHolder] = React.useState(false);
  const [isIDHolder, setIsIDHolder] = React.useState(false);
  
  const [prufBalance, setPrufBalance] = React.useState("~");
  const [assetBalance, setAssetBalance] = React.useState("~");
  const [assetClassBalance, setAssetClassBalance] = React.useState("~");
  const [IDBalance, setIDBalance] = React.useState("0");
  const [hasFetchedBalances, setHasFetchedBalances] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [WD, setWD] = React.useState(false);
  const [hasSetUp, setHasSetUp] = React.useState(false);
  const [assets, setAssets] = React.useState({})

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
        window.addEventListener("accountListener", acctListener);
        console.log("SETTING STUFF UP...... POSSIBLY AGAIN")
        setUpContractEnvironment(_web3)
        setIsMounted(true)
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
  
        _ipfs = new IPFS({
          host: "ipfs.infura.io",
          port: 5001,
          protocol: "https",
        });
  
        window.ipfs = _ipfs;
  
        _web3.eth.getAccounts().then((e) => { this.setState({ addr: e[0] }); window.addr = e[0] });
  
        window.addEventListener("accountListener", acctListener);
        setUpContractEnvironment(_web3)
  
  
        setIsMounted(true)
      }
  
      //Give me the read-only version
      else {
        alert("we ended up in here")
        console.log("Here")
        window.ipfsCounter = 0;
        _web3 = require("web3");
        _web3 = new Web3("https://api.infura.io/v1/jsonrpc/kovan");
        setUpContractEnvironment(_web3)
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
      // window.removeEventListener("resize", resizeFunction);
      // window.removeEventListener("balances", balanceListener);
      // window.removeEventListener("assets", assetListener);
      // window.removeEventListener("network", networkListener);
      // window.removeEventListener("accountListener", acctListener);
      // window.removeEventListener("navigator", navTypeListener);
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
            render={()=>(<prop.component assetObj={assets} pruf={prufBalance} ether={ETHBalance} assets={assetBalance}/>)}
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

  const setUpContractEnvironment = async (_web3) => {
    if (window.isSettingUpContracts) { return (console.log("Already in the middle of setUp...")) }
    window.isSettingUpContracts = true;
    _web3.eth.net.getNetworkType().then((e) => { if (e === "kovan") { setIsKovan(true) } else { setIsKovan(false) } })
    console.log("Setting up contracts")
    if (window.ethereum !== undefined) {
      //window.addEventListener("balances", balanceListener);
      //window.addEventListener("assets", assetListener);
      //window.addEventListener("network", networkListener);
      window._contracts = await buildContracts(_web3)

      await window.utils.getContracts()

      if (window.addr !== undefined) {
        await window.utils.getETHBalance();
        await setUpTokenVals(true, "SetupContractEnvironment")
      }


      console.log("bools...", window.assetHolderBool, window.assetClassHolderBool, window.IDHolderBool)
      window.isSettingUpContracts = false;
      setWD(true)
    }

    else {
      window.isSettingUpContracts = true;
      window._contracts = await buildContracts(_web3)
      await window.utils.getContracts()
      window.isSettingUpContracts = false;
      setWD(true)
    }

    //window.addEventListener("navigator", navTypeListener);

  }

  const setUpAssets = async (who) => {
    console.log("SUA, called from ", who)

    window.hasNoAssets = false;
    window.hasNoAssetClasses = false;
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
      if (window.balances !== undefined) window.balances.assetBalance = 0;
      window.recount = false
      await window.utils.getETHBalance();
      return setUpTokenVals(true, "SUA recount")
    }

    //Do a full update if the balances are returning undefined at this stage (They should never do this)
    /* else if (Object.values(window.balances) === [0,0,0,0]) {
      console.log("balances undefined, trying to get them...");
      //if (window.addr === undefined) { return this.forceUpdate }
      return this.setUpTokenVals(true);
    } */

    console.log("SA: In setUpAssets")

    let tempDescObj = {}
    let tempDescriptionsArray = [];
    let tempNamesArray = [];

    //Get all asset token profiles for parsing

    await window.utils.getAssetTokenInfo()
    window.assetClasses = await window.utils.getAssetClassTokenInfo()

    if (window.aTknIDs === undefined) { return }

    for (let i = 0; i < window.aTknIDs.length; i++) {
      tempDescObj["desc" + i] = []
      await getIPFSJSONObject(window.ipfsHashArray[i], tempDescObj["desc" + i])
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

    setWD(true)

    console.log("IPFS operation count: ", window.ipfsCounter)
    console.log("Prebuild Assets: ", window.assets)
    console.log("Bools...", isAssetHolder, isAssetClassHolder, isIDHolder)
    console.log(window.ipfsCounter >= window.aTknIDs.length, window.aTknIDs.length > 0, WD)
    
  }

  const buildAssets = () => {
    console.log("BA: In buildAssets. IPFS operation count: ", window.ipfsCounter)
    window.ipfsCounter = 0;
    let tempDescArray = [];
    let emptyDesc = { photo: {}, text: {}, name: "" }

    //Get specifically name from the ipfs object of each asset (if it exists)
    let tempNameArray = [];
    let identicons = [], AC_Identicons = [];
    let identiconsLG = [], AC_IdenticonsLG = [];

    let tempDisplayArray = [];

    if (window.hasNoAssetClasses === false) {

      for (let e = 0; e < window.assetClasses.ids.length; e++) {
        AC_Identicons.push(<Jdenticon size="115" value={window.assetClasses.ids[e]} />)
      }

      for (let e = 0; e < window.assetClasses.ids.length; e++) {
        AC_IdenticonsLG.push(<Jdenticon size="230" value={window.assetClasses.ids[e]} />)
      }

      window.assetClasses.identicons = AC_Identicons;
      window.assetClasses.identiconsLG = AC_IdenticonsLG;
      window.hasLoadedAssetClasses = true;
    }

    if (window.hasNoAssets === false) {
      //Get objects from unparsed asset data for reference in the app 
      for (let i = 0; i < window.assets.ids.length; i++) {
        if (window.assets.descriptions[i][0] !== undefined) {
          tempDescArray.push(JSON.parse(window.assets.descriptions[i][0]))
        }
        else {
          tempDescArray.push(emptyDesc)
        }
      }

      for (let x = 0; x < window.assets.ids.length; x++) {
        if (tempDescArray[x].name === "" || tempDescArray[x].name === undefined) {
          tempNameArray.push("Not Available")
        }
        else {
          tempNameArray.push(tempDescArray[x].name)
        }

      }

      for (let e = 0; e < window.aTknIDs.length; e++) {
        identicons.push(<Jdenticon size="115" value={window.aTknIDs[e]} />)
      }

      for (let e = 0; e < window.aTknIDs.length; e++) {
        identiconsLG.push(<Jdenticon size="230" value={window.aTknIDs[e]} />)
      }

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

      window.assets.identiconsLG = identiconsLG;
      window.assets.identicons = identicons;
      window.assets.descriptions = tempDescArray;
      window.assets.names = tempNameArray;
      window.assets.displayImages = tempDisplayArray;
      window.hasLoadedAssets = true;
    }

    if(window.balances.prufTokenBalance !== prufBalance || window.balances.assetBalance !== assetBalance){
        setAssetBalance(window.balances.assetBalance);
        setAssetClassBalance(window.balances.assetClassBalance);
        setPrufBalance(window.balances.prufTokenBalance);
        setIDBalance(window.balances.IDTokenBalance);
        setIsAssetHolder(window.window.assetHolderBool);
        setIsAssetClassHolder(window.assetClassHolderBool);
        setIsIDHolder(window.IDHolderBool);
        setHasFetchedBalances(window.hasFetchedBalances);
    }
    setAssets(window.assets);
    console.log("BA: Assets after rebuild: ", window.assets)
    console.log("BA: AssetClasses after rebuild: ", window.assetClasses)
  }

  //Count up user tokens, takes  "willSetup" bool to determine whether to call setUpAssets() after count
  const setUpTokenVals = async (willSetup, who) => {
    console.log("STV: Setting up balances, called from ", who)

    await window.utils.determineTokenBalance().then((e)=>{ console.log(e); 
      setAssetBalance(e.assetBalance); 
      setAssetClassBalance(e.assetClassBalance);
      setPrufBalance(e.prufTokenBalance);
      setIDBalance(e.IDTokenBalance);
      setIsAssetHolder(window.assetHolderBool);
      setIsAssetClassHolder(window.assetClassHolderBool);
      setIsIDHolder(window.IDHolderBool);
      setHasFetchedBalances(window.hasFetchedBalances);
      setETHBalance(window.ETHBalance)
    })

    await console.log(window.balances)
    if (willSetup) {
      return setUpAssets("setUpTokenVals")
    }
    
  }

  const getIPFSJSONObject = (lookup, descElement) => {
    window.ipfs.cat(lookup, async (error, result) => {
      if (error) {
        console.log(lookup, "Something went wrong. Unable to find file on IPFS");
        descElement.push(undefined)
        window.ipfsCounter++
        console.log(window.ipfsCounter)
      } else {
        descElement.push(result)
        window.ipfsCounter++
        console.log(window.ipfsCounter)
      }
    });
  };

  const acctListener = async () => {
    const ethereum = window.ethereum;
    const self = this;
    var _web3 = require("web3");
    _web3 = new Web3(_web3.givenProvider);
    ethereum.on("accountsChanged", function (accounts) {
      _web3.eth.getAccounts().then((e) => {
        if (window.addr !== e[0]) {
          if (e[0] === undefined || e[0] === null) {
            console.log("Here")

            window.ETHBalance = "0";

            window.balances = ["0", "0", "0", "0"];
            setAssetClassBalance("0");
            setAssetBalance("0");
            setIDBalance("0")
            setIsAssetHolder(false);
            setIsAssetClassHolder(false);
            setIsIDHolder(false);
            setHasFetchedBalances(false);
            setETHBalance("0");
            setPrufBalance("0");

            window.addr = "";

          }

          if (window.location.href !== "/#/asset-dashboard") { window.location.href = "/#/admin/home" }

          window.addr = e[0];
          window.assetClass = undefined;
          window.isAuthUser = false;
          window.isACAdmin = false;
          setAddr(e[0])
          window.recount = true;
          window.resetInfo = true;
          console.log("///////in acctChanger////////");
        }
        else { console.log("Something bit in the acct listener, but no changes made.") }
      });
    });
  };

  const assetListener = setInterval(() => {

    //If reset was remotely requested, begin full asset recount
    if (window.resetInfo === true) {
      console.log("11")
      window.hasLoadedAssetClasses = false;
      window.hasLoadedAssets = false;
      setBuildReady(false)
      console.log("WD: setting up assets (Step one)")
      setUpAssets("AssetListener")
      window.resetInfo = false
    }

    //Catch updated assets case and rebuild asset inventory
    if (window.assets !== undefined) {
      if (window.assets.ids.length > 0 && window.assets.names.length === 0 &&
        buildReady === true && Object.values(window.assets.descriptions).length === window.aTknIDs.length && window.aTknIDs.length > 0) {
        if (window.ipfsCounter >= window.aTknIDs.length && window.resetInfo === false) {
          console.log("10")
          console.log("WD: rebuilding assets (Last Step)")
          buildAssets()
        }
      }
    }

    //In the case of a completed recount and rough asset build, make asset info usable for app
    if (window.aTknIDs !== undefined && buildReady === false) {
      if (window.ipfsCounter >= window.aTknIDs.length && window.aTknIDs.length > 0 && WD === true) {
        console.log("12")
        console.log("Assets are ready for rebuild")
        setBuildReady(true)
      }
    }

    //Assets finished rebuilding, flip rebuild switch
    else if (buildReady === true && window.ipfsCounter < window.aTknIDs.length && WD === false) {
      console.log("13")
      console.log("Assets finished rebuilding, no longer ready for rebuild")
      setBuildReady(false)
    }
  }, 500)

  /* const balanceListener = setInterval(() => {
    if (ETHBalance !== window.ETHBalance && WD === true) {
      console.log("5")
      return setETHBalance(window.ETHBalance);
    }
  }, 500) */

  const navTypeListener = setInterval(() => {
    //Catch late window.ethereum injection case (MetaMask mobile)
    if (isMobile && window.ethereum && WD === true) {
      window.web3.eth.getAccounts().then((e) => { setAddr(e[0]); window.addr = e[0]; });
      window.addEventListener("accountListener", this.acctChanger());
    }
  }, 500)

  const networkListener = setInterval(() => { 
    if(WD === true){
      window.web3.eth.net.getNetworkType().then((e) => { 
        if (e === "kovan" && !isKovan) { setIsKovan(true) } 
        else if (e !== "kovan") { setIsKovan(false) }  
      })
    }
  }, 500)

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
                <Redirect from="/admin" to="/admin/home" />
              </Switch>
            </div>
          </div>
        ) : (
            <div className={classes.map}>
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/admin" to="/admin/home" />
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
