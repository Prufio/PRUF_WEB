import React from "react";
import cx from "classnames";
import swal from "sweetalert";
import Web3 from "web3";
import { MaticPOSClient } from "@maticnetwork/maticjs";
import { useCookies } from "react-cookie";
import { Route } from "react-router-dom";
import swalReact from "@sweetalert/with-react";
// creates a beautiful scrollbar

import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import { Cached, InfoOutlined } from "@material-ui/icons";

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

  const Util_Child_ABI = [
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
        name: "childChainManagerProxy",
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
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "depositData",
            type: "bytes",
          },
        ],
        name: "deposit",
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
            internalType: "address",
            name: "_rootAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_rootPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_ACTHaddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_ACTHprice",
            type: "uint256",
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
      {
        inputs: [
          {
            internalType: "address",
            name: "newChildChainManagerProxy",
            type: "address",
          },
        ],
        name: "updateChildChainManager",
        outputs: [],
        stateMutability: "nonpayable",
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
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    Util_Parent_ABI = [
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
            internalType: "address",
            name: "_rootAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_rootPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_ACTHaddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_ACTHprice",
            type: "uint256",
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
    ],
    Root_Mgr_ABI = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "userAddress",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address payable",
            name: "relayerAddress",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bytes",
            name: "functionSignature",
            type: "bytes",
          },
        ],
        name: "MetaTransactionExecuted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "tokenType",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "predicateAddress",
            type: "address",
          },
        ],
        name: "PredicateRegistered",
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
            indexed: true,
            internalType: "address",
            name: "rootToken",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "childToken",
            type: "address",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "tokenType",
            type: "bytes32",
          },
        ],
        name: "TokenMapped",
        type: "event",
      },
      {
        inputs: [],
        name: "CHILD_CHAIN_ID",
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
        name: "CHILD_CHAIN_ID_BYTES",
        outputs: [
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
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
        name: "DEPOSIT",
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
        name: "ERC712_VERSION",
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
        name: "ETHER_ADDRESS",
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
        inputs: [],
        name: "MAPPER_ROLE",
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
        name: "MAP_TOKEN",
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
        name: "ROOT_CHAIN_ID",
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
        name: "ROOT_CHAIN_ID_BYTES",
        outputs: [
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "checkpointManagerAddress",
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
        inputs: [],
        name: "childChainManagerAddress",
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
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "childToRootToken",
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
            internalType: "address",
            name: "user",
            type: "address",
          },
        ],
        name: "depositEtherFor",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            internalType: "address",
            name: "rootToken",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "depositData",
            type: "bytes",
          },
        ],
        name: "depositFor",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "userAddress",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "functionSignature",
            type: "bytes",
          },
          {
            internalType: "bytes32",
            name: "sigR",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "sigS",
            type: "bytes32",
          },
          {
            internalType: "uint8",
            name: "sigV",
            type: "uint8",
          },
        ],
        name: "executeMetaTransaction",
        outputs: [
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes",
            name: "inputData",
            type: "bytes",
          },
        ],
        name: "exit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getChainId",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [],
        name: "getDomainSeperator",
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
            internalType: "address",
            name: "user",
            type: "address",
          },
        ],
        name: "getNonce",
        outputs: [
          {
            internalType: "uint256",
            name: "nonce",
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
            name: "_owner",
            type: "address",
          },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "initializeEIP712",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "rootToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "childToken",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "tokenType",
            type: "bytes32",
          },
        ],
        name: "mapToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        name: "processedExits",
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
            internalType: "bytes32",
            name: "tokenType",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "predicateAddress",
            type: "address",
          },
        ],
        name: "registerPredicate",
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
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "rootToChildToken",
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
            internalType: "address",
            name: "newCheckpointManager",
            type: "address",
          },
        ],
        name: "setCheckpointManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newChildChainManager",
            type: "address",
          },
        ],
        name: "setChildChainManagerAddress",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newStateSender",
            type: "address",
          },
        ],
        name: "setStateSender",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "setupContractId",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "stateSenderAddress",
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
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "tokenToType",
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
            name: "",
            type: "bytes32",
          },
        ],
        name: "typeToPredicate",
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
        stateMutability: "payable",
        type: "receive",
      },
    ];

  // const mainWeb3 = new Web3(
  //   "https://mainnet.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959"
  // );
  // const maticWeb3 = new Web3(
  //   "https://rpc-mainnet.maticvigil.com/v1/ccb543453ee1affc879932231adcc00adb350518"
  // );

  const maticPOSClient = new MaticPOSClient({
    network: "mainnet",
    version: "v1",
    parentProvider:
      "https://mainnet.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959",
    maticProvider:
      "https://rpc-mainnet.maticvigil.com/v1/ccb543453ee1affc879932231adcc00adb350518",
  });

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
      `https://api.polygonscan.com/api?module=account&action=txlist&address=${_addr}&startblock=16385793&endblock=99999999&sort=asc`,
      true
    );
    txReq.send(null);
    let erc20Req = new XMLHttpRequest();
    erc20Req.open(
      "GET",
      `https://api.polygonscan.com/api?module=account&action=tokentx&address=${_addr}&startblock=0&endblock=19999999&sort=asc`,
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
          e.to === "0x45f7c1ec0f0e19674a699577f9d89fb5424acf1f"
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

  const checkTxs = (
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
      maticPOSClient
        .exitERC20(withdrawals[iteration], { from: _addr, encodeAbi: true })
        .then(() => {
          checkTxs(
            _web3,
            _addr,
            withdrawals,
            erc20Txs,
            discards,
            iteration + 1
          );
        })
        .catch((e) => {
          console.log(e.message);
          if (
            e.message.includes("Burn transaction has not been checkpointed")
          ) {
            console.log("Burn transaction has not yet been checkpointed");
            swal({
              title: "We detected a pending POLYGON -> ETH transaction.",
              text: `TxID: ${withdrawals[iteration]}\n\n It will be available to redeem once it has been checkpointed on Polygon. This may take a few minutes.`,
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
          withdrawals.shift();
          return checkTxs(
            _web3,
            _addr,
            withdrawals,
            erc20Txs,
            discards,
            iteration
          );
        });
    }
  };

  const redeem = (list) => {
    list = JSON.parse(JSON.stringify(list))
    console.log(currentChain, redeemList.length, findingTxs);
    console.log(list);
    if (list.length > 0) {
      let current = list.shift();
      console.log(current);
      setRedeeming(true);
      maticPOSClient
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
            .catch(() => {
              setRedeeming(false);
              console.log("Already redeemed or invalid");
            });
        });
    } else return console.log("Done redeeming");
  };

  const swap = () => {
    if (!amountToSwap || amountToSwap <= 0)
      return swal({
        title: "Please input a number greater than zero.",
        icon: "warning",
        button: "Close",
      });
    else if (Number(amountToSwap) > Number(prufBalance))
      return swal({
        title: "Submitted amount exceeds PRUF balance",
        icon: "warning",
        button: "Close",
      });
    console.log(`Amount: ${amountToSwap}`);
    if (currentChain === "Ethereum") {
      util.methods
        .allowance(addr, ERC20_Predicate_ADDRESS)
        .call(async (error, result) => {
          if (!error) {
            if (web3.utils.fromWei(result) === "0") {
              swalReact({
                icon: "warning",
                content: (
                  <Card className="delegationCard">
                    <h4 className="delegationTitle">Authorize Token Bridge</h4>
                    <h5 className="finalizingTipsContent">
                      In order to authorize a token bridge, you must confirm the
                      amount to be transferred, and that the address authorizing
                      the bridge is correct.
                    </h5>
                    <h5 className="finalizingTipsContent">
                      Please review below.
                    </h5>
                    <div className="delegationTips">
                      <h4 className="alertText">
                        Amount to Send: ü{amountToSwap}
                      </h4>
                    </div>
                    <div className="delegationTips">
                      <h4 className="alertTextSm">From address: {addr}</h4>
                    </div>
                    <div className="delegationTips">
                      <h4 className="alertText">From Chain: {currentChain}</h4>
                    </div>
                    <div className="delegationTips">
                      <h4 className="alertText">To Chain: Polygon</h4>
                    </div>
                  </Card>
                ),
                buttons: {
                  back: {
                    text: "Go Back",
                    value: "back",
                    className: "delegationButtonBack",
                  },
                  confirm: {
                    text: "Confirm",
                    value: "confirm",
                    className: "delegationButtonBack",
                  },
                },
              }).then((value) => {
                switch (value) {
                  case "confirm":
                    setTransacting(true);
                    setAllowance(true);
                    const amount = web3.utils.toWei(amountToSwap);
                    const depositData = web3.eth.abi.encodeParameter(
                      "uint256",
                      amount
                    );
                    util.methods
                      .approve(ERC20_Predicate_ADDRESS, amount)
                      .send({ from: addr })
                      .on("error", () => {
                        console.log("ERROR INCREASING ALLOWANCE");
                        setTransacting(false);
                        setAllowance(false);
                      })
                      .on("receipt", () => {
                        swalReact({
                          icon: "warning",
                          content: (
                            <Card className="delegationCard">
                              <h4 className="delegationTitle">
                                Authorize Send
                              </h4>
                              <h5 className="finalizingTipsContent">
                                Now that the bridge has been authorized, you
                                must confirm the transfer of tokens to be sent.
                              </h5>
                              <h5 className="finalizingTipsContent">
                                Please review below.
                              </h5>
                              <div className="delegationTips">
                                <h4 className="alertText">
                                  Amount to Send: ü{amountToSwap}
                                </h4>
                              </div>
                              <div className="delegationTips">
                                <h4 className="alertTextSm">
                                  From address: {addr}
                                </h4>
                              </div>
                              <div className="delegationTips">
                                <h4 className="alertText">
                                  From Chain: {currentChain}
                                </h4>
                              </div>
                              <div className="delegationTips">
                                <h4 className="alertText">To Chain: Polygon</h4>
                              </div>
                            </Card>
                          ),
                          buttons: {
                            back: {
                              text: "Go Back",
                              value: "back",
                              className: "delegationButtonBack",
                            },
                            confirm: {
                              text: "Confirm",
                              value: "confirm",
                              className: "delegationButtonBack",
                            },
                          },
                        }).then((value) => {
                          switch (value) {
                            case "confirm":
                              refreshBalances("eth", web3, addr);
                              setAllowance(false);
                              rootManager.methods
                                .depositFor(
                                  addr,
                                  web3.utils.toChecksumAddress(
                                    Util_Parent_ADDRESS
                                  ),
                                  depositData
                                )
                                .send({ from: addr })
                                .on("error", () => {
                                  console.log("ERROR DEPOSITING");
                                  setTransacting(false);
                                })
                                .on("receipt", () => {
                                  swal({
                                    title: `Successfully sent ü${amountToSwap} to polygon wallet`,
                                    icon: "success",
                                    button: "Close",
                                  });
                                  setTransacting(false);
                                  refreshBalances("both", web3, addr);
                                });
                              break;

                            case "back":
                              console.log("ERROR DEPOSITING");
                              setTransacting(false);
                              break;

                            default:
                              break;
                          }
                        });
                      });
                    break;

                  case "back":
                    console.log("ERROR INCREASING ALLOWANCE");
                    setTransacting(false);
                    setAllowance(false);
                    break;

                  default:
                    break;
                }
              });
            } else if (
              web3.utils.fromWei(result) !== "0" &&
              Number(web3.utils.fromWei(result)) >= Number(amountToSwap)
            ) {
              const amount = web3.utils.toWei(amountToSwap);
              const depositData = web3.eth.abi.encodeParameter(
                "uint256",
                amount
              );
              swalReact({
                icon: "warning",
                content: (
                  <Card className="delegationCard">
                    <h4 className="delegationTitle">Authorize Send</h4>
                    <h5 className="finalizingTipsContent">
                      Now that the bridge has been authorized, you must confirm
                      the transfer of tokens to be sent.
                    </h5>
                    <h5 className="finalizingTipsContent">
                      Please review below.
                    </h5>
                    <div className="delegationTips">
                      <h4 className="alertText">
                        Amount to Send: ü{amountToSwap}
                      </h4>
                    </div>
                    <div className="delegationTips">
                      {Number(web3.utils.fromWei(result)) > 100000000 ?
                      <h4 className="alertText">
                        Current allowance: Unlimited
                      </h4>
                      :
                      <h4 className="alertText">
                        Current allowance: ü{web3.utils.fromWei(result)}
                      </h4>
                      }
                    </div>
                    <div className="delegationTips">
                      <h4 className="alertTextSm">From address: {addr}</h4>
                    </div>
                    <div className="delegationTips">
                      <h4 className="alertText">From chain: {currentChain}</h4>
                    </div>
                    <div className="delegationTips">
                      <h4 className="alertText">To chain: Polygon</h4>
                    </div>
                  </Card>
                ),
                buttons: {
                  back: {
                    text: "Go Back",
                    value: "back",
                    className: "delegationButtonBack",
                  },
                  confirm: {
                    text: "Confirm",
                    value: "confirm",
                    className: "delegationButtonBack",
                  },
                },
              }).then((value) => {
                switch (value) {
                  case "confirm":
                    setTransacting(true);
                    setAllowance(false);
                    rootManager.methods
                      .depositFor(
                        addr,
                        web3.utils.toChecksumAddress(Util_Parent_ADDRESS),
                        depositData
                      )
                      .send({ from: addr })
                      .on("error", () => {
                        console.log("ERROR DEPOSITING");
                        setTransacting(false);
                      })
                      .on("receipt", () => {
                        swal({
                          title: `Successfully sent ü${amountToSwap} to polygon wallet`,
                          icon: "success",
                          button: "Close",
                        });
                        setTransacting(false);
                        refreshBalances("both", web3, addr);
                      });
                    break;

                  case "back":
                    console.log("ERROR DEPOSITING");
                    setTransacting(false);
                    break;

                  default:
                    break;
                }
              });
            } else if (
              web3.utils.fromWei(result) !== "0" &&
              Number(web3.utils.fromWei(result)) < Number(amountToSwap)
            ) {
              swalReact({
                icon: "warning",
                content: (
                  <Card className="delegationCard">
                    <h4 className="delegationTitle">Authorize Token Bridge</h4>
                    <h5 className="finalizingTipsContent">
                      In order to authorize a token bridge, you must confirm the
                      amount to be transferred, and that the address authorizing
                      the bridge is correct.
                    </h5>
                    <h5 className="finalizingTipsContent">
                      Please review below.
                    </h5>
                    <div className="delegationTips">
                      <h4 className="alertText">
                        Current allowance: ü{web3.utils.fromWei(result)}
                      </h4>
                    </div>
                    <div className="delegationTips">
                      <h4 className="alertText">
                        Amount to Send: ü{amountToSwap}
                      </h4>
                    </div>
                    <div className="delegationTips">
                      <h4 className="alertText">
                        Additional Allowance Required: ü
                        {Number(amountToSwap) -
                          Number(web3.utils.fromWei(result))}
                      </h4>
                    </div>
                    <div className="delegationTips">
                      <h4 className="alertTextSm">From address: {addr}</h4>
                    </div>
                    <div className="delegationTips">
                      <h4 className="alertText">From Chain: {currentChain}</h4>
                    </div>
                    <div className="delegationTips">
                      <h4 className="alertText">To Chain: Polygon</h4>
                    </div>
                  </Card>
                ),
                buttons: {
                  back: {
                    text: "Go Back",
                    value: "back",
                    className: "delegationButtonBack",
                  },
                  confirm: {
                    text: "Confirm",
                    value: "confirm",
                    className: "delegationButtonBack",
                  },
                },
              }).then((value) => {
                switch (value) {
                  case "confirm":
                    setTransacting(true);
                    setAllowance(true);
                    const amount = web3.utils.toWei(
                      `${
                        Number(amountToSwap) -
                        Number(web3.utils.fromWei(result))
                      }`
                    );
                    const depositData = web3.eth.abi.encodeParameter(
                      "uint256",
                      amount
                    );
                    util.methods
                      .increaseAllowance(ERC20_Predicate_ADDRESS, amount)
                      .send({ from: addr })
                      .on("error", () => {
                        console.log("ERROR INCREASING ALLOWANCE");
                        setAllowance(false);
                        setTransacting(false);
                      })
                      .on("receipt", () => {
                        swalReact({
                          icon: "warning",
                          content: (
                            <Card className="delegationCard">
                              <h4 className="delegationTitle">
                                Authorize Send
                              </h4>
                              <h5 className="finalizingTipsContent">
                                Now that the bridge has been authorized, you
                                must confirm the transfer of tokens to be sent.
                              </h5>
                              <h5 className="finalizingTipsContent">
                                Please review below.
                              </h5>
                              <div className="delegationTips">
                                <h4 className="alertText">
                                  Current allowance: ü
                                  {web3.utils.fromWei(result)}
                                </h4>
                              </div>
                              <div className="delegationTips">
                                <h4 className="alertText">
                                  Amount to Send: ü{amountToSwap}
                                </h4>
                              </div>
                              <div className="delegationTips">
                                <h4 className="alertTextSm">
                                  From address: {addr}
                                </h4>
                              </div>
                              <div className="delegationTips">
                                <h4 className="alertText">
                                  From Chain: {currentChain}
                                </h4>
                              </div>
                              <div className="delegationTips">
                                <h4 className="alertText">To Chain: Polygon</h4>
                              </div>
                            </Card>
                          ),
                          buttons: {
                            back: {
                              text: "Go Back",
                              value: "back",
                              className: "delegationButtonBack",
                            },
                            confirm: {
                              text: "Confirm",
                              value: "confirm",
                              className: "delegationButtonBack",
                            },
                          },
                        }).then((value) => {
                          switch (value) {
                            case "confirm":
                              refreshBalances("eth", web3, addr);
                              setAllowance(false);
                              rootManager.methods
                                .depositFor(
                                  addr,
                                  web3.utils.toChecksumAddress(
                                    Util_Parent_ADDRESS
                                  ),
                                  depositData
                                )
                                .send({ from: addr })
                                .on("error", () => {
                                  console.log("ERROR DEPOSITING");
                                  setTransacting(false);
                                })
                                .on("receipt", () => {
                                  swal({
                                    title: `Successfully sent ü${amountToSwap} to polygon wallet`,
                                    icon: "success",
                                    button: "Close",
                                  });
                                  setTransacting(false);
                                  refreshBalances("both", web3, addr);
                                });
                              break;

                            case "back":
                              console.log("ERROR DEPOSITING");
                              setTransacting(false);
                              break;

                            default:
                              break;
                          }
                        });
                      });
                    break;

                  case "back":
                    console.log("ERROR INCREASING ALLOWANCE");
                    setAllowance(false);
                    break;

                  default:
                    break;
                }
              });
            }
          } else {
            return console.log("ERR");
          }
        });
    } else if (currentChain === "Polygon") {
      swalReact({
        icon: "warning",
        content: (
          <Card className="delegationCard">
            <h4 className="delegationTitle">Authorize Send</h4>
            <h5 className="finalizingTipsContent">
              Please confrm the token transfer you are attempting to send.
            </h5>
            <h5 className="finalizingTipsContent">Please review below.</h5>
            <div className="delegationTips">
              <h4 className="alertText">Amount to Send: ü{amountToSwap}</h4>
            </div>
            <div className="delegationTips">
              <h4 className="alertTextSm">From address: {addr}</h4>
            </div>
            <div className="delegationTips">
              <h4 className="alertText">From Chain: {currentChain}</h4>
            </div>
            <div className="delegationTips">
              <h4 className="alertText">To Chain: Ethereum</h4>
            </div>
          </Card>
        ),
        buttons: {
          back: {
            text: "Go Back",
            value: "back",
            className: "delegationButtonBack",
          },
          confirm: {
            text: "Confirm",
            value: "confirm",
            className: "delegationButtonBack",
          },
        },
      }).then((value) => {
        switch (value) {
          case "confirm":
            setTransacting(true);
            const amount = web3.utils.toWei(String(amountToSwap));
            util.methods
              .withdraw(amount)
              .send({ from: addr })
              .on("error", () => {
                swal({
                  title: "Error attempting withdrawal.",
                  icon: "warning",
                  button: "Close",
                });
                setTransacting(false);
              })
              .on("receipt", () => {
                setTransacting(false);
                setAmountToSwap();
                swal({
                  title: `Successfully sent ü${amountToSwap} to bridge.`,
                  icon: "success",
                  button: "Close",
                });
                refreshBalances("both", web3, addr);
              });
            break;

          case "back":
            swal({
              title: "Error attempting withdrawal.",
              icon: "warning",
              button: "Close",
            });
            setTransacting(false);
            break;

          default:
            break;
        }
      });
    } else {
      swal({
        title: "Something went wrong",
        icon: "warning",
        button: "Close",
      });
    }
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

    let _rootManager = new _web3.eth.Contract(Root_Mgr_ABI, Root_Mgr_ADDRESS);
    setRootManager(_rootManager);

    _web3.eth.net.getNetworkType().then((e) => {
      let _util;
      if (e === "private") {
        _web3.eth.net.getId().then((e) => {
          if (e === 137) {
            setTwinChain("Ethereum");
            setCurrentChain("Polygon");

            _util = new _web3.eth.Contract(Util_Child_ABI, Util_Child_ADDRESS);
            setUtil(_util);
            setIsRefreshingPruf(true);
            _util.methods.balanceOf(_addr).call(async (error, result) => {
              if (!error) {
                setPrufBalance(
                  Number(_web3.utils.fromWei(result)).toFixed(5).toString()
                );
              }
              setIsRefreshingPruf(false);
            });
          } else {
            swal({
              title: "Please connect to the Ethereum or Polygon main net",
              icon: "warning",
              button: "Close",
            });
          }
        });
      } else if (e === "main") {
        setTwinChain("Polygon");
        setCurrentChain("Ethereum");

        _util = new _web3.eth.Contract(Util_Parent_ABI, Util_Parent_ADDRESS);
        setUtil(_util);
        setIsRefreshingPruf(true);
        setFindingTxs(true);
        getMaticWithdrawals(_web3, _addr);
        _util.methods.balanceOf(_addr).call(async (error, result) => {
          if (!error) {
            setPrufBalance(
              Number(_web3.utils.fromWei(result)).toFixed(5).toString()
            );
          }
          setIsRefreshingPruf(false);
        });
      } else {
        setTwinChain("Polygon");
        setCurrentChain("Ethereum");
        swal({
          title: `You are connected to the network '${e}', please connect to the Ethereum or Polygon mainnet`,
          icon: "warning",
          button: "Close",
        });
      }
    });
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
      <br />
      <div className={mainPanelClasses} ref={mainPanel}>
        <div className="splitterForm">
          <br />
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader stats icon>
                  {currentChain === "Ethereum" ? (
                    <>
                      <CardIcon
                        className="headerIconBack"
                        onClick={() => window.open("https://ethereum.org/en/")}
                      >
                        <img className="Icon" src={Eth} alt=""></img>
                      </CardIcon>
                      <p className={classes.cardCategory}>ETH Balance</p>
                    </>
                  ) : (
                    <>
                      <CardIcon
                        className="headerIconBack"
                        onClick={() => window.open("https://ethereum.org/en/")}
                      >
                        <img className="Icon" src={Polygon} alt=""></img>
                      </CardIcon>
                      <p className={classes.cardCategory}>Matic Balance</p>
                    </>
                  )}
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
                      {currentChain === "Ethereum" && findingTxs === false && redeemList.length === 0 && (
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
            <CardHeader color="info" icon>
              <CardIcon className="headerIconBack">
                <span className="material-icons"> toll </span>
              </CardIcon>
              <h5 className={classes.cardIconTitle}>Token Bridge</h5>
            </CardHeader>
            {/* eslint-disable-next-line react/prop-types */}
            {!addr && (
              <CardBody>
                <form>
                  <h3 className="bump">
                    <br />
                    Please{" "}
                    <a
                      className="splitterA"
                      onClick={() => {
                        getAddress(web3);
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
                  <CustomInput
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value: amountToSwap,
                      type: "number",
                      onChange: (e) => {
                        setAmountToSwap(e.target.value); // Set undefined to remove entirely
                      },
                      placeholder: `0`,
                    }}
                  />
                  {!transacting ? (
                    <Button
                      color="info"
                      className="MLBGradient"
                      onClick={() => swap()}
                    >
                      {`Send to ${twinChain}`}
                    </Button>
                  ) : allowance ? (
                    <>
                      Setting allowance
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
                        onClick={() => swap()}
                      >
                        {`Send to ${twinChain}`}
                      </Button>
                    </>
                  ) : (
                    <>
                      Sending tokens to {twinChain} wallet
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
                        onClick={() => swap()}
                      >
                        {`Send to ${twinChain}`}
                      </Button>
                    </>
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
