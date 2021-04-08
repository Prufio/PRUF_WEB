import React from "react";
import "../../../assets/css/custom.css";
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
import { StoreMallDirectory } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function ChangeNodeName(props) {

  //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

  const [transactionActive, setTransactionActive] = React.useState(false);

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");

  const [nodeInfo,] = React.useState(window.sentPacket)

  const [name, setName] = React.useState("");
  const [loginName, setloginName] = React.useState("");
  const [loginNameState, setloginNameState] = React.useState("");

  const link = document.createElement('div')

  window.sentPacket = null

  const classes = useStyles();

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
    }
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
    if (nodeInfo === undefined || nodeInfo === null) {
      console.log("No asset found. Rerouting...")
      window.location.href = "/#/user/home"
      window.location.reload()
    }

  }, [])

  const goBack = () => {
    window.backIndex = nodeInfo.dBIndex;
    window.location.href = nodeInfo.lastRef;
  }

  const changeName = async () => { //import held asset
    let nameExists = await window.utils.checkACName(loginName)

    if (nameExists === false) {

      let tempTxHash;
      setShowHelp(false);
      setTxStatus(false);
      setTxHash("");
      setError(undefined);

      setTransactionActive(true);

      await window.contracts.AC_MGR.methods
        .updateACname(
          nodeInfo.id,
          name,
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
            title: "Name Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          }).then(() => {
            //refreshBalances()
            window.backIndex = nodeInfo.dBIndex;
            window.location.href = nodeInfo.lastRef;
          })
        });


    }

    else if ((loginName === nodeInfo.name) || (loginName === "")) {
      console.log("error2")
      setloginNameState("error");
      swal("Node name has not changed.")
    }
    else if (nameExists === true) {
      swal("Node name is already recorded in the system.")
      return;
    }

  }

  return (
    <Card>
      <CardHeader icon>
        <CardIcon className="headerIconBack">
          <StoreMallDirectory />
        </CardIcon>
        <Button color="info" className="MLBGradient" onClick={() => goBack()}>Go Back</Button>
        <h4 className={classes.cardIconTitle}>Change Node Name</h4>
      </CardHeader>
      <CardBody>
        <form>
          {nodeInfo.name !== "" && (
            <h4>Node Selected: {nodeInfo.name}, ({nodeInfo.id})</h4>
          )}
          <>
            {!transactionActive && (
              <>
                <CustomInput
                  success={loginNameState === "success"}
                  error={loginNameState === "error"}
                  labelText="Node Name *"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    defaultValue: nodeInfo.name,
                    onChange: event => {
                      setName(event.target.value.toUpperCase().trim())
                      if (event.target.value !== "" || event.target.value !== nodeInfo.name) {
                        setloginNameState("success");
                      } else {
                        setloginNameState("error");
                      }
                      setloginName(event.target.value);
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
                  labelText={name}
                  id="name"
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
              <Button color="info" className="MLBGradient" onClick={() => changeName()}>Submit Name</Button>
            </div>
          )}
          {transactionActive && (
            <h3>
              Changing Node Name<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
            </h3>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
