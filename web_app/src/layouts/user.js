import React from "react";
import cx from "classnames";
import swal from "sweetalert";
import Web3 from "web3";
import { MaticPOSClient } from "@maticnetwork/maticjs";
import { useCookies } from "react-cookie";
import { Route } from "react-router-dom";
import ReactTable from "../components/ReactTable/ReactTable.js";
import { isMobile, isAndroid } from "react-device-detect";
import swalReact from "@sweetalert/with-react";
// creates a beautiful scrollbar

import PerfectScrollbar from "perfect-scrollbar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import {
  Cached,
  DashboardOutlined,
  InfoOutlined,
  Refresh,
} from "@material-ui/icons";

// core components
import Footer from "components/Footer/Footer.js";
import AdminNavbar from "components/Navbars/userNavbar.js";
import Button from "components/CustomButtons/Button.js";
import Pruf from "../assets/img/pruftoken.png";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CardFooter from "components/Card/CardFooter.js";

import Eth from "../assets/img/eth-logo.png";
import Polygon from "../assets/img/matic-token-inverted-icon.png";

import routes from "routes.js";

import userStyle from "assets/jss/material-dashboard-pro-react/layouts/userStyle.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { Icon } from "@material-ui/core";

var ps;

const useStyles = makeStyles(styles);
const userStyles = makeStyles(userStyle);

