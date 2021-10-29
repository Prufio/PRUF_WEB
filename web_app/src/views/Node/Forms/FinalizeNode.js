import React from "react";
import "../../../assets/css/custom.css";
import swal from "sweetalert";
import swalReact from "@sweetalert/with-react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Check from "@material-ui/icons/Check";
import { FiberManualRecordTwoTone } from "@material-ui/icons";

// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import {
  AssignmentTurnedIn,
  Category,
  CheckCircleOutline,
  KeyboardArrowLeft,
  Security,
  VerifiedUser,
  VpnKey,
} from "@material-ui/icons";
import ARweaveGreyPNG from "../../../assets/img/arweavegrey.png";
import ARweavePNG from "../../../assets/img/arweave.png";
import IPFSPNG from "../../../assets/img/ipfs.png";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

// import Step1 from "./NodeWizzard/Step1.js";
// import Step2 from "./NodeWizzard/Step2.js";
const useStyles = makeStyles(styles);

export default function FinalizeNode(props) {
  if (!window.sentPacket) window.sentPacket = {};

  const [transactionActive, setTransactionActive] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [txStatus, setTxStatus] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [txHash, setTxHash] = React.useState("");

  //   const [managementType, setManagementType] = React.useState("1");
  //   const [managementType1, setManagementType1] = React.useState(true);
  //   const [managementType2, setManagementType2] = React.useState(false);
  const [storageProvider, setstorageProvider] = React.useState("1");
  const [storageProvider1, setstorageProvider1] = React.useState(true);
  const [storageProvider2, setstorageProvider2] = React.useState(false);
  const [advancedNodePreferences, setAdvancedNodePreferences] =
    React.useState(2);
  const [advancedNodePreferences1, setAdvancedNodePreferences1] =
    React.useState(false);
  const [advancedNodePreferences2, setAdvancedNodePreferences2] =
    React.useState(false);
  const [advancedNodePreferences3, setAdvancedNodePreferences3] =
    React.useState(false);
  const [advancedNodePreferencesHover1, setAdvancedNodePreferencesHover1] =
    React.useState(false);
  const [advancedNodePreferencesHover2, setAdvancedNodePreferencesHover2] =
    React.useState(false);
  const [advancedNodePreferencesHover3, setAdvancedNodePreferencesHover3] =
    React.useState(false);
  const [card1, setCard1] = React.useState(true);
  const [card2, setCard2] = React.useState(false);
  //   const [card3, setCard3] = React.useState(false);

  const [nodeInfo] = React.useState(
    JSON.parse(JSON.stringify(window.sentPacket))
  );

  const link = document.createElement("div");
  document.body.style.cursor = "default";

  React.useEffect(() => {
    // eslint-disable-next-line react/prop-types
    // if (props.ps) {
    //   // eslint-disable-next-line react/prop-types
    //   props.ps.element.scrollTop = 0;
    //   //console.log("Scrolled to ", props.ps.element.scrollTop);
    // } else {
    //   window.scrollTo({ top: 0, behavior: "smooth" });
    //   document.documentElement.scrollTop = 0;
    //   document.scrollingElement.scrollTop = 0;
    // }
  }, []);

  const classes = useStyles();

  if (nodeInfo === undefined || nodeInfo === null) {
    console.log("No Node found. Rerouting...");
    window.location.href = "/#/user/home";
    window.location.reload();
  }

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return (window.location.href = "/#/user/home");
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  };

  const goBack = () => {
    window.backIndex = nodeInfo.dBIndex;
    window.location.href = nodeInfo.lastRef;
  };

  //   const setManagementType1Button = () => {
  //     setManagementType("1");
  //     setManagementType1(true);
  //     setManagementType2(false);
  //   };

  //   const setManagementType2Button = () => {
  //     setManagementType("2");
  //     setManagementType1(false);
  //     setManagementType2(true);
  //   };

  const setstorageProvider1Button = () => {
    setstorageProvider("1");
    setstorageProvider1(true);
    setstorageProvider2(false);
  };

  const setstorageProvider2Button = () => {
    setstorageProvider("2");
    setstorageProvider1(false);
    setstorageProvider2(true);
  };

  const hover1 = () => {
    setAdvancedNodePreferencesHover1(true);
    setAdvancedNodePreferencesHover2(false);
    setAdvancedNodePreferencesHover3(false);
  };

  const hover2 = () => {
    setAdvancedNodePreferencesHover1(false);
    setAdvancedNodePreferencesHover2(true);
    setAdvancedNodePreferencesHover3(false);
  };

  const hover3 = () => {
    setAdvancedNodePreferencesHover1(false);
    setAdvancedNodePreferencesHover2(false);
    setAdvancedNodePreferencesHover3(true);
  };

  const setNodePreferences = (pos) => {
    if (pos === 1 && advancedNodePreferences1 === true) {
      setAdvancedNodePreferences(Number(advancedNodePreferences - 2));
      setAdvancedNodePreferences1(false);
      console.log(advancedNodePreferences - 2);
    } else if (pos === 1 && advancedNodePreferences1 === false) {
      setAdvancedNodePreferences(Number(advancedNodePreferences + 2));
      setAdvancedNodePreferences1(true);
      console.log(advancedNodePreferences + 2);
    }

    if (pos === 2 && advancedNodePreferences2 === true) {
      setAdvancedNodePreferences(Number(advancedNodePreferences - 64));
      setAdvancedNodePreferences2(false);
      console.log(advancedNodePreferences - 64);
    } else if (pos === 2 && advancedNodePreferences2 === false) {
      setAdvancedNodePreferences(Number(advancedNodePreferences + 64));
      setAdvancedNodePreferences2(true);
      console.log(advancedNodePreferences + 64);
    }

    if (pos === 3 && advancedNodePreferences3 === true) {
      setAdvancedNodePreferences(Number(advancedNodePreferences - 128));
      setAdvancedNodePreferences3(false);
      console.log(advancedNodePreferences - 128);
    } else if (pos === 3 && advancedNodePreferences3 === false) {
      setAdvancedNodePreferences(Number(advancedNodePreferences + 128));
      setAdvancedNodePreferences3(true);
      console.log(advancedNodePreferences + 128);
    }
  };

  const nextCard = () => {
    // if (card1 === true) {
    //   setCard1(false);
    //   setCard2(true);
    // } else {
    //   setCard2(false);
    //   setCard3(true);
    // }
    console.log(advancedNodePreferences);
    setCard1(false);
    setCard2(true);
    // props.ps.element.scrollTop = 0;
  };

  const previousCard = () => {
    // if (card2 === true) {
    //   setCard2(false);
    //   setCard1(true);
    // } else {
    //   setCard3(false);
    //   setCard2(true);
    // }
    setCard2(false);
    setCard1(true);
    // props.ps.element.scrollTop = 0;
  };

  const finalizeNode = () => {
    //transfer held Node
    let tempTxHash;

    swalReact({
      icon: "warning",
      content: (
        <Card className="delegationCard">
          <h4 className="delegationTitle">
            Submitted information cannot be changed!
          </h4>
          <h5 className="finalizingTipsContent">
            Please make sure the following info is correct before submitting.
            These settings cannot be changed, and you can only finalize a node
            once!
          </h5>
          {/* <div className="delegationTips">
            <h4 className="alertText">
              Management Type: &nbsp;
              {managementType === "1" && <>Private</>}
              {managementType === "2" && <>Permissive</>}
            </h4>
          </div> */}
          <div className="delegationTips">
            <h4 className="alertText">
              Storage Type:
              {storageProvider === "1" && (
                <img src={IPFSPNG} className="IPFS2" alt="" />
              )}
              {storageProvider === "2" && (
                <img src={ARweavePNG} className="ARweave3" alt="" />
              )}
            </h4>
          </div>
          <div className="delegationTips">
            <h4 className="alertText">Advanced Node Data Selected:</h4>
          </div>
          {advancedNodePreferences1 === true && (
            <div className="delegationTips">
              <FiberManualRecordTwoTone className="delegationPin" />
              <h4 className="alertTextSm">
                Allow users to set their own permanent data to their assets.
              </h4>
            </div>
          )}
          {advancedNodePreferences2 === true && (
            <div className="delegationTips">
              <FiberManualRecordTwoTone className="delegationPin" />
              <h4 className="alertTextSm">
                Allow assigned addresses to be asset minters.
              </h4>
            </div>
          )}
          {advancedNodePreferences3 === true && (
            <div className="delegationTips">
              <FiberManualRecordTwoTone className="delegationPin" />
              <h4 className="alertTextSm">
                Allow assets to be minted to assigned asset minters.
              </h4>
            </div>
          )}
        </Card>
      ),
      buttons: {
        back: {
          text: "Go Back",
          className: "delegationButtonBack",
        },
        finalize: {
          text: "Finalize",
          className: "delegationButtonBack",
        },
      },
    }).then((value) => {
      switch (value) {
        case "finalize":
          setTransactionActive(true);
          const pageKey = thousandHashesOf(props.addr, props.winKey);

          props.prufClient.do.node
            .finalize(
              nodeInfo.id,
              "2",
              storageProvider,
              "0x0000000000000000000000000000000000000000",
              advancedNodePreferences
            )
            // eslint-disable-next-line react/prop-types
            .send({ from: props.addr })
            .on("error", function (_error) {
              setTransactionActive(false);
              setTxStatus(false);
              // setTxHash(Object.values(_error)[0].transactionHash) BS:EXAMINE
              tempTxHash = Object.values(_error)[0].transactionHash;
              let str1 =
                "Check out your TX <a href='https://kovan.etherscan.io/tx/";
              let str2 = "' target='_blank'>here</a>";
              link.innerHTML = String(str1 + tempTxHash + str2);
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
              let str1 =
                "Check out your TX <a href='https://kovan.etherscan.io/tx/";
              let str2 = "' target='_blank'>here</a>";
              link.innerHTML = String(str1 + tempTxHash + str2);
              swal({
                title: "Node Finalized!",
                content: link,
                icon: "success",
                button: "Close",
              });

              let newNodeInfo = JSON.parse(
                JSON.stringify(props.nodeExtData[nodeInfo.index])
              );
              let tempExtArr = JSON.parse(JSON.stringify(props.nodeExtData));

              newNodeInfo.storageProvider = storageProvider;
              newNodeInfo.managementType = "2";

              tempExtArr.splice(nodeInfo.index, 1, newNodeInfo);
              console.log({
                root: nodeInfo.root,
                id: nodeInfo.id,
                name: nodeInfo.name,
              });
              window.replaceAssetData = {
                key: pageKey,
                nodeList: {
                  extData: tempExtArr,
                  setAddition: {
                    root: nodeInfo.root,
                    id: nodeInfo.id,
                    name: nodeInfo.name,
                  },
                },
              };
              window.replaceAssetData.refreshBals = true;
              window.dispatchEvent(props.refresh);
              window.location.href = nodeInfo.lastRef;
            });

          break;

        case "back":
          break;

        default:
          break;
      }
    });
  };

  if (!props.prufClient) {
    return (
      <>
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack"></CardIcon>
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
    );
  }

  return (
    <Card className="finalizeNode">
      <CardHeader icon>
        <CardIcon className="headerIconBack">
          <Category />
        </CardIcon>
        <Button color="info" className="MLBGradient" onClick={() => goBack()}>
          Go Back
        </Button>
        <h4 className={classes.cardIconTitle}>
          Finalize Node: {nodeInfo.name}, ID: ({nodeInfo.id})
        </h4>
      </CardHeader>
      {/* {card1 && (
        <Card className="Slider">
          <CardHeader>
            <h2 className={classes.cardIconTitle}>Select Management Type</h2>
          </CardHeader>
          <GridContainer>
            <GridItem xs={12} sm={4}>
              {!managementType1 && (
                <Button
                  className="managementType"
                  color="info"
                  onClick={() => setManagementType1Button()}
                >
                  <VpnKey />
                  Private
                </Button>
              )}
              {managementType1 && (
                <Button
                  className="managementTypeSelected"
                  onClick={() => setManagementType1Button()}
                >
                  <VpnKey />
                  Private
                </Button>
              )}
              {!managementType2 && (
                <Button
                  className="managementType"
                  color="info"
                  onClick={() => setManagementType2Button()}
                >
                  <Security />
                  Permissive
                </Button>
              )}
              {managementType2 && (
                <Button
                  className="managementTypeSelected"
                  onClick={() => setManagementType2Button()}
                >
                  <Security />
                  Permissive
                </Button>
              )}
            </GridItem>
            <GridItem xs={12} sm={8}>
              <Card className="slide-right">
                {managementType1 && (
                  <>
                    <h3>Private</h3>
                    <p>Guaranteed exclusivity.</p>
                    <p>
                      The Private management type is by far the most secure.
                      With exclusive access to node operations, this type allows
                      only the node owner to create, export, or import assets
                      within the node. This enables a provably secure pattern
                      for asset minting. Best suited for creators and curators.
                    </p>
                  </>
                )}
                {managementType2 && (
                  <>
                    <h3>Permissive</h3>
                    <p>Flexibility.</p>
                    <p>
                      Much like the Private management type, Permissive
                      management allows only the node owner to mint or import
                      assets. This management type grants slightly more mobility
                      to asset holders by allowing them to export their assets
                      to other nodes.
                    </p>
                  </>
                )}
              </Card>
            </GridItem>
          </GridContainer>
        </Card>
      )} */}
      {card1 && (
        <Card>
          <CardHeader>
            <h2 className={classes.cardIconTitle}>Select Storage Provider</h2>
          </CardHeader>
          <GridContainer>
            <GridItem xs={12} sm={4}>
              {!storageProvider1 && (
                <Button
                  className="managementType"
                  color="info"
                  onClick={() => setstorageProvider1Button()}
                >
                  <img src={IPFSPNG} className="IPFS2" alt="" />
                </Button>
              )}
              {storageProvider1 && (
                <Button
                  className="managementTypeSelected"
                  onClick={() => setstorageProvider1Button()}
                >
                  <img src={IPFSPNG} className="IPFS2" alt="" />
                </Button>
              )}
              {!storageProvider2 && (
                <Button
                  className="managementType"
                  color="info"
                  onClick={() => setstorageProvider2Button()}
                >
                  <img src={ARweaveGreyPNG} className="ARweave3" alt="" />
                </Button>
              )}
              {storageProvider2 && (
                <Button
                  className="managementTypeSelected"
                  onClick={() => setstorageProvider2Button()}
                >
                  <img src={ARweaveGreyPNG} className="ARweave3" alt="" />
                </Button>
              )}
            </GridItem>
            <GridItem xs={12} sm={8}>
              <Card className="slide-right">
                {storageProvider1 && (
                  <>
                    <a
                      href="https://ipfs.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={IPFSPNG} className="IPFS3" alt=""></img>
                    </a>
                    <p>
                      The InterPlanetary File System (IPFS) is a protocol and
                      peer-to-peer network for storing and sharing data in a
                      distributed file system.
                    </p>
                  </>
                )}
                {storageProvider2 && (
                  <>
                    <a
                      href="https://www.arweave.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={ARweavePNG} className="ARweave4" alt=""></img>
                    </a>
                    <p>
                      A novel blockchain protocol enabling truly permanent data
                      storage. NOTE: ADVANCED USERS ONLY. YOU WILL NEED SPIN UP
                      A LOCAL ARWEAVE NODE.
                    </p>
                  </>
                )}
              </Card>
            </GridItem>
          </GridContainer>
        </Card>
      )}
      {card2 && (
        <Card>
          <CardHeader>
            <h2 className={classes.cardIconTitle}>Advanced Node Preferences</h2>
          </CardHeader>
          <GridContainer>
            <GridItem xs={12} sm={4}>
              <Card className="anpCard">
                <div className={classes.checkboxAndRadio} onMouseOver={hover1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => setNodePreferences(1)}
                        checked={
                          advancedNodePreferences1 === true ? true : false
                        }
                        className="bumpLeft"
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot,
                        }}
                      />
                    }
                    classes={{
                      label: classes.labelANP,
                      root: classes.labelRoot,
                    }}
                    label="Allow users to set their own permanent data."
                  />
                </div>
              </Card>
              <Card className="anpCard">
                <div className={classes.checkboxAndRadio} onMouseOver={hover2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        checked={
                          advancedNodePreferences2 === true ? true : false
                        }
                        className="bumpLeft"
                        onClick={() => setNodePreferences(2)}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot,
                        }}
                      />
                    }
                    classes={{
                      label: classes.labelANP,
                      root: classes.labelRoot,
                    }}
                    label="Delegate minting authority to other accounts."
                  />
                </div>
              </Card>
              <Card className="anpCard">
                <div className={classes.checkboxAndRadio} onMouseOver={hover3}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        checked={
                          advancedNodePreferences3 === true ? true : false
                        }
                        className="bumpLeft"
                        onClick={() => setNodePreferences(3)}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot,
                        }}
                      />
                    }
                    classes={{
                      label: classes.labelANP,
                      root: classes.labelRoot,
                    }}
                    label="Mint to delegated minters"
                  />
                </div>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={8}>
              <Card className="slide-right">
                {advancedNodePreferencesHover1 && (
                  <>
                    <h3>Allow users to set their own permanent data.</h3>
                    <p>
                      If this is left unchecked, all permanent data must be
                      added by the node holder while they still hold the token.
                      If this is set, assets minted without permanent data can
                      have it added later by the user. Once permanent data is
                      set, either by the Node holder or the user, it cannot be
                      changed.
                    </p>
                  </>
                )}
                {advancedNodePreferencesHover2 && (
                  <>
                    <h3>Delegate minting authority to other accounts.</h3>
                    <p>
                      If this is left unchecked, only the account that holds the
                      Node token can mint. If this is set, you must authorize
                      account(s) to mint tokens with this Node. With this set,
                      holding the node token alone will not allow minting. You
                      can approve or deauthorize as many addresses as you wish.
                    </p>
                  </>
                )}
                {advancedNodePreferencesHover3 && (
                  <>
                    <h3>Mint to delegated minters.</h3>
                    <p>
                      If this is left unchecked, all tokens minted with this
                      Node will be minted into the account that holds the Node
                      token. If this is set, delegated minters will receive the
                      tokens they mint into their own account.
                    </p>
                  </>
                )}
              </Card>
            </GridItem>
          </GridContainer>
        </Card>
      )}
      {!transactionActive && (
        <>
          {card1 && (
            <div className="MLBGradientSubmit">
              <Button className="MLBGradient" onClick={() => nextCard()} icon>
                Next <KeyboardArrowRight />{" "}
              </Button>
            </div>
          )}
          {/* {card2 && (
            <div className="MLBGradientSubmit">
              <Button
                className="MLBGradient"
                onClick={() => previousCard()}
                icon
              >
                {" "}
                <KeyboardArrowLeft />
                Back
              </Button>
              <Button className="MLBGradient" onClick={() => nextCard()} icon>
                Next <KeyboardArrowRight />{" "}
              </Button>
            </div>
          )} */}
          {card2 && (
            <div className="MLBGradientSubmit">
              <Button
                className="MLBGradient"
                onClick={() => finalizeNode()}
                icon
              >
                Finish <CheckCircleOutline />{" "}
              </Button>
              <Button
                className="MLBGradient"
                onClick={() => previousCard()}
                // icon
              >
                {/* {" "} */}
                <KeyboardArrowLeft />
                Back
              </Button>
            </div>
          )}
        </>
      )}
      {transactionActive && (
        <h3>
          Finalizing Node
          <div className="lds-ellipsisIF">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </h3>
      )}
    </Card>
  );
}
