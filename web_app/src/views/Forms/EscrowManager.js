import React from "react";
import "../../assets/css/custom.css";
import swal from 'sweetalert';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Contacts from "@material-ui/icons/Contacts";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import AccountBox from "@material-ui/icons/AccountBox";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardText from "components/Card/CardText.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { TransferWithinAStation } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function EscrowManager(props) {

  const [address, setAddress] = React.useState("");
  const [loginAddress, setloginAddress] = React.useState("");
  const [loginAddressState, setloginAddressState] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const [assetInfo, setAssetInfo] = React.useState(window.sentPacket)
  const [isSettingEscrow, setIsSettingEscrow] = React.useState(undefined)
  const [escrowOwner, setEscrowOwner] = React.useState("")
  const [escrowTime, setEscrowTime] = React.useState("")
  const [escrowStatus, setEscrowStatus] = React.useState("")

  const [loginEscrowOwner, setloginEscrowOwner] = React.useState("")
  const [loginEscrowTime, setloginEscrowTime] = React.useState("")
  const [loginEescrowStatus, setloginEscrowStatus] = React.useState("")

  const [loginEscrowOwnerState, setloginEscrowOwnerState] = React.useState("")
  const [loginEscrowTimeState, setloginEscrowTimeState] = React.useState("")
  const [loginEscrowStatusState, setloginEscrowStatusState] = React.useState("")

  const link = document.createElement('div')

  window.sentPacket = null


  const setEscrow = async () => { //transfer held asset

    if (loginAddress === "") {
      setloginAddressState("error");
      return;
    }

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    await window.contracts.ECR.methods
      .setEscrow(
        assetInfo.idxHash,
        address,
        assetInfo.idxHash
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
        swal({
          title: "Transfer Failed!",
          content: link,
          icon: "Warning",
          button: "Close",
        });
        clearForms();
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
          title: "Transfer Successful!",
          content: link,
          icon: "success",
          button: "Close",
        });
        window.resetInfo = true;
        window.recount = true;
        window.location.href = "/#/admin/dashboard"
      });

  }

  
  const endEscrow = async () => { //transfer held asset

    if (loginAddress === "") {
      setloginAddressState("error");
      return;
    }

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    await window.contracts.A_TKN.methods
      .safeTransferFrom(
        props.addr,
        address,
        assetInfo.idxHash
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
        swal({
          title: "Transfer Failed!",
          content: link,
          icon: "Warning",
          button: "Close",
        });
        clearForms();
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
          title: "Transfer Successful!",
          content: link,
          icon: "success",
          button: "Close",
        });
        window.resetInfo = true;
        window.recount = true;
        window.location.href = "/#/admin/dashboard"
      });

  }

  const clearForms = () => {
    setAddress("");
    setloginAddressState("");
    console.log("clearing forms")
  };

  const classes = useStyles();
  return (
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info" className="DBGradient">
              <TransferWithinAStation />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Escrow Manager</h4>
          </CardHeader>
          <CardBody>
            <form>
              <h4>Asset Selected: {assetInfo.name}</h4>
              {!isSettingEscrow && (
              <h4>Current Status: {assetInfo.status}</h4>
              )}
        {isSettingEscrow && (
          <>
          <CustomInput
            success={loginEscrowOwnerState === "success"}
            error={loginEscrowOwnerState === "error"}
            labelText="Escrow Agent Address *"
            id="address"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => {
                setEscrowOwner(event.target.value.trim())
                if (event.target.value !== "") {
                  setloginEscrowOwnerState("success");
                } else {
                  setloginEscrowOwnerState("error");
                }
                setloginEscrowOwner(event.target.value);
              },
            }}
          />
          <CustomInput
            success={loginEscrowTimeState === "success"}
            error={loginEscrowTimeState === "error"}
            labelText="Escrow Period *"
            id="time"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "number",
              onChange: event => {
                setEscrowTime(event.target.value.trim())
                if (event.target.value !== "") {
                  setloginEscrowTimeState("success");
                } else {
                  setloginEscrowTimeState("error");
                }
                setloginEscrowTime(event.target.value);
              },
            }}
          />
          <CustomInput
            success={loginAddressState === "success"}
            error={loginAddressState === "error"}
            labelText="Recieving Address *"
            id="address"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: event => {
                setAddress(event.target.value.trim())
                if (event.target.value !== "") {
                  setloginAddressState("success");
                } else {
                  setloginAddressState("error");
                }
                setloginAddress(event.target.value);
              },
            }}
          />
          </>
        )}
          {!transactionActive && assetInfo.statusNum == "50" || assetInfo.statusNum == "56" && (
            <Button color="info" className="MLBGradient"onClick={() => setIsSettingEscrow(false)}>End Escrow</Button>
          )}
          {!transactionActive && assetInfo.statusNum !== "50" || assetInfo.statusNum !== "56" && (
            <Button color="info" className="MLBGradient"onClick={() => setIsSettingEscrow(true)}>Set Escrow</Button>
          )}
            </form>
          </CardBody>
        </Card>
  );
}
