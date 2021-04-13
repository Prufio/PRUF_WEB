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

  //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

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
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    }
    else {
      window.scrollTo({top: 0, behavior: 'smooth'})
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      
    }
  }, [])

  if (assetInfo === undefined || assetInfo === null) {
    console.log("No asset found. Rerouting...")
    window.location.href = "/#/user/home"
    window.location.reload()
  }

  if (assetInfo.statusNum === "50" || assetInfo.statusNum === "56" || assetInfo.statusNum === "70") {
    swal({
      title: "Asset not in correct status!",
      text: "This asset is not in a modifiable status, please set asset into a non-escrow status before attempting to modify.",
      icon: "warning",
      button: "Close",
    });
    window.backIndex = assetInfo.dBIndex;
    window.location.href = assetInfo.lastRef;
  }


  const handleSimple = event => {
    let status = "";
    let statusName = "";
    let e = event.target.value

    switch (e) {
      case "transferable": {
        status = Number(51);
        statusName = "Transferable";
        break
      }
      case "nontransferable": {
        status = Number(52);
        statusName = "Non-Transferable";
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

    return (setStatus(status), setStatusName(statusName));
  };

  const modifyStatus = async () => {

    if (status === 53 || status === 54) {
      return modifyStatusLS()
    }

    const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    let newAsset = await JSON.parse(JSON.stringify(assetInfo));
    window.utils.getStatusString(String(status)).then((e)=>{
      newAsset.status = e;
    newAsset.statusNum = String(status)

    console.log("Got past the json stuff")
    console.log(assetInfo.idxHash)

    window.contracts.NP_NC.methods
      ._modStatus(
        assetInfo.idxHash,
        String(status)
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
          title: "Status Modification Successful!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(()=>{
          //refreshBalances()
          window.newStat = {num:String(status), str:e}
          window.location.href = assetInfo.lastRef;
          window.backIndex = assetInfo.dBIndex
          window.replaceAssetData = {key: pageKey, dBIndex: assetInfo.dBIndex, newAsset: newAsset}
        })
      });
    })

  }

  const goBack = () => {
    window.backIndex = assetInfo.dBIndex
    window.location.href = assetInfo.lastRef;
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

  const thousandHashesOf = (varToHash) => {
    if(!window.web3) return window.location.href = "/#/user/home"
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  }

  const modifyStatusLS = async () => { //export held asset
    const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    let newAsset = await JSON.parse(JSON.stringify(assetInfo));
    window.utils.getStatusString(String(status)).then((e)=>{
    newAsset.status = e;
    newAsset.statusNum = status

    window.contracts.NP_NC.methods
      ._setLostOrStolen(
        assetInfo.idxHash,
        String(status)
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
          title: "Status Modification Successful!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(()=>{
          //refreshBalances()
          window.newStat = {num:String(status), str:e}
          window.backIndex = assetInfo.dBIndex;
          window.location.href = assetInfo.lastRef;
          window.replaceAssetData = {key: pageKey, dBIndex: assetInfo.dBIndex, newAsset: newAsset}
        })
      });
    })
  }

  return (
    <Card>
      <CardHeader icon>
        <CardIcon className="headerIconBack">
          <ScatterPlot />
        </CardIcon>
      <Button color="info" className="MLBGradient" onClick={() => goBack()}>Go Back</Button>
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
                  Setting to status: "{statusName}"
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
                {assetInfo.statusNum !== "51" && (
                  <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="transferable"
                >
                  Set Transferable
                          </MenuItem>
                )}
                {assetInfo.statusNum === "51" && (
                  <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="transferable"
                >
                  Set Transferable
                          </MenuItem>
                )}
                {assetInfo.statusNum !== "52" && (
                <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="nontransferable"
                >
                  Set Non-Transferable
                          </MenuItem>
                )}
                {assetInfo.statusNum === "52" && (
                <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="nontransferable"
                >
                  Set Non-Transferable
                          </MenuItem>
                )}
                {assetInfo.statusNum !== "53" && (
                  <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="stolen"
                >
                  Report Stolen
                          </MenuItem>
                )}
                {assetInfo.statusNum === "53" && (
                  <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="stolen"
                >
                  Report Stolen
                          </MenuItem>
                )}
                {assetInfo.statusNum !== "54" && (
                  <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="lost"
                >
                  Report Lost
                          </MenuItem>
                )}
                {assetInfo.statusNum === "54" && (
                  <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="lost"
                >
                  Report Lost
                          </MenuItem>
                )}
                {assetInfo.statusNum !== "59" && (
                  <MenuItem
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="discardable"
                >
                  Set Discardable
                  </MenuItem>
                )} 
                {assetInfo.statusNum === "59" && (
                  <MenuItem
                  disabled
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value="discardable"
                >
                  Set Discardable
                  </MenuItem>
                )} 
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
            <>
            {assetInfo.opCost > 0
            ?<h4 className="costsText">Cost: ü{assetInfo.opCost}</h4>
            :<></>
            }
            <div className="MLBGradientSubmit">
              <Button color="info" className="MLBGradient" onClick={() => modifyStatus()}>Modify Status</Button>
            </div>
            </>
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
