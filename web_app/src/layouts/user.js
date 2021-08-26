//PRUF STAKING INTERFACE

import React from "react";
import cx from "classnames";
import swal from "sweetalert";
import "../assets/css/custom.css";
import Web3 from "web3";
import { MaticPOSClient } from "@maticnetwork/maticjs";
import { useCookies } from "react-cookie";
import { Route } from "react-router-dom";
import ReactTable from "../components/ReactTable/ReactTable.js";
import CustomLinearProgress from "../components/CustomLinearProgress/CustomLinearProgress.js";
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
  FiberManualRecordTwoTone,
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
import ABIs from "./ABIs";

import routes from "routes.js";

import userStyle from "assets/jss/material-dashboard-pro-react/layouts/userStyle.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { Icon } from "@material-ui/core";
import { isConstructorDeclaration } from "typescript";

var ps

const UTIL_ADDRESS = "0xf9393D7ce74A8089A4f317Eb6a63623275DeD381"
const STAKE_ADDRESS = "0x1e8Fd4587b5Fe06A205E9c9e010274cFE6A367ee"
const STAKE_TKN_ADDRESS = "0x36F717F8430D51580E1E02Cd452Ab71584Be6eF2"

const POLY_UTIL_ADDRESS = "0x45f7c1eC0F0e19674A699577F9d89fB5424Acf1F"
const POLY_STAKE_ADDRESS = "0xB30c01fC29f97339E1eb6890a56CA1a907ca961D"
const POLY_STAKE_TKN_ADDRESS = "0x8Cea13A98a0143cfab5336fF5103C41f874d64Ea"

