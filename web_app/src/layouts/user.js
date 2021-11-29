//PRUF STAKING INTERFACE

import React from "react";
import cx from "classnames";
import "../assets/css/custom.css";
import Web3 from "web3";
import { Route } from "react-router-dom";
import ReactTable from "../components/ReactTable/ReactTable.js";
import CustomLinearProgress from "../components/CustomLinearProgress/CustomLinearProgress.js";
import { isMobile } from "react-device-detect";
import swalReact from "@sweetalert/with-react";
// creates a beautiful scrollbar

import PerfectScrollbar from "perfect-scrollbar";

import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import Tooltip from "@material-ui/core/Tooltip";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import {
  Cached,
  DashboardOutlined,
  FiberManualRecordTwoTone,
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
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import UAuth from "@uauth/js";

import Eth from "../assets/img/eth-logo2.png";
import Polygon from "../assets/img/matic-token-inverted-icon.png";
import ABIs from "./ABIs";

import routes from "routes.js";

import userStyle from "assets/jss/material-dashboard-pro-react/layouts/userStyle.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { Icon } from "@material-ui/core";

const uauth = new UAuth({
  // Client credentials copied from https://unstoppabledomains.com/app-dashboard
  clientID: "Q2pO03hsT5gMk0IxAacVZoloemjGBzvVEzxaofTHnmA=",
  clientSecret: "wVY1yzeGYoiTk579LvyO1Od4hdrQ3yjCzZu8w3Fzdwk=",

  // Requested scopes.
  scope: "openid wallet",

  // Redirect Uris copied from https://unstoppabledomains.com/app-dashboard
  redirectUri: "https://staking.pruf.io/callback",
  // postLogoutRedirectUri: "",
});

var ps;

const KOVAN_UTIL_ADDRESS = "0xaAa5a0D9dfC5B21A8100f608D12924dEfDd90E43",
  KOVAN_STAKE_ADDRESS = "0x4f4B4652AaB870C21697fedC8aAB2189e63CB049",
  KOVAN_STAKE_TKN_ADDRESS = "0xF58F2B320a95a75fd1Ec252D3018636bDD5c49a4";

const MUMBAI_UTIL_ADDRESS = "0x45f7c1eC0F0e19674A699577F9d89fB5424Acf1F",
  MUMBAI_STAKE_ADDRESS = "0xB30c01fC29f97339E1eb6890a56CA1a907ca961D",
  MUMBAI_STAKE_TKN_ADDRESS = "0x8Cea13A98a0143cfab5336fF5103C41f874d64Ea";

const ETH_UTIL_ADDRESS = "0xa49811140E1d6f653dEc28037Be0924C811C4538",
  ETH_STAKE_ADDRESS = "0x8B7e69886b944BC7456b4CAB471BFe99e61Dd1Be",
  ETH_STAKE_TKN_ADDRESS = "0xA39E7b9EFd9801A8da6B1F2d3bf7c381599D06bc";

const POLY_UTIL_ADDRESS = "0xAdf72D32E511eE00c6E0FF5D62Cd5C7C40A6aDEA",
  POLY_STAKE_ADDRESS = "0x388878e143b0c4ae2637d81bec6e173cace9b1ed",
  POLY_STAKE_TKN_ADDRESS = "0xd68bc9a69343dde6ebef1546bd09f3f43fe308c8";

const UTIL_ABI = ABIs.UTIL_ABI;
const STAKE_ABI = ABIs.STAKE_ABI;
const STAKE_TKN_ABI = ABIs.STAKE_TKN_ABI;

const useStyles = makeStyles(styles);
const userStyles = makeStyles(userStyle);

export default function Dashboard(props) {
  const { ...rest } = props;

  // states and functions
  const [miniActive, setMiniActive] = React.useState(true);
  const [addr, setAddr] = React.useState("");
  const [etherBalance, setEtherBalance] = React.useState("");
  const [prufBalance, setPrufBalance] = React.useState("");
  const [isRefreshingEther, setIsRefreshingEther] = React.useState(false);
  const [isRefreshingPruf, setIsRefreshingPruf] = React.useState(false);
  const [redeeming, setRedeeming] = React.useState(false);
  const [currentChainExplorer, setCurrentChainExplorer] = React.useState("");
  const [tokenInfo, setTokenInfo] = React.useState({});
  const [udSub, setUdSub] = React.useState("Login with UD");
  const [web3, setWeb3] = React.useState();
  const [redeemAmount, setRedeemAmount] = React.useState("0");
  const [redeemList, setRedeemList] = React.useState([]);
  const [totalRewards, setTotalRewards] = React.useState(0);
  const [totalStaked, setTotalStaked] = React.useState(0);
  const [delegationList, setDelegationList] = React.useState([
    ["Loading Balances...", "~", "~", "~"],
  ]);
  const [findingTxs, setFindingTxs] = React.useState(false);
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [tierOptions, setTierOptions] = React.useState([[], [], [], []]);
  const [sps, setSps] = React.useState(undefined);
  //const [tierOptions, setTierOptions] = React.useState([]);
  const [chainId, setChainId] = React.useState();
  const [util, setUtil] = React.useState({});
  const [stake, setStake] = React.useState({});
  const [stakeTkn, setStakeTkn] = React.useState({});
  const [loadingSums, setLoadingSums] = React.useState(false);
  const [yearlyRewards, setYearlyRewards] = React.useState(0);
  const [rewardsDivisor, setRewardsDivisor] = React.useState(1);
  const [rewardsUnit, setRewardsUnit] = React.useState("Year");
  const unitOptions = [
    "Create a merge commit",
    "Squash and merge",
    "Rebase and merge",
  ];
  window.udSub = ""
  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  // styles
  const classes = useStyles();
  const userClasses = userStyles();
  const startAfter = 0;
  const rewardAssets = {
    units: ["Year", "Month", "Week", "Day"],
    divisors: [1, 12, 52, 365],
  };
  const tierEmojis = ["", "🥉", "🥈", "🥇", "🚀", "💎"];
  const tierDescriptions = [
    "",
    "Lowest EO staking tier. For those who prefer a flexible arrangement.",
    "One month of token lock for generous staking rewards.",
    "60 days of stake unlock means high rewards. For the entry-level HODLer.",
    "Second highest staking tier. For true believers in the ecosystem.",
    "Highest EO staking tier. For serious HODLers who want serious rewards.",
  ];
  const tierNames = [
    "",
    "Bronze Tier",
    "Silver Tier",
    "Gold Tier",
    "Moon Tier",
    "Diamond Tier",
  ];

  const udLoginEvent = new Event("udLogin");
  const mmLoginEvent = new Event("mmLogin");

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
      //console.log(window.ethereum);
      window.ethereum.on("chainChanged", (chainId) => {
        console.log(chainId);
        window.location.reload();
      });

      document.addEventListener("visibilitychange", function () {
        refreshDash();
      });

      window.ethereum.on("accountsChanged", (e) => {
        console.log("Accounts changed");
        if (e[0] === undefined || e[0] === null) {
          if (e[0] !== addr) {
            clearPage();
          }
        } else if (e[0].toLowerCase() !== addr.toLowerCase()) {
          getMMAddress();
        }
      });
    }

    window.addEventListener("udLogin", udHandle);
    window.addEventListener("mmLogin", mmHandle);
    //console.log({ _web3 });

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

    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener("udLogin", udHandle);
      window.removeEventListener("mmLogin", mmHandle);
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  }, []);

  const mmHandle = () => {
    getMMAddress();
  };

  const udHandle = () => {
    console.log(`window udSub: ${window.udSub}`)
    if (window.udSub === "") {
      uauth
        .loginWithPopup()
        .then(() =>
          uauth.user().then((e) => {
            setUpWithUd(e);
          })
        )
        .catch(console.error)
        .finally(() => console.log(`Finished logging in! Welcome.`));
    } else {
      swalReact({
        icon: "info",
        text: `Logged in as ${window.udSub}.`,
        buttons: {
          back: {
            text: "⬅️ Go Back",
            value: "back",
            className: "delegationButtonBack",
          },
          logout: {
            text: "Logout 🔐",
            value: "logout",
            className: "delegationButtonBack",
          },
          switch: {
            text: "Switch User 👤",
            value: "switch",
            className: "delegationButtonBack",
          },
        },
      }).then((value) => {
        if (value === "logout") {
          uauth.logout().then(() => {
            setUdSub("Login with UD");
            window.udSub = ""
            clearPage();
          });
        } else if (value === "switch") {
          uauth
            .loginWithPopup()
            .then(() =>
              uauth.user().then((e) => {
                setUpWithUd(e);
              })
            )
            .catch(console.error)
            .finally(() => console.log(`Finished logging in! Welcome.`));
        }
      });
    }
  };

  const determineProvider = async () => {
    let _web3 = require("web3");

    _web3 = new Web3(_web3.givenProvider);

    setWeb3(_web3);
  };

  const clearPage = () => {
    setAddr(null);
    setChainId(0);
    setEtherBalance("");
    setPrufBalance("");
    setTotalStaked(0);
    setTotalRewards(0);
    setUtil({});
    setStake({});
    setStakeTkn({});
    setTokenAddress("");
  };

  const addToken = async () => {
    if (tokenAddress && window.ethereum) {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: "PRUF", // A ticker symbol or shorthand, up to 5 chars.
            decimals: "18", // The number of decimals in the token
            image:
              "https://preview.redd.it/2yzbaaqa0f361.png?auto=webp&s=b4dcb15cb4a27dd5262116618f4d6f4b9d723d64", // A string url of the token logo
          },
        },
      });
    }
  };

  const setUpWithUd = (ud) => {
    let _web3 = require("web3");

    setUdSub(ud.sub);
    window.udSub = ud.sub
    setAddr(ud.wallet_address);

    _web3 = new Web3(_web3.givenProvider);

    setWeb3(_web3);

    _web3.eth.net.getId().then((chainId) => {
      setUpEnvironment(_web3, _web3.utils.toChecksumAddress(ud.wallet_address), chainId);
    });
  };

  const getMMAddress = () => {
    setUdSub("Login with UD")
    window.udSub = ""
    let _web3 = require("web3");

    _web3 = new Web3(_web3.givenProvider);

    setWeb3(_web3);

    _web3.eth.net.getId().then((chainId) => {
      if (
        chainId === 42 ||
        chainId === 80001 ||
        chainId === 1 ||
        chainId === 137
      ) {
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
                    if (accounts[0] === undefined) {
                      return swalReact({
                        title: "Can't connect to wallet.",
                        icon: "warning",
                        buttons: {
                          back: {
                            text: "Okay",
                            value: "back",
                            className: "delegateButtonBackCentered",
                          },
                        },
                      });
                    } else {
                      //if(addr.toLowerCase === accounts[0].toLowerCase) return
                      console.log(_web3.utils.toChecksumAddress(accounts[0]));
                      setAddr(_web3.utils.toChecksumAddress(accounts[0]));
                      setUpEnvironment(_web3, accounts[0], chainId);
                    }
                  });
              } else {
                //if(addr.toLowerCase === accounts[0].toLowerCase) return
                console.log(_web3.utils.toChecksumAddress(accounts[0]));
                setAddr(_web3.utils.toChecksumAddress(accounts[0]));
                setUpEnvironment(_web3, accounts[0], chainId);
              }
            });
        } else {
          // return swalReact({
          //   title: "No ethereum provider detected.",
          //   icon: "warning",
          //   buttons: {
          //     back: {
          //       text: "Okay",
          //       value: "back",
          //       className: "delegateButtonBackCentered",
          //     },
          //   },
          // });
        }
      } else if (chainId === 100000000) {
      } else {
        swalReact({
          icon: `warning`,
          text: `You are connected to network ID ${chainId}. Please connect to a supported chain`,
          buttons: {
            back: {
              text: "Okay",
              value: "back",
              className: "delegateButtonBackCentered",
            },
          },
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
      return swalReact({
        title: "Something isn't right! Try refreshing the page.",
        icon: "warning",
        buttons: {
          back: {
            text: "Okay",
            value: "back",
            className: "delegateButtonBackCentered",
          },
        },
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
    util.balanceOf(_addr).call(async (error, result) => {
      if (!error) {
        setPrufBalance(
          Number(web3.utils.fromWei(result)).toFixed(5).toString()
        );
      }
      setIsRefreshingPruf(false);
    });
  };

  const refreshDash = async () => {
    if (!web3 || !addr || !stake) return;
    setLoadingSums(true);
    getHeldStake(web3, stake, stakeTkn, addr);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const incrementDivisor = (index) => {
    //let index = rewardAssets.units.indexOf(_rewardsUnit)

    setRewardsDivisor(rewardAssets.divisors[index]);
    setRewardsUnit(rewardAssets.units[index]);
    setOpen(false);
  };

  const parseTotalRedeemable = (arr) => {
    let _totalRewards = 0;
    let _totalStaked = 0;
    let yearlyTotalReturns = 0;

    arr.forEach((props) => {
      if (props[9]) {
        _totalRewards += Number(props[9]);
        _totalStaked += Number(props[8]);
      }

      yearlyTotalReturns += props[12];
    });

    console.log(yearlyTotalReturns);
    setYearlyRewards(Math.floor(yearlyTotalReturns * 1000) / 1000);
    setTotalRewards(Math.floor(_totalRewards * 1000) / 1000);
    setTotalStaked(Math.floor(_totalStaked * 1000) / 1000);
    setLoadingSums(false);
  };

  const getStakeOffers = (_web3, _stake, arr, iteration) => {
    if (!iteration) iteration = 1;
    if (!arr) arr = [[], [], [], []];
    if (iteration > 5) return setTierOptions(JSON.parse(JSON.stringify(arr)));
    _stake.getStakeLevel(iteration + startAfter).call(async (error, result) => {
      if (!error) {
        console.log(`Stake offer for ID ${iteration + startAfter}: `, result);

        let obj = {
          pos: iteration,
          id: iteration + startAfter,
          apr: ((Number(result["3"]) * 365) / Number(result["2"]) / 10).toFixed(
            2
          ),
          max: Number(_web3.utils.fromWei(result["1"])),
          min: Number(_web3.utils.fromWei(result["0"])),
          interval: Number(result["2"]),
          eligible: prufBalance > Number(_web3.utils.fromWei(result["0"])),
          emoji: tierEmojis[iteration],
          description: tierDescriptions[iteration],
          tierName: tierNames[iteration],
        };

        arr[0].push(obj);

        // if(Number(result["2"]) === 14){
        //   arr[0].push({
        //     id: iteration + startAfter,
        //     apr: ((Number(result["3"]) * 365) / Number(result["2"]) / 10).toFixed(
        //       2
        //     ),
        //     max: Number(_web3.utils.fromWei(result["1"])),
        //     min: Number(_web3.utils.fromWei(result["0"])),
        //     interval: Number(result["2"]),
        //     eligible: prufBalance > Number(_web3.utils.fromWei(result["0"])),
        //     emoji: tierEmojis[iteration],
        //   });
        // }
        // else if(Number(result["2"]) === 30){
        //   arr[1].push({
        //     id: iteration + startAfter,
        //     apr: ((Number(result["3"]) * 365) / Number(result["2"]) / 10).toFixed(
        //       2
        //     ),
        //     max: Number(_web3.utils.fromWei(result["1"])),
        //     min: Number(_web3.utils.fromWei(result["0"])),
        //     interval: Number(result["2"]),
        //     eligible: prufBalance > Number(_web3.utils.fromWei(result["0"])),
        //     emoji: tierEmojis[iteration],
        //   });
        // }
        // else if(Number(result["2"]) === 60){
        //   arr[2].push({
        //     id: iteration + startAfter,
        //     apr: ((Number(result["3"]) * 365) / Number(result["2"]) / 10).toFixed(
        //       2
        //     ),
        //     max: Number(_web3.utils.fromWei(result["1"])),
        //     min: Number(_web3.utils.fromWei(result["0"])),
        //     interval: Number(result["2"]),
        //     eligible: prufBalance > Number(_web3.utils.fromWei(result["0"])),
        //     emoji: tierEmojis[iteration],
        //   });
        // }
        // else if(Number(result["2"]) === 90){
        //   arr[3].push({
        //     id: iteration + startAfter,
        //     apr: ((Number(result["3"]) * 365) / Number(result["2"]) / 10).toFixed(
        //       2
        //     ),
        //     max: Number(_web3.utils.fromWei(result["1"])),
        //     min: Number(_web3.utils.fromWei(result["0"])),
        //     interval: Number(result["2"]),
        //     eligible: prufBalance > Number(_web3.utils.fromWei(result["0"])),
        //     emoji: tierEmojis[iteration],
        //   });
        // }
        // else if(Number(result["2"]) === 180){
        //   arr[4].push({
        //     id: iteration + startAfter,
        //     apr: ((Number(result["3"]) * 365) / Number(result["2"]) / 10).toFixed(
        //       2
        //     ),
        //     max: Number(_web3.utils.fromWei(result["1"])),
        //     min: Number(_web3.utils.fromWei(result["0"])),
        //     interval: Number(result["2"]),
        //     eligible: prufBalance > Number(_web3.utils.fromWei(result["0"])),
        //     emoji: tierEmojis[iteration],
        //   });
        // }

        getStakeOffers(_web3, _stake, arr, iteration + 1);
      }
    });
  };

  const getHeldStake = async (_web3, _stake, _tkn, _addr) => {
    let currentBlock = await _web3.eth.getBlock("latest");

    const getStakeIds = (bal, ids, iteration) => {
      if (!bal || String(bal) === "0") {
        setDelegationList([[``, ``, ``, ``, ``]]);
        setTotalRewards(0);
        setTotalStaked(0);
        setLoadingSums(false);
        return console.log(`Balances undefined or zero`);
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
        //arr.push([``, ``, ``, ``, ``]);
        return setDelegationList(arr);
      }

      _stake.stakeInfo(ids[iteration]).call(async (error, result) => {
        if (!error) {
          console.log(`stakeInfo at index ${iteration}: `, result);
          let amount = Number(_web3.utils.fromWei(result["0"]));
          let timeElapsed =
            (Number(currentBlock.timestamp) - Number(result["1"])) / 86400;
          let interval = Number(result["3"]);
          let bonus = Number(result["4"]);
          _stake
            .checkEligibleRewards(ids[iteration])
            .call(async (error, result) => {
              if (!error) {
                console.log(`eligibleRewards at index ${iteration}: `, result);
                let readyEmoji = "";
                // //@dev overflow date case
                // let percentComplete = timeElapsed / (Number(result["3"]) * 86400)
                // let rewardsBalance = percentComplete * Number(_web3.utils.fromWei(result["4"]))
                let intervalToYear = 365 / interval;
                let apr = (bonus / 10) * intervalToYear;
                let percentComplete = (timeElapsed / interval) * 100;
                if (percentComplete > 100) percentComplete = 100;
                let timeTilRedeem = Number(result["1"]) / 10000;
                let rewards = Number(_web3.utils.fromWei(result["0"]));
                let isReady = (timeTilRedeem / 100) * interval > 1;
                if (!isReady) readyEmoji = "⏳";

                arr.push([
                  `${ids[iteration]}`,
                  `${Math.floor(apr * 100) / 100}%`,
                  `ü${Math.round(amount * 100) / 100}`,
                  `ü${Math.floor(rewards * 100) / 100}${readyEmoji}`,
                  `${Math.round(percentComplete * 100) / 100}%`,
                  interval,
                  bonus,
                  percentComplete,
                  amount,
                  rewards,
                  timeTilRedeem,
                  isReady,
                  (apr / 100) * amount,
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
        console.log(`User holds ${result} stake tokens`);
      } else {
        console.error(error);
      }
    });
  };

  const setUpEnvironment = async (_web3, _addr, _chainId) => {
    console.log("setting up environment");
    setIsRefreshingEther(true);
    setIsRefreshingPruf(true);
    setLoadingSums(true);
    setChainId(_chainId);

    let _util;
    let _stake;
    let _stakeTkn;

    if (_chainId === 1) {
      _util = await new _web3.eth.Contract(UTIL_ABI, ETH_UTIL_ADDRESS);
      _stake = await new _web3.eth.Contract(STAKE_ABI, ETH_STAKE_ADDRESS);
      _stakeTkn = await new _web3.eth.Contract(
        STAKE_TKN_ABI,
        ETH_STAKE_TKN_ADDRESS
      );
      setCurrentChainExplorer("etherscan.io");
      setTokenAddress(ETH_UTIL_ADDRESS);
    } else if (_chainId === 42) {
      _util = await new _web3.eth.Contract(UTIL_ABI, KOVAN_UTIL_ADDRESS);
      _stake = await new _web3.eth.Contract(STAKE_ABI, KOVAN_STAKE_ADDRESS);
      _stakeTkn = await new _web3.eth.Contract(
        STAKE_TKN_ABI,
        KOVAN_STAKE_TKN_ADDRESS
      );
      setCurrentChainExplorer("kovan.etherscan.io");
      setTokenAddress(KOVAN_UTIL_ADDRESS);
    } else if (_chainId === 137) {
      _util = await new _web3.eth.Contract(UTIL_ABI, POLY_UTIL_ADDRESS);
      _stake = await new _web3.eth.Contract(STAKE_ABI, POLY_STAKE_ADDRESS);
      _stakeTkn = await new _web3.eth.Contract(
        STAKE_TKN_ABI,
        POLY_STAKE_TKN_ADDRESS
      );
      setCurrentChainExplorer("polygonscan.com");
      setTokenAddress(POLY_UTIL_ADDRESS);
    } else if (_chainId === 80001) {
      _util = await new _web3.eth.Contract(UTIL_ABI, MUMBAI_UTIL_ADDRESS);
      _stake = await new _web3.eth.Contract(STAKE_ABI, MUMBAI_STAKE_ADDRESS);
      _stakeTkn = await new _web3.eth.Contract(
        STAKE_TKN_ABI,
        MUMBAI_STAKE_TKN_ADDRESS
      );
      setCurrentChainExplorer("mumbai.polygonscan.com");
      setTokenAddress(MUMBAI_UTIL_ADDRESS);
    } else {
      return swalReact({
        buttons: {
          back: {
            text: "Okay",
            value: "back",
            className: "delegateButtonBackCentered",
          },
        },
        text: `Unsupported chainId: ${_chainId}. Please connect to a supported chain.`,
      });
    }

    setStake(_stake.methods);
    setStakeTkn(_stakeTkn.methods);
    setUtil(_util.methods);

    _web3.eth.getBalance(_addr).then(async (e) => {
      setEtherBalance(Number(_web3.utils.fromWei(e)).toFixed(5).toString());
      setIsRefreshingEther(false);
    });

    _util.methods.balanceOf(_addr).call(async (error, result) => {
      setIsRefreshingPruf(false);
      if (!error) {
        if (Number(result) > 0) setPrufBalance(_web3.utils.fromWei(result));
        else setPrufBalance(0);
      } else {
        console.error(error);
        swalReact({ text: error });
        setPrufBalance("NaN");
      }
    });

    getStakeOffers(_web3, _stake.methods);
    getHeldStake(_web3, _stake.methods, _stakeTkn.methods, _addr);
  };

  const claimRewards = (index, id) => {
    //console.log((delegationList[index][7] / 100) * delegationList[index][5]);
    let isReady =
      (delegationList[index][10] / 100) * delegationList[index][5] > 1;
    let timeLeft =
      24 - (delegationList[index][10] / 100) * delegationList[index][5] * 24;
    timeLeft = timeLeft.toFixed(2);

    if (timeLeft < 1) {
      timeLeft = `${timeLeft * 60} minutes`;
    } else {
      timeLeft = `${String(timeLeft).substring(0, 2)} hours and ${
        Number(String(timeLeft).substring(2, 4)) * 60
      } minutes `;
    }

    if (isReady) {
      document.body.style.cursor = "progress";
      stake
        .claimBonus(id)
        .send({ from: addr })
        .on("receipt", () => {
          document.body.style.cursor = "auto";
          swalReact({
            icon: "success",
            text: `Successfully redeemed PRUF rewards!`,
            buttons: {
              back: {
                text: "Okay",
                value: "back",
                className: "delegateButtonBackCentered",
              },
            },
          });
          refreshDash();
          return refreshBalances("both", web3, addr);
        });
    } else {
      return swalReact({
        icon: "warning",
        text: `Holders must wait 24 hours after initial stake 
        or reward redemption before claiming rewards. 
        Please try again after ~${timeLeft}.`,
        buttons: {
          back: {
            text: "Okay",
            value: "back",
            className: "delegateButtonBackCentered",
          },
        },
      }).then(() => {
        viewStake(index);
      });
    }
  };

  const stakeRewards = (index) => {
    if (index < 0) return;
    let amount = Number(delegationList[index][9]);
    console.log(amount);
    let id = String(delegationList[Number(index)][0]);

    swalReact({
      icon: "warning",
      content: (
        <Card className="delegationCard">
          <h5 className="delegationTitle">Just a moment...</h5>
          <h5 className="delegationTitleSm">
            Before you increase your stake, please read ahead:
          </h5>
          <div className="left-margin">
            <div className="delegationTips">
              <FiberManualRecordTwoTone className="delegationPin" />
              <h5 className="delegationTipsContent">
                When a stake balance is increased, the stake period will be
                reset, and the current rewards will be sent to your wallet. The
                selected ID will begin accumilating rewards which reflect your
                new balance as soon as the increase has been processed.
              </h5>
            </div>
          </div>
        </Card>
      ),
      buttons: {
        back: {
          text: "⬅️ Go Back",
          value: "back",
          className: "delegationButtonBack",
        },
        confirm: {
          text: "Got it 👍",
          value: "confirm",
          className: "delegationButtonBack",
        },
      },
    }).then((value) => {
      if (value === "confirm") {
        document.body.style.cursor = "progress";
        console.log(`Adding ü${amount} to stake ID ${id}`);
        stake
          .increaseMyStake(id, web3.utils.toWei(String(amount)))
          .send({ from: addr })
          .on("receipt", () => {
            document.body.style.cursor = "auto";
            swalReact({
              icon: "success",
              text: `Successfully increased your stake on ID ${id}!`,
              buttons: {
                back: {
                  text: "Okay",
                  value: "back",
                  className: "delegateButtonBackCentered",
                },
              },
            });
            refreshDash();
            return refreshBalances("both", web3, addr);
          });
      } else {
        return viewStake(index);
      }
    });
  };

  const increaseStake = (index) => {
    if (index < 0) return;
    let amount = 0;
    let isReady =
      (delegationList[index][10] / 100) * delegationList[index][5] > 1;
    let timeLeft =
      24 - (delegationList[index][10] / 100) * delegationList[index][5] * 24;
    timeLeft = timeLeft.toFixed(2);

    if (timeLeft < 1) {
      timeLeft = `${timeLeft * 60} minutes`;
    } else {
      timeLeft = `${String(timeLeft).substring(0, 2)} hours and ${
        Number(String(timeLeft).substring(2, 4)) * 60
      } minutes `;
    }

    let id = String(delegationList[Number(index)][0]);

    if (isReady) {
      swalReact({
        content: (
          <Card className="delegationCard">
            <h4 className="delegationTitle">Increase Stake</h4>
            {/* <div className="left-margin">
            <div className="delegationTips">
              <FiberManualRecordTwoTone className="delegationPin" />
              <h5 className="delegationTipsContent">
                Lock Duration: {delegationList[Number(index)].interval} Days
              </h5>
            </div>
            <div className="delegationTips">
              <FiberManualRecordTwoTone className="delegationPin" />
              <h5 className="delegationTipsContent">
                APR: {delegationList[Number(index)].apr}%
              </h5>
            </div>
          </div> */}
            <h5 className="delegateText">
              Input the amount you want to add to your stake:
            </h5>
            <CustomInput
              labelText={`Minimum: 100`}
              id="CI1"
              inputProps={{
                id: "CI1Input",
                type: "number",
                maxLength: "9",
                onChange: (event) => {
                  amount =
                    Math.round(Number(event.target.value) * 1000000) / 1000000;
                  console.log(amount);
                },
              }}
            />
          </Card>
        ),
        buttons: {
          back: {
            text: "⬅️ Go Back",
            value: "back",
            className: "delegationButtonBack",
          },
          confirm: {
            text: "Stake Tokens 🏛️",
            value: "confirm",
            className: "delegationButtonBack",
          },
        },
      }).then((value) => {
        if (value === "confirm") {
          if (amount < 100) {
            return swalReact({
              icon: "warning",
              text: `The minimum increase is ü100!`,
              buttons: {
                back: {
                  text: "Okay",
                  value: "back",
                  className: "delegateButtonBackCentered",
                },
              },
            }).then(() => {
              increaseStake(index);
            });
          } else if (amount > Number(prufBalance)) {
            return swalReact({
              icon: "warning",
              text: `Insufficient PRUF!\n\n You are trying to add ü${amount}, but you only hold ü${
                Math.round(Number(prufBalance) * 1000000) / 1000000
              }.`,
              buttons: {
                back: {
                  text: "Okay",
                  value: "back",
                  className: "delegateButtonBackCentered",
                },
              },
            }).then(() => {
              increaseStake(index);
            });
          }

          swalReact({
            icon: "warning",
            content: (
              <Card className="delegationCard">
                <h5 className="delegationTitle">Just a moment...</h5>
                <h5 className="delegationTitleSm">
                  Before you increase your stake, please read ahead:
                </h5>
                <div className="left-margin">
                  <div className="delegationTips">
                    <FiberManualRecordTwoTone className="delegationPin" />
                    <h5 className="delegationTipsContent">
                      When a stake balance is increased, the stake period will
                      be reset, and the current rewards will be sent to your
                      wallet. The selected ID will begin accumilating rewards
                      which reflect your new balance as soon as the increase has
                      been processed.
                    </h5>
                  </div>
                </div>
              </Card>
            ),
            buttons: {
              back: {
                text: "⬅️ Go Back",
                value: "back",
                className: "delegationButtonBack",
              },
              confirm: {
                text: "Got it 👍",
                value: "confirm",
                className: "delegationButtonBack",
              },
            },
          }).then((value) => {
            if (value === "confirm") {
              document.body.style.cursor = "progress";
              console.log(`Adding ü${amount} to stake ID ${id}`);
              stake
                .increaseMyStake(id, web3.utils.toWei(String(amount)))
                .send({ from: addr })
                .on("receipt", () => {
                  document.body.style.cursor = "auto";
                  swalReact({
                    icon: "success",
                    text: `Successfully increased your stake on ID ${id}!`,
                    buttons: {
                      back: {
                        text: "Okay",
                        value: "back",
                        className: "delegateButtonBackCentered",
                      },
                    },
                  });
                  refreshDash();
                  return refreshBalances("both", web3, addr);
                });
            } else {
              return viewStake(index);
            }
          });
        } else if (value === "back") {
          return viewStake(index);
        }
      });
    } else {
      return swalReact({
        icon: "warning",
        text: `Holders must wait 24 hours after initial stake 
    or reward redemption before increasing their stake. 
    Please try again after ~${timeLeft}.`,
        buttons: {
          back: {
            text: "Okay",
            value: "back",
            className: "delegateButtonBackCentered",
          },
        },
      }).then(() => {
        viewStake(index);
      });
    }
  };

  const breakStake = (id, index) => {
    console.log(`BreakStake inputs: id: '${id}' index: '${index}'`);

    if (index < 0 || id < 0) return;
    //if (!index || !id) return

    let isReady =
      (delegationList[index][10] / 100) * delegationList[index][5] > 1;
    let timeLeft =
      24 - (delegationList[index][10] / 100) * delegationList[index][5] * 24;
    timeLeft = timeLeft.toFixed(2);

    if (timeLeft < 1) {
      timeLeft = `${timeLeft * 60} minutes`;
    } else {
      timeLeft = `${String(timeLeft).substring(0, 2)} hours and ${
        Number(String(timeLeft).substring(2, 4)) * 60
      } minutes `;
    }

    if (isReady) {
      swalReact({
        icon: "warning",
        text: `Are you sure you want to break your stake? This action cannot be undone, and you will no longer be able to earn rewards on this ID if you do.`,
        buttons: {
          back: {
            text: "⬅️ Go Back",
            value: "back",
            className: "delegationButtonBack",
          },
          confirm: {
            text: "Break Stake ❌",
            value: "break",
            className: "delegationButtonBack",
          },
        },
      }).then((value) => {
        if (value === "break") {
          document.body.style.cursor = "progress";
          stake
            .breakStake(id)
            .send({ from: addr })
            .on("receipt", () => {
              document.body.style.cursor = "auto";
              swalReact({
                icon: "success",
                text: `Successfully broke stake and refunded PRUF!`,
                buttons: {
                  back: {
                    text: "Okay",
                    value: "back",
                    className: "delegateButtonBackCentered",
                  },
                },
              });
              refreshDash();
              return refreshBalances("both", web3, addr);
            });
        } else if (value === "back") {
          return viewStake(index);
        }
      });
    } else {
      return swalReact({
        icon: "warning",
        text: `Holders must wait 24 hours after initial stake 
      or reward redemption before breaking their stake. 
      Please try again after ~${timeLeft}.`,
        buttons: {
          back: {
            text: "Okay",
            value: "back",
            className: "delegateButtonBackCentered",
          },
        },
      }).then(() => {
        viewStake(index);
      });
    }
  };

  const viewStake = (index) => {
    let confirmText = "Redeem Rewards",
      swalButtons;

    let timeLeft =
      24 - (delegationList[index][10] / 100) * delegationList[index][5] * 24;
    timeLeft = timeLeft.toFixed(2);

    if (timeLeft < 1) {
      timeLeft = `${timeLeft * 60} minutes`;
    } else {
      timeLeft = `${String(timeLeft).substring(
        0,
        String(timeLeft).indexOf(".")
      )} hours and ${(
        Number(String(timeLeft).substring(String(timeLeft).indexOf("."), 4)) *
        60
      ).toFixed(0)} minutes `;
    }

    if (delegationList[index][11]) {
      confirmText += "💰";
      swalButtons = {
        back: {
          text: "⬅️ Go Back",
          value: "back",
          className: "delegationButtonBack",
        },
        confirm: {
          text: confirmText,
          value: "Redeem",
          className: "delegationButtonBack",
        },
      };
    } else {
      swalButtons = {
        back: {
          text: "⬅️ Go Back",
          value: "back",
          className: "delegateButtonBackCentered",
        },
      };
      confirmText = "Pending ⏳";
    }
    swalReact({
      //icon: "warning",
      content: (
        <Card className="delegationCard">
          <h4 className="delegationTitle">Stake Details</h4>
          {/* <Accordion key={`AccordionStack${index}`}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions1-content"
              id={`additional-actions1-header-${index}`}
            >
              <h5 className="delegationTipsContent">Estimated Earnings</h5>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Per Year : ü
                    {Math.floor(delegationList[index][12] * 100) / 100}
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Per Month: ü
                    {Math.floor((delegationList[index][12] / 12) * 100) / 100}
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Per Week: ü
                    {Math.floor((delegationList[index][12] / 52) * 100) / 100}
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Per Day: ü
                    {Math.floor((delegationList[index][12] / 365) * 100) / 100}
                  </h5>
                </div>
              </div>
            </AccordionDetails>
          </Accordion> */}
          <h5 className="">
            {`
                  Token ID: ${delegationList[index][0]}
                `}
          </h5>
          {delegationList[index][11] ? (
            <></>
          ) : (
            <h5 className="">
              {`
                  Action Timeout: ${timeLeft}
                `}
            </h5>
          )}
          <h5 className="">
            {`
                Annual percentage yield: ${delegationList[index][1]}
              `}
          </h5>
          <h5 className="">
            {`
                Amount staked: ${delegationList[index][2]}
              `}
          </h5>
          <h5 className="">
            {`
                Redeemable rewards: ${delegationList[index][3]}
              `}
          </h5>
          <h5 className="">
            {`
                Unlock Completion: ${delegationList[index][4]}
              `}
          </h5>
          <CustomLinearProgress
            variant="determinate"
            color="info"
            value={Number(
              delegationList[index][4].substring(
                0,
                delegationList[index][4].length - 1
              )
            )}
          />

          {delegationList[index][11] ? (
            Number(prufBalance) > 100 ? (
              <Button
                className="MLBGradient"
                onClick={() => {
                  return increaseStake(index);
                }}
              >
                {" "}
                Increase Stake 🏛️{" "}
              </Button>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
          {delegationList[index][11] ? (
            Number(
              delegationList[index][3].substring(
                1,
                delegationList[index][3].length
              )
            ) >= 100 ? (
              <Button
                className="MLBGradient"
                onClick={() => {
                  return stakeRewards(index);
                }}
              >
                {" "}
                Stake Rewards Balance 💰{" "}
              </Button>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}

          {delegationList[index][11] ? (
            Number(
              delegationList[index][4].substring(
                0,
                delegationList[index][4].length - 1
              )
            ) >= 100 ? (
              <Button
                className="transparentButton"
                onClick={() => {
                  return breakStake(String(delegationList[index][0]), index);
                }}
              >
                {" "}
                Stop Earning{" "}
              </Button>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </Card>
      ),
      buttons: swalButtons,
    }).then((value) => {
      if (value === "Redeem") {
        claimRewards(index, String(delegationList[index][0]));
      } else return refreshDash();
    });
  };

  const newStake = () => {
    if (Number(prufBalance) < 1) {
      return swalReact({
        icon: "warning",
        text: "You don't hold enough PRUF to create a stake!",
        buttons: {
          back: {
            text: "Okay",
            value: "back",
            className: "delegateButtonBackCentered",
          },
        },
      });
    }

    let delegateAmount = 0;
    let isTierChecked = {
      chk1: false,
      chk2: false,
      chk3: false,
      chk4: false,
      chk5: false,
    };

    let isDurationChecked = {
      chk1: false,
      chk2: false,
      chk3: false,
      chk4: false,
      chk5: false,
    };

    const showDurationOptions = (row) => {
      //@DEV Rebuild to matrix spec
      let component = [];

      tierOptions[row].forEach((props) => {
        component.push(
          <FormControlLabel
            key={`formControl${props.pos}`}
            control={
              <Checkbox
                onChange={() =>
                  (isDurationChecked[`chk${props.pos}`] =
                    !isDurationChecked[`chk${props.pos}`])
                }
                name={`chkBox${props.id}`}
                color="primary"
                classes={{
                  checked: classes.checked,
                  root: classes.checkRoot,
                }}
              />
            }
            label={`${props.interval} Days`}
          />
        );
      });

      return component;
    };

    const showTierOptions = (row) => {
      let component = [];

      tierOptions[row].forEach((props) => {
        component.push(
          <Accordion key={`AccordionStack${props.id}`}>
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
                    disabled={!(prufBalance > props.min)}
                    onClick={() =>
                      (isTierChecked[`chk${props.pos}`] =
                        !isTierChecked[`chk${props.pos}`])
                    }
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                label={`${props.emoji} ${props.tierName} (${props.interval} days)`}
              />
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    {props.description.trim()}
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Stake Unlock Period: {props.interval} days
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">APR: {props.apr}%</h5>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        );
      });

      return component;
    };

    const durationPopup = () => {
      swalReact({
        //icon: "warning",
        content: (
          <Card className="delegationCard">
            <h4 className="delegationTitle">Stake Your PRUF</h4>
            <h5 className="delegateText">How long do you want to stake?</h5>
            {showDurationOptions(0)}
          </Card>
        ),
        buttons: {
          back: {
            text: "⬅️ Go Back",
            value: "back",
            className: "delegationButtonBack",
          },
          confirm: {
            text: "Next ✅",
            value: isDurationChecked,
            className: "delegationButtonBack",
          },
        },
      }).then((value) => {
        if (value !== "back") tiersPopup(value);
      });
    };

    const tiersPopup = (value) => {
      isTierChecked = {
        chk1: false,
        chk2: false,
        chk3: false,
        chk4: false,
        chk5: false,
      };

      // if (typeof value !== "object" || value === null) {
      //   return;
      // }
      // let trues = [];
      // let vals = Object.values(value);

      // vals.forEach((e) => {
      //   if (e === true) trues.push(true);
      // });

      // if (trues.length > 1) {
      //   return swalReact({
      //     icon: "warning",
      //     text: "Please select only 1 option!",
      //   }).then(() => newStake());
      // } else if (trues.length === 0) {
      //   return swalReact({
      //     icon: "warning",
      //     text: "Please select an option!",
      //   }).then(() => newStake());
      // }
      // else{
      //let row = String(Object.values(value).indexOf(true));

      swalReact({
        //icon: "warning",
        content: (
          <Card className="delegationCard">
            <h4 className="delegationTitle"> Stake Your PRUF</h4>
            <h5 className="delegateText">
              Select your preferred staking tier:
            </h5>
            <h5 className="delegateText">
              Minimum stake: 5,000 -- Maximum stake: 10,000,000
            </h5>
            {showTierOptions(0)}
          </Card>
        ),

        buttons: {
          back: {
            text: "⬅️ Go Back",
            value: "back",
            className: "delegationButtonBack",
          },

          confirm: {
            text: "Next ✅",
            value: { isTierChecked, last: value },
            className: "delegationButtonBack",
          },
        },
      }).then((value) => {
        if (value === "back") return;
        else amountPopup(value);
      });
      // }
    };

    const amountPopup = (value) => {
      if (typeof value !== "object" || value === null) {
        return;
      }
      delegateAmount = 0;
      let last = value.last;
      let trues = [];
      let vals = Object.values(value.isTierChecked);

      vals.forEach((e) => {
        if (e === true) trues.push(true);
      });

      if (trues.length > 1) {
        return swalReact({
          icon: "warning",
          text: "Please select only 1 option!",
          buttons: {
            back: {
              text: "Okay",
              value: "back",
              className: "delegateButtonBackCentered",
            },
          },
        }).then(() => tiersPopup(value.last));
      } else if (trues.length === 0) {
        return swalReact({
          icon: "warning",
          text: "Please select an option!",
          buttons: {
            back: {
              text: "Okay",
              value: "back",
              className: "delegateButtonBackCentered",
            },
          },
        }).then(() => tiersPopup(value.last));
      } else {
        console.log(vals.indexOf(true));
        let id = String(vals.indexOf(true));
        swalReact({
          content: (
            <Card className="delegationCard">
              <h4 className="delegationTitle">Stake Details</h4>
              <div className="left-margin">
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Lock Duration: {tierOptions[0][Number(id)].interval} Days
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    APR: {tierOptions[0][Number(id)].apr}%
                  </h5>
                </div>
              </div>
              <h5 className="delegateText">
                Input the amount you want to stake:
              </h5>
              <CustomInput
                labelText={`Minimum: ${tierOptions[0][Number(id)].min}`}
                id="CI1"
                inputProps={{
                  id: "CI1Input",
                  type: "number",
                  maxLength: "9",
                  onChange: (event) => {
                    delegateAmount =
                      Math.round(Number(event.target.value) * 1000000) /
                      1000000;
                    console.log(delegateAmount);
                  },
                }}
              />
            </Card>
          ),
          buttons: {
            back: {
              text: "⬅️ Go Back",
              value: "back",
              className: "delegationButtonBack",
            },
            confirm: {
              text: "Stake Tokens 🏛️",
              value: { id, this: "confirm", last: value },
              className: "delegationButtonBack",
            },
          },
        }).then((value) => {
          if (value === "back") tiersPopup(last);
          disclaimerPopup(value);
        });
      }
    };

    const disclaimerPopup = (value) => {
      if (!value) return;
      if (delegateAmount > Number(prufBalance)) {
        swalReact({
          icon: "warning",
          text: `Insufficient PRUF!\n\n You are trying to stake ü${delegateAmount}, but you only hold ü${
            Math.round(Number(prufBalance) * 1000000) / 1000000
          }.`,
          buttons: {
            back: {
              text: "Okay",
              value: "back",
              className: "delegateButtonBackCentered",
            },
          },
        });
      } else if (value.this === "confirm") {
        let last = value.last;
        let id = value.id;
        if (delegateAmount < Number(tierOptions[0][Number(id)].min)) {
          return swalReact({
            icon: "warning",
            text: `The minimum value for this staking tier is ${
              tierOptions[0][Number(id)].min
            }`,
            buttons: {
              back: {
                text: "Okay",
                value: "back",
                className: "delegateButtonBackCentered",
              },
            },
          }).then(() => amountPopup(last));
        }
        swalReact({
          icon: "warning",
          content: (
            <Card className="delegationCard">
              <h5 className="delegationTitle">Just a moment...</h5>
              <h5 className="delegationTitleSm">
                Before you submit your stake, please read ahead:
              </h5>
              <div className="left-margin">
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    {" "}
                    Once you have created a stake, no additional steps are
                    needed. You may begin to claim staking rewards 24 hours
                    after creating your stake.
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Your staked PRUF tokens will be locked until the stake
                    unlock period ends ({tierOptions[0][Number(id)].interval}{" "}
                    Days). Your stake will continue to earn rewards even after
                    the staking period has ended. No action is required after
                    you stake.
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Once the stake unlock period (
                    {tierOptions[0][Number(id)].interval} Days) has concluded,
                    you may break your stake if you wish. This is optional. Once
                    your stake is broken, your PRUF tokens will be refunded.
                    NOTE: IF YOU BREAK YOUR STAKE, THE STAKE ID IS BURNED, AND
                    IT WILL STOP EARNING REWARDS.
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Remember, your stake will continue to earn rewards, even
                    after the stake unlock period has ended! Holders are free to
                    stake as long as they want.
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    {" "}
                    You are about to stake ü{delegateAmount} at an APR of{" "}
                    {tierOptions[0][Number(id)].apr}%
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    {" "}
                    Estimated monthly return: ü
                    {Math.floor(
                      delegateAmount *
                        Number(tierOptions[0][Number(id)].apr / 100 / 12) *
                        1000
                    ) / 1000}
                  </h5>
                </div>
              </div>
            </Card>
          ),
          buttons: {
            back: {
              text: "⬅️ Go Back",
              value: "back",
              className: "delegationButtonBack",
            },
            confirm: {
              text: "Stake my PRUF 👍",
              value: "confirm",
              className: "delegationButtonBack",
            },
          },
        }).then((value) => {
          if (value === "confirm") {
            document.body.style.cursor = "progress";
            let amount = web3.utils.toWei(String(delegateAmount));
            console.log(amount);
            stake
              .stakeMyTokens(amount, tierOptions[0][Number(id)].id)
              .send({ from: addr })
              .on("receipt", () => {
                document.body.style.cursor = "auto";
                swalReact({
                  icon: "success",
                  text: "Your PRUF has been staked successfully!",
                  buttons: {
                    back: {
                      text: "Okay",
                      value: "back",
                      className: "delegateButtonBackCentered",
                    },
                  },
                });
                refreshDash();
                return refreshBalances("both", web3, addr);
              });
          } else if (value === "back") {
            return amountPopup(last);
          } else {
            return;
          }
        });
      } else {
        return;
      }
    };
    tiersPopup();
  };

  return (
    <div className={userClasses.wrapper}>
      <AdminNavbar
        udLogin={udLoginEvent}
        udSub={udSub}
        mmLogin={mmLoginEvent}
        tokenAddress={tokenAddress}
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
                      onClick={() => {
                        if (chainId === 42 || chainId === 1)
                          window.open("https://ethereum.org/en/");
                        else window.open("https://polygon.technology/");
                      }}
                    >
                      {chainId === 42 ? (
                        <img className="Icon" src={Eth} alt=""></img>
                      ) : chainId === 1 ? (
                        <img className="Icon" src={Eth} alt=""></img>
                      ) : (
                        <img className="Icon" src={Polygon} alt=""></img>
                      )}
                    </CardIcon>
                    {chainId === 42 ? (
                      <p className={classes.cardCategory}>KETH Balance</p>
                    ) : chainId === 1 ? (
                      <p className={classes.cardCategory}>ETH Balance</p>
                    ) : (
                      <p className={classes.cardCategory}>Matic Balance</p>
                    )}
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
                    onClick={() => addToken()}
                  >
                    <img className="Icon" src={Pruf} alt=""></img>
                  </CardIcon>
                  <p className={classes.cardCategory}>{`PRUF Balance`}</p>
                  {prufBalance ? (
                    <h3 className={classes.cardTitle}>
                      <>
                        ü{String(Math.round(Number(prufBalance) * 100) / 100)}{" "}
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
                    onClick={() =>
                      window.open(
                        "https://prufio.medium.com/the-pr%C3%BCf-staking-protocol-c7a710fbf2ca"
                      )
                    }
                  >
                    <span className="material-icons">savings</span>
                  </CardIcon>
                  <p className={classes.cardCategory}>PRUF Staked</p>
                  {totalStaked ? (
                    <>
                      <h3 className={classes.cardTitle}>
                        <>ü{String(totalStaked)} </>
                      </h3>
                    </>
                  ) : (
                    <h3 className={classes.cardTitle}>~</h3>
                  )}
                </CardHeader>
                <CardFooter stats>
                  {!loadingSums && (
                    <>
                      <Tooltip
                        id="tooltip-top"
                        title="Refresh Stake"
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
                      <span className="spanSmallText">
                        Currently Earning: ü
                        {Math.floor((yearlyRewards / rewardsDivisor) * 100) /
                          100}{" "}
                        /
                        <span
                          ref={anchorRef}
                          onClick={() => handleToggle()}
                          className="spanSmallTextSelect"
                        >
                          {" "}
                          {rewardsUnit}
                        </span>
                      </span>
                      <Popper
                        className="highZPopper"
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                      >
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              transformOrigin:
                                placement === "bottom"
                                  ? "center top"
                                  : "center bottom",
                            }}
                          >
                            <Paper>
                              <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu">
                                  {rewardAssets.units.map((option, index) => (
                                    <MenuItem
                                      key={option}
                                      selected={
                                        index ===
                                        rewardAssets.divisors.indexOf(
                                          rewardsDivisor
                                        )
                                      }
                                      onClick={() => incrementDivisor(index)}
                                    >
                                      {option}
                                    </MenuItem>
                                  ))}
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </>
                  )}
                  {loadingSums && (
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
                    onClick={() =>
                      window.open(
                        "https://prufio.medium.com/the-pr%C3%BCf-staking-protocol-c7a710fbf2ca"
                      )
                    }
                  >
                    <span className="material-icons">redeem</span>
                  </CardIcon>
                  <p className={classes.cardCategory}>{`Your Rewards`}</p>
                  {totalRewards ? (
                    <h3 className={classes.cardTitle}>
                      <>ü{String(totalRewards)} </>
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
                        title="Refresh Stake"
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
                    </>
                  )}
                  {loadingSums && (
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
              <CardIcon className="headerIconBack">
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
                  {/* <h4 className={classes.cardIconTitle}>Earnings Schedule</h4> */}
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
                      Header: "Stake ID #️⃣",
                      accessor: "id",
                    },
                    {
                      Header: "Staking Yield (APR) 📈",
                      accessor: "lvl",
                    },
                    {
                      Header: "Amount Staked 🏛️",
                      accessor: "balance",
                    },
                    {
                      Header: "Rewards Balance 🎁",
                      accessor: "rewards",
                    },
                    {
                      Header: "Unlock Status ⏱️",
                      accessor: "date",
                    },
                    {
                      Header: "Details 🕵️‍♀️",
                      accessor: "actions",
                    },
                  ]}
                  data={delegationList.map((prop, key) => {
                    let _id = "";
                    if (Number(prop[0]) > 0) {
                      _id = `${"# 0000".substring(
                        0,
                        6 - String(prop[0]).length
                      )}${prop[0]}`;
                    }
                    return {
                      id: _id,
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
                              //className="delegateButton"
                              className="MLBGradient"
                            >
                              View
                            </Button>
                          )}
                        </div>
                      ),
                    };
                  })}
                />
                <Button
                  onClick={() => {
                    newStake();
                  }}
                  color="info"
                  className="delegateButtonCentered"
                >
                  New Stake
                </Button>
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
                      Header: "Stake",
                      accessor: "balance",
                    },
                    {
                      Header: "Rewards",
                      accessor: "rewards",
                    },
                    {
                      Header: "🔍",
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
                          {prop[0] !== "Loading Balances..." && prop[0] !== "" && (
                            <Button
                              //justIcon
                              //round
                              //simple
                              onClick={() => {
                                viewStake(key);
                              }}
                              color="info"
                              //className="delegateButton"
                              className="MLBGradientSm"
                            >
                              View
                            </Button>
                          )}
                        </div>
                      ),
                    };
                  })}
                />
                <Button
                  onClick={() => {
                    newStake();
                  }}
                  color="info"
                  className="delegateButtonMobile"
                >
                  New Stake
                </Button>
              </CardBody>
            )}
          </Card>
        </div>
        <Footer fluid>
          <h5>
            Estimated returns: Yearly: ü{yearlyRewards} Monthly: ü
            {Math.floor((yearlyRewards / 12) * 100) / 100} Weekly: ü
            {Math.floor((yearlyRewards / 52) * 100) / 100}
          </h5>
        </Footer>
      </div>
    </div>
  );
}
