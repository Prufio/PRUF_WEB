import React from "react";
import "../../assets/css/custom.css";
import QrReader from 'react-qr-reader'
import swal from 'sweetalert';
import { isMobile } from "react-device-detect";
// import SweetAlert from "react-bootstrap-sweetalert";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Contacts from "@material-ui/icons/Contacts";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import Category from "@material-ui/icons/Category";
import AccountBox from "@material-ui/icons/AccountBox";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardText from "components/Card/CardText.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

export default function Verify(props) {
    const [checked, setChecked] = React.useState([24, 22]);
    const [selectedEnabled, setSelectedEnabled] = React.useState("b");
    const [selectedValue, setSelectedValue] = React.useState(null);
    const [scanQR, setScanQR] = React.useState(false)
    const [result, setResult] = React.useState("");
    const [error, setError] = React.useState("");
    const [transaction, setTransaction] = React.useState(false);
    const [QRValue, setQRValue] = React.useState("");
    const [IDXRawInput, setIDXRawInput] = React.useState(false);

    const [manufacturer, setManufacturer] = React.useState("");
    const [type, setType] = React.useState("");
    const [model, setModel] = React.useState("");
    const [serial, setSerial] = React.useState("");
    const [IDXRaw, setIDXRaw] = React.useState("");

    const [loginManufacturer, setloginManufacturer] = React.useState("");
    const [loginType, setloginType] = React.useState("");
    const [loginModel, setloginModel] = React.useState("");
    const [loginSerial, setloginSerial] = React.useState("");
    const [loginIDX, setloginIDX] = React.useState("");

    const [loginManufacturerState, setloginManufacturerState] = React.useState("");
    const [loginTypeState, setloginTypeState] = React.useState("");
    const [loginModelState, setloginModelState] = React.useState("");
    const [loginSerialState, setloginSerialState] = React.useState("");
    const [loginIDXState, setloginIDXState] = React.useState("");

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

    const [txHash, setTxHash] = React.useState("");
    const [verifyResult, setVerifyResult] = React.useState("");

    const [assetInfo, ] = React.useState(window.sentPacket)

    const link = document.createElement('div');

    React.useEffect(() => {
      if (props.ps) {
        props.ps.element.scrollTop = 0;
        console.log("Scrolled to ", props.ps.element.scrollTop)
      }
    }, [])

    const handleChange = event => {
        setSelectedValue(event.target.value);
    };

    const handleChangeEnabled = event => {
        setSelectedEnabled(event.target.value);
    };

    const handleToggle = value => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const handleScanQR = event => {
        setScanQR(!scanQR);
        setQRValue("")
        console.log("new value", !scanQR)
    };

    const clearForms = () => {
        setManufacturer("");
        setType("");
        setModel("");
        setSerial("");
        setIDXRaw("");
        setFirst("");
        setMiddle("");
        setLast("");
        setID("");
        setPassword("");

        setloginManufacturerState("");
        setloginTypeState("");
        setloginModelState("");
        setloginSerialState("");
        setloginIDXState("");
        setloginFirstState("");
        setloginLastState("");
        setloginIDState("");
        setloginPasswordState("");

        setIDXRaw("");
        setIDXRawInput(false);
        setScanQR(false);
        setQRValue("");
        console.log("clearing forms")
    };

    const verifyAsset = async () => {
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
    
        console.log("in vr")
        let ipfsHash;
        let tempResult;
        let idxHash = assetInfo.idxHash;
        let rgtHashRaw;
        let rgtHash
    
        if (middle === "") {
          rgtHashRaw = window.web3.utils.soliditySha3(
            String(first).replace(/\s/g, ''),
            String(last).replace(/\s/g, ''),
            String(ID).replace(/\s/g, ''),
            String(password).replace(/\s/g, ''),
          )
        }
    
    
        else if (middle !== "") {
          rgtHashRaw = window.web3.utils.soliditySha3(
            String(first).replace(/\s/g, ''),
            String(middle).replace(/\s/g, ''),
            String(last).replace(/\s/g, ''),
            String(ID).replace(/\s/g, ''),
            String(password).replace(/\s/g, ''),
          )
        }
    
    
        rgtHash = window.web3.utils.soliditySha3(String(idxHash), String(rgtHashRaw));
        rgtHash = window.utils.tenThousandHashesOf(rgtHash);
    
        console.log("idxHash", idxHash);
        console.log("rgtHash", rgtHash);
        console.log("addr: ", window.addr);
        setTransaction(true)
        await window.contracts.STOR.methods
          ._verifyRightsHolder(idxHash, rgtHash)
          .call(
            function (_error, _result) {
              if (_error) {
                console.log(_error)
                setError(_error);
                setResult("");
                setTransaction(false)
              }
              else if (_result === "0") {
                console.log("Verification not Confirmed");
                swal({
                  title: "Match Failed!",
                  text: "Please make sure forms are filled out correctly.",
                  icon: "warning",
                  button: "Close",
                });
                setTransaction(false)
              }
              else {
                console.log("Verification Confirmed");
                swal({
                  title: "Match Confirmed!",
                  // text: "Check your TX here:" + txHash,
                  icon: "success",
                  button: "Close",
                });
                setError("");
                setTransaction(false)
              }
            });
        return clearForms();
      }

      const blockchainVerifyAsset = async () => {
        if (!window.ethereum) { return swal({ title: "Connect to an ethereum provider to use this functionality!", button: "Close", }) }
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
    
        console.log("in bvr")
        let idxHash = assetInfo.idxHash;
        let rgtHash;
        let rgtHashRaw;
        let receiptVal;
        let tempTxHash;
    
        if (middle === "") {
          rgtHashRaw = window.web3.utils.soliditySha3(
            String(first).replace(/\s/g, ''),
            String(last).replace(/\s/g, ''),
            String(ID).replace(/\s/g, ''),
            String(password).replace(/\s/g, ''),
          )
        }
    
    
        else if (middle !== "") {
          rgtHashRaw = window.web3.utils.soliditySha3(
            String(first).replace(/\s/g, ''),
            String(middle).replace(/\s/g, ''),
            String(last).replace(/\s/g, ''),
            String(ID).replace(/\s/g, ''),
            String(password).replace(/\s/g, ''),
          )
        }
    
    
        rgtHash = window.web3.utils.soliditySha3(String(idxHash), String(rgtHashRaw));
        rgtHash = window.utils.tenThousandHashesOf(rgtHash);
    
        console.log("idxHash", idxHash);
        console.log("rgtHash", rgtHash);
        console.log("addr: ", props.addr);
        setTransaction(true)
    
        await window.contracts.STOR.methods
          .blockchainVerifyRightsHolder(idxHash, rgtHash)
          .send({ from: props.addr })
          .on("error", function (_error) {
            setTransaction(false);
            tempTxHash = Object.values(_error)[0].transactionHash;
            let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
            let str2 = "' target='_blank'>here</a>"
            link.innerHTML = String(str1 + tempTxHash + str2)
            setTxHash(Object.values(_error)[0].transactionHash);
            console.log(Object.values(_error)[0].transactionHash);
            console.log(_error)
            setError(_error);
          })
          .on("receipt", (receipt) => {
            receiptVal = receipt.events.REPORT.returnValues._msg;
            setTransaction(false)
            setTxHash(receipt.transactionHash)
            tempTxHash = receipt.transactionHash
            let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
            let str2 = "' target='_blank'>here</a>"
            link.innerHTML = String(str1 + tempTxHash + str2)
            setVerifyResult(receiptVal)
            console.log("Verification Result :", receiptVal);
            window.location.href="/#/user/dashboard"
          });
    
    
        if (receiptVal === "Match confirmed") {
          swal({
            title: "Match Confirmed!",
            content: link,
            icon: "success",
            button: "Close",
          });
          console.log("Verification conf")
        }
    
        if (receiptVal !== "Match confirmed") {
          if (tempTxHash !== undefined) {
            swal({
              title: "Match Failed!",
              content: link,
              icon: "warning",
              button: "Close",
            });
          }
          if (tempTxHash === undefined) {
            swal({
              title: "Something Went Wrong!",
              icon: "warning",
              button: "Close",
            });
          }
          console.log("Verification not conf")
        }
    
        return clearForms();
      }

    const classes = useStyles();

    return (
        <Card>
            <CardHeader color="info" icon>
                <CardIcon color="info" className="DBGradient">
                    <AccountBox />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Owner Information</h4>
            </CardHeader>
            <CardBody>
                <form>
                    <>
                        {!transaction && (
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
                        {transaction && (
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
                    {!transaction && (
                        <Button color="info" className="MLBGradient" onClick={(e) => blockchainVerifyAsset()}>Blockchain Verify Owner</Button>
                    )}
                    {!transaction && (
                        <Button color="info" className="MLBGradient" onClick={() => verifyAsset()}>Verify Owner</Button>
                    )}
                    {transaction && (
                        <h3>
                            Verifying Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                        </h3>
                    )}
                </form>
            </CardBody>
        </Card>
    );
}
