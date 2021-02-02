import React from "react";
import "../../assets/css/custom.css";
import swal from 'sweetalert';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Warning from "components/Typography/Warning.js";
import Danger from "components/Typography/Danger.js";


// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardText from "components/Card/CardText.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { DeleteOutline } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function Discard(props) {
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");

  const [assetInfo, setAssetInfo] = React.useState(window.sentPacket)

  const link = document.createElement('div')

  window.sentPacket = null

  const classes = useStyles();

  if (assetInfo === undefined || assetInfo === null) {
    return window.location.href = "/#/admin/home"
  }

  if (assetInfo.statusNum !== "59") {
    swal({
      title: "Asset not in correct status!",
      text: "This asset is not in discardable status, please set asset into discardable status before attempting to discard.",
      icon: "warning",
      button: "Close",
    });
    return window.location.href = "/#/admin/dashboard"
  }

  const discardAsset = async () => { //export held asset

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    await window.contracts.A_TKN.methods
      .discard(
        assetInfo.idxHash,
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
          title: "Discard Failed!",
          content: link,
          icon: "warning",
          button: "Close",
        });
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
          title: "Discard Successful!",
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
      <CardHeader color="info" icon>
        <CardIcon color="info" className="DBGradient">
          <DeleteOutline />
        </CardIcon>
        <h4 className={classes.cardIconTitle}>Discard Asset</h4>
      </CardHeader>
      <CardBody>
        <form>
          {!transactionActive && (
            <>
              <h4>Asset Selected: {assetInfo.name}</h4>
              <br />
              <h5>You are attempting to discard {assetInfo.name}.</h5>
            </>
          )}
          {!transactionActive && (
            <div className="MLBGradientSubmit">
              <Button color="info" className="MLBGradient" onClick={() => discardAsset()}>Discard Asset</Button>
            </div>
          )}
          {transactionActive && (
            <h3>
              Discarding Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
            </h3>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
