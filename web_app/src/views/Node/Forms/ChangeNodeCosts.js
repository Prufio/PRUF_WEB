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
  const [beneficiaryAddress, setBeneficiaryAddress] = React.useState("");

  const [loginOperation1, setloginOperation1] = React.useState("");
  const [loginOperation2, setloginOperation2] = React.useState("");
  const [loginOperation3, setloginOperation3] = React.useState("");
  const [loginOperation4, setloginOperation4] = React.useState("");
  const [loginOperation5, setloginOperation5] = React.useState("");
  const [loginOperation6, setloginOperation6] = React.useState("");
  const [loginOperation7, setloginOperation7] = React.useState("");
  const [loginOperation8, setloginOperation8] = React.useState("");
  const [loginBeneficiaryAddress, setloginBeneficiaryAddress] = React.useState("");

  const [loginOperation1State, setloginOperation1State] = React.useState("");
  const [loginOperation2State, setloginOperation2State] = React.useState("");
  const [loginOperation3State, setloginOperation3State] = React.useState("");
  const [loginOperation4State, setloginOperation4State] = React.useState("");
  const [loginOperation5State, setloginOperation5State] = React.useState("");
  const [loginOperation6State, setloginOperation6State] = React.useState("");
  const [loginOperation7State, setloginOperation7State] = React.useState("");
  const [loginOperation8State, setloginOperation8State] = React.useState("");
  const [loginBeneficiaryAddressState, setloginBeneficiaryAddressState] = React.useState("");

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
      window.location.href = "/#/user/node-manager"
      window.location.reload()
    }

  }, [])

  const goBack = () => {
    window.backIndex = nodeInfo.dBIndex;
    window.location.href = nodeInfo.lastRef;
  }

  const changeCosts = async () => { //import held Node
    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);
    setTransactionActive(true);
    let op1 = window.web3.utils.toWei(operation1);
    let op2 = window.web3.utils.toWei(operation2);
    let op3 = window.web3.utils.toWei(operation3);
    let op4 = window.web3.utils.toWei(operation4);
    let op5 = window.web3.utils.toWei(operation5);
    let op6 = window.web3.utils.toWei(operation6);
    let op7 = window.web3.utils.toWei(operation7);
    let op8 = window.web3.utils.toWei(operation8);

    if (loginOperation1 !== "" && loginBeneficiaryAddress !== "") {
      if(!window.web3.utils.isAddress(beneficiaryAddress)) {
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
          beneficiaryAddress
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

    if (loginOperation1 !== "" && loginBeneficiaryAddress === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "1",
          op1,
          nodeInfo.costs.cost1.BeneficiaryAddress
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

    if (loginOperation2 !== "" && loginBeneficiaryAddress !== "") {
      if(!window.web3.utils.isAddress(beneficiaryAddress)) {
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
          beneficiaryAddress
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

    if (loginOperation2 !== "" && loginBeneficiaryAddress === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "2",
          op2,
          nodeInfo.costs.cost2.BeneficiaryAddress
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

    if (loginOperation3 !== "" && loginBeneficiaryAddress !== "") {
      if(!window.web3.utils.isAddress(beneficiaryAddress)) {
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
          beneficiaryAddress
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

    if (loginOperation3 !== "" && loginBeneficiaryAddress === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "3",
          op3,
          nodeInfo.costs.cost3.BeneficiaryAddress
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

    if (loginOperation4 !== "" && loginBeneficiaryAddress !== "") {
      if(!window.web3.utils.isAddress(beneficiaryAddress)) {
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
          beneficiaryAddress
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

    if (loginOperation4 !== "" && loginBeneficiaryAddress === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "4",
          op4,
          nodeInfo.costs.cost4.BeneficiaryAddress
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

    if (loginOperation5 !== "" && loginBeneficiaryAddress !== "") {
      if(!window.web3.utils.isAddress(beneficiaryAddress)) {
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
          beneficiaryAddress
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

    if (loginOperation5 !== "" && loginBeneficiaryAddress === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "5",
          op5,
          nodeInfo.costs.cost5.BeneficiaryAddress
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

    if (loginOperation6 !== "" && loginBeneficiaryAddress !== "") {
      if(!window.web3.utils.isAddress(beneficiaryAddress)) {
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
          beneficiaryAddress
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

    if (loginOperation6 !== "" && loginBeneficiaryAddress === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "6",
          op6,
          nodeInfo.costs.cost6.BeneficiaryAddress
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

    if (loginOperation7 !== "" && loginBeneficiaryAddress !== "") {
      if(!window.web3.utils.isAddress(beneficiaryAddress)) {
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
          beneficiaryAddress
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

    if (loginOperation7 !== "" && loginBeneficiaryAddress === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "7",
          op7,
          nodeInfo.costs.cost7.BeneficiaryAddress
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

    if (loginOperation8 !== "" && loginBeneficiaryAddress !== "") {
      if(!window.web3.utils.isAddress(beneficiaryAddress)) {
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
          beneficiaryAddress
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

    if (loginOperation8 !== "" && loginBeneficiaryAddress === "") {
      await window.contracts.AC_MGR.methods
        .ACTH_setCosts(
          nodeInfo.id,
          "8",
          op8,
          nodeInfo.costs.cost8.BeneficiaryAddress
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
        <h4 className={classes.cardIconTitle}>Change Node Operation Costs</h4>
      </CardHeader>
      <CardBody>
        <form>
          {nodeInfo !== null && nodeInfo !== undefined && (
            <h4>Node Selected: {nodeInfo.name}, ({nodeInfo.id})</h4>
          )}
          <>
            {!transactionActive && nodeInfo !== null && nodeInfo !== undefined && (
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
                    defaultValue: window.web3.utils.fromWei(nodeInfo.costs.cost1.acthCost),
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
                    defaultValue: window.web3.utils.fromWei(nodeInfo.costs.cost2.acthCost),
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
                    defaultValue: window.web3.utils.fromWei(nodeInfo.costs.cost3.acthCost),
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
                    defaultValue: window.web3.utils.fromWei(nodeInfo.costs.cost4.acthCost),
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
                    defaultValue: window.web3.utils.fromWei(nodeInfo.costs.cost5.acthCost),
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
                    defaultValue: window.web3.utils.fromWei(nodeInfo.costs.cost6.acthCost),
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
                    defaultValue: window.web3.utils.fromWei(nodeInfo.costs.cost7.acthCost),
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
                    defaultValue: window.web3.utils.fromWei(nodeInfo.costs.cost8.acthCost),
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
                  success={loginBeneficiaryAddressState === "success"}
                  error={loginBeneficiaryAddressState === "error"}
                  labelText="New Beneficiary Address"
                  id="beneficiaryAddress"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    defaultValue: nodeInfo.costs.cost1.BeneficiaryAddress,
                    onChange: event => {
                      setBeneficiaryAddress(event.target.value.trim())
                      if (event.target.value !== "") {
                        setloginBeneficiaryAddressState("success");
                      } else {
                        setloginBeneficiaryAddressState("error");
                      }
                      setloginBeneficiaryAddress(event.target.value);
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
                  labelText={beneficiaryAddress}
                  id="beneficiaryAddress"
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
