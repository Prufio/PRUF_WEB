import React from "react";
import "../../../assets/css/custom.css";
import swal from 'sweetalert';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { GroupAdd } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function ChangeNodeCosts(props) {

  //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

  const [transactionActive, setTransactionActive] = React.useState(false);

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");

  const [operation1, setOperation1] = React.useState("");
  const [operation2, setOperation2] = React.useState("");
  const [operation3, setOperation3] = React.useState("");
  const [operation4, setOperation4] = React.useState("");
  const [operation5, setOperation5] = React.useState("");
  const [operation6, setOperation6] = React.useState("");
  const [operation7, setOperation7] = React.useState("");
  const [operation8, setOperation8] = React.useState("");
  const [paymentAddress, setPaymentAddress] = React.useState("");

  const [loginOperation1, setloginOperation1] = React.useState("");
  const [loginOperation2, setloginOperation2] = React.useState("");
  const [loginOperation3, setloginOperation3] = React.useState("");
  const [loginOperation4, setloginOperation4] = React.useState("");
  const [loginOperation5, setloginOperation5] = React.useState("");
  const [loginOperation6, setloginOperation6] = React.useState("");
  const [loginOperation7, setloginOperation7] = React.useState("");
  const [loginOperation8, setloginOperation8] = React.useState("");
  const [loginPaymentAddress, setloginPaymentAddress] = React.useState("");

  const [loginOperation1State, setloginOperation1State] = React.useState("");
  const [loginOperation2State, setloginOperation2State] = React.useState("");
  const [loginOperation3State, setloginOperation3State] = React.useState("");
  const [loginOperation4State, setloginOperation4State] = React.useState("");
  const [loginOperation5State, setloginOperation5State] = React.useState("");
  const [loginOperation6State, setloginOperation6State] = React.useState("");
  const [loginOperation7State, setloginOperation7State] = React.useState("");
  const [loginOperation8State, setloginOperation8State] = React.useState("");
  const [loginPaymentAddressState, setloginPaymentAddressState] = React.useState("");

  const [nodeInfo,] = React.useState(window.sentPacket)

  const link = document.createElement('div')

  window.sentPacket = null

  const classes = useStyles();

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
    if (nodeInfo === undefined || nodeInfo === null) {
      console.log("No Node found. Rerouting...")
      window.location.href = "/#/user/home"
      window.location.reload()
    }
    if (nodeInfo.statusNum === "50" || nodeInfo.statusNum === "56" || nodeInfo.statusNum === "70") {
      swal({
        title: "Node not in correct status!",
        text: "This Node is not in a modifiable status, please set Node into a non-escrow status before attempting to modify.",
        icon: "warning",
        button: "Close",
      }).then(() => {
        window.backIndex = nodeInfo.dBIndex;
        window.location.href = nodeInfo.lastRef;
      });
    }

    /* else if (nodeInfo.statusNum === "53" || nodeInfo.statusNum === "54") {
      swal({
        title: "Node not in correct status!",
        text: "This Node is in a lost or stolen status, please set Node to a non lost or stolen status before attempting to modify.",
        icon: "warning",
        button: "Close",
      }).then(()=>{
        window.backIndex = nodeInfo.dBIndex;
        window.location.href = nodeInfo.lastRef;
      });
    } */

  }, [])

  const goBack = () => {
    window.backIndex = nodeInfo.dBIndex;
    window.location.href = nodeInfo.lastRef;
  }

  const refreshBalances = async () => {
    if (!window.web3.eth) return

    let pruf, ether;

    console.log("Refreshing ether bal")
    await window.web3.eth.getBalance(props.addr, (err, result) => {
      if (err) { console.log(err) }
      else { ether = window.web3.utils.fromWei(result, 'ether') }
      window.contracts.UTIL_TKN.methods.balanceOf(props.addr).call((err, result) => {
        if (err) { console.log(err) }
        else { pruf = window.web3.utils.fromWei(result, 'ether') }
        window.contracts.A_TKN.methods.balanceOf(props.addr).call((err, result) => {
          if (err) { console.log(err) }
          else { window.replaceAssetData = { assets: result, ether, pruf } }
        });
      });
    });
  }

  const changeCosts = async () => { //import held Node
    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);
    setTransactionActive(true);

      if (loginOperation1 !== "" && loginPaymentAddress !== "") {
    await window.contracts.AC_MGR.methods
      .ACTH_setCosts(
        nodeInfo.id,
        "1",
        operation1,
        paymentAddress
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

      if (loginOperation1 !== "" && loginPaymentAddress === "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "1",
            operation1,
            nodeInfo.paymentAddress1
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

      if (loginOperation2 !== "" && loginPaymentAddress !== "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "2",
            operation2,
            paymentAddress
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

      if (loginOperation2 !== "" && loginPaymentAddress === "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "2",
            operation2,
            nodeInfo.paymentAddress2
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

      if (loginOperation3 !== "" && loginPaymentAddress !== "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "3",
            operation3,
            paymentAddress
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

      if (loginOperation3 !== "" && loginPaymentAddress === "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "3",
            operation3,
            nodeInfo.paymentAddress3
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

      if (loginOperation4 !== "" && loginPaymentAddress !== "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "4",
            operation4,
            paymentAddress
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

      if (loginOperation4 !== "" && loginPaymentAddress === "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "4",
            operation4,
            nodeInfo.paymentAddress4
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

      if (loginOperation5 !== "" && loginPaymentAddress !== "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "5",
            operation5,
            paymentAddress
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

      if (loginOperation5 !== "" && loginPaymentAddress === "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "5",
            operation5,
            nodeInfo.paymentAddress5
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

      if (loginOperation6 !== "" && loginPaymentAddress !== "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "6",
            operation6,
            paymentAddress
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

      if (loginOperation6 !== "" && loginPaymentAddress === "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "6",
            operation6,
            nodeInfo.paymentAddress6
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

      if (loginOperation7 !== "" && loginPaymentAddress !== "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "7",
            operation7,
            paymentAddress
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

      if (loginOperation7 !== "" && loginPaymentAddress === "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "7",
            operation7,
            nodeInfo.paymentAddress7
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

      if (loginOperation8 !== "" && loginPaymentAddress !== "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "8",
            operation8,
            paymentAddress
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

      if (loginOperation8 !== "" && loginPaymentAddress === "") {
        await window.contracts.AC_MGR.methods
          .ACTH_setCosts(
            nodeInfo.id,
            "8",
            operation8,
            nodeInfo.paymentAddress8
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

        return window.backIndex = nodeInfo.dBIndex, window.location.href = nodeInfo.lastRef;
        

  }

  return (
    <Card>
      <CardHeader icon>
        <CardIcon className="headerIconBack">
          <GroupAdd />
        </CardIcon>
        <Button color="info" className="MLBGradient" onClick={() => goBack()}>Go Back</Button>
        <h4 className={classes.cardIconTitle}>Change Owner Information</h4>
      </CardHeader>
      <CardBody>
        <form>
          <h4>Node Selected: {nodeInfo.name}, ({nodeInfo.id})</h4>
          <>
            {!transactionActive && (
              <>
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
                <CustomInput
                  success={loginPaymentAddressState === "success"}
                  error={loginPaymentAddressState === "error"}
                  labelText="New Payment Address"
                  id="paymentAddress"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    onChange: event => {
                      setPaymentAddress(event.target.value.trim())
                      if (event.target.value !== "") {
                        setloginPaymentAddressState("success");
                      } else {
                        setloginPaymentAddressState("error");
                      }
                      setloginPaymentAddress(event.target.value);
                    },
                  }}
                />
                <div className={classes.formCategory}>
                  <small>*</small> Required fields
                    </div>
              </>
            )}
            {transactionActive && (
              <>
                <CustomInput
                  labelText={operation1}
                  id="operation1"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={operation2}
                  id="operation2"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={operation3}
                  id="operation3"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={operation4}
                  id="operation4"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={operation5}
                  id="operation5"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={operation6}
                  id="operation6"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={operation7}
                  id="operation7"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={operation8}
                  id="operation8"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    disabled: true
                  }}
                />
                <CustomInput
                  labelText={paymentAddress}
                  id="paymentAddress"
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
              <Button color="info" className="MLBGradient" onClick={() => changeCosts()}>Update Costs</Button>
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
