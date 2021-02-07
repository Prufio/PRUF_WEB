import React from "react";
import "../../assets/css/custom.css";
import QrReader from 'react-qr-reader'
import { isMobile } from "react-device-detect";
import swal from 'sweetalert';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// @material-ui/icons
import Check from "@material-ui/icons/Check";
import Category from "@material-ui/icons/Category";
import AccountBox from "@material-ui/icons/AccountBox";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Checkbox from "@material-ui/core/Checkbox";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { DashboardOutlined, DashboardRounded } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function Recycle(props) {
  const [checked, setChecked] = React.useState([24, 22]);
  const [selectedEnabled, setSelectedEnabled] = React.useState("b");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [scanQR, setScanQR] = React.useState(false)
  const [error, setError] = React.useState("");
  const [QRValue, setQRValue] = React.useState("");
  const [recycling, setRecycling] = React.useState(false);
  const [assetClass, setAssetClass] = React.useState("");

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
    return window.location.href = "/#/user/home"
  }

  if (assetInfo.statusNum !== "60") {
    swal({
      title: "Asset not in correct status!",
      text: "This asset is not in a recyclable status, please set asset into a discarded status before attempting to recycle.",
      icon: "warning",
      button: "Close",
    });
    return window.location.href = "/#/user/dashboard"
  }

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

  const ACLogin = event => {
    setAssetClass(event.target.value);
  };

  const handleScanQR = event => {
    setScanQR(!scanQR);
    console.log("new value", !scanQR)
  };

  const clearForms = event => {
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

  const recycleAsset = async () => {
    if (!IDXRawInput) {
      if (loginType === "" || loginManufacturer === "" || loginModel === "" || loginSerial === "" || loginFirst === "" || loginLast === "" || loginID === "" || loginPassword === "") {

        if (loginType === "") {
          setloginTypeState("error");
        }
        if (loginManufacturer === "") {
          setloginManufacturerState("error");
        }
        if (loginModel === "") {
          setloginModelState("error");
        }
        if (loginSerial === "") {
          setloginSerialState("error");
        }
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
    }

    if (IDXRawInput) {
      if (loginIDXState === "") {
        setloginIDXState("error");
        return;
      }
    }

    console.log("in RA")
    let idxHash;
    let rgtHash;
    let rgtHashRaw;
    let receiptVal;
    let tempTxHash;

    {
      IDXRawInput === true && (
        idxHash = IDXRaw
      )
    }
    {
      QRValue !== "" && (
        idxHash = QRValue
      )
    }

    {
      IDXRawInput === false && QRValue === "" && (
        idxHash = window.web3.utils.soliditySha3(
          String(type).replace(/\s/g, ''),
          String(manufacturer).replace(/\s/g, ''),
          String(model).replace(/\s/g, ''),
          String(serial).replace(/\s/g, ''),
        )
      )
    }
    {
      middle === "" && (
        rgtHashRaw = window.web3.utils.soliditySha3(
          String(first).replace(/\s/g, ''),
          String(last).replace(/\s/g, ''),
          String(ID).replace(/\s/g, ''),
          String(password).replace(/\s/g, ''),
        )
      )
    }
    {
      middle !== "" && (
        rgtHashRaw = window.web3.utils.soliditySha3(
          String(first).replace(/\s/g, ''),
          String(middle).replace(/\s/g, ''),
          String(last).replace(/\s/g, ''),
          String(ID).replace(/\s/g, ''),
          String(password).replace(/\s/g, ''),
        )
      )
    }

    rgtHash = window.web3.utils.soliditySha3(String(idxHash), String(rgtHashRaw));
    rgtHash = window.utils.tenThousandHashesOf(rgtHash);

    console.log("idxHash", idxHash);
    console.log("rgtHash", rgtHash);
    console.log("addr: ", window.addr);
    setRecycling(true)

    await window.contracts.RCLR.methods
      .recycle(idxHash, rgtHash, assetClass)
      .send({ from: window.addr })
      .on("error", function (_error) {
        setRecycling(false);
        tempTxHash = Object.values(_error)[0].transactionHash;
        setTxHash(Object.values(_error)[0].transactionHash);
        console.log(Object.values(_error)[0].transactionHash);
        console.log(_error)
        setError(_error);
        clearForms()
      })
      .on("receipt", (receipt) => {
        receiptVal = receipt.events.REPORT.returnValues._msg;
        setRecycling(false)
        setTxHash(receipt.transactionHash)
        tempTxHash = receipt.transactionHash
        setVerifyResult(receiptVal)
        console.log("verify Result :", receiptVal);
      });


    if (receiptVal === "Match confirmed") {
      swal({
        title: "Match Confirmed!",
        text: "Check out your TX here:" + tempTxHash,
        icon: "success",
        button: "Close",
      });
      console.log("verify conf")
    }

    if (receiptVal !== "Match confirmed") {
      swal({
        title: "Match Failed!",
        text: "Please make sure all forms are filled out correctly. Check out your TX here:" + tempTxHash,
        icon: "warning",
        button: "Close",
      });
      console.log("verify not conf")
    }

    return clearForms()
  }


  return (
    <GridContainer>
      {assetClass === "" && (
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <Category />
            </CardIcon>
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
                  onChange={ACLogin}
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
                    value="100003"
                  >
                    Trinkets
                          </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="100004"
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
        <>
          <GridItem xs={12} sm={12} md={6}>
            {!scanQR && QRValue === "" && (
              <Card>
                <CardHeader icon>
                  <CardIcon className="headerIconBack">
                    <DashboardRounded />
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>Asset Information</h4>
                </CardHeader>
                <CardBody>
                  <form>
                    {IDXRawInput === false && !recycling && (
                      <>
                        <CustomInput
                          success={loginManufacturerState === "success"}
                          error={loginManufacturerState === "error"}
                          labelText="Manufacturer *"
                          id="manufacturer"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => {
                              setManufacturer(event.target.value.trim())
                              if (event.target.value !== "") {
                                setloginManufacturerState("success");
                              } else {
                                setloginManufacturerState("error");
                              }
                              setloginManufacturer(event.target.value);
                            },
                          }}
                        />
                        <CustomInput
                          success={loginTypeState === "success"}
                          error={loginTypeState === "error"}
                          labelText="Type *"
                          id="type"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => {
                              setType(event.target.value.trim())
                              if (event.target.value !== "") {
                                setloginTypeState("success");
                              } else {
                                setloginTypeState("error");
                              }
                              setloginType(event.target.value);
                            },
                          }}
                        />
                        <CustomInput
                          success={loginModelState === "success"}
                          error={loginModelState === "error"}
                          labelText="Model *"
                          id="model"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => {
                              setModel(event.target.value.trim())
                              if (event.target.value !== "") {
                                setloginModelState("success");
                              } else {
                                setloginModelState("error");
                              }
                              setloginModel(event.target.value);
                            },
                          }}
                        />
                        <CustomInput
                          success={loginSerialState === "success"}
                          error={loginSerialState === "error"}
                          labelText="Serial *"
                          id="serial"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => {
                              setSerial(event.target.value.trim())
                              if (event.target.value !== "") {
                                setloginSerialState("success");
                              } else {
                                setloginSerialState("error");
                              }
                              setloginSerial(event.target.value);
                            },
                          }}
                        />
                        <div className={classes.formCategory}>
                          <small>*</small> Required fields
              </div>
                      </>
                    )}
                    {IDXRawInput === false && recycling && (
                      <>
                        <CustomInput
                          labelText={manufacturer}
                          id="manufacturer"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            disabled: true
                          }}
                        />
                        <CustomInput
                          labelText={type}
                          id="type"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            disabled: true
                          }}
                        />
                        <CustomInput
                          labelText={model}
                          id="model"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            disabled: true
                          }}
                        />
                        <CustomInput
                          labelText={serial}
                          id="serial"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            disabled: true
                          }}
                        />
                      </>
                    )}
                    {IDXRawInput === true && (
                      <>
                        <CustomInput
                          id="manufacturer"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            placeholder: "Disabled",
                            disabled: true
                          }}
                        />
                        <CustomInput
                          id="type"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            placeholder: "Disabled",
                            disabled: true
                          }}
                        />
                        <CustomInput
                          id="model"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            placeholder: "Disabled",
                            disabled: true
                          }}
                        />
                        <CustomInput
                          id="serial"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            placeholder: "Disabled",
                            disabled: true
                          }}
                        />
                      </>
                    )}
                    {!recycling && (
                      <div className={classes.checkboxAndRadio}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              tabIndex={-1}
                              onClick={() => setIDXRawInput(!IDXRawInput)}
                              checkedIcon={<Check className={classes.checkedIcon} />}
                              icon={<Check className={classes.uncheckedIcon} />}
                              classes={{
                                checked: classes.checked,
                                root: classes.checkRoot
                              }}
                            />
                          }
                          classes={{
                            label: classes.label,
                            root: classes.labelRoot
                          }}
                          label="Input IDX Hash"
                        />
                      </div>
                    )}
                    {IDXRawInput === true && !recycling && (
                      <>
                        <CustomInput
                          success={loginIDXState === "success"}
                          error={loginIDXState === "error"}
                          labelText="IDX Hash *"
                          id="IDX"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            onChange: event => {
                              setIDXRaw(event.target.value.trim())
                              if (event.target.value !== "") {
                                setloginIDXState("success");
                              } else {
                                setloginIDXState("error");
                              }
                              setloginIDX(event.target.value);
                            },
                          }}
                        />
                        <div className={classes.formCategory}>
                          <small>*</small> Required fields
                  </div>
                      </>
                    )}
                    {IDXRawInput === true && recycling && (
                      <>
                        {!isMobile && (
                          <CustomInput
                            labelText={IDXRaw}
                            id="IDX"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              disabled: true
                            }}
                          />
                        )}

                        {isMobile && (
                          <CustomInput
                            labelText={IDXRaw.substring(0, 12) + "..." + IDXRaw.substring(54, 66)}
                            id="IDX"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              disabled: true
                            }}
                          />
                        )}
                      </>
                    )}
                    {!recycling && (
                      <Button value={scanQR} onClick={(e) => handleScanQR(e)} color="info" className="MLBGradient">Scan QR</Button>
                    )}
                  </form>
                </CardBody>
              </Card>
            )}

            {scanQR === true && QRValue === "" && (
              <Card>
                <CardHeader icon>
                  <CardIcon className="headerIconBack">
                    <DashboardRounded />
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>QR Scanner</h4>
                </CardHeader>
                <CardBody>
                  <QrReader
                    className="qrReader"
                    scanDelay={300}
                    onScan={(result) => {
                      if (result) {
                        // retrieveRecordQR(result);
                        setQRValue(result);
                      }

                    }}
                    onError={(err) => {
                      if (err) {
                        console.info(err);
                      }
                    }}

                    style={{ width: '100%' }}
                  />
                  {recycling && (
                    <h3>
                      Recycling Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                    </h3>
                  )}
                  <Button value={scanQR} onClick={(e) => handleScanQR(e)} color="info" className="MLBGradient">Back</Button>
                </CardBody>
              </Card>
            )}

            {QRValue !== "" && (
              <Card>
                <CardHeader icon>
                  <CardIcon className="headerIconBack">
                    <DashboardOutlined />
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>Asset</h4>
                </CardHeader>
                <CardBody>
                  <CustomInput
                    labelText={"IDX : " + QRValue}
                    id="IDX"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: true
                    }}
                  />
                  <Button onClick={() => setQRValue("")} color="info" className="MLBGradient">Back</Button>
                </CardBody>
              </Card>
            )}
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader icon>
                <CardIcon className="headerIconBack">
                  <AccountBox />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Owner Information</h4>
              </CardHeader>
              <CardBody>
                <form>
                  <>
                    {!recycling && (
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
                          id="ownerpassword"
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
                    {recycling && (
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
                          id="ownerpassword"
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
                  {!recycling && (
                    <div className="MLBGradientSubmit">
                      <Button color="info" className="MLBGradient" onClick={(e) => recycleAsset()}>Recycle Asset</Button>
                    </div>
                  )}
                  {/* <Button color="info" className="MLBGradient" onClick={() => swal({
                title: "Match Confirmed!",
                text: "Check your TX here:" + txHash,
                icon: "success",
                button: "Close",
              })}>alert</Button> */}
                </form>
              </CardBody>
            </Card>
          </GridItem>
        </>
      )}
    </GridContainer>
  );
}
