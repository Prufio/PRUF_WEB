import React from "react";
import cx from "classnames";
import swal from "sweetalert";
import Web3 from "web3";
import { Route } from "react-router-dom";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Eth from "../assets/img/eth-logo.png";
import { Cached } from "@material-ui/icons";
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
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CardFooter from "components/Card/CardFooter.js";

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
  const [addr, setAddr] = React.useState();
  const [etherBalance, setEtherBalance] = React.useState("");
  const [prufBalance, setPrufBalance] = React.useState("");
  const [isRefreshingEther, setIsRefreshingEther] = React.useState(false);
  const [isRefreshingPruf, setIsRefreshingPruf] = React.useState(false);
  const [useConnected, setUseConnected] = React.useState(false);
  const [transacting, setTransacting] = React.useState(false);
  const [customAddress, setCustomAddress] = React.useState("");
  const [walletInfo, setWalletInfo] = React.useState("0");
  const [isEligible, setIsEligible] = React.useState(false);
  const [tempAddr, setTempAddr] = React.useState("");
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [logo, setLogo] = React.useState(require("assets/img/logo-white.svg"));
  const [splitter, setSplitter] = React.useState({});
  const [util, setUtil] = React.useState({});
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
      } else if (window.web3.utils.toChecksumAddress(e[0]) !== addr) {
        window.location.reload();
      }
    });
  }

  // if (window.ethereum && !window.addedListeners) {
  //   window.addEventListener("chainChanged", chainListener);
  //   window.addEventListener("accountsChanged", acctListener);
  //   window.addedListeners = true;
  // }

  React.useEffect(() => {
    setTimeout(getAddress(), 1000);

    let web3 = require("web3");
    web3 = new Web3(
      web3.givenProvider ||
        "https://mainnet.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959"
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
    if (Number(etherBalance) < 0.0001) {
      swal({
        icon: "warning",
        title: "Warning!",
        text: "You may not have enough ether to pay for gas!",
        buttons: {
          Cancel: {
            text: "Cancel",
          },
          Proceed: {
            text: "I know what I'm doing",
          },
        },
      }).then((value) => {
        switch (value) {
          case "Cancel":
            return;

          case "Proceed":
            if (useConnected || addr === customAddress) {
              console.log(`Splitting PRUF balance of ${addr}`);
              setTransacting(true);
              splitter
                .splitMyPruf()
                .send({ from: addr })
                .on("receipt", () => {
                  setTransacting(false);
                  swal({
                    title: `Success!`,
                    text: `Tokens in wallet "${addr}" have been split successfully.`,
                    icon: "success",
                    button: "Close",
                  }).then(() => {
                    refreshBalances("both", addr);
                    getSnapShotInfo(addr);
                  });
                })
                .on("error", () => {
                  swal("Something went wrong!");
                  setTransacting(false);
                  getSnapShotInfo(addr);
                });
            } else {
              if (window.web3.utils.isAddress(customAddress)) {
                console.log(`Splitting PRUF balance of ${customAddress}`);
                setTransacting(true);
                splitter
                  .splitPrufAtAddress(customAddress)
                  .send({ from: addr })
                  .on("receipt", () => {
                    setTransacting(false);
                    swal({
                      title: `Success!`,
                      text: `Tokens in wallet "${customAddress}" have been split successfully.`,
                      icon: "success",
                      button: "Close",
                    }).then(() => {
                      refreshBalances("both", addr);
                      getSnapShotInfo(customAddress);
                    });
                  })
                  .on("error", () => {
                    swal("Something went wrong!");
                    getSnapShotInfo(customAddress);
                  });
              } else {
                return swal(
                  `Given value "${customAddress}" is not a valid Ethereum address. Please try again.`
                );
              }
            }
            break;

          default:
            break;
        }
      });
    } else {
      if (useConnected || addr === customAddress) {
        console.log(`Splitting PRUF balance of ${addr}`);
        setTransacting(true);
        splitter
          .splitMyPruf()
          .send({ from: addr })
          .on("receipt", () => {
            setTransacting(false);
            swal({
              title: `Success!`,
              text: `Tokens in wallet "${addr}" have been split successfully.`,
              icon: "success",
              button: "Close",
            }).then(() => {
              refreshBalances("both", addr);
              getSnapShotInfo(addr);
            });
          })
          .on("error", () => {
            swal("Something went wrong!");
            setTransacting(false);
            getSnapShotInfo(addr);
          });
      } else {
        if (window.web3.utils.isAddress(customAddress)) {
          console.log(`Splitting PRUF balance of ${customAddress}`);
          setTransacting(true);
          splitter
            .splitPrufAtAddress(customAddress)
            .send({ from: addr })
            .on("receipt", () => {
              setTransacting(false);
              swal({
                title: `Success!`,
                text: `Tokens in wallet "${customAddress}" have been split successfully.`,
                icon: "success",
                button: "Close",
              }).then(() => {
                refreshBalances("both", addr);
                getSnapShotInfo(customAddress);
              });
            })
            .on("error", () => {
              swal("Something went wrong!");
              getSnapShotInfo(customAddress);
            });
        } else {
          return swal(
            `Given value "${customAddress}" is not a valid Ethereum address. Please try again.`
          );
        }
      }
    }
  };

  const getAddress = () => {
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
                  return swal("Can't connect to wallet.");
                console.log(window.web3.utils.toChecksumAddress(accounts[0]));
                setAddr(window.web3.utils.toChecksumAddress(accounts[0]));
                setUpEnvironment(accounts[0]);
              });
          } else {
            console.log(window.web3.utils.toChecksumAddress(accounts[0]));
            setAddr(window.web3.utils.toChecksumAddress(accounts[0]));
            setUpEnvironment(accounts[0]);
          }
        });
    } else {
    }
  };

  const getActiveRoute = (routes) => {
    let activeRoute = "PRüF Token Splitter";
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

  const refreshBalances = (job, _addr) => {
    if (!_addr) return console.error("No address is connected!");

    console.log(`Refreshing balances of address: ${_addr}`);

    if (job === "eth" || job === "both") {
      setIsRefreshingEther(true);
      window.web3.eth.getBalance(_addr).then(async (e) => {
        setEtherBalance(
          Number(window.web3.utils.fromWei(e)).toFixed(5).toString()
        );
        setIsRefreshingEther(false);
      });
    }

    if (job === "eth") return;

    setIsRefreshingPruf(true);
    util.balanceOf(_addr).call(async (error, result) => {
      if (!error) {
        setPrufBalance(
          Number(window.web3.utils.fromWei(result)).toFixed(5).toString()
        );
      }
      setIsRefreshingPruf(false);
    });
    //setTimeout(()=>{prufBalance === "" ? setPrufBalance('300') : setPrufBalance(`${Number(prufBalance) + 1}`); setIsRefreshingPruf(false)}, 2000)
  };

  const handleCustomAddress = (e) => {
    setTempAddr(e.target.value);
    setWalletInfo("0");
    if (window.web3.utils.isAddress(e.target.value)) {
      setCustomAddress(window.web3.utils.toChecksumAddress(e.target.value));
      getSnapShotInfo(e.target.value);
    } else {
      setIsEligible(false);
      setCustomAddress("");
    }
  };

  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };

  const setUpEnvironment = (_addr) => {
    const Splitter_ADDRESS = "0x980AaB0F43cea7E7a21F73cf9ed4eADB5845e1Dc",
      Util_ADDRESS = "0xa49811140E1d6f653dEc28037Be0924C811C4538";
    const Splitter_ABI = [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "Paused",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "previousAdminRole",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "newAdminRole",
            "type": "bytes32"
          }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "RoleGranted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "RoleRevoked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "Unpaused",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "CONTRACT_ADMIN_ROLE",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "PAUSER_ROLE",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_address",
            "type": "address"
          }
        ],
        "name": "checkMyAddress",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          }
        ],
        "name": "getRoleAdmin",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "getRoleMember",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          }
        ],
        "name": "getRoleMemberCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "hasRole",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "paused",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "splitMyPruf",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_address",
            "type": "address"
          }
        ],
        "name": "splitPrufAtAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],

      Util_ABI = [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Paused",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "previousAdminRole",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "bytes32",
              name: "newAdminRole",
              type: "bytes32",
            },
          ],
          name: "RoleAdminChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleGranted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "RoleRevoked",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
          ],
          name: "Snapshot",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "Unpaused",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_paymentAddress",
              type: "address",
            },
          ],
          name: "AdminSetSharesAddress",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "CONTRACT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "DEFAULT_ADMIN_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "MINTER_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "PAUSER_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "PAYABLE_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "SNAPSHOT_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "TRUSTED_AGENT_ROLE",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_key",
              type: "uint256",
            },
          ],
          name: "adminKillTrustedAgent",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "snapshotId",
              type: "uint256",
            },
          ],
          name: "balanceOfAt",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "burn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "burnFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "cap",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "subtractedValue",
              type: "uint256",
            },
          ],
          name: "decreaseAllowance",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleAdmin",
          outputs: [
            {
              internalType: "bytes32",
              name: "",
              type: "bytes32",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "index",
              type: "uint256",
            },
          ],
          name: "getRoleMember",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
          ],
          name: "getRoleMemberCount",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "grantRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "hasRole",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "addedValue",
              type: "uint256",
            },
          ],
          name: "increaseAllowance",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_addr",
              type: "address",
            },
          ],
          name: "isColdWallet",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "pause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "paused",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_senderAddress",
              type: "address",
            },
            {
              components: [
                {
                  internalType: "uint32",
                  name: "assetClass",
                  type: "uint32",
                },
                {
                  internalType: "address",
                  name: "rootAddress",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "ACTHaddress",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "rootPrice",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "ACTHprice",
                  type: "uint256",
                },
              ],
              internalType: "struct Invoice",
              name: "invoice",
              type: "tuple",
            },
          ],
          name: "payForService",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "renounceRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "role",
              type: "bytes32",
            },
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "revokeRole",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "setColdWallet",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "takeSnapshot",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "snapshotId",
              type: "uint256",
            },
          ],
          name: "totalSupplyAt",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "address",
              name: "recipient",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_addr",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
          ],
          name: "trustedAgentBurn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_from",
              type: "address",
            },
            {
              internalType: "address",
              name: "_to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
          ],
          name: "trustedAgentTransfer",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "unSetColdWallet",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "unpause",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

    console.log("Getting things set up...");

    const SPLITTER = new window.web3.eth.Contract(
      Splitter_ABI,
      Splitter_ADDRESS
    );
    const UTIL = new window.web3.eth.Contract(Util_ABI, Util_ADDRESS);

    setSplitter(SPLITTER.methods);
    setUtil(UTIL.methods);

    setIsRefreshingEther(true);
    window.web3.eth.getBalance(_addr).then(async (e) => {
      setEtherBalance(
        Number(window.web3.utils.fromWei(e)).toFixed(5).toString()
      );
      setIsRefreshingEther(false);
    });

    setIsRefreshingPruf(true);
    UTIL.methods.balanceOf(_addr).call(async (error, result) => {
      if (!error) {
        setPrufBalance(
          Number(window.web3.utils.fromWei(result)).toFixed(5).toString()
        );
      }
      setIsRefreshingPruf(false);
    });
  };

  //Count up user tokens, takes  "willSetup" bool to determine whether to call setupAssets() after count
  const getSnapShotInfo = (_addr) => {
    if (!_addr) return swal("Unable to reach user's wallet.");
    console.log("Getting snapshot info");

    splitter.checkMyAddress(_addr).call( (error, result) => {
      if (!error && result === "0") {
        console.log(result)
        util.balanceOfAt(_addr, 1).call( (error, result) => {
          if (!error) {
            console.log(result);
            if (result === "0") setIsEligible(false)
            else setIsEligible(true)
            setWalletInfo(window.web3.utils.fromWei(result));
          } else {
            setIsEligible(false)
            setWalletInfo("0")
          }
        });
      } else {
        setIsEligible(false)
      }
    });

    
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
      <div className={mainPanelClasses} ref={mainPanel}>
        <div className="splitterForm">
          <br />
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader stats icon>
                  <CardIcon
                    className="headerIconBack"
                    onClick={() => window.open("https://ethereum.org/en/")}
                  >
                    <img className="Icon" src={Eth} alt=""></img>
                  </CardIcon>
                  <p className={classes.cardCategory}>ETH Balance</p>
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
                    <div className="refresh">
                      <Cached
                        onClick={() => {
                          refreshBalances("eth", addr);
                        }}
                      />
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
                    onClick={() => window.open("https://pruf.io/")}
                  >
                    <img className="Icon" src={Pruf} alt=""></img>
                  </CardIcon>
                  <p className={classes.cardCategory}>PRUF Balance</p>
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
                    <div className="refresh">
                      <Cached
                        onClick={() => {
                          refreshBalances("pruf", addr);
                        }}
                      />
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
                <span className="material-icons"> toll </span>
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
                        getAddress();
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
                  <input
                    type="checkbox"
                    onChange={() => {
                      console.log(`setting useConnected to ${!useConnected}`);
                      setUseConnected(!useConnected);
                      setCustomAddress("");
                      setTempAddr("");
                      if (!useConnected) {
                        getSnapShotInfo(addr);
                      } else {
                        setWalletInfo("");
                        setIsEligible(false);
                      }
                    }}
                  />{" "}
                  {` `}
                  <span className="splitterCheckboxFont">
                    Use connected wallet
                  </span>
                  <br />
                  {!useConnected ? (
                    <CustomInput
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: tempAddr,
                        onChange: (e) => {
                          handleCustomAddress(e); // Set undefined to remove entirely
                        },
                        placeholder: `Tokenholder address`,
                      }}
                    />
                  ) : (
                    <></>
                  )}
                  {isEligible ? <h4>Unclaimed balance: ü{walletInfo}</h4> : <> </>}
                  {useConnected || tempAddr !== "" ? (
                    <h4>
                      Account Status:{" "}
                      {isEligible === true
                        ? "Eligible"
                        : useConnected
                        ? "Not Eligible"
                        : customAddress === "" || customAddress === undefined
                        ? "Invalid Address"
                        : "Not Eligible"}
                    </h4>
                  ) : (
                    <></>
                  )}
                  {!transacting && isEligible ? (
                    <Button
                      color="info"
                      className="MLBGradient"
                      onClick={() => split()}
                    >
                      Split
                    </Button>
                  ) : transacting ? (
                    <>
                      Splitting tokens
                      <div className="lds-ellipsisIF">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                      <br />
                      <br />
                      <Button
                        className="MLBGradient"
                        disabled
                        onClick={() => split()}
                      >
                        Split
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="MLBGradient"
                      disabled
                      onClick={() => split()}
                    >
                      Split
                    </Button>
                  )}
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
