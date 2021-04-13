import React from "react";
import cx from "classnames";
import Jdenticon from 'react-jdenticon';
import swal from 'sweetalert';
import Web3 from "web3";
import Arweave from "arweave"
import TestWeave from 'testweave-sdk';
import arconf from "../Resources/arconf";

import PRUF from "pruf-js";
import { isMobile } from "react-device-detect";
//import OrbitDB from 'orbit-db';
import resolveContracts from "../Resources/Contracts";
import buildWindowUtils from "../Resources/WindowUtils";
import { Switch, Route, Redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';

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
import { AirlineSeatLegroomExtraSharp, IndeterminateCheckBox } from "@material-ui/icons";

var ps;

const useStyles = makeStyles(styles);


export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions

  const IPFS = require('ipfs-http-client') //require("ipfs-mini")
  //const OrbitDB = require('orbit-db')

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [miniActive, setMiniActive] = React.useState(true);
  const [image, setImage] = React.useState(require("assets/img/Sidebar Backgrounds/TracesWB.jpg"));
  const [color, setColor] = React.useState("blue");
  const [bgColor, setBgColor] = React.useState("darkBlue");
  const [isKovan, setIsKovan] = React.useState(true);
  const [ETHBalance, setETHBalance] = React.useState("~");
  const [addr, setAddr] = React.useState("");
  const [isAssetHolder, setIsAssetHolder] = React.useState(false);
  const [isAssetClassHolder, setIsAssetClassHolder] = React.useState(false);
  const [simpleAssetView, setSimpleAssetView] = React.useState(false);
  const [isIDHolder, setIsIDHolder] = React.useState();
  const [sidebarRoutes, setSidebarRoutes] = React.useState([routes[0], routes[2], routes[1], routes[3]]);
  const [sps, setSps] = React.useState(undefined)
  const [assetIds, setAssetIds] = React.useState([])

  const [prufBalance, setPrufBalance] = React.useState("~");
  const [prufClient, setPrufClient] = React.useState()
  const [roots, setRoots] = React.useState(undefined);
  const [rootNames, setRootNames] = React.useState(undefined);
  const [assetClassSets, setAssetClassSets] = React.useState(undefined);
  const [currentACIndex, setCurrentACIndex] = React.useState("~");
  const [currentACPrice, setCurrentACPrice] = React.useState("~");
  const [assetBalance, setAssetBalance] = React.useState("~");
  const [assetClassBalance, setAssetClassBalance] = React.useState("~");
  const [IDBalance, setIDBalance] = React.useState("0");
  const [cookies, setCookie, removeCookie] = useCookies(['nodeList'])
  const [hasFetchedBalances, setHasFetchedBalances] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [WD, setWD] = React.useState(false);
  const [assets, setAssets] = React.useState({})
  const [nodeList, setNodeList] = React.useState(null)
  const [reserveAD, setReserveAD] = React.useState({})
  const [assetArr, setAssetArr] = React.useState([])
  const [winKey, setWinKey] = React.useState(String(Math.round(Math.random() * 100000)))
  const [arweaveClient, setArweaveClient] = React.useState();
  const [testWeave, setTestWeave] = React.useState()
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const [acArr, setAcArr] = React.useState([1, 2, 3, 4, 5, 6, 7, 1000002, 1000001]);

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
        navigator.platform.indexOf("Win") > -1
    });

  // ref for main panel div
  const mainPanel = React.createRef();

  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  //console.log("pre-load href", window.location.href)
  const initArweave = async () => {
    const _arweave = Arweave
    const arweave = _arweave.init(arconf);

    setArweaveClient(arweave)

    console.log(arweave)

    const testWeave = await TestWeave.init(arweave);

    setTestWeave(testWeave)

    console.log(testWeave)

    window.arweave = arweave;

    return { testWeave: testWeave, arweave: arweave }
  }

  const handleNoEthereum = () => {
    console.log("No ethereum object available");
    let web3;
    web3 = require("web3");
    web3 = new Web3("https://kovan.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959");
    const _prufClient = new PRUF(web3)
    console.log(_prufClient)
    setPrufClient(_prufClient)
    setUpContractEnvironment(_prufClient, web3).then(() => {
    });

    window.web3 = web3;
    window.isKovan = true;
    return setIsMounted(true);
  }

  const checkForCookies = () => {
    //removeCookie("[object Promise]")
    //let date = new Date()
    //console.log(Date())
    //console.log(new Date().addDays(15))

    if (!cookies.hasBeenNotified) {
      swal({
        title: "Cookies on app.pruf.io",
        text: "This site uses minimal cookies to offer you optimal performance and loading times.",
        icon: "warning",
        buttons: {
          moreInfo: {
            text: "Learn more",
            value: "moreInfo",
            className: "moreCookieInfo"
          },
          decline: {
            text: "Decline Cookie Use",
            value: "decline",
            className: "declineCookies"
          },
          accept: {
            text: "Accept and continue",
            value: "accept",
            className: "acceptCookies"
          }
        },
      }).then((value) => {
        switch (value) {
          case "accept":
            setCookieTo("hasBeenNotified", true)
            break;

          case "moreInfo":
            swal({
              title: "Cookies on app.pruf.io",
              text: "Placeholder",
              buttons: {
                decline: {
                  text: "Decline Cookie Use",
                  value: "decline",
                  className: "declineCookies"
                },
                accept: {
                  text: "Accept and continue",
                  value: "accept",
                  className: "acceptCookies"
                }
              },
            }).then((value) => {
              switch (value) {
                case "accept":
                  setCookieTo("hasBeenNotified", true)
                  break;

                case "decline":
                  setCookieTo("hasBeenNotified", false)
                  break;

                default:
                  break;
              }
            });
            break;

          case "decline":
            setCookieTo("hasBeenNotified", false)
            break;

          default:
            break;
        }
      });
    }
    console.log("Cookies:", cookies)
    readCookie('nodeList').then((e) => {
      if (e) setNodeList(e)
      console.log("Found nodeList: ", e)
    })

  }

  const setCookieTo = (job, val) => {
    //if(!cookies[job]) return console.log("Referenced nonexistant cookie")
    console.log("Setting cookie", job, "to", val)
    setCookie(job, JSON.stringify(val), { path: "/", expires: new Date().addDays(15) })
  }

  const readCookie = async (job) => {
    if (!cookies[job]) return console.log("Referenced nonexistant cookie")
    return cookies[job];
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
      const _prufClient = new PRUF(web3)
      console.log(_prufClient)
      setPrufClient(_prufClient)
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
              window.addr = window.web3.utils.toChecksumAddress(accounts[0])
              setUpContractEnvironment(_prufClient, web3, window.web3.utils.toChecksumAddress(accounts[0]));
              setIsMounted(true);
            }

            else {
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
        }
        else {
          window.isKovan = false;
          setIsKovan(false);
          return swal({
            title: "Connect to the Kovan Testnet!",
            text: "Please connect your ethereum provider to the Kovan Testnet and reload the page to access page functionality.",
            icon: "warning",
            button: "Okay",
          })
        }
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

  const acctListener = () => {
    window.ethereum.on("accountsChanged", (e) => {
      console.log("Accounts changed");
      if (e[0] === undefined || e[0] === null) {
        if (e[0] !== window.addr) {
          window.location.reload()
        }
      }
      else if (e[0] !== window.addr) {
        window.location.reload()
      }
    });
  }

  window.onload = () => {
    //console.log("page loaded", window.location.href)
    window.balances = {};
    window.replaceAssetData = {};
    let timeOutCounter = 0;
    window.recount = false;
    let _ipfs;

    _ipfs = new IPFS(new URL("https://ipfs.infura.io:5001"))

    let hrefStr = String(window.location.href.substring(window.location.href.indexOf('/#/'), window.location.href.length))
    //console.log(hrefStr.includes("0x") && hrefStr.substring(hrefStr.indexOf('0x'), hrefStr.length).length === 66)
    if (hrefStr.includes("0x") && hrefStr.substring(hrefStr.indexOf('0x'), hrefStr.length).length === 66) {
      if (!window.location.href.includes("/#/user/search")) {
        window.idxQuery = hrefStr.substring(hrefStr.indexOf('0x'), hrefStr.indexOf('0x') + 66)
        console.log("query detected for idx: ", hrefStr.substring(hrefStr.indexOf('0x'), hrefStr.indexOf('0x') + 66));
        window.location.href = String("/#/user/search/" + hrefStr.substring(hrefStr.indexOf('0x'), hrefStr.length))
      }
    }

    else if (hrefStr !== "/#/user/dashboard" && hrefStr !== "/#/user/home" && hrefStr !== "/#/user/search" && hrefStr !== "/#/user/new-asset" && hrefStr !== "/#/user/node-manager") {
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

    /* _ipfs = new IPFS({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
    }); */

    //window.ipfs = _ipfs;
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

    //initOrbitDB()

  }

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

    if (cookies) checkForCookies()

    if (!isMobile) setSidebarRoutes([routes[0], routes[2], routes[1], routes[3], routes[4]]);
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
      if (!window.replaceAssetData || Object.values(window.replaceAssetData).length === 0) {
        window.replaceAssetData = {};
      }
      if (window.replaceAssetData.refreshBals) {
        console.log("Resetting token value")
        setupTokenVals(false, "refresh", addr, prufClient)
        window.replaceAssetData = {};
        forceUpdate()
      }

      else if (window.replaceAssetData.key !== thousandHashesOf(addr, winKey)) {
        window.replaceAssetData = {};
        console.log("Invalid key passed. Aborted call to replace.")
      }

      else if (window.replaceAssetData.nodeList) {
        //console.log("Setting nodeList"); 
        setNodeList(window.replaceAssetData.nodeList)
        setCookieTo('nodeList', window.replaceAssetData.nodeList)
        window.replaceAssetData = {};
      }

      else {
        setWinKey(String(Math.round(Math.random() * 100000)));
        console.log("Object is defined. index: ", window.replaceAssetData.dBIndex, " new asset: ", window.replaceAssetData.newAsset)
        let newAsset = window.replaceAssetData.newAsset;
        let dBIndex = window.replaceAssetData.dBIndex;
        let tempArr = JSON.parse(JSON.stringify(assetArr));
        let idArr = JSON.parse(JSON.stringify(assetIds));
        // if (!assetArr || assetArr.length < 1) {
        //   tempArr = [];
        // }

        // else {
        //   tempArr = JSON.parse(JSON.stringify(assetArr))
        // }

        if (newAsset && dBIndex > -1) {
          newAsset.id = newAsset.idxHash;
          idArr.push(newAsset.id);
          //newAsset.lastRef = "/#/user/dashboard"
          newAsset.identicon = <Jdenticon vlaue={newAsset.id} />
          console.log("Replacing asset at index: ", dBIndex)
          console.log("Old Assets", tempArr)
          tempArr.splice(dBIndex, 1, newAsset)
          console.log("New Assets", tempArr)
          setAssetArr(tempArr)
          setAssetIds(idArr)
          window.replaceAssetData = {}
          getAssetIds(addr, prufClient, idArr.length, idArr)
        }

        else if (dBIndex > -1 && !newAsset) {
          console.log("Deleting asset at index: ", dBIndex);
          console.log("Old Assets", tempArr);
          tempArr.splice(dBIndex, 1);
          idArr.splice(dBIndex, 1);
          console.log("New Assets", tempArr);
          setAssetArr(tempArr);
          getAssetIds(addr, prufClient, idArr.length, idArr);
          window.replaceAssetData = {}
        }

        else if (newAsset && !dBIndex) {
          newAsset.id = newAsset.idxHash;
          idArr.push(newAsset.id);
          //newAsset.lastRef = "/#/user/dashboard";
          newAsset.identicon = <Jdenticon vlaue={newAsset.id} />
          console.log("Adding asset: ", newAsset);
          console.log("Old Assets", tempArr);
          tempArr.push(newAsset)
          console.log("New Assets", tempArr);
          setAssetArr(tempArr)
          window.replaceAssetData = {}
          getAssetIds(addr, prufClient, idArr.length, idArr)
        }
        forceUpdate()
      }
    }
  }, [window.replaceAssetData]);

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
            render={() => (
              <prop.component
                roots={roots}
                rootNames={rootNames}
                assetClassSets={assetClassSets}
                ps={sps}
                isMounted={isMounted}
                addr={addr}
                assetObj={assets}
                assetArr={assetArr}
                pruf={prufBalance}
                ether={ETHBalance}
                assets={assetBalance}
                nodes={assetClassBalance}
                currentACPrice={currentACPrice}
                IDHolder={isIDHolder}
                simpleAssetView={simpleAssetView}
                winKey={winKey}
                nodeList={nodeList}
                prufClient={prufClient}
                arweaveClient={arweaveClient}
                testWeave={testWeave}
              />)}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const initOrbitDB = async () => {
    //const orbitdb = await OrbitDB.createInstance(window.ipfs)
    //const db = await orbitdb.log('hello');

    //console.log(db)

    //window.orbitDB = orbitdb;
  }

  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  };

  const setUpContractEnvironment = async (_prufClient, _web3, _addr) => {
    if (window.isKovan === false) { return }
    //console.log("IN SUCE, addr:", _addr)
    if (window.isSettingUpContracts) { return (console.log("Already in the middle of setUp...")) }
    window.isSettingUpContracts = true;
    initArweave()

    /* const Arweave = require('arweave');

    Arweave.init({
      host: 'arweave.net',// Hostname or IP address for a Arweave host
      port: 443,          // Port
      protocol: 'https',  // Network protocol http or https
      timeout: 20000,     // Network request timeouts in milliseconds
      logging: false,     // Enable network request logging
    }).then(e=>setArweaveClient(e)) */

    if (window.ethereum) {

      await resolveContracts(_web3).then(() => {
        window.isSettingUpContracts = false;
        setWD(true)
        if (_addr) {
          setupTokenVals(true, "SetupContractEnvironment", _addr, _prufClient)
          buildNodeHeap()
        }
        if (window.idxQuery) { window.location.href = '/#/user/search/' + window.idxQuery }
      })

    }

    else {
      window.isSettingUpContracts = true;
      await resolveContracts(_web3).then(() => {
        window.isSettingUpContracts = false;
        setWD(true)
      })
    }

  };

  const buildNodeHeap = (iteration, arr, rootsDone, acsDone) => {
    if (!window.contracts) return
    //const acBegin = 1000000
    //const rootBegin = 1
    if (!rootsDone && !acsDone) rootsDone = false; acsDone = false;
    if (!iteration) iteration = 1;
    if (!arr) arr = [];
    if (rootsDone === true && acsDone === true) { setAcArr(arr); getACsFromDB(arr); }
    let noMore = false;

    if (rootsDone !== true) {
      //console.log("trying ", iteration);
      window.contracts.AC_TKN.methods.tokenExists(String(iteration))
        .call((_error, _result) => {
          if (_error) { console.log("Error: ", _error); iteration++; return buildNodeHeap(iteration, arr, false, false); }

          else {

            if (_result === "170") {
              arr.push(iteration);
              //console.log("found ", iteration);
              iteration++;
              return buildNodeHeap(iteration, arr, false, false);
            }

            else {
              noMore = true;
              //console.log("There is no root ", iteration);
              iteration++;
              return buildNodeHeap(1000001, arr, true, false);
            }

          }

        });
    }

    else if (rootsDone === true && acsDone !== true) {
      //console.log("trying ", iteration);
      window.contracts.AC_TKN.methods.tokenExists(String(iteration))
        .call((_error, _result) => {
          if (_error) { console.log("Error: ", _error); iteration++; return buildNodeHeap(iteration, arr, true, false); }

          else {

            if (_result === "170") {
              arr.push(iteration)
              //console.log("found ", iteration);
              iteration++;
              return buildNodeHeap(iteration, arr, true, false);
            }

            else {
              noMore = true;
              //console.log("There is no ac ", iteration);
              iteration++;
              console.log("Found all nodes", arr);
              setAcArr(arr);
              return getACsFromDB(arr);
            }

          }
        });
    }

  }

  const getACsFromDB = async (acArray, iteration, _assetClassSets, rootArray, rootNameArray, allClasses, allClassNames) => {
    //console.log(acArray);
    if (!iteration) iteration = 0
    if (!rootArray) rootArray = [];
    if (!rootNameArray) rootNameArray = [];
    if (!allClasses) allClasses = [];
    if (!allClassNames) allClassNames = [];
    if (!_assetClassSets) _assetClassSets = {};

    if (iteration === acArray.length) return setUpACInformation({ sets: _assetClassSets, rArr: rootArray, rnArr: rootNameArray, allCArr: allClasses, allCNArr: allClassNames })

    await window.contracts.AC_MGR.methods
      .getAC_data(String(acArray[iteration]))
      .call((_error, _result) => {
        if (_error) { console.log("Error: ", _error); getACsFromDB(acArray, iteration + 1, _assetClassSets, rootArray, rootNameArray, allClasses, allClassNames) }

        else {
          let resArr = Object.values(_result)

          if (String(acArray[iteration]) === String(resArr[0])) {
            window.utils.resolveACFromID(String(acArray[iteration])).then((e) => {
              rootArray.push(acArray[iteration]);
              rootNameArray.push(e.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()));
              _assetClassSets[String(acArray[iteration])] = [];
              getACsFromDB(acArray, iteration + 1, _assetClassSets, rootArray, rootNameArray, allClasses, allClassNames)
            })
          }

          else {
            //console.log(acArray[i])
            window.utils.resolveACFromID(String(acArray[iteration])).then((e) => {
              allClasses.push(String(acArray[iteration]));
              allClassNames.push(e.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()));
              getACsFromDB(acArray, iteration + 1, _assetClassSets, rootArray, rootNameArray, allClasses, allClassNames)
            })
          }

        }

      });

    //return { sets: _assetClassSets, rArr: rootArray, rnArr: rootNameArray, allCArr: allClasses, allCNArr: allClassNames }

  }

  const setUpACInformation = async (obj) => {

    let allClasses = obj.allCArr, rootArray = obj.rArr, _assetClassSets = obj.sets, rootNameArray = obj.rnArr, allClassNames = obj.allCNArr;

    //console.log(allClasses, allClassNames, rootArray)

    for (let i = 0; i < allClasses.length; i++) {
      await window.contracts.AC_MGR.methods
        .getAC_data(String(allClasses[i]))
        .call((_error, _result) => {
          if (_error) { console.log("Error: ", _error) }

          else {
            let resArr = Object.values(_result);
            for (let x = 0; x < rootArray.length; x++) {
              //console.log(resArr[0], rootArray[x])
              if (String(rootArray[x]) === String(resArr[0])) {
                _assetClassSets[String(rootArray[x])]
                  .push({ id: allClasses[i], name: allClassNames[i].toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) })
              }

            }
          }

        });
    }

    setTimeout(() => {
      console.log("Class Sets: ", _assetClassSets)
      setRoots(rootArray)
      setRootNames(rootNameArray)
      setAssetClassSets(_assetClassSets)
    }, 500)

  }

  const isGenericCall = async (e) => {
    //console.log("Checking call", e)
    let str;

    const genericCalls = [
      "CONTRACT_ADMIN_ROLE",
      "B320xF_",
      "ASSET_TXFR_ROLE",
      "NODE_MINTER_ROLE",
      "PAUSER_ROLE",
      "CONTRACT_ADMIN_ROLE",
      "acPrice_L1",
      "DEFAULT_ADMIN_ROLE",
      "acPrice_L2",
      "acPrice_L3",
      "acPrice_L4",
      "acPrice_L5",
      "acPrice_L6",
      "acPrice_L7",
      "grantRole",
      "hasRole",
      "unpause",
      "upperLimit",
      "OO_SetACpricing",
      "OO_SetACupgrade",
      "OO_resolveContractAddresses",
      "OO_setStorageContract",
      "OO_transferACToken",
      "MINTER_ROLE",
      "getRoleAdmin",
      "getApproved",
      "getRoleMember",
      "grantRole",
      "getRoleMemberCount",
      "name",
      "ownerOf",
      "isApprovedForAll",
      "pause",
      "paused",
      "revokeRole",
      "renounceRole",
      "safeTransferFrom",
      "supportsInterface",
      "symbol",
      "tokenByIndex",
      "tokenOfOwnerByIndex",
      "tokenURI",
      "totalSupply",
      "transferFrom",
      "AdminSetSharesAddress",
      "burnFrom",
      "cap",
      "decimals",
      "decreaseAllowance",
      "increaseAllowance",
      "mint",
      "payForService",
      "takeSnapshot",
      "totalSupply",
      "totalSupplyAt",
      "transfer",
      "trustedAgentBurn",
      "transferFrom",
      "trustedAgentTransfer",
      "unSetColdWallet",
      "balanceOf",
      "baseURI",
      "burn",
      "approve",
      "setApprovalForAll",
      "createAssetClass",
      "onERC721Received",
      "DISCARD_ROLE",
      "",
      ""
    ];

    if (e.includes("(")) {
      str = e.substring(0, e.indexOf("("))
    }

    else {
      str = e;
    }

    if (str.substring(0, 2) === "0x" || str.substring(0, 2) === "OO") {
      //console.log("Caught genCall:", str);
      return true
    }

    else if (genericCalls.includes(str)) {
      //console.log("Caught genCall:", str); 
      return true
    }

    else {
      return false
    }
  }

  const listAllMethods = () => {
    let allMethods = {};

    for (let i = 0; i < Object.values(window.contracts).length; i++) {
      let tempArr = [], badBatch = [];
      let contract = Object.values(window.contracts)[i];

      console.log(contract)

      for (let x = 0; x < Object.values(contract.methods).length; x++) {
        isGenericCall(Object.keys(contract.methods)[x]).then((e) => {
          if (e === false && Object.keys(contract.methods)[x].includes("(") && Object.keys(contract.methods)[x].includes(")")) {
            tempArr.push(Object.keys(contract.methods)[x])
            if (x === Object.values(contract.methods).length - 1) {
              console.log("Good", allMethods)
              console.log("Bad", badBatch)
            }
          }
          else {
            badBatch.push(Object.keys(contract.methods)[x])
            if (x === Object.values(contract.methods).length - 1) {
              console.log("Good", allMethods)
              console.log("Bad", badBatch)
            }
          }
        })
      }
      allMethods[Object.keys(window.contracts)[i]] = tempArr;
    }


  }

  const getAssetIds = (_addr, _prufClient, bal, ids, iteration) => {
    if (!bal) return
    if (Number(bal) === 0) return console.log("No assets held by user")
    if (!ids) ids = [];
    if (!iteration) iteration = 0;
    if (ids.length >= bal) { setAssetIds(ids); return buildAssetHeap(_addr, _prufClient, ids) }
    else {
      _prufClient.get.heldAssetAtIndex(_addr, iteration)
        .call((_error, _result) => {
          if (_error) {
            console.log("IN ERROR IN ERROR IN ERROR");
            return getAssetIds(_addr, _prufClient, bal, ids, iteration + 1)
          } else {
            let resStr;
            resStr = window.web3.utils.numberToHex(_result);
            while (resStr.length < 66) {
              resStr = resStr.substring(0, 2) + "0" + resStr.substring(2, resStr.length)
            }
            ids.push(resStr)
            getAssetIds(_addr, _prufClient, bal, ids, iteration + 1)
          }
        });
    }
  }

  const buildAssetHeap = (_addr, _prufClient, ids, data, iteration) => {
    //console.log(_prufClient.get, iteration)
    if (!ids) return
    if (!data) data = [];
    if (!iteration) { console.log("ids: ", ids); iteration = 0; }
    if (iteration >= ids.length) return getMutableData(data, _prufClient)

    else {
      _prufClient.get.assetRecord(ids[iteration])
        .call((_error, _result) => {
          if (_error) {
            console.log("IN ERROR IN ERROR IN ERROR")
            data.push({})
            return buildAssetHeap(_addr, _prufClient, ids, data, iteration + 1)
          } else {

            let obj = {
              id: ids[iteration],
              statusNum: _result["0"],
              forceModCount: _result["1"],
              assetClass: _result["2"],
              countPair: [_result["3"], _result["4"]],
              mutableDataA: _result["5"],
              mutableDataB: _result["6"],
              engravingA: _result["7"],
              engravingB: _result["8"],
              numberOfTransfers: _result["9"]
            }

            obj.identicon = <Jdenticon value={obj.id} />;
            obj.identiconLG = <Jdenticon value={obj.id} />;

            _prufClient.utils.stringifyStatus(_result[0]).then(e => {
              obj.status = e
            })

            _prufClient.get.assetPriceData(ids[iteration])
              .call((_error, _result) => {
                if (_error) {
                  console.log("IN ERROR IN ERROR IN ERROR")
                  data.push(obj)
                  return buildAssetHeap(_addr, _prufClient, ids, data, iteration + 1)
                } else {
                  obj.price = _result["0"]
                  obj.currency = _result["1"]
                  _prufClient.get.nodeData(obj.assetClass)
                    .call((_error, _result) => {
                      if (_error) {
                        console.log("IN ERROR IN ERROR IN ERROR")
                        data.push(obj)
                        return buildAssetHeap(_addr, _prufClient, ids, data, iteration + 1)
                      } else {
                        obj.assetClassName = _result.name
                        //console.log(_result)

                        obj.assetClassData = {
                          name: _result.name,
                          root: _result.root,
                          custodyType: _result.custodyType,
                          managementType: _result.managementType,
                          discount: _result.discount,
                          referenceAddress: _result.referenceAddress,
                          extData: _result["IPFS"],
                          storageProvider: _result.storageProvider,
                          switches: _result.switches
                        }
                        data.push(obj)
                        return buildAssetHeap(_addr, _prufClient, ids, data, iteration + 1)
                      }
                    })
                }
              })
          }
        })
    }
  }

  const getMutableData = (assetHeap, _prufClient, assetsWithMutableData, iteration) => {
    if (!assetHeap) return console.log("Failed upon reception of:", assetHeap)
    if (!iteration) { console.log("Assets Prior to mutable data retreival:", assetHeap); iteration = 0; }
    if (!assetsWithMutableData) assetsWithMutableData = [];
    if (iteration >= assetHeap.length) { /* console.log("EXIT"); */ return getEngravings(assetsWithMutableData, _prufClient) }

    let _arweave = window.arweave;

    let obj = assetHeap[iteration]
    let storageType = obj.assetClassData.storageProvider;
    let mutableDataQuery;

    if (obj.mutableDataA === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      obj.mutableData = ""
      assetsWithMutableData.push(obj)
      //console.log("EXIT")
      return getMutableData(assetHeap, _prufClient, assetsWithMutableData, iteration + 1)
    }

    else if (storageType === "1") {
      mutableDataQuery = _prufClient.utils.ipfsFromB32(obj.mutableDataA);
      //console.log(`Mutable query at pos ${iteration}: ${mutableDataQuery}`)
      //engravingQuery = await _prufClient.utils.ipfsFromB32(obj.engravingA);

      if (cookies[mutableDataQuery]) {
        //console.log("Using cached mutable data:", cookies[mutableDataQuery])
        obj.mutableData = cookies[mutableDataQuery]
        assetsWithMutableData.push(obj)
        //console.log("EXIT")
        return getMutableData(assetHeap, _prufClient, assetsWithMutableData, iteration + 1)
      }

      else {
        for (const chunk of window.ipfs.cat(mutableDataQuery)) {
          let str = new TextDecoder("utf-8").decode(chunk);
          console.log(str)
          try {
            obj.mutableData = JSON.parse(str)
          }
          catch {
            obj.mutableData = str;
          }

          assetsWithMutableData.push(obj)
          setCookieTo(mutableDataQuery, obj)
          //console.log("EXIT")
          return getMutableData(assetHeap, _prufClient, assetsWithMutableData, iteration + 1)
        }
      }
    }

    else if (storageType === "2") {
      console.log(obj.mutableDataA, obj.mutableDataB)
      mutableDataQuery = window.web3.utils.hexToUtf8(obj.mutableDataA + obj.mutableDataB.substring(2, obj.mutableDataB.indexOf("0000000000")))
      console.log(`Mutable query at pos ${iteration}: ${mutableDataQuery}`)
      //engravingQuery =  await window.web3.utils.hexToUtf8(`${obj.engravingA}${obj.engravingB.substring(2, obj.engraving.indexOf("0000000000"))}`)
      if (cookies[mutableDataQuery]) {
        //console.log("Using cached mutable data:", cookies[mutableDataQuery])
        obj.mutableData = cookies[mutableDataQuery]
        assetsWithMutableData.push(obj)
        //console.log("EXIT")
        return getMutableData(assetHeap, _prufClient, assetsWithMutableData, iteration + 1)
      }

      else {
        let xhr = new XMLHttpRequest();

        xhr.onload = () => {
        if(xhr.status !== 404){
        try {
          _arweave.transactions.get(mutableDataQuery).then(e => {
            let tempObj = {};
            e.get('tags').forEach(tag => {
              let key = tag.get('name', { decode: true, string: true });
              let value = tag.get('value', { decode: true, string: true });
              tempObj[key] = value;
              //console.log(`${key} : ${value}`);
            })
            //tempObj.contentUrl = `https://arweave.net/${mutableDataQuery}`
            tempObj.contentUrl = `http://localhost:1984/${mutableDataQuery}`
            obj.mutableData = tempObj;
            assetsWithMutableData.push(obj)
            setCookieTo(mutableDataQuery, tempObj)
            //console.log("EXIT")
            return getMutableData(assetHeap, _prufClient, assetsWithMutableData, iteration + 1)
          })
        }
        catch {
          obj.mutableData = "";
          assetsWithMutableData.push(obj)
          return getMutableData(assetHeap, _prufClient, assetsWithMutableData, iteration + 1)
        }
      }
      else{
        console.log("Id returned 404")
        obj.mutableData = "";
        assetsWithMutableData.push(obj);
        return getMutableData(assetHeap, _prufClient, assetsWithMutableData, iteration + 1)
      }
      }

        xhr.open('GET', `http://localhost:1984/tx/${mutableDataQuery}`, false); 
        xhr.send(null);
      }
    }
  };

  const getEngravings = (assetHeap, _prufClient, assetsWithEngravings, iteration) => {
    if (!assetHeap) return console.log("Failed upon reception of:", assetHeap)
    if (!iteration) { console.log("Assets Prior to engraving retreival:", assetHeap); iteration = 0; }
    if (!assetsWithEngravings) assetsWithEngravings = [];
    if (iteration >= assetHeap.length) { /* console.log("EXIT"); */ return finalizeAssets(assetsWithEngravings) }

    let _arweave = window.arweave;

    let obj = assetHeap[iteration]
    let storageType = obj.assetClassData.storageProvider;
    let engravingQuery;

    if (obj.engravingA === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      obj.engraving = ""
      assetsWithEngravings.push(obj)
      //console.log("EXIT")
      return getEngravings(assetHeap, _prufClient, assetsWithEngravings, iteration + 1)
    }

    else if (storageType === "1") {
      engravingQuery = _prufClient.utils.ipfsFromB32(obj.engravingA);
      console.log(`Engraving query at pos ${iteration}: ${engravingQuery}`)

      if (cookies[engravingQuery]) {
        //console.log("Using cached engraving:", cookies[engravingQuery])
        obj.engraving = cookies[engravingQuery]
        //console.log("EXIT")
        assetsWithEngravings.push(obj)
        return getEngravings(assetHeap, _prufClient, assetsWithEngravings, iteration + 1)
      }

      else {
        for (const chunk of window.ipfs.cat(engravingQuery)) {
          let str = new TextDecoder("utf-8").decode(chunk);
          console.log(str)
          try {
            obj.engraving = JSON.parse(str)
          }
          catch {
            obj.engraving = str;
          }

          assetsWithEngravings.push(obj)
          setCookieTo(engravingQuery, obj)
          //console.log("EXIT")
          return getEngravings(assetHeap, _prufClient, assetsWithEngravings, iteration + 1)
        }
      }
    }

    else if (storageType === "2") {
      engravingQuery = window.web3.utils.hexToUtf8(`${obj.engravingA}${obj.engravingB.substring(2, obj.engravingB.indexOf("0000000000"))}`)
      //console.log(`Engraving query at pos ${iteration}: ${engravingQuery}`)
      if (cookies[engravingQuery]) {
        //console.log("Using cached engraving:", cookies[engravingQuery])
        obj.engraving = cookies[engravingQuery]
        //console.log("EXIT")
        assetsWithEngravings.push(obj)
        return getEngravings(assetHeap, _prufClient, assetsWithEngravings, iteration + 1)
      }

      else {
        let xhr = new XMLHttpRequest();

        xhr.onload = () => {
        if(xhr.status !== 404){
        try {
          _arweave.transactions.get(engravingQuery).then(e => {
            if(!e) throw "Thrown";
            let tempObj = {};
            e.get('tags').forEach(tag => {
              let key = tag.get('name', { decode: true, string: true });
              let value = tag.get('value', { decode: true, string: true });
              tempObj[key] = value;
              //console.log(`${key} : ${value}`);
            })
            //tempObj.contentUrl = `https://arweave.net/${engravingQuery}`
            tempObj.contentUrl = `http://localhost:1984/${engravingQuery}`
            obj.engraving = tempObj;
            assetsWithEngravings.push(obj)
            setCookieTo(engravingQuery, tempObj)
            //console.log("EXIT")
            return getEngravings(assetHeap, _prufClient, assetsWithEngravings, iteration + 1)
          })
        }
        catch {
          console.log("In arweave catch clause")
          obj.engraving = "";
          assetsWithEngravings.push(obj);
          return getEngravings(assetHeap, _prufClient, assetsWithEngravings, iteration + 1)
        }
      }
      else{
        console.log("Id returned 404")
        obj.engraving = "";
        obj.contentUrl = `http://localhost:1984/${engravingQuery}`
        assetsWithEngravings.push(obj);
        return getEngravings(assetHeap, _prufClient, assetsWithEngravings, iteration + 1)
      }
      }

        xhr.open('GET', `http://localhost:1984/tx/${engravingQuery}`, false); 
        xhr.send(null);
      }
    }
  }

  const finalizeAssets = (assetHeap, finalizedAssets, iteration) => {
    if (!assetHeap) return console.log("Failed upon reception of:", assetHeap)
    if (!finalizedAssets) finalizedAssets = [];
    if (!iteration) { console.log("Assets Prior to final sorting:", assetHeap); iteration = 0; }
    if (iteration >= assetHeap.length) {
      setReserveAD(assetHeap);
      console.log("Finalized assets: ", finalizedAssets)
      return setAssetArr(finalizedAssets)
    }



    let obj = assetHeap[iteration]

    obj.photo = (obj.engraving.photo || obj.mutableData.photo || {});
    obj.text = (obj.engraving.text || obj.mutableData.text || {});
    obj.urls = (obj.engraving.urls || obj.mutableData.urls || {});
    obj.name = (obj.engraving.name || obj.mutableData.name || "Name Unavailable");
    obj.photoUrls = (obj.engraving.photo || obj.mutableData.photo || {});
    obj.Description = (obj.engraving.Description || obj.mutableData.Description || "");
    obj.ContentUrl = (obj.engraving.contentUrl || obj.mutableData.contentUrl || "");

    let vals = Object.values(obj.photo), keys = Object.keys(obj.photo);

    if (keys.length === 0) {

      if (obj.engraving.contentUrl && obj.engraving["Content-Type"].includes("image")) {
        obj.DisplayImage = obj.engraving.contentUrl
      }

      else if (obj.mutableData.contentUrl && obj.mutableData["Content-Type"].includes("image")) {
        obj.DisplayImage = obj.mutableData.contentUrl
      }

      else obj.DisplayImage = "";

      finalizedAssets.push(obj)
      finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
    }

    for (let i = 0; i < keys.length; i++) {
      const get = () => {
        if (vals[i].includes("data") && vals[i].includes("base64")) {
          obj.photo[keys[i]] = vals[i];
          if (keys[i] === "DisplayImage") {
            obj.DisplayImage = (obj.photo[keys[i]])
          }
          else if (i === keys.length - 1) {
            //console.log("Setting Display Image")
            obj.DisplayImage = (obj.photo[keys[0]])
          }
          forceUpdate();
          finalizedAssets.push(obj)
          finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
        }

        else if (!vals[i].includes("ipfs") && vals[i].includes("http")) {
          obj.photo[keys[i]] = vals[i];
          if (keys[i] === "DisplayImage") {
            //console.log("Setting Display Image")
            obj.DisplayImage = (obj.photo[keys[i]])
          }
          else if (i === keys.length - 1) {
            //console.log("Setting Display Image")
            obj.DisplayImage = (obj.photo[keys[0]])
          }
          forceUpdate();
          finalizedAssets.push(obj)
          finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
        }

        else {
          const req = new XMLHttpRequest();
          req.responseType = "text";

          req.onload = function (e) {
            //console.log("in onload")
            if (this.response.includes("base64")) {
              obj.photo[keys[i]] = this.response;
              if (keys[i] === "DisplayImage") {
                //console.log("Setting Display Image")
                obj.DisplayImage = (obj.photo[keys[i]])
              }
              else if (i === keys.length - 1) {
                //console.log("Setting Display Image")
                obj.DisplayImage = (obj.photo[keys[0]])
              }
              forceUpdate();
              finalizedAssets.push(obj)
              finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
            }
          }

          req.onerror = function (e) {
            //console.log("http request error")
            if (vals[i].includes("http")) {
              obj.photo[keys[i]] = vals[i];
              if (keys[i] === "DisplayImage") {
                //console.log("Setting Display Image")
                obj.DisplayImage = (obj.photo[keys[i]])
              }
              else if (i === keys.length - 1) {
                //console.log("Setting Display Image")
                obj.DisplayImage = (obj.photo[keys[0]])
              }
              forceUpdate();
              finalizedAssets.push(obj)
              finalizeAssets(assetHeap, finalizedAssets, iteration + 1);
            }
          }
          req.open('GET', vals[i], true);
          req.send();
        }
      }
      get()
    }
  }

  //Count up user tokens, takes  "willSetup" bool to determine whether to call setupAssets() after count
  const setupTokenVals = async (willSetup, who, _addr, pruf) => {
    if (!_addr) return swal("Unable to reach user's wallet.")
    console.log("STV: Setting up balances, called from ", who)

    await window.web3.eth.getBalance(_addr, (error, result) => {
      if (error) { } else {
        setETHBalance(window.web3.utils.fromWei(result, "ether"))
      }
    });

    await window.contracts.AC_TKN.methods.balanceOf(_addr).call((error, result) => {
      if (error) { console.log(error) }
      else {
        setAssetClassBalance(result);
        if (Number(result) > 0) {
          setIsAssetClassHolder(true)
        } else {
          setIsAssetClassHolder(false)
        }
      }
    });

    window.contracts.ID_TKN.methods.balanceOf(_addr).call((error, result) => {
      if (error) { console.log(error) }
      else {
        setIDBalance(result);
        if (Number(result) > 0 && Number(result) < 2) {
          setIsIDHolder(true)
        } else {
          setIsIDHolder(false)
        }
      }
    });

    await window.contracts.A_TKN.methods.balanceOf(_addr).call((error, result) => {
      if (error) { console.log(error) }
      else {
        setAssetBalance(result);
        if (Number(result) > 0) {
          setIsAssetHolder(true)
        } else {
          setIsAssetHolder(false)
        }
        if (willSetup) {
          forceUpdate();
          getAssetIds(_addr, pruf, result)
        }
      }
    })
    await window.contracts.UTIL_TKN.methods.balanceOf(_addr).call((error, result) => {
      if (error) { console.log(error) }
      else {
        setPrufBalance(window.web3.utils.fromWei(result, 'ether'));
      }
    });

    await window.contracts.AC_MGR.methods.currentACpricingInfo().call((error, result) => {
      if (error) {
        return (console.log("IN ERROR IN ERROR IN ERROR"))
      }
      else {
        setCurrentACIndex(window.web3.utils.fromWei(result["0"]))
        setCurrentACPrice(window.web3.utils.fromWei(result["1"]))
      }
    });

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
