import React from "react";
import { useState } from 'react';
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


// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

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
  const [data, setData] = useState("");
  const [idxHash, setIdxHash] = useState("");
  const [result, setResult] = useState("");
  const [queryValue, setQueryValue] = useState("");
  const [wasSentQuery, setWasSentQuery] = useState(false);
  const [error, setError] = useState("");
  const [inscription, setInscription] = useState("");
  const [moreInfo, setMoreInfo] = useState(false);
  const [forSale, setForSale] = useState(false);
  const [authLevel, setAuthLevel] = useState("");
  const [ipfsObject, setIpfsObject] = useState({});
  const [asset, setAsset] = useState({});
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [transaction, setTransaction] = useState(false);
  const [QRValue, setQRValue] = useState("");
  const [retrieving, setRetrieving] = useState(false);


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
    if(window.balances.prufTokenBalance < window.web3.utils.fromWei(price)){console.log("insufficient balance"); return console.log(window.web3.utils.fromWei(price))}
    setTransaction(true)
    await window.contracts.PURCHASE.methods
      .purchaseWithPRUF(asset.idxHash)
      .send({from: window.addr})
      .on("error", function (_error) {
        setMoreInfo(false);
        setTransaction(false);
        console.log(Object.values(_error)[0].transactionHash);
      })
      .on("receipt", (receipt) => {
        setTransaction(false);
        window.location.href="/#/admin/dashboard"
        console.log(receipt.events.REPORT.returnValues._msg);
      });
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
    await window.contracts.STOR.methods
      .getPriceData(idxHash)
      .call(
        (_error, _result) => {
          if (_error) {
            console.log(_error)
          }
          else {
            if (Object.values(_result)[1] > 0) {
              setPrice(window.web3.utils.fromWei(Object.values(_result)[0]));
              let currencyNum = Object.values(_result)[1]
              switch (currencyNum) {
                case "1": setCurrency("Ξ"); break;
                case "2": setCurrency("ü"); break;
                case "3": setCurrency("◈"); break;
                case "4": setCurrency("Ƀ"); break;
                default: setCurrency("?"); break;
              }

              setForSale(true);
            }
            else {
              setForSale(false);
            }
          }
        });

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
              <CustomInput
                labelText="Manufacturer"
                id="manufacturer"
                formControlProps={{
                  fullWidth: true
                }}
              />
              <CustomInput
                labelText="Type"
                id="type"
                formControlProps={{
                  fullWidth: true
                }}
              />
              <CustomInput
                labelText="Model"
                id="model"
                formControlProps={{
                  fullWidth: true
                }}
              />
              <CustomInput
                labelText="Serial"
                id="serial"
                formControlProps={{
                  fullWidth: true
                }}
              />
              <div className={classes.checkboxAndRadio}>
                <FormControlLabel
                  control={
                    <Checkbox
                      tabIndex={-1}
                      onClick={() => handleToggle(2)}
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
              <Button value={scanQR} onClick={(e) => handleScanQR(e)} color="info" className="MLBGradient">Scan QR</Button>
              <Button color="info" className="MLBGradient">Search Asset</Button>
            </form>
          </CardBody>
        </Card>
      )}
      {scanQR === true && !moreInfo && (
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
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
            <Button value={scanQR} onClick={(e) => handleScanQR(e)} color="info">Back</Button>
          </CardBody>
        </Card>
      )}
      {moreInfo && (
        <Card>
          <CardHeader color="info" className="DBGradient">
            {ipfsObject.photo !== undefined && (
              <>
                {Object.values(ipfsObject.photo).length > 0 && (
                  <>
                    {ipfsObject.photo.displayImage !== undefined && (
                      <img src={ipfsObject.photo.displayImage} alt="logo" className="assetImage" />
                    )}
                    {ipfsObject.photo.displayImage === undefined && (
                      <img src={Object.values(ipfsObject.photo)[0]} alt="logo" className="assetImage" />
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
              <Button onClick={()=>{purchaseAsset()}} color="info" className="MLBGradient">Purchase Item</Button>
            )}
            
            {currency !== "" && transaction && (
              <Button disabled color="info" className="MLBGradient">Transaction Pending . . .</Button>
            )}
          </CardBody>
          <CardFooter chart>
            <div className={classes.stats}>
              IDX Hash: {asset.idxHash.substring(0, 12) + "..." + asset.idxHash.substring(30, 42)}
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
