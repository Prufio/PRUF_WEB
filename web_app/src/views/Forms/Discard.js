import React from "react";
import "../../assets/css/custom.css";
import swal from "sweetalert";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { DeleteOutline } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function Discard(props) {
  //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}
  if(!window.sentPacket) window.sentPacket = {}

  const [transactionActive, setTransactionActive] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [showHelp, setShowHelp] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [txStatus, setTxStatus] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [txHash, setTxHash] = React.useState("");

  const [assetInfo] = React.useState(JSON.parse(JSON.stringify(window.sentPacket)));

  const link = document.createElement("div");

  //window.sentPacket = null;

  const classes = useStyles();

  React.useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (props.ps) {
      // eslint-disable-next-line react/prop-types
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
    if (assetInfo === undefined || assetInfo === null || assetInfo === {}) {
      console.log("No asset found. Rerouting...");
      window.location.href = "/#/user/home";
      window.location.reload();
    }
  
    else if (assetInfo.statusNum && assetInfo.statusNum !== "59") {
      swal({
        title: "Asset not in correct status!",
        text:
          "This asset is not in discardable status, please set asset into discardable status before attempting to discard.",
        icon: "warning",
        button: "Close",
      }).then(() => {
        window.backIndex = assetInfo.dBIndex;
        window.location.href = assetInfo.lastRef;
      });
    }
  }, []);

  const goBack = () => {
    window.backIndex = assetInfo.dBIndex;
    window.location.href = assetInfo.lastRef;
  };

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return (window.location.href = "/#/user/home");
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  };

  const discardAsset = async () => {
    //export held asset

    // eslint-disable-next-line react/prop-types
    const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    await window.contracts.A_TKN.methods
      .discard(assetInfo.id)
      // eslint-disable-next-line react/prop-types
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransactionActive(false);
        setTxStatus(false);
        setTxHash(Object.values(_error)[0].transactionHash);
        tempTxHash = Object.values(_error)[0].transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
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
        tempTxHash = receipt.transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        setTxHash(receipt.transactionHash);
        swal({
          title: "Discard Successful!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(() => {
          //refreshBalances()
          //window.backIndex = assetInfo.dBIndex;
          window.location.href = assetInfo.lastRef;
          window.replaceAssetData = {
            key: pageKey,
            dBIndex: assetInfo.dBIndex,
          };
          //window.location.reload()
        });
      });
  };

  if(!props.prufClient){
    return <>
      <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              
            </CardIcon>
            <Button
              color="info"
              className="MLBGradient"
              onClick={() => goBack()}
            >
              Go Back
            </Button>
            
          </CardHeader>
          <CardBody>
            <h2>Oops, something went wrong...</h2>
          </CardBody>
          <br />
        </Card>
    </>
  }

  return (
    <Card>
      <CardHeader icon>
        <CardIcon className="headerIconBack">
          <DeleteOutline />
        </CardIcon>
        <Button color="info" className="MLBGradient" onClick={() => goBack()}>
          Go Back
        </Button>
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
              <Button
                color="info"
                className="MLBGradient"
                onClick={() => discardAsset()}
              >
                Discard Asset
              </Button>
            </div>
          )}
          {transactionActive && (
            <>
              <h4>Asset Selected: {assetInfo.name}</h4>
              <h3>
                Discarding Asset
                <div className="lds-ellipsisIF">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </h3>
            </>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
