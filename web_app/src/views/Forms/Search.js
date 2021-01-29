import React from "react";
import "../../assets/css/custom.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Danger from "components/Typography/Danger.js";
import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/icons
import Check from "@material-ui/icons/Check";
import Category from "@material-ui/icons/Category";
import Share from "@material-ui/icons/Share";
import Print from "@material-ui/icons/Print";
import Create from "@material-ui/icons/Create";
import { KeyboardArrowLeft } from "@material-ui/icons";
import { isMobile } from "react-device-detect";


// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Tooltip from "@material-ui/core/Tooltip";

import QrReader from 'react-qr-reader'
import Jdenticon from 'react-jdenticon';

import imgStyles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import placeholder from "../../assets/img/placeholder.jpg";
import TextField from "@material-ui/core/TextField";


const useStyles = makeStyles(styles);
const useImgStyles = makeStyles(imgStyles);

export default function Search(props) {

  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [checked, setChecked] = React.useState([24, 22]);
  const [selectedEnabled, setSelectedEnabled] = React.useState("b");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [scanQR, setScanQR] = React.useState(false)
  const [data, setData] = React.useState("");
  const [result, setResult] = React.useState("");
  const [wasSentQuery, setWasSentQuery] = React.useState(false);
  const [gotQuery, setGotQuery] = React.useState(false);
  const [error, setError] = React.useState("");
  const [inscription, setInscription] = React.useState("");
  const [moreInfo, setMoreInfo] = React.useState(false);
  const [authLevel, setAuthLevel] = React.useState("");
  const [ipfsObject, setIpfsObject] = React.useState({});
  const [asset, setAsset] = React.useState({});
  const [price, setPrice] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  const [recycled, setRecycled] = React.useState(false);
  const [transaction, setTransaction] = React.useState(false);
  const [retrieving, setRetrieving] = React.useState(false);
  const [ownerOf, setOwnerOf] = React.useState(false);

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
  const [selectedImage, setSelectedImage] = React.useState("")

  React.useEffect(() => {
    let refString = String(window.location.href);

    if (!gotQuery && refString.includes("0x") && refString.substring(refString.indexOf('0x'), refString.length).length === 66) {
      setRetrieving(true)
      setWasSentQuery(true)
      setGotQuery(true)
    }

    if (window.contracts !== undefined && wasSentQuery) {
      let query = refString.substring(refString.indexOf('0x'), refString.length)
      setWasSentQuery(false)
      retrieveRecordQR(query)
    }

    else { console.log(false) }
  })





  const handleSimple = event => {
    window.sentPacket = asset
    setSimpleSelect(event.target.value);
    let e = event.target.value, href;

    switch (e) {
      case "transfer": {
        href = "/#/admin/transfer-asset";
        break
      }
      case "escrow": {
        href = "/#/admin/escrow-manager";
        break
      }
      case "import": {
        href = "/#/admin/import-asset";
        break
      }
      case "export": {
        href = "/#/admin/export-asset";
        break
      }
      case "discard": {
        href = "/#/admin/discard-asset";
        break
      }
      case "modify-status": {
        href = "/#/admin/modify-status";
        break
      }
      // case "decrement-counter": {
      //   href = "/#/admin/counter";
      //   break
      // }
      case "edit-information": {
        href = "/#/admin/modify-description";
        break
      }
      case "edit-rightsholder": {
        href = "/#/admin/modify-rightsholder";
        break
      }
      default: {
        console.log("Invalid menu selection: '", e, "'");
        break
      }
    }

    return window.location.href = href;
  };

  const handleChange = event => {
    setSelectedValue(event.target.value);
  };

  const handleChangeEnabled = event => {
    setSelectedEnabled(event.target.value);
  };

  const handleScanQR = event => {
    setScanQR(!scanQR);
    setData()
    console.log("new value", !scanQR)
  };

  const getIPFSJSONObject = (lookup) => {
    //console.log(lookup)
    window.ipfs.cat(lookup, async (error, result) => {
      if (error) {
        console.log(lookup, "Something went wrong. Unable to find file on IPFS");
        return setIpfsObject({})
      } else {
        console.log(lookup, "Here's what we found for asset description: ", result);
        let tempObj = JSON.parse(result)
        setSelectedImage(tempObj.photo.displayImage || Object.values(tempObj.photo)[0] || "")
        setIpfsObject(tempObj)
      }
    });
  };

  const getACData = async (ref, ac) => {
    let tempData;
    let tempAC;

    if (window.contracts !== undefined) {

      if (ref === "name") {
        console.log("Using name ref")
        await window.contracts.AC_MGR.methods
          .resolveAssetClass(ac)
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              if (Number(_result) > 0) { tempAC = Number(_result) }
              else { return 0 }
            }
          });

      }

      else if (ref === "id") { tempAC = ac; }

      await window.contracts.AC_MGR.methods
        .getAC_data(tempAC)
        .call((_error, _result) => {
          if (_error) { console.log("Error: ", _error) }
          else {
            let _custodyType;

            if (Object.values(_result)[1] === "1") {
              _custodyType = "Custodial"
            }

            else {
              _custodyType = "Non-Custodial"
            }

            tempData = {
              root: Object.values(_result)[0],
              custodyType: _custodyType,
              discount: Object.values(_result)[2],
              exData: Object.values(_result)[3],
              AC: tempAC
            }
          }
        });
      return tempData;
    }
  }

  const purchaseAsset = async () => {
    console.log("Purchasing Asset")
    if (window.balances.prufTokenBalance < window.web3.utils.fromWei(price)) { console.log("insufficient balance"); return console.log(window.web3.utils.fromWei(price)) }
    setTransaction(true)
    await window.contracts.PURCHASE.methods
      .purchaseWithPRUF(asset.idxHash)
      .send({ from: props.addr })
      .on("error", function (_error) {
        setMoreInfo(false);
        setTransaction(false);
        console.log(Object.values(_error)[0].transactionHash);
      })
      .on("receipt", (receipt) => {
        setTransaction(false);
        window.location.href = "/#/admin/dashboard"
        console.log(receipt.events.REPORT.returnValues._msg);
      });
  }

  const recycleAsset = async () => {
    window.location.href = "/#/admin/recycle-asset"
  }

  const retrieveRecord = async () => {
    if (!IDXRawInput) {
      if (loginType === "" || loginManufacturer === "" || loginModel === "" || loginSerial === "") {

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
        return;
      }
    }

    if (IDXRawInput) {
      if (loginIDX === "") {
        setloginIDXState("error");
        return;
      }
    }

    setRetrieving(true)
    console.log("in rr")
    let ipfsHash;
    let tempResult;
    let idxHash;
    {
      IDXRawInput === true && (
        idxHash = IDXRaw
      )
    }
    {
      IDXRawInput === false && (
        idxHash = window.web3.utils.soliditySha3(
          String(type).replace(/\s/g, ''),
          String(manufacturer).replace(/\s/g, ''),
          String(model).replace(/\s/g, ''),
          String(serial).replace(/\s/g, ''),
        )
      )
    }
    console.log("idxHash", idxHash);
    console.log("addr: ", props.addr);
    // if (idxHash.substring(0, 2) !== "0x") { return this.setState({ wasSentQuery: false, queryValue: undefined }) }
    // await window.contracts.STOR.methods
    //   .getPriceData(idxHash)
    //   .call(
    //     (_error, _result) => {
    //       if (_error) {
    //         console.log(_error)
    //       }
    //       else {
    //         if (Object.values(_result)[1] > 0) {
    //           setPrice(window.web3.utils.fromWei(Object.values(_result)[0]));
    //           let currencyNum = Object.values(_result)[1]
    //           switch (currencyNum) {
    //             case "1": setCurrency("Ξ"); break;
    //             case "2": setCurrency("ü"); break;
    //             case "3": setCurrency("◈"); break;
    //             case "4": setCurrency("Ƀ"); break;
    //             default: setCurrency("?"); break;
    //           }

    //           setForSale(true);
    //         }
    //         else {
    //           setForSale(false);
    //         }
    //       }
    //     });

    await window.contracts.STOR.methods
      .retrieveShortRecord(idxHash)
      .call(
        function (_error, _result) {
          if (_error) {
            console.log(_error)
            setError(_error);
            setResult("");
            setRetrieving(false);
          }
          else {
            console.log("rrqr conf");
            setResult(Object.values(_result));
            setError("");
            tempResult = Object.values(_result);
            if (Object.values(_result)[5] > 0) { ipfsHash = window.utils.getIpfsHashFromBytes32(Object.values(_result)[5]); }
            console.log("ipfs data in promise", ipfsHash)
            if (Object.values(_result)[6] > 0) {
              console.log("Getting ipfs2 set up...")
              let knownUrl = "https://ipfs.io/ipfs/";
              let hash = String(window.utils.getIpfsHashFromBytes32(Object.values(_result)[6]));
              let fullUrl = knownUrl + hash;
              console.log(fullUrl);
              setInscription(fullUrl)
            }
          }
        });

    window.assetClass = tempResult[2]
    let assetClassName = await window.utils.getACName(tempResult[2])

    window.assetInfo = {
      assetClassName: assetClassName,
      assetClass: tempResult[2],
      status: await window.utils.getStatusString(String(tempResult[0])),
      idx: idxHash
    }

    await window.utils.resolveACFromID(tempResult[2])
    await getACData("id", window.assetClass)

    console.log(window.authLevel);

    await getIPFSJSONObject(ipfsHash);
    setAuthLevel(window.authLevel);
    setScanQR(false);
    setAsset({
      assetClassName: window.assetClassName,
      assetClass: tempResult[2],
      status: window.assetInfo.status,
      idxHash: idxHash,
    })
    if (window.assetInfo.statusNum == "60") {
      setRecycled(true)
    }

    await window.utils.checkHoldsToken("asset", idxHash, props.addr)
      .then((e) => {
        console.log("is Owner Of? ", e)
        if (e) {
          setOwnerOf(true)
        }
      })

    return setMoreInfo(true);
  }

  const retrieveRecordQR = async (query) => {
    setRetrieving(true)
    console.log("in rrqr")
    let ipfsHash;
    let tempResult;
    let idxHash = query;

    console.log("idxHash", idxHash);
    console.log("addr: ", props.addr);

    // if (idxHash.substring(0, 2) !== "0x") { return this.setState({ wasSentQuery: false, queryValue: undefined }) }
    // await window.contracts.STOR.methods
    //   .getPriceData(idxHash)
    //   .call(
    //     (_error, _result) => {
    //       if (_error) {
    //         console.log(_error)
    //       }
    //       else {
    //         if (Object.values(_result)[1] > 0) {
    //           setPrice(window.web3.utils.fromWei(Object.values(_result)[0]));
    //           let currencyNum = Object.values(_result)[1]
    //           switch (currencyNum) {
    //             case "1": setCurrency("Ξ"); break;
    //             case "2": setCurrency("ü"); break;
    //             case "3": setCurrency("◈"); break;
    //             case "4": setCurrency("Ƀ"); break;
    //             default: setCurrency("?"); break;
    //           }

    //           setForSale(true);
    //         }
    //         else {
    //           setForSale(false);
    //         }
    //       }
    //     });

    await window.contracts.STOR.methods
      .retrieveShortRecord(idxHash)
      .call(
        function (_error, _result) {
          if (_error) {
            console.log(_error)
            setError(_error);
            setResult("");
            setRetrieving(false);
          }
          else {
            console.log("rrqr conf");
            setResult(Object.values(_result));
            setError("");
            tempResult = Object.values(_result);
            if (Object.values(_result)[5] > 0) { ipfsHash = window.utils.getIpfsHashFromBytes32(Object.values(_result)[5]); }
            console.log("ipfs data in promise", ipfsHash)
            if (Object.values(_result)[6] > 0) {
              console.log("Getting ipfs2 set up...")
              let knownUrl = "https://ipfs.io/ipfs/";
              let hash = String(window.utils.getIpfsHashFromBytes32(Object.values(_result)[6]));
              let fullUrl = knownUrl + hash;
              console.log(fullUrl);
              setInscription(fullUrl)
            }
          }
        });

    window.assetClass = tempResult[2]
    let assetClassName = await window.utils.getACName(tempResult[2])

    window.assetInfo = {
      assetClassName: assetClassName,
      assetClass: tempResult[2],
      status: await window.utils.getStatusString(String(tempResult[0])),
      idx: idxHash
    }

    await window.utils.resolveACFromID(tempResult[2])
    await getACData("id", window.assetClass)

    console.log(window.authLevel);

    await getIPFSJSONObject(ipfsHash);
    setAuthLevel(window.authLevel);
    setScanQR(false);
    setAsset({
      assetClassName: window.assetClassName,
      assetClass: tempResult[2],
      status: window.assetInfo.status,
      idxHash: idxHash,
    })
    if (window.assetInfo.statusNum == "60") {
      setRecycled(true)
    }

    await window.utils.checkHoldsToken("asset", idxHash, props.addr)
      .then((e) => {
        console.log("is Owner Of", e)
        if (e) {
          setOwnerOf(true)
        }
      })


    return setMoreInfo(true);
  }

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


  const generateThumbs = (obj) => {
    console.log("obj", obj)
    if (!obj.photo) {
      return []
    }
    else if (Object.values(obj.photo).length === 0) {
      return (
        <div className="assetImageSelectorButton">
          <img title="View Image" src={placeholder} className="imageSelectorImage" alt="" />
        </div>
      )
    }
    let component = [], photos = Object.values(obj.photo);
    console.log("photos", photos)
    for (let i = 0; i < photos.length; i++) {
      component.push(
        <div key={"thumb" + String(i)} value={photos[i]} className="assetImageSelectorButton" onClick={() => { showImage(photos[i]) }}>
          <img title="View Image" src={photos[i]} className="imageSelectorImage" alt="" />
        </div>
      )
    }
    return component
  }

  const showImage = (e) => {
    console.log(selectedImage)
    console.log(e)
    setSelectedImage(e)
  }

  const classes = useStyles();
  const imgClasses = useImgStyles();
  return (
    <>
      {scanQR === false && !moreInfo && (
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info" className="DBGradient">
              <Category />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Asset Information</h4>
          </CardHeader>
          <CardBody>
            <form>
              {IDXRawInput === false && !retrieving && (
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
              {IDXRawInput === false && retrieving && (
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
              {/* {IDXRawInput === true && !retrieving && (
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
              )} */}
              {!retrieving && (
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
                    label="Search via IDX Hash"
                  />
                </div>
              )}
              {IDXRawInput === true && !retrieving && (
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
              {IDXRawInput === true && retrieving && (
                <>
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
                </>
              )}
              {!retrieving && (
                <Button value={scanQR} onClick={(e) => handleScanQR(e)} color="info" className="MLBGradient">Scan QR Code</Button>
              )}
              {!retrieving && (
                <Button color="info" className="MLBGradient" onClick={(e) => retrieveRecord()} >Search Asset</Button>
              )}
              {retrieving && (
                <h3>
                  Retrieving Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                </h3>
              )}
            </form>
          </CardBody>
        </Card>
      )}
      {scanQR === true && !moreInfo && (
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info" className="DBGradient">
              <Category />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>QR Scanner</h4>
          </CardHeader>
          <CardBody>
            <QrReader
              className="qrReader"
              scanDelay={300}
              onScan={(result) => {
                if (result) {
                  retrieveRecordQR(result);
                }

              }}
              onError={(err) => {
                if (err) {
                  console.info(err);
                }
              }}

              style={{ width: '100%' }}
            />
            {retrieving && (
              <h3>
                Retrieving Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
              </h3>
            )}
            <Button value={scanQR} onClick={(e) => handleScanQR(e)} color="info" className="MLBGradient">Back</Button>
          </CardBody>
        </Card>
      )}
      {moreInfo && (
        <Card>
          {!isMobile && (
            <CardHeader image className={imgClasses.cardHeaderHoverCustom}>
              {ipfsObject.photo !== undefined && (
                <>
                  {Object.values(ipfsObject.photo).length > 0 && (
                    <>
                      {ipfsObject.photo.displayImage !== undefined && (
                        <>
                          <Tooltip
                            id="tooltip-top"
                            title="Back"
                            placement="bottom"
                            classes={{ tooltip: classes.tooltip }}
                          >
                            <Button onClick={() => window.location.reload()} large color="info" justIcon className="back">
                              <KeyboardArrowLeft />
                            </Button>
                          </Tooltip>
                          <img src={selectedImage} alt="..." />
                        </>
                      )}
                      {ipfsObject.photo.displayImage === undefined && (
                        <>
                          <Tooltip
                            id="tooltip-top"
                            title="Back"
                            placement="bottom"
                            classes={{ tooltip: classes.tooltip }}
                          >
                            <Button onClick={() => window.location.reload()} large color="info" justIcon className="back">
                              <KeyboardArrowLeft />
                            </Button>
                          </Tooltip>
                          <img src={Object.values(ipfsObject.photo)[0]} alt="..." />
                        </>
                      )}
                    </>
                  )}
                  {Object.values(ipfsObject.photo).length === 0 && (
                    <>
                      <Tooltip
                        id="tooltip-top"
                        title="Back"
                        placement="bottom"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <Button onClick={() => window.location.reload()} large color="info" justIcon className="back">
                          <KeyboardArrowLeft />
                        </Button>
                      </Tooltip>
                      <Jdenticon value={asset.idxHash} />
                    </>
                  )}
                </>
              )}
            </CardHeader>
          )}
          {isMobile && (
            <CardHeader image className={imgClasses.cardHeaderHoverCustom}>
              {ipfsObject.photo !== undefined && (
                <>
                  {Object.values(ipfsObject.photo).length > 0 && (
                    <>
                      {ipfsObject.photo.displayImage !== undefined && (
                        <>
                          <Tooltip
                            id="tooltip-top"
                            title="Back"
                            placement="bottom"
                            classes={{ tooltip: classes.tooltip }}
                          >
                            <Button onClick={() => window.location.reload()} large color="info" justIcon className="back">
                              <KeyboardArrowLeft />
                            </Button>
                          </Tooltip>
                          <img src={selectedImage} alt="..." />
                        </>
                      )}
                      {ipfsObject.photo.displayImage === undefined && (
                        <>
                          <Tooltip
                            id="tooltip-top"
                            title="Back"
                            placement="bottom"
                            classes={{ tooltip: classes.tooltip }}
                          >
                            <Button onClick={() => window.location.reload()} large color="info" justIcon className="back">
                              <KeyboardArrowLeft />
                            </Button>
                          </Tooltip>
                          <img src={Object.values(ipfsObject.photo)[0]} alt="..." />
                        </>
                      )}
                    </>
                  )}
                  {Object.values(ipfsObject.photo).length === 0 && (
                    <>
                      <Tooltip
                        id="tooltip-top"
                        title="Back"
                        placement="bottom"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <Button onClick={() => window.location.reload()} large color="info" justIcon className="back">
                          <KeyboardArrowLeft />
                        </Button>
                      </Tooltip>
                      <Jdenticon value={asset.idxHash} />
                    </>
                  )}
                </>
              )}
            </CardHeader>
          )}
          <CardBody>
            {ipfsObject.photo !== {} && (
              <div className="imageSelector">
                {generateThumbs(ipfsObject)}
              </div>
            )}
            <h4 className={classes.cardTitle}>Name: {ipfsObject.name}</h4>
            <h4 className={classes.cardTitle}>Class: {asset.assetClassName}(NODE ID:{asset.assetClass})</h4>
            {currency === "" && (<h4 className={classes.cardTitle}>Status: {asset.status} </h4>)}
            {currency !== "" && (
              <>
                <h4 className={classes.cardTitle}>Status: For Sale </h4>
                <h4 className={classes.cardTitle}>Price: {currency} {price} </h4>
              </>
            )}
            {ipfsObject.text !== undefined && (
              <>
                {
                  ipfsObject.text.Description !== undefined && (
                    <TextField
                      id="outlined-multiline-static"
                      label="Description"
                      multiline
                      rows={4}
                      defaultValue={ipfsObject.text.Description}
                      variant="outlined"
                      fullWidth
                      disabled
                    />
                  )
                }
                {ipfsObject.text.Description === undefined && (
                  <TextField
                  id="outlined-multiline-static"
                  label="Description: None"
                  multiline
                  rows={4}
                  defaultValue={ipfsObject.text.Description}
                  variant="outlined"
                  fullWidth
                  disabled
                />
                )}
                {/* {ipfsObject.text.Description === undefined && Object.values(ipfsObject.text).length > 0 && (
                  <p className={classes.cardCategory}>
                    Text Element: {Object.values(ipfsObject.text)[0]}
                  </p>
                )} */}
              </>
            )}
            <br />
            {/* {currency !== "" && !transaction && (
              <Button onClick={() => { purchaseAsset() }} color="info" className="MLBGradient">Purchase Item</Button>
            )}

            {currency !== "" && transaction && (
              <Button disabled color="info" className="MLBGradient">Transaction Pending . . .</Button>
            )} */}
            {recycled && !transaction && (
              <>
                <h3>This asset has been discarded, if you want you can claim it as your own!</h3>
                <Button onClick={() => { recycleAsset() }} color="info" className="MLBGradient">Recycle Asset</Button>
              </>
            )}
            {ownerOf && (
              <div>
                <FormControl
                  fullWidth
                  className={classes.selectFormControl}
                >
                  <InputLabel className="functionSelectorText">
                    <Danger>
                      <Create className="functionSelectorIcon" />
                    </Danger>
                    Modify Asset
                        </InputLabel>
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
                      Select Function
                          </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="transfer"
                    >
                      Transfer
                          </MenuItem>
                    {/* <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="escrow"
                    >
                      Escrow
                          </MenuItem> */}
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="import"
                    >
                      Import
                          </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="export"
                    >
                      Export
                          </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="discard"
                    >
                      Discard
                          </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="modify-status"
                    >
                      Modify Status
                          </MenuItem>
                    {/* <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="decrement-counter"
                    >
                      Decrement Counter
                          </MenuItem> */}
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="edit-information"
                    >
                      Change Asset Information
                          </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="edit-rightsholder"
                    >
                      Change Owner Information
                          </MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
          </CardBody>
          <CardFooter chart>
            {!isMobile && (
              <div className={classes.stats}>
                IDX Hash: {asset.idxHash}
              </div>
            )}
            {isMobile && (
              <div className={classes.stats}>
                IDX Hash: {asset.idxHash.substring(0, 12) + "..." + asset.idxHash.substring(54, 66)}
              </div>
            )}
            <div className={classes.stats}>
              <Share />
              <Print />
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
