import React from "react";
import "../../assets/css/custom.css";
import swal from 'sweetalert';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { SwapHoriz } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function Transfer(props) {

  const [address, setAddress] = React.useState("");
  const [loginAddress, setloginAddress] = React.useState("");
  const [loginAddressState, setloginAddressState] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");

  const [assetInfo, setAssetInfo] = React.useState(window.sentPacket)

  const link = document.createElement('div')

  window.sentPacket = null

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      console.log("Scrolled to ", props.ps.element.scrollTop)
    }
  }, [])

  const clearForms = () => {
    setAddress("");
    setloginAddressState("");
    console.log("clearing forms")
  };

  const classes = useStyles();

  if (assetInfo === undefined || assetInfo === null) {
    console.log("No asset found. Rerouting...")
    return window.location.href = "/#/admin/home"
  }

  if (assetInfo.statusNum !== "51") {
    swal({
      title: "Asset not in correct status!",
      text: "This asset is not in a transferrable status, please set asset into transferrable status before attempting to transfer.",
      icon: "warning",
      button: "Close",
    });
    return window.location.href = "/#/admin/dashboard"
  }

  const transferAsset = async () => { //transfer held asset

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
          icon: "warning",
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

  return (
    <Card>
      <CardHeader icon>
        <CardIcon className="headerIconBack">
          <SwapHoriz />
        </CardIcon>
        <h4 className={classes.cardIconTitle}>Transfer Asset</h4>
      </CardHeader>
      <CardBody>
        <form>
          <h4>Asset Selected: {assetInfo.name}</h4>
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
          <div className={classes.formCategory}>
            <small>*</small> Required fields
              </div>
          {!transactionActive && (
            <div className="MLBGradientSubmit">
              <Button color="info" className="MLBGradient" onClick={() => transferAsset()}>Transfer Asset</Button>
            </div>
          )}
          {transactionActive && (
            <h3>
              Transferring Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
            </h3>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
