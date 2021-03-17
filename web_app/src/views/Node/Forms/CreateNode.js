import React from "react";
import "../../../assets/css/custom.css";
import swal from 'sweetalert';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Accordion from "components/Accordion/Accordion.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import cardStyles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { CeckCircleOutline, CheckCircleOutline, GroupAdd } from "@material-ui/icons";
import { Component } from "react";
import placeholder from "../../../assets/img/placeholder.jpg";
import placeholderCheck from "../../../assets/img/placeholderCheck.jpg";
import placeholderComingSoon from "../../../assets/img/placeholderComingSoon.jpg";
import Success from "components/Typography/Success";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles(styles);
const useCardStyles = makeStyles(cardStyles);

export default function CreateNode(props) {

  //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

  const [transactionActive, setTransactionActive] = React.useState(false);

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const [mintedID, setMintedID] = React.useState(false);
  const [selectedRootID, setSelectedRootID] = React.useState("");
  const [advanced, setAdvanced] = React.useState(false)

  const [name, setName] = React.useState("");
  const [root, setRoot] = React.useState("");
  const [ipfs, setIPFS] = React.useState("");
  const [pricingObj, setPricingObj] = React.useState({})

  const [loginName, setloginName] = React.useState("");
  const [loginIPFS, setloginIPFS] = React.useState("");
  const [loginRoot, setloginRoot] = React.useState("");

  const [loginNameState, setloginNameState] = React.useState("");
  const [loginIPFSState, setloginIPFSState] = React.useState("");
  const [loginRootState, setloginRootState] = React.useState("");

  const [standard1, setStandard1] = React.useState(true);
  const [standard2, setStandard2] = React.useState(false);
  const [standard3, setStandard3] = React.useState(false);

  const [locked1, setLocked1] = React.useState(true);
  const [locked2, setLocked2] = React.useState(true);
  const [locked3, setLocked3] = React.useState(true);
  const [locked4, setLocked4] = React.useState(true);
  const [locked5, setLocked5] = React.useState(true);
  const [locked6, setLocked6] = React.useState(true);
  const [locked7, setLocked7] = React.useState(true);
  const [locked8, setLocked8] = React.useState(true);

  const [operation1, setOperation1] = React.useState("0");
  const [operation2, setOperation2] = React.useState("0");
  const [operation3, setOperation3] = React.useState("0");
  const [operation4, setOperation4] = React.useState("0");
  const [operation5, setOperation5] = React.useState("0");
  const [operation6, setOperation6] = React.useState("0");
  const [operation7, setOperation7] = React.useState("0");
  const [operation8, setOperation8] = React.useState("0");
  const [beneficiaryAddress1, setBeneficiaryAddress1] = React.useState(props.addr);
  const [beneficiaryAddress2, setBeneficiaryAddress2] = React.useState(props.addr);
  const [beneficiaryAddress3, setBeneficiaryAddress3] = React.useState(props.addr);
  const [beneficiaryAddress4, setBeneficiaryAddress4] = React.useState(props.addr);
  const [beneficiaryAddress5, setBeneficiaryAddress5] = React.useState(props.addr);
  const [beneficiaryAddress6, setBeneficiaryAddress6] = React.useState(props.addr);
  const [beneficiaryAddress7, setBeneficiaryAddress7] = React.useState(props.addr);
  const [beneficiaryAddress8, setBeneficiaryAddress8] = React.useState(props.addr);

  const [loginOperation1, setloginOperation1] = React.useState("");
  const [loginOperation2, setloginOperation2] = React.useState("");
  const [loginOperation3, setloginOperation3] = React.useState("");
  const [loginOperation4, setloginOperation4] = React.useState("");
  const [loginOperation5, setloginOperation5] = React.useState("");
  const [loginOperation6, setloginOperation6] = React.useState("");
  const [loginOperation7, setloginOperation7] = React.useState("");
  const [loginOperation8, setloginOperation8] = React.useState("");

  const [loginBeneficiaryAddress1, setloginBeneficiaryAddress1] = React.useState("");
  const [loginBeneficiaryAddress2, setloginBeneficiaryAddress2] = React.useState("");
  const [loginBeneficiaryAddress3, setloginBeneficiaryAddress3] = React.useState("");
  const [loginBeneficiaryAddress4, setloginBeneficiaryAddress4] = React.useState("");
  const [loginBeneficiaryAddress5, setloginBeneficiaryAddress5] = React.useState("");
  const [loginBeneficiaryAddress6, setloginBeneficiaryAddress6] = React.useState("");
  const [loginBeneficiaryAddress7, setloginBeneficiaryAddress7] = React.useState("");
  const [loginBeneficiaryAddress8, setloginBeneficiaryAddress8] = React.useState("");

  const [loginOperation1State, setloginOperation1State] = React.useState("");
  const [loginOperation2State, setloginOperation2State] = React.useState("");
  const [loginOperation3State, setloginOperation3State] = React.useState("");
  const [loginOperation4State, setloginOperation4State] = React.useState("");
  const [loginOperation5State, setloginOperation5State] = React.useState("");
  const [loginOperation6State, setloginOperation6State] = React.useState("");
  const [loginOperation7State, setloginOperation7State] = React.useState("");
  const [loginOperation8State, setloginOperation8State] = React.useState("");

  const [loginBeneficiaryAddress1State, setloginBeneficiaryAddress1State] = React.useState("");
  const [loginBeneficiaryAddress2State, setloginBeneficiaryAddress2State] = React.useState("");
  const [loginBeneficiaryAddress3State, setloginBeneficiaryAddress3State] = React.useState("");
  const [loginBeneficiaryAddress4State, setloginBeneficiaryAddress4State] = React.useState("");
  const [loginBeneficiaryAddress5State, setloginBeneficiaryAddress5State] = React.useState("");
  const [loginBeneficiaryAddress6State, setloginBeneficiaryAddress6State] = React.useState("");
  const [loginBeneficiaryAddress7State, setloginBeneficiaryAddress7State] = React.useState("");
  const [loginBeneficiaryAddress8State, setloginBeneficiaryAddress8State] = React.useState("");

  const [nodeInfo,] = React.useState(window.sentPacket)

  const link = document.createElement('div')
  const sampleIpfs = {
    idHashFields: [["Field 1", "field 1 placeholder"], ["Field 2", "field 2 placeholder"], ["Field 3", "field 3 placeholder"], ["Field 4", "field 4 placeholder"]], ownerHashFields: [], landingConfig: { url: "", DBref: "" }, nodeAssets: { photo: {}, text: {} }
  }

  window.sentPacket = null

  const classes = useStyles();
  const cardClasses = useCardStyles();

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    }
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }

  }, [])

  const generateRootList = (arr) => {
    let rootNames = props.rootNames
    if (!arr || !rootNames) return
    let rootSelection = [
      <MenuItem
        disabled
        key={"keySelClass"}
        classes={{
          root: classes.selectMenuItem
        }}
      >
        Select a Class
      </MenuItem>
    ];

    for (let i = 0; i < arr.length; i++) {
      rootSelection.push(
        <MenuItem
          key={"key" + String(arr[i])}
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected
          }}
          value={String(arr[i])}
        >
          {rootNames[i]}
        </MenuItem>
      );
    }

    return rootSelection;

  }

  const rootLogin = (e) => {

    if (!e.target.value) return setRoot("")
    if (!props.IDHolder && !mintedID) {
      IDHolderPrompt()
    }

    else {
      setRoot(e.target.value)
      setSelectedRootID(e.target.value)
    }
  }


  const IDHolderPrompt = () => {

    if (!props.addr) {
      return swal({
        title: "Could not get user address",
        icon: "warning",
        text: "Please connect to an Ethereum provider and try again.",
        buttons: {
          close: {
            text: "close",
            value: "close"
          }
        },
      })
    }
    let tempTxHash;

    swal({
      title: "In order to purchase a node token, you must first have an ID token.",
      icon: "warning",
      text: "If you would like to mint an ID token, please select Yes",
      buttons: {
        yes: {
          text: "Yes",
          value: "yes"
        },
        no: {
          text: "No",
          value: "no"
        }
      },
    })
      .then((value) => {
        switch (value) {

          case "yes":
            setTransactionActive(true)

            const pageKey = thousandHashesOf(props.addr, props.winKey)

            window.contracts.PARTY.methods
              .GET_ID()
              .send({ from: props.addr })
              .on("error", function (_error) {
                setTransactionActive(false);
                setTxStatus(false);
                setTxHash(Object.values(_error)[0].transactionHash);
                tempTxHash = Object.values(_error)[0].transactionHash;
                let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
                let str2 = "' target='_blank'>here</a>";
                link.innerHTML = String(str1 + tempTxHash + str2);
                if (tempTxHash !== undefined) {
                  swal({
                    title: "Something went wrong!",
                    content: link,
                    icon: "warning",
                    button: "Close",
                  });
                }
                if (tempTxHash === undefined) {
                  swal({
                    title: "Something went wrong!",
                    icon: "warning",
                    button: "Close",
                  });
                }
              })
              .on("receipt", (receipt) => {
                setTransactionActive(false);
                setTxStatus(receipt.status);
                tempTxHash = receipt.transactionHash;
                let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
                let str2 = "' target='_blank'>here</a>";
                link.innerHTML = String(str1 + tempTxHash + str2);
                swal({
                  title: "ID Token Minted!",
                  content: link,
                  icon: "success",
                  button: "Close"
                }).then(() => {
                  window.replaceAssetData = { IDHolder: true }
                  setMintedID(true)
                })
              })

            break;

          case "no":
            break;

          default:
            break;
        }
      });


  }

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return window.location.href = "/#/user/home"
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  }

  const setStandard = (standard) => {
    switch (standard) {
      case ("1"): {
        setStandard1(true);
        setStandard2(false);
        setStandard3(false);
        break
      }
      case ("2"): {
        setStandard1(false);
        setStandard2(true);
        setStandard3(false);
        break
      }
      case ("3"): {
        setStandard1(false);
        setStandard2(false);
        setStandard3(true);
        break
      }
      default: {
        console.log("Error in standard switch")
      }
    }
  }

  const setPrices = () => {
    console.log(pricingObj)
  }

  const handlePriceAdjustment = (job, val) => {
    let tempObj = JSON.parse(JSON.stringify(pricingObj))
    if(!val || val < 0){
      delete tempObj[job]
      setPricingObj(tempObj)
    }
    else{
      tempObj[job] = String(val)
      setPricingObj(tempObj)
    }
  }

  const handleNewAssetClass = async () => {
    const pageKey = thousandHashesOf(props.addr, props.winKey);
    let id;
    await window.contracts.AC_MGR.methods
      .resolveAssetClass(name)
      .call(function (_error, _result) {
        if (_error) {
          return (console.log("IN ERROR IN ERROR IN ERROR"))
        } else {
          id = _result
          let tempArr = props.nodeList;
          tempArr.push([name, id, "N/A", "N/A"])
          window.replaceAssetData = { key: pageKey, nodeList: tempArr }
          window.location.href = "/#/user/node-manager";
        } 
    }); 
    
  }

  const setLayout = () => {
    let component = [];
    component.push(
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart className={cardClasses.cardHover} onClick={() => setStandard("1")}>
            <CardHeader image icon className={cardClasses.cardHeaderHoverDashboard}>
              {/* {standard1 && (
                <img title="View Asset" src={placeholderCheck} alt="" />
              )} */}
              {/* {!standard1 && (
                <img title="View Asset" src={placeholder} alt="" />
              )} */}
              {/* @dev temp */}
              <img title="View Asset" src={placeholderComingSoon} alt="" />
            </CardHeader>
            {/* <CardBody>
              Standard 1
            </CardBody> */}
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={12} md={4}>
          <Card chart className={cardClasses.cardHover} onClick={() => setStandard("2")}>
            <CardHeader image className={cardClasses.cardHeaderHoverDashboard}>
              {standard2 && (
                <img title="View Asset" src={placeholderCheck} alt="" />
              )}
              {!standard2 && (
                <img title="View Asset" src={placeholder} alt="" />
              )}
            </CardHeader>
            <CardBody>
              Standard 2
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart className={cardClasses.cardHover} onClick={() => setStandard("3")}>
            <CardHeader image className={cardClasses.cardHeaderHoverDashboard}>
              {standard3 && (
                <img title="View Asset" src={placeholderCheck} alt="" />
              )}
              {!standard3 && (
                <img title="View Asset" src={placeholder} alt="" />
              )}
            </CardHeader>
            <CardBody>
              Standard 3
            </CardBody>
          </Card>
        </GridItem> */}
      </GridContainer>
    );
    return component
  }

  const setPricing = () => {
    let component = [];
    component.push(
      <Card className="pricingCard">
        <Card className="pricingCard">
          <Tooltip
            title="New Asset, Recycle, Import"
            arrow
          >
            <Button className="operationButton">Operation 1 :</Button>
          </Tooltip>
          <CustomInput
            success={loginOperation1State === "success"}
            error={loginOperation1State === "error"}
            labelText="In PRüF (ü)"
            id="operation1"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "number",
              value: (operation1),
              onChange: event => {
                handlePriceAdjustment("1", Number(event.target.value).toFixed(3))
                setOperation1(event.target.value.trim())
                if (event.target.value !== "") {
                  setloginOperation1State("success");
                } else {
                  setloginOperation1State("error");
                }
                setloginOperation1(event.target.value);
              },
            }}
          />
          <div className="beneficiaryAddressCheckbox">

            <Tooltip
              title="Change node action rewards address."
            >
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => setLocked1(!locked1)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot
                }}
                label="Edit Beneficiary"
              />
            </Tooltip>
            {locked1 && (
              <CustomInput
                success={loginBeneficiaryAddress1State === "success"}
                error={loginBeneficiaryAddress1State === "error"}
                labelText="Beneficiary Address 1"
                id="beneficiaryAddress1"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  disabled: "true",
                  defaultValue: beneficiaryAddress1,
                }}
              />
            )}
            {!locked1 && (
              <CustomInput
                success={loginBeneficiaryAddress1State === "success"}
                error={loginBeneficiaryAddress1State === "error"}
                labelText="Beneficiary Address 1"
                id="beneficiaryAddress1"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  defaultValue: beneficiaryAddress1,
                  onChange: event => {
                    setBeneficiaryAddress1(event.target.value.trim())
                    if (event.target.value !== "") {
                      setloginBeneficiaryAddress1State("success");
                    } else {
                      setloginBeneficiaryAddress1State("error");
                    }
                    setloginBeneficiaryAddress1(event.target.value);
                  },
                }}
              />
            )}
          </div>
        </Card>

        <Card className="pricingCard">
          <Tooltip
            title="Unused in current application"
            arrow
          >
            <Button className="operationButton">Operation 2 :</Button>
          </Tooltip>
          <CustomInput
            success={loginOperation2State === "success"}
            error={loginOperation2State === "error"}
            labelText="In PRüF (ü)"
            id="operation2"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "number",
              value: (operation2),
              onChange: event => {
                handlePriceAdjustment("2", Number(event.target.value).toFixed(3))
                setOperation2(event.target.value.trim())
                if (event.target.value !== "") {
                  setloginOperation2State("success");
                } else {
                  setloginOperation2State("error");
                }
                setloginOperation2(event.target.value);
              },
            }}
          />

          <div className="beneficiaryAddressCheckbox">

            <Tooltip
              title="Change node action rewards address."
            >
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => setLocked2(!locked2)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot
                }}
                label="Edit Beneficiary"
              />
            </Tooltip>
            {locked2 && (
              <CustomInput
                success={loginBeneficiaryAddress2State === "success"}
                error={loginBeneficiaryAddress2State === "error"}
                labelText="Beneficiary Address 2"
                id="beneficiaryAddress2"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  disabled: "true",
                  defaultValue: beneficiaryAddress2,
                }}
              />
            )}
            {!locked2 && (
              <CustomInput
                success={loginBeneficiaryAddress2State === "success"}
                error={loginBeneficiaryAddress2State === "error"}
                labelText="Beneficiary Address 2"
                id="beneficiaryAddress2"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  defaultValue: beneficiaryAddress2,
                  onChange: event => {
                    setBeneficiaryAddress2(event.target.value.trim())
                    if (event.target.value !== "") {
                      setloginBeneficiaryAddress2State("success");
                    } else {
                      setloginBeneficiaryAddress2State("error");
                    }
                    setloginBeneficiaryAddress2(event.target.value);
                  },
                }}
              />
            )}
          </div>
        </Card>
        <Card className="pricingCard">
          <Tooltip
            title="Unused in current application"
            arrow
          >
            <Button className="operationButton">Operation 3 :</Button>
          </Tooltip>
          <CustomInput
            success={loginOperation3State === "success"}
            error={loginOperation3State === "error"}
            labelText="In PRüF (ü)"
            id="operation3"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "number",
              value: (operation3),
              onChange: event => {
                handlePriceAdjustment("3", Number(event.target.value).toFixed(3))
                setOperation3(event.target.value.trim())
                if (event.target.value !== "") {
                  setloginOperation3State("success");
                } else {
                  setloginOperation3State("error");
                }
                setloginOperation3(event.target.value);
              },
            }}
          />

          <div className="beneficiaryAddressCheckbox">

            <Tooltip
              title="Change node action rewards address."
            >
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => setLocked3(!locked3)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot
                }}
                label="Edit Beneficiary"
              />
            </Tooltip>
            {locked3 && (
              <CustomInput
                success={loginBeneficiaryAddress3State === "success"}
                error={loginBeneficiaryAddress3State === "error"}
                labelText="Beneficiary Address 3"
                id="beneficiaryAddress3"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  disabled: "true",
                  defaultValue: beneficiaryAddress3,
                }}
              />
            )}
            {!locked3 && (
              <CustomInput
                success={loginBeneficiaryAddress3State === "success"}
                error={loginBeneficiaryAddress3State === "error"}
                labelText="Beneficiary Address 3"
                id="beneficiaryAddress3"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  defaultValue: beneficiaryAddress3,
                  onChange: event => {
                    setBeneficiaryAddress3(event.target.value.trim())
                    if (event.target.value !== "") {
                      setloginBeneficiaryAddress3State("success");
                    } else {
                      setloginBeneficiaryAddress3State("error");
                    }
                    setloginBeneficiaryAddress3(event.target.value);
                  },
                }}
              />
            )}
          </div>
        </Card>

        <Card className="pricingCard">
          <Tooltip
            title="Unused in current application"
            arrow
          >
            <Button className="operationButton">Operation 4 :</Button>
          </Tooltip>
          <CustomInput
            success={loginOperation4State === "success"}
            error={loginOperation4State === "error"}
            labelText="In PRüF (ü)"
            id="operation4"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "number",
              value: (operation4),
              onChange: event => {
                handlePriceAdjustment("4", Number(event.target.value).toFixed(3))
                setOperation4(event.target.value.trim())
                if (event.target.value !== "") {
                  setloginOperation4State("success");
                } else {
                  setloginOperation4State("error");
                }
                setloginOperation4(event.target.value);
              },
            }}
          />

          <div className="beneficiaryAddressCheckbox">

            <Tooltip
              title="Change node action rewards address."
            >
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => setLocked4(!locked4)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot
                }}
                label="Edit Beneficiary"
              />
            </Tooltip>
            {locked4 && (
              <CustomInput
                success={loginBeneficiaryAddress4State === "success"}
                error={loginBeneficiaryAddress4State === "error"}
                labelText="Beneficiary Address 4"
                id="beneficiaryAddress4"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  disabled: "true",
                  defaultValue: beneficiaryAddress4,
                }}
              />
            )}
            {!locked4 && (
              <CustomInput
                success={loginBeneficiaryAddress4State === "success"}
                error={loginBeneficiaryAddress4State === "error"}
                labelText="Beneficiary Address 4"
                id="beneficiaryAddress4"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  defaultValue: beneficiaryAddress4,
                  onChange: event => {
                    setloginBeneficiaryAddress4(event.target.value.trim())
                    if (event.target.value !== "") {
                      setloginBeneficiaryAddress4State("success");
                    } else {
                      setloginBeneficiaryAddress4State("error");
                    }
                    setloginBeneficiaryAddress4(event.target.value);
                  },
                }}
              />
            )}
          </div>
        </Card>

        <Card className="pricingCard">
          <Tooltip
            title="Change Status"
            arrow
          >
            <Button className="operationButton">Operation 5 :</Button>
          </Tooltip>
          <CustomInput
            success={loginOperation5State === "success"}
            error={loginOperation5State === "error"}
            labelText="In PRüF (ü)"
            id="operation5"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "number",
              value: (operation5),
              onChange: event => {
                handlePriceAdjustment("5", Number(event.target.value).toFixed(3))
                setOperation5(event.target.value.trim())
                if (event.target.value !== "") {
                  setloginOperation5State("success");
                } else {
                  setloginOperation5State("error");
                }
                setloginOperation5(event.target.value);
              },
            }}
          />

          <div className="beneficiaryAddressCheckbox">

            <Tooltip
              title="Change node action rewards address."
            >
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => setLocked5(!locked5)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot
                }}
                label="Edit Beneficiary"
              />
            </Tooltip>
            {locked5 && (
              <CustomInput
                success={loginBeneficiaryAddress5State === "success"}
                error={loginBeneficiaryAddress5State === "error"}
                labelText="Beneficiary Address 5"
                id="beneficiaryAddress5"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  disabled: "true",
                  defaultValue: beneficiaryAddress5,
                }}
              />
            )}
            {!locked5 && (
              <CustomInput
                success={loginBeneficiaryAddress5State === "success"}
                error={loginBeneficiaryAddress5State === "error"}
                labelText="Beneficiary Address 5"
                id="beneficiaryAddress5"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  defaultValue: beneficiaryAddress5,
                  onChange: event => {
                    setBeneficiaryAddress5(event.target.value.trim())
                    if (event.target.value !== "") {
                      setloginBeneficiaryAddress5State("success");
                    } else {
                      setloginBeneficiaryAddress5State("error");
                    }
                    setloginBeneficiaryAddress5(event.target.value);
                  },
                }}
              />
            )}
          </div>
        </Card>

        <Card className="pricingCard">
          <Tooltip
            title="Change Owner Info"
            arrow
          >
            <Button className="operationButton">Operation 6 :</Button>
          </Tooltip>
          <CustomInput
            success={loginOperation6State === "success"}
            error={loginOperation6State === "error"}
            labelText="In PRüF (ü)"
            id="operation6"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "number",
              value: (operation6),
              onChange: event => {
                handlePriceAdjustment("6", Number(event.target.value).toFixed(3))
                setOperation6(event.target.value.trim())
                if (event.target.value !== "") {
                  setloginOperation6State("success");
                } else {
                  setloginOperation6State("error");
                }
                setloginOperation6(event.target.value);
              },
            }}
          />

          <div className="beneficiaryAddressCheckbox">

            <Tooltip
              title="Change node action rewards address."
            >
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => setLocked6(!locked6)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot
                }}
                label="Edit Beneficiary"
              />
            </Tooltip>
            {locked6 && (
              <CustomInput
                success={loginBeneficiaryAddress6State === "success"}
                error={loginBeneficiaryAddress6State === "error"}
                labelText="Beneficiary Address 6"
                id="beneficiaryAddress6"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  disabled: "true",
                  defaultValue: beneficiaryAddress6,
                }}
              />
            )}
            {!locked6 && (
              <CustomInput
                success={loginBeneficiaryAddress6State === "success"}
                error={loginBeneficiaryAddress6State === "error"}
                labelText="Beneficiary Address 6"
                id="beneficiaryAddress6"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  defaultValue: beneficiaryAddress6,
                  onChange: event => {
                    setBeneficiaryAddress6(event.target.value.trim())
                    if (event.target.value !== "") {
                      setloginBeneficiaryAddress6State("success");
                    } else {
                      setloginBeneficiaryAddress6State("error");
                    }
                    setloginBeneficiaryAddress6(event.target.value);
                  },
                }}
              />
            )}
          </div>
        </Card>

        <Card className="pricingCard">
          <Tooltip
            title="Unused in current application"
            arrow
          >
            <Button className="operationButton">Operation 7 :</Button>
          </Tooltip>
          <CustomInput
            success={loginOperation7State === "success"}
            error={loginOperation7State === "error"}
            labelText="In PRüF (ü)"
            id="operation7"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "number",
              value: (operation7),
              onChange: event => {
                handlePriceAdjustment("7", Number(event.target.value).toFixed(3))
                setOperation7(event.target.value.trim())
                if (event.target.value !== "") {
                  setloginOperation7State("success");
                } else {
                  setloginOperation7State("error");
                }
                setloginOperation7(event.target.value);
              },
            }}
          />

          <div className="beneficiaryAddressCheckbox">

            <Tooltip
              title="Change node action rewards address."
            >
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => setLocked7(!locked7)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot
                }}
                label="Edit Beneficiary"
              />
            </Tooltip>
            {locked7 && (
              <CustomInput
                success={loginBeneficiaryAddress7State === "success"}
                error={loginBeneficiaryAddress7State === "error"}
                labelText="Beneficiary Address 7"
                id="beneficiaryAddress7"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  disabled: "true",
                  defaultValue: beneficiaryAddress7,
                }}
              />
            )}
            {!locked7 && (
              <CustomInput
                success={loginBeneficiaryAddress7State === "success"}
                error={loginBeneficiaryAddress7State === "error"}
                labelText="Beneficiary Address 7"
                id="beneficiaryAddress7"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  defaultValue: beneficiaryAddress7,
                  onChange: event => {
                    setBeneficiaryAddress7(event.target.value.trim())
                    if (event.target.value !== "") {
                      setloginBeneficiaryAddress7State("success");
                    } else {
                      setloginBeneficiaryAddress7State("error");
                    }
                    setloginBeneficiaryAddress7(event.target.value);
                  },
                }}
              />
            )}
          </div>
        </Card>

        <Card className="pricingCard">
          <Tooltip
            title="Change Asset Info"
            arrow
          >
            <Button className="operationButton">Operation 8 :</Button>
          </Tooltip>
          <CustomInput
            success={loginOperation8State === "success"}
            error={loginOperation8State === "error"}
            labelText="In PRüF (ü)"
            id="operation8"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "number",
              value: (operation8),
              onChange: event => {
                handlePriceAdjustment("8", Number(event.target.value).toFixed(3))
                setOperation8(event.target.value.trim())
                if (event.target.value !== "") {
                  setloginOperation8State("success");
                } else {
                  setloginOperation8State("error");
                }
                setloginOperation8(event.target.value);
              },
            }}
          />

          <div className="beneficiaryAddressCheckbox">

            <Tooltip
              title="Change node action rewards address."
            >
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => setLocked8(!locked8)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                }
                classes={{
                  label: classes.label,
                  root: classes.labelRoot
                }}
                label="Edit Beneficiary"
              />
            </Tooltip>
            {locked8 && (
              <CustomInput
                success={loginBeneficiaryAddress8State === "success"}
                error={loginBeneficiaryAddress8State === "error"}
                labelText="Beneficiary Address 8"
                id="beneficiaryAddress8"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  disabled: "true",
                  defaultValue: beneficiaryAddress8,
                }}
              />
            )}
            {!locked8 && (
              <CustomInput
                success={loginBeneficiaryAddress8State === "success"}
                error={loginBeneficiaryAddress8State === "error"}
                labelText="Beneficiary Address 8"
                id="beneficiaryAddress8"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  defaultValue: beneficiaryAddress8,
                  onChange: event => {
                    setBeneficiaryAddress8(event.target.value.trim())
                    if (event.target.value !== "") {
                      setloginBeneficiaryAddress8State("success");
                    } else {
                      setloginBeneficiaryAddress8State("error");
                    }
                    setloginBeneficiaryAddress8(event.target.value);
                  },
                }}
              />
            )}
          </div>
        </Card>
      </Card>
    );
    return component
  }

  const checkForAC = async () => {
    setTransactionActive(true);

    await window.contracts.AC_MGR.methods
      .resolveAssetClass(name)
      .call(function (_error, _result) {
        if (_error || _result === undefined) {
          window.ipfs.add(sampleIpfs).then((hash)=>{
            if (!hash) {
              console.error("error sending to ipfs")
              //return setIpfsActive(false);
            }
            else{
              let url = `https://ipfs.io/ipfs/${hash.cid}`
              console.log(`Url --> ${url}`)
              let b32Hash = window.utils.getBytes32FromIPFSHash(String(hash.cid))
              //setIpfsActive(false);
              purchaseNode(b32Hash)
            } 
          })
        } else {
          swal({
            title: "That name has already been reserved! Try a differnet one, or contact the team: support@pruf.io",
            button: "Okay",
          });
        } 
    }); 
  }

  const purchaseNode = async (ipfsHash) => { //import held asset

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    await window.contracts.AC_MGR.methods
      .purchaseACnode(
        name,
        root,
        2,
        ipfsHash,
      )
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransactionActive(false);
        setTxStatus(false);
        setTxHash(Object.values(_error)[0].transactionHash);
        tempTxHash = Object.values(_error)[0].transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setError(Object.values(_error)[0]);
        if (tempTxHash !== undefined) {
          swal({
            title: "Something went wrong!",
            content: link,
            icon: "warning",
            button: "Close",
          });
        }
        if (tempTxHash === undefined) {
          swal({
            title: "Something went wrong!",
            icon: "warning",
            button: "Close",
          });
        }
      })
      .on("receipt", (receipt) => {
        setTransactionActive(false);
        setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setTxHash(receipt.transactionHash);
        swal({
          title: "Owner Change Successful!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(() => {
          //refreshBalances()
          handleNewAssetClass()
        })
      });

  }

  return (
    <Card>
      <CardHeader icon>
        <CardIcon className="headerIconBack">
          <span class="material-icons">
            dashboard_customize
</span>
        </CardIcon>
        <Button color="info" className="MLBGradient" onClick={() => window.location.href = "/#/user/node-manager"}>Go Back</Button>
        <h3 className={classes.cardIconTitle}>Configure New Node</h3>
      </CardHeader>
      <CardBody>
        <form>
          <h5 className="costsText">Cost: ü{props.currentACPrice}</h5>
          <>
            {!transactionActive && (
              <>
                <CustomInput
                  success={loginNameState === "success"}
                  error={loginNameState === "error"}
                  labelText="Name *"
                  id="name"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => {
                      setName(event.target.value.trim())
                      if (event.target.value !== "") {
                        setloginNameState("success");
                      } else {
                        setloginNameState("error");
                      }
                      setloginName(event.target.value);
                    },
                  }}
                />
                <FormControl
                  fullWidth
                  className={classes.selectFormControl}
                >
                  <InputLabel
                  >
                    Select Asset Class *
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    classes={{
                      select: classes.select
                    }}
                    value={root}
                    onChange={(e) => { rootLogin(e) }}
                    inputProps={{
                      name: "rootSelect",
                      id: "root-select"
                    }}
                  >
                    {props.roots !== undefined && (
                      generateRootList(props.roots)
                  )}
                  </Select>
                </FormControl>
                <br/>
                <div className={classes.formCategory}>
                  <small>*</small> Required fields
                    </div>

                {/* <div className={classes.checkboxAndRadio}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => setAdvanced(!advanced)}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot
                    }}
                    label="Advanced Options"
                  />
                </div>
                {advanced && (
                  <Card>
                    <CardHeader>
                      <h4 className={classes.cardTitle}>Advanced Options</h4>
                    </CardHeader>
                    <CardBody>
                      <Accordion
                        // active={0}
                        collapses={[
                          {
                            title: "Set Pricing (Optional)",
                            content:
                              setPricing()
                          },
                          {
                            title: "Select Class Layout (Optional)",
                            content:
                              setLayout()
                          }
                        ]}
                      />
                    </CardBody>
                  </Card>
                )} */}
              </>
            )}
            {transactionActive && (
              <>
                <CustomInput
                  labelText={name}
                  id="name"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={root}
                  id="root"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={ipfs}
                  id="ipfs"
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
          {!transactionActive && (
            <div className="MLBGradientSubmit">
              <Button color="info" className="MLBGradient" onClick={() => checkForAC()}>Purchase AC Node</Button>
            </div>
          )}
          {transactionActive && (
            <h3>
              Changing Owner Information<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
            </h3>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
