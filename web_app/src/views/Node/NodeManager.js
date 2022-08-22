import React from "react";
import ChartistGraph from "react-chartist";
import "../../assets/css/custom.css";
import swalReact from "@sweetalert/with-react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Tooltip from "@material-ui/core/Tooltip";
import MenuItem from "@material-ui/core/MenuItem";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import { useCookies } from "react-cookie";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import ReactTable from "components/ReactTable/ReactTable.js";
import ReactTableSimple from "components/ReactTable/ReactTableSimple.js";
import CardFooter from "components/Card/CardFooter.js";
import TextField from "@material-ui/core/TextField";
import {
  AccountBalance,
  AccountBalanceWallet,
  BarChartRounded,
  Dashboard,
  FiberManualRecordTwoTone,
  ListAltRounded,
  MultilineChart,
  Settings,
  ShowChart,
  VpnKey,
} from "@material-ui/icons";
import Danger from "components/Typography/Danger";
import Pruf from "../../assets/img/pruftoken.png";
import { simpleBarChart, pieChart } from "variables/charts.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import chartStyles from "assets/jss/material-dashboard-pro-react/views/chartsStyle.js";
import selectStyles from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import { isMobile } from "react-device-detect";
// import { tooltip } from 'assets/jss/material-dashboard-pro-react'

// const styles = {
//   cardIconTitle: {
//     ...cardTitle,
//     marginTop: "15px",
//     marginBottom: "0px"
//   }
// };

const useStyles = makeStyles(styles);
const useChartStyles = makeStyles(chartStyles);
const useSelectStyles = makeStyles(selectStyles);

