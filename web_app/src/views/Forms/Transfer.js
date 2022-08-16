import React from 'react'
import '../../assets/css/custom.css'
import swal from 'sweetalert'
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
import { SwapHoriz } from '@material-ui/icons'

const useStyles = makeStyles(styles)

export default function Transfer(props) {
    if (!window.sentPacket) window.sentPacket = {}

    const [address, setAddress] = React.useState('')
    const [loginAddress, setloginAddress] = React.useState('')
    const [loginAddressState, setloginAddressState] = React.useState('')
    const [transactionActive, setTransactionActive] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [showHelp, setShowHelp] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [txStatus, setTxStatus] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [txHash, setTxHash] = React.useState('')

    const [assetInfo] = React.useState(JSON.parse(JSON.stringify(window.sentPacket)))

    const link = document.createElement('div')

    React.useEffect(() => {
        // eslint-disable-next-line react/prop-types
        if (props.ps) {
            // eslint-disable-next-line react/prop-types
            props.ps.element.scrollTop = 0
            //console.log("Scrolled to ", props.ps.element.scrollTop);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            document.documentElement.scrollTop = 0
            document.scrollingElement.scrollTop = 0
        }
        if (assetInfo === undefined || assetInfo === null || assetInfo === {}) {
            console.log('No asset found. Rerouting...')
            window.location.href = '/#/user/home'
            //window.location.reload()
        }
        else if (assetInfo.statusNum && assetInfo.statusNum !== '51') {
            swalReact({
                title: 'Asset not in correct status!',
                text:
                    'This asset is not in a transferable status, please set asset into transferable status before attempting to transfer.',
                icon: 'warning',
                button: 'Close',
            }).then(() => {
                goBack()
            })

        }
    }, [])

    const clearForms = () => {
        setAddress('')
        setloginAddressState('')
        console.log('clearing forms')
    }

    const classes = useStyles()


    const goBack = () => {
        window.backIndex = assetInfo.dBIndex
        window.location.href = assetInfo.lastRef
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

    const transferAsset = async () => {
        //transfer held asset
        // eslint-disable-next-line react/prop-types
        const pageKey = thousandHashesOf(props.addr, props.winKey) //thousandHashesOf(props.addr, props.winKey)

        if (!window.web3.utils.isAddress(address)) {
            return swalReact({
                title: 'Submitted address is not valid!',
                text: 'Please check form and input a valid ethereum address.',
                icon: 'warning',
                button: 'Close',
            })
        }

        if (loginAddress === '') {
            setloginAddressState('error')
            return
        }

        let tempTxHash
        setShowHelp(false)
        setTxStatus(false)
        setTxHash('')
        setError(undefined)

        setTransactionActive(true)

        props.prufClient.do.asset
            // eslint-disable-next-line react/prop-types
            .transfer(props.addr, address, assetInfo.id)
            // eslint-disable-next-line react/prop-types
            .send({ from: props.addr })
            .on('error', function (_error) {
                setTransactionActive(false)
                setTxStatus(false)
                setTxHash(Object.values(_error)[0].transactionHash)
                tempTxHash = Object.values(_error)[0].transactionHash
                let str1 =
                    `Check out your TX <a href='${props.explorer}'`
                let str2 = "' target='_blank'>here</a>"
                link.innerHTML = String(str1 + tempTxHash + str2)
                setError(Object.values(_error)[0])
                if (tempTxHash !== undefined) {
                    swalReact({
                        title: 'Something went wrong!',
                        content: link,
                        icon: 'warning',
                        button: 'Close',
                    })
                }
                if (tempTxHash === undefined) {
                    swalReact({
                        title: 'Something went wrong!',
                        icon: 'warning',
                        button: 'Close',
                    })
                }
                clearForms()
            })
            .on('receipt', (receipt) => {
                setTransactionActive(false)
                setTxStatus(receipt.status)
                tempTxHash = receipt.transactionHash
                let str1 =
                    `Check out your TX <a href='${props.explorer}'`
                let str2 = "' target='_blank'>here</a>"
                link.innerHTML = String(str1 + tempTxHash + str2)
                setTxHash(receipt.transactionHash)
                swalReact({
                    title: 'Transfer Successful!',
                    content: link,
                    icon: 'success',
                    button: 'Close',
                }).then(() => {
                    //refreshBalances()
                    //window.backIndex = assetInfo.dBIndex;
                    window.location.href = assetInfo.lastRef
                    window.replaceAssetData.refreshBals = true
                    window.replaceAssetData = {
                        key: pageKey,
                        newAsset: assetInfo,
                        assetAction: "rem"
                    }
                    window.dispatchEvent(props.refresh)
                })
            })
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
                    <SwapHoriz />
                </CardIcon>
                <Button
                    color="info"
                    className="MLBGradient"
                    onClick={() => goBack()}
                >
                    Go Back
                </Button>
                <h4 className={classes.cardIconTitle}>Transfer Asset</h4>
            </CardHeader>
            <CardBody>
                <form>
                    <h4>Asset Selected: {assetInfo.name}</h4>
                    {!transactionActive && (
                        <>
                            <CustomInput
                                success={loginAddressState === 'success'}
                                error={loginAddressState === 'error'}
                                labelText="Recieving Address *"
                                id="address"
                                formControlProps={{
                                    fullWidth: true,
                                }}
                                inputProps={{
                                    onChange: (event) => {
                                        setAddress(event.target.value.trim())
                                        if (event.target.value !== '') {
                                            setloginAddressState('success')
                                        } else {
                                            setloginAddressState('error')
                                        }
                                        setloginAddress(event.target.value)
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
                            labelText={address.substring(0, 9) + "..." + address.substring(31, 41)}
                            id="middle"
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                disabled: true,
                            }}
                        />
                    )}
                    {!transactionActive && (
                        <div className="MLBGradientSubmit">
                            <Button
                                color="info"
                                className="MLBGradient"
                                onClick={() => transferAsset()}
                            >
                                Transfer Asset
                            </Button>
                        </div>
                    )}
                    {transactionActive && (
                        <h3>
                            Transferring Asset
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
