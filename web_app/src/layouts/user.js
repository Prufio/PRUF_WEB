import React from "react";
import cx from "classnames";
import Jdenticon from "react-jdenticon";
import swal from "sweetalert";
import Web3 from "web3";
import Arweave from "arweave";
import TestWeave from "testweave-sdk";
import arconf from "../Resources/arconf";

import PRUF from "pruf-js";
import { isMobile } from "react-device-detect";
//import OrbitDB from 'orbit-db';
/* import resolveContracts from "../Resources/Contracts"; */
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
import {
  AirlineSeatLegroomExtraSharp,
  IndeterminateCheckBox,
  WrapText,
} from "@material-ui/icons";
import defaultBGImage from "../assets/img/Sidebar Backgrounds/TracesWB.jpg";

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
  const [isIDHolder, setIsIDHolder] = React.useState();
  const [sidebarRoutes, setSidebarRoutes] = React.useState([
    routes[0],
    routes[1],
    routes[2],
    routes[3],
    routes[4],
  ]);
  const [sps, setSps] = React.useState(undefined);
  const [assetIds, setAssetIds] = React.useState([]);

  const [prufBalance, setPrufBalance] = React.useState("~");
  const [prufClient, setPrufClient] = React.useState();
  const [roots, setRoots] = React.useState(undefined);
  const [rootNames, setRootNames] = React.useState(undefined);
  const [nodeSets, setNodeSets] = React.useState(undefined);
  const [currentACIndex, setCurrentACIndex] = React.useState("~");
  const [currentACPrice, setCurrentACPrice] = React.useState("~");
  const [assetBalance, setAssetBalance] = React.useState("~");
  const [nodeIdBalance, setNodeBalance] = React.useState("~");
  const [heldNodeData, setHeldNodeData] = React.useState([['Loading Nodes...', '~', '~', '~']]);
  const [nodeExtData, setNodeExtData] = React.useState();
  const [IDBalance, setIDBalance] = React.useState("0");
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
  const [testWeave, setTestWeave] = React.useState();
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const [acArr, setAcArr] = React.useState([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    1000002,
    1000001,
  ]);

  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [logo, setLogo] = React.useState(require("assets/img/logo-white.svg"));
  // styles
  const classes = useStyles();
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

  //console.log("pre-load href", window.location.href)
  const initArweave = async () => {
    const _arweave = Arweave;
    const arweave = _arweave.init(arconf);

    setArweaveClient(arweave);

    console.log(arweave);

    const testWeave = await TestWeave.init(arweave);

    setTestWeave(testWeave);

    console.log(testWeave);

    window.arweave = arweave;

    return { testWeave: testWeave, arweave: arweave };
  };

  const handleNoEthereum = async () => {
    //if(isMobile) swal("No ethereum detected")
    console.log("No ethereum object available");
    let web3;
    web3 = require("web3");
    web3 = new Web3(
      "https://kovan.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959"
    );
    const _prufClient = new PRUF(web3);

    console.log(_prufClient);
    setPrufClient(_prufClient);
    setUpEnvironment(_prufClient)
    awaitPrufInitNoAddress(_prufClient)
    setIsIDHolder(false)

    window.web3 = web3;
    return setIsMounted(true);
  };

  const checkForCookies = () => {

    if (!cookies.hasBeenNotified) {
      swal({
        title: "Cookies on app.pruf.io",
        text:
          "This site uses minimal cookies to offer you optimal performance and loading times.",
        icon: "warning",
        buttons: {
          moreInfo: {
            text: "Learn more",
            value: "moreInfo",
            className: "moreCookieInfo",
          },
          decline: {
            text: "Decline Use",
            value: "decline",
            className: "declineCookies",
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
            break;

          case "moreInfo":
            swal({
              title: "Cookies on app.pruf.io",
              text: "Cookies are small packets of user data that are created and stored by your web provider. We use cookes to provide a seamless and fast dApp experiance while simultaneously maintaining the users privacy. We do not store any personally identifiable information. If you prefer to not to use cookies, you can decline this form and your browser will not store any data. please note however, that this will make the application slightly less responsive. The cookies we use on app.pruf.io are strictly for caching asset extended data.",
              buttons: {
                decline: {
                  text: "Decline Use",
                  value: "decline",
                  className: "declineCookies",
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
                  break;

                case "decline":
                  setCookieTo("hasBeenNotified", false);
                  break;

                default:
                  break;
              }
            });
            break;

          case "decline":
            setCookieTo("hasBeenNotified", false);
            break;

          default:
            break;
        }
      });
    }
    //console.log("Cookies:", cookies);
  };

  const setCookieTo = (job, val) => {
    if (cookies["hasBeenNotified"] === false) return
    //if(!cookies[job]) return console.log("Referenced nonexistant cookie")
    console.log("Setting cookie", job, "to", val);
    setCookie(String(job), JSON.stringify(val), {
      path: "/",
      expires: new Date().addDays(5),
    });
  };

  const readCookie = async (job) => {
    if (cookies["hasBeenNotified"] === false) return
    if (!cookies[job]) return console.log("Referenced nonexistant cookie");
    return cookies[job];
  };

  const awaitPrufInit = async (_prufClient, _addr) => {
    //console.log("Waiting for init...", _prufClient.get)
    setTimeout(() => {
      if (_prufClient.get) { console.log(_prufClient.get); setUpEnvironment(_prufClient, _addr); if (window.idxQuery) { window.location.href = "/#/user/search"; forceUpdate() } }
      else { awaitPrufInit(_prufClient, _addr) }
    }, 100)
  }

  const awaitPrufInitNoAddress = async (_prufClient) => {
    //console.log("Waiting for init...", _prufClient.get)
    setTimeout(() => {
      if (_prufClient.get) { console.log(_prufClient.get); setPrufClient(_prufClient); if (window.idxQuery) { window.location.href = "/#/user/search"; forceUpdate() } }
      else { awaitPrufInitNoAddress(_prufClient) }
    }, 100)
  }

  const handleEthereum = async () => {

    if (window.ethereum) {

      window.ethereum.on("chainChanged", (chainId) => {
        console.log(chainId);
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", (e) => {
        console.log("Accounts changed");
        if (e[0] === undefined || e[0] === null) {
          if (e[0] !== addr) {
            window.location.reload();
            /* if(isMobile) swal("Changing accounts")
              setAddr(window.web3.utils.toChecksumAddress(e[0]));
              awaitPrufInit(prufClient, window.web3.utils.toChecksumAddress(e[0])) */
          }
        } else if (e[0] !== addr) {
          /* if(isMobile) swal("Changing accounts")
          setAddr(window.web3.utils.toChecksumAddress(e[0]));
          awaitPrufInit(prufClient, window.web3.utils.toChecksumAddress(e[0])) */
          window.location.reload();
        }
      });


      //if(isMobile) swal("Ethereum successfully detected")
      //console.log("Found ethereum object");
      let web3;
      web3 = require("web3");
      const ethereum = window.ethereum;
      //console.log("Here");

      web3 = new Web3(web3.givenProvider);
      window.web3 = web3;
      const _prufClient = new PRUF(web3);
      //console.log(_prufClient);
      setPrufClient(_prufClient);
      window.costs = {};
      window.additionalElementArrays = {
        photo: [],
        text: [],
        name: "",
      };

      web3.eth.net.getNetworkType().then((e) => {
        if (e === "kovan") {
          window.isKovan = true;
          ethereum
            .request({
              method: "eth_accounts",
              params: {},
            })
            .then(async (accounts) => {
              if (accounts[0] !== undefined) {
                setAddr(window.web3.utils.toChecksumAddress(accounts[0]));
                setIsMounted(true);
                awaitPrufInit(_prufClient, window.web3.utils.toChecksumAddress(accounts[0]))
              } else {
                ethereum.send('eth_requestAccounts').then((accounts) => {
                  if (accounts[0] !== undefined) {
                    setAddr(window.web3.utils.toChecksumAddress(accounts[0]));
                    window.addr = window.web3.utils.toChecksumAddress(accounts[0])
                    setUpContractEnvironment(_prufClient, web3, window.web3.utils.toChecksumAddress(accounts[0]));
                    setIsMounted(true);
                  }
                });
              }
            });

          return setIsKovan(true);
        } else {
          window.isKovan = false;
          setIsKovan(false);
          return swal({
            title: "Connect to the Kovan Testnet!",
            text:
              "Please connect your ethereum provider to the Kovan Testnet and reload the page to access page functionality.",
            icon: "warning",
            button: "Okay",
          });
        }
      });

      //More globals (eth-is-connected specific)
      /*       window.assetTokenInfo = {
              nodeId: undefined,
              id: undefined,
              name: undefined,
              photos: undefined,
              text: undefined,
              status: undefined,
            };
      
            window.assets = {
              descriptions: [],
              ids: [],
              nodeNames: [],
              nodeIdes: [],
              countPairs: [],
              statuses: [],
              names: [],
              displayImages: [],
            }; */

    } else {
      return handleNoEthereum();
    }
  };

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
          /* if(isMobile) swal("Changing accounts")
            setAddr(window.web3.utils.toChecksumAddress(e[0]));
            awaitPrufInit(prufClient, window.web3.utils.toChecksumAddress(e[0])) */
        }
      } else if (e[0] !== addr) {
        /* if(isMobile) swal("Changing accounts")
        setAddr(window.web3.utils.toChecksumAddress(e[0]));
        awaitPrufInit(prufClient, window.web3.utils.toChecksumAddress(e[0])) */
        window.location.reload();
      }
    });
  };

  window.onload = () => {
    //console.log("page loaded", window.location.href)
    if (cookies['dontCount'] === undefined) setCookieTo('dontCount', [])
    window.balances = {};
    window.replaceAssetData = {};
    let timeOutCounter = 0;
    window.recount = false;
    let _ipfs;

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

      setTimeout(handleEthereum, 3000); // 3 seconds
    }

    //initOrbitDB()
  };

  React.useEffect(() => {
    if (window.ethereum) {
      window.addEventListener("chainListener", chainListener());
      window.addEventListener("accountListener", acctListener());
      //window.addEventListener("connectListener", connectListener())
    }

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

  React.useEffect(() => {
    if (isMounted) {
      //console.log("Heard call for replace.")
      if (
        !window.replaceAssetData ||
        Object.values(window.replaceAssetData).length === 0
      ) {
        window.replaceAssetData = {};
      }
      if (window.replaceAssetData.refreshBals) {
        console.log("Resetting token value");
        //document.body.style.cursor = 'wait'
        setupTokenVals(addr, prufClient, { justCount: true });
        buildRoots(addr, prufClient)
        window.replaceAssetData = {};
        forceUpdate();
      } else if (
        window.replaceAssetData.key !== thousandHashesOf(addr, winKey)
      ) {
        window.replaceAssetData = {};
        console.log("Invalid key passed. Aborted call to replace.");
      } else if (window.replaceAssetData.nodeList) {

        let newData = JSON.parse(JSON.stringify(window.replaceAssetData.nodeList))

        if (newData.extData) {
          setNodeExtData(newData.extData)
        }

        if (newData.data) {
          setHeldNodeData(newData.data)
        }

        if (newData.setAddition) {
          let tempSets = JSON.parse(JSON.stringify(nodeSets))

          tempSets[newData.setAddition.root].push({ id: newData.setAddition.id, name: newData.setAddition.name })

          setNodeSets(tempSets)
        }

        setupTokenVals(addr, prufClient, { justNodes: true })
      } else {
        setWinKey(String(Math.round(Math.random() * 100000)));
        console.log(
          "Object is defined. index: ",
          window.replaceAssetData.dBIndex,
          " new asset: ",
          window.replaceAssetData.newAsset
        );
        let newAsset = window.replaceAssetData.newAsset;
        let dBIndex = window.replaceAssetData.dBIndex;
        let tempArr = JSON.parse(JSON.stringify(assetArr));
        let idArr = JSON.parse(JSON.stringify(assetIds));
        setupTokenVals(addr, prufClient, { justCount: true });
        // if (!assetArr || assetArr.length < 1) {
        //   tempArr = [];
        // }

        // else {
        //   tempArr = JSON.parse(JSON.stringify(assetArr))
        // }

        if (newAsset && dBIndex > -1) {
          idArr.push(newAsset.id);
          //newAsset.lastRef = "/#/user/dashboard"
          newAsset.identicon = <Jdenticon vlaue={newAsset.id} />;
          console.log("Replacing asset at index: ", dBIndex);
          console.log("Old Assets", tempArr);
          tempArr.splice(dBIndex, 1, newAsset);
          console.log("New Assets", tempArr);
          setAssetArr(tempArr);
          setAssetIds(idArr);
          window.replaceAssetData = {};
          getAssetIds(addr, prufClient, assetIds.length);
        } else if (dBIndex > -1 && !newAsset) {
          console.log("Deleting asset at index: ", dBIndex);
          console.log("Old Assets", tempArr);
          tempArr.splice(dBIndex, 1);
          idArr.splice(dBIndex, 1);
          console.log("New Assets", tempArr);
          setAssetArr(tempArr);
          getAssetIds(addr, prufClient, assetIds.length - 1);
          window.replaceAssetData = {};
        } else if (newAsset && !dBIndex) {
          idArr.push(newAsset.id);
          //newAsset.lastRef = "/#/user/dashboard";
          newAsset.identicon = <Jdenticon vlaue={newAsset.id} />;
          console.log("Adding asset: ", newAsset);
          console.log("Old Assets", tempArr);
          tempArr.push(newAsset);
          console.log("New Assets", tempArr);
          setAssetArr(tempArr);
          window.replaceAssetData = {};
          getAssetIds(addr, prufClient, assetIds.length + 1);
        }
        forceUpdate();
      }
    }
  }, [window.replaceAssetData]);

  const handleImageClick = (image) => {
    setImage(image);
  };

  const handleColorClick = (color) => {
    setColor(color);
  };

  const handleBgColorClick = (bgColor) => {
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
                roots={roots}
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
                IDHolder={isIDHolder}
                simpleAssetView={simpleAssetView}
                winKey={winKey}
                prufClient={prufClient}
                arweaveClient={arweaveClient}
                testWeave={testWeave}
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

  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
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

  const setUpEnvironment = async (_prufClient, _addr) => {
    if (typeof cookies['dontCount'] !== 'object') setCookieTo('dontCount', [])

    //console.log(_prufClient)

    console.log("Getting things set up...")

    if (window.isKovan === false) {
      return;
    }

    initArweave();

    if (window.idxQuery) {
      window.location.href = "/#/user/search/" + window.idxQuery;
    }

    if (window.ethereum) {
      if (_addr) {
        setupTokenVals(_addr, _prufClient)
        buildRoots(_addr, _prufClient)
      }
    }
  };

  //Count up user tokens, takes  "willSetup" bool to determine whether to call setupAssets() after count
  const setupTokenVals = async (_addr, _prufClient, options) => {

    if (!_addr) return swal("Unable to reach user's wallet.");
    if (!options) options = {}

    if (options.justNodes) {
      _prufClient.get.nodeBalance(_addr).then(e => {

        setNodeBalance(e);
        if (Number(e) > 0) {
          setIsAssetClassHolder(true);
          if (!options.justCount) getNodeIds(_addr, _prufClient, e)
        } else {
          setHeldNodeData([['No nodes held by user', '~', '~', '~']])
          setIsAssetClassHolder(false);
        }

      });
    } else if (options.justAssets) {
      _prufClient.get.assetBalance(_addr).then(e => {

        setAssetBalance(e);
        if (Number(e) > 0) {
          setIsAssetHolder(true);
          if (!options.justCount) getAssetIds(_addr, _prufClient, e)
        } else {
          setIsAssetHolder(false);
        }

      });
    } else {


      window.web3.eth.getBalance(_addr, (error, result) => {
        if (error) {
        } else {
          setETHBalance(window.web3.utils.fromWei(result, "ether"));
        }
      });

      _prufClient.get.assetBalance(_addr).then(e => {

        setAssetBalance(e);
        if (Number(e) > 0) {
          setIsAssetHolder(true);
          if (!options.justCount) getAssetIds(_addr, _prufClient, e)
        } else {
          setIsAssetHolder(false);
        }

      });

      _prufClient.get.nodeBalance(_addr).then(e => {

        setNodeBalance(e);
        if (Number(e) > 0) {
          setIsAssetClassHolder(true);
          if (!options.justCount) getNodeIds(_addr, _prufClient, e)
        } else {
          setHeldNodeData([['No nodes held by user', '~', '~', '~']])
          setIsAssetClassHolder(false);
        }

      });

      _prufClient.get.holdsId(_addr).then(e => {
        setIsIDHolder(e);
      });

      _prufClient.get.prufBalance(_addr).then(e => {
        setPrufBalance(e);
      });

      _prufClient.get.nodePricing().then(e => {
        setCurrentACIndex(e.currentNodeIndex);
        setCurrentACPrice(e.currentNodePrice);
      });
    }
  };

  const buildRoots = (_addr, _prufClient, iteration, arr) => {
    if (!_prufClient) return;
    if (!arr) arr = cookies["roots"] || [];
    if (!iteration && cookies["roots"]) iteration = cookies["roots"].length + 1; else if (!iteration) iteration = 1;

    _prufClient.get
      .nodeExists(String(iteration))
      .then(e => {
        if (e) {
          arr.push(iteration);
          setCookieTo("roots", arr)
          return buildRoots(_addr, _prufClient, iteration + 1, arr);
        } else {
          //noMore = true;
          console.log(`Broke rootGet recursion at: ${iteration} because node doesn't exist at index`)
          return buildSubNodes(_addr, _prufClient, undefined, undefined, undefined, arr);
        }
      });
  };

  const buildSubNodes = (_addr, _prufClient, iteration, arr, subNodes, roots) => {
    if (!_prufClient) return;

    if (!iteration) {
      iteration = 1000001
      if (cookies['subNodes']) {
        iteration += cookies['subNodes'].length
      }
    }

    if (!arr) {
      arr = roots || []
      subNodes = cookies['subNodes'] || []
      if (cookies['subNodes']) {
        arr = arr.concat(cookies['subNodes'])
      }
      console.log(`Cached nodes: ${arr}`)
    }

    if (cookies['dontCount'] && cookies['dontCount'].includes(iteration)) {
      return buildSubNodes(_addr, _prufClient, iteration + 1, arr, subNodes);
    }

    _prufClient.get
      .nodeExists(String(iteration))
      .then(e => {
        if (e) {
          arr.push(iteration);
          subNodes.push(iteration)
          setCookieTo("subNodes", subNodes)
          return buildSubNodes(_addr, _prufClient, iteration + 1, arr, subNodes)
        } else {
          console.log(`Broke subNodeGet recursion at: ${iteration} because node doesn't exist at index`)
          console.log(`All nodes: ${arr}`)
          return getACsFromDB(_addr, _prufClient, arr)
        }
      });

  }

  const getACsFromDB = (_addr, _prufClient, acArray, iteration, _nodeSets, rootArray, rootNameArray, allClasses, allClassNames) => {
    if (!iteration) iteration = 0;
    if (!rootArray) rootArray = [];
    if (!rootNameArray) rootNameArray = [];
    if (!allClasses) allClasses = [];
    if (!allClassNames) allClassNames = [];
    if (!_nodeSets) _nodeSets = {};
    
    if (iteration >= acArray.length)
      return setUpNodeInformation(
        _prufClient,
        {
          sets: _nodeSets,
          rArr: rootArray,
          rnArr: rootNameArray,
          allCArr: allClasses,
          allCNArr: allClassNames,
        });

    if (acArray[iteration] < 100000) {
      _prufClient.get.nodeName(String(acArray[iteration])).then(e => {
        rootArray.push(acArray[iteration]);
        rootNameArray.push(
          e
            .toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
              letter.toUpperCase()
            )
        );
        _nodeSets[String(acArray[iteration])] = [];
        return getACsFromDB(_addr, _prufClient, acArray, iteration + 1, _nodeSets, rootArray, rootNameArray, allClasses, allClassNames)
      })
    } else {
      _prufClient.get
        .nodeData(String(acArray[iteration]))
        .then(e => {
          //console.log(acArray[i])
          if (e.managementType === "255") {
            return getACsFromDB(_addr, _prufClient, acArray, iteration + 1, _nodeSets, rootArray, rootNameArray, allClasses, allClassNames)
          } else if (e.managementType === "1" || e.managementType === "2") {
            _prufClient.get.ownerOfNode(String(acArray[iteration])).then(x => {
              if (x === _addr) {
                allClasses.push(String(acArray[iteration]));
                allClassNames.push(
                  e.name
                    .toLowerCase()
                    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                      letter.toUpperCase()
                    )
                );
                return getACsFromDB(_addr, _prufClient, acArray, iteration + 1, _nodeSets, rootArray, rootNameArray, allClasses, allClassNames)
              } else {
                let tempArr = cookies['dontCount']
                console.log(tempArr)
                tempArr.push(acArray[iteration])
                setCookieTo('dontCount', tempArr)
                return getACsFromDB(_addr, _prufClient, acArray, iteration + 1, _nodeSets, rootArray, rootNameArray, allClasses, allClassNames)
              }
            })
            //getACsFromDB(_addr, _prufClient, acArray, iteration + 1, _nodeSets, rootArray, rootNameArray, allClasses, allClassNames)
          } else if (e.managementType === "3") {
            _prufClient.get.userType(_addr, String(acArray[iteration])).then(x => {
              if (x === "1") {
                allClasses.push(String(acArray[iteration]));
                allClassNames.push(
                  e.name
                    .toLowerCase()
                    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                      letter.toUpperCase()
                    )
                );
                return getACsFromDB(_addr, _prufClient, acArray, iteration + 1, _nodeSets, rootArray, rootNameArray, allClasses, allClassNames)
              } else {
                return getACsFromDB(_addr, _prufClient, acArray, iteration + 1, _nodeSets, rootArray, rootNameArray, allClasses, allClassNames)
              }
            })
          } else {
            allClasses.push(String(acArray[iteration]));
            allClassNames.push(
              e.name
                .toLowerCase()
                .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                  letter.toUpperCase()
                )
            );
            return getACsFromDB(_addr, _prufClient, acArray, iteration + 1, _nodeSets, rootArray, rootNameArray, allClasses, allClassNames)
          }
        });
    }
  };

  const setUpNodeInformation = async (_prufClient, obj) => {
    if (!obj) return
    console.log(obj)
    let
      allClasses = obj.allCArr,
      rootArray = obj.rArr,
      _nodeSets = obj.sets,
      rootNameArray = obj.rnArr,
      allClassNames = obj.allCNArr;

    //console.log(allClasses, allClassNames, rootArray)

    for (let i = 0; i < allClasses.length; i++) {
      _prufClient.get
        .nodeData(String(allClasses[i]))
        .then(e => {
          _nodeSets[String(rootArray[Number(e.root - 1)])].push({
            id: allClasses[i],
            name: allClassNames[i]
              .toLowerCase()
              .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                letter.toUpperCase()
              ),
          });
        });
    }

    console.log("Class Sets: ", _nodeSets);
    setRoots(rootArray);
    setRootNames(rootNameArray);
    setNodeSets(_nodeSets);
  };

  const getNodeIds = async (_addr, _prufClient, bal, ids, iteration) => {
    // eslint-disable-next-line react/prop-types
    if (!iteration) iteration = 0
    if (!ids) ids = []
    if (iteration >= bal) return buildNodesInWallet(_prufClient, ids)
    _prufClient.get
      // eslint-disable-next-line react/prop-types
      .heldNodeAtIndex(_addr, String(iteration))
      .then(e => {
        ids.push(e)
        return getNodeIds(_addr, _prufClient, bal, ids, iteration + 1)
      })
  }

  const buildNodesInWallet = (_prufClient, ids, _extDataArr, _nodeData, iteration) => {
    if (!ids) return
    if (!iteration) iteration = 0
    if (!_nodeData) _nodeData = []
    if (!_extDataArr) _extDataArr = []
    //console.log({ ids })
    if (iteration < ids.length) {
      // eslint-disable-next-line react/prop-types
      _prufClient.get
        // eslint-disable-next-line react/prop-types
        .nodeData(ids[iteration])
        .then(e => {
          //console.log(e)
          _nodeData.push([
            //<button className="nodeButton2" onClick={() => handleSimple({ name: e.name, index: iteration, href: "view", id: String(ids[iteration]) })}>{` ${e.name} `}</button>,
            e.name.toLowerCase()
              .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                letter.toUpperCase()
              ),
            String(ids[iteration]),
            'N/A',
            'N/A',
          ])
          e.nodeId = ids[iteration]
          e.name = e.name.toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
              letter.toUpperCase()
            )
          _extDataArr.push(e)
          return buildNodesInWallet(_prufClient, ids, _extDataArr, _nodeData, iteration + 1)
        })
    } else {
      _nodeData.push(['', '', '', ''])
      setNodeExtData(_extDataArr)
      setHeldNodeData(_nodeData)
      //console.log("HERE", _extDataArr)
      return //console.log(_nodeData)
    }
  }

  const getAssetIds = (_addr, _prufClient, bal, ids, iteration) => {
    if (!bal) return;
    if (Number(bal) === 0) return console.log("No assets held by user");
    if (!ids) ids = [];
    if (!iteration) iteration = 0;
    if (ids.length >= bal) {
      setAssetIds(ids);
      return buildAssetHeap(_addr, _prufClient, ids);
    } else {
      _prufClient.get
        .heldAssetAtIndex(_addr, String(iteration))
        .then(e => {
          //console.log(e)
          ids.push(e);
          getAssetIds(_addr, _prufClient, bal, ids, iteration + 1);
        });
    }
  };

  const buildAssetHeap = (_addr, _prufClient, ids, data, iteration) => {
    if (!ids) return;
    if (!data) data = [];
    if (!iteration) {
      console.log("ids: ", ids);
      iteration = 0;
    }

    if (iteration >= ids.length) return getMutableData(data, _prufClient)
    else {
      _prufClient.get.assetRecord(ids[iteration]).then(e => {
        let obj = Object.assign({}, e)
        //console.log(e)
        obj.identicon = <Jdenticon value={ids[iteration]} />
        obj.identiconLG = <Jdenticon value={ids[iteration]} />

        _prufClient.utils.stringifyStatus(e.statusNum).then((e) => {
          obj.status = e
        });

        _prufClient.get
          .assetPriceData(ids[iteration])
          .then(e => {
            obj = Object.assign(obj, e)
            _prufClient.get
              .nodeData(obj.nodeId)
              .then(e => {
                obj.nodeName = e.name.toLowerCase()
                  .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                    letter.toUpperCase()
                  );
                obj.nodeData = Object.assign({}, e)
                _prufClient.get.ownerOfNode(obj.nodeId).then(e => {
                  obj.nodeAdmin = e
                  _prufClient.get.userType(window.web3.utils.soliditySha3(_addr), obj.nodeId).then(e => {
                    obj.userAuthLevel = e
                    data.push(obj);
                    return buildAssetHeap(
                      _addr,
                      _prufClient,
                      ids,
                      data,
                      iteration + 1
                    )
                  })
                })
              })
          })
      })
    }
  }

  const getMutableData = (
    assetHeap,
    _prufClient,
    assetsWithMutableData,
    iteration
  ) => {
    if (!assetHeap) return console.log("Failed upon reception of:", assetHeap);
    if (!iteration) {
      console.log("Assets Prior to mutable data retreival:", assetHeap);
      iteration = 0;
    }
    if (!assetsWithMutableData) assetsWithMutableData = [];
    if (iteration >= assetHeap.length) {
      /* console.log("EXIT"); */ return getEngravings(
      assetsWithMutableData,
      _prufClient
    );
    }

    let _arweave = window.arweave;

    let obj = assetHeap[iteration];
    let storageProvider = obj.nodeData.storageProvider;
    let mutableDataQuery;

    if (
      obj.mutableDataA ===
      "0x0000000000000000000000000000000000000000000000000000000000000000"
      || obj.nodeData.root === obj.nodeId
    ) {
      obj.mutableData = "";
      assetsWithMutableData.push(obj);
      //console.log("EXIT")
      return getMutableData(
        assetHeap,
        _prufClient,
        assetsWithMutableData,
        iteration + 1
      );
    } else if (storageProvider === "1") {
      _prufClient.utils.ipfsFromB32(obj.mutableDataA).then(async (e) => {
        console.log("MDQ", e);

        if (cookies[window.web3.utils.soliditySha3(e)]) {
          console.log("Using cached mutable data:", cookies[e]);
          obj.mutableData = cookies[window.web3.utils.soliditySha3(e)];
          assetsWithMutableData.push(obj);
          console.log("EXIT");
          return getMutableData(
            assetHeap,
            _prufClient,
            assetsWithMutableData,
            iteration + 1
          );
        } else {
          for await (const chunk of window.ipfs.cat(e)) {
            let str = new TextDecoder("utf-8").decode(chunk);
            console.log(str);
            try {
              obj.mutableData = JSON.parse(str);
            } catch {
              obj.mutableData = str;
            }
            assetsWithMutableData.push(obj);
            setCookieTo(window.web3.utils.soliditySha3(e), JSON.parse(str));
            //console.log("EXIT")
            return getMutableData(
              assetHeap,
              _prufClient,
              assetsWithMutableData,
              iteration + 1
            );
          }
        }
      });
    } else if (storageProvider === "2") {
      console.log(obj.mutableDataA, obj.mutableDataB);
      mutableDataQuery = window.web3.utils.hexToUtf8(
        obj.mutableDataA +
        obj.mutableDataB.substring(
          2,
          24
        )
      );
      console.log(`Mutable query at pos ${iteration}: ${mutableDataQuery}`);
      //engravingQuery =  await window.web3.utils.hexToUtf8(`${obj.engravingA}${obj.engravingB.substring(2, obj.engraving.indexOf("0000000000"))}`)
      if (cookies[window.web3.utils.soliditySha3(mutableDataQuery)]) {
        //console.log("Using cached mutable data:", cookies[mutableDataQuery])
        obj.mutableData =
          cookies[window.web3.utils.soliditySha3(mutableDataQuery)];
        assetsWithMutableData.push(obj);
        //console.log("EXIT")
        return getMutableData(
          assetHeap,
          _prufClient,
          assetsWithMutableData,
          iteration + 1
        );
      } else {
        let xhr = new XMLHttpRequest();

        xhr.onload = () => {
          if (xhr.status !== 404) {
            try {
              _arweave.transactions.get(mutableDataQuery).then((e) => {
                let tempObj = {};
                e.get("tags").forEach((tag) => {
                  let key = tag.get("name", { decode: true, string: true });
                  let value = tag.get("value", { decode: true, string: true });
                  tempObj[key] = value;
                  //console.log(`${key} : ${value}`);
                });
                //tempObj.contentUrl = `https://arweave.net/${mutableDataQuery}`
                tempObj.contentUrl = `http://localhost:1984/${mutableDataQuery}`;
                obj.mutableData = tempObj;
                assetsWithMutableData.push(obj);
                setCookieTo(
                  window.web3.utils.soliditySha3(mutableDataQuery),
                  tempObj
                );
                //console.log("EXIT")
                return getMutableData(
                  assetHeap,
                  _prufClient,
                  assetsWithMutableData,
                  iteration + 1
                );
              });
            } catch {
              obj.mutableData = "";
              assetsWithMutableData.push(obj);
              return getMutableData(
                assetHeap,
                _prufClient,
                assetsWithMutableData,
                iteration + 1
              );
            }
          } else {
            console.log("Id returned 404");
            obj.mutableData = "";
            assetsWithMutableData.push(obj);
            return getMutableData(
              assetHeap,
              _prufClient,
              assetsWithMutableData,
              iteration + 1
            );
          }
        };

        xhr.onerror = () => {
          console.log("Id returned 404");
          obj.contentUrl = `http://localhost:1984/${mutableDataQuery}`;
          obj.mutableData = "";
          assetsWithMutableData.push(obj);
          return getMutableData(
            assetHeap,
            _prufClient,
            assetsWithMutableData,
            iteration + 1
          );
        };

        xhr.open("GET", `http://localhost:1984/tx/${mutableDataQuery}`, true);
        xhr.send(null);

        try {
          xhr.send(null);
        } catch {
          console.log("Id returned 404");
          obj.contentUrl = `http://localhost:1984/${mutableDataQuery}`;
          obj.mutableData = "";
          assetsWithMutableData.push(obj);
          return getMutableData(
            assetHeap,
            _prufClient,
            assetsWithMutableData,
            iteration + 1
          );
        }
      }
    }
  };

  const getEngravings = (
    assetHeap,
    _prufClient,
    assetsWithEngravings,
    iteration
  ) => {
    if (!assetHeap) return console.log("Failed upon reception of:", assetHeap);
    if (!iteration) {
      console.log("Assets Prior to engraving retreival:", assetHeap);
      iteration = 0;
    }
    if (!assetsWithEngravings) assetsWithEngravings = [];
    if (iteration >= assetHeap.length) {
      /* console.log("EXIT"); */ return finalizeAssets(assetsWithEngravings);
    }

    let _arweave = window.arweave;

    let obj = assetHeap[iteration];
    let storageProvider = obj.nodeData.storageProvider;
    let engravingQuery;

    if (
      obj.engravingA ===
      "0x0000000000000000000000000000000000000000000000000000000000000000"
      || obj.nodeData.root === obj.nodeId
    ) {
      obj.engraving = "";
      assetsWithEngravings.push(obj);
      //console.log("EXIT")
      return getEngravings(
        assetHeap,
        _prufClient,
        assetsWithEngravings,
        iteration + 1
      );
    } else if (storageProvider === "1") {
      _prufClient.utils.ipfsFromB32(obj.engravingA).then(async (e) => {
        engravingQuery = e;
        console.log(`Engraving query at pos ${iteration}: ${engravingQuery}`);

        if (cookies[window.web3.utils.soliditySha3(engravingQuery)]) {
          //console.log("Using cached engraving:", cookies[engravingQuery])
          obj.engraving =
            cookies[window.web3.utils.soliditySha3(engravingQuery)];
          //console.log("EXIT")
          assetsWithEngravings.push(obj);
          return getEngravings(
            assetHeap,
            _prufClient,
            assetsWithEngravings,
            iteration + 1
          );
        } else {
          for await (const chunk of window.ipfs.cat(engravingQuery)) {
            let str = new TextDecoder("utf-8").decode(chunk);
            console.log(str);
            try {
              obj.engraving = JSON.parse(str);
            } catch {
              obj.engraving = str;
            }

            assetsWithEngravings.push(obj);
            setCookieTo(
              window.web3.utils.soliditySha3(engravingQuery),
              JSON.parse(str)
            );
            //console.log("EXIT")
            return getEngravings(
              assetHeap,
              _prufClient,
              assetsWithEngravings,
              iteration + 1
            );
          }
        }
      });
    } else if (storageProvider === "2") {
      engravingQuery = window.web3.utils.hexToUtf8(
        obj.engravingA +
        obj.engravingB.substring(
          2,
          24
        )
      );
      //console.log(`Engraving query at pos ${iteration}: ${engravingQuery}`)
      if (cookies[window.web3.utils.soliditySha3(engravingQuery)]) {
        //console.log("Using cached engraving:", cookies[engravingQuery])
        obj.engraving = cookies[window.web3.utils.soliditySha3(engravingQuery)];
        //console.log("EXIT")
        assetsWithEngravings.push(obj);
        return getEngravings(
          assetHeap,
          _prufClient,
          assetsWithEngravings,
          iteration + 1
        );
      } else {
        let xhr = new XMLHttpRequest();

        xhr.onload = () => {
          if (xhr.status !== 404) {
            try {
              _arweave.transactions.get(engravingQuery).then((e) => {
                if (!e) throw "Thrown";
                let tempObj = {};
                e.get("tags").forEach((tag) => {
                  let key = tag.get("name", { decode: true, string: true });
                  let value = tag.get("value", { decode: true, string: true });
                  tempObj[key] = value;
                  //console.log(`${key} : ${value}`);
                });
                //tempObj.contentUrl = `https://arweave.net/${engravingQuery}`
                tempObj.contentUrl = `http://localhost:1984/${engravingQuery}`;
                obj.engraving = tempObj;
                assetsWithEngravings.push(obj);
                setCookieTo(
                  window.web3.utils.soliditySha3(engravingQuery),
                  tempObj
                );
                //console.log("EXIT")
                return getEngravings(
                  assetHeap,
                  _prufClient,
                  assetsWithEngravings,
                  iteration + 1
                );
              });
            } catch {
              console.log("In arweave catch clause");
              obj.engraving = "";
              assetsWithEngravings.push(obj);
              return getEngravings(
                assetHeap,
                _prufClient,
                assetsWithEngravings,
                iteration + 1
              );
            }
          } else {
            console.log("Id returned 404");
            obj.engraving = "";
            obj.contentUrl = `http://localhost:1984/${engravingQuery}`;
            assetsWithEngravings.push(obj);
            return getEngravings(
              assetHeap,
              _prufClient,
              assetsWithEngravings,
              iteration + 1
            );
          }
        };

        xhr.onerror = () => {
          console.log("Gateway returned 404");
          obj.engraving = "";
          obj.contentUrl = `http://localhost:1984/${engravingQuery}`;
          assetsWithEngravings.push(obj);
          return getEngravings(
            assetHeap,
            _prufClient,
            assetsWithEngravings,
            iteration + 1
          );
        };

        xhr.open("GET", `http://localhost:1984/tx/${engravingQuery}`, true);
        try {
          xhr.send(null);
        } catch {
          console.log("Gateway returned 404");
          obj.engraving = "";
          obj.contentUrl = `http://localhost:1984/${engravingQuery}`;
          assetsWithEngravings.push(obj);
          return getEngravings(
            assetHeap,
            _prufClient,
            assetsWithEngravings,
            iteration + 1
          );
        }
      }
    }
  };

  const finalizeAssets = (assetHeap, finalizedAssets, iteration) => {
    if (!assetHeap) return console.log("Failed upon reception of:", assetHeap);
    if (!finalizedAssets) finalizedAssets = [];
    if (!iteration) {
      console.log("Assets Prior to final sorting:", assetHeap);
      iteration = 0;
    }
    if (iteration >= assetHeap.length) {
      setReserveAD(assetHeap);
      //document.body.style.cursor = 'auto'
      console.log("Finalized assets: ", finalizedAssets);
      return setAssetArr(finalizedAssets);
    }

    let obj = assetHeap[iteration];

    obj.photo = obj.engraving.photo || obj.mutableData.photo || {};
    obj.text = obj.engraving.text || obj.mutableData.text || {};
    obj.urls = obj.engraving.urls || obj.mutableData.urls || {};
    obj.name = obj.engraving.name || obj.mutableData.name || "Name Unavailable";
    obj.photoUrls = obj.engraving.photo || obj.mutableData.photo || {};
    obj.Description =
      obj.engraving.Description || obj.mutableData.Description || "";
    obj.ContentUrl =
      obj.engraving.contentUrl || obj.mutableData.contentUrl || "";

    let vals = Object.values(obj.photo),
      keys = Object.keys(obj.photo);

    if (obj.nodeData.storageProvider === "2") {
      if (
        obj.engraving.contentUrl &&
        obj.engraving["Content-Type"].includes("image")
      ) {
        obj.DisplayImage = obj.engraving.contentUrl;
        finalizedAssets.push(obj);
        finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
      } else if (
        obj.mutableData.contentUrl &&
        obj.mutableData["Content-Type"].includes("image")
      ) {
        obj.DisplayImage = obj.mutableData.contentUrl;
        finalizedAssets.push(obj);
        finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
      } else if (keys.length === 0) {
        obj.DisplayImage = "";
        finalizedAssets.push(obj);
        finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
      }
    } else if (obj.nodeData.storageProvider === "1") {
      const getAndSet = (url) => {
        const req = new XMLHttpRequest();
        req.responseType = "text";

        req.onload = function () {
          //console.log("response", this.response);
          if (this.response.includes("base64")) {
            obj.DisplayImage = this.response;
            finalizedAssets.push(obj);
            finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
          }
        };

        req.onerror = function (e) {
          //console.log("http request error")
          obj.DisplayImage = "";
          finalizedAssets.push(obj);
          finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
        };
        req.open("GET", url, true);
        try {
          req.send();
        } catch {
          obj.DisplayImage = "";
          finalizedAssets.push(obj);
          finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
        }
      };

      if (
        obj.engraving !== "" &&
        obj.engraving.DisplayImage !== "" &&
        obj.engraving.DisplayImage !== undefined
      ) {
        getAndSet(obj.engraving.DisplayImage);
      } else if (
        obj.mutableData !== "" &&
        obj.mutableData.DisplayImage !== "" &&
        obj.mutableData.DisplayImage !== undefined
      ) {
        getAndSet(obj.mutableData.DisplayImage);
      }
    } else if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        const get = () => {
          if (vals[i].includes("data") && vals[i].includes("base64")) {
            obj.photo[keys[i]] = vals[i];
            if (keys[i] === "DisplayImage") {
              obj.DisplayImage = obj.photo[keys[i]];
            } else if (i === keys.length - 1) {
              //console.log("Setting Display Image")
              obj.DisplayImage = obj.photo[keys[0]];
            }
            forceUpdate();
            finalizedAssets.push(obj);
            finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
          } else if (!vals[i].includes("ipfs") && vals[i].includes("http")) {
            obj.photo[keys[i]] = vals[i];
            if (keys[i] === "DisplayImage") {
              //console.log("Setting Display Image")
              obj.DisplayImage = obj.photo[keys[i]];
            } else if (i === keys.length - 1) {
              //console.log("Setting Display Image")
              obj.DisplayImage = obj.photo[keys[0]];
            }
            forceUpdate();
            finalizedAssets.push(obj);
            finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
          } else {
            const req = new XMLHttpRequest();
            req.responseType = "text";

            req.onload = function (e) {
              //console.log("in onload")
              if (this.response.includes("base64")) {
                obj.photo[keys[i]] = this.response;
                if (keys[i] === "DisplayImage") {
                  //console.log("Setting Display Image")
                  obj.DisplayImage = obj.photo[keys[i]];
                } else if (i === keys.length - 1) {
                  //console.log("Setting Display Image")
                  obj.DisplayImage = obj.photo[keys[0]];
                }
                forceUpdate();
                finalizedAssets.push(obj);
                finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
              }
            };

            req.onerror = function (e) {
              //console.log("http request error")
              if (vals[i].includes("http")) {
                obj.photo[keys[i]] = vals[i];
                if (keys[i] === "DisplayImage") {
                  //console.log("Setting Display Image")
                  obj.DisplayImage = obj.photo[keys[i]];
                } else if (i === keys.length - 1) {
                  //console.log("Setting Display Image")
                  obj.DisplayImage = obj.photo[keys[0]];
                }
                forceUpdate();
                finalizedAssets.push(obj);
                finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
              }
            };
            req.open("GET", vals[i], true);
            req.send();
          }
        };
        get();
      }
    } else {
      obj.DisplayImage = "";
      finalizedAssets.push(obj);
      finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
    }
  };

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
