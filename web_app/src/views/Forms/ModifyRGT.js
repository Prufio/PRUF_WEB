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
import { GroupAdd } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function ModifyRGT() {
  const [transactionActive, setTransactionActive] = React.useState(false);

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");

  const [first, setFirst] = React.useState("");
  const [middle, setMiddle] = React.useState("");
  const [last, setLast] = React.useState("");
  const [ID, setID] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loginFirst, setloginFirst] = React.useState("");
  const [loginLast, setloginLast] = React.useState("");
  const [loginID, setloginID] = React.useState("");
  const [loginPassword, setloginPassword] = React.useState("");

  const [loginFirstState, setloginFirstState] = React.useState("");
  const [loginLastState, setloginLastState] = React.useState("");
  const [loginIDState, setloginIDState] = React.useState("");
  const [loginPasswordState, setloginPasswordState] = React.useState("");

  const [assetInfo, setAssetInfo] = React.useState(window.sentPacket)

  const link = document.createElement('div')

  window.sentPacket = null

  const classes = useStyles();

  if (assetInfo === undefined || assetInfo === null) {
    return window.location.href = "/#/admin/home"
  }

  if (assetInfo.statusNum === "53" || assetInfo.statusNum === "54") {
    swal({
      title: "Asset not in correct status!",
      text: "This asset is not in a lost or stolen status, please set asset into a non lost or stolen status before attempting to modify.",
      icon: "warning",
      button: "Close",
    });
    return window.location.href = "/#/admin/dashboard"
  }

  const modifyRGT = async (props) => { //import held asset

    if (loginFirst === "" || loginLast === "" || loginID === "" || loginPassword === "") {
      if (loginFirst === "") {
        setloginFirstState("error");
      }
      if (loginLast === "") {
        setloginLastState("error");
      }
      if (loginID === "") {
        setloginIDState("error");
      }
      if (loginPassword === "") {
        setloginPasswordState("error");
      }
      return;
    }

    var rgtHashRaw;

    rgtHashRaw = window.web3.utils.soliditySha3(
      String(first).replace(/\s/g, ''),
      String(middle).replace(/\s/g, ''),
      String(last).replace(/\s/g, ''),
      String(ID).replace(/\s/g, ''),
      String(password).replace(/\s/g, ''),
    )

    var rgtHash = window.web3.utils.soliditySha3(assetInfo.idxHash, rgtHashRaw);

    rgtHash = window.utils.tenThousandHashesOf(rgtHash);

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    await window.contracts.NP_NC.methods
      ._changeRgt(
        assetInfo.idxHash,
        rgtHash,
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
          title: "Owner Change Failed!",
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
          title: "Owner Change Successful!",
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
          <GroupAdd />
        </CardIcon>
        <h4 className={classes.cardIconTitle}>Change Owner Information</h4>
      </CardHeader>
      <CardBody>
        <form>
          <h4>Asset Selected: {assetInfo.name}</h4>
          <>
            {!transactionActive && (
              <>
                <CustomInput
                  success={loginFirstState === "success"}
                  error={loginFirstState === "error"}
                  labelText="First Name *"
                  id="firstName"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => {
                      setFirst(event.target.value.trim())
                      if (event.target.value !== "") {
                        setloginFirstState("success");
                      } else {
                        setloginFirstState("error");
                      }
                      setloginFirst(event.target.value);
                    },
                  }}
                />
                <CustomInput
                  labelText="Middle Name"
                  id="middleName"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => {
                      setMiddle(event.target.value.trim())
                    },
                  }}
                />
                <CustomInput
                  success={loginLastState === "success"}
                  error={loginLastState === "error"}
                  labelText="Last Name *"
                  id="lastName"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => {
                      setLast(event.target.value.trim())
                      if (event.target.value !== "") {
                        setloginLastState("success");
                      } else {
                        setloginLastState("error");
                      }
                      setloginLast(event.target.value);
                    },
                  }}
                />
                <CustomInput
                  success={loginIDState === "success"}
                  error={loginIDState === "error"}
                  labelText="ID Number *"
                  id="idNumber"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => {
                      setID(event.target.value.trim())
                      if (event.target.value !== "") {
                        setloginIDState("success");
                      } else {
                        setloginIDState("error");
                      }
                      setloginID(event.target.value);
                    },
                  }}
                />
                <CustomInput
                  success={loginPasswordState === "success"}
                  error={loginPasswordState === "error"}
                  labelText="Password *"
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "password",
                    onChange: event => {
                      setPassword(event.target.value.trim())
                      if (event.target.value !== "") {
                        setloginPasswordState("success");
                      } else {
                        setloginPasswordState("error");
                      }
                      setloginPassword(event.target.value);
                    },
                  }}
                />
                <div className={classes.formCategory}>
                  <small>*</small> Required fields
                    </div>
              </>
            )}
            {transactionActive && (
              <>
                <CustomInput
                  labelText={first}
                  id="first"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={middle}
                  id="middle"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={last}
                  id="last"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={ID}
                  id="ID"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={password}
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "password",
                    disabled: true
                  }}
                />
              </>
            )}
          </>
          {!transactionActive && (
            <div className="MLBGradientSubmit">
              <Button color="info" className="MLBGradient" onClick={() => modifyRGT()}>Submit New Owner Information</Button>
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