export default function Dashboard(props) {
  const { ...rest } = props;

  // states and functions
  const [miniActive, setMiniActive] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(true);
  const [addr, setAddr] = React.useState();
  const [etherBalance, setEtherBalance] = React.useState("");
  const [prufBalance, setPrufBalance] = React.useState("");
  const [isRefreshingEther, setIsRefreshingEther] = React.useState(false);
  const [isRefreshingPruf, setIsRefreshingPruf] = React.useState(false);
  const [useConnected, setUseConnected] = React.useState(false);
  const [transacting, setTransacting] = React.useState(false);
  const [redeeming, setRedeeming] = React.useState(false);
  const [allowance, setAllowance] = React.useState(false);
  const [customAddress, setCustomAddress] = React.useState("");
  const [walletInfo, setWalletInfo] = React.useState("0");
  const [isEligible, setIsEligible] = React.useState(false);
  const [amountToSwap, setAmountToSwap] = React.useState();
  const [twinChain, setTwinChain] = React.useState("");
  const [currentChain, setCurrentChain] = React.useState("");
  const [web3, setWeb3] = React.useState();
  const [maticClient, setMaticClient] = React.useState();
  const [redeemAmount, setRedeemAmount] = React.useState("0");
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [rootManager, setRootManager] = React.useState();
  const [redeemList, setRedeemList] = React.useState([]);
  const [delegationList, setDelegationList] = React.useState([['Loading Nodes...', '~', '~', '~']]);
  const [findingTxs, setFindingTxs] = React.useState(false);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [logo, setLogo] = React.useState(require("assets/img/logo-white.svg"));
  const [splitter, setSplitter] = React.useState({});
  const [util, setUtil] = React.useState({});
  // styles
  const classes = useStyles();
  const userClasses = userStyles();
  const apiSecret = "F9GZM22PSKBBCI3YZ21CK8B3DC9C5DRKXF";
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

  const Util_Child_ADDRESS = "0xAdf72D32E511eE00c6E0FF5D62Cd5C7C40A6aDEA",
    Util_Parent_ADDRESS = "0xa49811140E1d6f653dEc28037Be0924C811C4538",
    Root_Mgr_ADDRESS = "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77",
    ERC20_Predicate_ADDRESS = "0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf",
    Child_Mgr_ADDRESS = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";

  const generateStakingDash = () => {
    let component = [];
    let data = JSON.parse(data);

    component.push(
      <GridItem xs={12} sm={6} md={6} lg={3}>
        <Card chart className={classes.cardHover}>
        </Card>
      </GridItem>
    );
    //}

    return component;
    // eslint-disable-next-line react/prop-types
  };
  // const mainWeb3 = new Web3(
  //   "https://mainnet.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959"
  // );
  // const maticWeb3 = new Web3(
  //   "https://rpc-mainnet.maticvigil.com/v1/ccb543453ee1affc879932231adcc00adb350518"
  // );

  if (!window.maticPOSClient) {
    const maticPOSClient = new MaticPOSClient({
      network: "mainnet",
      version: "v1",
      parentProvider:
        "https://mainnet.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959",
      maticProvider:
        "https://rpc-mainnet.maticvigil.com/v1/ccb543453ee1affc879932231adcc00adb350518",
    });
    console.log("Setting POSClient");
    window.maticPOSClient = maticPOSClient;
  }

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
        }
      } else if (web3.utils.toChecksumAddress(e[0]) !== addr) {
        window.location.reload();
      }
    });
  }

  React.useEffect(() => {
    let _web3 = require("web3");
    _web3 = new Web3(
      _web3.givenProvider ||
        "https://mainnet.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959"
    );
    setWeb3(_web3);
    setTimeout(getAddress(_web3), 1000);

    console.log({ _web3 });

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

  const checkDepositStatus = async (
    userAccount,
    rootToken,
    depositAmount,
    childChainManagerProxy
  ) => {
    const ws = new WebSocket(
      /*"wss://rpc-mumbai.maticvigil.com/ws/v1/ccb543453ee1affc879932231adcc00adb350518"*/ "wss://rpc-mainnet.matic.network"
    );

    return new Promise((resolve, reject) => {
      ws.onopen = () => {
        ws.send(
          `{"id": 1, "method": "eth_subscribe", "params": ["newDeposits", {"Contract": ${childChainManagerProxy}}]}`
        );

        ws.onmessage = (msg) => {
          const parsedMsg = JSON.parse(msg);
          console.log(parsedMsg);
          if (
            parsedMsg &&
            parsedMsg.params &&
            parsedMsg.params.result &&
            parsedMsg.params.result.Data
          ) {
            const fullData = parsedMsg.params.result.Data;
            const { 0: syncType, 1: syncData } = web3.eth.abi.decodeParameters(
              ["bytes32", "bytes"],
              fullData
            );

            // check if sync is of deposit type (keccak256("DEPOSIT"))
            const depositType =
              "0x87a7811f4bfedea3d341ad165680ae306b01aaeacc205d227629cf157dd9f821";
            if (syncType.toLowerCase() === depositType.toLowerCase()) {
              const {
                0: userAddress,
                1: rootTokenAddress,
                2: depositData,
              } = web3.eth.abi.decodeParameters(
                ["address", "address", "bytes"],
                syncData
              );

              // depositData can be further decoded to get amount, tokenId etc. based on token type
              // For ERC20 tokens
              const { 0: amount } = web3.eth.abi.decodeParameters(
                ["uint256"],
                depositData
              );
              if (
                userAddress.toLowerCase() === userAccount.toLowerCase() &&
                rootToken.toLowerCase() === rootTokenAddress.toLowerCase() //&&
                //depositAmount === amount
              ) {
                resolve(true);
              }
            }
          }
        };

        ws.onerror = (e) => {
          console.log("ERROR", e);
          reject(false);
        };

        ws.onclose = (e) => {
          console.log("CLOSE", e);
          reject(false);
        };
      };
    });
  };

  const getMaticWithdrawals = (_web3, _addr) => {
    var txReq = new XMLHttpRequest();
    //txReq.open( "GET", `https://api-testnet.polygonscan.com/api?module=account&action=tokentx&address=${addr}&startblock=0&endblock=19999999&sort=asc`, true ) // false for synchronous request
    txReq.open(
      "GET",
      `https://api.polygonscan.com/api?module=account&action=txlist&address=${_addr}&startblock=16385793&endblock=99999999&sort=asc&apikey=${apiSecret}`,
      true
    );
    txReq.send(null);
    let erc20Req = new XMLHttpRequest();
    erc20Req.open(
      "GET",
      `https://api.polygonscan.com/api?module=account&action=tokentx&address=${_addr}&startblock=0&endblock=19999999&sort=asc&apikey=${apiSecret}`,
      true
    );

    txReq.onload = async () => {
      let txns = JSON.parse(txReq.responseText).result,
        withdrawals = [];
      console.log({ txns: txns });
      txns.forEach((e) => {
        //console.log({methodId: e.input.substring(2, 10)})
        if (
          e.input.substring(2, 10) === "2e1a7d4d" &&
          e.to.toLowerCase() === Util_Child_ADDRESS.toLowerCase()
        ) {
          if (
            cookies[`beenRedeemed${_addr}`] &&
            !cookies[`beenRedeemed${_addr}`].includes(e.hash)
          ) {
            withdrawals.push(e.hash);
          } else if (
            !cookies[`beenRedeemed${_addr}`] ||
            cookies[`beenRedeemed${_addr}`] === undefined
          ) {
            withdrawals.push(e.hash);
          } else console.log("skipped cached tx");
        }
      });

      //web3.eth.abi.decodeParameters(Util_Child_ABI, "0x2e1a7d4d00000000000000000000000000000000000000000000001dd0c885f9a0d80000")
      console.log({ withdrawals: withdrawals });
      erc20Req.send(null);

      erc20Req.onload = () => {
        console.log({ rawERC20: JSON.parse(erc20Req.responseText) });
        let erc20Txs = JSON.parse(erc20Req.responseText).result.reverse();
        console.log({ erc20Txs: erc20Txs });
        checkTxs(
          _web3,
          _addr,
          JSON.parse(JSON.stringify(withdrawals)),
          JSON.parse(JSON.stringify(erc20Txs))
        );
      };
    };
  };

  const checkTxs = async (
    _web3,
    _addr,
    withdrawals,
    erc20Txs,
    discards,
    iteration
  ) => {
    console.log(cookies);
    //console.trace("Running checkTxs")
    if (!withdrawals || withdrawals.length < 1) {
      setFindingTxs(false);
      if (discards && discards.length > 0) {
        discards.pop();
        setCookie(`beenRedeemed${_addr}`, discards);
        console.log({ discards: discards });
      }
      console.log("Bad or empty props", { withdrawList: withdrawals });
      return setRedeemList([]);
    }

    //console.log(cookies[`beenRedeemed${_addr}`])

    if (
      !discards &&
      cookies[`beenRedeemed${_addr}`] &&
      cookies[`beenRedeemed${_addr}`] !== "undefined"
    ) {
      console.log("Discards undefined and set full");
      discards = JSON.parse(JSON.stringify(cookies[`beenRedeemed${_addr}`]));
    } else if (!discards) {
      console.log("Discards undefined but set empty");
      console.log({ Cookies: cookies[`beenRedeemed${_addr}`] });
      discards = [];
    }
    if (!iteration) iteration = 0;

    //console.log(discards)

    if (iteration >= withdrawals.length) {
      console.log("Exit with redeemable tx(s)", withdrawals.length);
      setFindingTxs(false);
      setRedeemAmount();
      if (discards && discards.length > 0) {
        discards.pop();
        setCookie(`beenRedeemed${_addr}`, discards);
        console.log({ discards: discards });
      }
      for (let tx of erc20Txs) {
        if (tx.hash === withdrawals[withdrawals.length - 1]) {
          setRedeemAmount(_web3.utils.fromWei(tx.value));
          console.log(
            `Match found for erc20tx. Setting redeem val to ${_web3.utils.fromWei(
              tx.value
            )}`
          );
        } else {
          console.log("No Dice...");
        }
        return setRedeemList(withdrawals);
      }
    } else {
      withdrawals.forEach((e) => {
        if (cookies[`beenRedeemed${_addr}`].includes(e)) {
          withdrawals.shift();
        }
        checkTxs(_web3, _addr, withdrawals, erc20Txs, discards, iteration + 1);
      });
    }
  };

  const redeem = (list) => {
    list = JSON.parse(JSON.stringify(list));
    console.log(currentChain, redeemList.length, findingTxs);
    console.log(list);
    if (list.length > 0) {
      let current = list.shift();
      console.log(current);
      setRedeeming(true);
      window.maticPOSClient
        .exitERC20(current, { from: addr, encodeAbi: true })
        .then(async (e) => {
          console.log(currentChain, redeemList.length, findingTxs);
          await web3.eth
            .sendTransaction({
              from: addr,
              to: Root_Mgr_ADDRESS,
              data: e.data,
            })
            .on("receipt", () => {
              setRedeeming(false);
              console.log("Got tokens");
              return refreshBalances("both", web3, addr);
            })
            .on("error", () => {
              setRedeeming(false);
              console.log("Error redeeming");
            })
            .catch((e) => {
              console.log(e.message);
              if (
                e.message.includes("Burn transaction has not been checkpointed")
              ) {
                console.log("Burn transaction has not yet been checkpointed");
                swal({
                  title: "Pending POLYGON -> ETH swap detected.",
                  text: `TxID: ${withdrawals[iteration]}\n\n Tokens will be available to redeem once it has been checkpointed on Polygon. This may take a while.`,
                  icon: "warning",
                  button: "Close",
                });
              } else if (e.message.includes("EXIT_ALREADY_PROCESSED")) {
                console.log("Found already redeemed");
                if (!discards.includes(withdrawals[iteration]))
                  discards.push(withdrawals[iteration]);
                console.log({ discards: discards });
              } else {
                console.error("SOMETHING WENT WRONG: ", e.message);
              }
              setRedeeming(false);
            });
        });
    } else return console.log("Done redeeming");
  };

  const getAddress = (_web3) => {
    if (window.ethereum) {
      window.ethereum
        .request({
          method: "eth_accounts",
        })
        .then(async (accounts) => {
          if (accounts[0] === undefined) {
            window.ethereum
              .request({ method: "eth_requestAccounts" })
              .then(async (accounts) => {
                if (accounts[0] === undefined)
                  return swal({
                    title: "Can't connect to wallet.",
                    icon: "warning",
                    button: "Close",
                  });
                console.log(_web3.utils.toChecksumAddress(accounts[0]));
                setAddr(_web3.utils.toChecksumAddress(accounts[0]));
                setUpEnvironment(_web3, accounts[0]);
              });
          } else {
            console.log(_web3.utils.toChecksumAddress(accounts[0]));
            setAddr(_web3.utils.toChecksumAddress(accounts[0]));
            setUpEnvironment(_web3, _web3.utils.toChecksumAddress(accounts[0]));
          }
        });
    } else {
    }
  };

  const getActiveRoute = (routes) => {
    let activeRoute = "PRüF / Matic Token Bridge";
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

  const refreshBalances = (job, _web3, _addr) => {
    console.log({ redeemed: cookies[`beenRedeemed${_addr}`] });
    if (!util.methods)
      return swal({
        title: "Something isn't right! Try refreshing the page.",
        icon: "warning",
        button: "Close",
      });
    if (!_addr) return console.error("No address is connected!");

    console.log(`Refreshing balances of address: ${_addr}`);

    if (job === "eth" || job === "both") {
      setIsRefreshingEther(true);
      web3.eth.getBalance(_addr).then(async (e) => {
        setEtherBalance(Number(web3.utils.fromWei(e)).toFixed(5).toString());
        setIsRefreshingEther(false);
      });
    }

    if (job === "eth") return;
    setIsRefreshingPruf(true);
    setFindingTxs(true);
    if (currentChain === "Ethereum") getMaticWithdrawals(_web3, _addr);
    util.methods.balanceOf(_addr).call(async (error, result) => {
      if (!error) {
        setPrufBalance(
          Number(web3.utils.fromWei(result)).toFixed(5).toString()
        );
      }
      setIsRefreshingPruf(false);
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

  const setUpEnvironment = (_web3, _addr) => {
    console.log("setting up environment");
    if (!cookies[`beenRedeemed${_addr}`]) setCookie(`beenRedeemed${_addr}`, []);

    // let _rootManager = new _web3.eth.Contract(Root_Mgr_ABI, Root_Mgr_ADDRESS);
    // setRootManager(_rootManager);

    // _web3.eth.net.getNetworkType().then((e) => {
    //   let _util;
    //   if (e === "private") {
    //     _web3.eth.net.getId().then((e) => {
    //       if (e === 137) {
    //         setTwinChain("Ethereum");
    //         setCurrentChain("Polygon");

    //         _util = new _web3.eth.Contract(Util_Child_ABI, Util_Child_ADDRESS);
    //         setUtil(_util);
    //         setIsRefreshingPruf(true);
    //         _util.methods.balanceOf(_addr).call(async (error, result) => {
    //           if (!error) {
    //             setPrufBalance(
    //               Number(_web3.utils.fromWei(result)).toFixed(5).toString()
    //             );
    //           }
    //           setIsRefreshingPruf(false);
    //         });
    //       } else {
    //         swal({
    //           title: "Please connect to the Ethereum or Polygon main net",
    //           icon: "warning",
    //           button: "Close",
    //         });
    //       }
    //     });
    //   } else if (e === "main") {
    //     setTwinChain("Polygon");
    //     setCurrentChain("Ethereum");

    //     _util = new _web3.eth.Contract(Util_Parent_ABI, Util_Parent_ADDRESS);
    //     setUtil(_util);
    //     setIsRefreshingPruf(true);
    //     setFindingTxs(true);
    //     getMaticWithdrawals(_web3, _addr);
    //     _util.methods.balanceOf(_addr).call(async (error, result) => {
    //       if (!error) {
    //         setPrufBalance(
    //           Number(_web3.utils.fromWei(result)).toFixed(5).toString()
    //         );
    //       }
    //       setIsRefreshingPruf(false);
    //     });
    //   } else {
    //     setTwinChain("Polygon");
    //     setCurrentChain("Ethereum");
    //     swal({
    //       title: `You are connected to the network '${e}', please connect to the Ethereum or Polygon mainnet`,
    //       icon: "warning",
    //       button: "Close",
    //     });
    //   }
    // });
    // console.log("Getting things set up...");
    setIsRefreshingEther(true);
    _web3.eth.getBalance(_addr).then(async (e) => {
      setEtherBalance(Number(_web3.utils.fromWei(e)).toFixed(5).toString());
      setIsRefreshingEther(false);
    });
  };

  //Count up user tokens, takes  "willSetup" bool to determine whether to call setupAssets() after count

  return (
    <div className={userClasses.wrapper}>
      <AdminNavbar
        sidebarMinimize={sidebarMinimize.bind(this)}
        miniActive={miniActive}
        brandText={getActiveRoute(routes)}
        {...rest}
      />{" "}
      <br />
      <ui-progress-circle
        shape="round"
        color="#0f0000"
        radius="90"
      ></ui-progress-circle>
      <br />
      <div className={mainPanelClasses} ref={mainPanel}>
        <div className="splitterForm">
          <br />
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader stats icon>
                  {/* {currentChain === "Ethereum" ? ( */}
                  <>
                    <CardIcon
                      className="headerIconBack"
                      onClick={() => window.open("https://ethereum.org/en/")}
                    >
                      <img className="Icon" src={Eth} alt=""></img>
                    </CardIcon>
                    <p className={classes.cardCategory}>ETH Balance</p>
                  </>
                  {/* ) : ( */}
                  {/* <>
                      <CardIcon
                        className="headerIconBack"
                        onClick={() => window.open("https://ethereum.org/en/")}
                      >
                        <img className="Icon" src={Polygon} alt=""></img>
                      </CardIcon>
                      <p className={classes.cardCategory}>Matic Balance</p>
                    </>
                  )} */}
                  {etherBalance ? (
                    <h3 className={classes.cardTitle}>
                      {etherBalance.substring(0, 7)}{" "}
                    </h3>
                  ) : (
                    <h3 className={classes.cardTitle}>~</h3>
                  )}
                </CardHeader>
                <CardFooter stats>
                  {!isRefreshingEther && (
                    <Tooltip
                      id="tooltip-top"
                      title="Refresh Balances"
                      placement="bottom"
                      classes={{ tooltip: userClasses.toolTip }}
                    >
                      <div className="refresh">
                        <Cached
                          onClick={() => {
                            refreshBalances("eth", web3, addr);
                          }}
                        />
                      </div>
                    </Tooltip>
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
                    onClick={() => window.open("https://pruf.io/")}
                  >
                    <img className="Icon" src={Pruf} alt=""></img>
                  </CardIcon>
                  <p
                    className={classes.cardCategory}
                  >{`PRUF Balance (${currentChain})`}</p>
                  {prufBalance ? (
                    <h3 className={classes.cardTitle}>
                      <>
                        {String(Math.round(Number(prufBalance) * 100) / 100)}{" "}
                      </>
                    </h3>
                  ) : (
                    <h3 className={classes.cardTitle}>~</h3>
                  )}
                </CardHeader>
                <CardFooter stats>
                  {!isRefreshingPruf && (
                    <>
                      <Tooltip
                        id="tooltip-top"
                        title="Refresh Balances"
                        placement="bottom"
                        classes={{ tooltip: userClasses.toolTip }}
                      >
                        <div className="refresh">
                          <Cached
                            onClick={() => {
                              refreshBalances("pruf", web3, addr);
                            }}
                          />
                        </div>
                      </Tooltip>
                      {currentChain === "Ethereum" &&
                        redeemList.length > 0 &&
                        findingTxs === false && (
                          <div className="inlineFlex">
                            <Tooltip
                              id="tooltip-top"
                              title="Info"
                              placement="bottom"
                              classes={{ tooltip: userClasses.toolTip }}
                            >
                              <InfoOutlined
                                className="info"
                                onClick={() => {
                                  swal({
                                    title: `You have ü${redeemAmount} PRUF available for withdrawal from Polygon.`,
                                    text: `Please click to redeem tokens.`,
                                    icon: "warning",
                                    button: "Close",
                                  });
                                }}
                              />
                            </Tooltip>
                            {redeeming === true && (
                              <Button
                                className="redeemButton"
                                onClick={() => redeem(redeemList)}
                                disabled
                              >
                                Redeeming tokens...
                              </Button>
                            )}
                            {redeeming === false && (
                              <Button
                                className="redeemButton"
                                onClick={() => redeem(redeemList)}
                              >
                                Redeem tokens
                              </Button>
                            )}
                          </div>
                        )}
                      {currentChain === "Ethereum" && findingTxs === true && (
                        <div className="lds-ellipsisCard">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      )}
                      {currentChain === "Ethereum" &&
                        findingTxs === false &&
                        redeemList.length === 0 && (
                          <div className="inlineFlex">
                            <Tooltip
                              id="tooltip-top"
                              title="Info"
                              placement="bottom"
                              classes={{ tooltip: userClasses.toolTip }}
                            >
                              <InfoOutlined
                                className="info"
                                onClick={() => {
                                  swal(
                                    "You do not have any pending Polygon -> PRUF withdrawals."
                                  );
                                }}
                              />
                            </Tooltip>
                            <h5 className="pendingBal">No pending balance</h5>
                          </div>
                        )}
                    </>
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
            <CardHeader icon>
              <CardIcon
                className="headerIconBack"
                onClick={() => {
                  moreInfo("back");
                }}
              >
                <DashboardOutlined />
              </CardIcon>
              <div className="dashboardHeader">
                <div className="flexRowWithGap">
                  <h4 className={classes.cardIconTitle}>Staking Dashboard</h4>
                  <Tooltip title="Refresh">
                    <Icon
                      className="MLBGradientRefresh"
                      onClick={() => {
                        window.replaceAssetData.refreshAssets = true;
                        window.dispatchEvent(props.refresh);
                      }}
                    >
                      <Refresh />
                    </Icon>
                  </Tooltip>
                </div>
              </div>
              <br />
            </CardHeader>
            {/* eslint-disable-next-line react/prop-types*/}
            {!props.addr && props.isMounted && (
              <h3 className="bump">
                <br />
                Please connect to an Ethereum provider.
              </h3>
            )}
            <CardBody>
                            <ReactTable
                                columns={[
                                    {
                                        Header: 'Root',
                                        accessor: 'root',
                                    },
                                    {
                                        Header: 'Name',
                                        accessor: 'name',
                                    },
                                    {
                                        Header: 'Node ID',
                                        accessor: 'nodeId',
                                    },
                                    {
                                        Header: 'Total Delegated',
                                        accessor: 'totalStaked',
                                    },
                                    {
                                        Header: 'Transaction Count',
                                        accessor: 'transactionsPerEpoch',
                                    },
                                    {
                                        Header: 'Actions',
                                        accessor: 'actions',
                                    },
                                ]}
                                data={delegationList.map((prop, key) => {
                                    return {
                                        id: key,
                                        root: prop[0],
                                        name: prop[1],
                                        nodeId: prop[2],
                                        totalStaked: prop[3],
                                        transactionsPerEpoch: prop[4],
                                        actions: (
                                            // we've added some custom button actions
                                            <div className="actions-right">
                                                {/* use this button to add a like kind of action */}
                                                {prop[0] !==
                                                    'Loading Nodes...' && (
                                                        <Button
                                                            // justIcon
                                                            // round
                                                            // simple
                                                            onClick={() => {
                                                                handleDelegation({
                                                                    name: prop[1],
                                                                    id: prop[2],
                                                                    totalDelegated:
                                                                        prop[3],
                                                                })
                                                            }}
                                                            color="info"
                                                            className="delegateButton"
                                                        >
                                                            Delegate
                                                        </Button>
                                                    )}
                                                {prop[0] ===
                                                    'Loading Nodes...' && (
                                                        <Button
                                                            disabled
                                                            onClick={() => {
                                                                handleDelegation({
                                                                    name: prop[1],
                                                                    id: prop[2],
                                                                    totalDelegated:
                                                                        prop[3],
                                                                })
                                                            }}
                                                            color="info"
                                                            className="delegateButton"
                                                        >
                                                            Delegate
                                                        </Button>
                                                    )}
                                            </div>
                                        ),
                                    }
                                })}
                            />
                            </CardBody>
          </Card>
        </div>
        <Footer fluid />
      </div>
    </div>
  );
}
