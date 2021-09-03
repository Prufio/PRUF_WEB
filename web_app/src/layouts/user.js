//PRUF STAKING INTERFACE

import React from "react";
import cx from "classnames";
import swal from "sweetalert";
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
import { makeStyles } from "@material-ui/core/styles";
import {
  Cached,
  DashboardOutlined,
  FiberManualRecordTwoTone,
  InfoOutlined,
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

import Eth from "../assets/img/eth-logo2.png";
import Polygon from "../assets/img/matic-token-inverted-icon.png";
import ABIs from "./ABIs";

import routes from "routes.js";

import userStyle from "assets/jss/material-dashboard-pro-react/layouts/userStyle.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { Icon } from "@material-ui/core";

var ps;

const KOVAN_UTIL_ADDRESS = "0xaAa5a0D9dfC5B21A8100f608D12924dEfDd90E43",
KOVAN_STAKE_ADDRESS = "0xe6b2d2645BBa4dD94be6c9570790824a29C5Fde5",
KOVAN_STAKE_TKN_ADDRESS = "0xEEA8ba6589f28fb6031073dBf4ba77a2fF0FC7d1"

const MUMBAI_UTIL_ADDRESS = "0x45f7c1eC0F0e19674A699577F9d89fB5424Acf1F",
MUMBAI_STAKE_ADDRESS = "0xB30c01fC29f97339E1eb6890a56CA1a907ca961D",
MUMBAI_STAKE_TKN_ADDRESS = "0x8Cea13A98a0143cfab5336fF5103C41f874d64Ea"

const ETH_UTIL_ADDRESS = "0xa49811140E1d6f653dEc28037Be0924C811C4538",
ETH_STAKE_ADDRESS = "",
ETH_STAKE_TKN_ADDRESS = ""

const POLY_UTIL_ADDRESS = "0xAdf72D32E511eE00c6E0FF5D62Cd5C7C40A6aDEA",
POLY_STAKE_ADDRESS = "",
POLY_STAKE_TKN_ADDRESS = ""

const UTIL_ABI = ABIs.UTIL_ABI;
const STAKE_ABI = ABIs.STAKE_ABI;
const STAKE_TKN_ABI = ABIs.STAKE_TKN_ABI;

const useStyles = makeStyles(styles);
const userStyles = makeStyles(userStyle);

export default function Dashboard (props) {
  const { ...rest } = props;

  // states and functions
  const [miniActive, setMiniActive] = React.useState(true);
  const [addr, setAddr] = React.useState("");
  const [etherBalance, setEtherBalance] = React.useState("");
  const [prufBalance, setPrufBalance] = React.useState("");
  const [isRefreshingEther, setIsRefreshingEther] = React.useState(false);
  const [isRefreshingPruf, setIsRefreshingPruf] = React.useState(false);
  const [redeeming, setRedeeming] = React.useState(false);
  const [currentChain, setCurrentChain] = React.useState("");
  const [web3, setWeb3] = React.useState();
  const [redeemAmount, setRedeemAmount] = React.useState("0");
  const [redeemList, setRedeemList] = React.useState([]);
  const [totalRewards, setTotalRewards] = React.useState(0);
  const [totalStaked, setTotalStaked] = React.useState(0);
  const [delegationList, setDelegationList] = React.useState([["Loading Balances...", "~", "~", "~"]]);
  const [findingTxs, setFindingTxs] = React.useState(false);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [tierOptions, setTierOptions] = React.useState([[],[],[],[]]);
  //const [tierOptions, setTierOptions] = React.useState([]);
  const [chainId, setChainId] = React.useState();
  const [util, setUtil] = React.useState({});
  const [stake, setStake] = React.useState({});
  const [stakeTkn, setStakeTkn] = React.useState({});
  const [loadingSums, setLoadingSums] = React.useState(false);
  // styles
  const classes = useStyles();
  const userClasses = userStyles();
  const startAfter = 0;
  const tierEmojis = ["💩", "🥉", "🥈", "🥇", "🚀", "💎"];
  const tierDescriptions = [
    "",
    "Lowest EO staking tier. For those who prefer a flexible arrangement.",
    "One month of token lock for generous staking rewards.",
    "60 days of stake unlock means high rewards. For the entry-level HODLer.",
    "Second highest staking tier. For true believers in the ecosystem.",
    "Highest EO staking tier. For serious HODLers who want serious rewards."
  ]
  const tierNames = [
    "",
    "Bronze Tier",
    "Silver Tier",
    "Gold Tier",
    "Moon Tier",
    "Diamond Tier"
  ]
  
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

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  }, []);

  const getAddress = (_web3) => {
    _web3.eth.net.getId().then((chainId) => {
      if (chainId === 42 || chainId === 80001 || chainId === 1 || chainId === 137) {
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

    setTotalRewards(Math.round(_totalRewards*1000)/1000);
    setTotalStaked(Math.round(_totalStaked*1000)/1000);
    setLoadingSums(false);
  };

  const getStakeOffers = (_web3, _stake, arr, iteration) => {
    if (!iteration) iteration = 1;
    if (!arr) arr = [[],[],[],[]];
    if (iteration > 5) return setTierOptions(JSON.parse(JSON.stringify(arr)));
    _stake.getStakeLevel(iteration + startAfter).call(async (error, result) => {
      if (!error) {
        console.log(result)

          let obj = {
            pos: iteration,
            id: iteration + startAfter,
            apr: ((Number(result["3"]) * 365) / Number(result["2"]) / 10).toFixed(2),
            max: Number(_web3.utils.fromWei(result["1"])),
            min: Number(_web3.utils.fromWei(result["0"])),
            interval: Number(result["2"]),
            eligible: prufBalance > Number(_web3.utils.fromWei(result["0"])),
            emoji: tierEmojis[iteration],
            description: tierDescriptions[iteration],
            tierName: tierNames[iteration],
          }

          arr[0].push(obj)

        // if(Number(result["2"]) === 7){
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
        getStakeOffers(_web3, _stake, arr, iteration + 1);
      }
    });
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
                let apr = (bonus / amount) * 100 * intervalToYear;
                let percentComplete = (timeElapsed / interval) * 100;
                if (percentComplete > 100) percentComplete = 100;
                let timeTilRedeem = Number(result["1"]) / 10000;
                let rewards = Number(_web3.utils.fromWei(result["0"]));
                arr.push([
                  `${ids[iteration]}`,
                  `${Math.round(apr*100)/100}%`,
                  `ü${Math.round(amount*100)/100}`,
                  `ü${Math.round(rewards*100)/100}`,
                  `${Math.round(percentComplete*100)/100}%`,
                  interval,
                  bonus,
                  percentComplete,
                  amount,
                  rewards,
                  timeTilRedeem,
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
      _stakeTkn = await new _web3.eth.Contract(STAKE_TKN_ABI, ETH_STAKE_TKN_ADDRESS);
    } else if (_chainId === 42) {
      _util = await new _web3.eth.Contract(UTIL_ABI, KOVAN_UTIL_ADDRESS);
      _stake = await new _web3.eth.Contract(STAKE_ABI, KOVAN_STAKE_ADDRESS);
      _stakeTkn = await new _web3.eth.Contract(STAKE_TKN_ABI, KOVAN_STAKE_TKN_ADDRESS);
    } else if (_chainId === 137) {
      _util = await new _web3.eth.Contract(UTIL_ABI, POLY_UTIL_ADDRESS);
      _stake = await new _web3.eth.Contract(STAKE_ABI, POLY_STAKE_ADDRESS);
      _stakeTkn = await new _web3.eth.Contract(STAKE_TKN_ABI, POLY_STAKE_TKN_ADDRESS);
    } else if (_chainId === 80001) {
      _util = await new _web3.eth.Contract(UTIL_ABI, MUMBAI_UTIL_ADDRESS);
      _stake = await new _web3.eth.Contract(STAKE_ABI, MUMBAI_STAKE_ADDRESS);
      _stakeTkn = await new _web3.eth.Contract(STAKE_TKN_ABI, MUMBAI_STAKE_TKN_ADDRESS);
    } else {
      return swalReact(`Unsupported chainId: ${_chainId}. Please connect to a supported chain.`)
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
      timeLeft = `${String(timeLeft).substring(0,2)} hours and ${Number(String(timeLeft).substring(2,4)) * 60} minutes `
    }

    if (isReady) {
      stake
        .claimBonus(id)
        .send({ from: addr })
        .on("receipt", () => {
          swalReact({
            icon: "success",
            text: `Successfully redeemed PRUF rewards!`,
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
      }).then(() => {
        viewStake(index);
      });
    }
  };

  const increaseStake = (index) => {
    if (index < 0) return 
    let amount = 0;
    let isReady =
    (delegationList[index][10] / 100) * delegationList[index][5] > 1;
  let timeLeft =
    24 - (delegationList[index][10] / 100) * delegationList[index][5] * 24;
  timeLeft = timeLeft.toFixed(2);

  if (timeLeft < 1) {
    timeLeft = `${timeLeft * 60} minutes`;
  } else {
    timeLeft = `${String(timeLeft).substring(0,2)} hours and ${Number(String(timeLeft).substring(2,4)) * 60} minutes `
  }

  let id = String(delegationList[Number(index)][0])

  if (isReady){
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
                amount = Math.round(Number(event.target.value)*1000000)/1000000;
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
        }).then(()=>{increaseStake(index)});
      } 
      else if (amount > Number(prufBalance)) {
        return swalReact({
          icon: "warning",
          text: `Insufficient PRUF!\n\n You are trying to add ü${amount}, but you only hold ü${Math.round(Number(prufBalance)*1000000)/1000000}.`,
        }).then(()=>{increaseStake(index)});
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
                  When a stake balance is increased, the stake unlock timer of the selected ID will be reset, and current rewards 
                  will be sent to your wallet. The selected ID will begin accumilating rewards which reflect your new balance as 
                  soon as the increase has been processed.
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
      }).then(value=>{
      if(value === "confirm"){
        console.log(`Adding ü${amount} to stake ID ${id}`)
        stake
          .increaseMyStake(id, web3.utils.toWei(String(amount)))
          .send({ from: addr })
          .on("receipt", () => {
            swalReact({
              icon: "success",
              text: `Successfully increased your stake on ID ${id}!`,
            });
            refreshDash();
            return refreshBalances("both", web3, addr);
          });
      } else {
        return viewStake(index)
      }
      
    })
    } else if (value === "back") {
      return viewStake(index)
    }
  })
} else {
  return swalReact({
    icon: "warning",
    text: `Holders must wait 24 hours after initial stake 
    or reward redemption before breaking their stake. 
    Please try again after ~${timeLeft}.`,
  }).then(() => {
    viewStake(index);
  });
} ;

  }

  const breakStake = (id, index) => {
    if (!index || !id) return;

    let isReady =
      (delegationList[index][10] / 100) * delegationList[index][5] > 1;
    let timeLeft =
      24 - (delegationList[index][10] / 100) * delegationList[index][5] * 24;
    timeLeft = timeLeft.toFixed(2);

    if (timeLeft < 1) {
      timeLeft = `${timeLeft * 60} minutes`;
    } else {
      timeLeft = `${String(timeLeft).substring(0,2)} hours and ${Number(String(timeLeft).substring(2,4)) * 60} minutes `
    }

    if (isReady){
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
        stake
          .breakStake(id)
          .send({ from: addr })
          .on("receipt", () => {
            swalReact({
              icon: "success",
              text: `Successfully broke stake and refunded PRUF!`,
            });
            refreshDash();
            return refreshBalances("both", web3, addr);
          });
      } else if (value === "back") {
        return viewStake(index)
      }
    })
  } else {
    return swalReact({
      icon: "warning",
      text: `Holders must wait 24 hours after initial stake 
      or reward redemption before breaking their stake. 
      Please try again after ~${timeLeft}.`,
    }).then(() => {
      viewStake(index);
    });
  } ;
  };

  const viewStake = (index) => {
    let confirmText = "Redeem Rewards", tooEarly = false;
    if ((delegationList[index][10] / 100) * delegationList[index][5] > 1){
      confirmText += "💰"
    } else {
      confirmText += "⏳"
      tooEarly = true;
    }
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
          <Button
              className="MLBGradient"
              onClick={() => {
                return increaseStake(index);
              }}
            >
              {" "}
              Increase Stake 🏛️{" "}
            </Button>
          {Number(
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
              Stop Earning {" "}
            </Button>
          ) : (
            <></>
          )}
        </Card>
      ),
      buttons: {
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
      },
    }).then((value) => {
      if (value === "Redeem") {
        claimRewards(index, String(delegationList[index][0]));
      } else return;
    });
  };

  const newStake = () => {
    let delegateAmount = 0;
    let isTierChecked = {
      chk1: false,
      chk2: false,
      chk3: false,
      chk4: false,
      chk5: false
    };

    let isDurationChecked = {
      chk1: false,
      chk2: false,
      chk3: false,
      chk4: false,
      chk5: false
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
                  <h5 className="delegationTipsContent">{props.description.trim()}</h5>
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
            <h4 className="delegationTitle">Delegate Funds</h4>
            <h5 className="delegateText">
              How long do you want to stake?
            </h5>
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
      }).then(value=>{if (value !== "back") tiersPopup(value)})
    }

    const tiersPopup = (value) => {

      isTierChecked = {
        chk1: false,
        chk2: false,
        chk3: false,
        chk4: false,
        chk5: false
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
            <h4 className="delegationTitle">Delegate Funds</h4>
            <h5 className="delegateText">
              Select your preferred staking tier:
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
            value: {isTierChecked, last: value},
            className: "delegationButtonBack",
          },

        },
      }).then(value=>{if (value === "back") return; else amountPopup(value)})
    // }
    }

    const amountPopup = (value) => {
        if (typeof value !== "object" || value === null) {
          return;
        }
        delegateAmount = 0;
        let last = value.last
        let trues = [];
        let vals = Object.values(value.isTierChecked);
  
        vals.forEach((e) => {
          if (e === true) trues.push(true);
        });
  
        if (trues.length > 1) {
          return swalReact({
            icon: "warning",
            text: "Please select only 1 option!",
          }).then(() => tiersPopup(value.last));
        } else if (trues.length === 0) {
          return swalReact({
            icon: "warning",
            text: "Please select an option!",
          }).then(() => tiersPopup(value.last));
        } else {
          console.log(vals.indexOf(true))
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
                      delegateAmount = Math.round(Number(event.target.value)*1000000)/1000000;
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
                value: {id, this: "confirm", last: value},
                className: "delegationButtonBack",
              },
            },
          }).then( value => {if (value === "back") tiersPopup(last); disclaimerPopup (value)})
        }
    }

    const disclaimerPopup = (value) => {
      if(!value) return
      if (delegateAmount > Number(prufBalance)) {
        swalReact({
          icon: "warning",
          text: `Insufficient PRUF!\n\n You are trying to stake ü${delegateAmount}, but you only hold ü${Math.round(Number(prufBalance)*1000000)/1000000}.`,
        });
      } else if (value.this === "confirm") {
        let last = value.last
        let id = value.id
        if (delegateAmount < Number(tierOptions[0][Number(id)].min)) {
          return swalReact({
            icon: "warning",
            text: `The minimum value for this staking tier is ${
              tierOptions[0][Number(id)].min
            }`
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
                    unlock period ends (
                    {tierOptions[0][Number(id)].interval} Days). Your stake
                    will continue to earn rewards even after the staking
                    period has ended. No action is required after you stake.
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Once the stake unlock period (
                    {tierOptions[0][Number(id)].interval} Days) has
                    concluded, you may break your stake if you wish. This is
                    optional. Once your stake is broken, your PRUF tokens
                    will be refunded. NOTE: IF YOU BREAK YOUR STAKE, THE
                    STAKE ID IS BURNED, AND IT WILL STOP EARNING REWARDS.
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    Remember, your stake will continue to earn rewards, even
                    after the stake unlock period has ended! Holders are
                    free to stake as long as they want.
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    {" "}
                    You are about to stake ü{delegateAmount} at an APR of {tierOptions[0][Number(id)].apr}%
                  </h5>
                </div>
                <div className="delegationTips">
                  <FiberManualRecordTwoTone className="delegationPin" />
                  <h5 className="delegationTipsContent">
                    {" "}
                    Estimated yearly return: ü{Math.round(delegateAmount * Number(tierOptions[0][Number(id)].apr / 100)*1000000)/1000000}
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
            let amount = web3.utils.toWei(String(delegateAmount));
            console.log(amount);
            stake
              .stakeMyTokens(amount, tierOptions[0][Number(id)].id)
              .send({ from: addr })
              .on("receipt", () => {
                swalReact({
                  icon: "success",
                  text: "Your PRUF has been staked successfully!",
                });
                refreshDash();
                return refreshBalances("both", web3, addr);
              });
          } else if (value === "back") {
            return amountPopup(last);
          } else {return}
        });
      } else {
        return 
      }
    }
    tiersPopup()
  };

  return (
    <div className={userClasses.wrapper}>
      <AdminNavbar brandText={getActiveRoute(routes)} {...rest} /> <br />
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
                      {chainId === 42 ? (
                        <img className="Icon" src={Eth} alt=""></img>
                      ) : (
                        <img className="Icon" src={Polygon} alt=""></img>
                      )}
                    </CardIcon>
                    {chainId === 42 ? (
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
                    onClick={() =>
                      window.open(
                        "https://prufio.medium.com/the-pr%C3%BCf-staking-protocol-c7a710fbf2ca"
                      )
                    }
                  >
                    <span className="material-icons">savings</span>
                  </CardIcon>
                  <p className={classes.cardCategory}>{`PRUF Staked`}</p>
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
                  <p
                    className={classes.cardCategory}
                  >{`Your Rewards`}</p>
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
                      _id = `${"# 0000".substring(0, 6-String(prop[0]).length)}${prop[0]}`
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
                  disabled={!(prufBalance >= 100)}
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
                        </div>
                      ),
                    };
                  })}
                />
                <Button
                  disabled={!(prufBalance >= 100)}
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
        <Footer fluid />
      </div>
    </div>
  );
}
