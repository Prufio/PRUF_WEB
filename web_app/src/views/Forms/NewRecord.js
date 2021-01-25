import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// @material-ui/icons
import Category from "@material-ui/icons/Category";
import AccountBox from "@material-ui/icons/AccountBox";
// import Description from "@material-ui/icons/Description";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import Add from "@material-ui/icons/Add";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Contacts from "@material-ui/icons/Contacts";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";

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
import { Description } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function NewRecord() {

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [assetClass, setAssetClass] = React.useState("");
  const [nameTag, setNameTag] = React.useState("");
  const [submittedIdxHash, setSubmittedIdxHash] = React.useState("")

  const [assetName, setAssetName] = React.useState("");
  const [manufacturer, setManufacturer] = React.useState("");
  const [type, setType] = React.useState("");
  const [model, setModel] = React.useState("");
  const [serial, setSerial] = React.useState("");


  // const [descriptionName, setDescriptionName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [loginManufacturer, setloginManufacturer] = React.useState("");
  const [loginType, setloginType] = React.useState("");
  const [loginModel, setloginModel] = React.useState("");
  const [loginSerial, setloginSerial] = React.useState("");

  // const [loginDescriptionName, setloginDescriptionName] = React.useState("");
  // const [loginDescription, setloginDescription] = React.useState("");

  const [loginManufacturerState, setloginManufacturerState] = React.useState("");
  const [loginTypeState, setloginTypeState] = React.useState("");
  const [loginModelState, setloginModelState] = React.useState("");
  const [loginSerialState, setloginSerialState] = React.useState("");

  const [loginDescriptionNameState, setloginDescriptionNameState] = React.useState("");
  const [loginDescriptionState, setloginDescriptionState] = React.useState("");

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


  const ACLogin = event => {
    setAssetClass(event.target.value);
  };

  const clearForms = () => {
    setManufacturer("");
    setType("");
    setModel("");
    setSerial("");
    setFirst("");
    setMiddle("");
    setLast("");
    setID("");
    setPassword("");

    setloginManufacturerState("");
    setloginTypeState("");
    setloginModelState("");
    setloginSerialState("");
    setloginFirstState("");
    setloginLastState("");
    setloginIDState("");
    setloginPasswordState("");

    setAssetClass("");
    console.log("clearing forms")
  };

  const checkAsset = async (idxHash) => {

    let ipfsObj;
    setShowHelp(false);

    if (nameTag !== "") {
      ipfsObj = { photo: {}, text: {}, name: String(this.state.nameTag) }
    }

    else {
      ipfsObj = { photo: {}, text: {}, name: "" }
    }

    if (description !== "") {
      ipfsObj.text.description = description;
    }

    let doesExist = await window.utils.checkAssetExistsBare(idxHash);

    if (doesExist) {
      return
    }

    else {
      setSubmittedIdxHash(idxHash)
      return await window.utils.addIPFSJSONObject(ipfsObj).then(() => { _newRecord() })
    }
  }

  const _newRecord = async () => { //create a new asset record

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
      // if (loginDescription === "" && loginDescriptionName !== "") {
      //   setloginDescriptionState("error");
      //   return;
      // }
      // if (loginDescriptionName === "" && loginDescription !== "") {
      //   setloginDescriptionNameState("error");
      //   return;
      // }
      return;
    }

    var ipfsHash = window.utils.getBytes32FromIPFSHash(String(window.rawIPFSHashTemp));
    var rgtHashRaw, idxHash;

    idxHash = window.web3.utils.soliditySha3(
      String(type).replace(/\s/g, ''),
      String(manufacturer).replace(/\s/g, ''),
      String(model).replace(/\s/g, ''),
      String(serial).replace(/\s/g, ''),
    )

    rgtHashRaw = window.web3.utils.soliditySha3(
      String(first).replace(/\s/g, ''),
      String(middle).replace(/\s/g, ''),
      String(last).replace(/\s/g, ''),
      String(ID).replace(/\s/g, ''),
      String(password).replace(/\s/g, ''),
    )

    //let checkedIn = checkAsset(idxHash);

    //if (!checkedIn) { return }

    var rgtHash = window.web3.utils.soliditySha3(idxHash, rgtHashRaw);

    rgtHash = window.utils.tenThousandHashesOf(rgtHash)

    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);
    //setResult("");
    setTransactionActive(true);
    console.log("idxHash", idxHash);
    console.log("New rgtRaw", rgtHashRaw);
    console.log("New rgtHash", rgtHash);
    console.log("addr: ", window.addr);
    console.log("AC: ", assetClass);
    console.log("IPFS bs58: ", window.rawIPFSHashTemp);
    console.log("IPFS bytes32: ", ipfsHash);

    await window.contracts.APP_NC.methods
      .$newRecordWithDescription(
        idxHash,
        rgtHash,
        assetClass,
        "1000000",
        ipfsHash
      )
      .send({ from: window.addr })
      .on("error", function (_error) {
        setTransactionActive(false);
        setTxStatus(false);
        setTxHash(Object.values(_error)[0].transactionHash);
        setError(Object.values(_error)[0]);
        setAssetClass("")
        clearForms();
      })
      .on("receipt", (receipt) => {
        setTransactionActive(false);
        setTxStatus(receipt.status);
        setTxHash(receipt.transactionHash);
        window.resetInfo = true;
        window.recount = true;
      });

    setAssetClass("");
  }

  const classes = useStyles();
  return (
    <GridContainer>
      {assetClass === "" && (
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info" className="DBGradient">
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
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info" className="DBGradient">
                  <Category />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Asset Information</h4>
              </CardHeader>
              <CardBody>
                <form>
                  <h4>AC Selected: {assetClass} </h4>
                  {!transactionActive && (
                    <>
                      <CustomInput
                        labelText="Asset Name"
                        id="assetName"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            setAssetName(event.target.value.trim())
                          },
                        }}
                      />
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
                  {transactionActive && (
                    <>
                      {assetName !== "" && (
                        <CustomInput
                          labelText={assetName}
                          id="assetName"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            disabled: true
                          }}
                        />
                      )}
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
                </form>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
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
                    <Button color="info" className="MLBGradient" onClick={() => checkAsset()}>Create New Record</Button>
                  )}
                  {transactionActive && (
                    <h3>
                      Creating Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                    </h3>
                  )}
                </form>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info" className="DBGradient">
                  <Description />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Asset Description</h4>
                <h4 className={classes.cardIconTitle}>(optional)</h4>
              </CardHeader>
              <CardBody>
                <form>

                  {/* <CustomInput
                    success={loginDescriptionNameState === "success"}
                    error={loginDescriptionNameState === "error"}
                    labelText="Description Name"
                    id="descriptionName"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        setDescriptionName(event.target.value.trim())
                        if (event.target.value !== "") {
                          setloginDescriptionNameState("success");
                        } else {
                          setloginDescriptionNameState("error");
                        }
                        setloginDescriptionName(event.target.value);
                      },
                    }}
                  /> */}
                  {!transactionActive && (
                    <CustomInput
                    labelText="Description"
                    id="description"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      onChange: event => {
                        setDescription(event.target.value.trim())
                      },
                    }}
                  />
                  )}
                  {/* <br /> */}
                  {/* <Add /> */}
                  {transactionActive && description !== "" && (
                    <CustomInput
                      labelText={description}
                      id="first"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: true
                      }}
                    />
                  )}
                </form>
              </CardBody>
            </Card>
          </GridItem>
          {/* <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="info" icon>
                <CardIcon color="info" className="DBGradient">
                  <AddPhotoAlternate />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Upload Asset Image(s)</h4>
                <h4 className={classes.cardIconTitle}>(optional)</h4>
              </CardHeader>
              <CardBody>
                <form>
                  <CustomInput
                    labelText="Image Title"
                    id="manufacturer"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                  <CustomInput
                    labelText="Input Image URL"
                    id="manufacturer"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </form>
              </CardBody>
            </Card>
          </GridItem> */}
        </>
      )}
    </GridContainer>
  );
}
