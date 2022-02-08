import React from "react";
import "../../assets/css/custom.css";
import swalReact from "@sweetalert/with-react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import Eth from "../../assets/img/eth-logo2.png";
import EthGray from "../../assets/img/eth-logogray.png";
import Pruf from "../../assets/img/pruftoken.png";
import PrufBlk from "../../assets/img/pruftokenblk.png";
import Select from "@material-ui/core/Select";
import ReactTable from "components/ReactTable/ReactTable.js";
import placeholder from "../../assets/img/monalisa.jpeg";
import monkey from "../../assets/img/bigmonkey.jpeg";
import ReactTableSimple from "components/ReactTable/ReactTableSimple.js";
import {
  AccountBalance,
  AccountBalanceWallet,
  BarChartRounded,
  Brush,
  Build,
  Dashboard,
  Dns,
  FiberManualRecordTwoTone,
  ListAltRounded,
  MultilineChart,
  MusicNote,
  PhotoCamera,
  Public,
  Receipt,
  Settings,
  ShowChart,
  SportsBasketball,
  StarRate,
  Store,
  TrendingUp,
  VpnKey,
} from "@material-ui/icons";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Danger from "components/Typography/Danger";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Success from "components/Typography/Success.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Tooltip from "@material-ui/core/Tooltip";
import MenuItem from "@material-ui/core/MenuItem";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import selectStyles from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import "../../assets/css/custom.css";

import { Cached, DashboardOutlined } from "@material-ui/icons";
import { isMobile } from "react-device-detect";

const useStyles = makeStyles(styles);
const useSelectStyles = makeStyles(selectStyles);

