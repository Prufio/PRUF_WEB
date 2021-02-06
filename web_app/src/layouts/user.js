import React from "react";
import cx from "classnames";
import Jdenticon from 'react-jdenticon';
import Web3 from "web3";
import buildContracts from "../Resources/Contracts";
import buildWindowUtils from "../Resources/WindowUtils";
import { Switch, Route, Redirect } from "react-router-dom";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import AdminNavbar from "components/Navbars/userNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-pro-react/layouts/userStyle.js";

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
  const [bgColor, setBgColor] = React.useState("darkBlue");
  const [isKovan, setIsKovan] = React.useState(true);
  const [buildReady, setBuildReady] = React.useState(false);
  const [ETHBalance, setETHBalance] = React.useState("~");
  const [addr, setAddr] = React.useState("");
  const [isAssetHolder, setIsAssetHolder] = React.useState(false);
  const [isAssetClassHolder, setIsAssetClassHolder] = React.useState(false);
  const [isIDHolder, setIsIDHolder] = React.useState(false);
  const [sidebarRoutes, setSideBarRoutes] = React.useState([routes[0], routes[2], routes[1], routes[3]]);
  const [sps, setSps] = React.useState(undefined)

  const [prufBalance, setPrufBalance] = React.useState("~");
  const [currentACIndex, setCurrentACIndex] = React.useState("~");
  const [currentACPrice, setCurrentACPrice] = React.useState("~");
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

  //console.log("pre-load log", window.location.href)

  const handleNoEthereum = () => {
    console.log("No ethereum object available");
    let web3;
    web3 = require("web3");
    web3 = new Web3("https://api.infura.io/v1/jsonrpc/kovan");
    setUpContractEnvironment(web3).then(() => {
      let refString = String(window.location.href);
      /*       if (!refString.includes("0x") || refString.substring(refString.indexOf('0x'), refString.length).length < 66) {
              return
            } else {
              window.location.href = '/#/user/search/' + refString.substring(refString.indexOf('0x'), refString.length);
            } */
    });
    window.web3 = web3;
    return setIsMounted(true);
  }

  const handleEthereum = () => {
    if (window.ethereum) {
      //console.log("Found ethereum object");
      let web3;

      web3 = require("web3");
      const ethereum = window.ethereum;
      //console.log("Here");

      web3 = new Web3(web3.givenProvider);
      window.web3 = web3;
      window.costs = {};
      window.additionalElementArrays = {
        photo: [],
        text: [],
        name: ""
      };

      web3.eth.net.getNetworkType().then((e) => {
        if (e === "kovan") {
          window.isKovan = true;
          ethereum.request({
            method: 'eth_accounts',
            params: {},
          }).then((accounts) => {
            if (accounts[0] !== undefined) {
              setAddr(window.web3.utils.toChecksumAddress(accounts[0]));
              setUpContractEnvironment(web3, window.web3.utils.toChecksumAddress(accounts[0]));
            }
            else {
              ethereum.send('eth_requestAccounts').then((accounts) => {
                if (accounts[0] !== undefined) {
                  setAddr(window.web3.utils.toChecksumAddress(accounts[0]));
                  setUpContractEnvironment(web3, window.web3.utils.toChecksumAddress(accounts[0]));
                }
              });
            }
          });
          return setIsKovan(true);
        }
        else { window.isKovan = false; return setIsKovan(false); }
      })

      //More globals (eth-is-connected specific)
      window.assetTokenInfo = {
        assetClass: undefined,
        idxHash: undefined,
        name: undefined,
        photos: undefined,
        text: undefined,
        status: undefined,
      };

      window.assets = { descriptions: [], ids: [], assetClassNames: [], assetClasses: [], countPairs: [], statuses: [], names: [], displayImages: [] };
      window.resetInfo = false;

      return setIsMounted(true);
    }
    else {
      return handleNoEthereum();
    }
  }

  const chainListener = () => {
    window.ethereum.on('chainChanged', (chainId) => {
      console.log(chainId);
      window.location.reload();
    });
  }

  const connectListener = () => {
    window.ethereum.on('connect', () => {
      window.location.reload();
    });
  }

  const acctListener = () => {
    window.ethereum.on("accountsChanged", (e) => {
      //console.log("new: ",e[0] ?? "No new address fetched", "old: ", addr ?? "No address currently stored")
      console.log("Accounts changed");
      if (e[0] === undefined || e[0] === null) {
        console.log("Here");
        window.ETHBalance = "0";
        window.ipfsCounter = 0;
        window.balances = ["0", "0", "0", "0"];
        setAssetClassBalance("~");
        setAssetBalance("~");
        setIDBalance("0");
        setIsAssetHolder(false);
        setIsAssetClassHolder(false);
        setIsIDHolder(false);
        setHasFetchedBalances(false);
        setETHBalance("~");
        setPrufBalance("~");
        setAssets({});
        setAddr("");
      }

      window.assetClass = undefined;
      window.isAuthUser = false;
      window.isACAdmin = false;
      window.ipfsCounter = 0;
      setAddr(window.web3.utils.toChecksumAddress(e[0]))
      setAssets({});
      setAssetClassBalance("~");
      setAssetBalance("~");
      setIDBalance("0");
      setIsAssetHolder(false);
      setIsAssetClassHolder(false);
      setIsIDHolder(false);
      setHasFetchedBalances(false);
      setETHBalance("~");
      setPrufBalance("~");
      window.recount = true;
      window.resetInfo = true;
    });
  }

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

  window.onload = () => {
    console.log("page loaded", window.location.href)
    window.balances = {};
    let timeOutCounter = 0;
    window.recount = false;
    let _ipfs;

    _ipfs = new IPFS({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });

    let hrefStr = String(window.location.href.substring(window.location.href.indexOf('/#/'), window.location.href.length))
    console.log(hrefStr.includes("0x") && hrefStr.substring(hrefStr.indexOf('0x'), hrefStr.length).length === 66)
    if (hrefStr.includes("0x") && hrefStr.substring(hrefStr.indexOf('0x'), hrefStr.length).length === 66) {
      if(!window.location.href.includes("/#/user/search")){
        window.idxQuery = hrefStr.substring(hrefStr.indexOf('0x'), hrefStr.indexOf('0x') + 66)
        console.log("query detected for idx: ", hrefStr.substring(hrefStr.indexOf('0x'), hrefStr.indexOf('0x') + 66));
        window.location.href = String("/#/user/search/" + hrefStr.substring(hrefStr.indexOf('0x'), hrefStr.length))
      }
    }

    else if (hrefStr !== "/#/user/dashboard" && hrefStr !== "/#/user/home" && hrefStr !== "/#/user/search") {
      console.log("Rerouting...")
      window.location.href = "/#/user/home";
    }

    window.ipfs = _ipfs;

    buildWindowUtils(); // get the utils object and make it globally accessible

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

    window.menuChange = undefined;

    window.ipfsCounter = 0;

    _ipfs = new IPFS({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    });

    window.ipfs = _ipfs;
    //Give me the desktop version
    if (window.ethereum) {
      handleEthereum()
    }

    else {
      console.log("In startup else clause")
      window.addEventListener('ethereum#initialized', handleEthereum, {
        once: true,
      });
      setTimeout(handleEthereum, 3300); // 3.3 seconds
    }


  }

  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount

  React.useEffect(() => {

    if (window.ethereum) {
      window.addEventListener("chainListener", chainListener())
      window.addEventListener("accountListener", acctListener())
      //window.addEventListener("connectListener", connectListener())
    }

    if (navigator.platform.indexOf("Win") > -1) {
      console.log("*****Using ps*****");
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
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
    return !window.location.pathname.includes("/user/");
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
      if (prop.layout === "/user") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={() => (<prop.component ps={sps} addr={addr} assetObj={assets} pruf={prufBalance} ether={ETHBalance} assets={assetBalance} currentACPrice={currentACPrice} IDHolder={isIDHolder} />)}
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

  const setUpContractEnvironment = async (_web3, _addr) => {
    if (window.isKovan === false) { return }
    //console.log("IN SUCE, addr:", _addr)
    if (window.isSettingUpContracts) { return (console.log("Already in the middle of setUp...")) }
    window.isSettingUpContracts = true;
    _web3.eth.net.getNetworkType().then((e) => { if (e === "kovan") { setIsKovan(true) } else { setIsKovan(false) } })
    //console.log("Setting up contracts")
    if (window.ethereum) {
      window._contracts = await buildContracts(_web3)

      await window.utils.getContracts().then(() => {
        if (window.idxQuery) { window.location.href = '/#/user/search/' + window.idxQuery }
      })

      if (_addr) {
        await window.utils.getETHBalance(_addr);
        await setUpTokenVals(true, "SetupContractEnvironment", _addr)
      }


      //console.log("bools...", window.assetHolderBool, window.assetClassHolderBool, window.IDHolderBool)
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

  const setUpAssets = async (who, _addr) => {
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
      await window.utils.getETHBalance(_addr);
      return setUpTokenVals(true, "SUA recount", _addr)
    }

    console.log("SA: In setUpAssets")

    let tempDescObj = {}
    let tempDescriptionsArray = [];
    let tempNamesArray = [];

    //Get all asset token profiles for parsing

    await window.utils.getAssetTokenInfo(_addr)
    window.assetClasses = await window.utils.getAssetClassTokenInfo(_addr)

    if (window.aTknIDs === undefined) { return }

    for (let i = 0; i < window.aTknIDs.length; i++) {
      tempDescObj["desc" + i] = []
      await getIPFSJSONObject(window.ipfsHashArray[i], tempDescObj["desc" + i])
    }

    //console.log("Temp description obj: ", tempDescObj)

    for (let x = 0; x < window.aTknIDs.length; x++) {
      let tempArray = tempDescObj["desc" + x]
      await tempDescriptionsArray.push(tempArray)
    }

    window.assets.descriptions = tempDescriptionsArray;
    window.assets.names = tempNamesArray;
    window.assets.ids = window.aTknIDs;

    console.log("Asset setUp Complete. Turning on watchDog.")

    setWD(true)

    //console.log("IPFS operation count: ", window.ipfsCounter)
    //console.log("Prebuild Assets: ", window.assets)
    //console.log("Bools...", isAssetHolder, isAssetClassHolder, isIDHolder)
    //console.log(window.ipfsCounter >= window.aTknIDs.length, window.aTknIDs.length > 0, WD)

  }

  const buildAssets = async () => {
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
        AC_Identicons.push(<Jdenticon value={window.assetClasses.ids[e]} />)
      }

      for (let e = 0; e < window.assetClasses.ids.length; e++) {
        AC_IdenticonsLG.push(<Jdenticon value={window.assetClasses.ids[e]} />)
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
        identicons.push(<Jdenticon value={window.aTknIDs[e]} />)
      }

      for (let e = 0; e < window.aTknIDs.length; e++) {
        identiconsLG.push(<Jdenticon value={window.aTknIDs[e]} />)
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

    if (window.balances.prufTokenBalance !== prufBalance || window.balances.assetBalance !== assetBalance) {
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
  const setUpTokenVals = async (willSetup, who, _addr) => {
    console.log("STV: Setting up balances, called from ", who)
    await window.utils.determineTokenBalance(_addr).then((e) => {
      if (e === undefined) return console.log("Account Locked")
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


    let temp;
    let temp2;
    if(window.contracts){
      await window.contracts.AC_MGR.methods.currentACpricingInfo().call(
        function (_error, _result) {
          if (_error) {
            return (console.log("IN ERROR IN ERROR IN ERROR"))
          }
          else {
            temp = window.web3.utils.fromWei(Object.values(_result)[0])
            return temp2 = window.web3.utils.fromWei(Object.values(_result)[1])
          }
  
        }
      );
    }

    if (temp !== undefined) {
      setCurrentACIndex(temp)
      setCurrentACPrice(temp2)
    }

    await console.log(window.balances);

    if (willSetup) {
      return setUpAssets("setUpTokenVals", _addr)
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
        //console.log(window.ipfsCounter)
      }
    });
  };

  const assetListener = setInterval(() => {

    //If reset was remotely requested, begin full asset recount
    if (window.resetInfo === true) {
      console.log("11");
      window.ipfsCounter = 0;
      window.hasLoadedAssetClasses = false;
      window.hasLoadedAssets = false;
      setAssets({});
      setAssetBalance("~");
      setIsAssetHolder(false);
      setHasFetchedBalances(false);
      setETHBalance("~");
      setPrufBalance("~");
      setBuildReady(false);
      console.log("WD: setting up assets (Step one)")
      window.ethereum.request({
        method: 'eth_accounts',
        params: {},
      }).then((accounts) => {
        if (accounts[0] !== undefined) {
          console.log("got accounts");
          setUpAssets("AssetListener", accounts[0]);
        }
      })
      window.resetInfo = false;
    }

    //Catch updated assets case and rebuild asset inventory
    if (window.assets !== undefined) {
      if (window.assets.ids.length > 0 && window.assets.names.length === 0 &&
        buildReady === true && Object.values(window.assets.descriptions).length === window.aTknIDs.length && window.aTknIDs.length > 0) {
        if (window.ipfsCounter >= window.aTknIDs.length && window.resetInfo === false) {
          //console.log("10")
          console.log("WD: rebuilding assets (Last Step)")
          buildAssets()
        }
      }
    }

    //In the case of a completed recount and rough asset build, make asset info usable for app
    if (window.aTknIDs !== undefined && buildReady === false) {
      if (window.ipfsCounter >= window.aTknIDs.length && window.aTknIDs.length > 0 && WD === true) {
        //console.log("12")
        console.log("Assets are ready for rebuild")
        setBuildReady(true)
      }
    }

    //Assets finished rebuilding, flip rebuild switch
    else if (buildReady === true && window.ipfsCounter < window.aTknIDs.length && WD === false) {
      //console.log("13")
      console.log("Assets finished rebuilding, no longer ready for rebuild")
      setBuildReady(false)
    }
  }, 1500)

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={sidebarRoutes}
        addr={addr}
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
                <Redirect from="/user" to="/user/home" />
              </Switch>
            </div>
          </div>
        ) : (
            <div className={classes.map}>
              <Switch>
                {getRoutes(routes)}
                <Redirect from="/user" to="/user/home" />
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