export default function NodeManager(props) {
  // eslint-disable-next-line no-unused-vars
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [dash, setDash] = React.useState(true);
  const [delegation, setDelegation] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [rewards, setRewards] = React.useState(true);
  // const [selectedNodeObj, setSelectedNodeObj] = React.useState({})
  const [totalRewards, setTotalRewards] = React.useState(false);
  const [delegationAmount, setDelegationAmount] = React.useState("");
  // const [actionState, setActionState] = React.useState({})
  const [forceReload] = React.useState(true);
  const [resetToDefault, setResetToDefault] = React.useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["nodeList"]);

  const [formChanged, setFormChanged] = React.useState(false);
  const [transactionActive, setTransactionActive] = React.useState(false);
  const [costPacket, setCostPacket] = React.useState({});
  const [operationIndex, setOperationIndex] = React.useState("");
  const [beneficiaryAddress, setBeneficiaryAddress] =
    React.useState(0x0000000000000000000000000000000000000000);
  const [loginOperationState, setloginOperationState] = React.useState({});
  const link = document.createElement("div");
  const selectClasses = useSelectStyles();
  const classes = useStyles();

  const [delegationList, setDelegationList] = React.useState([
    ["Loading Nodes...", "~", "~", "~"],
  ]);

  const actionInput = React.useRef();

  const thousandHashesOf = (varToHash) => {
    if (!window.web3.utils) return (window.location.href = "/#/user/home");
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  };

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
    //getNodesInWallet()
  }, []);

  const buildDelegationList = () => {
    let _delegationList = [];
    // eslint-disable-next-line react/prop-types
    if (!props.nodeSets || !props.rootNames) return;

    // eslint-disable-next-line react/prop-types
    for (let i = 0; i < Object.values(props.nodeSets).length; i++) {
      for (
        let x = 0;
        // eslint-disable-next-line react/prop-types
        x < Object.values(props.nodeSets)[i].length;
        x++
      ) {
        _delegationList.push([
          // eslint-disable-next-line react/prop-types
          props.rootNames[i],
          // <button onClick={() => handleSimple({ name: props.rootNames[i], index: key, href: "view", id: Object.values(props.nodeSets)[i][x].id })}>{props.rootNames[i]}</Button>,
          // eslint-disable-next-line react/prop-types
          Object.values(props.nodeSets)[i][x].name,
          // eslint-disable-next-line react/prop-types
          Object.values(props.nodeSets)[i][x].id,
          "N/A",
          "N/A",
        ]);
      }
    }

    setDelegationList(_delegationList);
  };
  // const [delegationData, setDelegationData] = React.useState(
  //   dataTable.dataRowsDelegation.map((prop, key) => {
  //     return {
  //       id: key,
  //       name: prop[0],
  //       nodeId: prop[1],
  //       totalStaked: prop[2],
  //       transactionsPerEpoch: prop[3],
  //       actions: (
  //         // we've added some custom button actions
  //         <div className="actions-right">
  //           {/* use this button to add a like kind of action */}
  //           <Button
  //             // justIcon
  //             // round
  //             simple
  //             onClick={() => {
  //               let obj = delegationData.find(o => o.id === key);
  //               alert(
  //                 "You've clicked LIKE button on \n{ \nName: " +
  //                 obj.name +
  //                 ", \nposition: " +
  //                 obj.position +
  //                 ", \noffice: " +
  //                 obj.office +
  //                 ", \nage: " +
  //                 obj.age +
  //                 "\n}."
  //               );
  //             }}
  //             color="info"
  //             className="like"
  //           >
  //             Delegate
  //           </Button>{" "}
  //         </div>
  //       )
  //     };
  //   })
  // );

  const setDashButton = () => {
    setDash(true);
    setDelegation(false);
    setAnalytics(false);
  };

  const setDelegationButton = () => {
    // setDash(false)
    // setDelegation(true)
    // setAnalytics(false)
    swalReact("Coming Soon!");
  };

  const setAnalyticsButton = () => {
    // setDash(false)
    // setDelegation(false)
    swalReact("Coming Soon!");
  };

  const setRewardsButton = () => {
    setRewards(true);
    setTotalRewards(false);
  };

  const setTotalRewardsButton = () => {
    setRewards(false);
    setTotalRewards(true);
  };

  const changeCosts = async (obj, tempObj, _beneficiaryAddress, iteration) => {
    console.log(obj);

    if (Object.values(obj.changedCosts).length === 0) {
      return swal("Costs not changed");
    }

    if (!tempObj) {
      Object.values(obj.changedCosts).forEach((cost) => {
        if (cost.value === "") cost.value = 0;
        if (obj[cost.id] === cost.value) {
          delete obj.changedCosts[cost.id];
        }
      });

      tempObj = obj.changedCosts;
    }

    if (!iteration) {
      iteration = 0;
    }

    if (!_beneficiaryAddress) {
      _beneficiaryAddress = obj.beneficiaryAddress;
    }

    if (!Object.values(tempObj)[iteration])
      return console.log("DONE CHANGING COSTS");

    let tempTxHash;

    if (!transactionActive) {
      setTransactionActive(true);
    }

    if (!window.web3.utils.isAddress(_beneficiaryAddress)) {
      return swal({
        title: "Submitted address is not a valid ethereum address!",
        // text: _beneficiaryAddress,
        text: "Please check form and input a valid ethereum address.",
        icon: "warning",
        button: "Close",
      });
    }

    setOperationIndex(Object.values(tempObj)[iteration].id);

    console.log(
      `Setting cost ${Object.values(tempObj)[iteration].id} to ${
        Object.values(tempObj)[iteration].value
      }`
    );

    let calculatedCost = await window.web3.utils.toWei(
      String(Object.values(tempObj)[iteration].value)
    );

    props.prufClient.faucet
      .setOperationCost(
        obj.id,
        Object.values(tempObj)[iteration].id,
        calculatedCost,
        _beneficiaryAddress
      )
      // eslint-disable-next-line react/prop-types
      .send({ from: props.addr })
      .on("error", (_error) => {
        setFormChanged(false);
        setBeneficiaryAddress("");
        setTransactionActive(false);
        console.error(_error);
        tempTxHash = Object.values(_error)[0].transactionHash;
        let str1 = `Check out your TX <a href='${props.explorer}'`;
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        // setError(Object.values(_error)[0]);
        if (tempTxHash !== undefined) {
          swalReact({
            title: "Something went wrong!",
            content: link,
            icon: "warning",
            button: "Close",
          });
        }
        if (tempTxHash === undefined) {
          swalReact({
            title: "Something went wrong!",
            icon: "warning",
            button: "Close",
          });
        }
        return changeCosts(obj, tempObj, _beneficiaryAddress, iteration + 1);
      })
      .on("receipt", (receipt) => {
        setTransactionActive(false);
        // setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash;
        let str1 = `Check out your TX <a href='${props.explorer}'`;
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        window.replaceAssetData.refreshBals = true;
        window.dispatchEvent(props.refresh);

        swalReact({
          title: `Changed cost of id ${
            Object.values(tempObj)[iteration].id
          } to ü${Object.values(tempObj)[iteration].value}`,
          content: link,
          icon: "success",
          button: "close",
        }).then(() => {
          return changeCosts(obj, tempObj, _beneficiaryAddress, iteration + 1);
        });
        // setTxHash(receipt.transactionHash);
      });
  };

  const viewNode = (e) => {
    console.log(e);
    if (!e) return;
    let index = e.index;
    document.body.style.cursor = "wait";
    let tempObj = {};
    console.log("props.nodeExtData", props.nodeExtData);

    // eslint-disable-next-line react/prop-types
    props.prufClient.get.node.name(props.nodeExtData[index].root).then((e) => {
      tempObj.name = props.nodeExtData[index].name;
      tempObj.id = props.nodeExtData[index].id;
      tempObj.rootName = e
        .toLowerCase()
        .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
      tempObj.root = props.nodeExtData[index].root;
      tempObj.usesAuth = props.nodeExtData[index].usesAuth;
      tempObj.storageProvider = props.nodeExtData[index].storageProvider;
      tempObj.managementType = props.nodeExtData[index].managementType;
      console.log("tempObj", tempObj);
      document.body.style.cursor = "auto";
      swalReact({
        content: (
          <Card className="delegationCard">
            <h4 className="delegationTitle">Node Information</h4>
            <div className="delegationTips">
              <FiberManualRecordTwoTone className="delegationPin" />
              <h5 className="delegationTipsContent">
                Name:&nbsp;{tempObj.name} ID:(
                {tempObj.id})
              </h5>
            </div>
            <div className="delegationTips">
              <FiberManualRecordTwoTone className="delegationPin" />
              <h5 className="delegationTipsContent">
                Root Node:&nbsp;
                {tempObj.rootName} ID:(
                {tempObj.root})
              </h5>
            </div>
            <div className="delegationTips">
              <FiberManualRecordTwoTone className="delegationPin" />
              <h5 className="delegationTipsContent">
                Management Type:&nbsp;
                {tempObj.managementType}
              </h5>
            </div>
            <div className="delegationTips">
              <FiberManualRecordTwoTone className="delegationPin" />
              <h5 className="delegationTipsContent">
                Storage Provider:&nbsp;
                {tempObj.storageProvider}
              </h5>
            </div>
          </Card>
        ),
        buttons: {
          close: {
            text: "Close",
            className: "delegationButtonBack",
          },
        },
      }).then((value) => {
        switch (value) {
          case "close":
            setResetToDefault("");
            break;

          default:
            break;
        }
      });
    });
  };

  const changeCostsSwal = (e) => {
    let index = e.index;
    let changedCosts = {};
    e.beneficiaryAddress = e.costs[1].beneficiary;
    // return console.log(e)
    swalReact({
      content: (
        <Card>
          <CardHeader icon>
            <h4 className={classes.cardIconTitle}>
              Change Node Operation Costs
            </h4>
          </CardHeader>
          <CardBody>
            <form>
              <h4>
                Node Selected: {props.nodeExtData[index].name}, (
                {props.nodeExtData[index].id})
              </h4>
              <>
                {Object.values(e.costs).map((prop, key) => {
                  // console.log(key, prop)
                  return (
                    <>
                      {!transactionActive ? (
                        <CustomInput
                          // success={loginOperationState[key + 1] === 'success'}
                          // error={loginOperationState[key + 1] === 'error'}
                          labelText={`Operation ${key + 1}`}
                          id={`cost${key + 1}`}
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            type: "number",
                            defaultValue: prop.node,
                            onChange: (e) => {
                              changedCosts[`${key + 1}`] = {
                                id: key + 1,
                                value: e.target.value,
                              };
                              console.log(changedCosts);
                            },
                          }}
                        />
                      ) : (
                        <CustomInput
                          labelText={`Operation ${key + 1}`}
                          id=""
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            defaultValue: prop.node,
                            disabled: true,
                          }}
                        />
                      )}
                    </>
                  );
                })}
                {!transactionActive ? (
                  <CustomInput
                    labelText="Beneficiary Address *"
                    id="beneficiaryAddress"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      defaultValue: e.costs[1].beneficiary,
                      onChange: (event) => {
                        // setFormChanged(true);
                        // setBeneficiaryAddress(event.target.value.trim());
                        e.formChanged = true;
                        e.beneficiaryAddress = event.target.value.trim();
                        // BeneficiaryAddress(event.target.value);
                      },
                    }}
                  />
                ) : (
                  <CustomInput
                    labelText="beneficiary Address *"
                    id=""
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      defaultValue: beneficiaryAddress,
                      disabled: true,
                    }}
                  />
                )}
                <div className={classes.formCategory}>
                  <small>*</small> Required fields
                </div>
              </>
            </form>
          </CardBody>
        </Card>
      ),
      buttons: {
        close: {
          text: "Close",
          // className: "delegationButtonBack",
        },
        updateCosts: {
          text: "Update Costs",
          className: "MLBGradient",
        },
      },
    }).then((value) => {
      switch (value) {
        case "close":
          setResetToDefault("");
          break;

        case "updateCosts":
          e.changedCosts = changedCosts;
          changeCosts(e);
          break;

        default:
          break;
      }
    });
  };

  const authorizeUser = async (e) => {
    let tempTxHash;
    console.log(e);
    let addressHash = await window.web3.utils.soliditySha3(e.authorizedAddress);

    setTransactionActive(true);
    props.prufClient.faucet
      .authorizeUser(e.id, addressHash, "1")
      // eslint-disable-next-line react/prop-types
      .send({ from: props.addr })
      .on("error", (_error) => {
        setTransactionActive(false);
        // setTxStatus(false)
        // setTxHash(Object.values(_error)[0].transactionHash)
        console.error(_error);
        tempTxHash = Object.values(_error)[0].transactionHash;
        let str1 = `Check out your TX <a href='${props.explorer}'`;
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        if (tempTxHash !== undefined) {
          swalReact({
            title: "Something went wrong!",
            content: link,
            icon: "warning",
            button: "Close",
          });
        }
        if (tempTxHash === undefined) {
          swalReact({
            title: "Something went wrong!",
            icon: "warning",
            button: "Close",
          });
        }
      })
      .on("receipt", (receipt) => {
        console.log(receipt);
        setTransactionActive(false);
        // setTxStatus(receipt.status)
        tempTxHash = receipt.transactionHash;
        let str1 = `Check out your TX <a href='${props.explorer}'`;
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        swalReact({
          title: "User Authorized!",
          content: link,
          icon: "success",
          button: "Close",
        });
        // window.replaceAssetData.refreshBals = true
        window.dispatchEvent(props.refresh);
        // window.location.href = nodeInfo.lastRef
      });
  };

  const transferNode = async (e) => {
    let tempTxHash;
    console.log(e);

    setTransactionActive(true);
    props.prufClient.do.node
      .transfer(props.addr, e.address, e.id)
      // eslint-disable-next-line react/prop-types
      .send({ from: props.addr })
      .on("error", (_error) => {
        setTransactionActive(false);
        // setTxStatus(false)
        // setTxHash(Object.values(_error)[0].transactionHash)
        console.error(_error);
        tempTxHash = Object.values(_error)[0].transactionHash;
        let str1 = `Check out your TX <a href='${props.explorer}'`;
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        if (tempTxHash !== undefined) {
          swalReact({
            title: "Something went wrong!",
            content: link,
            icon: "warning",
            button: "Close",
          });
        }
        if (tempTxHash === undefined) {
          swalReact({
            title: "Something went wrong!",
            icon: "warning",
            button: "Close",
          });
        }
      })
      .on("receipt", (receipt) => {
        console.log(receipt);
        setTransactionActive(false);
        // setTxStatus(receipt.status)
        tempTxHash = receipt.transactionHash;
        let str1 = `Check out your TX <a href='${props.explorer}'`;
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        swalReact({
          title: "Node Transferred!",
          content: link,
          icon: "success",
          button: "Close",
        });
        // window.replaceAssetData.refreshBals = true
        window.dispatchEvent(props.refresh);
        // window.location.href = nodeInfo.lastRef
      });
  };

  const transferNodeSwal = (e) => {
    let index = e.index;
    // let authorizedAddress
    // return console.log(e)
    swalReact({
      content: (
        <Card>
          <CardHeader icon>
            <h4 className={classes.cardIconTitle}>Transfer Node</h4>
          </CardHeader>
          <CardBody>
            <form>
              <h4>
                Node Selected: {props.nodeExtData[index].name}, (
                {props.nodeExtData[index].id})
              </h4>
              {!transactionActive ? (
                <CustomInput
                  labelText={"To"}
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      console.log(event.target.value);
                      e.address = event.target.value;
                    },
                  }}
                />
              ) : (
                <CustomInput
                  labelText={"To"}
                  id=""
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    defaultValue: e.address,
                    disabled: true,
                  }}
                />
              )}
              <div className={classes.formCategory}></div>
            </form>
          </CardBody>
        </Card>
      ),
      buttons: {
        close: {
          text: "Close",
          // className: "delegationButtonBack",
        },
        transfer: {
          text: "Transfer Node",
          className: "MLBGradient",
        },
      },
    }).then(async (value) => {
      switch (value) {
        case "close":
          // setResetToDefault("");
          break;

        case "transfer":
          let isAddress = await window.web3.utils.isAddress(e.address);
          if (!isAddress) {
            return swalReact({
              title: "Submitted address is not valid!",
              text: "Please check form and input a valid ethereum address.",
              icon: "warning",
              button: "Close",
            });
          }
          swalReact({
            icon: "warning",
            content: (
              <Card className="delegationCard">
                <h4 className="delegationTitle">
                  Submitted information is critical!
                </h4>
                <h5 className="finalizingTipsContent">
                  Please make sure the following account is correct before
                  submitting!
                </h5>
                <div className="delegationTips">
                  <h4 className="alertText">
                    Recieving Address:{" "}
                    {` ${e.address.substring(0, 8)}...${e.address.substring(
                      34
                    )}`}
                  </h4>
                </div>
              </Card>
            ),
            buttons: {
              back: {
                text: "Go Back",
                className: "delegationButtonBack",
              },
              authorize: {
                text: "Transfer",
                className: "delegationButtonBack",
              },
            },
          }).then((value) => {
            switch (value) {
              case "back":
                break;
              case "authorize":
                transferNode(e);
              // break;
              default:
                break;
            }
          });
          break;

        default:
          break;
      }
    });
  };

  const authorizeUserSwal = (e) => {
    let index = e.index;
    // let authorizedAddress
    // return console.log(e)
    swalReact({
      content: (
        <Card>
          <CardHeader icon>
            <h4 className={classes.cardIconTitle}>Authorize address to mint</h4>
          </CardHeader>
          <CardBody>
            <form>
              <h4>
                Node Selected: {props.nodeExtData[index].name}, (
                {props.nodeExtData[index].id})
              </h4>
              {!transactionActive ? (
                <CustomInput
                  labelText={"Address"}
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    onChange: (event) => {
                      console.log(event.target.value);
                      e.authorizedAddress = event.target.value;
                    },
                  }}
                />
              ) : (
                <CustomInput
                  labelText={"Address"}
                  id=""
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    defaultValue: e.authorizedAddress,
                    disabled: true,
                  }}
                />
              )}
              <div className={classes.formCategory}></div>
            </form>
          </CardBody>
        </Card>
      ),
      buttons: {
        close: {
          text: "Close",
          // className: "delegationButtonBack",
        },
        authAddr: {
          text: "Authorize Address",
          className: "MLBGradient",
        },
      },
    }).then(async (value) => {
      switch (value) {
        case "close":
          // setResetToDefault("");
          break;

        case "authAddr":
          let isAddress = await window.web3.utils.isAddress(
            e.authorizedAddress
          );
          if (!isAddress) {
            return swalReact({
              title: "Submitted address is not valid!",
              text: "Please check form and input a valid ethereum address.",
              icon: "warning",
              button: "Close",
            });
          }
          swalReact({
            icon: "warning",
            content: (
              <Card className="delegationCard">
                <h4 className="delegationTitle">
                  Submitted information is critical!
                </h4>
                <h5 className="finalizingTipsContent">
                  Please make sure the following account is correct before
                  submitting!
                </h5>
                <div className="delegationTips">
                  <h4 className="alertText">
                    User:{" "}
                    {` ${e.authorizedAddress.substring(
                      0,
                      8
                    )}...${e.authorizedAddress.substring(34)}`}
                  </h4>
                </div>
              </Card>
            ),
            buttons: {
              back: {
                text: "Go Back",
                className: "delegationButtonBack",
              },
              authorize: {
                text: "Authorize User",
                className: "delegationButtonBack",
              },
            },
          }).then((value) => {
            switch (value) {
              case "back":
                break;
              case "authorize":
                authorizeUser(e);
                break;
              default:
                break;
            }
          });
          break;

        default:
          break;
      }
    });
  };

  const handleSimple = (e) => {
    if(!e) return
    let index = e.index;

    // console.log(document.getElementById(`simpleSelectDefault${index}`))
    // document.getElementById(`simpleSelectDefault${index}`).reset()

    switch (e.value) {
      case "change-costs":
        getAllCosts(e);
        break;
      case "authorize-user":
        authorizeUserSwal(e);
        break;
      case "transfer-node":
        transferNodeSwal(e);
        break;
      case "finalize":
        document.body.style.cursor = "wait";
        // eslint-disable-next-line react/prop-types
        if (props.ps) {
          // eslint-disable-next-line react/prop-types
          props.ps.element.scrollTop = 0;
          //console.log(props.ps.element.scrollTop)
        }
        let tempObj = JSON.parse(JSON.stringify(e));
        tempObj.lastRef = "/#/user/node-manager";
        tempObj.root = props.nodeExtData[index].root;
        tempObj.id = props.nodeExtData[index].id;
        tempObj.name = props.nodeExtData[index].name;
        tempObj.custodyType = props.nodeExtData[index].custodyType;
        tempObj.usesAuth = props.nodeExtData[index].usesAuth;
        tempObj.discount = props.nodeExtData[index].discount;
        tempObj.referenceAddress = props.nodeExtData[index].referenceAddress;
        tempObj.index = index;
        window.sentPacket = JSON.parse(JSON.stringify(e));
        console.log(e);
        console.log(window.sentPacket);
        // setSimpleSelect(obj);
        return (window.location.href = "/#/user/finalize-node");
        break;
      default:
        break;
    }
  };

  const clearNodeCookies = () => {
    swalReact({
      icon: "warning",
      title: "Are you sure?",
      text: "⚠️ Clearing the cache will cause the page to refresh.",
      buttons:{
        back:{
          text: "⬅️ Go Back",
          value: "back",
          className: "delegationButtonBack",
        },
        clear:{
          text: "Clear Cache 🗑️",
          value: "clear",
          className: "delegationButtonBack",
        }
      }
    }).then(value=>{
      if(value==="clear"){
        removeCookie(`${props.addr}${props.prufClient.network.name}roots`)
        removeCookie(`${props.addr}${props.prufClient.network.name}subNodes`)
        removeCookie(`${props.addr}${props.prufClient.network.name}dontCount`)
        window.location.reload()
      } 
    })
  }

  const getAllCosts = (obj, costs, iteration) => {
    if (!obj) return;
    if (!costs) costs = {};
    if (!iteration) iteration = 1;

    if (iteration > 8) {
      obj.costs = costs;
      console.log("In GETALLCOSTS", obj);
      // console.log(window.sentPacket);
      setSimpleSelect(obj);
      return changeCostsSwal(obj);
      // return obj
    }

    props.prufClient.get.node
      .invoiceForOperation(String(obj.id), String(iteration))
      .then((e) => {
        costs[`${iteration}`] = e;
        return getAllCosts(obj, costs, iteration + 1);
      });
  };

  const handleDelegation = (e) => {
    // eslint-disable-next-line react/prop-types
    if (props.ps) {
      // eslint-disable-next-line react/prop-types
      props.ps.element.scrollTop = 0;
      //console.log(props.ps.element.scrollTop)
    }

    swalReact({
      content: (
        <Card className="delegationCard">
          <h4 className="delegationTitle">Delegation Confirmation</h4>
          <div className="delegationTips">
            <FiberManualRecordTwoTone className="delegationPin" />
            <h5 className="delegationTipsContent">
              You can delegate to as many nodes as you want.
            </h5>
          </div>
          <div className="delegationTips">
            <FiberManualRecordTwoTone className="delegationPin" />
            <h5 className="delegationTipsContent">
              You can un-delegate at any time.
            </h5>
          </div>
          <div className="delegationInfoSec">
            <h4 className="delegationInfo">Node Name :</h4>
            <h4>{e.name}</h4>
          </div>
          <div className="delegationInfoSec">
            <h4 className="delegationInfo">Node ID :</h4>
            <h4>{e.id}</h4>
          </div>
          <span className="currencyDignifier"> = PRüF</span>
          <TextField
            onChange={(e) => {
              setDelegationAmount(e.target.value);
            }}
            id="outlined-full-width"
            label="Amount"
            // eslint-disable-next-line react/prop-types
            defaultValue={Number(props.pruf).toFixed(2)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
          <TextField
            // onChange={(e) => { handleName(e.target.value) }}
            id="outlined-full-width"
            label="Password"
            // defaultValue={newAssetInfo.name}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
        </Card>
      ),
      buttons: {
        back: {
          text: "Back",
          value: "back",
          className: "delegationButtonBack",
        },
        delete: {
          text: "Delegate",
          value: "delegate",
          className: "delegationButtonDelegate",
        },
      },
    }).then((value) => {
      switch (value) {
        case "delegate":
          // eslint-disable-next-line react/prop-types
          if (delegationAmount > props.pruf) {
            return swalReact("Insufficient Balance.");
          }
          swalReact("Delegation Set!");
          break;

        case "back":
          break;

        default:
          return;
      }
    });
  };
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader icon className="nodeHeader">
            <CardIcon className="headerIconBack">
              <AccountBalance />
            </CardIcon>
            <div className="flexRowWide">
              <h4 className={classes.cardIconTitle}>Node Manager</h4>
              <Button onClick={()=>{clearNodeCookies()}} className="MLBGradient">Refresh Node Cache</Button>
            </div>
            {dash && (
              <Button className="nodeButtonActive">
                <Dashboard />
                Dashboard
              </Button>
            )}
            {!dash && (
              <Button
                className="nodeButton"
                onClick={() => {
                  setDashButton(true);
                }}
              >
                <Dashboard />
                Dashboard
              </Button>
            )}
            {analytics && (
              <Button className="nodeButtonActive">
                <BarChartRounded />
                Analytics
              </Button>
            )}
            {!analytics && (
              <Button
                className="nodeButton"
                onClick={() => {
                  setAnalyticsButton(true);
                }}
              >
                <BarChartRounded />
                Analytics
              </Button>
            )}
            {delegation && (
              <Button className="nodeButtonActive">
                <ListAltRounded />
                Delegation List
              </Button>
            )}
            {!delegation && (
              <Button
                className="nodeButton"
                onClick={() => {
                  setDelegationButton(true);
                }}
              >
                <ListAltRounded />
                Delegation List
              </Button>
            )}
          </CardHeader>
          {/* <br/> */}
        </Card>
        <Card>
          <CardBody>
            {dash && !delegation && !analytics && !isMobile && (
              <ReactTableSimple
                columns={[
                  {
                    Header: "Name",
                    accessor: "name",
                  },
                  {
                    Header: "Node ID",
                    accessor: "nodeId",
                  },
                  {
                    Header: "Total Delegated",
                    accessor: "totalDelegated",
                  },
                  {
                    Header: "Transaction Count",
                    accessor: "transactionsPerEpoch",
                  },
                  {
                    Header: "Actions",
                    accessor: "actions",
                  },
                ]}
                data={props.heldNodeData.map((prop, key) => {
                  return {
                    id: key,
                    name:
                      prop[0] === "No nodes held by user" ||
                      prop[0] === "" ||
                      prop[0] === "Loading Nodes..." ? (
                        prop[0]
                      ) : (
                        <button
                          className="nodeButton2"
                          onClick={() =>
                            viewNode({
                              name: prop[0],
                              index: key,
                              href: "view",
                            })
                          }
                        >{` ${prop[0]} `}</button>
                      ),
                    nodeId: prop[1],
                    totalDelegated: prop[2],
                    transactionsPerEpoch: prop[3],
                    actions: (
                      // we've added some custom button actions
                      <div className="actions-right">
                        {/* use this button to add a like kind of action */}

                        {prop[0] === "No nodes held by user" && (
                          <Button
                            simple
                            onClick={() => {
                              window.location.href = "/#/user/create-node";
                            }}
                            color="info"
                            className="like"
                          >
                            Create Node
                          </Button>
                        )}
                        {prop[0] === "Loading Nodes..." && (
                          <Button
                            disabled
                            simple
                            onClick={() => {
                              window.location.href = "/#/user/create-node";
                            }}
                            color="info"
                            className="like"
                          >
                            Create Node
                          </Button>
                        )}
                        {prop[0] === "" && (
                          <Button
                            simple
                            onClick={() => {
                              window.location.href = "/#/user/create-node";
                            }}
                            color="info"
                            className="like"
                          >
                            Create Node
                          </Button>
                        )}
                        {prop[0] !== "No nodes held by user" &&
                          prop[0] !== "Loading Nodes..." &&
                          prop[0] !== "" && (
                            <form>
                              <FormControl className="nodeOptions">
                                <InputLabel className="functionSelectorText">
                                  <Danger>
                                    <Settings className="functionSelectorIcon" />
                                  </Danger>
                                  Options
                                </InputLabel>
                                <Select
                                  MenuProps={{
                                    className: selectClasses.selectMenu,
                                  }}
                                  classes={{
                                    select: selectClasses.select,
                                  }}
                                  onChange={(e) => {
                                    handleSimple({
                                      name: prop[0],
                                      id: prop[1],
                                      index: key,
                                      value: e.target.value,
                                    })
                                  }
                                  }
                                  inputProps={{
                                    value: "",
                                    name: "simpleSelect",
                                    id: `simpleSelectDefault${key}`,
                                  }}
                                >
                                  <MenuItem
                                    id={`selectDefault${key}`}
                                    disabled
                                    classes={{
                                      root: selectClasses.selectMenuItem,
                                    }}
                                  >
                                    Select an option from the list
                                  </MenuItem>
                                  {/* <MenuItem
                                    id="ChangeName"
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected,
                                    }}
                                    value={"/#/user/change-name"}
                                  >
                                    Change Name
                                  </MenuItem> */}
                                  {/* <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected,
                                    }}
                                    value={"/#/user/change-node-data"}
                                  >
                                    Update Data
                                  </MenuItem> */}
                                  <MenuItem
                                    id={`changecosts${key}`}
                                    classes={{
                                      root: selectClasses.selectMenuItem,
                                      selected:
                                        selectClasses.selectMenuItemSelected,
                                    }}
                                    value={"change-costs"}
                                  >
                                    Update Operation Costs
                                  </MenuItem>
                                  {props.nodeExtData[key] &&
                                    props.nodeExtData[key].usesAuth ===
                                      true && (
                                      <MenuItem
                                        id={`authuser${key}`}
                                        classes={{
                                          root: selectClasses.selectMenuItem,
                                          selected:
                                            selectClasses.selectMenuItemSelected,
                                        }}
                                        value={"authorize-user"}
                                      >
                                        Authorize User Access
                                      </MenuItem>
                                    )}
                                  <MenuItem
                                    id={`transfer${key}`}
                                    classes={{
                                      root: selectClasses.selectMenuItem,
                                      selected:
                                        selectClasses.selectMenuItemSelected,
                                    }}
                                    value={"transfer-node"}
                                  >
                                    Transfer Node
                                  </MenuItem>
                                  {props.nodeExtData[key] &&
                                    props.nodeExtData[key].managementType ===
                                      "255" && (
                                      <MenuItem
                                        id={`finalize${key}`}
                                        classes={{
                                          root: selectClasses.selectMenuItem,
                                          selected:
                                            selectClasses.selectMenuItemSelected,
                                        }}
                                        value={"finalize"}
                                      >
                                        Finalize
                                      </MenuItem>
                                    )}
                                </Select>
                              </FormControl>
                            </form>
                          )}
                      </div>
                    ),
                  };
                })}
              />
            )}
            {dash && !delegation && !analytics && isMobile && (
              <ReactTableSimple
                columns={[
                  {
                    Header: "Name",
                    accessor: "name",
                  },
                  {
                    Header: "Actions",
                    accessor: "actions",
                  },
                ]}
                data={props.heldNodeData.map((prop, key) => {
                  return {
                    id: key,
                    name:
                      prop[0] === "No nodes held by user" ||
                      prop[0] === "" ||
                      prop[0] === "Loading Nodes..." ? (
                        prop[0]
                      ) : (
                        <button
                          className="nodeButton2"
                          onClick={() =>
                            viewNode({
                              name: prop[0],
                              index: key,
                              href: "view",
                            })
                          }
                        >{` ${prop[0]} `}</button>
                      ),
                    actions: (
                      // we've added some custom button actions
                      <div className="actions-right">
                        {/* use this button to add a like kind of action */}

                        {prop[0] === "No nodes held by user" && (
                          <Button
                            simple
                            onClick={() => {
                              window.location.href = "/#/user/create-node";
                            }}
                            color="info"
                            className="like"
                          >
                            Create Node
                          </Button>
                        )}
                        {prop[0] === "Loading Nodes..." && (
                          <Button
                            disabled
                            simple
                            onClick={() => {
                              window.location.href = "/#/user/create-node";
                            }}
                            color="info"
                            className="like"
                          >
                            Create Node
                          </Button>
                        )}
                        {prop[0] === "" && (
                          <Button
                            simple
                            onClick={() => {
                              window.location.href = "/#/user/create-node";
                            }}
                            color="info"
                            className="like"
                          >
                            Create Node
                          </Button>
                        )}
                        {prop[0] !== "No nodes held by user" &&
                          prop[0] !== "Loading Nodes..." &&
                          prop[0] !== "" && (
                            <form>
                              <FormControl className="nodeOptions">
                                <InputLabel className="functionSelectorText">
                                  <Danger>
                                    <Settings className="functionSelectorIcon" />
                                  </Danger>
                                  Options
                                </InputLabel>
                                <Select
                                  MenuProps={{
                                    className: selectClasses.selectMenu,
                                  }}
                                  classes={{
                                    select: selectClasses.select,
                                  }}
                                  onChange={(e) => {
                                    handleSimple({
                                      name: prop[0],
                                      id: prop[1],
                                      index: key,
                                      value: e.target.value,
                                    })
                                  }
                                  }
                                  inputProps={{
                                    value: "",
                                    name: "simpleSelect",
                                    id: `simpleSelectDefault${key}`,
                                  }}
                                >
                                  <MenuItem
                                    id={`selectDefault${key}`}
                                    disabled
                                    classes={{
                                      root: selectClasses.selectMenuItem,
                                    }}
                                  >
                                    Select an option from the list
                                  </MenuItem>
                                  {/* <MenuItem
                                    id="ChangeName"
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected,
                                    }}
                                    value={"/#/user/change-name"}
                                  >
                                    Change Name
                                  </MenuItem> */}
                                  {/* <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected,
                                    }}
                                    value={"/#/user/change-node-data"}
                                  >
                                    Update Data
                                  </MenuItem> */}
                                  <MenuItem
                                    id={`changecosts${key}`}
                                    classes={{
                                      root: selectClasses.selectMenuItem,
                                      selected:
                                        selectClasses.selectMenuItemSelected,
                                    }}
                                    value={"change-costs"}
                                  >
                                    Update Operation Costs
                                  </MenuItem>
                                  {props.nodeExtData[key] &&
                                    props.nodeExtData[key].usesAuth ===
                                      true && (
                                      <MenuItem
                                        id={`authuser${key}`}
                                        classes={{
                                          root: selectClasses.selectMenuItem,
                                          selected:
                                            selectClasses.selectMenuItemSelected,
                                        }}
                                        value={"authorize-user"}
                                      >
                                        Authorize User Access
                                      </MenuItem>
                                    )}
                                  <MenuItem
                                    id={`transfer${key}`}
                                    classes={{
                                      root: selectClasses.selectMenuItem,
                                      selected:
                                        selectClasses.selectMenuItemSelected,
                                    }}
                                    value={"transfer-node"}
                                  >
                                    Transfer Node
                                  </MenuItem>
                                  {props.nodeExtData[key] &&
                                    props.nodeExtData[key].managementType ===
                                      "255" && (
                                      <MenuItem
                                        id={`finalize${key}`}
                                        classes={{
                                          root: selectClasses.selectMenuItem,
                                          selected:
                                            selectClasses.selectMenuItemSelected,
                                        }}
                                        value={"finalize"}
                                      >
                                        Finalize
                                      </MenuItem>
                                    )}
                                </Select>
                              </FormControl>
                            </form>
                          )}
                      </div>
                    ),
                  };
                })}
              />
            )}
            {!dash && delegation && !analytics && (
              <ReactTable
                columns={[
                  {
                    Header: "Root",
                    accessor: "root",
                  },
                  {
                    Header: "Name",
                    accessor: "name",
                  },
                  {
                    Header: "Node ID",
                    accessor: "nodeId",
                  },
                  {
                    Header: "Total Delegated",
                    accessor: "totalStaked",
                  },
                  {
                    Header: "Transaction Count",
                    accessor: "transactionsPerEpoch",
                  },
                  {
                    Header: "Actions",
                    accessor: "actions",
                  },
                ]}
                data={delegationList.map((prop, key) => {
                  return {
                    id: key,
                    root: prop[0],
                    name: prop[1],
                    nodeId: prop[2],
                    totalStaked: prop[3],
                    transactionsPerEpoch: prop[4],
                    actions: (
                      // we've added some custom button actions
                      <div className="actions-right">
                        {/* use this button to add a like kind of action */}
                        {prop[0] !== "Loading Nodes..." && (
                          <Button
                            // justIcon
                            // round
                            // simple
                            onClick={() => {
                              handleDelegation({
                                name: prop[1],
                                id: prop[2],
                                totalDelegated: prop[3],
                              });
                            }}
                            color="info"
                            className="delegateButton"
                          >
                            Delegate
                          </Button>
                        )}
                        {prop[0] === "Loading Nodes..." && (
                          <Button
                            disabled
                            onClick={() => {
                              handleDelegation({
                                name: prop[1],
                                id: prop[2],
                                totalDelegated: prop[3],
                              });
                            }}
                            color="info"
                            className="delegateButton"
                          >
                            Delegate
                          </Button>
                        )}
                      </div>
                    ),
                  };
                })}
              />
            )}
            {!dash && !delegation && analytics && (
              <>
                <GridContainer>
                  <GridItem xs={12} sm={6} md={6} lg={4}>
                    <Card>
                      <CardHeader color="danger" stats icon>
                        <CardIcon className="headerIconBack">
                          <img className="Icon" src={Pruf} alt=""></img>
                        </CardIcon>
                        <p className={classes.cardCategory}>PRüF Balance</p>
                        <h3 className={classes.cardTitle}>
                          {/* eslint-disable-next-line react/prop-types */}
                          {props.pruf !== "~" ? (
                            <>
                              {String(
                                Math.round(
                                  Number(
                                    // eslint-disable-next-line react/prop-types
                                    props.pruf
                                  ) * 100
                                ) / 100
                              )}{" "}
                              <small>PRüF</small>
                            </>
                          ) : (
                            <>
                              {/* eslint-disable-next-line react/prop-types */}
                              {props.pruf} <small>PRüF</small>
                            </>
                          )}
                        </h3>
                        {/* <h3 className={classes.cardTitle}>
                        <small>PRüF</small>
                    </h3> */}
                      </CardHeader>
                      <CardFooter stats>
                        {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                      </CardFooter>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6} lg={4}>
                    <Card>
                      <CardHeader color="danger" stats icon>
                        <CardIcon className="headerIconBack">
                          <AccountBalanceWallet />
                        </CardIcon>
                        <p className={classes.cardCategory}>Total Rewards</p>
                        {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                        <h3 className={classes.cardTitle}>
                          0 <small>PRüF</small>
                        </h3>
                      </CardHeader>
                      <CardFooter stats>
                        {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                      </CardFooter>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6} lg={4}>
                    <Card>
                      <CardHeader color="danger" stats icon>
                        <CardIcon className="headerIconBack">
                          <VpnKey />
                        </CardIcon>
                        <p className={classes.cardCategory}>Total Delegated</p>
                        {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                        <h3 className={classes.cardTitle}>
                          0 <small>PRüF</small>
                        </h3>
                      </CardHeader>
                      <CardFooter stats>
                        {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                      </CardFooter>
                    </Card>
                  </GridItem>
                </GridContainer>
                {/* <Card className="rewardsHistorySlider"> */}
                <GridContainer>
                  <GridItem xs={12} sm={6} md={6} lg={3}>
                    <Card>
                      <CardHeader>
                        <p className={classes.cardCategory}>Epoch xxx</p>
                        {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                      </CardHeader>
                      <CardFooter stats>
                        {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                      </CardFooter>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6} lg={3}>
                    <Card>
                      <CardHeader>
                        <p className={classes.cardCategory}>Epoch xxx</p>
                        {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                      </CardHeader>
                      <CardFooter stats>
                        {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                      </CardFooter>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6} lg={3}>
                    <Card>
                      <CardHeader>
                        <p className={classes.cardCategory}>Epoch xxx</p>
                        {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                      </CardHeader>
                      <CardFooter stats>
                        {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                      </CardFooter>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6} md={6} lg={3}>
                    <Card>
                      <CardHeader>
                        <p className={classes.cardCategory}>Epoch xxx</p>
                        {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                      </CardHeader>
                      <CardFooter stats>
                        {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                      </CardFooter>
                    </Card>
                  </GridItem>
                </GridContainer>
                {/* </Card> */}
                {rewards && (
                  <Button className="nodeButtonSmActive">
                    <ShowChart />
                    Rewards
                  </Button>
                )}
                {!rewards && (
                  <Button
                    className="nodeButtonSm"
                    onClick={() => {
                      setRewardsButton(true);
                    }}
                  >
                    <ShowChart />
                    Rewards
                  </Button>
                )}
                {totalRewards && (
                  <Button className="nodeButtonSmActive">
                    <MultilineChart />
                    Total Rewards
                  </Button>
                )}
                {!totalRewards && (
                  <Button
                    className="nodeButtonSm"
                    onClick={() => {
                      setTotalRewardsButton(true);
                    }}
                  >
                    <MultilineChart />
                    Total Rewards
                  </Button>
                )}
                <GridContainer>
                  <GridItem xs={12} sm={12} md={7}>
                    <Card chart>
                      <CardHeader color="info">
                        <ChartistGraph
                          className="ct-chart-white-colors"
                          data={simpleBarChart.data}
                          type="Bar"
                          options={simpleBarChart.options}
                          responsiveOptions={simpleBarChart.responsiveOptions}
                          listener={simpleBarChart.animation}
                        />
                      </CardHeader>
                      <br />
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={5}>
                    <Card>
                      <CardHeader>
                        <h4 className={chartClasses.cardIconTitle}>
                          Total Delegation Distribution
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <ChartistGraph
                          data={pieChart.data}
                          type="Pie"
                          options={pieChart.options}
                        />
                      </CardBody>
                      <CardFooter stats className={chartClasses.cardFooter}>
                        <h6 className={chartClasses.legendTitle}>Legend</h6>
                        <i
                          className={"fas fa-circle " + chartClasses.info}
                        />{" "}
                        Transportation(Sporting){` `}
                        <i
                          className={"fas fa-circle " + chartClasses.warning}
                        />{" "}
                        Collectables(Art)
                        {` `}
                        <i
                          className={"fas fa-circle " + chartClasses.danger}
                        />{" "}
                        Apparel(Shoes)
                        {` `}
                      </CardFooter>
                    </Card>
                  </GridItem>
                </GridContainer>
              </>
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
