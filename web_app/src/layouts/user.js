import React from "react";
import cx from "classnames";
import swal from "sweetalert";
import "../assets/css/custom.css";
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
  SettingsBackupRestore,
  TrendingUpSharp,
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
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Accordion from "@material-ui/core/Accordion";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Eth from "../assets/img/eth-logo2.png";
import Polygon from "../assets/img/matic-token-inverted-icon.png";

import routes from "routes.js";

import userStyle from "assets/jss/material-dashboard-pro-react/layouts/userStyle.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { Icon } from "@material-ui/core";
import { isConstructorDeclaration } from "typescript";

var ps;
const UTIL_ADDRESS = "0xf9393D7ce74A8089A4f317Eb6a63623275DeD381";
const STAKE_ADDRESS = "0x1e8Fd4587b5Fe06A205E9c9e010274cFE6A367ee";
const STAKE_TKN_ADDRESS = "0x36F717F8430D51580E1E02Cd452Ab71584Be6eF2";

const UTIL_ABI = [
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
        name: "_to",
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
        name: "_NTHaddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_NTHprice",
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
];

const STAKE_ABI = [
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
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "breakStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "claimBonus",
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
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "uint256",
        name: "_stakeTier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_max",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_interval",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bonus",
        type: "uint256",
      },
    ],
    name: "setStakeLevels",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_utilAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_stakeAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_stakeVaultAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_rewardsVaultAddress",
        type: "address",
      },
    ],
    name: "setTokenContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_stakeTier",
        type: "uint256",
      },
    ],
    name: "stakeMyTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_ERC721Contract",
        type: "address",
      },
    ],
    name: "transferERC721Token",
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
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ASSET_TXFR_ROLE",
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
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "checkEligibleRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "eligibleRewards",
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
        internalType: "uint256",
        name: "_stakeTier",
        type: "uint256",
      },
    ],
    name: "getStakeLevel",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "stakeInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const STAKE_TKN_ABI = [
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
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
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
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
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
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
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
    inputs: [],
    name: "baseURI",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
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
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "burnStakeToken",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
        name: "_recipientAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "mintStakeToken",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
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
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
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
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
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
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
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

const useStyles = makeStyles(styles);
const userStyles = makeStyles(userStyle);

