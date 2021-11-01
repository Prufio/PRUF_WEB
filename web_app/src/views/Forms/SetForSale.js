/*DS DEPRECATE*/
import React from 'react'
import '../../assets/css/custom.css'
import swal from 'sweetalert'
import swalReact from '@sweetalert/with-react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'

// core components
import CustomInput from 'components/CustomInput/CustomInput.js'
import Button from 'components/CustomButtons/Button.js'
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardBody from 'components/Card/CardBody.js'

import styles from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle'
import { MonetizationOnOutlined } from '@material-ui/icons'

const useStyles = makeStyles(styles)

export default function SetForSale(props) {
    if (!window.sentPacket) window.sentPacket = {}

    const [transactionActive, setTransactionActive] = React.useState(false)

    // eslint-disable-next-line no-unused-vars
    const [error, setError] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [showHelp, setShowHelp] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [txStatus, setTxStatus] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [txHash, setTxHash] = React.useState('')
    const [price, setPrice] = React.useState(window.sentPacket.price)
    const [currency, setCurrency] = React.useState('2')
    const [loginPrice, setloginPrice] = React.useState('')
    const [loginPriceState, setloginPriceState] = React.useState('')

    const [assetInfo] = React.useState(JSON.parse(JSON.stringify(window.sentPacket)))

    const link = document.createElement('div')

    //window.sentPacket = null

    const classes = useStyles()

    React.useEffect(() => {
        // eslint-disable-next-line react/prop-types
        if (props.ps) {
            // eslint-disable-next-line react/prop-types
            props.ps.element.scrollTop = 0
            //console.log("Scrolled to ", props.ps.element.scrollTop)
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            document.documentElement.scrollTop = 0
            document.scrollingElement.scrollTop = 0
        }
        if (assetInfo === undefined || assetInfo === null || assetInfo === {}) {
            console.log("No asset found. Rerouting...");
            return (window.location.href = "/#/user/home");
        }
        else if (assetInfo.statusNum &&
            assetInfo.statusNum === '50' ||
            assetInfo.statusNum && assetInfo.statusNum === '56' ||
            assetInfo.statusNum && assetInfo.statusNum === '70'
        ) {
            swal({
                title: 'Asset not in correct status!',
                text:
                    'This asset is not in a modifiable status, please set asset into a non-escrow status before attempting to modify.',
                icon: 'warning',
                button: 'Close',
            }).then(() => {
                window.backIndex = assetInfo.dBIndex
                window.location.href = assetInfo.lastRef
            })
        }

    }, [])

    const goBack = () => {
        //window.sentPacket = null
        if (assetInfo.lastRef === '/#/user/dashboard')
            window.backIndex = assetInfo.dBIndex
        window.location.href = assetInfo.lastRef
    }

    const handleSetPrice = (e) => {
        setPrice(e)
    }

    const thousandHashesOf = (varToHash) => {
        if (!window.web3) return (window.location.href = '/#/user/home')
        let tempHash = varToHash
        for (let i = 0; i < 1000; i++) {
            tempHash = window.web3.utils.soliditySha3(tempHash)
            //console.log(tempHash);
        }
        return tempHash
    }

    const clearAssetPrice = () => {
        // eslint-disable-next-line react/prop-types
        const pageKey = thousandHashesOf(props.addr, props.winKey)
        let newAsset = JSON.parse(JSON.stringify(assetInfo))
        newAsset.price = "0"
        newAsset.currency = "0"

        let tempTxHash
        swalReact({
            content: (
                <Card className="delegationCard">
                    <h4 className="delegationTitle">Clear Price</h4>
                    <h5 className="delegationTipsContent">
                        Please confirm that the following information is
                        correct.
                    </h5>
                    <div className="delegationInfoSec">
                        <h4 className="delegationInfo">
                            Changing price of &nbsp; {assetInfo.name}
                        </h4>
                    </div>
                    <div className="delegationInfoSec">
                        <h4 className="delegationInfo">To:</h4>
                        <h4>{price}</h4>
                    </div>
                    <div className="delegationInfoSec">
                        <h4 className="delegationInfo">From:</h4>
                        <h4>{assetInfo.price}</h4>
                    </div>
                </Card>
            ),
            buttons: {
                back: {
                    text: 'Back',
                    value: 'back',
                    className: 'delegationButtonBack',
                },
                confirm: {
                    text: 'Confirm',
                    value: 'confirm',
                    className: 'delegationButtonDelegate',
                },
            },
        }).then(async (value) => {
            switch (value) {
                case 'confirm':
                    setShowHelp(false)
                    setTxStatus(false)
                    setTxHash('')
                    setError(undefined)

                    setTransactionActive(true)
                    props.prufClient.do
                        .unSetForSale(assetInfo.id)
                        // eslint-disable-next-line react/prop-types
                        .send({ from: props.addr })
                        .on('error', function (_error) {
                            setTransactionActive(false)
                            setTxStatus(false)
                            setTxHash(Object.values(_error)[0].transactionHash)
                            tempTxHash = Object.values(_error)[0]
                                .transactionHash
                            let str1 =
                                "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                            let str2 = "' target='_blank'>here</a>"
                            link.innerHTML = String(str1 + tempTxHash + str2)
                            setError(Object.values(_error)[0])
                            if (tempTxHash !== undefined) {
                                swal({
                                    title: 'Something went wrong!',
                                    content: link,
                                    icon: 'warning',
                                    button: 'Close',
                                })
                            }
                            if (tempTxHash === undefined) {
                                swal({
                                    title: 'Something went wrong!',
                                    icon: 'warning',
                                    button: 'Close',
                                })
                            }
                        })
                        .on('receipt', (receipt) => {
                            setTransactionActive(false)
                            setTxStatus(receipt.status)
                            tempTxHash = receipt.transactionHash
                            let str1 =
                                "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                            let str2 = "' target='_blank'>here</a>"
                            link.innerHTML = String(str1 + tempTxHash + str2)
                            setTxHash(receipt.transactionHash)
                            swal({
                                title: 'Asset price has been changed!',
                                content: link,
                                icon: 'success',
                                button: 'Close',
                            }).then(() => {
                                window.location.href = assetInfo.lastRef
                                window.replaceAssetData.refreshBals = true
                                window.dispatchEvent(props.refresh)
                                window.backIndex = assetInfo.dBIndex
                                window.replaceAssetData = {
                                    key: pageKey,
                                    newAsset: newAsset,
                                    assetAction: "mod"
                                }
                                window.dispatchEvent(props.refresh)
                            })
                        })
                    break

                case 'back':
                    break

                default:
                    return
            }
        })
    }

    const setAssetPrice = () => {
        //set asset price
        let pageKey = thousandHashesOf(
            // eslint-disable-next-line react/prop-types
            props.addr,
            // eslint-disable-next-line react/prop-types
            props.winKey
        )
        let newAsset = JSON.parse(JSON.stringify(assetInfo))

        let tempTxHash
        if (assetInfo.price === price) {
            setloginPriceState('error')
            return swal("Price has not changed!")
        }
        if (assetInfo.price !== '0') {
            swalReact({
                content: (
                    <Card className="delegationCard">
                        <h4 className="delegationTitle">Price Modification</h4>
                        <h5 className="delegationTipsContent">
                            Please confirm that the following information is
                            correct.
                        </h5>
                        <div className="delegationInfoSec">
                            <h4 className="delegationInfo">
                                Changing price of&nbsp;{assetInfo.name}
                            </h4>
                        </div>
                        <div className="delegationInfoSec">
                            <h4 className="delegationInfo">To:</h4>
                            <h4>{price}</h4>
                        </div>
                        <div className="delegationInfoSec">
                            <h4 className="delegationInfo">From:</h4>
                            <h4>{assetInfo.price}</h4>
                        </div>
                    </Card>
                ),
                buttons: {
                    back: {
                        text: 'Back',
                        value: 'back',
                        className: 'delegationButtonBack',
                    },
                    confirm: {
                        text: 'Confirm',
                        value: 'confirm',
                        className: 'delegationButtonDelegate',
                    },
                },
            }).then((value) => {
                switch (value) {
                    case 'confirm':
                        newAsset.currency = currency
                        newAsset.price = price

                        setShowHelp(false)
                        setTxStatus(false)
                        setTxHash('')
                        setError(undefined)

                        if (loginPrice === '') {
                            setloginPriceState('error')
                            return
                        }

                        setTransactionActive(true)
                        if (assetInfo.statusNum !== '51') {
                            props.prufClient.do
                                .setForSale(
                                    assetInfo.id,
                                    window.web3.utils.toWei(price),
                                    currency,
                                    '170'
                                )
                                // eslint-disable-next-line react/prop-types
                                .send({ from: props.addr })
                                .on('error', function (_error) {
                                    setTransactionActive(false)
                                    setTxStatus(false)
                                    setTxHash(
                                        Object.values(_error)[0].transactionHash
                                    )
                                    tempTxHash = Object.values(_error)[0]
                                        .transactionHash
                                    let str1 =
                                        "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                                    let str2 = "' target='_blank'>here</a>"
                                    link.innerHTML = String(
                                        str1 + tempTxHash + str2
                                    )
                                    setError(Object.values(_error)[0])
                                    if (tempTxHash !== undefined) {
                                        swal({
                                            title: 'Something went wrong!',
                                            content: link,
                                            icon: 'warning',
                                            button: 'Close',
                                        })
                                    }
                                    if (tempTxHash === undefined) {
                                        swal({
                                            title: 'Something went wrong!',
                                            icon: 'warning',
                                            button: 'Close',
                                        })
                                    }
                                })
                                .on('receipt', (receipt) => {
                                    setTransactionActive(false)
                                    setTxStatus(receipt.status)
                                    tempTxHash = receipt.transactionHash
                                    let str1 =
                                        "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                                    let str2 = "' target='_blank'>here</a>"
                                    link.innerHTML = String(
                                        str1 + tempTxHash + str2
                                    )
                                    setTxHash(receipt.transactionHash)
                                    swal({
                                        title: 'Asset set for sale!',
                                        content: link,
                                        icon: 'success',
                                        button: 'Close',
                                    }).then(() => {
                                        window.newStat = {
                                            num: "51",
                                            str: 'Transferable',
                                        }
                                        window.location.href = assetInfo.lastRef
                                        window.replaceAssetData.refreshBals = true
                                        window.dispatchEvent(props.refresh)
                                        window.costInfo = { price: price, currency: currency }
                                        window.replaceAssetData = {
                                            key: pageKey,
                                            newAsset: newAsset,
                                            assetAction: "mod"
                                        }
                                        window.dispatchEvent(props.refresh)
                                    })
                                })
                        } else {
                            props.prufClient.do
                                .setForSale(
                                    assetInfo.id,
                                    window.web3.utils.toWei(price),
                                    currency,
                                    '0'
                                )
                                // eslint-disable-next-line react/prop-types
                                .send({ from: props.addr })
                                .on('error', function (_error) {
                                    setTransactionActive(false)
                                    setTxStatus(false)
                                    setTxHash(
                                        Object.values(_error)[0].transactionHash
                                    )
                                    tempTxHash = Object.values(_error)[0]
                                        .transactionHash
                                    let str1 =
                                        "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                                    let str2 = "' target='_blank'>here</a>"
                                    link.innerHTML = String(
                                        str1 + tempTxHash + str2
                                    )
                                    setError(Object.values(_error)[0])
                                    if (tempTxHash !== undefined) {
                                        swal({
                                            title: 'Something went wrong!',
                                            content: link,
                                            icon: 'warning',
                                            button: 'Close',
                                        })
                                    }
                                    if (tempTxHash === undefined) {
                                        swal({
                                            title: 'Something went wrong!',
                                            icon: 'warning',
                                            button: 'Close',
                                        })
                                    }
                                })
                                .on('receipt', (receipt) => {
                                    setTransactionActive(false)
                                    setTxStatus(receipt.status)
                                    tempTxHash = receipt.transactionHash
                                    let str1 =
                                        "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                                    let str2 = "' target='_blank'>here</a>"
                                    link.innerHTML = String(
                                        str1 + tempTxHash + str2
                                    )
                                    setTxHash(receipt.transactionHash)
                                    swal({
                                        title: 'Asset set for sale!',
                                        content: link,
                                        icon: 'success',
                                        button: 'Close',
                                    }).then(() => {
                                        window.location.href = assetInfo.lastRef
                                        window.replaceAssetData.refreshBals = true
                                        window.dispatchEvent(props.refresh)
                                        window.costInfo = { price: price, currency: currency }
                                        window.replaceAssetData = {
                                            key: pageKey,
                                            newAsset: newAsset,
                                            assetAction: "mod"
                                        }
                                        window.dispatchEvent(props.refresh)
                                    })
                                })
                        }
                        return

                    case 'back':
                        break

                    default:
                        return
                }
            })
        }

        // const pageKey = thousandHashesOf(props.addr, props.winKey)
        // let newAsset = await JSON.parse(JSON.stringify(assetInfo))
        newAsset.currency = currency
        newAsset.price = price

        // let tempTxHash
        setShowHelp(false)
        setTxStatus(false)
        setTxHash('')
        setError(undefined)

        if (loginPrice === '') {
            setloginPriceState('error')
            return
        }

        setTransactionActive(true)
        if (assetInfo.statusNum !== '51') {
            props.prufClient.do
                .setForSale(
                    assetInfo.id,
                    window.web3.utils.toWei(price),
                    currency,
                    '170'
                )
                // eslint-disable-next-line react/prop-types
                .send({ from: props.addr })
                .on('error', function (_error) {
                    setTransactionActive(false)
                    setTxStatus(false)
                    setTxHash(Object.values(_error)[0].transactionHash)
                    tempTxHash = Object.values(_error)[0].transactionHash
                    let str1 =
                        "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                    let str2 = "' target='_blank'>here</a>"
                    link.innerHTML = String(str1 + tempTxHash + str2)
                    setError(Object.values(_error)[0])
                    if (tempTxHash !== undefined) {
                        swal({
                            title: 'Something went wrong!',
                            content: link,
                            icon: 'warning',
                            button: 'Close',
                        })
                    }
                    if (tempTxHash === undefined) {
                        swal({
                            title: 'Something went wrong!',
                            icon: 'warning',
                            button: 'Close',
                        })
                    }
                })
                .on('receipt', (receipt) => {
                    setTransactionActive(false)
                    setTxStatus(receipt.status)
                    tempTxHash = receipt.transactionHash
                    let str1 =
                        "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                    let str2 = "' target='_blank'>here</a>"
                    link.innerHTML = String(str1 + tempTxHash + str2)
                    setTxHash(receipt.transactionHash)
                    swal({
                        title: 'Asset set for sale!',
                        content: link,
                        icon: 'success',
                        button: 'Close',
                    }).then(() => {
                        window.newStat = {
                            num: "51",
                            str: 'Transferable',
                        }
                        window.location.href = assetInfo.lastRef
                        window.backIndex = assetInfo.dBIndex
                        window.costInfo = { price: price, currency: currency }
                        window.replaceAssetData.refreshBals = true
                        window.replaceAssetData = {
                            key: pageKey,
                            newAsset: newAsset,
                            assetAction: "mod"
                        }
                        window.dispatchEvent(props.refresh)
                    })
                })
        } else {
            console.log(props.addr)
            props.prufClient.do
                .setForSale(
                    assetInfo.id,
                    window.web3.utils.toWei(price),
                    currency,
                    '0'
                )
                // eslint-disable-next-line react/prop-types
                .send({ from: props.addr })
                .on('error', function (_error) {
                    setTransactionActive(false)
                    setTxStatus(false)
                    setTxHash(Object.values(_error)[0].transactionHash)
                    tempTxHash = Object.values(_error)[0].transactionHash
                    let str1 =
                        "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                    let str2 = "' target='_blank'>here</a>"
                    link.innerHTML = String(str1 + tempTxHash + str2)
                    setError(Object.values(_error)[0])
                    if (tempTxHash !== undefined) {
                        swal({
                            title: 'Something went wrong!',
                            content: link,
                            icon: 'warning',
                            button: 'Close',
                        })
                    }
                    if (tempTxHash === undefined) {
                        swal({
                            title: 'Something went wrong!',
                            icon: 'warning',
                            button: 'Close',
                        })
                    }
                })
                .on('receipt', (receipt) => {
                    setTransactionActive(false)
                    setTxStatus(receipt.status)
                    tempTxHash = receipt.transactionHash
                    let str1 =
                        "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                    let str2 = "' target='_blank'>here</a>"
                    link.innerHTML = String(str1 + tempTxHash + str2)
                    setTxHash(receipt.transactionHash)
                    swal({
                        title: 'Asset set for sale!',
                        content: link,
                        icon: 'success',
                        button: 'Close',
                    }).then(() => {
                        window.location.href = assetInfo.lastRef
                        window.backIndex = assetInfo.dBIndex
                        window.costInfo = { price: price, currency: currency }
                        window.replaceAssetData.refreshBals = true
                        window.dispatchEvent(props.refresh)
                        window.replaceAssetData = {
                            key: pageKey,
                            newAsset: newAsset,
                            assetAction: "mod"
                        }
                        window.dispatchEvent(props.refresh)
                    })
                })
        }
    }

    if (!props.prufClient) {
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
        <Card>
            <CardHeader icon>
                <CardIcon className="headerIconBack">
                    <MonetizationOnOutlined />
                </CardIcon>
                <Button
                    color="info"
                    className="MLBGradient"
                    onClick={() => goBack()}
                >
                    Go Back
                </Button>
                <h4 className={classes.cardIconTitle}>Set Price</h4>
            </CardHeader>
            <CardBody>
                <form>
                    <h4>Asset Selected: {assetInfo.name}</h4>
                    <>
                        {!transactionActive && (
                            <>
                                <CustomInput
                                    success={loginPriceState === 'success'}
                                    error={loginPriceState === 'error'}
                                    labelText="Price in PRUF *"
                                    id="price"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        defaultValue: assetInfo.price,
                                        onChange: (event) => {
                                            handleSetPrice(
                                                event.target.value.trim()
                                            )
                                            if (event.target.value !== '') {
                                                setloginPriceState('success')
                                            } else {
                                                setloginPriceState('error')
                                            }
                                            setloginPrice(event.target.value)
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
                                    fullWidth: true,
                                }}
                                inputProps={{
                                    disabled: true,
                                }}
                            />
                        )}
                    </>
                    {!transactionActive && assetInfo.price === "0" && price !== "0" && (
                        <div className="MLBGradientSubmit">
                            <Button
                                color="info"
                                className="MLBGradient"
                                onClick={() => setAssetPrice()}
                            >
                                Set for sale
                            </Button>
                        </div>
                    )}
                    {!transactionActive && assetInfo.price !== "0" && price !== "0" && (
                        <div className="MLBGradientSubmit">
                            <Button
                                color="info"
                                className="MLBGradient"
                                onClick={() => setAssetPrice()}
                            >
                                Change Price
                            </Button>
                        </div>
                    )}
                    {!transactionActive &&
                        price ===
                        '0' && (
                            <div className="MLBGradientSubmit">
                                <Button
                                    color="info"
                                    className="MLBGradient"
                                    onClick={() => clearAssetPrice()}
                                >
                                    Clear Price
                                    </Button>
                            </div>
                        )}
                    {transactionActive && (
                        <h3>
                            Setting Price
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
    )
}
