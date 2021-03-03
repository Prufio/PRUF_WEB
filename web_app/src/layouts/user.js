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
import { AirlineSeatLegroomExtraSharp } from "@material-ui/icons";

var ps;

const useStyles = makeStyles(styles);


export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions

  // @dev use to determine recycle and import eligibility
  /* 
    await window.contracts.AC_MGR.methods
      .isSameRootAC(AC, temp)
      .call(function (_error, _result) {
        if (_error) {
          return (console.log("IN ERROR IN ERROR IN ERROR"))
        } else if (_result === "170") {
          tempBool = true
        } else {
          tempBool = false
        }
      });
  */

  const IPFS = require('ipfs-http-client') //require("ipfs-mini")
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [miniActive, setMiniActive] = React.useState(false);
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
  const [sidebarRoutes,] = React.useState([routes[0], routes[2], routes[1], routes[3], routes[4]]);
  const [sps, setSps] = React.useState(undefined)

  const [prufBalance, setPrufBalance] = React.useState("~");
  const [roots, setRoots] = React.useState(undefined);
  const [rootNames, setRootNames] = React.useState(undefined);
  const [assetClassSets, setAssetClassSets] = React.useState(undefined);
  const [currentACIndex, setCurrentACIndex] = React.useState("~");
  const [currentACPrice, setCurrentACPrice] = React.useState("~");
  const [assetBalance, setAssetBalance] = React.useState("~");
  const [assetClassBalance, setAssetClassBalance] = React.useState("~");
  const [IDBalance, setIDBalance] = React.useState("0");
  const [hasFetchedBalances, setHasFetchedBalances] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [WD, setWD] = React.useState(false);
  const [assets, setAssets] = React.useState({})
  const [reserveAD, setReserveAD] = React.useState({})
  const [assetArr, setAssetArr] = React.useState([])
  const [winKey, setWinKey] = React.useState(String(Math.round(Math.random() * 100000)))

  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const acArr = [1, 11, 12, 13, 2, 21, 22, 23, 3, 31, 32, 33, 4, 41, 42, 43, 5, 51, 52, 53, 6, 61, 62, 63];

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

  //console.log("pre-load href", window.location.href)

  const handleNoEthereum = () => {
    console.log("No ethereum object available");
    let web3;
    web3 = require("web3");
    web3 = new Web3("https://kovan.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959");
    setUpContractEnvironment(web3).then(() => {
    });
    window.web3 = web3;
    window.isKovan = true;
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
              window.addr = window.web3.utils.toChecksumAddress(accounts[0])
              setUpContractEnvironment(web3, window.web3.utils.toChecksumAddress(accounts[0]));
              setIsMounted(true);
            }

            else {
              ethereum.send('eth_requestAccounts').then((accounts) => {
                if (accounts[0] !== undefined) {
                  setAddr(window.web3.utils.toChecksumAddress(accounts[0]));
                  window.addr = window.web3.utils.toChecksumAddress(accounts[0])
                  setUpContractEnvironment(web3, window.web3.utils.toChecksumAddress(accounts[0]));
                  setIsMounted(true);
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
      if (window.replaceAssetData.ether || window.replaceAssetData.pruf || window.replaceAssetData.assets || window.replaceAssetData.IDHolder) {
        console.log("Resetting token value")
        if (window.replaceAssetData.ether) setETHBalance(window.replaceAssetData.ether);
        if (window.replaceAssetData.pruf) setPrufBalance(window.replaceAssetData.pruf);
        if (window.replaceAssetData.assets) setAssetBalance(window.replaceAssetData.assets);
        if (window.replaceAssetData.IDHolder) console.log("Setting IDHolder to true"); setIsIDHolder(true);
        window.replaceAssetData = {};
      }

      else if (window.replaceAssetData.key !== thousandHashesOf(addr, winKey)) {
        window.replaceAssetData = {};
        console.log("Invalid key passed. Aborted call to replace.")
      }

      else {
        setWinKey(String(Math.round(Math.random() * 100000)));
        console.log("Object is defined. index: ", window.replaceAssetData.dBIndex, " new asset: ", window.replaceAssetData.newAsset)
        let newAsset = window.replaceAssetData.newAsset;
        let dBIndex = window.replaceAssetData.dBIndex;
        let tempArr = JSON.parse(JSON.stringify(assetArr));
        // if (!assetArr || assetArr.length < 1) {
        //   tempArr = [];
        // }

        // else {
        //   tempArr = JSON.parse(JSON.stringify(assetArr))
        // }

        if (newAsset && dBIndex > -1) {
          newAsset.id = newAsset.idxHash;
          //newAsset.lastRef = "/#/user/dashboard"
          newAsset.identicon = <Jdenticon vlaue={newAsset.id} />
          console.log("Replacing asset at index: ", dBIndex)
          console.log("Old Assets", tempArr)
          tempArr.splice(dBIndex, 1, newAsset)
          console.log("New Assets", tempArr)
          setAssetArr(tempArr)
          window.replaceAssetData = {}
          reloadAssetAt(dBIndex, newAsset.idxHash)
        }

        else if (dBIndex > -1 && !newAsset) {
          console.log("Deleting asset at index: ", dBIndex)
          console.log("Old Assets", tempArr)
          tempArr.splice(dBIndex, 1)
          console.log("New Assets", tempArr)
          setAssetArr(tempArr)
          window.replaceAssetData = {}
        }

        else if (newAsset && !dBIndex) {
          newAsset.id = newAsset.idxHash;
          //newAsset.lastRef = "/#/user/dashboard";
          newAsset.identicon = <Jdenticon vlaue={newAsset.id} />
          console.log("Adding asset: ", newAsset);
          console.log("Old Assets", tempArr);
          tempArr.push(newAsset)
          console.log("New Assets", tempArr);
          setAssetArr(tempArr)
          window.replaceAssetData = {}
          reloadAssetAt(tempArr.length - 1, newAsset.idxHash);
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
                currentACPrice={currentACPrice}
                IDHolder={isIDHolder}
                simpleAssetView={simpleAssetView}
                winKey={winKey}
              />)}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const reloadAssetAt = async (index, id) => {
    if (!window.contracts || !window.web3) return

    console.log("reloading asset at index ", index)
    let ipfsHash;
    let tempResult;
    let fullUrl = "";
    let idxHash;
    if (id) {
      idxHash = id;
    } else {
      idxHash = JSON.parse(JSON.stringify(assetArr[index])).id;
    }
    console.log("Asset ID: ", idxHash)

    await window.contracts.STOR.methods
      .retrieveShortRecord(idxHash)
      .call(
        function (_error, _result) {
          if (_error) {
            console.log(_error);
          }
          else {
            console.log("Found asset!");
            tempResult = Object.values(_result);

            if (Object.values(_result)[5] > 0) { ipfsHash = window.utils.getIpfsHashFromBytes32(Object.values(_result)[5]); }
            console.log("ipfs data in promise", ipfsHash);

            if (Object.values(_result)[6] > 0); {
              let knownUrl = "https://ipfs.io/ipfs/";
              let hash = "";
              /* window.utils.getIpfsHashFromBytes32(Object.values(_result)[6]).then((e)=>{
                hash =String(e)
                fullUrl = knownUrl + hash;
              });   */
              fullUrl = "";
            }

            const finalize = (obj) => {
              let tempArr = JSON.parse(JSON.stringify(assetArr));
              obj.dBIndex = index;
              //obj.lastRef = "/#/user/dashboard";

              window.contracts.STOR.methods.getPriceData(idxHash)
                .call((_error, _result) => {
                  if (_error) {
                    obj.price = "0"
                    obj.currency = "0"
                    console.log("IN ERROR IN ERROR IN ERROR")
                    console.log("Old Assets", tempArr);
                    tempArr.splice(index, 1, obj);
                    console.log("New Assets", tempArr);
                    setAssetArr(tempArr);
                  } else {
                    obj.price = Object.values(_result)[0]
                    obj.currency = Object.values(_result)[1]
                    console.log("Old Assets", tempArr);
                    tempArr.splice(index, 1, obj);
                    console.log("New Assets", tempArr);
                    setAssetArr(tempArr);
                  }
                })
            }

            let newAsset = {}

            window.utils.getACName(tempResult[2]).then((e) => {
              newAsset = Object.assign(newAsset, {
                id: idxHash,
                idxHash: idxHash,
                statusNum: String(tempResult[0]),
                identicon: <Jdenticon value={idxHash} />,
                assetClass: tempResult[2],
                assetClassName: e,
                note: fullUrl,
                ipfs: ipfsHash,
                countPair: [tempResult[4], tempResult[3]]
              })

              window.utils.getStatusString(String(tempResult[0])).then(async (e) => {
                newAsset.status = e;

                let assetObj;
                for await (const chunk of window.ipfs.cat(ipfsHash)) {
                  let str = new TextDecoder("utf-8").decode(chunk);

                  if (!str) {
                    assetObj = { text: {}, photo: {}, urls: {}, name: "" }
                    newAsset.text = assetObj.text;
                    newAsset.Description = "";
                    newAsset.urls = assetObj.urls;
                    newAsset.name = assetObj.name;
                    newAsset.photo = assetObj.photo;
                    newAsset.DisplayImage = ""
                    finalize(newAsset)
                  }

                  else {
                    console.log("Got updated asset ipfs")
                    try {
                      assetObj = JSON.parse(str)
                    }
                    catch {
                      assetObj = { text: {}, photo: {}, urls: {}, name: "" }
                    }
                    newAsset.photoUrls = JSON.parse(JSON.stringify(assetObj)).photo;
                    let vals = Object.values(assetObj.photo), keys = Object.keys(assetObj.photo);

                    newAsset.text = assetObj.text;
                    newAsset.Description = assetObj.text.Description;
                    newAsset.urls = assetObj.urls;
                    newAsset.name = assetObj.name;

                    if (keys.length < 1) {
                      newAsset.photo = assetObj.photo;
                      newAsset.DisplayImage = ""
                      finalize(newAsset)
                    }
                    //console.log(chunk)
                    for (let i = 0; i < keys.length; i++) {
                      const get = () => {
                        if (vals[i].includes("data") && vals[i].includes("base64")) {
                          assetObj.photo[keys[i]] = vals[i];
                          //console.log(assetObj.photo[keys[i]]);
                          if (keys[i] === "DisplayImage") {
                            //console.log("Setting Display Image")
                            assetObj.DisplayImage = (assetObj.photo[keys[i]])
                          }
                          else if (i === keys.length - 1) {
                            //console.log("Setting Display Image")
                            assetObj.DisplayImage = (assetObj.photo[keys[0]])
                          }

                          if (i + 1 === keys.length) {
                            newAsset.photo = assetObj.photo;
                            newAsset.DisplayImage = assetObj.DisplayImage;
                            finalize(newAsset)
                          }

                          forceUpdate();
                        }

                        else if (!vals[i].includes("ipfs") && vals[i].includes("http")) {
                          assetObj.photo[keys[i]] = vals[i];
                          if (keys[i] === "DisplayImage") {
                            //console.log("Setting Display Image")
                            assetObj.DisplayImage = (assetObj.photo[keys[i]])
                          }
                          else if (i === keys.length - 1) {
                            //console.log("Setting Display Image")
                            assetObj.DisplayImage = (assetObj.photo[keys[0]])
                          }

                          if (i + 1 === keys.length) {
                            newAsset.photo = assetObj.photo;
                            newAsset.DisplayImage = assetObj.DisplayImage;
                            finalize(newAsset)
                          }

                          forceUpdate();
                        }

                        else {
                          const req = new XMLHttpRequest();
                          req.responseType = "text";

                          req.onload = function (e) {
                            //console.log("in onload")
                            if (this.response.includes("base64")) {
                              assetObj.photo[keys[i]] = this.response;
                              //console.log(assetObj.photo[keys[i]]);

                              if (keys[i] === "DisplayImage") {
                                //console.log("Setting Display Image")
                                assetObj.DisplayImage = assetObj.photo[keys[i]]
                              }

                              else if (i === keys.length - 1) {
                                //console.log("Setting Display Image")
                                assetObj.DisplayImage = assetObj.photo[keys[0]]
                              }
                              forceUpdate();
                            }

                            if (i + 1 === keys.length) {
                              newAsset.photo = assetObj.photo;
                              newAsset.DisplayImage = assetObj.DisplayImage;
                              finalize(newAsset)
                            }
                          }

                          req.onerror = function (e) {
                            //console.log("http request error")
                            if (vals[i].includes("http")) {
                              assetObj.photo[keys[i]] = vals[i];
                              if (keys[i] === "DisplayImage") {
                                //console.log("Setting Display Image")
                                assetObj.DisplayImage = (assetObj.photo[keys[i]])
                              }
                              else if (i === keys.length - 1) {
                                //console.log("Setting Display Image")
                                assetObj.DisplayImage = (assetObj.photo[keys[0]])
                              }
                              forceUpdate();
                            }

                            if (i + 1 === keys.length) {
                              newAsset.photo = assetObj.photo;
                              newAsset.DisplayImage = assetObj.DisplayImage;
                              finalize(newAsset)
                            }
                          }
                          req.open('GET', vals[i], true);
                          req.send();
                        }
                      }
                      await get()
                    }
                  }
                }
              });
            })
          }
        })
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
    if (!window.web3) return
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  };

  const setUpContractEnvironment = async (_web3, _addr) => {
    if (window.isKovan === false) { return }
    //console.log("IN SUCE, addr:", _addr)
    if (window.isSettingUpContracts) { return (console.log("Already in the middle of setUp...")) }
    window.isSettingUpContracts = true;
    if (window.ethereum) {
      window._contracts = await buildContracts(_web3).then(() => {
        window.isSettingUpContracts = false;
        setWD(true)
        if (window.idxQuery) { window.location.href = '/#/user/search/' + window.idxQuery }
      })

      if (_addr) {
        await window.utils.getETHBalance(_addr);
        await setUpTokenVals(true, "SetupContractEnvironment", _addr)
        await setUpACInformation(_addr);
      }
    }

    else {
      window.isSettingUpContracts = true;
      window._contracts = await buildContracts(_web3).then(() => {
        window.isSettingUpContracts = false;
        setWD(true)
      })
    }

  };

  const getACsFromDB = async () => {
    const acArray = acArr;

    let rootArray = [], rootNameArray = [], allClasses = [], allClassNames = [];
    let _assetClassSets = {};

    for (let i = 0; i < acArray.length; i++) {
      await window.contracts.AC_MGR.methods
        .getAC_data(String(acArray[i]))
        .call((_error, _result) => {
          if (_error) { console.log("Error: ", _error) }

          else {
            let resArr = Object.values(_result)

            if (String(acArray[i]) === String(resArr[0])) {
              window.utils.resolveACFromID(String(acArray[i])).then((e) => {
                rootArray.push(acArray[i]);
                rootNameArray.push(e.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()));
                _assetClassSets[String(acArray[i])] = [];
              })
            }

            else {
              window.utils.resolveACFromID(String(acArray[i])).then((e) => {
                allClasses.push(String(acArray[i]));
                allClassNames.push(e);
              })
            }

          }

        });

    }

    return { sets: _assetClassSets, rArr: rootArray, rnArr: rootNameArray, allCArr: allClasses, allCNArr: allClassNames }

  }

  const setUpACInformation = async (addr) => {

    getACsFromDB().then(async (e) => {
      let allClasses = e.allCArr, rootArray = e.rArr, _assetClassSets = e.sets, rootNameArray = e.rnArr, allClassNames = e.allCNArr;

      console.log(allClasses, allClassNames, rootArray)

      for (let i = 0; i < allClasses.length; i++) {
        await window.contracts.AC_MGR.methods
          .getAC_data(String(allClasses[i]))
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }

            else {
              let resArr = Object.values(_result);
              for (let x = 0; x < rootArray.length; x++) {

                if (String(rootArray[x]) === String(resArr[0])) {
                  _assetClassSets[String(rootArray[x])]
                    .push({ id: allClasses[i], name: allClassNames[i].toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()) })
                }

              }
            }

          });
      }

      

      setTimeout(()=>{
        console.log("Class Sets: ", _assetClassSets)
        setRoots(rootArray)
        setRootNames(rootNameArray)
        setAssetClassSets(_assetClassSets)
      },500)
      
    })

  }

  const setUpAssets = async (who, _addr) => {
    console.log("SUA, called from ", who)

    let tempObj = {};

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
    console.log("SUA: In setUpAssets")

    window.utils.getAssetTokenInfo(_addr).then((simpleAssets) => {
      if (simpleAssets.ipfs) {
        if (!simpleAssetView) { getIpfsData(simpleAssets, simpleAssets.ipfs, simpleAssets.ids.length) }
        else { console.log("Displaying simplified assets"); return buildAssets(simpleAssets, [], true) }
      }
    })

  };

  const getIpfsData = async (simpleAssets, array, jobs, iteration, assetData) => {
    let _assetData
    if (!array) return
    //console.log(array)
    if (!iteration) {
      iteration = 1
    }
    if (!jobs) {
      jobs = array.length
    }
    if (assetData) {
      _assetData = assetData
    } else {
      _assetData = [];
    }
    if (jobs < iteration) {
      //console.log(_assetData);
      console.log("Finished getting extended data.");
      return buildAssets(simpleAssets, _assetData);
    }

    let lookup = array[iteration - 1]

    for await (const chunk of window.ipfs.cat(lookup)) {
      let str = new TextDecoder("utf-8").decode(chunk);
      //console.log(str)
      if (!str) {
        _assetData.push({ text: {}, photo: {}, urls: {}, name: "" })
        console.log("error")
        return getIpfsData(simpleAssets, array, jobs, iteration + 1, _assetData)
      }

      else {
        //console.log(str)
        console.log("got job #", iteration)
        try {
          _assetData.push(JSON.parse(str))
        }
        catch {
          _assetData.push({ text: {}, photo: {}, urls: {}, name: "" })
        }
        return getIpfsData(simpleAssets, array, jobs, iteration + 1, _assetData)
      }
      //console.log(chunk)
    }
  };

  const buildAssets = async (simpleAssets, assetData, noIpfs) => {
    let ids = simpleAssets.ids;
    setReserveAD(assetData)
    console.log("BA: In buildAssets.")
    let tempObj = simpleAssets;
    let assetArray = [];

    if (ids.length > 0) {
      if (noIpfs) {
        for (let x = 0; x < ids.length; x++) {
          let assetObj = { text: {}, photo: {}, urls: {}, name: "Name Unavailable" }

          assetObj.DisplayImage = "";
          assetObj.identicon = <Jdenticon value={ids[x]} />;
          assetObj.identiconLG = <Jdenticon value={ids[x]} />;
          assetObj.note = "";
          assetObj.photoUrls = {}
          assetObj.id = simpleAssets.ids[x];
          assetObj.ipfs = simpleAssets.ipfs[x];
          assetObj.countPair = simpleAssets.countPairs[x];
          assetObj.assetClass = simpleAssets.assetClasses[x];
          assetObj.status = simpleAssets.statuses[x];
          assetObj.statusNum = simpleAssets.statusNums[x];
          assetObj.assetClassName = simpleAssets.assetClassNames[x].toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
          assetObj.root = simpleAssets.roots[x];
          assetObj.currency = simpleAssets.prices[x].currency;
          assetObj.price = simpleAssets.prices[x].price;

          console.log(assetObj)
          assetArray.push(assetObj)
          forceUpdate()
        }
      }
      else {
        for (let x = 0; x < assetData.length; x++) {
          let vals = Object.values(assetData[x].photo), keys = Object.keys(assetData[x].photo);
          let assetObj = { text: {}, photo: {}, urls: {}, name: "" }

          if (assetData[x].name === "" || assetData[x].name === undefined) {
            assetObj.name = "Name Unavailable";
          }

          else {
            assetObj.name = assetData[x].name
          }

          for (let i = 0; i < keys.length; i++) {
            const get = () => {
              if (vals[i].includes("data") && vals[i].includes("base64")) {
                assetObj.photo[keys[i]] = vals[i];
                //console.log(assetObj.photo[keys[i]]);
                //console.log(x);
                if (keys[i] === "DisplayImage") {
                  //console.log("Setting Display Image")
                  assetObj.DisplayImage = (assetObj.photo[keys[i]])
                }
                else if (i === keys.length - 1) {
                  //console.log("Setting Display Image")
                  assetObj.DisplayImage = (assetObj.photo[keys[0]])
                }
                forceUpdate();
              }

              else if (!vals[i].includes("ipfs") && vals[i].includes("http")) {
                assetObj.photo[keys[i]] = vals[i];
                if (keys[i] === "DisplayImage") {
                  //console.log("Setting Display Image")
                  assetObj.DisplayImage = (assetObj.photo[keys[i]])
                }
                else if (i === keys.length - 1) {
                  //console.log("Setting Display Image")
                  assetObj.DisplayImage = (assetObj.photo[keys[0]])
                }
                forceUpdate();
              }

              else {
                const req = new XMLHttpRequest();
                req.responseType = "text";

                req.onload = function (e) {
                  //console.log("in onload")
                  if (this.response.includes("base64")) {
                    assetObj.photo[keys[i]] = this.response;
                    //console.log(assetObj.photo[keys[i]]);
                    //console.log(x);
                    if (keys[i] === "DisplayImage") {
                      //console.log("Setting Display Image")
                      assetObj.DisplayImage = (assetObj.photo[keys[i]])
                    }
                    else if (i === keys.length - 1) {
                      //console.log("Setting Display Image")
                      assetObj.DisplayImage = (assetObj.photo[keys[0]])
                    }
                    forceUpdate();
                  }
                }

                req.onerror = function (e) {
                  //console.log("http request error")
                  if (vals[i].includes("http")) {
                    assetObj.photo[keys[i]] = vals[i];
                    if (keys[i] === "DisplayImage") {
                      //console.log("Setting Display Image")
                      assetObj.DisplayImage = (assetObj.photo[keys[i]])
                    }
                    else if (i === keys.length - 1) {
                      //console.log("Setting Display Image")
                      assetObj.DisplayImage = (assetObj.photo[keys[0]])
                    }
                    forceUpdate();
                  }
                }

                req.open('GET', vals[i], true);
                req.send();
              }
            }
            await get()
          }


          if (keys.length === 0) {
            assetObj.DisplayImage = "";
          }

          assetObj.note = simpleAssets.notes[x];
          assetObj.photoUrls = assetData[x].photo
          assetObj.text = assetData[x].text
          assetObj.urls = assetData[x].urls

          assetObj.root = simpleAssets.roots[x];
          assetObj.id = simpleAssets.ids[x];
          assetObj.ipfs = simpleAssets.ipfs[x];
          assetObj.countPair = simpleAssets.countPairs[x];
          assetObj.assetClass = simpleAssets.assetClasses[x];
          assetObj.status = simpleAssets.statuses[x];
          assetObj.statusNum = simpleAssets.statusNums[x];
          assetObj.assetClassName = simpleAssets.assetClassNames[x];
          assetObj.identicon = <Jdenticon value={ids[x]} />;
          assetObj.identiconLG = <Jdenticon value={ids[x]} />;

          assetObj.id = simpleAssets.ids[x];
          assetObj.ipfs = simpleAssets.ipfs[x];
          assetObj.countPair = simpleAssets.countPairs[x];
          assetObj.assetClass = simpleAssets.assetClasses[x];
          assetObj.status = simpleAssets.statuses[x];
          assetObj.statusNum = simpleAssets.statusNums[x];
          assetObj.assetClassName = simpleAssets.assetClassNames[x];

          assetObj.price = simpleAssets.prices[x].price;
          assetObj.currency = simpleAssets.prices[x].currency;

          //console.log(assetObj)
          assetArray.push(assetObj)
        }

      }
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

    setAssetArr(assetArray)
    console.log("BA: Assets after rebuild: ", assetArray);
    forceUpdate();
  };

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

    if (window.contracts) {
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

    //await console.log(window.balances);

    if (willSetup) {
      forceUpdate();
      return setUpAssets("setUpTokenVals", _addr)
    }

    return forceUpdate();
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