export default function Dashboard(props) {
  const { ...rest } = props;

  // states and functions
  const [miniActive, setMiniActive] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(true);
  const [addr, setAddr] = React.useState("");
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
  const [totalRewards, setTotalRewards] = React.useState(0);
  const [totalStaked, setTotalStaked] = React.useState(0);
  const [delegationList, setDelegationList] = React.useState([
    ["Loading Balances...", "~", "~", "~"],
  ]);
  const [findingTxs, setFindingTxs] = React.useState(false);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [logo, setLogo] = React.useState(require("assets/img/logo-white.svg"));
  const [splitter, setSplitter] = React.useState({});
  const [util, setUtil] = React.useState({});
  const [stake, setStake] = React.useState({});
  const [stakeTkn, setStakeTkn] = React.useState({});
  const [loadingSums, setLoadingSums] = React.useState(false);
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

  React.useEffect(() => {
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
        } else if (e[0].toLowerCase() !== addr.toLowerCase()) {
          window.location.reload();
        }
      });
    }

    let _web3 = require("web3");
    _web3 = new Web3(
      _web3.givenProvider ||
        "https://kovan.infura.io/v3/ab9233de7c4b4adea39fcf3c41914959"
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

  const getAddress = (_web3) => {
    _web3.eth.net.getId().then((e) => {
      if (e === 42) {
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
                setUpEnvironment(
                  _web3,
                  _web3.utils.toChecksumAddress(accounts[0])
                );
              }
            });
        } else {
        }
      } else {
        swalReact({
          icon: `warning`,
          text: `You are connected to network ID ${e}. Please connect to the ethereum kovan testnet`,
        });
      }
    });
  };

  const getActiveRoute = (routes) => {
    let activeRoute = "PRüF Staking";
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
      if (prop.layout === "/stake") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={() => <prop.component />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const refreshBalances = (job, _web3, _addr) => {
    if (!util.balanceOf)
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
    util.balanceOf(_addr).call(async (error, result) => {
      if (!error) {
        setPrufBalance(
          Number(web3.utils.fromWei(result)).toFixed(5).toString()
        );
      }
      setIsRefreshingPruf(false);
    });
  };

  const refreshDash = () => {
    setLoadingSums(true);
    getHeldStake(web3, stake, stakeTkn, addr);
  };

  const parseTotalRedeemable = (arr) => {
    let _totalRewards = 0;
    let _totalStaked = 0;

    arr.forEach((props) => {
      if (props[9]) {
        _totalRewards += Number(props[9]);
        _totalStaked += Number(props[8]);
      }
    });

    setTotalRewards(_totalRewards.toFixed(2));
    setTotalStaked(_totalStaked.toFixed(2));
    setLoadingSums(false);
  };

  const getHeldStake = async (_web3, _stake, _tkn, _addr) => {
    let currentBlock = await _web3.eth.getBlock("latest");

    const getStakeIds = (bal, ids, iteration) => {
      if (!bal) {
        setDelegationList([[``, ``, ``, ``, ``]]);
        return console.log(`Balances undefined`);
      }
      if (!iteration) iteration = 0;
      if (!ids) ids = [];

      if (ids.length >= bal) return getStakeData(ids, []);

      _tkn.tokenOfOwnerByIndex(_addr, iteration).call(async (error, result) => {
        if (!error) {
          console.log(result);
          ids.push(result);
          return getStakeIds(bal, ids, iteration + 1);
        } else {
          console.error(error);
          bal--;
          return getStakeIds(bal, ids, iteration + 1);
        }
      });
    };

    const getStakeData = (ids, arr, iteration) => {
      if (!iteration) iteration = 0;
      if (ids.length <= arr.length) {
        parseTotalRedeemable(arr);
        arr.push([``, ``, ``, ``, ``]);
        return setDelegationList(arr);
      }

      _stake.stakeInfo(ids[iteration]).call(async (error, result) => {
        if (!error) {
          console.log(result);
          let amount = Number(_web3.utils.fromWei(result["0"]));
          let timeElapsed = (Number(currentBlock.timestamp) - Number(result["1"]))/86400
          let interval = Number(result["3"]);
          let bonus = Number(_web3.utils.fromWei(result["4"]));
          _stake
            .checkEligibleRewards(ids[iteration])
            .call(async (error, result) => {
              if (!error) {
                console.log(result);
                // //@dev overflow date case
                // let percentComplete = timeElapsed / (Number(result["3"]) * 86400)
                // let rewardsBalance = percentComplete * Number(_web3.utils.fromWei(result["4"]))
                let intervalToYear = 365 / interval;
                let apy = (bonus / amount * 100) * intervalToYear;
                let percentComplete = timeElapsed / interval * 100;
                let rewards = Number(_web3.utils.fromWei(result["0"]));
                arr.push([
                  `${ids[iteration]}`,
                  `${apy.toFixed(0)}%`,
                  `ü${amount.toFixed(0)}`,
                  `ü${rewards.toFixed(2)}`,
                  `${percentComplete.toFixed(2)}%`,
                  interval,
                  bonus,
                  percentComplete,
                  amount,
                  rewards,
                ]);
                getStakeData(ids, arr, iteration + 1);
              }
            });
        } else {
          console.error(error);
        }
      });
    };

    _tkn.balanceOf(_addr).call(async (error, result) => {
      if (!error) {
        getStakeIds(result);
      } else {
        console.error(error);
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

  const setUpEnvironment = (_web3, _addr) => {
    console.log("setting up environment");
    setIsRefreshingEther(true);
    setIsRefreshingPruf(true);
    setLoadingSums(true);

    let _util = new _web3.eth.Contract(UTIL_ABI, UTIL_ADDRESS);
    let _stake = new _web3.eth.Contract(STAKE_ABI, STAKE_ADDRESS);
    let _stakeTkn = new _web3.eth.Contract(STAKE_TKN_ABI, STAKE_TKN_ADDRESS);

    setStake(_stake.methods);
    setStakeTkn(_stakeTkn.methods);
    setUtil(_util.methods);

    _web3.eth.getBalance(_addr).then(async (e) => {
      setEtherBalance(Number(_web3.utils.fromWei(e)).toFixed(5).toString());
      setIsRefreshingEther(false);
    });

    _util.methods.balanceOf(_addr).call(async (error, result) => {
      setIsRefreshingPruf(false);
      setPrufBalance(_web3.utils.fromWei(result));
    });

    getHeldStake(_web3, _stake.methods, _stakeTkn.methods, _addr);
  };

  const claimRewards = (index, id) => {
    console.log((delegationList[index][7] / 100) * delegationList[index][5]);
    let isReady =
      (delegationList[index][7] / 100) * delegationList[index][5] > 1;
    let timeLeft =
      24 - (delegationList[index][7] / 100) * delegationList[index][5] * 24;
    let timeUnit = "hours"
    timeLeft = timeLeft.toFixed(2);

    if(timeLeft < 1) {
      timeLeft = timeLeft * 60
      timeUnit = "minutes"
    }

    if (isReady) {
      stake
        .claimBonus(id)
        .send({ from: addr })
        .on("reciept", () => {
          swalReact({
            icon: "success",
            text: `Successfully redeemed PRUF rewards!`,
          });
          refreshDash()
        });
    } else {
      return swalReact({
        icon: "warning",
        text: `Holders must wait 24 hours after initial stake or redeeming thier balance before claiming rewards. Please wait ~${timeLeft} ${timeUnit} before redeeming.`,
      }).then(() => {
        viewStake(index);
      });
    }
  };

  const viewStake = (index) => {
    console.log("view me!", index);

    swalReact({
      //icon: "warning",
      content: (
        <Card className="delegationCard">
          <h4 className="delegationTitle">Delegation Details</h4>

          <h5 className="">
            {`
                  Stake token ID: ${delegationList[index][0]}
                `}
          </h5>
          <h5 className="">
            {`
                Annual percentage yield: ${delegationList[index][1]}
              `}
          </h5>
          <h5 className="">
            {`
                Amount delegated: ${delegationList[index][2]}
              `}
          </h5>
          <h5 className="">
            {`
                Redeemable rewards: ${delegationList[index][3]}
              `}
          </h5>
          <h5 className="">
            {`
                Unlock percent complete: ${delegationList[index][4]}
              `}
          </h5>
        </Card>
      ),
      buttons: {
        back: {
          text: "Go Back",
          value: "back",
          className: "delegationButtonBack",
        },
        confirm: {
          text: "Redeem Rewards",
          value: "Redeem",
          className: "delegationButtonBack",
        },
      },
    }).then((value) => {
      if (value === "Redeem") {
        claimRewards(index, String(delegationList[index][0]));
      } else return;
    });
  };

  const newStake = () => {
    let delegateAmount;
    let isChecked = {
      chk1: false,
      chk2: false,
      chk3: false,
    };
    const showOptions = () => {
      let component = [];

      tierOptions.forEach((props) => {
        component.push(
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions1-content"
              id={`additional-actions1-header-${props.id}`}
            >
              <FormControlLabel
                aria-label="Acknowledge"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onFocus={(event) => {
                  event.stopPropagation();
                }}
                control={
                  <Checkbox
                    onClick={() =>
                      (isChecked[`chk${props.id}`] =
                        !isChecked[`chk${props.id}`])
                    }
                  />
                }
                label={`Tier ${props.id}`}
              />
            </AccordionSummary>
            <AccordionDetails>
              {/* <Typography color="textSecondary">
                {`
                  Minimum allocation: ${props.min}
                  `}
              </Typography>
              <Typography color="textSecondary">
                {`
                  Maximum allocation: ${props.max}
                  `}
              </Typography> */}
              <Typography color="textSecondary">
                {`
                  Lock duration: ${props.interval} days
                  `}
              </Typography>
              <br />
              <Typography color="textSecondary">
                {`
                  APY: ${props.apy}%
                  `}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      });

      return component;
    };

    const tierOptions = [
      {
        id: 1,
        apy: 608,
        max: 100000000,
        min: 100,
        interval: 3,
        eligible: prufBalance > 100,
      },
      {
        id: 2,
        apy: 1217,
        max: 100000000,
        min: 100,
        interval: 3,
        eligible: prufBalance > 100,
      },
      {
        id: 3,
        apy: 2190,
        max: 100000000,
        min: 100,
        interval: 3,
        eligible: prufBalance > 100,
      },
      {
        id: 4,
        apy: 1825,
        max: 100000000,
        min: 100,
        interval: 3,
        eligible: prufBalance > 100,
      },
      {
        id: 5,
        apy: 1825,
        max: 100000000,
        min: 100,
        interval: 3,
        eligible: prufBalance > 100,
      },
    ];

    swalReact({
      //icon: "warning",
      content: (
        <Card className="delegationCard">
          <h4 className="delegationTitle">Delegate Funds</h4>
          <h5 className="finalizingTipsContent">
            First, select your preferred staking tier:
          </h5>
          {showOptions()}
        </Card>
      ),
      buttons: {
        back: {
          text: "Go Back",
          value: "back",
          className: "delegationButtonBack",
        },
        confirm: {
          text: "Next",
          value: isChecked,
          className: "delegationButtonBack",
        },
      },
    }).then((value) => {

      if (typeof value !== "object" || value === null) {
        return;
      } 
      
      let trues = [];
      let vals = Object.values(value)

      vals.forEach(e=>{
        if (e === true) trues.push(true)
      })

      if (
        trues.length > 1
      ) {
        return swalReact({
          icon: "warning",
          text: "Please select only 1 option!",
        }).then(() => newStake());
      } else if (
        trues.length === 0
      ) {
        return swalReact({
          icon: "warning",
          text: "Please select an option!",
        }).then(() => newStake());
      } else {
        let id = String(Object.values(value).indexOf(true) + 1);
        swalReact({
          content: (
            <Card className="delegationCard">
              <h4 className="delegationTitle">Delegate Funds</h4>
              <h5 className="finalizingTipsContent">
                Now, input the amount you want to stake:
              </h5>
              <CustomInput
                labelText={`Minimum: ${
                  tierOptions[Number(id) - 1].min
                }`}
                id="CI1"
                inputProps={{
                  type: "number",
                  maxLength: 9,
                  onChange: (event) => {
                    delegateAmount = event.target.value.trim();
                    console.log(delegateAmount);
                  },
                }}
              />
            </Card>
          ),
          buttons: {
            back: {
              text: "Go Back",
              value: "back",
              className: "delegationButtonBack",
            },
            confirm: {
              text: "Stake Tokens",
              value: "confirm",
              className: "delegationButtonBack",
            },
          },
        }).then((value) => {
          if (value === "confirm") {
            if (delegateAmount < tierOptions[Number(id) - 1].min) {
              return swalReact(
                `The minimum value for this staking tier is ${
                  tierOptions[Number(id) - 1].min
                }`
              ).then(() => newStake());
            }
            let amount = web3.utils.toWei(delegateAmount);
            console.log(amount);
            stake
              .stakeMyTokens(amount, id)
              .send({ from: addr })
              .on("receipt", () => {
                swalReact({
                  icon: "success",
                  text: "Your PRUF has been staked successfully!",
                });
                refreshDash();
                return refreshBalances("both", web3, addr);
              });
          } else {
            return newStake();
          }
        });
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
      <div className={mainPanelClasses} ref={mainPanel}>
        <div className="splitterForm">
          <br />
          <GridContainer className="top-margin">
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
                  <p className={classes.cardCategory}>{`PRUF Balance`}</p>
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
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon
                    className="headerIconBack"
                    onClick={() => window.open("https://pruf.io/")}
                  >
                    <span className="material-icons">redeem</span>
                  </CardIcon>
                  <p
                    className={classes.cardCategory}
                  >{`Total Redeemable Rewards`}</p>
                  {totalRewards ? (
                    <h3 className={classes.cardTitle}>
                      <>{String(totalRewards)} </>
                    </h3>
                  ) : (
                    <h3 className={classes.cardTitle}>~</h3>
                  )}
                </CardHeader>
                <CardFooter stats>
                  {!loadingSums && (
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
                              refreshDash();
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
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon
                    className="headerIconBack"
                    onClick={() => window.open("https://pruf.io/")}
                  >
                    <span className="material-icons">savings</span>
                  </CardIcon>
                  <p className={classes.cardCategory}>{`Total Staked`}</p>
                  {totalStaked ? (
                    <h3 className={classes.cardTitle}>
                      <>{String(totalStaked)} </>
                    </h3>
                  ) : (
                    <h3 className={classes.cardTitle}>~</h3>
                  )}
                </CardHeader>
                <CardFooter stats>
                  {!loadingSums && (
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
                              refreshDash();
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
                        refreshDash();
                      }}
                    >
                      <Cached />
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
            {!isMobile && (
              <CardBody>
                <ReactTable
                  columns={[
                    {
                      Header: "Stake ID",
                      accessor: "id",
                    },
                    {
                      Header: "Staking Yield (APY)",
                      accessor: "lvl",
                    },
                    {
                      Header: "Delegated Balance",
                      accessor: "balance",
                    },
                    {
                      Header: "Rewards Balance",
                      accessor: "rewards",
                    },
                    {
                      Header: "Unlock Progress",
                      accessor: "date",
                    },
                    {
                      Header: "",
                      accessor: "actions",
                    },
                  ]}
                  data={delegationList.map((prop, key) => {
                    return {
                      id: prop[0],
                      lvl: prop[1],
                      balance: prop[2],
                      rewards: prop[3],
                      date: prop[4],
                      actions: (
                        // we've added some custom button actions
                        <div className="actions-right">
                          {/* use this button to add a like kind of action */}
                          {prop[0] !== "Loading Balances..." && prop[0] !== "" && (
                            <Button
                              //justIcon
                              //round
                              //simple
                              onClick={() => {
                                viewStake(key);
                              }}
                              color="info"
                              className="MLBGradient"
                            >
                              View
                            </Button>
                          )}
                          {prop[0] === "" && (
                            <Button
                              onClick={() => {
                                newStake();
                              }}
                              color="info"
                              className="MLBGradient"
                            >
                              New Stake
                            </Button>
                          )}
                          {prop[0] === "Loading Balances..." && (
                            <Button
                              disabled
                              onClick={() => {
                                newStake();
                              }}
                              color="info"
                              className="MLBGradient"
                            >
                              New Stake
                            </Button>
                          )}
                        </div>
                      ),
                    };
                  })}
                />
              </CardBody>
            )}
            {isMobile && (
              <CardBody>
                <ReactTable
                  columns={[
                    {
                      Header: "ID",
                      accessor: "id",
                    },
                    {
                      Header: "Delegated",
                      accessor: "balance",
                    },
                    {
                      Header: "Rewards",
                      accessor: "rewards",
                    },
                    {
                      Header: "",
                      accessor: "actions",
                    },
                  ]}
                  data={delegationList.map((prop, key) => {
                    return {
                      id: prop[0],
                      balance: prop[2],
                      rewards: prop[3],
                      actions: (
                        // we've added some custom button actions
                        <div className="actions-right">
                          {/* use this button to add a like kind of action */}
                          {prop[0] !== "Loading Balances..." &&
                            prop[0] !== "" && <></>}
                          {prop[0] === "" && (
                            <Button
                              onClick={() => {
                                newStake();
                              }}
                              color="info"
                              className="MLBGradient"
                            >
                              New Stake
                            </Button>
                          )}
                          {prop[0] === "Loading Balances..." && (
                            <Button
                              disabled
                              onClick={() => {
                                newStake();
                              }}
                              color="info"
                              className="MLBGradient"
                            >
                              New Stake
                            </Button>
                          )}
                        </div>
                      ),
                    };
                  })}
                />
              </CardBody>
            )}
          </Card>
        </div>
        <Footer fluid />
      </div>
    </div>
  );
}
