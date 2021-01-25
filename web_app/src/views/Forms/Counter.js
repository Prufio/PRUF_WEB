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
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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
import Checkbox from "@material-ui/core/Checkbox";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { Iso } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function Counter() {
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [modifying, setModifying] = React.useState(false);
  const [asset, setAsset] = React.useState("");
  const [txHash, setTxHash] = React.useState("");
  const [error, setError] = React.useState("");

  const [count, setCount] = React.useState("");
  const [loginCount, setloginCount] = React.useState("");
  const [loginCountState, setloginCountState] = React.useState("");
  

  const clearForms = event => {
    setCount("");
    setloginCountState("");
    console.log("clearing forms")
  }; 
  
  const modifyCount = async () => {
      if (loginCount === "") {
          setloginCountState("error");
        return;
      }

    console.log("in MC")
    let receiptVal;
    let tempTxHash;
    let idxHash

    console.log("Count", count);
    console.log("addr: ", window.addr);
    setModifying(true)

    await window.contracts.NP_NC.methods
      ._decCounter(idxHash, count)
      .send({ from: window.addr })
      .on("error", function (_error) {
        setModifying(false);
        tempTxHash = Object.values(_error)[0].transactionHash;
        setTxHash(Object.values(_error)[0].transactionHash);
        console.log(Object.values(_error)[0].transactionHash);
        console.log(_error)
        setError(_error);
        clearForms()
      })
      .on("receipt", (receipt) => {
        receiptVal = receipt.events.REPORT.returnValues._msg;
        setModifying(false)
        setTxHash(receipt.transactionHash)
        tempTxHash = receipt.transactionHash
      });

    return clearForms()
  }


  const assetLogin = event => {
    setAsset(event.target.value);
  };

  const classes = useStyles();
  return (
    <>
      {asset === "" && (
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info" className="DBGradient">
              <Category />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Asset Class</h4>
          </CardHeader>
          <CardBody>
            <form>
              <FormControl
                fullWidth
                className={classes.selectFormControl}
              >
                <InputLabel
                >
                  Select Asset
                        </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={simpleSelect}
                  onChange={assetLogin}
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
                    Please Select Asset
                          </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="placeholder"
                  >
                    placeholder
                          </MenuItem>
                </Select>
              </FormControl>
            </form>
          </CardBody>
        </Card>
      )}
      {asset !== "" && (
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info" className="DBGradient">
              <Iso />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Decrement Counter</h4>
          </CardHeader>
          <CardBody>
            <form>
              <h4>Asset Selected: {asset} </h4>
              <h4>
                Current Count/Max Count
              </h4>
              {!modifying && (

                <CustomInput
                  success={loginCountState === "success"}
                  error={loginCountState === "error"}
                  labelText="Count *"
                  id="count"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    type: "number",
                    onChange: event => {
                      setCount(event.target.value.trim())
                      if (event.target.value !== "") {
                        setloginCountState("success");
                      } else {
                        setloginCountState("error");
                      }
                      setloginCount(event.target.value);
                    },
                  }}
                />
              )}
              {modifying && (
                <CustomInput
                  labelText={count}
                  id="count"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
              )}
              {modifying && (
                <h3>
                  Modifying Asset<div className="lds-facebookRR"><div></div><div></div><div></div></div>
                </h3>
              )}
              {!modifying && (
                <Button color="info" className="MLBGradient" onClick={(e) => modifyCount()}>Update Counter</Button>
              )}
            </form>
          </CardBody>
        </Card>
      )}
    </>
  );
}
