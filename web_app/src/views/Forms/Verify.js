import React from 'react'
import '../../assets/css/custom.css'
import swal from 'sweetalert'
// import SweetAlert from "react-bootstrap-sweetalert";
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'

// @material-ui/icons
import AccountBox from '@material-ui/icons/AccountBox'

// core components
import CustomInput from 'components/CustomInput/CustomInput.js'
import Button from 'components/CustomButtons/Button.js'
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardBody from 'components/Card/CardBody.js'

import styles from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle'

const useStyles = makeStyles(styles)

export default function Verify(props) {
    // const [checked, setChecked] = React.useState([24, 22])
    // const [selectedEnabled, setSelectedEnabled] = React.useState('b')
    // const [selectedValue, setSelectedValue] = React.useState(null)
  // eslint-disable-next-line no-unused-vars
    const [scanQR, setScanQR] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [result, setResult] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = React.useState('')
    const [transaction, setTransaction] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [QRValue, setQRValue] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [IDXRawInput, setIDXRawInput] = React.useState(false)

  // eslint-disable-next-line no-unused-vars
    const [manufacturer, setManufacturer] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [type, setType] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [model, setModel] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [serial, setSerial] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [IDXRaw, setIDXRaw] = React.useState('')

    // const [loginManufacturer, setloginManufacturer] = React.useState('')
    // const [loginType, setloginType] = React.useState('')
    // const [loginModel, setloginModel] = React.useState('')
    // const [loginSerial, setloginSerial] = React.useState('')
    // const [loginIDX, setloginIDX] = React.useState('')

  // eslint-disable-next-line no-unused-vars
    const [loginManufacturerState, setloginManufacturerState] = React.useState(
        ''
    )
    // eslint-disable-next-line no-unused-vars
    const [loginTypeState, setloginTypeState] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [loginModelState, setloginModelState] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [loginSerialState, setloginSerialState] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [loginIDXState, setloginIDXState] = React.useState('')

    const [first, setFirst] = React.useState('')
    const [middle, setMiddle] = React.useState('')
    const [last, setLast] = React.useState('')
    const [ID, setID] = React.useState('')
    const [password, setPassword] = React.useState('')

    const [loginFirst, setloginFirst] = React.useState('')
    const [loginLast, setloginLast] = React.useState('')
    const [loginID, setloginID] = React.useState('')
    const [loginPassword, setloginPassword] = React.useState('')

    const [loginFirstState, setloginFirstState] = React.useState('')
    const [loginLastState, setloginLastState] = React.useState('')
    const [loginIDState, setloginIDState] = React.useState('')
    const [loginPasswordState, setloginPasswordState] = React.useState('')

  // eslint-disable-next-line no-unused-vars
    const [txHash, setTxHash] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [verifyResult, setVerifyResult] = React.useState('')

    const [assetInfo] = React.useState(window.sentPacket)

    const link = document.createElement('div')

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
    }, [])

    // const handleChange = (event) => {
    //     setSelectedValue(event.target.value)
    // }

    // const handleChangeEnabled = (event) => {
    //     setSelectedEnabled(event.target.value)
    // }

    // const handleToggle = (value) => {
    //     const currentIndex = checked.indexOf(value)
    //     const newChecked = [...checked]

    //     if (currentIndex === -1) {
    //         newChecked.push(value)
    //     } else {
    //         newChecked.splice(currentIndex, 1)
    //     }
    //     setChecked(newChecked)
    // }

    // const handleScanQR = (event) => {
    //     setScanQR(!scanQR)
    //     setQRValue('')
    //     console.log('new value', !scanQR)
    // }

    const clearForms = () => {
        setManufacturer('')
        setType('')
        setModel('')
        setSerial('')
        setIDXRaw('')
        setFirst('')
        setMiddle('')
        setLast('')
        setID('')
        setPassword('')

        setloginManufacturerState('')
        setloginTypeState('')
        setloginModelState('')
        setloginSerialState('')
        setloginIDXState('')
        setloginFirstState('')
        setloginLastState('')
        setloginIDState('')
        setloginPasswordState('')

        setIDXRaw('')
        setIDXRawInput(false)
        setScanQR(false)
        setQRValue('')
        console.log('clearing forms')
        //window.location.href="/#/user/dashboard"
    }

    const verifyAsset = async () => {
        if (
            loginFirst === '' ||
            loginLast === '' ||
            loginID === '' ||
            loginPassword === ''
        ) {
            if (loginFirst === '') {
                setloginFirstState('error')
            }
            if (loginLast === '') {
                setloginLastState('error')
            }
            if (loginID === '') {
                setloginIDState('error')
            }
            if (loginPassword === '') {
                setloginPasswordState('error')
            }
            return
        }

        console.log('in vr')
        // let extendedDataHash
        // let tempResult
        let idxHash = assetInfo.idxHash
        let rgtHashRaw
        let rgtHash

        if (middle === '') {
            rgtHashRaw = window.web3.utils.soliditySha3(
                String(first).replace(/\s/g, ''),
                String(last).replace(/\s/g, ''),
                String(ID).replace(/\s/g, ''),
                String(password).replace(/\s/g, '')
            )
        } else if (middle !== '') {
            rgtHashRaw = window.web3.utils.soliditySha3(
                String(first).replace(/\s/g, ''),
                String(middle).replace(/\s/g, ''),
                String(last).replace(/\s/g, ''),
                String(ID).replace(/\s/g, ''),
                String(password).replace(/\s/g, '')
            )
        }

        rgtHash = window.web3.utils.soliditySha3(
            String(idxHash),
            String(rgtHashRaw)
        )
        rgtHash = window.utils.tenThousandHashesOf(rgtHash)

        console.log('idxHash', idxHash)
        console.log('rgtHash', rgtHash)
        console.log('addr: ', window.addr)
        setTransaction(true)
        await window.contracts.STOR.methods
            ._verifyRightsHolder(idxHash, rgtHash)
            .call(function (_error, _result) {
                if (_error) {
                    console.log(_error)
                    setError(_error)
                    setResult('')
                    setTransaction(false)
                } else if (_result === '0') {
                    console.log('Verification not Confirmed')
                    swal({
                        title: 'Match Failed!',
                        text:
                            'Please make sure forms are filled out correctly.',
                        icon: 'warning',
                        button: 'Close',
                    })
                    setTransaction(false)
                } else {
                    console.log('Verification Confirmed')
                    swal({
                        title: 'Match Confirmed!',
                        // text: "Check your TX here:" + txHash,
                        icon: 'success',
                        button: 'Close',
                    }).then(() => {
                        window.backIndex = assetInfo.dBIndex
                        window.location.href = assetInfo.lastRef
                    })
                    setError('')
                    setTransaction(false)
                }
            })
        return clearForms()
    }

    const goBack = () => {
        window.backIndex = assetInfo.dBIndex
        window.location.href = assetInfo.lastRef
    }

    const blockchainVerifyAsset = async () => {
        if (!window.ethereum) {
            return swal({
                title:
                    'Connect to an ethereum provider to use this functionality!',
                button: 'Close',
            })
        }
        if (
            loginFirst === '' ||
            loginLast === '' ||
            loginID === '' ||
            loginPassword === ''
        ) {
            if (loginFirst === '') {
                setloginFirstState('error')
            }
            if (loginLast === '') {
                setloginLastState('error')
            }
            if (loginID === '') {
                setloginIDState('error')
            }
            if (loginPassword === '') {
                setloginPasswordState('error')
            }
            return
        }

        console.log('in bvr')
        let idxHash = assetInfo.idxHash
        let rgtHash
        let rgtHashRaw
        let receiptVal
        let tempTxHash

        if (middle === '') {
            rgtHashRaw = window.web3.utils.soliditySha3(
                String(first).replace(/\s/g, ''),
                String(last).replace(/\s/g, ''),
                String(ID).replace(/\s/g, ''),
                String(password).replace(/\s/g, '')
            )
        } else if (middle !== '') {
            rgtHashRaw = window.web3.utils.soliditySha3(
                String(first).replace(/\s/g, ''),
                String(middle).replace(/\s/g, ''),
                String(last).replace(/\s/g, ''),
                String(ID).replace(/\s/g, ''),
                String(password).replace(/\s/g, '')
            )
        }

        rgtHash = window.web3.utils.soliditySha3(
            String(idxHash),
            String(rgtHashRaw)
        )
        rgtHash = window.utils.tenThousandHashesOf(rgtHash)

        console.log('idxHash', idxHash)
        console.log('rgtHash', rgtHash)
        // eslint-disable-next-line react/prop-types
        console.log('addr: ', props.addr)
        setTransaction(true)

        await window.contracts.STOR.methods
            .blockchainVerifyRightsHolder(idxHash, rgtHash)
            // eslint-disable-next-line react/prop-types
            .send({ from: props.addr })
            .on('error', function (_error) {
                setTransaction(false)
                tempTxHash = Object.values(_error)[0].transactionHash
                let str1 =
                    "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                let str2 = "' target='_blank'>here</a>"
                link.innerHTML = String(str1 + tempTxHash + str2)
                setTxHash(Object.values(_error)[0].transactionHash)
                console.log(Object.values(_error)[0].transactionHash)
                console.log(_error)
                setError(_error)
            })
            .on('receipt', (receipt) => {
                receiptVal = receipt.events.REPORT.returnValues._msg
                setTransaction(false)
                setTxHash(receipt.transactionHash)
                tempTxHash = receipt.transactionHash
                let str1 =
                    "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                let str2 = "' target='_blank'>here</a>"
                link.innerHTML = String(str1 + tempTxHash + str2)
                setVerifyResult(receiptVal)
                console.log('Verification Result :', receiptVal)

                if (receiptVal === 'Match confirmed') {
                    swal({
                        title: 'Match Confirmed!',
                        content: link,
                        icon: 'success',
                        button: 'Close',
                    }).then(() => {
                        window.backIndex = assetInfo.dBIndex
                        window.location.href = assetInfo.lastRef
                    })
                    console.log('Verification conf')
                }

                if (receiptVal !== 'Match confirmed') {
                    if (tempTxHash !== undefined) {
                        swal({
                            title: 'Match Failed!',
                            content: link,
                            icon: 'warning',
                            button: 'Close',
                        })
                    }
                    if (tempTxHash === undefined) {
                        swal({
                            title: 'Something Went Wrong!',
                            icon: 'warning',
                            button: 'Close',
                        })
                    }
                    console.log('Verification not conf')
                }
            })

        return clearForms()
    }

    const classes = useStyles()

    return (
        <Card>
            <CardHeader color="info" icon>
                <CardIcon color="info" className="DBGradient">
                    <AccountBox />
                </CardIcon>
                <Button
                    color="info"
                    className="MLBGradient"
                    onClick={() => goBack()}
                >
                    Go Back
                </Button>
                <h4 className={classes.cardIconTitle}>Owner Info</h4>
            </CardHeader>
            <CardBody>
                <form>
                    <>
                        {!transaction && (
                            <>
                                <CustomInput
                                    success={loginFirstState === 'success'}
                                    error={loginFirstState === 'error'}
                                    labelText="First Name *"
                                    id="firstName"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        onChange: (event) => {
                                            setFirst(event.target.value.trim())
                                            if (event.target.value !== '') {
                                                setloginFirstState('success')
                                            } else {
                                                setloginFirstState('error')
                                            }
                                            setloginFirst(event.target.value)
                                        },
                                    }}
                                />
                                <CustomInput
                                    labelText="Middle Name"
                                    id="middleName"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        onChange: (event) => {
                                            setMiddle(event.target.value.trim())
                                        },
                                    }}
                                />
                                <CustomInput
                                    success={loginLastState === 'success'}
                                    error={loginLastState === 'error'}
                                    labelText="Last Name *"
                                    id="lastName"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        onChange: (event) => {
                                            setLast(event.target.value.trim())
                                            if (event.target.value !== '') {
                                                setloginLastState('success')
                                            } else {
                                                setloginLastState('error')
                                            }
                                            setloginLast(event.target.value)
                                        },
                                    }}
                                />
                                <CustomInput
                                    success={loginIDState === 'success'}
                                    error={loginIDState === 'error'}
                                    labelText="ID Number *"
                                    id="idNumber"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        onChange: (event) => {
                                            setID(event.target.value.trim())
                                            if (event.target.value !== '') {
                                                setloginIDState('success')
                                            } else {
                                                setloginIDState('error')
                                            }
                                            setloginID(event.target.value)
                                        },
                                    }}
                                />
                                <CustomInput
                                    success={loginPasswordState === 'success'}
                                    error={loginPasswordState === 'error'}
                                    labelText="Password *"
                                    id="password"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        type: 'password',
                                        onChange: (event) => {
                                            setPassword(
                                                event.target.value.trim()
                                            )
                                            if (event.target.value !== '') {
                                                setloginPasswordState('success')
                                            } else {
                                                setloginPasswordState('error')
                                            }
                                            setloginPassword(event.target.value)
                                        },
                                    }}
                                />
                                <div className={classes.formCategory}>
                                    <small>*</small> Required fields
                                </div>
                            </>
                        )}
                        {transaction && (
                            <>
                                <CustomInput
                                    labelText={first}
                                    id="first"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        disabled: true,
                                    }}
                                />
                                <CustomInput
                                    labelText={middle}
                                    id="middle"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        disabled: true,
                                    }}
                                />
                                <CustomInput
                                    labelText={last}
                                    id="last"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        disabled: true,
                                    }}
                                />
                                <CustomInput
                                    labelText={ID}
                                    id="ID"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        disabled: true,
                                    }}
                                />
                                <CustomInput
                                    labelText={password}
                                    id="password"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        type: 'password',
                                        disabled: true,
                                    }}
                                />
                            </>
                        )}
                    </>
                    {!transaction && (
                        <Button
                            color="info"
                            className="MLBGradient"
                            onClick={() => blockchainVerifyAsset()}
                        >
                            Blockchain Verify Owner
                        </Button>
                    )}
                    {!transaction && (
                        <Button
                            color="info"
                            className="MLBGradient"
                            onClick={() => verifyAsset()}
                        >
                            Verify Owner
                        </Button>
                    )}
                    {transaction && (
                        <h3>
                            Verifying Asset
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
