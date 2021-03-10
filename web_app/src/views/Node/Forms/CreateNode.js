import React from "react";
import "../../../assets/css/custom.css";
import swal from 'sweetalert';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Accordion from "components/Accordion/Accordion.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import cardStyles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { CeckCircleOutline, CheckCircleOutline, GroupAdd } from "@material-ui/icons";
import { Component } from "react";
import placeholder from "../../../assets/img/placeholder.jpg";
import placeholderCheck from "../../../assets/img/placeholderCheck.jpg";
import Success from "components/Typography/Success";

const useStyles = makeStyles(styles);
const useCardStyles = makeStyles(cardStyles);

export default function CreateNode(props) {

  //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

  const [transactionActive, setTransactionActive] = React.useState(false);

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const [mintedID, setMintedID] = React.useState(false);
  const [selectedRootID, setSelectedRootID] = React.useState("");
  const [advanced, setAdvanced] = React.useState(false)

  const [name, setName] = React.useState("");
  const [root, setRoot] = React.useState("");
  const [ipfs, setIPFS] = React.useState("");

  const [loginName, setloginName] = React.useState("");
  const [loginIPFS, setloginIPFS] = React.useState("");
  const [loginRoot, setloginRoot] = React.useState("");

  const [loginNameState, setloginNameState] = React.useState("");
  const [loginIPFSState, setloginIPFSState] = React.useState("");
  const [loginRootState, setloginRootState] = React.useState("");

  const [standard1, setStandard1] = React.useState(true);
  const [standard2, setStandard2] = React.useState(false);
  const [standard3, setStandard3] = React.useState(false);

  const [locked1, setLocked1] = React.useState(true);
  const [locked2, setLocked2] = React.useState(true);
  const [locked3, setLocked3] = React.useState(true);
  const [locked4, setLocked4] = React.useState(true);
  const [locked5, setLocked5] = React.useState(true);
  const [locked6, setLocked6] = React.useState(true);
  const [locked7, setLocked7] = React.useState(true);
  const [locked8, setLocked8] = React.useState(true);

  const [operation1, setOperation1] = React.useState("0");
  const [operation2, setOperation2] = React.useState("0");
  const [operation3, setOperation3] = React.useState("0");
  const [operation4, setOperation4] = React.useState("0");
  const [operation5, setOperation5] = React.useState("0");
  const [operation6, setOperation6] = React.useState("0");
  const [operation7, setOperation7] = React.useState("0");
  const [operation8, setOperation8] = React.useState("0");
  const [beneficiaryAddress1, setBeneficiaryAddress1] = React.useState(props.addr);
  const [beneficiaryAddress2, setBeneficiaryAddress2] = React.useState(props.addr);
  const [beneficiaryAddress3, setBeneficiaryAddress3] = React.useState(props.addr);
  const [beneficiaryAddress4, setBeneficiaryAddress4] = React.useState(props.addr);
  const [beneficiaryAddress5, setBeneficiaryAddress5] = React.useState(props.addr);
  const [beneficiaryAddress6, setBeneficiaryAddress6] = React.useState(props.addr);
  const [beneficiaryAddress7, setBeneficiaryAddress7] = React.useState(props.addr);
  const [beneficiaryAddress8, setBeneficiaryAddress8] = React.useState(props.addr);

  const [loginOperation1, setloginOperation1] = React.useState("");
  const [loginOperation2, setloginOperation2] = React.useState("");
  const [loginOperation3, setloginOperation3] = React.useState("");
  const [loginOperation4, setloginOperation4] = React.useState("");
  const [loginOperation5, setloginOperation5] = React.useState("");
  const [loginOperation6, setloginOperation6] = React.useState("");
  const [loginOperation7, setloginOperation7] = React.useState("");
  const [loginOperation8, setloginOperation8] = React.useState("");

  const [loginBeneficiaryAddress1, setloginBeneficiaryAddress1] = React.useState("");
  const [loginBeneficiaryAddress2, setloginBeneficiaryAddress2] = React.useState("");
  const [loginBeneficiaryAddress3, setloginBeneficiaryAddress3] = React.useState("");
  const [loginBeneficiaryAddress4, setloginBeneficiaryAddress4] = React.useState("");
  const [loginBeneficiaryAddress5, setloginBeneficiaryAddress5] = React.useState("");
  const [loginBeneficiaryAddress6, setloginBeneficiaryAddress6] = React.useState("");
  const [loginBeneficiaryAddress7, setloginBeneficiaryAddress7] = React.useState("");
  const [loginBeneficiaryAddress8, setloginBeneficiaryAddress8] = React.useState("");

  const [loginOperation1State, setloginOperation1State] = React.useState("");
  const [loginOperation2State, setloginOperation2State] = React.useState("");
  const [loginOperation3State, setloginOperation3State] = React.useState("");
  const [loginOperation4State, setloginOperation4State] = React.useState("");
  const [loginOperation5State, setloginOperation5State] = React.useState("");
  const [loginOperation6State, setloginOperation6State] = React.useState("");
  const [loginOperation7State, setloginOperation7State] = React.useState("");
  const [loginOperation8State, setloginOperation8State] = React.useState("");

  const [loginBeneficiaryAddress1State, setloginBeneficiaryAddress1State] = React.useState("");
  const [loginBeneficiaryAddress2State, setloginBeneficiaryAddress2State] = React.useState("");
  const [loginBeneficiaryAddress3State, setloginBeneficiaryAddress3State] = React.useState("");
  const [loginBeneficiaryAddress4State, setloginBeneficiaryAddress4State] = React.useState("");
  const [loginBeneficiaryAddress5State, setloginBeneficiaryAddress5State] = React.useState("");
  const [loginBeneficiaryAddress6State, setloginBeneficiaryAddress6State] = React.useState("");
  const [loginBeneficiaryAddress7State, setloginBeneficiaryAddress7State] = React.useState("");
  const [loginBeneficiaryAddress8State, setloginBeneficiaryAddress8State] = React.useState("");

  const [nodeInfo,] = React.useState(window.sentPacket)

  const link = document.createElement('div')

  window.sentPacket = null

  const classes = useStyles();
  const cardClasses = useCardStyles();

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    }
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }

  }, [])

  // const generateRootList = (arr) => {
  //   let rootNames = props.rootNames
  //   let rootSelection = [
  //     <MenuItem
  //       disabled
  //       key={"keySelClass"}
  //       classes={{
  //         root: classes.selectMenuItem
  //       }}
  //     >
  //       Select a Class
  //     </MenuItem>
  //   ];

  //   for (let i = 0; i < arr.length; i++) {
  //     rootSelection.push(
  //       <MenuItem
  //         key={"key" + String(arr[i])}
  //         classes={{
  //           root: classes.selectMenuItem,
  //           selected: classes.selectMenuItemSelected
  //         }}
  //         value={String(arr[i])}
  //       >
  //         {rootNames[i]}
  //       </MenuItem>
  //     );

  //   }

  //   return rootSelection;

  // }

  const rootLogin = (e) => {

    if (!e.target.value) return setRoot("")
    if (!props.IDHolder && !mintedID) {
      IDHolderPrompt()
    }

    else {
      setRoot(e.target.value)
      setSelectedRootID(e.target.value)
    }
  }


  const IDHolderPrompt = () => {

    if (!props.addr) {
      return swal({
        title: "Could not get user address",
        icon: "warning",
        text: "Please connect to an Ethereum provider and try again.",
        buttons: {
          close: {
            text: "close",
            value: "close"
          }
        },
      })
    }
    let tempTxHash;

    swal({
      title: "In order to mint asset tokens, you must first have an ID token.",
      icon: "warning",
      text: "If you would like to mint an ID token, please select Yes",
      buttons: {
        yes: {
          text: "Yes",
          value: "yes"
        },
        no: {
          text: "No",
          value: "no"
        }
      },
    })
      .then((value) => {
        switch (value) {

          case "yes":
            setTransactionActive(true)

            const pageKey = thousandHashesOf(props.addr, props.winKey)

            window.contracts.PARTY.methods
              .GET_ID()
              .send({ from: props.addr })
              .on("error", function (_error) {
                setTransactionActive(false);
                setTxStatus(false);
                setTxHash(Object.values(_error)[0].transactionHash);
                tempTxHash = Object.values(_error)[0].transactionHash;
                let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
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
                let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
                let str2 = "' target='_blank'>here</a>";
                link.innerHTML = String(str1 + tempTxHash + str2);
                swal({
                  title: "ID Token Minted!",
                  content: link,
                  icon: "success",
                  button: "Close"
                }).then(() => {
                  window.replaceAssetData = { IDHolder: true }
                  setMintedID(true)
                })
              })

            break;

          case "no":
            break;

          default:
            break;
        }
      });


  }

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return window.location.href = "/#/user/home"
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  }

  const setStandard = (standard) => {
    switch (standard) {
      case ("1"): {
        setStandard1(true);
        setStandard2(false);
        setStandard3(false);
        break
      }
      case ("2"): {
        setStandard1(false);
        setStandard2(true);
        setStandard3(false);
        break
      }
      case ("3"): {
        setStandard1(false);
        setStandard2(false);
        setStandard3(true);
        break
      }
      default: {
        console.log("Error in standard switch")
      }
    }
  }

  const setLayout = () => {
    let component = [];
    component.push(
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart className={cardClasses.cardHover} onClick={() => setStandard("1")}>
            <CardHeader image icon className={cardClasses.cardHeaderHoverDashboard}>
              {standard1 && (
                <img title="View Asset" src={placeholderCheck} alt="" />
              )}
              {!standard1 && (
                <img title="View Asset" src={placeholder} alt="" />
              )}
            </CardHeader>
            <CardBody>
              Standard 1
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart className={cardClasses.cardHover} onClick={() => setStandard("2")}>
            <CardHeader image className={cardClasses.cardHeaderHoverDashboard}>
              {standard2 && (
                <img title="View Asset" src={placeholderCheck} alt="" />
              )}
              {!standard2 && (
                <img title="View Asset" src={placeholder} alt="" />
              )}
            </CardHeader>
            <CardBody>
              Standard 2
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart className={cardClasses.cardHover} onClick={() => setStandard("3")}>
            <CardHeader image className={cardClasses.cardHeaderHoverDashboard}>
              {standard3 && (
                <img title="View Asset" src={placeholderCheck} alt="" />
              )}
              {!standard3 && (
                <img title="View Asset" src={placeholder} alt="" />
              )}
            </CardHeader>
            <CardBody>
              Standard 3
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
    return component
  }

  const setPricing = () => {
    let component = [];
    component.push(
      <Card className="pricingCard">
        <CustomInput
          success={loginOperation1State === "success"}
          error={loginOperation1State === "error"}
          labelText="Operation 1 *"
          id="operation1"
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: "number",
            defaultValue: window.web3.utils.fromWei(operation1),
            onChange: event => {
              setOperation1(event.target.value.trim())
              if (event.target.value !== "") {
                setloginOperation1State("success");
              } else {
                setloginOperation1State("error");
              }
              setloginOperation1(event.target.value);
            },
          }}
        />
        <div className="beneficiaryAddressCheckbox">

          <FormControlLabel
            control={
              <Checkbox
                tabIndex={-1}
                onClick={() => setLocked1(!locked1)}
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
            label="Edit Beneficiary"
          />
          {locked1 && (
            <CustomInput
              success={loginBeneficiaryAddress1State === "success"}
              error={loginBeneficiaryAddress1State === "error"}
              labelText="Beneficiary Address 1"
              id="beneficiaryAddress1"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                disabled: "true",
                defaultValue: beneficiaryAddress1,
              }}
            />
          )}
          {!locked1 && (
            <CustomInput
              success={loginBeneficiaryAddress1State === "success"}
              error={loginBeneficiaryAddress1State === "error"}
              labelText="Beneficiary Address 1"
              id="beneficiaryAddress1"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                defaultValue: beneficiaryAddress1,
                onChange: event => {
                  setBeneficiaryAddress1(event.target.value.trim())
                  if (event.target.value !== "") {
                    setloginBeneficiaryAddress1State("success");
                  } else {
                    setloginBeneficiaryAddress1State("error");
                  }
                  setloginBeneficiaryAddress1(event.target.value);
                },
              }}
            />
          )}
        </div>
        <br />
        <br />
        <CustomInput
          success={loginOperation2State === "success"}
          error={loginOperation2State === "error"}
          labelText="Operation 2 *"
          id="operation2"
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: "number",
            defaultValue: window.web3.utils.fromWei(operation2),
            onChange: event => {
              setOperation2(event.target.value.trim())
              if (event.target.value !== "") {
                setloginOperation2State("success");
              } else {
                setloginOperation2State("error");
              }
              setloginOperation2(event.target.value);
            },
          }}
        />

        <div className="beneficiaryAddressCheckbox">

          <FormControlLabel
            control={
              <Checkbox
                tabIndex={-1}
                onClick={() => setLocked2(!locked2)}
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
            label="Edit Beneficiary"
          />
          {locked2 && (
            <CustomInput
              success={loginBeneficiaryAddress2State === "success"}
              error={loginBeneficiaryAddress2State === "error"}
              labelText="Beneficiary Address 2"
              id="beneficiaryAddress2"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                disabled: "true",
                defaultValue: beneficiaryAddress2,
              }}
            />
          )}
          {!locked2 && (
            <CustomInput
              success={loginBeneficiaryAddress2State === "success"}
              error={loginBeneficiaryAddress2State === "error"}
              labelText="Beneficiary Address 2"
              id="beneficiaryAddress2"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                defaultValue: beneficiaryAddress2,
                onChange: event => {
                  setBeneficiaryAddress2(event.target.value.trim())
                  if (event.target.value !== "") {
                    setloginBeneficiaryAddress2State("success");
                  } else {
                    setloginBeneficiaryAddress2State("error");
                  }
                  setloginBeneficiaryAddress2(event.target.value);
                },
              }}
            />
          )}
        </div>
        <CustomInput
          success={loginOperation3State === "success"}
          error={loginOperation3State === "error"}
          labelText="Operation 3 *"
          id="operation3"
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: "number",
            defaultValue: window.web3.utils.fromWei(operation3),
            onChange: event => {
              setOperation3(event.target.value.trim())
              if (event.target.value !== "") {
                setloginOperation3State("success");
              } else {
                setloginOperation3State("error");
              }
              setloginOperation3(event.target.value);
            },
          }}
        />

        <div className="beneficiaryAddressCheckbox">

          <FormControlLabel
            control={
              <Checkbox
                tabIndex={-1}
                onClick={() => setLocked3(!locked3)}
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
            label="Edit Beneficiary"
          />
          {locked3 && (
            <CustomInput
              success={loginBeneficiaryAddress3State === "success"}
              error={loginBeneficiaryAddress3State === "error"}
              labelText="Beneficiary Address 3"
              id="beneficiaryAddress3"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                disabled: "true",
                defaultValue: beneficiaryAddress3,
              }}
            />
          )}
          {!locked3 && (
            <CustomInput
              success={loginBeneficiaryAddress3State === "success"}
              error={loginBeneficiaryAddress3State === "error"}
              labelText="Beneficiary Address 3"
              id="beneficiaryAddress3"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                defaultValue: beneficiaryAddress3,
                onChange: event => {
                  setBeneficiaryAddress3(event.target.value.trim())
                  if (event.target.value !== "") {
                    setloginBeneficiaryAddress3State("success");
                  } else {
                    setloginBeneficiaryAddress3State("error");
                  }
                  setloginBeneficiaryAddress3(event.target.value);
                },
              }}
            />
          )}
        </div>
        <CustomInput
          success={loginOperation4State === "success"}
          error={loginOperation4State === "error"}
          labelText="Operation 4 *"
          id="operation4"
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: "number",
            defaultValue: window.web3.utils.fromWei(operation4),
            onChange: event => {
              setOperation4(event.target.value.trim())
              if (event.target.value !== "") {
                setloginOperation4State("success");
              } else {
                setloginOperation4State("error");
              }
              setloginOperation4(event.target.value);
            },
          }}
        />

        <div className="beneficiaryAddressCheckbox">

          <FormControlLabel
            control={
              <Checkbox
                tabIndex={-1}
                onClick={() => setLocked4(!locked4)}
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
            label="Edit Beneficiary"
          />
          {locked4 && (
            <CustomInput
              success={loginBeneficiaryAddress4State === "success"}
              error={loginBeneficiaryAddress4State === "error"}
              labelText="Beneficiary Address 4"
              id="beneficiaryAddress4"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                disabled: "true",
                defaultValue: beneficiaryAddress4,
              }}
            />
          )}
          {!locked4 && (
            <CustomInput
              success={loginBeneficiaryAddress4State === "success"}
              error={loginBeneficiaryAddress4State === "error"}
              labelText="Beneficiary Address 4"
              id="beneficiaryAddress4"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                defaultValue: beneficiaryAddress4,
                onChange: event => {
                  setloginBeneficiaryAddress4(event.target.value.trim())
                  if (event.target.value !== "") {
                    setloginBeneficiaryAddress4State("success");
                  } else {
                    setloginBeneficiaryAddress4State("error");
                  }
                  setloginBeneficiaryAddress4(event.target.value);
                },
              }}
            />
          )}
        </div>
        <CustomInput
          success={loginOperation5State === "success"}
          error={loginOperation5State === "error"}
          labelText="Operation 5 *"
          id="operation5"
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: "number",
            defaultValue: window.web3.utils.fromWei(operation5),
            onChange: event => {
              setOperation5(event.target.value.trim())
              if (event.target.value !== "") {
                setloginOperation5State("success");
              } else {
                setloginOperation5State("error");
              }
              setloginOperation5(event.target.value);
            },
          }}
        />

        <div className="beneficiaryAddressCheckbox">

          <FormControlLabel
            control={
              <Checkbox
                tabIndex={-1}
                onClick={() => setLocked5(!locked5)}
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
            label="Edit Beneficiary"
          />
          {locked5 && (
            <CustomInput
              success={loginBeneficiaryAddress5State === "success"}
              error={loginBeneficiaryAddress5State === "error"}
              labelText="Beneficiary Address 5"
              id="beneficiaryAddress5"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                disabled: "true",
                defaultValue: beneficiaryAddress5,
              }}
            />
          )}
          {!locked5 && (
            <CustomInput
              success={loginBeneficiaryAddress5State === "success"}
              error={loginBeneficiaryAddress5State === "error"}
              labelText="Beneficiary Address 5"
              id="beneficiaryAddress5"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                defaultValue: beneficiaryAddress5,
                onChange: event => {
                  setBeneficiaryAddress5(event.target.value.trim())
                  if (event.target.value !== "") {
                    setloginBeneficiaryAddress5State("success");
                  } else {
                    setloginBeneficiaryAddress5State("error");
                  }
                  setloginBeneficiaryAddress5(event.target.value);
                },
              }}
            />
          )}
        </div>
        <CustomInput
          success={loginOperation6State === "success"}
          error={loginOperation6State === "error"}
          labelText="Operation 6 *"
          id="operation6"
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: "number",
            defaultValue: window.web3.utils.fromWei(operation6),
            onChange: event => {
              setOperation6(event.target.value.trim())
              if (event.target.value !== "") {
                setloginOperation6State("success");
              } else {
                setloginOperation6State("error");
              }
              setloginOperation6(event.target.value);
            },
          }}
        />

        <div className="beneficiaryAddressCheckbox">

          <FormControlLabel
            control={
              <Checkbox
                tabIndex={-1}
                onClick={() => setLocked6(!locked6)}
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
            label="Edit Beneficiary"
          />
          {locked6 && (
            <CustomInput
              success={loginBeneficiaryAddress6State === "success"}
              error={loginBeneficiaryAddress6State === "error"}
              labelText="Beneficiary Address 6"
              id="beneficiaryAddress6"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                disabled: "true",
                defaultValue: beneficiaryAddress6,
              }}
            />
          )}
          {!locked6 && (
            <CustomInput
              success={loginBeneficiaryAddress6State === "success"}
              error={loginBeneficiaryAddress6State === "error"}
              labelText="Beneficiary Address 6"
              id="beneficiaryAddress6"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                defaultValue: beneficiaryAddress6,
                onChange: event => {
                  setBeneficiaryAddress6(event.target.value.trim())
                  if (event.target.value !== "") {
                    setloginBeneficiaryAddress6State("success");
                  } else {
                    setloginBeneficiaryAddress6State("error");
                  }
                  setloginBeneficiaryAddress6(event.target.value);
                },
              }}
            />
          )}
        </div>
        <CustomInput
          success={loginOperation7State === "success"}
          error={loginOperation7State === "error"}
          labelText="Operation 7 *"
          id="operation7"
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: "number",
            defaultValue: window.web3.utils.fromWei(operation7),
            onChange: event => {
              setOperation7(event.target.value.trim())
              if (event.target.value !== "") {
                setloginOperation7State("success");
              } else {
                setloginOperation7State("error");
              }
              setloginOperation7(event.target.value);
            },
          }}
        />

        <div className="beneficiaryAddressCheckbox">

          <FormControlLabel
            control={
              <Checkbox
                tabIndex={-1}
                onClick={() => setLocked7(!locked7)}
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
            label="Edit Beneficiary"
          />
          {locked7 && (
            <CustomInput
              success={loginBeneficiaryAddress7State === "success"}
              error={loginBeneficiaryAddress7State === "error"}
              labelText="Beneficiary Address 7"
              id="beneficiaryAddress7"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                disabled: "true",
                defaultValue: beneficiaryAddress7,
              }}
            />
          )}
          {!locked7 && (
            <CustomInput
              success={loginBeneficiaryAddress7State === "success"}
              error={loginBeneficiaryAddress7State === "error"}
              labelText="Beneficiary Address 7"
              id="beneficiaryAddress7"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                defaultValue: beneficiaryAddress7,
                onChange: event => {
                  setBeneficiaryAddress7(event.target.value.trim())
                  if (event.target.value !== "") {
                    setloginBeneficiaryAddress7State("success");
                  } else {
                    setloginBeneficiaryAddress7State("error");
                  }
                  setloginBeneficiaryAddress7(event.target.value);
                },
              }}
            />
          )}
        </div>
        <CustomInput
          success={loginOperation8State === "success"}
          error={loginOperation8State === "error"}
          labelText="Operation 8 *"
          id="operation8"
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            type: "number",
            defaultValue: window.web3.utils.fromWei(operation8),
            onChange: event => {
              setOperation8(event.target.value.trim())
              if (event.target.value !== "") {
                setloginOperation8State("success");
              } else {
                setloginOperation8State("error");
              }
              setloginOperation8(event.target.value);
            },
          }}
        />

        <div className="beneficiaryAddressCheckbox">

          <FormControlLabel
            control={
              <Checkbox
                tabIndex={-1}
                onClick={() => setLocked8(!locked8)}
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
            label="Edit Beneficiary"
          />
          {locked8 && (
            <CustomInput
              success={loginBeneficiaryAddress8State === "success"}
              error={loginBeneficiaryAddress8State === "error"}
              labelText="Beneficiary Address 8"
              id="beneficiaryAddress8"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                disabled: "true",
                defaultValue: beneficiaryAddress8,
              }}
            />
          )}
          {!locked8 && (
            <CustomInput
              success={loginBeneficiaryAddress8State === "success"}
              error={loginBeneficiaryAddress8State === "error"}
              labelText="Beneficiary Address 8"
              id="beneficiaryAddress8"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                defaultValue: beneficiaryAddress8,
                onChange: event => {
                  setBeneficiaryAddress8(event.target.value.trim())
                  if (event.target.value !== "") {
                    setloginBeneficiaryAddress8State("success");
                  } else {
                    setloginBeneficiaryAddress8State("error");
                  }
                  setloginBeneficiaryAddress8(event.target.value);
                },
              }}
            />
          )}
        </div>
      </Card>
    );
    return component
  }


  const purchaseNode = async () => { //import held asset

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    await window.contracts.AC_MGR.methods
      .purchaseACnode(
        nodeInfo.idxHash,
      )
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransactionActive(false);
        setTxStatus(false);
        setTxHash(Object.values(_error)[0].transactionHash);
        tempTxHash = Object.values(_error)[0].transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
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
        tempTxHash = receipt.transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setTxHash(receipt.transactionHash);
        swal({
          title: "Owner Change Successful!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(() => {
          //refreshBalances()
          window.backIndex = nodeInfo.dBIndex;
          window.location.href = nodeInfo.ipfsRef;
        })
      });

    let op1 = window.web3.utils.toWei(operation1);
    let op2 = window.web3.utils.toWei(operation2);
    let op3 = window.web3.utils.toWei(operation3);
    let op4 = window.web3.utils.toWei(operation4);
    let op5 = window.web3.utils.toWei(operation5);
    let op6 = window.web3.utils.toWei(operation6);
    let op7 = window.web3.utils.toWei(operation7);
    let op8 = window.web3.utils.toWei(operation8);

    if (loginOperation1 !== "" && loginBeneficiaryAddress1 !== "") {
      if (!window.web3.utils.isAddress(beneficiaryAddress1)) {
        return swal({
          title: "Submitted address is not valid!",
          text: "Please check form and input a valid ethereum address.",
          icon: "warning",
          button: "Close",
        });
      }
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "1",
          op1,
          beneficiaryAddress1
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation1 !== "" && loginBeneficiaryAddress1 === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "1",
          op1,
          beneficiaryAddress1
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation2 !== "" && loginBeneficiaryAddress2 !== "") {
      if (!window.web3.utils.isAddress(beneficiaryAddress2)) {
        return swal({
          title: "Submitted address is not valid!",
          text: "Please check form and input a valid ethereum address.",
          icon: "warning",
          button: "Close",
        });
      }
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "2",
          op2,
          beneficiaryAddress2
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation2 !== "" && loginBeneficiaryAddress2 === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "2",
          op2,
          beneficiaryAddress2
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation3 !== "" && loginBeneficiaryAddress3 !== "") {
      if (!window.web3.utils.isAddress(beneficiaryAddress3)) {
        return swal({
          title: "Submitted address is not valid!",
          text: "Please check form and input a valid ethereum address.",
          icon: "warning",
          button: "Close",
        });
      }
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "3",
          op3,
          beneficiaryAddress3
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation3 !== "" && loginBeneficiaryAddress3 === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "3",
          op3,
          beneficiaryAddress3
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation4 !== "" && loginBeneficiaryAddress4 !== "") {
      if (!window.web3.utils.isAddress(beneficiaryAddress4)) {
        return swal({
          title: "Submitted address is not valid!",
          text: "Please check form and input a valid ethereum address.",
          icon: "warning",
          button: "Close",
        });
      }
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "4",
          op4,
          beneficiaryAddress4
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation4 !== "" && loginBeneficiaryAddress4 === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "4",
          op4,
          beneficiaryAddress4
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation5 !== "" && loginBeneficiaryAddress5 !== "") {
      if (!window.web3.utils.isAddress(beneficiaryAddress5)) {
        return swal({
          title: "Submitted address is not valid!",
          text: "Please check form and input a valid ethereum address.",
          icon: "warning",
          button: "Close",
        });
      }
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "5",
          op5,
          beneficiaryAddress5
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation5 !== "" && loginBeneficiaryAddress5 === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "5",
          op5,
          beneficiaryAddress5
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation6 !== "" && loginBeneficiaryAddress6 !== "") {
      if (!window.web3.utils.isAddress(beneficiaryAddress6)) {
        return swal({
          title: "Submitted address is not valid!",
          text: "Please check form and input a valid ethereum address.",
          icon: "warning",
          button: "Close",
        });
      }
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "6",
          op6,
          beneficiaryAddress6
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation6 !== "" && loginBeneficiaryAddress6 === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "6",
          op6,
          beneficiaryAddress6
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation7 !== "" && loginBeneficiaryAddress7 !== "") {
      if (!window.web3.utils.isAddress(beneficiaryAddress7)) {
        return swal({
          title: "Submitted address is not valid!",
          text: "Please check form and input a valid ethereum address.",
          icon: "warning",
          button: "Close",
        });
      }
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "7",
          op7,
          beneficiaryAddress7
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation7 !== "" && loginBeneficiaryAddress7 === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "7",
          op7,
          beneficiaryAddress7
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation8 !== "" && loginBeneficiaryAddress8 !== "") {
      if (!window.web3.utils.isAddress(beneficiaryAddress8)) {
        return swal({
          title: "Submitted address is not valid!",
          text: "Please check form and input a valid ethereum address.",
          icon: "warning",
          button: "Close",
        });
      }
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "8",
          op8,
          beneficiaryAddress8
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

    if (loginOperation8 !== "" && loginBeneficiaryAddress8 === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "8",
          op8,
          beneficiaryAddress8
        )
        .send({ from: props.addr })
        .on("error", function (_error) {
          setTransactionActive(false);
          setTxStatus(false);
          setTxHash(Object.values(_error)[0].transactionHash);
          tempTxHash = Object.values(_error)[0].transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
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
          tempTxHash = receipt.transactionHash
          let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
          let str2 = "' target='_blank'>here</a>"
          link.innerHTML = String(str1 + tempTxHash + str2)
          setTxHash(receipt.transactionHash);
          swal({
            title: "Cost Change Successful!",
            content: link,
            icon: "success",
            button: "Close",
          })
        });
    }

  }

  return (
    <Card>
      <CardHeader icon>
        <CardIcon className="headerIconBack">
          <span class="material-icons">
            dashboard_customize
</span>
        </CardIcon>
        <Button color="info" className="MLBGradient" onClick={() => window.location.href = "/#/user/node-manager"}>Go Back</Button>
        <h4 className={classes.cardIconTitle}>Configure New Node</h4>
      </CardHeader>
      <CardBody>
        <form>
          <h5>Current Node Price: {props.currentACPrice}</h5>
          <>
            {!transactionActive && (
              <>
                <CustomInput
                  success={loginNameState === "success"}
                  error={loginNameState === "error"}
                  labelText="Name *"
                  id="name"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => {
                      setName(event.target.value.trim())
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
                  <InputLabel
                  >
                    Select Asset Class *
                  </InputLabel>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    classes={{
                      select: classes.select
                    }}
                    value={root}
                    onChange={(e) => { rootLogin(e) }}
                    inputProps={{
                      name: "rootSelect",
                      id: "root-select"
                    }}
                  >
                    {/* {generateRootList(props.roots)} */}
                  </Select>
                </FormControl>
                <div className={classes.formCategory}>
                  <small>*</small> Required fields
                    </div>

                <div className={classes.checkboxAndRadio}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => setAdvanced(!advanced)}
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
                    label="Advanced Options (Optional)"
                  />
                </div>
                {advanced && (
                  <Card>
                    <CardHeader>
                      <h4 className={classes.cardTitle}>Advanced Options</h4>
                    </CardHeader>
                    <CardBody>
                      <Accordion
                        // active={0}
                        collapses={[
                          {
                            title: "Set Pricing (Optional)",
                            content:
                              setPricing()
                          },
                          {
                            title: "Select Class Layout (Optional)",
                            content:
                              setLayout()
                          }
                        ]}
                      />
                    </CardBody>
                  </Card>
                )}
              </>
            )}
            {transactionActive && (
              <>
                <CustomInput
                  labelText={name}
                  id="name"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={root}
                  id="root"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={ipfs}
                  id="ipfs"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
              </>
            )}
          </>
          {!transactionActive && (
            <div className="MLBGradientSubmit">
              <Button color="info" className="MLBGradient" onClick={() => purchaseNode()}>Purchase AC Node</Button>
            </div>
          )}
          {transactionActive && (
            <h3>
              Changing Owner Information<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
            </h3>
          )}
        </form>
      </CardBody>
    </Card>
  );
}
