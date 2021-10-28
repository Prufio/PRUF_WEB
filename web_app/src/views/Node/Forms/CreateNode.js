import React from "react";
import "../../../assets/css/custom.css";
import swal from "sweetalert";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
// import Checkbox from '@material-ui/core/Checkbox'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Check from '@material-ui/icons/Check'

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
// import GridContainer from 'components/Grid/GridContainer.js'
// import GridItem from 'components/Grid/GridItem.js'

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import PRUF from "pruf-js";
// import cardStyles from 'assets/jss/material-dashboard-pro-react/views/dashboardStyle.js'
// import placeholderComingSoon from '../../../assets/img/placeholderComingSoon.jpg'
// import { Tooltip } from '@material-ui/core'

const useStyles = makeStyles(styles);
// const useCardStyles = makeStyles(cardStyles)

export default function CreateNode(props) {
  if (!window.sentPacket) window.sentPacket = {};

  const [transactionActive, setTransactionActive] = React.useState(false);
  const [transactionActiveID, setTransactionIDActive] = React.useState(false);

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [showHelp, setShowHelp] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [txStatus, setTxStatus] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [txHash, setTxHash] = React.useState("");
  const [mintedID, setMintedID] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedRootID, setSelectedRootID] = React.useState("");
  const [extDataUploading, setExtDataUploading] = React.useState(false);

  const [name, setName] = React.useState("");
  const [root, setRoot] = React.useState("");
  const [rootName, setRootName] = React.useState("");
  // const [pricingObj, setPricingObj] = React.useState({})

  // eslint-disable-next-line no-unused-vars
  const [loginName, setloginName] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [loginIPFS, setloginIPFS] = React.useState("");

  const [loginNameState, setloginNameState] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [loginIPFSState, setloginIPFSState] = React.useState("");

  // eslint-disable-next-line no-unused-vars
  const [standard1, setStandard1] = React.useState(true);
  // eslint-disable-next-line no-unused-vars
  const [standard2, setStandard2] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [standard3, setStandard3] = React.useState(false);

  const link = document.createElement("div");
  const sampleIpfs = {
    idHashFields: [
      ["Field 1", "field 1 placeholder"],
      ["Field 2", "field 2 placeholder"],
      ["Field 3", "field 3 placeholder"],
      ["Field 4", "field 4 placeholder"],
    ],
    ownerHashFields: [],
    landingConfig: { url: "", DBref: "" },
    nodeAssets: { photo: {}, text: {} },
  };

  document.body.style.cursor = "default";

  const classes = useStyles();
  // const cardClasses = useCardStyles()

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
  }, []);

  const generateRootList = (arr) => {
    // eslint-disable-next-line react/prop-types
    let rootNames = props.rootNames;
    if (!arr || !rootNames) return;
    let rootSelection = [
      <MenuItem
        disabled
        key={"keySelClass"}
        classes={{
          root: classes.selectMenuItem,
        }}
      >
        Select a Class
      </MenuItem>,
    ];

    for (let i = 0; i < arr.length; i++) {
      rootSelection.push(
        <MenuItem
          key={"key" + String(arr[i])}
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected,
          }}
          value={String(arr[i])}
        >
          {rootNames[i]}
        </MenuItem>
      );
    }

    return rootSelection;
  };

  const rootLogin = (e) => {
    console.log(props.roots);
    if (!e.target.value) return setRoot("");
    // eslint-disable-next-line react/prop-types
    if (e.target.value === "1") {
      setRootName("Art");
    }
    if (e.target.value === "2") {
      setRootName("Digital Art");
    }
    if (e.target.value === "3") {
      setRootName("Trinkets");
    }
    if (e.target.value === "4") {
      setRootName("Musical instrumnts");
    }
    if (e.target.value === "5") {
      setRootName("Apparel");
    }
    if (e.target.value === "6") {
      setRootName("Mobile Electronics");
    }
    if (e.target.value === "7") {
      setRootName("Non-motor Vehicles");
    }
    setRoot(e.target.value);
    setSelectedRootID(e.target.value);
  };

  const IDHolderPrompt = () => {};

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return (window.location.href = "/#/user/home");
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  };

  // const setStandard = (standard) => {
  //     switch (standard) {
  //         case '1': {
  //             setStandard1(true)
  //             setStandard2(false)
  //             setStandard3(false)
  //             break
  //         }
  //         case '2': {
  //             setStandard1(false)
  //             setStandard2(true)
  //             setStandard3(false)
  //             break
  //         }
  //         case '3': {
  //             setStandard1(false)
  //             setStandard2(false)
  //             setStandard3(true)
  //             break
  //         }
  //         default: {
  //             console.log('Error in standard switch')
  //         }
  //     }
  // }

  // // const setPrices = () => {
  // //   console.log(pricingObj);
  // // };

  // const handlePriceAdjustment = (job, val) => {
  //     let tempObj = JSON.parse(JSON.stringify(pricingObj))
  //     if (!val || val < 0) {
  //         delete tempObj[job]
  //         setPricingObj(tempObj)
  //     } else {
  //         tempObj[job] = String(val)
  //         setPricingObj(tempObj)
  //     }
  // }

  const handleNewAssetClass = (extendedDataHash) => {
    // eslint-disable-next-line react/prop-types

    window.replaceAssetData.refreshBals = true;
    const pageKey = thousandHashesOf(props.addr, props.winKey);
    let id;
    props.prufClient.get.nodeId(name).then((e) => {
      // eslint-disable-next-line react/prop-types
      let tempArr, tempExtArr;

      let tempObj = {
        id: e,
        name: name,
        root: root,
        custodyType: "2",
        managementType: "255",
        storageProvider: "0",
        discount: "",
        referenceAddress: "",
        switches: "",
        extData: extendedDataHash,
      };

      if (Number(props.nodes) > 0) {
        tempArr = JSON.parse(JSON.stringify(props.heldNodeData));
        tempExtArr = JSON.parse(JSON.stringify(props.nodeExtData));
      } else {
        tempArr = [["", "", "", ""]];
        tempExtArr = [];
      }

      // eslint-disable-next-line react/prop-types
      tempArr.unshift([name, e, "N/A", "N/A"]);
      tempExtArr.unshift(tempObj);
      console.log({ newList: tempArr, newData: tempExtArr });
      window.replaceAssetData = {
        key: pageKey,
        nodeList: { data: tempArr, extData: tempExtArr },
      };
      window.dispatchEvent(props.refresh);
      window.location.href = "/#/user/node-manager";
    });
  };

  const checkForAC = async () => {
    props.prufClient.get.node.isNameAvailable(name).then((e) => {
      if (e) {
        setExtDataUploading(true);
        window.ipfs.add(JSON.stringify(sampleIpfs)).then((hash) => {
          if (!hash) {
            console.error("error sending to ipfs");
          } else {
            let url = `https://ipfs.io/ipfs/${hash.cid}`;
            console.log(`Url --> ${url}`);
            props.prufClient.utils.ipfsToB32(String(hash.cid)).then((e) => {
              purchaseNode(e);
            });
          }
        });
      } else {
        swal({
          title:
            "That name has already been reserved! Try a differnet one, or contact the team: support@pruf.io",
          button: "Okay",
        });
      }
    });
  };

  const purchaseNode = (extendedDataHash) => {
    //import held asset

    console.log({ name, root, extendedDataHash });
    if (root === "") {
      return swal("Please input root node");
    }
    if (name === "") {
      return swal("Please input node name");
    }
    if (Number(props.pruf) < Number(props.currentACPrice)) {
      console.log(props.pruf);
      return swal("Insufficient PRUF Balance!");
    }
    setTransactionActive(true);
    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    props.prufClient.faucet
      .getNode(name, root, "2", extendedDataHash)
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
          title: "Node Minting Successul!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(() => {
          //refreshBalances()
          handleNewAssetClass(extendedDataHash);
        });
      });
  };

  return (
    <Card>
      {props.roots === undefined && (
        <>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <span className="material-icons">dashboard_customize</span>
            </CardIcon>
            <h3 className={classes.cardIconTitle}>New Node</h3>
          </CardHeader>
          <CardBody>
            <form>
              <h3>
                Getting Node Data
                <div className="lds-ellipsisIF">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </h3>
            </form>
          </CardBody>
          <br />
        </>
      )}
      {props.roots !== undefined && (
        <>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <span className="material-icons">dashboard_customize</span>
            </CardIcon>
            <Button
              color="info"
              className="MLBGradient"
              onClick={() => (window.location.href = "/#/user/node-manager")}
            >
              Go Back
            </Button>
            <h3 className={classes.cardIconTitle}>New Node</h3>
          </CardHeader>
          <CardBody>
            <form>
              {/* eslint-disable-next-line react/prop-types */}
              <>
                {!transactionActive && !transactionActiveID && (
                  <>
                    <h5 className="costsText">Cost: ü{props.currentACPrice}</h5>
                    <CustomInput
                      success={loginNameState === "success"}
                      error={loginNameState === "error"}
                      labelText="Name *"
                      id="name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: (event) => {
                          setName(event.target.value.trim());
                          if (event.target.value !== "") {
                            setloginNameState("success");
                          } else {
                            setloginNameState("error");
                          }
                          setloginName(event.target.value);
                        },
                      }}
                    />
                    <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <InputLabel>Select Root Node *</InputLabel>
                      <Select
                        MenuProps={{
                          className: classes.selectMenu,
                        }}
                        classes={{
                          select: classes.select,
                        }}
                        value={root}
                        onChange={(e) => {
                          rootLogin(e);
                        }}
                        inputProps={{
                          name: "rootSelect",
                          id: "root-select",
                        }}
                      >
                        {/* eslint-disable-next-line react/prop-types */}
                        {props.roots !== undefined &&
                          // eslint-disable-next-line react/prop-types
                          generateRootList(props.roots)}
                      </Select>
                    </FormControl>
                    <br />
                    <div className={classes.formCategory}>
                      <small>*</small> Required fields
                    </div>
                  </>
                )}
                {transactionActive && !transactionActiveID && (
                  <>
                    <CustomInput
                      labelText={name}
                      id="name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        disabled: true,
                      }}
                    />
                    <CustomInput
                      labelText={rootName}
                      id="root"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        disabled: true,
                      }}
                    />
                  </>
                )}
              </>
              {!transactionActive && !transactionActiveID && (
                <div className="MLBGradientSubmit">
                  <Button
                    color="info"
                    className="MLBGradient"
                    onClick={() => checkForAC()}
                  >
                    Purchase Node
                  </Button>
                </div>
              )}
              {transactionActive && !transactionActiveID && (
                <h3>
                  Purchasing Node
                  <div className="lds-ellipsisIF">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </h3>
              )}
              {transactionActiveID && (
                <h3>
                  Minting ID
                  <div className="lds-ellipsisIF">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </h3>
              )}
            </form>
          </CardBody>
        </>
      )}
    </Card>
  );
}
