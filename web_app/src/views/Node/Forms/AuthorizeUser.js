import React from 'react'
import '../../../assets/css/custom.css'
import swal from 'sweetalert'
import swalReact from '@sweetalert/with-react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'

// core components
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardBody from 'components/Card/CardBody.js'
import Button from 'components/CustomButtons/Button.js'
import CustomInput from 'components/CustomInput/CustomInput.js'

import styles from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle'
import { Category } from '@material-ui/icons'

// import Step1 from "./NodeWizzard/Step1.js";
// import Step2 from "./NodeWizzard/Step2.js";
const useStyles = makeStyles(styles)

export default function AuthorizeUser(props) {
    if (!window.sentPacket) window.sentPacket = {}

    const [transactionActive, setTransactionActive] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [txStatus, setTxStatus] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [txHash, setTxHash] = React.useState('')
    const [address, setAddress] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [loginAddress, setloginAddress] = React.useState('')
    const [loginAddressState, setloginAddressState] = React.useState('')

    // const [userType, setUserType] = React.useState("1");
    // const [userType1, setUserType1] = React.useState(true);
    // const [userType2, setUserType2] = React.useState(false);
    // const [userType3, setUserType3] = React.useState(false);
    // const [card1, setCard1] = React.useState(true);
    // const [card2, setCard2] = React.useState(false);

    const [nodeInfo] = React.useState(JSON.parse(JSON.stringify(window.sentPacket)))

    const link = document.createElement('div')
    document.body.style.cursor = 'default'
    window.sentPacket = null

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
    }, [])

    const classes = useStyles()

    if (nodeInfo === undefined || nodeInfo === null) {
        console.log('No Node found. Rerouting...')
        window.location.href = '/#/user/home'
        window.location.reload()
    }

    const goBack = () => {
        window.backIndex = nodeInfo.dBIndex
        window.location.href = nodeInfo.lastRef
    }

    // const setUserType1Button = () => {
    //     setUserType("1")
    //     setUserType1(true)
    //     setUserType2(false)
    //     setUserType3(false)
    // }

    // const setUserType2Button = () => {
    //     setUserType("2")
    //     setUserType1(false)
    //     setUserType2(true)
    //     setUserType3(false)
    // }

    // const setUserType3Button = () => {
    //     setUserType("5")
    //     setUserType1(false)
    //     setUserType2(false)
    //     setUserType3(true)
    // }

    // const nextCard = () => {
    //     setCard1(false)
    //     setCard2(true)
    //     props.ps.element.scrollTop = 0;
    // }

    // const previousCard = () => {
    //     setCard1(true)
    //     setCard2(false)
    //     props.ps.element.scrollTop = 0;
    // }

    const finalizeNode = () => {
        let tempTxHash
        let addressHash = window.web3.utils.soliditySha3(address)
        //transfer held Node

        swalReact({
            icon: 'warning',
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
                        <h4 className="alertText">User: {` ${address.substring(0, 8)}...${address.substring(34)}`}</h4>
                    </div>
                </Card>
            ),
            buttons: {
                back: {
                    text: 'Go Back',
                    className: 'delegationButtonBack',
                },
                authorize: {
                    text: 'Authorize User',
                    className: 'delegationButtonBack',
                },
            },
        }).then((value) => {
            switch (value) {
                case 'authorize':
                    if (!window.web3.utils.isAddress(address)) {
                        return swal({
                            title: 'Submitted address is not valid!',
                            text:
                                'Please check form and input a valid ethereum address.',
                            icon: 'warning',
                            button: 'Close',
                        })
                    }
                    setTransactionActive(true)

                    props.prufClient.do.node
                        .authorizeUser(nodeInfo.id, addressHash, '1')
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
                            swal({
                                title: 'User Authorized!',
                                content: link,
                                icon: 'success',
                                button: 'Close',
                            })
                            window.replaceAssetData.refreshBals = true
                            window.dispatchEvent(props.refresh)
                            window.location.href = nodeInfo.lastRef
                        })

                    break

                case 'back':
                    break

                default:
                    break
            }
        })
    }

    if (!props.prufClient) {
        return <>
            <Card>
                <CardHeader icon>
                    <CardIcon className="headerIconBack">
                        <Category />
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
        <Card className="finalizeNode">
            <CardHeader icon>
                <CardIcon className="headerIconBack">
                    <Category />
                </CardIcon>
                <Button
                    color="info"
                    className="MLBGradient"
                    onClick={() => goBack()}
                >
                    Go Back
                </Button>
                <h4 className={classes.cardIconTitle}>
                    Authorize User: {nodeInfo.name}, ID: ({nodeInfo.id})
                </h4>
            </CardHeader>
            {/* {card1 && ( */}
            {/* <Card>
                    <CardHeader>
                        <h2 className={classes.cardIconTitle}>Select User</h2>
                    </CardHeader> */}
            <CardBody>
                {!transactionActive && (
                    <>
                        <CustomInput
                            success={loginAddressState === 'success'}
                            error={loginAddressState === 'error'}
                            labelText="User Address *"
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
            </CardBody>
            {!transactionActive && (
                <>
                    {/* {card2 && ( */}
                    <div className="MLBGradientSubmit">
                        <Button
                            className="MLBGradient"
                            onClick={() => finalizeNode()}
                            icon
                        >
                            Authorize
                            {/* <CheckCircleOutline />  */}
                        </Button>
                        {/* <Button className="MLBGradient" onClick={() => previousCard()} icon > <KeyboardArrowLeft />Back</Button> */}
                    </div>
                    {/* // )} */}
                </>
            )}
            {transactionActive && (
                <h3>
                    Authorizing user
                    <div className="lds-ellipsisIF">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </h3>
            )}
        </Card>
    )
}
