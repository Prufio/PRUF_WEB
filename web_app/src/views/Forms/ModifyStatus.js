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

// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { ScatterPlot } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function ModifyStatus(props) {
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");

  const [status, setStatus] = React.useState("");
  const [statusName, setStatusName] = React.useState("");

  const [assetInfo, ] = React.useState(window.sentPacket)

  const link = document.createElement('div')

  window.sentPacket = null

  const classes = useStyles();

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      console.log("Scrolled to ", props.ps.element.scrollTop)
    }
  }, [])

  if (assetInfo === undefined || assetInfo === null) {
    console.log("No asset found. Rerouting...")
    return window.location.href = "/#/admin/home"
  }

  if (assetInfo.statusNum === "50" || assetInfo.statusNum === "56") {
    swal({
      title: "Asset not in correct status!",
      text: "This asset is not in a modifyable status, please set asset into a non-escrow status before attempting to modify.",
      icon: "warning",
      button: "Close",
    });
    return window.location.href = "/#/admin/dashboard"
  }


  const handleSimple = event => {
    let status;
    let statusName;
    let e = event.target.value

    switch (e) {
      case "transferrable": {
        status = Number(51);
        statusName = "Transferrable";
        break
      }
      case "nontransferrable": {
        status = Number(52);
        statusName = "Non-Transferrable";
        break
      }
      case "stolen": {
        status = Number(53);
        statusName = "Stolen";
        break
      }
      case "lost": {
        status = Number(54);
        statusName = "Lost";
        break
      }
      case "discardable": {
        status = Number(59);
        statusName = "Discardable";
        break
      }
      default: {
        console.log("Invalid status selection: '", e, "'");
        break
      }
    }

    return setStatus(status), setStatusName(statusName);
  };

  const modifyStatus = async () => { //export held asset

    if (status === 53 || status === 54) {
      return modifyStatusLS()
    }

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    await window.contracts.NP_NC.methods
      ._modStatus(
        assetInfo.idxHash,
        status
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
          title: "Status Modification Failed!",
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
          title: "Status Modification Successful!",
          content: link,
          icon: "success",
          button: "Close",
        });
        window.resetInfo = true;
        window.recount = true;
        window.location.href = "/#/admin/dashboard"
      });

  }

  const modifyStatusLS = async () => { //export held asset

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    await window.contracts.NP_NC.methods
      ._setLostOrStolen(
        assetInfo.idxHash,
        status
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
          title: "Status Modification Failed!",
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
          title: "Status Modification Successful!",
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
          <ScatterPlot />
        </CardIcon>
        <h4 className={classes.cardIconTitle}>Modify Status</h4>
      </CardHeader>
      <CardBody>
        <form>
          <h4>Asset Selected: {assetInfo.name}</h4>
          <h4>Current Status: {assetInfo.status}</h4>
          {!transactionActive && (
            <FormControl
              fullWidth
              className={classes.selectFormControl}
            >
              {status === "" && (
                <InputLabel
                >
                  Please Select Status
                </InputLabel>
              )}
              {status !== "" && (
                <InputLabel
                >
                  {statusName}
                </InputLabel>
              )}
              <Select
                MenuProps={{
                  className: classes.selectMenu
                }}
                classes={{
                  select: classes.select
                }}
                value={simpleSelect}
                onChange={handleSimple}
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
                  Please Select Element
                          </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="transferrable"
                >
                  Transferrable
                          </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="nontransferrable"
                >
                  Non-Transferrable
                          </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="stolen"
                >
                  Stolen
                          </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="lost"
                >
                  Lost
                          </MenuItem>
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="discardable"
                >
                  Discardable
                          </MenuItem>
              </Select>
            </FormControl>
          )}
          {transactionActive && (
            <FormControl
              fullWidth
              className={classes.selectFormControl}
              disabled
            >
              <InputLabel
              >
                {statusName}
              </InputLabel>
            </FormControl>
          )}
          {!transactionActive && status !== "" && (
            <div className="MLBGradientSubmit">
              <Button color="info" className="MLBGradient" onClick={() => modifyStatus()}>Modify Status</Button>
            </div>
          )}
          {!transactionActive && status === "" && (
            <div className="MLBGradientSubmit">
              <Button disabled color="info" className="MLBGradient">Modify Status</Button>
            </div>
          )}
          {transactionActive && (
            <h3>
              Modifying Status<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
            </h3>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
