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

  //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

  const [address, setAddress] = React.useState("");
  const [loginAddress, setloginAddress] = React.useState("");
  const [loginAddressState, setloginAddressState] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");

  const [assetInfo, ] = React.useState(window.sentPacket);

  const link = document.createElement('div');

  window.sentPacket = null;

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop);
    }
    else {
      window.scrollTo({top: 0, behavior: 'smooth'})
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }, [])

  const clearForms = () => {
    setAddress("");
    setloginAddressState("");
    console.log("clearing forms");
  };

  const classes = useStyles();

  if (assetInfo === undefined || assetInfo === null) {
    console.log("No asset found. Rerouting...");
    window.location.href = "/#/user/home";
    window.location.reload()
  }

  if (assetInfo.statusNum !== "51") {
    swal({
      title: "Asset not in correct status!",
      text: "This asset is not in a transferable status, please set asset into transferable status before attempting to transfer.",
      icon: "warning",
      button: "Close",
    }).then(()=>{goBack()});
    if (assetInfo === undefined || assetInfo === null) {
      console.log("No asset found. Rerouting...")
      window.location.href = "/#/user/home"
      window.location.reload()
    }
  }

  const goBack = () => {
    window.backIndex = assetInfo.dBIndex;
    window.location.href=assetInfo.lastRef;
  }

  const thousandHashesOf = (varToHash) => {
    if(!window.web3) return window.location.href = "/#/user/home"
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  }

  const refreshBalances = async () => {
    if(!window.web3.eth) return

    let pruf, ether;
    
    console.log("Refreshing ether bal")
    await window.web3.eth.getBalance(props.addr, (err, result) => {
      if (err) { console.log(err) } 
      else { ether = window.web3.utils.fromWei(result, 'ether') }
      window.contracts.UTIL_TKN.methods.balanceOf(props.addr).call((err, result) => {
        if (err) { console.log(err) }
        else { pruf = window.web3.utils.fromWei(result, 'ether') }
        window.contracts.A_TKN.methods.balanceOf(props.addr).call((err, result) => {
          if (err) { console.log(err) }
          else { window.replaceAssetData = {assets: result, ether, pruf} }
        });
      });
    });
  }

  const transferAsset = async () => { //transfer held asset
    const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)

    if(!window.web3.utils.isAddress(address)) {
      return swal({
        title: "Submitted address is not valid!",
        text: "Please check form and input a valid ethereum address.",
        icon: "warning",
        button: "Close",
      });   
    }

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
        clearForms();
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
          title: "Transfer Successful!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(()=>{
          //refreshBalances()
          //window.backIndex = assetInfo.dBIndex;
          window.location.href = assetInfo.lastRef;
          window.replaceAssetData = {key: pageKey, dBIndex: assetInfo.dBIndex}
        })
      });

  }

  return (
    <Card>
      <CardHeader icon>
        <CardIcon className="headerIconBack">
          <SwapHoriz />
        </CardIcon>
        <Button color="info" className="MLBGradient" onClick={() => goBack()}>Go Back</Button>
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
