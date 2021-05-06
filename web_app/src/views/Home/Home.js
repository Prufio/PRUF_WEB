import React from 'react'
import '../../assets/css/custom.css'
import swal from 'sweetalert'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import CustomInput from 'components/CustomInput/CustomInput.js'

import Eth from '../../assets/img/eth-logo.png'
import Pruf from '../../assets/img/pruftoken.png'
import Add from '@material-ui/icons/Add'
import CheckShield from '@material-ui/icons/VerifiedUser'
import NoAccount from '@material-ui/icons/PersonAdd'

// core components
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import Button from 'components/CustomButtons/Button.js'
import Success from 'components/Typography/Success.js'
import Card from 'components/Card/Card.js'
import CardHeader from 'components/Card/CardHeader.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardBody from 'components/Card/CardBody.js'
import CardFooter from 'components/Card/CardFooter.js'
import Tooltip from '@material-ui/core/Tooltip'

import styles from 'assets/jss/material-dashboard-pro-react/views/dashboardStyle.js'
import '../../assets/css/custom.css'

import { Cached, DashboardOutlined } from '@material-ui/icons'

const useStyles = makeStyles(styles)

export default function Home(props) {
    const classes = useStyles()

    // eslint-disable-next-line no-unused-vars
    const [error, setError] = React.useState('')
    // const [simpleSelect, setSimpleSelect] = React.useState("");
    const [prufTransactionActive, setPrufTransactionActive] = React.useState(
        false
    )
    // const [nodeTransactionActive, setNodeTransactionActive] = React.useState(
    //     false
    // )
    // eslint-disable-next-line no-unused-vars
    const [txStatus, setTxStatus] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [rootName, setRootName] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [txHash, setTxHash] = React.useState('')
    // const [ACPrice, setACPrice] = React.useState("");
    const [isMinting, setIsMinting] = React.useState(false)
    const link = document.createElement('div')
    // eslint-disable-next-line no-unused-vars
    const [isRefreshingEther, setIsRefreshingEther] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [isRefreshingPruf, setIsRefreshingPruf] = React.useState(false)

    const [updatedEther, setUpdatedEther] = React.useState()
    const [updatedPruf, setUpdatedPruf] = React.useState()
    const [updatedAssets, setUpdatedAssets] = React.useState()

    const [deposit, setDeposit] = React.useState(10000)
    const [loginDeposit, setloginDeposit] = React.useState(10000)
    const [loginDepositState, setloginDepositState] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [root, setRoot] = React.useState('')
    // const [loginRoot, setloginRoot] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [loginRootState, setloginRootState] = React.useState('')

    // eslint-disable-next-line no-unused-vars
    const [ACName, setACName] = React.useState('')
    // const [loginACName, setloginACName] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [loginACNameState, setloginACNameState] = React.useState('')

    const [, forceUpdate] = React.useReducer((x) => x + 1, 0)
    const [hasMinted, setHasMinted] = React.useState(false)

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

    // const rootLogin = event => {
    //   setRoot(event.target.value)
    //   if (event.target.value !== "") {
    //     setloginRootState("success");
    //   } else {
    //     setloginRootState("error");
    //   }

    //   setloginRoot(event.target.value);

    //   if (event.target.value === "101") {
    //     setRootName("Electronics")
    //   }
    //   if (event.target.value === "102") {
    //     setRootName("Collectables")
    //   }
    //   if (event.target.value === "103") {
    //     setRootName("Transportation")
    //   }
    //   if (event.target.value === "104") {
    //     setRootName("Virtual")
    //   }
    //   if (event.target.value === "105") {
    //     setRootName("Other")
    //   }
    // };

    const clearPRUFForm = () => {
        setDeposit(10000)

        setloginDepositState('')
    }

    // const clearACFrom = () => {
    //     setRoot('')
    //     setRootName('')
    //     setACName('')

    //     setloginRootState('')
    //     setloginACNameState('')
    // }

    const purchasePRUF = async () => {
        // eslint-disable-next-line react/prop-types
        let etherBal = updatedEther || props.ether
        let tempTxHash

        if (loginDeposit === '' || loginDeposit < 10000) {
            setloginDepositState('error')
            return
        }
        let amount

        if (deposit < 10000) {
            swal({
                title: 'PRUF Amount must be > 10000',
                icon: 'warning',
                button: 'Close',
            })
            return setloginDepositState('error')
        }

        if (deposit > etherBal * 100000) {
            //console.log(props.ether)
            swal({
                title: 'Insufficient KΞ',
                icon: 'warning',
                button: 'Close',
            })
            return setloginDepositState('error')
        } else {
            amount = window.web3.utils.toWei(String(Math.round(deposit)))
        }

        setPrufTransactionActive(true)

        await window.web3.eth
            .sendTransaction({
                // eslint-disable-next-line react/prop-types
                from: props.addr,
                to: '0x50c09a55a18Bb2474bB6025b24B5A8de6aB16468',
                value: amount / 100000,
            })
            .on('error', function (_error) {
                setPrufTransactionActive(false)
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
                clearPRUFForm()
            })
            .on('receipt', (receipt) => {
                setPrufTransactionActive(false)
                setTxStatus(receipt.status)
                tempTxHash = receipt.transactionHash
                let str1 =
                    "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                let str2 = "' target='_blank'>here</a>"
                link.innerHTML = String(str1 + tempTxHash + str2)
                setTxHash(receipt.transactionHash)
                swal({
                    title: 'PRUF Successfully Minted!',
                    content: link,
                    icon: 'success',
                    button: 'Close',
                })
                window.replaceAssetData.refreshBals = true
                refreshBalances()
                forceUpdate()
            })

        console.log(window.ipfs)

        console.log(
        )

        return clearPRUFForm()
    }

    const mintID = () => {
        if (!props.prufClient) return

        // const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)
        let tempTxHash
        setIsMinting(true)

        props.prufClient.do
            .getId()
            // eslint-disable-next-line react/prop-types
            .send({ from: props.addr })
            .on('error', function (_error) {
                setIsMinting(false)
                //setTransactionActive(false);
                //setTxStatus(false);
                //setTxHash(Object.values(_error)[0].transactionHash);
                tempTxHash = Object.values(_error)[0].transactionHash
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
                setIsMinting(false)
                //setTransactionActive(false);
                //setTxStatus(receipt.status);
                tempTxHash = receipt.transactionHash
                let str1 =
                    "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                let str2 = "' target='_blank'>here</a>"
                link.innerHTML = String(str1 + tempTxHash + str2)
                swal({
                    title: 'ID Token Minted!',
                    content: link,
                    icon: 'success',
                    button: 'Close',
                }).then(() => {
                    window.replaceAssetData.refreshBals = true
                    refreshBalances()
                    setHasMinted(true)
                    forceUpdate()
                })
            })
    }

    // const thousandHashesOf = (varToHash) => {
    //     if (!window.web3) return (window.location.href = '/#/user/home')
    //     let tempHash = varToHash
    //     for (let i = 0; i < 1000; i++) {
    //         tempHash = window.web3.utils.soliditySha3(tempHash)
    //         //console.log(tempHash);
    //     }
    //     return tempHash
    // }

    const refreshBalances = async () => {
        if (!props.addr) return
        window.dispatchEvent(props.refresh)
        console.log('Refreshing balances')
        console.log(window.replaceAssetData)

        if (props.prufClient && props.prufClient.get) {
            await window.web3.eth.getBalance(props.addr, (error, result) => {
                if (error) {
                    console.log('error')
                } else {
                    setUpdatedEther(window.web3.utils.fromWei(result, 'ether'))
                }
            })

            // eslint-disable-next-line react/prop-types
            await props.prufClient.get
                // eslint-disable-next-line react/prop-types
                .assetBalance(props.addr)
                .then(e => {
                    setUpdatedAssets(e)
                })

            // eslint-disable-next-line react/prop-types
            await props.prufClient.get
                // eslint-disable-next-line react/prop-types
                .prufBalance(props.addr)
                .then(e => {
                    setUpdatedPruf(e)
                })

            
            forceUpdate()
        } else {
            await window.web3.eth.getBalance(props.addr, (error, result) => {
                if (error) {
                    console.log('error')
                } else {
                    setUpdatedEther(window.web3.utils.fromWei(result, 'ether'))
                }
            })
        }

        // eslint-disable-next-line react/prop-types

    }

    return (
        <div>
            <GridContainer>
                <GridItem xs={12} sm={6} md={6} lg={3}>
                    <Card
                        onClick={() =>
                            (window.location.href = '/#/user/dashboard')
                        }
                    >
                        <CardHeader color="info" stats icon>
                            <CardIcon className="headerIconBack">
                                <DashboardOutlined />
                            </CardIcon>
                            <p className={classes.cardCategory}>Assets Held</p>
                            <Tooltip title="View Assets">
                                {updatedAssets ? (
                                    <h3 className={classes.cardTitle}>
                                        {updatedAssets} <small>Assets</small>
                                    </h3>
                                ) : (
                                    <h3 className={classes.cardTitle}>
                                        {/* eslint-disable-next-line react/prop-types */}
                                        {props.assets} <small>Assets</small>
                                    </h3>
                                )}
                            </Tooltip>
                        </CardHeader>
                        <CardFooter stats>
                            <div className={classes.stats}>
                                <Success>
                                    <Add />
                                </Success>
                                <a
                                    className="homeCardText"
                                    href="/#/user/new-asset"
                                >
                                    Create New Record
                                </a>
                            </div>
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={6} lg={3}>
                    <Card>
                        <CardHeader color="danger" stats icon>
                            {/* eslint-disable-next-line react/prop-types */}
                            {props.IDHolder === true || hasMinted === true ? (
                                <>
                                    <CardIcon
                                        className="headerIconBack"
                                        onClick={() => {
                                            swal({
                                                title:
                                                    'User address is already verified.',
                                                button: 'Okay',
                                            })
                                        }}
                                    >
                                        <CheckShield />
                                    </CardIcon>
                                    <p className={classes.cardCategory}>
                                        User Status
                                    </p>
                                    <Tooltip title="User already holds an ID token.">
                                        <h3 className={classes.cardTitle}>
                                            Verified
                                        </h3>
                                    </Tooltip>
                                </>
                            ) : // eslint-disable-next-line react/prop-types
                                props.IDHolder === false ? (
                                    <>
                                        <CardIcon
                                            className="headerIconBack"
                                            onClick={() => mintID()}
                                        >
                                            <NoAccount />
                                        </CardIcon>
                                        <p className={classes.cardCategory}>
                                            User Status
                                    </p>
                                        <h3 className={classes.cardTitle}>
                                            Not Verified
                                    </h3>
                                    </>
                                ) : (
                                    <>
                                        <CardIcon className="headerIconBack">
                                            <NoAccount />
                                        </CardIcon>
                                        <p className={classes.cardCategory}>
                                            User Status
                                    </p>
                                    </>
                                )}
                        </CardHeader>
                        <CardFooter stats>
                            {/* eslint-disable-next-line react/prop-types */}
                            {props.IDHolder === true || hasMinted === true ? (
                                <>
                                    <div className={classes.stats}>
                                        User Holds ID
                                    </div>
                                </>
                            ) : // eslint-disable-next-line react/prop-types
                                props.IDHolder === false ? (
                                    !isMinting ? (
                                        <>
                                            <button
                                                className="homeCardText"
                                                onClick={() => mintID}
                                            >
                                                No ID held by user
                                        </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className={classes.stats}>
                                                <div className="lds-ellipsisCard">
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <div className={classes.stats}>
                                            <div className="lds-ellipsisCard">
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </div>
                                    </>
                                )}
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={6} lg={3}>
                    <Card>
                        <CardHeader stats icon>
                            <CardIcon
                                className="headerIconBack"
                                onClick={() =>
                                    window.open('https://ethereum.org/en/')
                                }
                            >
                                <img className="Icon" src={Eth} alt=""></img>
                            </CardIcon>
                            <p className={classes.cardCategory}>ETH Balance</p>
                            {updatedEther ? (
                                <h3 className={classes.cardTitle}>
                                    {updatedEther.substring(0, 7)}{' '}
                                </h3>
                            ) : // eslint-disable-next-line react/prop-types
                                props.ether ? (
                                    <h3 className={classes.cardTitle}>
                                        {/* eslint-disable-next-line react/prop-types */}
                                        {props.ether.substring(0, 7)}{' '}
                                    </h3>
                                ) : (
                                    <h3 className={classes.cardTitle}>
                                        ~
                                    </h3>
                                )}
                        </CardHeader>
                        <CardFooter stats>
                            {!isRefreshingEther && (
                                <div className="refresh">
                                    <Cached onClick={() => {window.replaceAssetData.refreshBals = true; refreshBalances()}} />
                                </div>
                            )}
                            {isRefreshingEther && (
                                <div className={classes.stats}>
                                    <div className="lds-ellipsisCard">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={6} lg={3}>
                    <Card>
                        <CardHeader color="danger" stats icon>
                            <CardIcon
                                className="headerIconBack"
                                onClick={() => window.open('https://pruf.io/')}
                            >
                                <img className="Icon" src={Pruf} alt=""></img>
                            </CardIcon>
                            <p className={classes.cardCategory}>PRUF Balance</p>
                            {updatedPruf ? (
                                <h3 className={classes.cardTitle}>
                                    <>
                                        {String(
                                            Math.round(
                                                Number(updatedPruf) * 100
                                            ) / 100
                                        )}{' '}
                                    </>
                                </h3>
                            ) : (
                                <h3 className={classes.cardTitle}>
                                    {/* eslint-disable-next-line react/prop-types */}
                                    {props.pruf !== '~' ? (
                                        <>
                                            {/* eslint-disable-next-line react/prop-types */}
                                            {String(
                                                Math.round(
                                                    // eslint-disable-next-line react/prop-types
                                                    Number(props.pruf) * 100
                                                ) / 100
                                            )}{' '}
                                        </>
                                    ) : (
                                        <>
                                            {/* eslint-disable-next-line react/prop-types */}
                                            {props.pruf} 
                                        </>
                                    )}
                                </h3>
                            )}
                        </CardHeader>
                        <CardFooter stats>
                            {!isRefreshingPruf && (
                                <div className="refresh">
                                    <Cached onClick={() => refreshBalances()} />
                                </div>
                            )}
                            {isRefreshingPruf && (
                                <div className={classes.stats}>
                                    <div className="lds-ellipsisCard">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
            <br />
            <Card>
                <CardHeader color="info" icon>
                    <CardIcon className="headerIconBack">
                        <img className="IconFaucet" src={Pruf} alt=""></img>
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>
                        PRUF Faucet (Kovan Testnet Only)
                    </h4>
                </CardHeader>
                {/* eslint-disable-next-line react/prop-types */}
                {!props.addr && (
                    <CardBody>
                        <form>
                            <h3 className="bump">
                                <br />
                                Please <a onClick={() => {
                                    if (window.ethereum) {
                                        window.ethereum
                                            .request({
                                                method: "eth_accounts",
                                                params: {},
                                            })
                                            .then(async (accounts) => {
                                                console.log(window.web3.utils.toChecksumAddress(accounts[0]));
                                                //setIsMounted(true);
                                                //awaitPrufInit(_prufClient, window.web3.utils.toChecksumAddress(accounts[0]))
                                            });
                                    } else swal("No ethereum provider detected")
                                }}>connect</a> to an Ethereum provider.
                            </h3>
                        </form>
                    </CardBody>
                )}
                {/* eslint-disable-next-line react/prop-types */}
                {props.prufClient === undefined && props.addr && (
                    <CardBody>
                        <form>
                            <h3>
                                Connecting to the blockchain
                                <div className="lds-ellipsisIF">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </h3>
                        </form>
                    </CardBody>
                )}

                {/* eslint-disable-next-line react/prop-types */}
                {props.prufClient !== undefined && props.prufClient !== {} && props.addr && (
                    <CardBody>
                        <form>
                            <h4>Conversion Rate: ü100,000/1 Kovan Ether</h4>
                            <h5>Minimum Purchase Amount is ü10,000</h5>
                            {!prufTransactionActive && (
                                <>
                                    <CustomInput
                                        success={
                                            loginDepositState === 'success'
                                        }
                                        error={loginDepositState === 'error'}
                                        labelText="PRUF Amount Request *"
                                        id="pruf"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            onChange: (event) => {
                                                setDeposit(
                                                    event.target.value.trim()
                                                )
                                                if (
                                                    event.target.value !== '' &&
                                                    event.target.value >= 10000
                                                ) {
                                                    setloginDepositState(
                                                        'success'
                                                    )
                                                } else {
                                                    setloginDepositState(
                                                        'error'
                                                    )
                                                }
                                                setloginDeposit(
                                                    event.target.value
                                                )
                                            },
                                            type: 'number',
                                            defaultValue: deposit,
                                        }}
                                    />
                                    <div className={classes.formCategory}>
                                        <small>*</small> Required fields
                                    </div>
                                </>
                            )}
                            {prufTransactionActive && (
                                <>
                                    <CustomInput
                                        labelText={deposit}
                                        id="deposit"
                                        formControlProps={{
                                            fullWidth: true,
                                        }}
                                        inputProps={{
                                            disabled: true,
                                        }}
                                    />
                                </>
                            )}
                            {!prufTransactionActive && (
                                <div className="MLBGradientSubmit">
                                    <Button
                                        color="info"
                                        className="MLBGradient"
                                        onClick={() => purchasePRUF()}
                                    >
                                        Get PRUF
                                    </Button>
                                </div>
                            )}
                            {prufTransactionActive && (
                                <h3>
                                    Getting PRUF from the faucet
                                    <div className="lds-ellipsisIF">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </h3>
                            )}
                        </form>
                    </CardBody>
                )}
            </Card>
        </div>
    )
}
