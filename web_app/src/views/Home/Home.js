import React from "react";
import "../../assets/css/custom.css";
import swalReact from "@sweetalert/with-react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

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
  Dashboard,
  FiberManualRecordTwoTone,
  ListAltRounded,
  MultilineChart,
  Settings,
  ShowChart,
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

export default function Home(props) {
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
  const [dash, setDash] = React.useState(true);
  const [delegation, setDelegation] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [rewards, setRewards] = React.useState(true);
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

  const setDashButton = () => {
    setDash(true);
    setDelegation(false);
    setAnalytics(false);
  };

  const setDelegationButton = () => {
    // setDash(false)
    // setDelegation(true)
    // setAnalytics(false)
    swalReact("Coming Soon!");
  };

  const setAnalyticsButton = () => {
    // setDash(false)
    // setDelegation(false)
    swalReact("Coming Soon!");
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
      <div className="flex">
        <div>
          <Card className="home1">
            <h4 className="home1text1">
              Discover, collect, and sell extraordinary NFTs
            </h4>
            <h4 className="home1text2">
              OpenSea is the world's first and largest NFT marketplace
            </h4>
            <div>
              <Button className="button1" onClick={() => (window.location.href = "/#/user/search")}>Explore</Button>
              <Button className="button2" onClick={() => (window.location.href = "/#/user/new-asset")}>Create</Button>
            </div>
          </Card>
        </div>
        <div className="home2">
          <Card image className="home2Card">
            <img
              title="View Asset"
              src={placeholder}
              alt=""
              className="homeAssetImage"
            />
            <CardBody>
              <h5 className={classes.cardTitleMain}>Name: Test</h5>
              <h5 className={classes.cardTitle}>Node: Test</h5>
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="flex">
        <Card className="CJTbold4">
            <h4 className="home1text4">Top Collections</h4>
        </Card>
      </div>
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
              <div className="CJTbold3">
                <Card className="topCollectionsCardTitle">
                  <h4>Name</h4>
                </Card>
              </div>
              <div className="CJTbold2">
                <Card className="topCollectionsItemCard">
                  <CardHeader>
                    <h4>Items</h4>
                  </CardHeader>
                  <CardFooter stats>Views</CardFooter>
                </Card>
                <Card className="topCollectionsItemCard2">
                  <CardHeader>
                    <h4>Floor</h4>
                  </CardHeader>
                  <CardFooter stats>7 days volume</CardFooter>
                </Card>
              </div>
            </Card>
          </GridItem>
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
              <div className="CJTbold3">
                <Card className="topCollectionsCardTitle">
                  <h4>Name</h4>
                </Card>
              </div>
              <div className="CJTbold2">
                <Card className="topCollectionsItemCard">
                  <CardHeader>
                    <h4>Items</h4>
                  </CardHeader>
                  <CardFooter stats>Views</CardFooter>
                </Card>
                <Card className="topCollectionsItemCard2">
                  <CardHeader>
                    <h4>Floor</h4>
                  </CardHeader>
                  <CardFooter stats>7 days volume</CardFooter>
                </Card>
              </div>
            </Card>
          </GridItem>
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
              <div className="CJTbold3">
                <Card className="topCollectionsCardTitle">
                  <h4>Name</h4>
                </Card>
              </div>
              <div className="CJTbold2">
                <Card className="topCollectionsItemCard">
                  <CardHeader>
                    <h4>Items</h4>
                  </CardHeader>
                  <CardFooter stats>Views</CardFooter>
                </Card>
                <Card className="topCollectionsItemCard2">
                  <CardHeader>
                    <h4>Floor</h4>
                  </CardHeader>
                  <CardFooter stats>7 days volume</CardFooter>
                </Card>
              </div>
            </Card>
          </GridItem>
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
              <div className="CJTbold3">
                <Card className="topCollectionsCardTitle">
                  <h4>Name</h4>
                </Card>
              </div>
              <div className="CJTbold2">
                <Card className="topCollectionsItemCard">
                  <CardHeader>
                    <h4>Items</h4>
                  </CardHeader>
                  <CardFooter stats>Views</CardFooter>
                </Card>
                <Card className="topCollectionsItemCard2">
                  <CardHeader>
                    <h4>Floor</h4>
                  </CardHeader>
                  <CardFooter stats>7 days volume</CardFooter>
                </Card>
              </div>
            </Card>
          </GridItem>
        </GridContainer>
      </Card>
      <div className="flex">
        <div>
          <Card className="home1">
            <h4 className="home1text3">PRüF University</h4>
            <h4 className="home1text2">
              Be a part of the forefront of NFT tech and creators. (Graphics:
              how to mint, what are NFTs, selling your nfts, etc.)
            </h4>
          </Card>
        </div>
      </div>
      <div className="flex">
        <Card className="CJTbold4">
            <h4 className="home1text4">Browse by Category</h4>
        </Card>
      </div>
        <Card className="categoryBox">
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card image className="categoryItem">
                <img
                  title="View Asset"
                  src={monkey}
                  alt=""
                  className="categoryAssetImage"
                />
                <h4 className="center">Art</h4>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card image className="categoryItem">
                <img
                  title="View Asset"
                  src={monkey}
                  alt=""
                  className="categoryAssetImage"
                />
                <h4 className="center">Collectables</h4>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card image className="categoryItem">
                <img
                  title="View Asset"
                  src={monkey}
                  alt=""
                  className="categoryAssetImage"
                />
                <h4 className="center">Domain Names</h4>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card image className="categoryItem">
                <img
                  title="View Asset"
                  src={monkey}
                  alt=""
                  className="categoryAssetImage"
                />
                <h4 className="center">Music</h4>
              </Card>
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card image className="categoryItem">
                <img
                  title="View Asset"
                  src={monkey}
                  alt=""
                  className="categoryAssetImage"
                />
                <h4 className="center">Photography</h4>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card image className="categoryItem">
                <img
                  title="View Asset"
                  src={monkey}
                  alt=""
                  className="categoryAssetImage"
                />
                <h4 className="center">Sports</h4>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card image className="categoryItem">
                <img
                  title="View Asset"
                  src={monkey}
                  alt=""
                  className="categoryAssetImage"
                />
                <h4 className="center">Trading Cards</h4>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={3}>
              <Card image className="categoryItem">
                <img
                  title="View Asset"
                  src={monkey}
                  alt=""
                  className="categoryAssetImage"
                />
                <h4 className="center">Virtual Worlds</h4>
              </Card>
            </GridItem>
          </GridContainer>
        </Card>
    </div>
  );
}
