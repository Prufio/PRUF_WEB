import React from "react";
import "../../assets/css/custom.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/icons
import Check from "@material-ui/icons/Check";
import Category from "@material-ui/icons/Category";
import Share from "@material-ui/icons/Share";
import Print from "@material-ui/icons/Print";
import { ExitToApp } from "@material-ui/icons";


// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Tooltip from "@material-ui/core/Tooltip";

import SweetAlert from "react-bootstrap-sweetalert";
import QrReader from 'react-qr-reader'
import Jdenticon from 'react-jdenticon';

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import pruftoken from "../../assets/img/pruftoken.png";
import macbook from "../../assets/img/MacBook.png";
import { boxShadow } from "assets/jss/material-dashboard-pro-react";


const useStyles = makeStyles(styles);

export default function Search() {

  const [checked, setChecked] = React.useState([24, 22]);
  const [selectedEnabled, setSelectedEnabled] = React.useState("b");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [scanQR, setScanQR] = React.useState(false)
  const [alert, setAlert] = React.useState(null);
  const [data, setData] = React.useState("");
  const [idxHash, setIdxHash] = React.useState("");
  const [result, setResult] = React.useState("");
  const [queryValue, setQueryValue] = React.useState("");
  const [wasSentQuery, setWasSentQuery] = React.useState(false);
  const [error, setError] = React.useState("");
  const [inscription, setInscription] = React.useState("");
  const [moreInfo, setMoreInfo] = React.useState(false);
  const [forSale, setForSale] = React.useState(false);
  const [authLevel, setAuthLevel] = React.useState("");
  const [ipfsObject, setIpfsObject] = React.useState({});
  const [asset, setAsset] = React.useState({});
  const [price, setPrice] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  const [transaction, setTransaction] = React.useState(false);
  const [QRValue, setQRValue] = React.useState("");
  const [retrieving, setRetrieving] = React.useState(false);

  const [IDXRawInput, setIDXRawInputInput] = React.useState(false);

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
        return setIpfsObject(JSON.parse(result))
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
      .send({ from: window.addr })
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

  const retrieveRecord = async () => {
    if (!IDXRawInput) {
      if (loginTypeState === "" || loginManufacturer === "" || loginModel === "" || loginSerial === "") {

        if (loginTypeState === "") {
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
      if (loginIDXState === "") {
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
    console.log("addr: ", window.addr);
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
    return setMoreInfo(true);
  }

  const retrieveRecordQR = async (query) => {
    setRetrieving(true)
    console.log("in rrqr")
    let ipfsHash;
    let tempResult;
    let idxHash = query;

    console.log("idxHash", idxHash);
    console.log("addr: ", window.addr);
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
  const classes = useStyles();
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
              {!retrieving && (
                <div className={classes.checkboxAndRadio}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => setIDXRawInputInput(!IDXRawInput)}
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
                <Button value={scanQR} onClick={(e) => handleScanQR(e)} color="info" className="MLBGradient">Scan QR</Button>
              )}
              {!retrieving && (
                <Button color="info" className="MLBGradient" onClick={(e) => retrieveRecord()} >Search Asset</Button>
              )}
              {retrieving && (
                <Button color="info" className="MLBGradient" disabled >Retrieving Asset. . .</Button>
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
                  // setQRValue(result);
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
              <h4 >Retrieving Asset. . .</h4>
            )}
            <Button value={scanQR} onClick={(e) => handleScanQR(e)} color="info" className="MLBGradient">Back</Button>
          </CardBody>
        </Card>
      )}
      {moreInfo && (
        <Card>
          {/* <CardHeader   onClick={(e) => setViewAsset(!viewAsset)} className={classes.cardHeaderHover}>
                <img src={macbook} alt="..." />
            </CardHeader> */}
          <CardHeader image className={classes.cardHeaderHover}>
            {ipfsObject.photo !== undefined && (
              <>
                {Object.values(ipfsObject.photo).length > 0 && (
                  <>
                    {ipfsObject.photo.displayImage !== undefined && (
                      <img src={ipfsObject.photo.displayImage} alt="logo" />
                    )}
                    {ipfsObject.photo.displayImage === undefined && (
                      <img src={Object.values(ipfsObject.photo)[0]} alt="logo" />
                    )}
                  </>
                )}
                {Object.values(ipfsObject.photo).length === 0 && (
                  <Jdenticon size="300" value={asset.idxHash} />
                )}
              </>
            )}
          </CardHeader>
          <CardBody>
            <Tooltip
              id="tooltip-top"
              title="Back"
              placement="bottom"
              classes={{ tooltip: classes.tooltip }}
            >
              <Button 
              // onClick={(e) => setMoreInfo(!moreInfo)}
              onClick={() => window.location.reload()}
               simple color="info" justIcon>
                <ExitToApp />
              </Button>
            </Tooltip>
            <h4 className={classes.cardTitle}>Name: {ipfsObject.name}</h4>
            <h4 className={classes.cardTitle}>Class: {asset.assetClassName}(ID:{asset.assetClass})</h4>
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
                    <p className={classes.cardCategory}>
                      Description: {ipfsObject.text.Description}
                    </p>
                  )
                }
                {ipfsObject.text.Description === undefined && (
                  <p className={classes.cardCategory}>
                    Description: None
                  </p>
                )}
                {ipfsObject.text.Description === undefined && Object.values(ipfsObject.text).length > 0 && (
                  <p className={classes.cardCategory}>
                    Text Element: {Object.values(ipfsObject.text)[0]}
                  </p>
                )}
              </>
            )}
            <br />
            {currency !== "" && !transaction && (
              <Button onClick={() => { purchaseAsset() }} color="info" className="MLBGradient">Purchase Item</Button>
            )}

            {currency !== "" && transaction && (
              <Button disabled color="info" className="MLBGradient">Transaction Pending . . .</Button>
            )}
          </CardBody>
          <CardFooter chart>
            <div className={classes.stats}>
              IDX Hash: {asset.idxHash}
              {/* {asset.idxHash.substring(0, 12) + "..." + asset.idxHash.substring(30, 42)} */}
            </div>
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
