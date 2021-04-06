import React from "react";
import "../../../assets/css/custom.css";
import swal from 'sweetalert';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import NavPills from "components/NavPills/NavPills.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { LockOpen, SwapHoriz } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function UnlockNode(props) {

  //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

  const [address, setAddress] = React.useState("");
  const [loginAddress, setloginAddress] = React.useState("");
  const [loginAddressState, setloginAddressState] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");

  const [nodeInfo, ] = React.useState(window.sentPacket);

  const link = document.createElement('div');

  window.sentPacket = null;

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop);
    }
    else {
      window.scrollTo({top: 0, behavior: 'smooth'})
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }, [])

  const clearForms = () => {
    setAddress("");
    setloginAddressState("");
    console.log("clearing forms");
  };

  const classes = useStyles();

  if (nodeInfo === undefined || nodeInfo === null) {
    console.log("No Node found. Rerouting...");
    window.location.href = "/#/user/home";
    window.location.reload()
  }

  const goBack = () => {
    window.backIndex = nodeInfo.dBIndex;
    window.location.href=nodeInfo.lastRef;
  }

  const thousandHashesOf = (varToHash) => {
    if(!window.web3) return window.location.href = "/#/user/home"
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  }

  const spliceNodeList = (arr) => {
    let tempArr = arr;
    for( let i = 0; i < tempArr.length; i++ ){
      if (String(nodeInfo.id) === String(tempArr[i][1])){
        console.log("removing array index:",i, tempArr[i])
        tempArr.splice(i, 1)
      }
    }
    console.log("New nodeList:", tempArr)
    return tempArr
  }

  const transferNode = async () => { //transfer held Node
    const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)
    const splicedList = spliceNodeList(props.nodeList);

    if(!window.web3.utils.isAddress(address)) {
      return swal({
        title: "Submitted address is not valid!",
        text: "Please check form and input a valid ethereum address.",
        icon: "warning",
        button: "Close",
      });   
    }

    if (loginAddress === "") {
      setloginAddressState("error");
      return;
    }

    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);

    await window.contracts.AC_TKN.methods
      .safeTransferFrom(
        props.addr,
        address,
        nodeInfo.id
      )
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
        clearForms();
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
          title: "Transfer Successful!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(()=>{
          //refreshBalances()
          //window.backIndex = nodeInfo.dBIndex;
          window.replaceAssetData = { key: pageKey, nodeList: splicedList }
          window.location.href = nodeInfo.lastRef;
        })
      });

  }

  return (
    <Card>
    <CardHeader icon>
      <CardIcon className="headerIconBack">
        <LockOpen />
      </CardIcon>
        <Button color="info" className="MLBGradient" onClick={() => goBack()}>Go Back</Button>
      <h4 className={classes.cardIconTitle}>Transfer Asset</h4>
    </CardHeader>
      <CardBody>
        <NavPills
          color="rose"
          horizontal={{
            tabsGrid: { xs: 12, sm: 12, md: 4 },
            contentGrid: { xs: 12, sm: 12, md: 8 }
          }}
          tabs={[
            {
              tabButton: "Profile",
              tabContent: (
                <span>
                  <p>
                    Collaboratively administrate empowered markets via
                    plug-and-play networks. Dynamically procrastinate B2C
                    users after installed base benefits.
                  </p>
                  <br />
                  <p>
                    Dramatically visualize customer directed convergence
                    without revolutionary ROI. Collaboratively
                    administrate empowered markets via plug-and-play
                    networks. Dynamically procrastinate B2C users after
                    installed base benefits.
                  </p>
                  <br />
                  <p>This is very nice.</p>
                </span>
              )
            },
            {
              tabButton: "Settings",
              tabContent: (
                <span>
                  <p>
                    Efficiently unleash cross-media information without
                    cross-media value. Quickly maximize timely
                    deliverables for real-time schemas.
                  </p>
                  <br />
                  <p>
                    Dramatically maintain clicks-and-mortar solutions
                    without functional solutions.
                  </p>
                </span>
              )
            },
            {
              tabButton: "Options",
              tabContent: (
                <span>
                  <p>
                    Completely synergize resource taxing relationships via
                    premier niche markets. Professionally cultivate
                    one-to-one customer service with robust ideas.{" "}
                  </p>
                  <br />
                  <p>
                    Dynamically innovate resource-leveling customer
                    service for state of the art customer service.
                  </p>
                </span>
              )
            }
          ]}
        />
      </CardBody>
    </Card>
  );
}
