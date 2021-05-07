import React from "react";
import "../../assets/css/custom.css";
import swal from "sweetalert";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// @material-ui/icons
import Category from "@material-ui/icons/Category";

// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { FlightLand } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function Import(props) {
  if(!window.sentPacket) window.sentPacket = {}

  const [nodeId, setAssetClass] = React.useState("");
  // const [simpleSelect, setSimpleSelect] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedRootID, setSelectedRootID] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [classSelect, setClassSelect] = React.useState("");

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [showHelp, setShowHelp] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [txStatus, setTxStatus] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [txHash, setTxHash] = React.useState("");

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
    }
  
    else if (assetInfo.statusNum && assetInfo.statusNum !== "70") {
      swal({
        title: "Asset not in correct status!",
        text:
          "This asset is not in exported status, please export asset before attempting to import it.",
        icon: "warning",
        button: "Close",
      })
      window.backIndex = assetInfo.dBIndex;
      window.location.href = assetInfo.lastRef;
    }

  }, []);

  const checkCreds = async (e) => {
    let nodeId = e.target.value;
/*     let nodeManagement;

    console.log({nodeId, nodeManagement})

    props.prufClient.get.nodeData(nodeId).then(e => {

        nodeManagement = e.managementType

        if (Number(nodeManagement) < 4) {

          switch(nodeManagement) {
            
            case("1") : {
              if (window.web3.utils.toChecksumAddress(assetInfo.nodeAdmin) !== window.web3.utils.toChecksumAddress(props.addr)){
                console.log(assetInfo.nodeAdmin, props.addr)
                return console.log("Must be node admin to import into this node.")
              } else {
                return ACLogin(nodeId)
              }
            }
    
            case("2") : {
              if (window.web3.utils.toChecksumAddress(assetInfo.nodeAdmin) !== window.web3.utils.toChecksumAddress(props.addr)) {
                console.log(assetInfo.nodeAdmin, props.addr)
                return console.log("Must be node admin to import into this node.")
              } else {
                return ACLogin(nodeId)
              }
              
            }
    
            case("3") : {
              if(!assetInfo.userAuthLevel || assetInfo.userAuthLevel !== "1") {
                return console.log("User address not authorized to import into node.")
              } else {
                return ACLogin(nodeId)
              }
            }
    
            default : break
          }
    
        }
    
        else {
          return ACLogin(nodeId)
        }
    }) */

    return ACLogin(nodeId)
  }


  const ACLogin = (nodeId) => {
    console.log(nodeId)
    setAssetClass(nodeId);
  };

  const goBack = () => {
    window.backIndex = assetInfo.dBIndex;
    window.location.href = assetInfo.lastRef;
  };

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return (window.location.href = "/#/user/home");
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  };

  const generateSubCatList = (arr) => {
    let subCatSelection = [
      <MenuItem
      key=""
        disabled
        classes={{
          root: classes.selectMenuItem,
        }}
      >
        Select Node
      </MenuItem>,
    ];

    for (let i = 0; i < arr.length; i++) {
      subCatSelection.push(
        <MenuItem
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected,
          }}
          key={"key" + arr[i].name}
          value={String(arr[i].id)}
        >
          {arr[i].name}
        </MenuItem>
      );
    }

    //console.log(arr);
    return subCatSelection;
  };

  const importAsset = () => {
    //import held asset

    // eslint-disable-next-line react/prop-types
    const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    props.prufClient.do
      .importAsset(assetInfo.id, nodeId)
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
        setAssetClass("");
      })
      .on("receipt", (receipt) => {
        setTransactionActive(false);
        setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        setTxHash(receipt.transactionHash);
        swal({
          title: "Import Successful!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(() => {
          //refreshBalances()
          let newAsset = JSON.parse(JSON.stringify(assetInfo));
          newAsset.status = "Non-Transferable";
          newAsset.statusNum = "58";
          window.newStat = { num: "58", str: "Non-Transferable" };
          window.backIndex = assetInfo.dBIndex;
          window.location.href = assetInfo.lastRef;
          window.replaceAssetData = {
            key: pageKey,
            dBIndex: assetInfo.dBIndex,
            newAsset: newAsset,
          };
        window.dispatchEvent(props.refresh)
        });
      });
  };

  if(!props.prufClient){
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
    <>
      {nodeId === "" && (
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <Category />
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
            <form>
              <FormControl fullWidth className={classes.selectFormControl}>
                  <>
                    <InputLabel>Select Node</InputLabel>
                    {assetInfo.nodeData && props.nodeSets ? 
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      value={classSelect}
                      onChange={(e) => {
                        checkCreds(e);
                      }}
                      inputProps={{
                        name: "classSelect",
                        id: "class-select",
                      }}
                    >
                      {generateSubCatList(props.nodeSets[assetInfo.nodeData.root])}
                    </Select>
                    :
                    <Select
                      MenuProps={{
                        className: classes.selectMenu,
                      }}
                      classes={{
                        select: classes.select,
                      }}
                      disabled
                      value={classSelect}
                      onChange={(e) => {
                        checkCreds(e);
                      }}
                      inputProps={{
                        name: "classSelect",
                        id: "class-select",
                      }}
                    />
                    }
                    {/* eslint-disable-next-line react/prop-types */}
                  </>
              </FormControl>
            </form>
          </CardBody>
          <br />
        </Card>
      )}
      {nodeId !== "" && (
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <FlightLand />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Import Asset</h4>
          </CardHeader>
          <CardBody>
            <form>
              {!transactionActive && (
                <>
                  <h4>Node selected: {assetInfo.nodeData.name} </h4>
                  <h4>Asset Selected: {assetInfo.name}</h4>
                  <br />
                  <h5>
                    You are attempting to import {assetInfo.name} into node {assetInfo.nodeData.name}.
                  </h5>
                </>
              )}
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
                      onClick={() => importAsset()}
                    >
                      Import Asset
                    </Button>
                  </div>
                </>
              )}
              {transactionActive && (
                <h3>
                  Importing Asset
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
      )}
    </>
  );
}
