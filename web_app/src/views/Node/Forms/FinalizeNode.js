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
import Button from "components/CustomButtons/Button.js";
import Wizard from "components/Wizard/Wizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { LockOpen, SwapHoriz } from "@material-ui/icons";


import Step1 from "./NodeWizzard/Step1.js";
import Step2 from "./NodeWizzard/Step2.js";
import Step3 from "./NodeWizzard/Step3.js";
const useStyles = makeStyles(styles);

export default function FinalizeNode(props) {

    //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

    const [address, setAddress] = React.useState("");
    const [loginAddress, setloginAddress] = React.useState("");
    const [loginAddressState, setloginAddressState] = React.useState("");
    const [transactionActive, setTransactionActive] = React.useState(false);
    const [error, setError] = React.useState("");
    const [showHelp, setShowHelp] = React.useState(false);
    const [txStatus, setTxStatus] = React.useState(false);
    const [txHash, setTxHash] = React.useState("");

    const [nodeInfo,] = React.useState(window.sentPacket);

    const link = document.createElement('div');

    window.sentPacket = null;

    React.useEffect(() => {
        if (props.ps) {
            props.ps.element.scrollTop = 0;
            //console.log("Scrolled to ", props.ps.element.scrollTop);
        }
        else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
        }
    }, [])

    const classes = useStyles();

    if (nodeInfo === undefined || nodeInfo === null) {
        console.log("No Node found. Rerouting...");
        window.location.href = "/#/user/home";
        window.location.reload()
    }

    const goBack = () => {
        window.backIndex = nodeInfo.dBIndex;
        window.location.href = nodeInfo.lastRef;
    }

    const finalizeNode = async () => { //transfer held Node


        if (!window.web3.utils.isAddress(address)) {
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
                }).then(() => {
                    //refreshBalances()
                    //window.backIndex = nodeInfo.dBIndex;
                    window.location.href = nodeInfo.lastRef;
                })
            });

    }

    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={8}>
          <Wizard
            validate
            steps={[
              { stepName: "About", stepComponent: Step1, stepId: "about" },
              { stepName: "Account", stepComponent: Step2, stepId: "account" },
              { stepName: "Address", stepComponent: Step3, stepId: "address" }
            ]}
            title="Build Your Profile"
            subtitle="This information will let us know more about you."
            finishButtonClick={e => alert(e)}
          />
        </GridItem>
      </GridContainer>
    );
}
