import React from "react";
import "../../assets/css/custom.css";
import swalReact from "@sweetalert/with-react";


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CustomInput from "components/CustomInput/CustomInput.js";

import Eth from "../../assets/img/eth-logo.png";
import Shm from "../../assets/img/shm-logo.png";
import Pruf from "../../assets/img/pruftoken.png";
import Ada from "../../assets/img/adaCoin.png";
import Matic from "../../assets/img/adaCoin.png"
import Add from "@material-ui/icons/Add";
import CheckShield from "@material-ui/icons/VerifiedUser";
import NoAccount from "@material-ui/icons/PersonAdd";

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

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import "../../assets/css/custom.css";

import { Cached, DashboardOutlined } from "@material-ui/icons";
import { Polygon } from "@react-pdf/renderer";

const useStyles = makeStyles(styles);

export default function Home(props) {
  const classes = useStyles();

  const [error, setError] = React.useState("");
  const [prufTransactionActive, setPrufTransactionActive] =
    React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const link = document.createElement("div");
  const [isRefreshingEther, setIsRefreshingEther] = React.useState(false);
  const [isRefreshingPruf, setIsRefreshingPruf] = React.useState(false);

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
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon
                className="headerIconBack"
                onClick={() => window.open("https://pruf.io/")}
              >
                <img className="Icon" src={Pruf} alt=""></img>
              </CardIcon>
              <p className={classes.cardCategory}>PRUF Balance</p>
              {updatedPruf ? (
                <h3 className={classes.cardTitle}>
                  <>{String(Math.round(Number(updatedPruf) * 100) / 100)} </>
                </h3>
              ) : (
                <h3 className={classes.cardTitle}>
                  {/* eslint-disable-next-line react/prop-types */}
                  {props.pruf !== "~" ? (
                    <>
                      {/* eslint-disable-next-line react/prop-types */}
                      {String(
                        Math.round(
                          // eslint-disable-next-line react/prop-types
                          Number(props.pruf) * 100
                        ) / 100
                      )}{" "}
                    </>
                  ) : (
                    <>
                      {/* eslint-disable-next-line react/prop-types */}
                      {props.pruf}
                    </>
                  )}
                </h3>
              )}
            </CardHeader>
            <CardFooter stats>
              {!isRefreshingPruf && (
                <div className="refresh">
                  <Cached
                    onClick={() => {
                      window.replaceAssetData.refreshBals = true;
                      refreshBalances();
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
              {!prufTransactionActive && props.chainId === 42 && (
                <div className="MLBGradientSubmit">
                  <Button
                    color="info"
                    className="MLBGradient"
                    onClick={() => purchasePRUF()}
                  >
                    Get PRUF
                  </Button>
                </div>
              )}
              {!prufTransactionActive && props.chainId === 200101 && (
                <div className="MLBGradientSubmit">
                  <Button
                    color="info"
                    className="MLBGradient"
                    onClick={() => purchasePRUF()}
                  >
                    Get PRUF
                  </Button>
                </div>
              )}
              {!prufTransactionActive && props.chainId === 8080 && (
                <div className="MLBGradientSubmit">
                  <Button
                    color="info"
                    className="MLBGradient"
                    onClick={() => purchasePRUF()}
                  >
                    Get PRUF
                  </Button>
                </div>
              )}
              {prufTransactionActive && (
                <h5 className="transactionMessage">
                  Getting PRUF from the faucet
                  <div className="lds-ellipsisIF2">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </h5>
              )}
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader stats icon>
              <CardIcon
                className="headerIconBack"
                onClick={() => window.open("https://ethereum.org/en/")}
              >
                {props.chainId === 200101
                ? 
                <img className="Icon" src={Ada} alt=""></img>
                : 
                props.chainId === 80001 
                ? 
                <img className="Icon" src={Matic} alt=""></img>
                :
                props.chainId === 8080
                ?
                <img className="Icon" src={Shm} alt=""></img>
                :
                <img className="Icon" src={Eth} alt=""></img>
                }
              </CardIcon>

              {props.chainId === 200101
                ? 
                <p className={classes.cardCategory}>TWADA Balance</p>
                : 
                props.chainId === 80001 
                ? 
                <p className={classes.cardCategory}>MumMatic Balance</p>
                :
                props.chainId === 8080
                ?
                <p className={classes.cardCategory}>SHM Balance</p>
                :
                <p className={classes.cardCategory}>KETH Balance</p>
              }
              {updatedEther ? (
                <h3 className={classes.cardTitle}>
                  {updatedEther.substring(0, 7)}{" "}
                </h3>
              ) : // eslint-disable-next-line react/prop-types
              props.ether ? (
                <h3 className={classes.cardTitle}>
                  {/* eslint-disable-next-line react/prop-types */}
                  {props.ether.substring(0, 7)}{" "}
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
                      window.replaceAssetData.refreshBals = true;
                      refreshBalances();
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
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card onClick={() => (window.location.href = "/#/user/dashboard")}>
            <CardHeader color="info" stats icon>
              <CardIcon className="headerIconBack">
                <DashboardOutlined />
              </CardIcon>
              <p className={classes.cardCategory}>Assets Held</p>
              <Tooltip title="View Assets">
                {updatedAssets ? (
                  <h3 className={classes.cardTitle}>
                    {updatedAssets} <small>Assets</small>
                  </h3>
                ) : (
                  <h3 className={classes.cardTitle}>
                    {/* eslint-disable-next-line react/prop-types */}
                    {props.assets} <small>Assets</small>
                  </h3>
                )}
              </Tooltip>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Success>
                  <Add />
                </Success>
                <a className="homeCardText" href="/#/user/new-asset">
                  Mint New Asset
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={6} md={6} lg={3}>
                    <Card>
                        <CardHeader color="danger" stats icon>
                            {props.IDHolder === true || hasMinted === true ? (
                                <>
                                    <CardIcon
                                        className="headerIconBack"
                                        onClick={() => {
                                            swalReact({
                                                title:
                                                    'User address is already verified.',
                                                button: 'Okay',
                                            })
                                        }}
                                    >
                                        <CheckShield />
                                    </CardIcon>
                                    <p className={classes.cardCategory}>
                                        User Status
                                    </p>
                                    <Tooltip title="User already holds an ID token.">
                                        <h3 className={classes.cardTitle}>
                                            Verified
                                        </h3>
                                    </Tooltip>
                                </>
                            ) : 
                                props.IDHolder === false ? (
                                    <>
                                        <CardIcon
                                            className="headerIconBack"
                                            onClick={() => mintID()}
                                        >
                                            <NoAccount />
                                        </CardIcon>
                                        <p className={classes.cardCategory}>
                                            User Status
                                    </p>
                                        <h3 className={classes.cardTitle}>
                                            Not Verified
                                    </h3>
                                    </>
                                ) : (
                                    <>
                                        <CardIcon className="headerIconBack">
                                            <NoAccount />
                                        </CardIcon>
                                        <p className={classes.cardCategory}>
                                            User Status
                                    </p>
                                    </>
                                )}
                        </CardHeader>
                        <CardFooter stats>
                            {props.IDHolder === true || hasMinted === true ? (
                                <>
                                    <div className={classes.stats}>
                                        User Holds ID
                                    </div>
                                </>
                            ) :
                                props.IDHolder === false ? (
                                    !isMinting ? (
                                        <>
                                            <button
                                                className="homeCardText"
                                                onClick={() => mintID()}
                                            >
                                                No ID held by user
                                        </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className={classes.stats}>
                                                <div className="lds-ellipsisCard">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <div className={classes.stats}>
                                            <div className="lds-ellipsisCard">
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </div>
                                    </>
                                )}
                        </CardFooter>
                    </Card>
                </GridItem> */}
      </GridContainer>
      <Card>
        <CardHeader color="danger" stats icon>
          <CardIcon className="headerIconBack">
            <div className="centerJustifiedIcon">
            <span className="material-icons">store</span>
            </div>
            {/* <h4 className="centerJustifiedTitle"> */}
            <h4>Marketspace</h4>
          </CardIcon>
        </CardHeader>
        <h3 className="centerJustified">Coming Soon...</h3>
        <CardFooter stats></CardFooter>
      </Card>
      {/* <Card>
        <CardHeader color="info" icon>
          <CardIcon className="headerIconBack">
            <img className="IconFaucet" src={Pruf} alt=""></img>
          </CardIcon>
          <h4 className={classes.cardIconTitle}>
            PRUF Faucet (Kovan Testnet Only)
          </h4>
        </CardHeader>
        {!props.addr && (
          <CardBody>
            <form>
              <h3 className="bump">
                <br />
                Please{" "}
                <a
                  onClick={() => {
                    if (window.ethereum) {
                      window.ethereum
                        .request({
                          method: "eth_accounts",
                          params: {},
                        })
                        .then(async (accounts) => {
                          console.log(
                            window.web3.utils.toChecksumAddress(accounts[0])
                          );
                        });
                    } else swalReact("No ethereum provider detected");
                  }}
                >
                  connect
                </a>{" "}
                to an Ethereum provider.
              </h3>
            </form>
          </CardBody>
        )}
        {props.prufClient === undefined && props.addr && (
          <CardBody>
            <form>
              <h3>
                Connecting to the blockchain
                <div className="lds-ellipsisIF">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </h3>
            </form>
          </CardBody>
        )}

        {props.prufClient !== undefined &&
          props.prufClient !== {} &&
          props.addr && (
            <CardBody>
              <form>
                {!prufTransactionActive && (
                  <div className="MLBGradientSubmit">
                    <Button
                      color="info"
                      className="MLBGradient"
                      onClick={() => purchasePRUF()}
                    >
                      Get PRUF
                    </Button>
                  </div>
                )}
                {prufTransactionActive && (
                  <h3>
                    Getting PRUF from the faucet
                    <div className="lds-ellipsisIF">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </h3>
                )}
              </form>
            </CardBody>
          )}
      </Card> */}
    </div>
  );
}
