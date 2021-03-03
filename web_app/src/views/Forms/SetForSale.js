import React from "react";
import "../../assets/css/custom.css";
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
import Icon from '@material-ui/core/Icon';

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { AttachMoney, GroupAdd, MonetizationOnOutlined, Storefront } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function SetForSale(props) {

    //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

    const [transactionActive, setTransactionActive] = React.useState(false);

    const [error, setError] = React.useState("");
    const [showHelp, setShowHelp] = React.useState(false);
    const [txStatus, setTxStatus] = React.useState(false);
    const [txHash, setTxHash] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [currency, setCurrency] = React.useState("2");
    const [loginPrice, setloginPrice] = React.useState("");
    const [loginPriceState, setloginPriceState] = React.useState("");

    const [assetInfo,] = React.useState(window.sentPacket)

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
        if (assetInfo === undefined || assetInfo === null) {
            console.log("No asset found. Rerouting...")
            window.location.href = "/#/user/home"
            window.location.reload()
        }
        if (assetInfo.statusNum === "50" || assetInfo.statusNum === "56" || assetInfo.statusNum === "70") {
            swal({
                title: "Asset not in correct status!",
                text: "This asset is not in a modifiable status, please set asset into a non-escrow status before attempting to modify.",
                icon: "warning",
                button: "Close",
            }).then(() => {
                window.backIndex = assetInfo.dBIndex;
                window.location.href = assetInfo.lastRef;
            });
        }

        /* else if (assetInfo.statusNum === "53" || assetInfo.statusNum === "54") {
          swal({
            title: "Asset not in correct status!",
            text: "This asset is in a lost or stolen status, please set asset to a non lost or stolen status before attempting to modify.",
            icon: "warning",
            button: "Close",
          }).then(()=>{
            window.backIndex = assetInfo.dBIndex;
            window.location.href = assetInfo.lastRef;
          });
        } */

    }, [])

    const goBack = () => {
        window.backIndex = assetInfo.dBIndex;
        window.location.href = assetInfo.lastRef;
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

    const handleSetPrice = (e) => {
        setPrice(e)
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

    const clearAssetPrice = () => {
        //@dev build out clear asset price
    }

    const setAssetPrice = async () => { //import held asset

        const pageKey = thousandHashesOf(props.addr, props.winKey);
        let newAsset = await JSON.parse(JSON.stringify(assetInfo));
        newAsset.currency = currency;
        newAsset.price = price;

        let tempTxHash;
        setShowHelp(false);
        setTxStatus(false);
        setTxHash("");
        setError(undefined);


        if (loginPrice === "") {
            setloginPriceState("error");
            return;
        }

        setTransactionActive(true);
        if (assetInfo.statusNum !== "51") {
            await window.contracts.PURCHASE.methods
                ._setPrice(
                    assetInfo.idxHash,
                    window.web3.utils.toWei(price),
                    currency,
                    "170"
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
                        title: "Asset set for sale!",
                        content: link,
                        icon: "success",
                        button: "Close",
                    }).then(() => {
                        window.newStat = { num: String(assetInfo.statusNum), str: "For Sale" }
                        window.location.href = assetInfo.lastRef;
                        window.backIndex = assetInfo.dBIndex
                        window.replaceAssetData = { key: pageKey, dBIndex: assetInfo.dBIndex, newAsset: newAsset }
                    })
                });
        }
        else {
            await window.contracts.PURCHASE.methods
                ._setPrice(
                    assetInfo.idxHash,
                    window.web3.utils.toWei(price),
                    currency,
                    "0"
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
                        title: "Asset set for sale!",
                        content: link,
                        icon: "success",
                        button: "Close",
                    }).then(() => {
                        window.newStat = { num: String(assetInfo.statusNum), str: "For Sale" }
                        window.location.href = assetInfo.lastRef;
                        window.backIndex = assetInfo.dBIndex
                        window.replaceAssetData = { key: pageKey, dBIndex: assetInfo.dBIndex, newAsset: newAsset }
                    })
                });
        }
    }

    return (
        <Card>
            <CardHeader icon>
                <CardIcon className="headerIconBack">
                    <MonetizationOnOutlined />
                </CardIcon>
                <Button color="info" className="MLBGradient" onClick={() => goBack()}>Go Back</Button>
                <h4 className={classes.cardIconTitle}>Set Price</h4>
            </CardHeader>
            <CardBody>
                <form>
                    <h4>Asset Selected: {assetInfo.name}</h4>
                    <>
                        {!transactionActive && (
                            <>

                                <CustomInput
                                    success={loginPriceState === "success"}
                                    error={loginPriceState === "error"}
                                    labelText="Price in PRUF *"
                                    id="price"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        onChange: event => {
                                            handleSetPrice(event.target.value.trim())
                                            if (event.target.value !== "") {
                                                setloginPriceState("success");
                                            } else {
                                                setloginPriceState("error");
                                            }
                                            setloginPrice(event.target.value);
                                        },
                                    }}
                                />
                                <div className={classes.formCategory}>
                                    <small>*</small> Required fields
                    </div>
                            </>
                        )}
                        {transactionActive && (
                            <CustomInput
                                labelText={price}
                                id="first"
                                formControlProps={{
                                    fullWidth: true
                                }}
                                inputProps={{
                                    disabled: true
                                }}
                            />
                        )}
                    </>
                    {!transactionActive && (
                        <div className="MLBGradientSubmit">
                            <Button color="info" className="MLBGradient" onClick={() => setAssetPrice()}>Set for sale</Button>
                        </div>
                    )}
                    {transactionActive && (
                        <h3>
                            Setting Price<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                        </h3>
                    )}
                </form>
            </CardBody>
        </Card>
    );
}