const UTIL_ABI = ABIs.UTIL_ABI
const STAKE_ABI = ABIs.STAKE_ABI
const STAKE_TKN_ABI = ABIs.STAKE_TKN_ABI

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
  const [chainId, setChainId] = React.useState();
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
    _web3.eth.net.getId().then((chainId) => {
      if (chainId === 42 || chainId === 80001) {
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
                    setUpEnvironment(_web3, accounts[0], chainId);
                  });
              } else {
                console.log(_web3.utils.toChecksumAddress(accounts[0]));
                setAddr(_web3.utils.toChecksumAddress(accounts[0]));
                setUpEnvironment(
                  _web3,
                  _web3.utils.toChecksumAddress(accounts[0]),
                  chainId
                );
              }
            });
        } else {
        }
      } else {
        swalReact({
          icon: `warning`,
          text: `You are connected to network ID ${chainId}. Please connect to the ethereum kovan testnet`,
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
          //console.log(result);
          let amount = Number(_web3.utils.fromWei(result["0"]));
          let timeElapsed =
            (Number(currentBlock.timestamp) - Number(result["1"])) / 86400;
          let interval = Number(result["3"]);
          let bonus = Number(_web3.utils.fromWei(result["4"]));
          _stake
            .checkEligibleRewards(ids[iteration])
            .call(async (error, result) => {
              if (!error) {
                //console.log(result);
                // //@dev overflow date case
                // let percentComplete = timeElapsed / (Number(result["3"]) * 86400)
                // let rewardsBalance = percentComplete * Number(_web3.utils.fromWei(result["4"]))
                let intervalToYear = 365 / interval;
                let apr = (bonus / amount * 100) * intervalToYear;
                let percentComplete = timeElapsed / interval * 100;
                if(percentComplete>100) percentComplete = 100
                let timeTilRedeem = Number(result["1"]) / 10000;
                let rewards = Number(_web3.utils.fromWei(result["0"]));
                arr.push([
                  `${ids[iteration]}`,
                  `${apr.toFixed(0)}%`,
                  `ü${amount.toFixed(0)}`,
                  `ü${rewards.toFixed(2)}`,
                  `${percentComplete.toFixed(2)}%`,
                  interval,
                  bonus,
                  percentComplete,
                  amount,
                  rewards,
                  timeTilRedeem
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

  const setUpEnvironment = async (_web3, _addr, _chainId) => {
    console.log("setting up environment");
    setIsRefreshingEther(true);
    setIsRefreshingPruf(true);
    setLoadingSums(true);
    setChainId(_chainId)

    let _util
    let _stake
    let _stakeTkn

    if(_chainId === 42){
      _util = await new _web3.eth.Contract(UTIL_ABI, UTIL_ADDRESS);
      _stake = await new _web3.eth.Contract(STAKE_ABI, STAKE_ADDRESS);
      _stakeTkn = await new _web3.eth.Contract(STAKE_TKN_ABI, STAKE_TKN_ADDRESS);
    } else {
      _util = await new _web3.eth.Contract(UTIL_ABI, POLY_UTIL_ADDRESS);
      _stake = await new _web3.eth.Contract(STAKE_ABI, POLY_STAKE_ADDRESS);
      _stakeTkn = await new _web3.eth.Contract(STAKE_TKN_ABI, POLY_STAKE_TKN_ADDRESS);
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
      if(!error){
        if(Number(result) > 0)
        setPrufBalance(_web3.utils.fromWei(result));
        else setPrufBalance(0)
      } else {
        console.error(error)
        setPrufBalance("NaN")
      }
    });

    getHeldStake(_web3, _stake.methods, _stakeTkn.methods, _addr);
  };

  const claimRewards = (index, id) => {
    console.log((delegationList[index][7] / 100) * delegationList[index][5]);
    let isReady =
      (delegationList[index][10] / 100) * delegationList[index][5] > 1;
    let timeLeft =
      24 - (delegationList[index][10] / 100) * delegationList[index][5] * 24;
    let timeUnit = "hours"
    timeLeft = timeLeft.toFixed(2);

    if (timeLeft < 1) {
      timeLeft = timeLeft * 60;
      timeUnit = "minutes";
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
          refreshDash();
          return refreshBalances("both", web3, addr)
        });
    } else {
      return swalReact({
        icon: "warning",
        text: `Holders must wait 24 hours after initial stake 
        or reward redemption before claiming rewards. 
        Please wait ~${timeLeft} ${timeUnit} and try again.`,
      }).then(() => {
        viewStake(index);
      });
    }
  };

  const breakStake = (id) => {
    if (!id) return

    stake
        .breakStake(id)
        .send({ from: addr })
        .on("reciept", () => {
          swalReact({
            icon: "success",
            text: `Successfully broke stake!`,
          });
          refreshDash()
          return refreshBalances("both", web3, addr)
        });
  }

  const viewStake = (index) => {

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
              {Number(delegationList[index][4].substring(0, delegationList[index][4].length-1)) >= 100 
              ? <a onClick = {()=>{return breakStake(String(delegationList[index][0]))}}> 🗑️ </a>
              : <></>
              }
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
        </Card>
      ),
      buttons: {
        back: {
          text: "⬅️ Go Back",
          value: "back",
          className: "delegationButtonBack",
        },
        confirm: {
          text: "Redeem Rewards 💰",
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
                  disabled = {!(prufBalance > props.min)}
                    onClick={() =>
                      (isChecked[`chk${props.id}`] =
                        !isChecked[`chk${props.id}`])
                    }
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot,
                    }}
                  />
                }
                label={`Tier ${props.id} ${props.emoji} Minimum ü${props.min}`}
              />
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Lock duration: {props.interval} days
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

    const tierOptions = [
      {
        id: 1,
        apr: 608,
        max: 100000000,
        min: 100,
        interval: 3,
        eligible: prufBalance > 100,
        emoji: "🥉"
      },
      {
        id: 2,
        apr: 1217,
        max: 100000000,
        min: 10000,
        interval: 3,
        eligible: prufBalance > 100,
        emoji: "🥈"
      },
      {
        id: 3,
        apr: 2190,
        max: 100000000,
        min: 100000,
        interval: 3,
        eligible: prufBalance > 100,
        emoji: "🥇"
      },
      {
        id: 4,
        apr: 1825,
        max: 100000000,
        min: 300000,
        interval: 3,
        eligible: prufBalance > 100,
        emoji: "💎"
      },
      {
        id: 5,
        apr: 1825,
        max: 100000000,
        min: 1000000,
        interval: 3,
        eligible: prufBalance > 100,
        emoji: "🚀"
      },
    ];

    swalReact({
      //icon: "warning",
      content: (
        <Card className="delegationCard">
          <h4 className="delegationTitle">Delegate Funds</h4>
          <h5 className="delegateText">
            Select your preferred EO staking tier:
          </h5>
          {showOptions()}
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
          value: isChecked,
          className: "delegationButtonBack",
        },
      },
    }).then((value) => {
      if (typeof value !== "object" || value === null) {
        return;
      }

      let trues = [];
      let vals = Object.values(value);

      vals.forEach((e) => {
        if (e === true) trues.push(true);
      });

      if (trues.length > 1) {
        return swalReact({
          icon: "warning",
          text: "Please select only 1 option!",
        }).then(() => newStake());
      } else if (trues.length === 0) {
        return swalReact({
          icon: "warning",
          text: "Please select an option!",
        }).then(() => newStake());
      } else {
        let id = String(Object.values(value).indexOf(true) + 1);
        swalReact({
          content: (
            <Card className="delegationCard">
              <h4 className="delegationTitle">Stake Details</h4>
              <div className="left-margin">
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Lock Duration: {tierOptions[Number(id) - 1].interval} Days
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    APR: {tierOptions[Number(id) - 1].apr}%
                  </h5>
                </div>
              </div>
              <h5 className="delegateText">
                Input the amount you want to stake:
              </h5>
              <CustomInput
                labelText={`Minimum: ${tierOptions[Number(id) - 1].min}`}
                id="CI1"
                inputProps={{
                  id:"CI1Input",
                  type: "number",
                  maxLength: 9,
                  onChange: (event) => {
                    delegateAmount = event.target.value.trim();
                    console.log(delegateAmount);
                  },
                }}
              />
              
              {/* {document.getElementById("CI1Input") >= tierOptions[Number(id) - 1].min 
              ? 
              (<h5 className="delegateText">
                Projected Rewards: ü{delegateAmount*tierOptions[Number(id) - 1].apr/52}/week
              </h5>) 
              : 
              (<h5 className="delegateText">
                Projected Rewards: ü~/week
              </h5>)} */}
              
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
                      {" "}Once you have created a stake, no additional steps are needed. You may 
                      begin to claim staking rewards 24 hours after creating
                      your stake.
                      </h5>
                    </div>
                    <div className="delegationTips">
                      <FiberManualRecordTwoTone className="delegationPin" />
                      <h5 className="delegationTipsContent">
                        Your staked PRUF tokens will be locked until the 
                        stake unlock period ends ({tierOptions[Number(id) - 1].interval} Days).
                        Your stake will continue to earn rewards even after the staking period
                        has ended. No action is required.
                      </h5>
                    </div>
                    <div className="delegationTips">
                      <FiberManualRecordTwoTone className="delegationPin" />
                      <h5 className="delegationTipsContent">
                        Once the stake unlock period (
                        {tierOptions[Number(id) - 1].interval} Days) has
                        concluded, you may break your stake if you wish. This
                        is optional. Once your stake is broken, your PRUF tokens 
                        will be refunded.

                        NOTE: IF YOU BREAK YOUR STAKE, THE STAKE ID IS BURNED,
                        AND IT WILL STOP EARNING REWARDS.
                      </h5>
                    </div>
                    <div className="delegationTips">
                      <FiberManualRecordTwoTone className="delegationPin" />
                      <h5 className="delegationTipsContent">
                        Remember, your stake will continue to earn rewards, even after the
                        stake unlock period has ended! Holders are free to stake as 
                        long as they want. 
                      </h5>
                    </div>
                    <div className="delegationTips">
                      <FiberManualRecordTwoTone className="delegationPin" />
                      <h5 className="delegationTipsContent">
                        {" "}You are about to stake ü{delegateAmount} 
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
                  text: "I Understand 👍",
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
                      {chainId === 42 ? <img className="Icon" src={Eth} alt=""></img> : <img className="Icon" src={Polygon} alt=""></img>}
                    </CardIcon>
                    {chainId === 42 ? <p className={classes.cardCategory}>ETH Balance</p> : <p className={classes.cardCategory}>Matic Balance</p>}
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
                  >{`Current Reward Pool`}</p>
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
                    onClick={() => window.open("https://pruf.io/")}
                  >
                    <span className="material-icons">savings</span>
                  </CardIcon>
                  <p className={classes.cardCategory}>{`Total Staked`}</p>
                  {totalStaked ? (
                    <h3 className={classes.cardTitle}>
                      <>ü{String(totalStaked)} </>
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
                      Header: "Unlock Status ⏳",
                      accessor: "date",
                    },
                    {
                      Header: "Details 🕵️‍♀️",
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
                          {/* {prop[0] === "" && (
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
                          )} */}
                        </div>
                      ),
                    };
                  })}
                />
                <Button
                  disabled = {!(prufBalance >= 100)}
                  onClick={() => {
                    newStake();
                  }}
                  color="info"
                  className="MLBGradient"
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
                              disabled = {!(prufBalance >= 100)}
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
