import React from "react";
import "../../assets/css/custom.css";
import swalReact from "@sweetalert/with-react";

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

export default function ModifyRGT(props) {
  if (!window.sentPacket) window.sentPacket = {}

  const [transactionActive, setTransactionActive] = React.useState(false);

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [showHelp, setShowHelp] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [txStatus, setTxStatus] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
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

  const [assetInfo] = React.useState(JSON.parse(JSON.stringify(window.sentPacket)));

  const link = document.createElement("div");

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
    else if (
      assetInfo.statusNum === "50" ||
      assetInfo.statusNum === "56" ||
      assetInfo.statusNum === "70"
    ) {
      swalReact({
        title: "Asset not in correct status!",
        text:
          "This asset is not in a modifiable status, please set asset into a non-escrow status before attempting to modify.",
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

  const modifyRGT = async () => {
    //import held asset

    if (
      loginFirst === "" ||
      loginLast === "" ||
      loginID === "" ||
      loginPassword === ""
    ) {
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

    props.prufClient.utils.generateSecureRgt(
      assetInfo.id,
      {
        first: first,
        middle: middle,
        last: last,
        id: ID,
        password: password
      }
      ).then(e=>{
        let rgtHash = e;
        setTransactionActive(true);
        // console.log(assetInfo.id, rgtHash)
        props.prufClient.do.asset
          .modifyRightsHash(assetInfo.id, rgtHash)
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
              swalReact({
                title: "Something went wrong!",
                content: link,
                icon: "warning",
                button: "Close",
              });
            }
            if (tempTxHash === undefined) {
              swalReact({
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
            swalReact({
              title: "Owner Change Successful!",
              content: link,
              icon: "success",
              button: "Close",
            }).then(() => {
              //refreshBalances()
              window.backIndex = assetInfo.dBIndex;
              window.location.href = assetInfo.lastRef;
            });
          });
      });

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);


  };

  if (!props.prufClient) {
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
          <GroupAdd />
        </CardIcon>
        <Button color="info" className="MLBGradient" onClick={() => goBack()}>
          Go Back
        </Button>
        <h4 className={classes.cardIconTitle}>Change Owner Information</h4>
      </CardHeader>
      <CardBody>
        <form>
          {assetInfo && <h4>Asset Selected: {assetInfo.name}</h4>}
          <>
            {!transactionActive && (
              <>
                <CustomInput
                  success={loginFirstState === "success"}
                  error={loginFirstState === "error"}
                  labelText="First Name *"
                  id="firstName"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      setFirst(event.target.value.trim());
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
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      setMiddle(event.target.value.trim());
                    },
                  }}
                />
                <CustomInput
                  success={loginLastState === "success"}
                  error={loginLastState === "error"}
                  labelText="Last Name *"
                  id="lastName"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      setLast(event.target.value.trim());
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
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      setID(event.target.value.trim());
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
                  id="ownerpassword"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "password",
                    onChange: (event) => {
                      setPassword(event.target.value.trim());
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
                    fullWidth: true,
                  }}
                  inputProps={{
                    disabled: true,
                  }}
                />
                <CustomInput
                  labelText={middle}
                  id="middle"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    disabled: true,
                  }}
                />
                <CustomInput
                  labelText={last}
                  id="last"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    disabled: true,
                  }}
                />
                <CustomInput
                  labelText={ID}
                  id="ID"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    disabled: true,
                  }}
                />
                <CustomInput
                  labelText={password}
                  id="ownerpassword"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "password",
                    disabled: true,
                  }}
                />
              </>
            )}
          </>
          {!transactionActive && (
            <>
              {assetInfo.opCost > 0 ? (
                <h4 className="costsText">Cost: ü{assetInfo.opCost}</h4>
              ) : (
                <></>
              )}
              <div className="MLBGradientSubmit">
                <Button
                  color="info"
                  className="MLBGradient"
                  onClick={() => modifyRGT()}
                >
                  Submit New Owner Information
                </Button>
              </div>
            </>
          )}
          {transactionActive && (
            <h3>
              Changing Owner Information
              <div className="lds-ellipsisIF">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </h3>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