export default function Explore(props) {
  const classes = useStyles();
  const selectClasses = useSelectStyles();

  const [error, setError] = React.useState("");
  const [prufTransactionActive, setPrufTransactionActive] =
    React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const link = document.createElement("div");
  const [isRefreshingEther, setIsRefreshingEther] = React.useState(false);
  const [isRefreshingPruf, setIsRefreshingPruf] = React.useState(false);

  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [trending, setTrending] = React.useState(true);
  const [top, setTop] = React.useState(false);
  const [art, setArt] = React.useState(false);
  const [collectables, setCollectables] = React.useState(false);
  const [domainNames, setDomainNames] = React.useState(false);
  const [music, setMusic] = React.useState(false);
  const [photography, setPhotography] = React.useState(false);
  const [sports, setSports] = React.useState(false);
  const [tradingCards, setTradingCards] = React.useState(false);
  const [utility, setUtility] = React.useState(false);
  const [virtualWorlds, setVirtualWorlds] = React.useState(false);
  const [rewards, setRewards] = React.useState(false);
  const [updatedEther, setUpdatedEther] = React.useState();
  const [updatedPruf, setUpdatedPruf] = React.useState();
  const [updatedAssets, setUpdatedAssets] = React.useState();

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }, []);

  const clearPRUFForm = () => {};

  const purchasePRUF = async () => {
    setPrufTransactionActive(true);
    let tempTxHash;

    props.prufClient.faucet
      .getPRUF()
      .send({ from: props.addr })
      .on("error", function (_error) {
        setPrufTransactionActive(false);
        setTxStatus(false);
        setTxHash(Object.values(_error)[0].transactionHash);
        tempTxHash = Object.values(_error)[0].transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        setError(Object.values(_error)[0]);
        if (tempTxHash !== undefined) {
          swalReact({
            title: "Something went wrong!",
            content: link,
            icon: "warning",
            button: "Close",
          });
        }
        if (tempTxHash === undefined) {
          swalReact({
            title: "Something went wrong!",
            icon: "warning",
            button: "Close",
          });
        }
        clearPRUFForm();
      })
      .on("receipt", (receipt) => {
        setPrufTransactionActive(false);
        setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        setTxHash(receipt.transactionHash);
        swalReact({
          title: "PRUF Successfully Minted!",
          content: link,
          icon: "success",
          button: "Close",
        });
        window.replaceAssetData.refreshBals = true;
        refreshBalances();
        forceUpdate();
      });

    console.log(window.ipfs);

    console.log();

    return clearPRUFForm();
  };

  const setTrendingButton = () => {
    setArt(false);
    setCollectables(false);
    setDomainNames(false);
    setMusic(false);
    setPhotography(false);
    setSports(false);
    setTop(false);
    setTradingCards(false);
    setTrending(true);
    setUtility(false);
    setVirtualWorlds(false);
  };

  const setTopButton = () => {
    setArt(false);
    setCollectables(false);
    setDomainNames(false);
    setMusic(false);
    setPhotography(false);
    setSports(false);
    setTop(true);
    setTradingCards(false);
    setTrending(false);
    setUtility(false);
    setVirtualWorlds(false);
  };

  const setArtButton = () => {
    setArt(true);
    setCollectables(false);
    setDomainNames(false);
    setMusic(false);
    setPhotography(false);
    setSports(false);
    setTop(false);
    setTradingCards(false);
    setTrending(false);
    setUtility(false);
    setVirtualWorlds(false);
  };

  const setCollectablesButton = () => {
    setArt(false);
    setCollectables(true);
    setDomainNames(false);
    setMusic(false);
    setPhotography(false);
    setSports(false);
    setTop(false);
    setTradingCards(false);
    setTrending(false);
    setUtility(false);
    setVirtualWorlds(false);
  };

  const setDomainNamesButton = () => {
    setArt(false);
    setCollectables(false);
    setDomainNames(true);
    setMusic(false);
    setPhotography(false);
    setSports(false);
    setTop(false);
    setTradingCards(false);
    setTrending(false);
    setUtility(false);
    setVirtualWorlds(false);
  };

  const setMusicButton = () => {
    setArt(false);
    setCollectables(false);
    setDomainNames(false);
    setMusic(true);
    setPhotography(false);
    setSports(false);
    setTop(false);
    setTradingCards(false);
    setTrending(false);
    setUtility(false);
    setVirtualWorlds(false);
  };

  const setPhotographyButton = () => {
    setArt(false);
    setCollectables(false);
    setDomainNames(false);
    setMusic(false);
    setPhotography(true);
    setSports(false);
    setTop(false);
    setTradingCards(false);
    setTrending(false);
    setUtility(false);
    setVirtualWorlds(false);
  };

  const setUtilityButton = () => {
    setArt(false);
    setCollectables(false);
    setDomainNames(false);
    setMusic(false);
    setPhotography(false);
    setSports(false);
    setTop(false);
    setTradingCards(false);
    setTrending(false);
    setUtility(true);
    setVirtualWorlds(false);
  };

  const setVirtualWorldsButton = () => {
    setArt(false);
    setCollectables(false);
    setDomainNames(false);
    setMusic(false);
    setPhotography(false);
    setSports(false);
    setTop(false);
    setTradingCards(false);
    setTrending(false);
    setUtility(false);
    setVirtualWorlds(true);
  };

  const setSportsButton = () => {
    setArt(false);
    setCollectables(false);
    setDomainNames(false);
    setMusic(false);
    setPhotography(false);
    setSports(true);
    setTop(false);
    setTradingCards(false);
    setTrending(false);
    setUtility(false);
    setVirtualWorlds(false);
  };

  const setTradingCardsButton = () => {
    setArt(false);
    setCollectables(false);
    setDomainNames(false);
    setMusic(false);
    setPhotography(false);
    setSports(false);
    setTop(false);
    setTradingCards(true);
    setTrending(false);
    setUtility(false);
    setVirtualWorlds(false);
  };

  const refreshBalances = () => {
    if (!props.addr) return;
    console.log("Refreshing balances");
    console.log(window.replaceAssetData);

    if (props.prufClient && props.prufClient.get) {
      window.dispatchEvent(props.refresh);
      window.web3.eth.getBalance(props.addr, (error, result) => {
        if (error) {
          console.log("error");
        } else {
          setUpdatedEther(window.web3.utils.fromWei(result, "ether"));
        }
      });

      props.prufClient.get.asset
        // eslint-disable-next-line react/prop-types
        .balanceOf(props.addr)
        .then((e) => {
          setUpdatedAssets(e);
        });

      props.prufClient.get.pruf
        // eslint-disable-next-line react/prop-types
        .balanceOf(props.addr)
        .then((e) => {
          setUpdatedPruf(e);
        });

      forceUpdate();
    } else {
      window.web3.eth.getBalance(props.addr, (error, result) => {
        if (error) {
          console.log("error");
        } else {
          setUpdatedEther(window.web3.utils.fromWei(result, "ether"));
        }
      });
    }

    // eslint-disable-next-line react/prop-types
  };

  return (
    <div>
      <Card>
        <CardHeader icon className="nodeHeader">
          <CardIcon className="headerIconBack">
            <Store />
          </CardIcon>
          <div className="flexRowWide">
            <h4 className={classes.cardIconTitle}>Marketplace</h4>
          </div>
          {trending && (
            <Button className="categoryButtonActive">
              <TrendingUp />
              Trending
            </Button>
          )}
          {!trending && (
            <Button
              className="categoryButton"
              onClick={() => {
                setTrendingButton();
              }}
            >
              <TrendingUp />
              Trending
            </Button>
          )}
          {top && (
            <Button className="categoryButtonActive">
              <StarRate />
              Top
            </Button>
          )}
          {!top && (
            <Button
              className="categoryButton"
              onClick={() => {
                setTopButton();
              }}
            >
              <StarRate />
              Top
            </Button>
          )}
          {art && (
            <Button className="categoryButtonActive">
              <Brush />
              Art
            </Button>
          )}
          {!art && (
            <Button
              className="categoryButton"
              onClick={() => {
                setArtButton();
              }}
            >
              <Brush />
              Art
            </Button>
          )}
          {collectables && (
            <Button className="categoryButtonActive">
              <Dashboard />
              Collectables
            </Button>
          )}
          {!collectables && (
            <Button
              className="categoryButton"
              onClick={() => {
                setCollectablesButton();
              }}
            >
              <Dashboard />
              Collectables
            </Button>
          )}
          {domainNames && (
            <Button className="categoryButtonActive">
              <Dns />
              Domain Names
            </Button>
          )}
          {!domainNames && (
            <Button
              className="categoryButton"
              onClick={() => {
                setDomainNamesButton();
              }}
            >
              <Dns />
              Domain Names
            </Button>
          )}
          {music && (
            <Button className="categoryButtonActive">
              <MusicNote />
              Music
            </Button>
          )}
          {!music && (
            <Button
              className="categoryButton"
              onClick={() => {
                setMusicButton();
              }}
            >
              <MusicNote />
              Music
            </Button>
          )}
          {photography && (
            <Button className="categoryButtonActive">
              <PhotoCamera />
              Photography
            </Button>
          )}
          {!photography && (
            <Button
              className="categoryButton"
              onClick={() => {
                setPhotographyButton();
              }}
            >
              <PhotoCamera />
              Photography
            </Button>
          )}
          {sports && (
            <Button className="categoryButtonActive">
              <SportsBasketball />
              Sports
            </Button>
          )}
          {!sports && (
            <Button
              className="categoryButton"
              onClick={() => {
                setSportsButton();
              }}
            >
              <SportsBasketball />
              Sports
            </Button>
          )}
          {tradingCards && (
            <Button className="categoryButtonActive">
              <Receipt />
              Trading Cards
            </Button>
          )}
          {!tradingCards && (
            <Button
              className="categoryButton"
              onClick={() => {
                setTradingCardsButton();
              }}
            >
              <Receipt />
              Trading Cards
            </Button>
          )}
          {utility && (
            <Button className="categoryButtonActive">
              <Build />
              Utility
            </Button>
          )}
          {!utility && (
            <Button
              className="categoryButton"
              onClick={() => {
                setUtilityButton();
              }}
            >
              <Build />
              Utility
            </Button>
          )}
          {virtualWorlds && (
            <Button className="categoryButtonActive">
              <Public />
              Virtual Worlds
            </Button>
          )}
          {!virtualWorlds && (
            <Button
              className="categoryButton"
              onClick={() => {
                setVirtualWorldsButton();
              }}
            >
              <Public />
              Virtual Worlds
            </Button>
          )}
        </CardHeader>
        {/* <br/> */}
      </Card>
      {trending && (
        <Card className="topCollectionsBox">
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card image className="topCollectionsItem">
                <img
                  title="View Asset"
                  src={monkey}
                  alt=""
                  className="collectionsAssetImage"
                />
                <div className="prufPlaceholder">
                  <img
                    title="View Asset"
                    src={PrufBlk}
                    alt=""
                    className="collectionsPRUFAsset"
                  />
                </div>
                <div className="exploreBold">
                  <Card className="topCollectionsCardTitle">
                    <h4 className="exploreTitle">Name</h4>
                  </Card>
                </div>
                <div className="exploreBold">
                  <Card className="exploreCollectionsCard">
                    <p className="exploreCollectionstext">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Ut odio temporibus voluptas error distinctio hic quae
                      corrupti vero doloribus optio! Inventore ex quaerat modi
                      blanditiis soluta maiores illum, ab velit.
                    </p>
                  </Card>
                </div>
                <div className="chainSymbolPad">
                  <img className="chainSymbol" src={EthGray} alt=""></img>
                </div>
              </Card>
            </GridItem>
          </GridContainer>
        </Card>
      )}
    </div>
  );
}
