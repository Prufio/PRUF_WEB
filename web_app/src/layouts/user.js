//PRUF WEB APP
import React from "react";
import cx from "classnames";
import Jdenticon from "react-jdenticon";
import swal from "sweetalert";
import Web3 from "web3";
import Arweave from "arweave";
import TestWeave from "testweave-sdk";
//import arconf from "../Resources/arconf";
import placeholder from "../assets/img/placeholder.jpg";

import PRUF from "pruf-js";
import { isMobile } from "react-device-detect";
import buildWindowUtils from "../Resources/WindowUtils";
import { Switch, Route, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

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
import defaultBGImage from "../assets/img/Sidebar Backgrounds/TracesWB.jpg";

window.populatedListeners = false;

var ps;

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions

  const IPFS = require("ipfs-http-client"); //require("ipfs-mini")

  //const OrbitDB = require('orbit-db')

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [miniActive, setMiniActive] = React.useState(true);
  const [image, setImage] = React.useState(defaultBGImage);
  const [color, setColor] = React.useState("blue");
  const [bgColor, setBgColor] = React.useState("darkBlue");
  const [isKovan, setIsKovan] = React.useState(true);
  const [ETHBalance, setETHBalance] = React.useState("~");
  const [addr, setAddr] = React.useState("");
  const [isAssetHolder, setIsAssetHolder] = React.useState(false);
  const [isAssetClassHolder, setIsAssetClassHolder] = React.useState(false);
  const [simpleAssetView, setSimpleAssetView] = React.useState(false);
  const [hasBeenNotified, setHasBeenNotified] = React.useState(false);
  // const [isIDHolder, setIsIDHolder] = React.useState();
  const [sidebarRoutes, setSidebarRoutes] = React.useState([
    routes[0],
    routes[1],
    routes[2],
    routes[3],
    routes[4],
  ]);
  const [sps, setSps] = React.useState(undefined);
  const [assetIds, setAssetIds] = React.useState([]);
  const [assetsPerPage, setAssetsPerPage] = React.useState(8);
  const [listenersLaunched, setListenersLaunched] = React.useState(false);
  const [prufBalance, setPrufBalance] = React.useState("~");
  const [prufClient, setPrufClient] = React.useState();
  const [roots, setRoots] = React.useState(undefined);
  const [rootNames, setRootNames] = React.useState(undefined);
  const [nodeSets, setNodeSets] = React.useState(undefined);
  const [currentACIndex, setCurrentACIndex] = React.useState("~");
  const [replaceAssetData, setReplaceAssetData] = React.useState(0);
  const [currentACPrice, setCurrentACPrice] = React.useState("~");
  const [assetBalance, setAssetBalance] = React.useState("~");
  const [nodeIdBalance, setNodeBalance] = React.useState("~");
  const [heldNodeData, setHeldNodeData] = React.useState([
    ["Loading Nodes...", "~", "~", "~"],
  ]);
  const [nodeExtData, setNodeExtData] = React.useState();
  // const [IDBalance, setIDBalance] = React.useState("0");
  const [cookies, setCookie, removeCookie] = useCookies(["nodeList"]);
  const [hasFetchedBalances, setHasFetchedBalances] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [WD, setWD] = React.useState(false);
  const [assets, setAssets] = React.useState({});
  const [nodeList, setNodeList] = React.useState(null);
  const [reserveAD, setReserveAD] = React.useState({});
  const [assetArr, setAssetArr] = React.useState([]);
  const [winKey, setWinKey] = React.useState(
    String(Math.round(Math.random() * 100000))
  );
  const [arweaveClient, setArweaveClient] = React.useState();
  const [ARWallet, setARWallet] = React.useState("");
  /* const [testWeave, setTestWeave] = React.useState(); */
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [logo, setLogo] = React.useState(require("assets/img/logo-white.svg"));
  // styles
  const classes = useStyles();
  const refreshEvent = new Event("refresh");
  const connectArweaveEvent = new Event("connectArweave");

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

  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  React.useEffect(() => {
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

    if (cookies) checkForCookies();

    window.addEventListener("refresh", () =>
      setReplaceAssetData(replaceAssetData + 1)
    );
    window.addEventListener("connectArweave", () => {
      if (!window.arweaveWallet) {
        return swal(
          "We looked, but couldn't find an arweave web wallet. You may upload a keyfile from storage using the button below, or click cancel to go back."
        );
      }

      swal(
        "You have selected a node which uses Arweave for storage. Please sign in to your arweave wallet."
      ).then(() => {
        window.arweaveWallet.connect([
          `ACCESS_ADDRESS`,
          `SIGN_TRANSACTION`,
          `ENCRYPT`,
          `DECRYPT`,
        ]);
      });
    });

    if (!isMobile)
      setSidebarRoutes([routes[0], routes[2], routes[1], routes[3], routes[4]]);
    window.addEventListener("resize", resizeFunction);

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  }, []);

  React.useEffect(()=>{
    console.log({assetBalance: assetBalance, assetsLen: Object.keys(assets).length})
    if(assetBalance !== "~" && assetBalance > Object.keys(assets).length) {
      getAssetAtIndex(Object.keys(assets).length)
    } else if (assetBalance !== "~" && assetBalance < Object.keys(assets).length) {
      setAssetBalance(Object.keys(assets).length)
    }
  }, [assets])

  React.useEffect(() => {
    setWinKey(String(Math.round(Math.random() * 100000)));
    if (isMounted) {
      if (
        !window.replaceAssetData ||
        Object.values(window.replaceAssetData).length === 0
      ) {
      }
      if (window.replaceAssetData.assetsPerPage) {
        setAssetsPerPage(window.replaceAssetData.assetsPerPage);
        setCookieTo(`assetsPerPage`, window.replaceAssetData.assetsPerPage);
      }
      if (window.replaceAssetData.refreshBals === true) {
        console.log("Resetting token value");
        setupTokenVals(arweaveClient, addr, prufClient, { justCount: true });
        buildRoots(addr, prufClient);
        forceUpdate();
      }
      if (window.replaceAssetData.refreshAssets) {
        setupTokenVals(arweaveClient, addr, prufClient, { justAssets: true });
      }
      if (window.replaceAssetData.key !== thousandHashesOf(addr, winKey)) {
        console.log("Invalid key passed. Aborted call to replace.");
      }
      if (window.replaceAssetData.nodeList) {
        console.log("Resetting node data...");
        let newData = JSON.parse(
          JSON.stringify(window.replaceAssetData.nodeList)
        );

        if (newData.extData) {
          setNodeExtData(newData.extData);
        }

        if (newData.data) {
          setHeldNodeData(newData.data);
        }

        if (newData.setAddition) {
          let tempSets = JSON.parse(JSON.stringify(nodeSets));
          tempSets[newData.setAddition.root].push({
            id: newData.setAddition.id,
            name: newData.setAddition.name,
          });
          setNodeSets(tempSets);
        }
        setupTokenVals(arweaveClient, addr, prufClient, { justNodes: true });
      }

      if (window.replaceAssetData.getAsset) {
        console.log("Fetching new asset")
        let id
        if(window.replaceAssetData.getAsset.id){
          id = window.replaceAssetData.getAsset.id

          prufClient.get.asset.ownerOf(id).then(owner=>{
            if(owner.toLowerCase() === addr.toLowerCase()) getAsset(id)
          })
        }
        
        window.replaceAssetData = {}
      }

      if (window.replaceAssetData.assetAction) {
        console.log(`about to ${action} asset`)

        let action = window.replaceAssetData.assetAction
        let newAsset = window.replaceAssetData.newAsset;
        let tempObj = JSON.parse(JSON.stringify(assets));

        setupTokenVals(arweaveClient, addr, prufClient, { justAssets: true });

        if (action = "mod") {
          newAsset.identicon = <Jdenticon vlaue={newAsset.id} />;
          console.log("Old Assets", assets);
          tempObj[newAsset.id] = newAsset
          console.log("New Assets", tempObj);
          setAssets(tempObj);
          getAssetAtIndex(0);
        } else if (action = "rem") {
          console.log("Old Assets", assets);
          tempObj[newAsset.id]
          console.log("New Assets", tempObj);
          setAssetArr(tempArr);
          getAssetAtIndex(0);
        }
        window.replaceAssetData = {};
        forceUpdate();
      }
    }
  }, [replaceAssetData]);

  //console.log("pre-load href", window.location.href)
  const initArweave = async () => {
    const _arweave = Arweave;
    const arweave = _arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
    });

    setArweaveClient(arweave);

    console.log(arweave);

    if (window.arweaveWallet) {
      window.arweaveWallet.connect([
        `ACCESS_ADDRESS`,
        `SIGN_TRANSACTION`,
        `ENCRYPT`,
        `DECRYPT`,
      ]);
      window.arweaveWallet.getActiveAddress().then((e) => console.log(e));
    }

    window.arweaveClient = arweave;

    return arweave;
  };

  const handleNoEthereum = () => {
    //if(isMobile) swal("No ethereum detected")
    console.log("No ethereum object available");
    let web3;
    web3 = require("web3");
    web3 = new Web3(
      "https://kovan.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959"
    );

    web3.eth.net.getId().then(async (chainId) => {
      const _prufClient = new PRUF(web3, chainId, false, true);
      await _prufClient.init();

      console.log(_prufClient);
      setPrufClient(_prufClient);
      setUpEnvironment(_prufClient);
      awaitPrufInitNoAddress(_prufClient);
      // setIsIDHolder(false);

      window.prufClient = _prufClient;
      window.web3 = web3;
      return setIsMounted(true);
    });
  };

  const checkForCookies = () => {
    if (!cookies.hasBeenNotified && !hasBeenNotified) {
      swal({
        title: "Cookies on pruf.io",
        text: "This site uses minimal cookies to offer you optimal performance and loading times. By using this application you agree to their use.",
        icon: "warning",
        buttons: {
          moreInfo: {
            text: "Learn more",
            value: "moreInfo",
            className: "moreCookieInfo",
          },

          accept: {
            text: "Accept and continue",
            value: "accept",
            className: "acceptCookies",
          },
        },
      }).then((value) => {
        switch (value) {
          case "accept":
            setCookieTo("hasBeenNotified", true);
            setHasBeenNotified(true);
            break;

          case "moreInfo":
            swal({
              title: "Cookies on app.pruf.io",
              text: "Cookies are small packets of user data that are created and stored in the browser. We use cookes to provide a seamless and fast dApp experience while maintaining user privacy. We do not store or share your data with anyone.",
              buttons: {
                accept: {
                  text: "Accept and continue",
                  value: "accept",
                  className: "acceptCookies",
                },
              },
            }).then((value) => {
              switch (value) {
                case "accept":
                  setCookieTo("hasBeenNotified", true);
                  setHasBeenNotified(true);
                  break;

                default:
                  break;
              }
            });
            break;

          default:
            break;
        }
      });
    }
    //console.log("Cookies:", cookies);
  };

  const setCookieTo = (job, val) => {
    if (cookies["hasBeenNotified"] === false) return;
    //if(!cookies[job]) return console.log("Referenced nonexistant cookie")
    console.log("Setting cookie", job, "to", val);
    setCookie(String(job), JSON.stringify(val), {
      path: "/",
      expires: new Date().addDays(10),
    });
  };

  const readCookie = async (job) => {
    if (cookies["hasBeenNotified"] === false) return;
    if (!cookies[job]) return console.log("Referenced nonexistant cookie");
    return cookies[job];
  };

  const handleEthereum = () => {
    if (window.ethereum) {
      let web3;
      web3 = require("web3");
      const ethereum = window.ethereum;
      web3 = new Web3(web3.givenProvider);
      window.web3 = web3;
      web3.eth.net.getId().then(async (chainId) => {
        window.ethereum.on("chainChanged", (chainId) => {
          console.log(chainId);
          window.location.reload();
        });

        const _prufClient = new PRUF(web3, chainId, false, true);
        await _prufClient.init();

        window.ethereum.on("accountsChanged", (e) => {
          console.log("Accounts changed");
          if (e[0] === undefined || e[0] === null) {
            if (e[0] !== addr) {
              window.location.reload();
            }
          } else if (e[0].toLowerCase() !== addr.toLowerCase()) {
            setAddr(web3.utils.toChecksumAddress(e[0]));
            if (_prufClient.get) {
              setUpEnvironment(_prufClient, e[0]);
            } else {
              window.location.reload();
            }
          }
        });

        console.log(_prufClient);
        setPrufClient(_prufClient);
        // setIsIDHolder(false);

        if (_prufClient.network.name === "kovan") {
          window.isKovan = true;
          ethereum
            .request({
              method: "eth_accounts",
              params: {},
            })
            .then(async (accounts) => {
              console.log({ accounts: accounts });
              if (accounts[0] !== undefined) {
                console.log("SETTING ADDRESS");
                let _addr = await window.web3.utils.toChecksumAddress(
                  accounts[0]
                );
                setAddr(_addr);
                if (cookies[`${_addr}sideBarLogo`]) {
                  setLogo(cookies[`${_addr}sideBarLogo`]);
                }
                if (cookies[`${_addr}sideBarColor`]) {
                  setColor(cookies[`${_addr}sideBarColor`]);
                }
                if (cookies[`${_addr}sideBarBackground`]) {
                  setBgColor(cookies[`${_addr}sideBarBackground`]);
                }
                if (cookies[`${_addr}sideBarImage`]) {
                  setImage(cookies[`${_addr}sideBarImage`]);
                }
                if (window.idxQuery) {
                  window.location.href = "/#/user/search";
                  return forceUpdate();
                }
                setUpEnvironment(_prufClient, _addr);
                setIsMounted(true);
              } else {
                ethereum
                  .request({
                    method: "eth_requestAccounts",
                    params: {},
                  })
                  .then(async (accounts) => {
                    console.log({ accounts: accounts });
                    if (accounts[0] !== undefined) {
                      console.log("SETTING ADDRESS");
                      let _addr = await window.web3.utils.toChecksumAddress(
                        accounts[0]
                      );
                      setAddr(_addr);
                      if (cookies[`${_addr}sideBarLogo`]) {
                        setLogo(cookies[`${_addr}sideBarLogo`]);
                      }
                      if (cookies[`${_addr}sideBarColor`]) {
                        setColor(cookies[`${_addr}sideBarColor`]);
                      }
                      if (cookies[`${_addr}sideBarBackground`]) {
                        setBgColor(cookies[`${_addr}sideBarBackground`]);
                      }
                      if (cookies[`${_addr}sideBarImage`]) {
                        setImage(cookies[`${_addr}sideBarImage`]);
                      }
                      window.addr = _addr;
                      setUpEnvironment(_prufClient, _addr);
                      setIsMounted(true);
                    }
                  });
              }
            });

          setIsKovan(true);
          return setIsMounted(true);
        } else {
          window.isKovan = false;
          setIsKovan(false);
          return swal({
            title: "Connect to the Kovan Testnet!",
            text: "Please connect your ethereum provider to the Kovan Testnet and reload the page to access page functionality.",
            icon: "warning",
            button: "Okay",
          });
        }
      });
    } else {
      return handleNoEthereum();
    }
  };

  // if (window.ethereum && !window.populatedListeners) {
  //   window.addEventListener("chainListener", chainListener, { once: true });
  //   window.addEventListener("accountListener", acctListener, { once: true });
  //   window.addEventListener("refresh", refreshHandler);
  //   window.addEventListener("connectArweave", connectArweave);
  //   window.populatedListeners = true;
  // }

  window.onload = () => {
    window.balances = {};
    window.replaceAssetData = {};
    window.recount = false;
    let _ipfs;

    if (cookies[`assetsPerPage`]) {
      setAssetsPerPage(cookies[`assetsPerPage`]);
    }

    _ipfs = new IPFS(new URL("https://ipfs.infura.io:5001"));

    let hrefStr = String(
      window.location.href.substring(
        window.location.href.indexOf("/#/"),
        window.location.href.length
      )
    );
    //console.log(hrefStr.includes("0x") && hrefStr.substring(hrefStr.indexOf('0x'), hrefStr.length).length === 66)
    if (
      hrefStr.includes("0x") &&
      hrefStr.substring(hrefStr.indexOf("0x"), hrefStr.length).length === 66
    ) {
      if (!window.location.href.includes("/#/user/search")) {
        window.idxQuery = hrefStr.substring(
          hrefStr.indexOf("0x"),
          hrefStr.indexOf("0x") + 66
        );
        console.log(
          "query detected for idx: ",
          hrefStr.substring(hrefStr.indexOf("0x"), hrefStr.indexOf("0x") + 66)
        );
        window.location.href = String(
          "/#/user/search/" +
            hrefStr.substring(hrefStr.indexOf("0x"), hrefStr.length)
        );
      }
    } else if (
      hrefStr !== "/#/user/dashboard" &&
      hrefStr !== "/#/user/home" &&
      hrefStr !== "/#/user/search" &&
      hrefStr !== "/#/user/node-manager" &&
      hrefStr !== "/#/user/new-asset"
    ) {
      console.log("Rerouting...");
      window.location.href = "/#/user/home";
    }

    window.ipfs = _ipfs;

    buildWindowUtils(); // get the utils object and make it globally accessible

    window.jdenticon_config = {
      hues: [196],
      lightness: {
        color: [0.36, 0.7],
        grayscale: [0.24, 0.82],
      },
      saturation: {
        color: 0.75,
        grayscale: 0.1,
      },
      backColor: "#ffffffff",
    };

    //Declare a few globals
    window.sentPacket = {};

    //Give me the desktop version
    if (window.ethereum) {
      handleEthereum();
    } else {
      console.log("In startup else clause");

      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true,
      });

      setTimeout(handleEthereum, 2000); // 2 seconds
    }
  };

  const handleImageClick = (image) => {
    setImage(image);
    setCookieTo(`${addr}sideBarImage`, image);
  };

  const handleColorClick = (color) => {
    setColor(color);
    setCookieTo(`${addr}sideBarColor`, color);
  };

  const handleBgColorClick = (bgColor) => {
    let logo;

    if (bgColor === "white") {
      logo = require("assets/img/logo.svg");
    } else {
      logo = require("assets/img/logo-white.svg");
    }

    setLogo(logo);
    setBgColor(bgColor);
    setCookieTo(`${addr}sideBarLogo`, logo);
    setCookieTo(`${addr}sideBarBackground`, bgColor);
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

  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  const getRoute = () => {
    return !window.location.pathname.includes("/user/");
  };

  const getActiveRoute = (routes) => {
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

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/user") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={() => (
              <prop.component
                assetsPerPage={assetsPerPage}
                roots={roots}
                ARWallet={ARWallet}
                refresh={refreshEvent}
                connectArweave={connectArweaveEvent}
                rootNames={rootNames}
                nodeSets={nodeSets}
                heldNodeData={heldNodeData}
                nodeExtData={nodeExtData}
                ps={sps}
                isMounted={isMounted}
                addr={addr}
                assetObj={assets}
                assetArr={assetArr}
                pruf={prufBalance}
                ether={ETHBalance}
                assets={assetBalance}
                nodes={nodeIdBalance}
                currentACPrice={currentACPrice}
                // IDHolder={isIDHolder}
                simpleAssetView={simpleAssetView}
                winKey={winKey}
                prufClient={prufClient}
                arweaveClient={arweaveClient}
              />
            )}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return;
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  };

  const setUpEnvironment = (_prufClient, _addr) => {
    //console.log(_prufClient)

    console.log("Getting things set up...");

    if (window.isKovan === false) {
      return;
    }

    initArweave().then((e) => {
      if (window.ethereum) {
        if (_addr) {
          setupTokenVals(e, _addr, _prufClient);
          buildRoots(_addr, _prufClient);
        }
      }
    });

    if (window.idxQuery) {
      window.location.href = "/#/user/search/" + window.idxQuery;
    }
  };

  //Count up user tokens, takes  "willSetup" bool to determine whether to call setupAssets() after count
  const setupTokenVals = (_arweave, _addr, _prufClient, options) => {
    console.log({ addr: _addr });
    if (!_addr) return swal("Unable to reach user's wallet.");
    if (!options) options = {};

    if (options.justNodes) {
      _prufClient.get.node.balanceOf(_addr).then((e) => {
        setNodeBalance(e);
        if (Number(e) > 0) {
          setIsAssetClassHolder(true);
          if (!options.justCount) getNodeIds(_addr, _prufClient, e);
        } else {
          setHeldNodeData([["No nodes held by user", "~", "~", "~"]]);
          setIsAssetClassHolder(false);
        }
      });
    } else if (options.justAssets) {
      _prufClient.get.asset.balanceOf(_addr).then((e) => {
        setAssetArr([]);
        setAssetBalance(e);
        if (Number(e) > 0) {
          setIsAssetHolder(true);
          if (!options.justCount) getAssetAtIndex(0, _arweave, _addr, _prufClient, e);
        } else {
          setIsAssetHolder(false);
        }
      });
    } else {
      window.web3.eth.getBalance(_addr, (error, result) => {
        if (!error) {
          console.log(window.web3.utils.fromWei(result, "ether"));
          setETHBalance(window.web3.utils.fromWei(result, "ether"));
        }
      });

      _prufClient.get.asset.balanceOf(_addr).then((e) => {
        setAssetBalance(e);
        if (Number(e) > 0) {
          if (!options.justCount) getAssetAtIndex(0, _arweave, _addr, _prufClient, e);
        }
      });

      _prufClient.get.node.balanceOf(_addr).then((e) => {
        setNodeBalance(e);
        if (Number(e) > 0) {
          if (!options.justCount) getNodeIds(_addr, _prufClient, e);
        } else {
          setHeldNodeData([["No nodes held by user", "~", "~", "~"]]);
        }
      });

      _prufClient.get.pruf.balanceOf(_addr).then((e) => {
        setPrufBalance(e);
      });

      _prufClient.get.node.priceData().then((e) => {
        setCurrentACIndex(e.currentNodeIndex);
        setCurrentACPrice(e.currentNodePrice);
        console.log(e);
      });
    }
  };

  //NODE GETTERS
  /*******************************************************************************************************************************************************/
  const buildRoots = (_addr, _prufClient, iteration, arr) => {
    if (!_prufClient) return;
    if (!arr) arr = cookies[`${_addr}roots`] || [];
    if (!iteration && cookies[`${_addr}roots`])
      iteration = cookies[`${_addr}roots`].length + 1;
    else if (!iteration) iteration = 1;

    _prufClient.get.node.tokenExists(String(iteration)).then((e) => {
      if (e) {
        arr.push(iteration);
        setCookieTo(`${_addr}roots`, arr);
        return buildRoots(_addr, _prufClient, iteration + 1, arr);
      } else {
        //noMore = true;
        console.log(
          `Broke rootGet recursion at: ${iteration} because node doesn't exist at index`
        );
        return buildSubNodes(
          _addr,
          _prufClient,
          undefined,
          undefined,
          undefined,
          arr
        );
      }
    });
  };

  const buildSubNodes = (
    _addr,
    _prufClient,
    iteration,
    arr,
    subNodes,
    roots
  ) => {
    if (!_prufClient) return;

    if (!iteration) {
      iteration = 1000001;
      if (cookies[`${_addr}subNodes`]) {
        iteration += cookies[`${_addr}subNodes`].length;
      }
    }

    if (!arr) {
      arr = roots || [];
      subNodes = cookies[`${_addr}subNodes`] || [];
      if (cookies[`${_addr}subNodes`]) {
        arr = arr.concat(cookies[`${_addr}subNodes`]);
      }
      console.log(`Cached nodes: ${arr}`);
    }

    if (
      cookies[`${_addr}dontCount`] &&
      cookies[`${_addr}dontCount`].includes(iteration)
    ) {
      //console.log(`Caught count exception ${iteration}`);
      return buildSubNodes(_addr, _prufClient, iteration + 1, arr, subNodes);
    } else {
      //console.log({ iteration }, cookies[`${_addr}subNodes`]);
    }

    _prufClient.get.node.tokenExists(String(iteration)).then((e) => {
      if (e) {
        if (!arr.includes(iteration)) {
          arr.push(iteration);
          subNodes.push(iteration);
          setCookieTo(`${_addr}subNodes`, subNodes);
        }
        return buildSubNodes(_addr, _prufClient, iteration + 1, arr, subNodes);
      } else {
        //console.log(
        //  `Broke subNodeGet recursion at: ${iteration} because node doesn't exist at index`
        //);
        console.log(`All nodes: ${arr}`);
        return getNodesFromDB(_addr, _prufClient, arr);
      }
    });
  };

  const getNodesFromDB = (
    _addr,
    _prufClient,
    nodeArray,
    iteration,
    _nodeSets,
    rootArray,
    allNodes,
    dontCount
  ) => {
    if (!dontCount) {
      dontCount = cookies[`${_addr}dontCount`] || [];
      console.log({ dontCount });
    }
    if (!iteration) iteration = 0;
    if (!rootArray) rootArray = [];
    if (!allNodes) allNodes = [];
    if (!_nodeSets) _nodeSets = {};

    if (iteration >= nodeArray.length)
      return setUpNodeInformation(_prufClient, {
        sets: _nodeSets,
        rArr: rootArray,
        allNArr: allNodes,
      });

    if (nodeArray[iteration] < 100000) {
      _prufClient.get.node.name(String(nodeArray[iteration])).then((e) => {
        rootArray.push({
          id: nodeArray[iteration],
          name: e
            .toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()),
        });
        console.log("Creating empty array for root");
        _nodeSets[String(nodeArray[iteration])] = [];
        return getNodesFromDB(
          _addr,
          _prufClient,
          nodeArray,
          iteration + 1,
          _nodeSets,
          rootArray,
          allNodes,
          dontCount
        );
      });
    } else {
      _prufClient.get.node.record(String(nodeArray[iteration])).then((e) => {
        if (e.managementType === "255") {
          return getNodesFromDB(
            _addr,
            _prufClient,
            nodeArray,
            iteration + 1,
            _nodeSets,
            rootArray,
            allNodes,
            dontCount
          );
        } else if (e.managementType === "1" || e.managementType === "2") {
          _prufClient.get.node
            .ownerOf(String(nodeArray[iteration]))
            .then((x) => {
              if (window.web3.utils.toChecksumAddress(x) === _addr) {
                allNodes.push({
                  id: String(nodeArray[iteration]),
                  name: e.name
                    .toLowerCase()
                    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                      letter.toUpperCase()
                    ),
                });

                return getNodesFromDB(
                  _addr,
                  _prufClient,
                  nodeArray,
                  iteration + 1,
                  _nodeSets,
                  rootArray,
                  allNodes,
                  dontCount
                );
              } else {
                if (!dontCount.includes(nodeArray[iteration])) {
                  console.log({ iteration, dontCount });
                  dontCount.push(nodeArray[iteration]);
                  setCookieTo(`${_addr}dontCount`, dontCount);
                } else {
                  console.log(
                    "Counted when should not have... Removing cached values"
                  );
                  let temp = cookies[`${_addr}subNodes`];
                  temp.splice(temp.indexOf(nodeArray[iteration]), 1);
                  setCookieTo(`${_addr}subNodes`, temp);
                }

                return getNodesFromDB(
                  _addr,
                  _prufClient,
                  nodeArray,
                  iteration + 1,
                  _nodeSets,
                  rootArray,
                  allNodes,
                  dontCount
                );
              }
            });
          //getNodesFromDB(_addr, _prufClient, nodeArray, iteration + 1, _nodeSets, rootArray, rootNameArray, allNodes, allClassNames)
        } else if (e.managementType === "3") {
          _prufClient.get.node
            .userType(_addr, String(nodeArray[iteration]))
            .then((x) => {
              if (x === "1") {
                allNodes.push({
                  id: String(nodeArray[iteration]),
                  name: e.name
                    .toLowerCase()
                    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                      letter.toUpperCase()
                    ),
                });
                return getNodesFromDB(
                  _addr,
                  _prufClient,
                  nodeArray,
                  iteration + 1,
                  _nodeSets,
                  rootArray,
                  allNodes,
                  dontCount
                );
              } else {
                return getNodesFromDB(
                  _addr,
                  _prufClient,
                  nodeArray,
                  iteration + 1,
                  _nodeSets,
                  rootArray,
                  allNodes,
                  dontCount
                );
              }
            });
        } else {
          allNodes.push({
            id: String(nodeArray[iteration]),
            name: e.name
              .toLowerCase()
              .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                letter.toUpperCase()
              ),
          });
          return getNodesFromDB(
            _addr,
            _prufClient,
            nodeArray,
            iteration + 1,
            _nodeSets,
            rootArray,
            allNodes,
            dontCount
          );
        }
      });
    }
  };

  const setUpNodeInformation = async (_prufClient, obj) => {
    if (!obj) return;
    console.log(obj);
    let allNodes = obj.allNArr,
      rootArray = obj.rArr,
      _nodeSets = obj.sets;

    //console.log(allNodes, allClassNames, rootArray)

    allNodes.forEach((node) => {
      _prufClient.get.node.record(String(node.id)).then((e) => {
        console.log(e);

        _nodeSets[String(rootArray[Number(e.root - 1)].id)].push({
          id: node.id,
          name: node.name
            .toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()),
        });
      });
    });

    console.log("Class Sets: ", _nodeSets);
    setRoots(rootArray);
    setNodeSets(_nodeSets);
  };

  const getNodeIds = async (_addr, _prufClient, bal, ids, iteration) => {
    // eslint-disable-next-line react/prop-types
    if (!iteration) iteration = 0;
    if (!ids) ids = [];
    if (iteration >= bal) return buildNodesInWallet(_prufClient, ids);
    _prufClient.get.node // eslint-disable-next-line react/prop-types
      .heldNodeAtIndex(_addr, String(iteration))
      .then((e) => {
        ids.push(e);
        return getNodeIds(_addr, _prufClient, bal, ids, iteration + 1);
      });
  };

  const buildNodesInWallet = (
    _prufClient,
    ids,
    _extDataArr,
    _nodeData,
    iteration
  ) => {
    if (!ids) return;
    if (!iteration) iteration = 0;
    if (!_nodeData) _nodeData = [];
    if (!_extDataArr) _extDataArr = [];
    //console.log({ ids })
    if (iteration < ids.length) {
      // eslint-disable-next-line react/prop-types
      _prufClient.get.node // eslint-disable-next-line react/prop-types
        .record(ids[iteration])
        .then((rec) => {
          //console.log(e)
          _nodeData.push([
            //<button className="nodeButton2" onClick={() => handleSimple({ name: e.name, index: iteration, href: "view", id: String(ids[iteration]) })}>{` ${e.name} `}</button>,
            rec.name
              .toLowerCase()
              .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                letter.toUpperCase()
              ),
            String(ids[iteration]),
            "N/A",
            "N/A",
          ]);
          rec.nodeId = ids[iteration];
          rec.name = rec.name
            .toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
          _prufClient.get.node.switchAt(rec.nodeId, "7").then((switch1) => {
            switch1 === "1" ? (rec.usesAuth = true) : (rec.usesAuth = false);
            _extDataArr.push(rec);
            return buildNodesInWallet(
              _prufClient,
              ids,
              _extDataArr,
              _nodeData,
              iteration + 1
            );
          });
        });
    } else {
      _nodeData.push(["", "", "", ""]);
      setNodeExtData(_extDataArr);
      setHeldNodeData(_nodeData);
      //console.log("HERE", _extDataArr)
      return; //console.log(_nodeData)
    }
  };

  //ASSET GETTERS
  /*******************************************************************************************************************************************************/
  const getAssetAtIndex = (index, _arweaveClient=arweaveClient, _addr=addr, _prufClient=prufClient) => {
    _prufClient.get.asset
      .heldAssetAtIndex(_addr, String(index))
      .then(id => getAsset(id, _arweaveClient, _addr, _prufClient));
  };

  const getAsset = (id, _arweaveClient=arweaveClient, _addr=addr, _prufClient=prufClient) => {
    console.log({id})
    _prufClient.get.asset.record(id).then((rec) => {
      console.log({rec});
      rec.id = id;
      getNonMutableOf(rec, _prufClient, _arweaveClient);
    });
  }

  const getNonMutableOf = async (rec, _prufClient, _arweave) => {
    rec.identicon = <Jdenticon value={rec.id} />;
    rec.statusNum = rec.status;
    rec.status = await _prufClient.utils.stringifyStatus(rec.status);
    _prufClient.get.node.record(rec.nodeId).then((nodeData) => {
      rec.nodeData = nodeData;
      rec.nodeName = nodeData.name
        .toLowerCase()
        .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
      _prufClient.get.node.ownerOf(rec.nodeId).then((admin) => {
        rec.nodeAdmin = admin;
        if (
          rec.nonMutableStorage1 ===
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ) {
          rec.nonMutableStorage = "";
          getMutableOf(rec, _prufClient, _arweave);
        } else if (rec.nodeData.storageProvider === "1") {
          _prufClient.utils
            .ipfsFromB32(rec.nonMutableStorage1)
            .then(async (query) => {
              console.log("MDQ", query);

              if (cookies[window.web3.utils.soliditySha3(query)]) {
                rec.nonMutableStorage =
                  cookies[window.web3.utils.soliditySha3(query)];
                  getMutableOf(rec, _prufClient, _arweave);
              } else {
                for await (const chunk of window.ipfs.cat(query)) {
                  let str = new TextDecoder("utf-8").decode(chunk);
                  try {
                    rec.nonMutableStorage = JSON.parse(str);
                    setCookieTo(
                      window.web3.utils.soliditySha3(query),
                      rec.nonMutableStorage
                    );
                  } catch {
                    rec.nonMutableStorage = str;
                  }
                  getMutableOf(rec, _prufClient, _arweave);
                }
              }
            });
        } else if (rec.nodeData.storageProvider === "2") {
          _prufClient.utils
            .arweaveTxFromB32(rec.nonMutableStorage1, rec.nonMutableStorage2)
            .then((query) => {
              rec.contentUrl = `https://arweave.net/${query}`;
              if (cookies[window.web3.utils.soliditySha3(query)]) {
                rec.nonMutableStorage =
                  cookies[window.web3.utils.soliditySha3(query)];
                getMutableOf(rec, _prufClient, _arweave);
              } else {
                let xhr = new XMLHttpRequest();
                xhr.onload = () => {
                  if (xhr.status !== 404 && xhr.status !== 202) {
                    rec.nonMutableStorage = {};
                    _arweave.transactions
                      .get(query)
                      .then((e) => {
                        console.log(e);
                        e.get("tags").forEach((tag) => {
                          let key = tag.get("name", {
                            decode: true,
                            string: true,
                          });
                          let value = tag.get("value", {
                            decode: true,
                            string: true,
                          });
                          rec.nonMutableStorage[key] = value;
                        });
                        setCookieTo(
                          window.web3.utils.soliditySha3(query),
                          rec.nonMutableStorage
                        );
                        getMutableOf(rec, _prufClient, _arweave);
                      })
                      .catch((e) => {
                        console.log(e);
                        rec.nonMutableStorage = ""
                        getMutableOf(rec, _prufClient, _arweave);
                      });
                  } else {
                    console.log("Id returned 404");
                    rec.nonMutableStorage = "";
                    getMutableOf(rec, _prufClient, _arweave);
                  }
                };

                xhr.onerror = () => {
                  console.log("Gateway returned 404");
                  rec.nonMutableStorage = "";
                  getMutableOf(rec, _prufClient, _arweave);
                };

                xhr.open("GET", `https://arweave.net/${query}`);
                xhr.send(null);
              }
            });
        }
      });
    });
  };

  const getMutableOf = async (rec, _prufClient, _arweave) => {
    if (
      rec.mutableStorage1 ===
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      rec.mutableStorage = "";
      finalize(rec, _prufClient);
    } else if (rec.nodeData.storageProvider === "1") {
      _prufClient.utils.ipfsFromB32(rec.mutableStorage1).then(async (query) => {
        console.log("MDQ", query);

        if (cookies[window.web3.utils.soliditySha3(query)]) {
          rec.mutableStorage = cookies[window.web3.utils.soliditySha3(query)];
        } else {
          for await (const chunk of window.ipfs.cat(query)) {
            let str = new TextDecoder("utf-8").decode(chunk);
            rec.mutableStorage = JSON.parse(str);
            setCookieTo(window.web3.utils.soliditySha3(query), JSON.parse(str));
            finalize(rec, _prufClient);
          }
        }
      });
    } else if (rec.nodeData.storageProvider === "2") {
      _prufClient.utils
        .arweaveTxFromB32(rec.mutableStorage1, rec.mutableStorage2)
        .then((query) => {
          rec.contentUrl = `https://arweave.net/${query}`;
          if (cookies[window.web3.utils.soliditySha3(query)]) {
            rec.mutableStorage = cookies[window.web3.utils.soliditySha3(query)];
            finalize(rec, _prufClient);
          } else {
            let xhr = new XMLHttpRequest();
            xhr.onload = () => {
              if (xhr.status !== 404 && xhr.status !== 202) {
                rec.mutableStorage = {};
                _arweave.transactions
                  .get(query)
                  .then((e) => {
                    console.log(e);
                    e.get("tags").forEach((tag) => {
                      let key = tag.get("name", {
                        decode: true,
                        string: true,
                      });
                      let value = tag.get("value", {
                        decode: true,
                        string: true,
                      });
                      rec.mutableStorage[key] = value;
                    });
                    setCookieTo(
                      window.web3.utils.soliditySha3(query),
                      rec.mutableStorage
                    );
                    finalize(rec, _prufClient);
                  })
                  .catch((e) => {
                    console.log(e);
                    rec.mutableStorage = ""
                    finalize(rec, _prufClient, _arweave);
                  });
              } else {
                console.log("Id returned 404");
                rec.mutableStorage = "";
                finalize(rec, _prufClient);
              }
            };

            xhr.onerror = () => {
              console.log("Gateway returned 404");
              rec.mutableStorage = "";
              finalize(rec, _prufClient);
            };

            xhr.open("GET", `https://arweave.net/${query}`);
            xhr.send(null);
          }
        });
    }
  };

  const finalize = async (rec, _prufClient) => {
   
      if (rec.nodeData.storageProvider === "1") {
        let xhr = new XMLHttpRequest();
        xhr.responseType = "text";
        
        xhr.onload = () => {
            rec.displayImage = JSON.parse(this.response);
            let obj = JSON.parse(JSON.stringify(assets));
            obj[rec.id] = rec;
            setAssets(obj);
          }
        };

        xhr.onerror = () => {
          console.error("XHR Error");
          rec.displayImage = "";
          let obj = JSON.parse(JSON.stringify(assets));
          obj[rec.id] = rec;
          setAssets(obj);
        };

        xhr.open("GET", rec.nonMutableStorage.DisplayImage);
        xhr.send(null);

      } else if (rec.nodeData.storageProvider === "2") {
        _prufClient.get.asset.URI(rec.id).then((uri) => {
          rec.displayImage = uri;
          let obj = JSON.parse(JSON.stringify(assets));
          obj[rec.id] = rec;
        setAssets(obj);
        });

      } else {
        _prufClient.get.asset.URI(rec.id).then((uri) => {
          rec.displayImage = uri;
          let obj = JSON.parse(JSON.stringify(assets));
          obj[rec.id] = rec;
          setAssets(obj);
        });
      }
  };

  // const buildAssetHeap = (
  //   _arweave,
  //   _addr,
  //   _prufClient,
  //   ids,
  //   data,
  //   iteration
  // ) => {
  //   if (!ids) return;
  //   if (!data) data = [];
  //   if (!iteration) {
  //     console.log("ids: ", ids);
  //     iteration = 0;
  //   }

  //   if (iteration >= ids.length)
  //     return getMutableStorage(_arweave, data, _prufClient);
  //   else {
  //     _prufClient.get.asset.record(ids[iteration]).then((e) => {
  //       let obj = Object.assign({}, e);
  //       //console.log(e)
  //       obj.identicon = <Jdenticon value={ids[iteration]} />;
  //       obj.identiconLG = <Jdenticon value={ids[iteration]} />;

  //       _prufClient.utils.stringifyStatus(e.statusNum).then((e) => {
  //         obj.status = e;
  //       });
  //       obj = Object.assign(obj, e);
  //       _prufClient.get.node.record(obj.nodeId).then((e) => {
  //         obj.nodeName = e.name
  //           .toLowerCase()
  //           .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  //         obj.nodeData = Object.assign({}, e);
  //         _prufClient.get.node.ownerOf(obj.nodeId).then((e) => {
  //           obj.nodeAdmin = e;
  //           _prufClient.get.node
  //             .userType(window.web3.utils.soliditySha3(_addr), obj.nodeId)
  //             .then((e) => {
  //               obj.userAuthLevel = e;
  //               data.push(obj);
  //               return buildAssetHeap(
  //                 _arweave,
  //                 _addr,
  //                 _prufClient,
  //                 ids,
  //                 data,
  //                 iteration + 1
  //               );
  //             });
  //         });
  //       });
  //     });
  //   }
  // };

  // const getMutableStorage = (
  //   _arweave,
  //   assetHeap,
  //   _prufClient,
  //   assetsWithmutableStorage,
  //   iteration
  // ) => {
  //   if (!assetHeap) return console.log("Failed upon reception of:", assetHeap);
  //   if (!iteration) {
  //     console.log("Assets Prior to mutable data retreival:", assetHeap);
  //     iteration = 0;
  //   }
  //   if (!assetsWithmutableStorage) assetsWithmutableStorage = [];
  //   if (iteration >= assetHeap.length) {
  //     /* console.log("EXIT"); */ return getNonMutableStorages(
  //       _arweave,
  //       assetsWithmutableStorage,
  //       _prufClient
  //     );
  //   }

  //   let obj = assetHeap[iteration];
  //   let storageProvider = obj.nodeData.storageProvider;
  //   let mutableStorageQuery;

  //   if (
  //     obj.mutableStorageA ===
  //       "0x0000000000000000000000000000000000000000000000000000000000000000" ||
  //     obj.nodeData.root === obj.nodeId
  //   ) {
  //     obj.mutableStorage = "";
  //     assetsWithmutableStorage.push(obj);
  //     //console.log("EXIT")
  //     return getMutableStorage(
  //       _arweave,
  //       assetHeap,
  //       _prufClient,
  //       assetsWithmutableStorage,
  //       iteration + 1
  //     );
  //   } else if (storageProvider === "1") {
  //     _prufClient.utils.ipfsFromB32(obj.mutableStorageA).then(async (e) => {
  //       console.log("MDQ", e);

  //       if (cookies[window.web3.utils.soliditySha3(e)]) {
  //         console.log("Using cached mutable data:", cookies[e]);
  //         obj.mutableStorage = cookies[window.web3.utils.soliditySha3(e)];
  //         assetsWithmutableStorage.push(obj);
  //         console.log("EXIT");
  //         return getMutableStorage(
  //           _arweave,
  //           assetHeap,
  //           _prufClient,
  //           assetsWithmutableStorage,
  //           iteration + 1
  //         );
  //       } else {
  //         for await (const chunk of window.ipfs.cat(e)) {
  //           let str = new TextDecoder("utf-8").decode(chunk);
  //           console.log(str);
  //           try {
  //             obj.mutableStorage = JSON.parse(str);
  //           } catch {
  //             obj.mutableStorage = str;
  //           }
  //           assetsWithmutableStorage.push(obj);
  //           setCookieTo(window.web3.utils.soliditySha3(e), JSON.parse(str));
  //           //console.log("EXIT")
  //           return getMutableStorage(
  //             _arweave,
  //             assetHeap,
  //             _prufClient,
  //             assetsWithmutableStorage,
  //             iteration + 1
  //           );
  //         }
  //       }
  //     });
  //   } else if (storageProvider === "2") {
  //     console.log(obj.mutableStorageA, obj.mutableStorageB);
  //     mutableStorageQuery = window.web3.utils.hexToUtf8(
  //       obj.mutableStorageA + obj.mutableStorageB.substring(2, 24)
  //     );
  //     console.log(`Mutable query at pos ${iteration}: ${mutableStorageQuery}`);
  //     //nonMutableStorageQuery =  await window.web3.utils.hexToUtf8(`${obj.nonMutableStorageA}${obj.nonMutableStorageB.substring(2, obj.nonMutableStorage.indexOf("0000000000"))}`)
  //     if (cookies[window.web3.utils.soliditySha3(mutableStorageQuery)]) {
  //       //console.log("Using cached mutable data:", cookies[mutableStorageQuery])
  //       obj.mutableStorage =
  //         cookies[window.web3.utils.soliditySha3(mutableStorageQuery)];
  //       assetsWithmutableStorage.push(obj);
  //       //console.log("EXIT")
  //       return getMutableStorage(
  //         _arweave,
  //         assetHeap,
  //         _prufClient,
  //         assetsWithmutableStorage,
  //         iteration + 1
  //       );
  //     } else {
  //       let xhr = new XMLHttpRequest();

  //       xhr.onload = () => {
  //         if (xhr.status !== 404) {
  //           try {
  //             _arweave.transactions.get(mutableStorageQuery).then((e) => {
  //               let tempObj = {};
  //               console.log(e.get("tags"));
  //               e.get("tags").forEach((tag) => {
  //                 let key = tag.get("name", { decode: true, string: true });
  //                 let value = tag.get("value", { decode: true, string: true });
  //                 tempObj[key] = value;
  //                 //console.log(`${key} : ${value}`);
  //               });
  //               //tempObj.contentUrl = `https://arweave.net/${mutableStorageQuery}`
  //               tempObj.contentUrl = `https://arweave.net/${mutableStorageQuery}`;
  //               obj.mutableStorage = tempObj;
  //               assetsWithmutableStorage.push(obj);
  //               setCookieTo(
  //                 window.web3.utils.soliditySha3(mutableStorageQuery),
  //                 tempObj
  //               );
  //               //console.log("EXIT")
  //               return getMutableStorage(
  //                 _arweave,
  //                 assetHeap,
  //                 _prufClient,
  //                 assetsWithmutableStorage,
  //                 iteration + 1
  //               );
  //             });
  //           } catch {
  //             obj.mutableStorage = "";
  //             assetsWithmutableStorage.push(obj);
  //             return getMutableStorage(
  //               _arweave,
  //               assetHeap,
  //               _prufClient,
  //               assetsWithmutableStorage,
  //               iteration + 1
  //             );
  //           }
  //         } else {
  //           console.log("Id returned 404");
  //           obj.mutableStorage = "";
  //           assetsWithmutableStorage.push(obj);
  //           return getMutableStorage(
  //             _arweave,
  //             assetHeap,
  //             _prufClient,
  //             assetsWithmutableStorage,
  //             iteration + 1
  //           );
  //         }
  //       };

  //       xhr.onerror = () => {
  //         console.log("Id returned 404");
  //         obj.contentUrl = `https://arweave.net/${mutableStorageQuery}`;
  //         obj.mutableStorage = "";
  //         assetsWithmutableStorage.push(obj);
  //         return getMutableStorage(
  //           _arweave,
  //           assetHeap,
  //           _prufClient,
  //           assetsWithmutableStorage,
  //           iteration + 1
  //         );
  //       };

  //       xhr.open("GET", `https://arweave.net/${mutableStorageQuery}`);

  //       try {
  //         xhr.send(null);
  //       } catch {
  //         console.log("Id returned 404");
  //         obj.contentUrl = `https://arweave.net/${mutableStorageQuery}`;
  //         obj.mutableStorage = "";
  //         assetsWithmutableStorage.push(obj);
  //         return getMutableStorage(
  //           _arweave,
  //           assetHeap,
  //           _prufClient,
  //           assetsWithmutableStorage,
  //           iteration + 1
  //         );
  //       }
  //     }
  //   }
  // };

  // const getNonMutableStorages = (
  //   _arweave,
  //   assetHeap,
  //   _prufClient,
  //   assetsWithnonMutableStorages,
  //   iteration
  // ) => {
  //   if (!assetHeap) return console.log("Failed upon reception of:", assetHeap);
  //   if (!iteration) {
  //     console.log("Assets Prior to nonMutableStorage retreival:", assetHeap);
  //     iteration = 0;
  //   }
  //   if (!assetsWithnonMutableStorages) assetsWithnonMutableStorages = [];
  //   if (iteration >= assetHeap.length) {
  //     /* console.log("EXIT"); */ return finalizeAssets(
  //       assetsWithnonMutableStorages
  //     );
  //   }

  //   let obj = assetHeap[iteration];
  //   let storageProvider = obj.nodeData.storageProvider;
  //   let nonMutableStorageQuery;

  //   if (
  //     obj.nonMutableStorageA ===
  //       "0x0000000000000000000000000000000000000000000000000000000000000000" ||
  //     obj.nodeData.root === obj.nodeId
  //   ) {
  //     obj.nonMutableStorage = "";
  //     assetsWithnonMutableStorages.push(obj);
  //     //console.log("EXIT")
  //     return getNonMutableStorages(
  //       _arweave,
  //       assetHeap,
  //       _prufClient,
  //       assetsWithnonMutableStorages,
  //       iteration + 1
  //     );
  //   } else if (storageProvider === "1") {
  //     _prufClient.utils.ipfsFromB32(obj.nonMutableStorageA).then(async (e) => {
  //       nonMutableStorageQuery = e;
  //       console.log(
  //         `nonMutableStorage query at pos ${iteration}: ${nonMutableStorageQuery}`
  //       );

  //       if (cookies[window.web3.utils.soliditySha3(nonMutableStorageQuery)]) {
  //         //console.log("Using cached nonMutableStorage:", cookies[nonMutableStorageQuery])
  //         obj.nonMutableStorage =
  //           cookies[window.web3.utils.soliditySha3(nonMutableStorageQuery)];
  //         //console.log("EXIT")
  //         assetsWithnonMutableStorages.push(obj);
  //         return getNonMutableStorages(
  //           _arweave,
  //           assetHeap,
  //           _prufClient,
  //           assetsWithnonMutableStorages,
  //           iteration + 1
  //         );
  //       } else {
  //         for await (const chunk of window.ipfs.cat(nonMutableStorageQuery)) {
  //           let str = new TextDecoder("utf-8").decode(chunk);
  //           console.log(str);
  //           try {
  //             obj.nonMutableStorage = JSON.parse(str);
  //           } catch {
  //             obj.nonMutableStorage = str;
  //           }

  //           assetsWithnonMutableStorages.push(obj);
  //           setCookieTo(
  //             window.web3.utils.soliditySha3(nonMutableStorageQuery),
  //             JSON.parse(str)
  //           );
  //           //console.log("EXIT")
  //           return getNonMutableStorages(
  //             _arweave,
  //             assetHeap,
  //             _prufClient,
  //             assetsWithnonMutableStorages,
  //             iteration + 1
  //           );
  //         }
  //       }
  //     });
  //   } else if (storageProvider === "2") {
  //     nonMutableStorageQuery = window.web3.utils.hexToUtf8(
  //       obj.nonMutableStorageA + obj.nonMutableStorageB.substring(2, 24)
  //     );
  //     console.log(
  //       `nonMutableStorage query at pos ${iteration}: ${nonMutableStorageQuery}`
  //     );
  //     if (cookies[window.web3.utils.soliditySha3(nonMutableStorageQuery)]) {
  //       obj.nonMutableStorage =
  //         cookies[window.web3.utils.soliditySha3(nonMutableStorageQuery)];
  //       assetsWithnonMutableStorages.push(obj);
  //       return getNonMutableStorages(
  //         _arweave,
  //         assetHeap,
  //         _prufClient,
  //         assetsWithnonMutableStorages,
  //         iteration + 1
  //       );
  //     } else {
  //       let xhr = new XMLHttpRequest();

  //       xhr.onload = () => {
  //         if (xhr.status !== 404 && xhr.status !== 202) {
  //           console.log(xhr);
  //           try {
  //             _arweave.transactions
  //               .get(nonMutableStorageQuery)
  //               .then((e) => {
  //                 let tempObj = {};
  //                 console.log(e);
  //                 e.get("tags").forEach((tag) => {
  //                   let key = tag.get("name", { decode: true, string: true });
  //                   let value = tag.get("value", {
  //                     decode: true,
  //                     string: true,
  //                   });
  //                   tempObj[key] = value;
  //                 });
  //                 tempObj.contentUrl = `https://arweave.net/${nonMutableStorageQuery}`;
  //                 obj.nonMutableStorage = tempObj;
  //                 assetsWithnonMutableStorages.push(obj);
  //                 setCookieTo(
  //                   window.web3.utils.soliditySha3(nonMutableStorageQuery),
  //                   tempObj
  //                 );
  //                 return getNonMutableStorages(
  //                   _arweave,
  //                   assetHeap,
  //                   _prufClient,
  //                   assetsWithnonMutableStorages,
  //                   iteration + 1
  //                 );
  //               })
  //               .catch((e) => {
  //                 console.log(e);
  //                 return getNonMutableStorages(
  //                   _arweave,
  //                   assetHeap,
  //                   _prufClient,
  //                   assetsWithnonMutableStorages,
  //                   iteration + 1
  //                 );
  //               });
  //           } catch {
  //             console.log("In arweave catch clause");
  //             obj.nonMutableStorage = "";
  //             assetsWithnonMutableStorages.push(obj);
  //             return getNonMutableStorages(
  //               _arweave,
  //               assetHeap,
  //               _prufClient,
  //               assetsWithnonMutableStorages,
  //               iteration + 1
  //             );
  //           }
  //         } else {
  //           console.log("Id returned 404");
  //           obj.nonMutableStorage = "";
  //           obj.contentUrl = `https://arweave.net/${nonMutableStorageQuery}`;
  //           assetsWithnonMutableStorages.push(obj);
  //           return getNonMutableStorages(
  //             _arweave,
  //             assetHeap,
  //             _prufClient,
  //             assetsWithnonMutableStorages,
  //             iteration + 1
  //           );
  //         }
  //       };

  //       xhr.onerror = () => {
  //         console.log("Gateway returned 404");
  //         obj.nonMutableStorage = "";
  //         obj.contentUrl = `https://arweave.net/${nonMutableStorageQuery}`;
  //         assetsWithnonMutableStorages.push(obj);
  //         return getNonMutableStorages(
  //           _arweave,
  //           assetHeap,
  //           _prufClient,
  //           assetsWithnonMutableStorages,
  //           iteration + 1
  //         );
  //       };

  //       xhr.open("GET", `https://arweave.net/${nonMutableStorageQuery}`);
  //       try {
  //         xhr.send(null);
  //       } catch {
  //         console.log("Gateway returned 404");
  //         obj.nonMutableStorage = "";
  //         obj.contentUrl = `https://arweave.net/${nonMutableStorageQuery}`;
  //         assetsWithnonMutableStorages.push(obj);
  //         return getNonMutableStorages(
  //           _arweave,
  //           assetHeap,
  //           _prufClient,
  //           assetsWithnonMutableStorages,
  //           iteration + 1
  //         );
  //       }
  //     }
  //   }
  // };

  // const finalizeAssets = (assetHeap, finalizedAssets, iteration) => {
  //   if (!assetHeap) return console.log("Failed upon reception of:", assetHeap);
  //   if (!finalizedAssets) finalizedAssets = [];
  //   if (!iteration) {
  //     console.log("Assets Prior to final sorting:", assetHeap);
  //     iteration = 0;
  //   }
  //   if (iteration >= assetHeap.length) {
  //     setReserveAD(assetHeap);
  //     //document.body.style.cursor = 'auto'
  //     console.log("Finalized assets: ", finalizedAssets);
  //     return setAssetArr(finalizedAssets);
  //   }

  //   let obj = assetHeap[iteration];

  //   obj.photo = obj.nonMutableStorage.photo || obj.mutableStorage.photo || {};
  //   obj.text = obj.nonMutableStorage.text || obj.mutableStorage.text || {};
  //   obj.urls = obj.nonMutableStorage.urls || obj.mutableStorage.urls || {};
  //   obj.name =
  //     obj.nonMutableStorage.name ||
  //     obj.mutableStorage.name ||
  //     "Name Unavailable";
  //   obj.photoUrls =
  //     obj.nonMutableStorage.photo || obj.mutableStorage.photo || {};
  //   obj.PrimaryContent =
  //     obj.nonMutableStorage.PrimaryContent ||
  //     obj.mutableStorage.PrimaryContent ||
  //     "";
  //   obj.ContentType =
  //     obj.nonMutableStorage.ContentType ||
  //     obj.mutableStorage.ContentType ||
  //     obj.nonMutableStorage["Content-Type"] ||
  //     obj.mutableStorage["Content-Type"] ||
  //     "";
  //   obj.Description =
  //     obj.nonMutableStorage.Description || obj.mutableStorage.Description || "";
  //   obj.ContentUrl =
  //     obj.nonMutableStorage.contentUrl || obj.mutableStorage.contentUrl || "";

  //   let vals = Object.values(obj.photo),
  //     keys = Object.keys(obj.photo);

  //   if (obj.nodeData.storageProvider === "2") {
  //     console.log("2");
  //     if (
  //       obj.nonMutableStorage.contentUrl &&
  //       obj.nonMutableStorage["Content-Type"].includes("image")
  //     ) {
  //       obj.displayImage = obj.nonMutableStorage.contentUrl;
  //       finalizedAssets.push(obj);
  //       finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //     } else if (
  //       obj.mutableStorage.contentUrl &&
  //       obj.mutableStorage["Content-Type"].includes("image")
  //     ) {
  //       obj.displayImage = obj.mutableStorage.contentUrl;
  //       finalizedAssets.push(obj);
  //       finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //     } else if (obj.nonMutableStorage["Content-Type"].includes("pdf")) {
  //       obj.displayImage = placeholder;
  //       finalizedAssets.push(obj);
  //       finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //     } else if (obj.nonMutableStorage["Content-Type"].includes("zip")) {
  //       obj.displayImage = placeholder;
  //       finalizedAssets.push(obj);
  //       finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //     } else if (obj.mutableStorage["Content-Type"].includes("pdf")) {
  //       obj.displayImage = placeholder;
  //       finalizedAssets.push(obj);
  //       finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //     } else if (obj.mutableStorage["Content-Type"].includes("zip")) {
  //       obj.displayImage = placeholder;
  //       finalizedAssets.push(obj);
  //       finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //     } else if (keys.length === 0) {
  //       obj.displayImage = "";
  //       finalizedAssets.push(obj);
  //       finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //     }
  //   } else if (obj.nodeData.storageProvider === "1") {
  //     console.log("1");
  //     const getAndSet = (url) => {
  //       if (!url || url === "") {
  //         obj.displayImage = "";
  //         finalizedAssets.push(obj);
  //         finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //       }
  //       const req = new XMLHttpRequest();
  //       req.responseType = "text";

  //       req.onload = function () {
  //         //console.log("response", this.response);
  //         if (this.response.includes("image")) {
  //           console.log("image");
  //           obj.displayImage = this.response;
  //           finalizedAssets.push(obj);
  //           finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //         } else if (this.response.includes("application")) {
  //           console.log("app");
  //           obj.displayImage = placeholder;
  //           finalizedAssets.push(obj);
  //           finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //         }
  //       };

  //       req.onerror = function (e) {
  //         //console.log("http request error")
  //         console.log("error");
  //         obj.displayImage = "";
  //         finalizedAssets.push(obj);
  //         finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //       };
  //       req.open("GET", url, true);
  //       req.send();
  //     };

  //     if (obj.ContentType.includes("pdf") || obj.ContentType.includes("zip")) {
  //       getAndSet(obj.nonMutableStorage.PrimaryContent);
  //     } else if (
  //       obj.nonMutableStorage !== "" &&
  //       obj.nonMutableStorage.displayImage !== "" &&
  //       obj.nonMutableStorage.displayImage !== undefined
  //     ) {
  //       getAndSet(obj.nonMutableStorage.displayImage);
  //     } else if (
  //       obj.mutableStorage !== "" &&
  //       obj.mutableStorage.displayImage !== "" &&
  //       obj.mutableStorage.displayImage !== undefined
  //     ) {
  //       getAndSet(obj.mutableStorage.displayImage);
  //     } else {
  //       obj.displayImage = "";
  //       finalizedAssets.push(obj);
  //       finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //     }
  //   } else if (keys.length > 0) {
  //     for (let i = 0; i < keys.length; i++) {
  //       const get = () => {
  //         if (vals[i].includes("data") && vals[i].includes("base64")) {
  //           obj.photo[keys[i]] = vals[i];
  //           if (keys[i] === "displayImage") {
  //             obj.displayImage = obj.photo[keys[i]];
  //           } else if (i === keys.length - 1) {
  //             //console.log("Setting Display Image")
  //             obj.displayImage = obj.photo[keys[0]];
  //           }
  //           forceUpdate();
  //           finalizedAssets.push(obj);
  //           finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //         } else if (!vals[i].includes("ipfs") && vals[i].includes("http")) {
  //           obj.photo[keys[i]] = vals[i];
  //           if (keys[i] === "displayImage") {
  //             //console.log("Setting Display Image")
  //             obj.displayImage = obj.photo[keys[i]];
  //           } else if (i === keys.length - 1) {
  //             //console.log("Setting Display Image")
  //             obj.displayImage = obj.photo[keys[0]];
  //           }
  //           forceUpdate();
  //           finalizedAssets.push(obj);
  //           finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //         } else {
  //           const req = new XMLHttpRequest();
  //           req.responseType = "text";

  //           req.onload = function (e) {
  //             //console.log("in onload")
  //             if (this.response.includes("base64")) {
  //               obj.photo[keys[i]] = this.response;
  //               if (keys[i] === "displayImage") {
  //                 //console.log("Setting Display Image")
  //                 obj.displayImage = obj.photo[keys[i]];
  //               } else if (i === keys.length - 1) {
  //                 //console.log("Setting Display Image")
  //                 obj.displayImage = obj.photo[keys[0]];
  //               }
  //               forceUpdate();
  //               finalizedAssets.push(obj);
  //               finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //             }
  //           };

  //           req.onerror = function () {
  //             //console.log("http request error")
  //             if (vals[i].includes("http")) {
  //               obj.photo[keys[i]] = vals[i];
  //               if (keys[i] === "displayImage") {
  //                 //console.log("Setting Display Image")
  //                 obj.displayImage = obj.photo[keys[i]];
  //               } else if (i === keys.length - 1) {
  //                 //console.log("Setting Display Image")
  //                 obj.displayImage = obj.photo[keys[0]];
  //               }
  //               forceUpdate();
  //               finalizedAssets.push(obj);
  //               finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //             }
  //           };
  //           req.open("GET", vals[i], true);
  //           req.send();
  //         }
  //       };
  //       get();
  //     }
  //   } else {
  //     console.log("in else");
  //     obj.displayImage = "";
  //     finalizedAssets.push(obj);
  //     finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
  //   }
  // };

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
