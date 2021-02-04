import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";
import "../../assets/css/custom.css";
import swal from 'sweetalert';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import CustomInput from "components/CustomInput/CustomInput.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Eth from "../../assets/img/eth-logo.png";
import Pruf from "../../assets/img/pruftoken.png";
import Patek from "../../assets/img/Patek.png";
import Apartment from "../../assets/img/Apartment.png";
// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import Add from "@material-ui/icons/Add";
import Category from "@material-ui/icons/Category";

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


import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import "../../assets/css/custom.css";

import { Cached } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function Home(props) {
  const classes = useStyles();


  const [error, setError] = React.useState("");
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [prufTransactionActive, setPrufTransactionActive] = React.useState(false);
  const [nodeTransactionActive, setNodeTransactionActive] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [rootName, setRootName] = React.useState("");
  const [txHash, setTxHash] = React.useState("");
  const [ACPrice, setACPrice] = React.useState("");
  const link = document.createElement('div')

  const [deposit, setDeposit] = React.useState(10000);
  const [loginDeposit, setloginDeposit] = React.useState(10000);
  const [loginDepositState, setloginDepositState] = React.useState("");

  const [root, setRoot] = React.useState("");
  const [loginRoot, setloginRoot] = React.useState("");
  const [loginRootState, setloginRootState] = React.useState("");

  const [ACName, setACName] = React.useState("");
  const [loginACName, setloginACName] = React.useState("");
  const [loginACNameState, setloginACNameState] = React.useState("");

  const rootLogin = event => {
    setRoot(event.target.value)
    if (event.target.value !== "") {
      setloginRootState("success");
    } else {
      setloginRootState("error");
    }

    setloginRoot(event.target.value);

    if (event.target.value === "101") {
      setRootName("Electronics")
    }
    if (event.target.value === "102") {
      setRootName("Collectables")
    }
    if (event.target.value === "103") {
      setRootName("Transportation")
    }
    if (event.target.value === "104") {
      setRootName("Virtual")
    }
    if (event.target.value === "105") {
      setRootName("Other")
    }
  };

  const clearPRuFForm = () => {
    setDeposit("");

    setloginDepositState("");
  };

  const clearACFrom = () => {
    setRoot("");
    setRootName("");
    setACName("");

    setloginRootState("");
    setloginACNameState("");
  };

  const purchasePRuF = async () => {
    let tempTxHash;

    if (loginDeposit === "" || loginDeposit < 10000) {
      setloginDepositState("error");
      return;
    }
    let amount;

    if (deposit < 10000 ) {
      swal({
        title: "PRUF Amount must be > 10000",
        icon: "warning",
        button: "Close",
      });
      return setloginDepositState("error");
    }

    else {
      amount = window.web3.utils.toWei(String(Math.round(deposit)))
    }

    setPrufTransactionActive(true)

    await window.web3.eth
      .sendTransaction({ from: props.addr, to: "0xA837a86dB071c8531AFf1D301C8Fd0f30c2c1E9A", value: amount / 100000 })
      .on("error", function (_error) {
        setPrufTransactionActive(false);
        setTxStatus(false);
        setTxHash(Object.values(_error)[0].transactionHash);
        tempTxHash = Object.values(_error)[0].transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setError(Object.values(_error)[0]);
        swal({
          title: "PRUF Minting Failed!",
          content: link,
          icon: "warning",
          button: "Close",
        });
        clearPRuFForm();
      })
      .on("receipt", (receipt) => {
        setPrufTransactionActive(false);
        setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setTxHash(receipt.transactionHash);
        swal({
          title: "PRUF Successfully Minted!",
          content: link,
          icon: "success",
          button: "Close",
        });
        window.resetInfo = true;
        window.recount = true;
      });
    return clearPRuFForm();
  }

  const purchaseNode = async () => {//create a new asset class record
    let tempTxHash;

    if (loginRoot === "" || loginACName === "") {

      if (loginRoot === "") {
        setloginRootState("error");
      }
      if (loginACName === "") {
        setloginACNameState("error");
      }
      return console.log("error");
    }

    setNodeTransactionActive(true)

    await window.contracts.AC_MGR.methods
      .purchaseACnode(
        ACName,
        root,
        "2",
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      )
      .send({ from: props.addr })
      .on("error", function (_error) {
        setNodeTransactionActive(false);
        setTxStatus(false);
        setTxHash(Object.values(_error)[0].transactionHash);
        tempTxHash = Object.values(_error)[0].transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setError(Object.values(_error)[0]);
        swal({
          title: "AC Node Minting Failed!",
          content: link,
          icon: "warning",
          button: "Close",
        });
        clearACFrom();
      })
      .on("receipt", (receipt) => {
        setNodeTransactionActive(false);
        setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setTxHash(receipt.transactionHash);
        swal({
          title: "AC Node Successfully Minted!",
          content: link,
          icon: "success",
          button: "Close",
        });
        window.resetInfo = true;
        window.recount = true;
      });

    return clearACFrom()
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon className="headerIconBack">
                <Category />
              </CardIcon>
              <p className={classes.cardCategory}>Assets Held</p>
              <h3 className={classes.cardTitle}>
                {props.assets} <small>Assets</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Success>
                  <Add />
                </Success>
                <a href="/#/admin/new-record">
                  Create New Record
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader stats icon>
              <CardIcon className="headerIconBack">
                <img className="Icon" src={Eth}></img>
              </CardIcon>
              <p className={classes.cardCategory}>ETH Balance</p>
              <h3 className={classes.cardTitle}>
                {props.ether.substring(0, 7)} <small>Ether</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Cached />
                <a href="">
                  Refresh
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon className="headerIconBack">
                <img className="Icon" src={Pruf}></img>
              </CardIcon>
              <p className={classes.cardCategory}>PRüF Balance</p>
              <h3 className={classes.cardTitle}>
                {props.pruf !== "~"
                  ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                  : <>{props.pruf} <small>PRüF</small></>}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Cached />
                <a href="">
                  Refresh
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <h3>Faucet (Testnet Only) </h3>
      <br />
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon className="headerIconBack">
                <img className="IconFaucet" src={Pruf}></img>
              </CardIcon>
              <h4 className={classes.cardIconTitle}>PRUF Faucet</h4>
            </CardHeader>
            <CardBody>
              <form>
                <h4>Conversion Rate: (ü100000/KETH1)</h4>
                <h7>Minimum Purchase amount is ü10000(KETH0.1)</h7>
                {!prufTransactionActive && (
                  <>
                    <CustomInput
                      success={loginDepositState === "success"}
                      error={loginDepositState === "error"}
                      labelText="PRUF Amount Request *"
                      id="pruf"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: event => {
                          setDeposit(event.target.value.trim())
                          if (event.target.value !== "" && event.target.value > 9999) {
                            setloginDepositState("success");
                          } else {
                            setloginDepositState("error");
                          }
                          setloginDeposit(event.target.value);
                        },
                        type: "number",
                        defaultValue: 10000
                      }}
                    />
                    <div className={classes.formCategory}>
                      <small>*</small> Required fields
              </div>
                  </>
                )}
                {prufTransactionActive && (
                  <>
                    <CustomInput
                      labelText={deposit}
                      id="deposit"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                      }}
                    />
                  </>
                )}
                {!prufTransactionActive && (
                  <div className="MLBGradientSubmit">
                    <Button color="info" className="MLBGradient" onClick={() => purchasePRuF()}>Purchase PRUF</Button>
                  </div>
                )}
                {prufTransactionActive && (
                  <h3>
                    Purchasing PRUF<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                  </h3>
                )}
              </form>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info" icon>
              <CardIcon className="headerIconBack">
                <Category />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Asset Class Node Faucet</h4>
              <h5 className={classes.cardIconTitle}>Current AC Price: ü{props.currentACPrice}</h5>
            </CardHeader>
            <CardBody>
              <form>
                <>
                  {!nodeTransactionActive && (
                    <>
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        {rootName === "" && (
                          <InputLabel
                          >
                            Select Root Class *
                          </InputLabel>
                        )}
                        {rootName !== "" && (
                          <InputLabel
                          >
                            {rootName}
                          </InputLabel>
                        )}
                        <Select
                          success={loginRootState === "success"}
                          error={loginRootState === "error"}
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={simpleSelect}
                          onChange={(e) => { rootLogin(e) }}
                          inputProps={{
                            name: "simpleSelect",
                            id: "simple-select"
                          }}
                        >
                          <MenuItem
                            disabled
                            classes={{
                              root: classes.selectMenuItem
                            }}
                          >
                            Select Root Class *
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="101"
                          >
                            Electronics
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="102"
                          >
                            Collectables
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="103"
                          >
                            Transportation
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="104"
                          >
                            Virtual
                          </MenuItem>
                          <MenuItem
                            classes={{
                              root: classes.selectMenuItem,
                              selected: classes.selectMenuItemSelected
                            }}
                            value="105"
                          >
                            Other
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <>
                        <CustomInput
                          success={loginACNameState === "success"}
                          error={loginACNameState === "error"}
                          labelText="AC Node Name *"
                          id="ACName"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => {
                              setACName(event.target.value.trim())
                              if (event.target.value !== "") {
                                setloginACNameState("success");
                              } else {
                                setloginACNameState("error");
                              }
                              setloginACName(event.target.value);
                            },
                          }}
                        />
                        <div className={classes.formCategory}>
                          <small>*</small> Required fields
                    </div>
                      </>
                    </>
                  )}
                  {nodeTransactionActive && (
                    <>
                      <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                      >
                        <InputLabel
                        >
                          {rootName}
                          </InputLabel>
                        <Select
                          MenuProps={{
                            className: classes.selectMenu
                          }}
                          classes={{
                            select: classes.select
                          }}
                          value={simpleSelect}
                          disabled
                          inputProps={{
                            name: "simpleSelect",
                            id: "simple-select"
                          }}
                        >
                        </Select>
                      </FormControl>

                      <CustomInput
                        labelText={ACName}
                        id="first"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                        }}
                      />
                    </>
                  )}
                </>
                {!nodeTransactionActive && (
                  <div className="MLBGradientSubmit">
                    <Button color="info" className="MLBGradient" onClick={() => purchaseNode()}>Create AC Node</Button>
                  </div>
                )}
                {nodeTransactionActive && (
                  <h3>
                    Creating AC Node <div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                  </h3>
                )}
              </form>
            </CardBody>
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={12} md={4}>
          <Card product>
            <CardHeader image className={classes.cardHeaderHover}>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={Apartment} alt="..." />
              </a>
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title="View"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="transparent" simple justIcon>
                    <ArtTrack className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Edit"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" simple justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Remove"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="danger" simple justIcon>
                    <Edit className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardProductTitle}>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  Cozy 5 Stars Apartment
                </a>
              </h4>
              <p className={classes.cardProductDesciprion}>
                Close to Barceloneta Beach, this brand new 5 star Apartment is located in the center of Barcelona, Spain. Just a 3 min
                walk to the bus station, this apartment is perfect for a family eager to travel the bustling city of Barcel...
              </p>
            </CardBody>
            <CardFooter product>
              <div className={classes.price}>
                <h4>ü80,000/night</h4>
              </div>
              <div className={`${classes.stats} ${classes.productStats}`}>
                <Place /> Barcelona, Spain
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card product>
            <CardHeader image className={classes.cardHeaderHover}>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={priceImage3} alt="..." />
              </a>
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title="View"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="transparent" simple justIcon>
                    <ArtTrack className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Edit"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" simple justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Remove"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="danger" simple justIcon>
                    <Edit className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardProductTitle}>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  16th Century Castle
                </a>
              </h4>
              <p className={classes.cardProductDesciprion}>
                Loactated in Milan, Italy, this 16th century castle is the greatest solution to your fairytale fantasies. Originally built for a royal family more than 400 years ago, the...
              </p>
            </CardBody>
            <CardFooter product>
              <div className={classes.price}>
                <h4>KETH1,250</h4>
              </div>
              <div className={`${classes.stats} ${classes.productStats}`}>
                <Place /> Milan, Italy
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card product>
            <CardHeader image className={classes.cardHeaderHover}>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={Patek} alt="..." />
              </a>
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title="View"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="transparent" simple justIcon>
                    <ArtTrack className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Edit"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" simple justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Remove"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="danger" simple justIcon>
                    <Edit className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardProductTitle}>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  Patek Philippe
                </a>
              </h4>
              <p className={classes.cardProductDesciprion}>
              Referance 5740/1 Nautilus perpetual calendar
              </p>
              <p className={classes.cardProductDesciprion}>
              Ultra-thin self-winding caliber 240 Q movement
              </p>
              <p className={classes.cardProductDesciprion}>
              Water resistant to 60M
              </p>
            </CardBody>
            <CardFooter product>
              <div className={classes.price}>
                <h4>◈129,999</h4>
              </div>
              <div className={`${classes.stats} ${classes.productStats}`}>
                <Place /> London, UK
              </div>
            </CardFooter>
          </Card>
        </GridItem> */}
      </GridContainer>
    </div>
  );
}
