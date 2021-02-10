import React from "react";
import "../../assets/css/custom.css";
import swal from 'sweetalert';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// @material-ui/icons
import Category from "@material-ui/icons/Category";

// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { FlightLand } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function Import(props) {

  //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

  const [assetClass, setAssetClass] = React.useState("");
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");

  const [assetInfo, ] = React.useState(window.sentPacket)

  const link = document.createElement('div')

  window.sentPacket = null

  const classes = useStyles();

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    }
  }, [])

  if (assetInfo === undefined || assetInfo === null) {
    console.log("No asset found. Rerouting...")
    return window.location.href = "/#/user/home"
  }

  if (assetInfo.statusNum !== "70") {
    swal({
      title: "Asset not in correct status!",
      text: "This asset is not in exported status, please export asset before attempting to import it.",
      icon: "warning",
      button: "Close",
    });
    return window.location.href = "/#/user/dashboard"
  }

  const ACLogin = event => {
    setAssetClass(event.target.value);
  };

  const goBack = () => {
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

  const importAsset = async () => { //import held asset

    const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    await window.contracts.APP_NC.methods
      .$importAsset(
        assetInfo.idxHash,
        assetClass,
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
          title: "Import Successful!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(()=>{
          let newAsset = JSON.parse(JSON.stringify(assetInfo));
          newAsset.status = "Out of Escrow"
          newAsset.statusNum = "58"
          window.location.href = assetInfo.lastRef;
          window.replaceAssetData = {key: pageKey, dBIndex: assetInfo.dBIndex, newAsset: newAsset}
        })
      });

  }

  return (
    <>
      {assetClass === "" && (
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <Category />
            </CardIcon>
            <Button color="info" className="MLBGradient" onClick={() => goBack()}>Go Back</Button>
            <h4 className={classes.cardIconTitle}>Select Asset Class</h4>
          </CardHeader>
          <CardBody>
            <form>
              <FormControl
                fullWidth
                className={classes.selectFormControl}
              >
                <InputLabel
                >
                  Select Asset Class
                      </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={simpleSelect}
                  onChange={(e) => { ACLogin(e) }}
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
                    Select Asset Class
                        </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="1000003"
                  >
                    Trinkets
                        </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="1000004"
                  >
                    Personal Computers
                        </MenuItem>
                </Select>
              </FormControl>
            </form>
          </CardBody>
          <br />
        </Card>
      )}
      {assetClass !== "" && (
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <FlightLand />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Import Asset</h4>
          </CardHeader>
          <CardBody>
            <form>
              {!transactionActive && (
                <>
                  <h4>AssetClass Selected: {assetClass} </h4>
                  <h4>Asset Selected: {assetInfo.name}</h4>
                  <br />
                  <h5>You are attempting to import {assetInfo.name} into asset class {assetClass}.</h5>
                </>
              )}
              {!transactionActive && (
                <div className="MLBGradientSubmit">
                  <Button color="info" className="MLBGradient" onClick={() => importAsset()}>Import Asset</Button>
                </div>
              )}
              {transactionActive && (
                <h3>
                  Importing Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                </h3>
              )}
            </form>
          </CardBody>
        </Card>
      )}
    </>
  );
}
