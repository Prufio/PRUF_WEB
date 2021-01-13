import React from "react";
import { useState } from 'react';
import "../../assets/css/custom.css";
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

import QrReader from 'react-qr-reader'

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

export default function Search() {

  const [checked, setChecked] = React.useState([24, 22]);
  const [selectedEnabled, setSelectedEnabled] = React.useState("b");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [scanQR, setScanQR] = React.useState(false)
  const [data, setData] = useState("Asset not found");
  const [idxHash, setIdxHash] = useState("");
  const [result, setResult] = useState("");

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

  const retrieveRecordQR = async (data) => {
    console.log("in rrqr")
    // const self = this;
    // let ipfsHash;
    // let tempResult;
    let idxHash = data;
    // if (query) {
    //   let tempBool = await window.utils.checkAssetExistsBare(this.state.queryValue)
    //   if (tempBool) {
    //     idxHash = String(this.state.queryValue)
    //   } else { this.setState({ wasSentQuery: false, queryValue: undefined }); return this.setState({ alertBanner: "Asset does not exist!" }) }

    // } else {
    //   idxHash = String(this.state.result)
    // }
    // setData(idxHash)
    console.log("idxHash", idxHash);
    console.log("addr: ", window.addr);
    // if (idxHash.substring(0, 2) !== "0x") { return this.setState({ wasSentQuery: false, queryValue: undefined }) }
    await window.contracts.STOR.methods
      .retrieveShortRecord(idxHash)
      .call(
        function (_error, _result) {
          if (_error) {
            console.log(_error)
            // self.setState({
            //   error: _error,
            //   result: 0
            // });
          } 
          else {
            console.log("rrqr conf");
            // self.setState({
            //   result: Object.values(_result),
            //   error: undefined
            // })
            // setResult(Object.values(_result))
            // tempResult = Object.values(_result);
            // if (Object.values(_result)[5] > 0) { ipfsHash = window.utils.getIpfsHashFromBytes32(Object.values(_result)[5]); }
            // console.log("ipfs data in promise", ipfsHash)
            // if (Object.values(_result)[6] > 0) {
            //   console.log("Getting ipfs2 set up...")
            //   let knownUrl = "https://ipfs.io/ipfs/";
            //   let hash = String(window.utils.getIpfsHashFromBytes32(Object.values(_result)[6]));
            //   let fullUrl = knownUrl + hash;
            //   console.log(fullUrl);
              // self.setState({ ipfs2: fullUrl });
            // }
          }
        });

    // window.assetClass = result[2]
    // let assetClassName = await window.utils.getACName(result[2])

    // window.assetInfo = {
    //   assetClassName: assetClassName,
    //   assetClass: result[2],
    //   status: await window.utils.getStatusString(String(result[0])),
    //   idx: idxHash
    // }

    // await window.utils.resolveACFromID(result[2])
    // await this.getACData("id", window.assetClass)

    console.log(window.authLevel);

    // await this.getIPFSJSONObject(ipfsHash);

    // return this.setState({
    //   moreInfo: true,
    //   authLevel: window.authLevel,
    //   QRreader: false
    // })
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
      {scanQR === false && (
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
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
              // inputProps={{
              // type: "email"
              // }}
              />
              <CustomInput
                labelText="Type"
                id="type"
                formControlProps={{
                  fullWidth: true
                }}
              // inputProps={{
              //   type: "password",
              //   autoComplete: "off"
              // }}
              />
              <CustomInput
                labelText="Model"
                id="model"
                formControlProps={{
                  fullWidth: true
                }}
              // inputProps={{
              // type: "email"
              // }}
              />
              <CustomInput
                labelText="Serial"
                id="serial"
                formControlProps={{
                  fullWidth: true
                }}
              // inputProps={{
              //   type: "password",
              //   autoComplete: "off"
              // }}
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
              <Button value={scanQR} onClick={(e) => handleScanQR(e)} color="info">Scan QR</Button>
              <Button color="success">Search Asset</Button>
            </form>
          </CardBody>
        </Card>
      )}
      {scanQR === true && (
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info">
              <Category />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>QR Scanner</h4>
          </CardHeader>
          <CardBody>
            <QrReader
            // facingMode={"rear"}
              scanDelay={300}
              onScan={(result) => {
                if (!!result) {
                  return retrieveRecordQR(result);
                  // setData(result), 
                }

              }}
              onError={(err) => {
                if (!!err) {
                  console.info(err);
                }
              }}

              style={{ width: '100%' }}
            />
            <p>{data}</p>
            <Button value={scanQR} onClick={(e) => handleScanQR(e)} color="info">Back</Button>
          </CardBody>
        </Card>
      )}
    </>
  );
}
