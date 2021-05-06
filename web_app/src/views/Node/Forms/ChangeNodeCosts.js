import React from 'react'
import '../../../assets/css/custom.css'
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
import { LocalOffer } from '@material-ui/icons'

const useStyles = makeStyles(styles)

export default function ChangeNodeCosts(props) {
    if (!window.sentPacket) window.sentPacket = {}

    // eslint-disable-next-line no-unused-vars
    const [error, setError] = React.useState('')
    // eslint-disable-next-line no-unused-vars
    const [showHelp, setShowHelp] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [txStatus, setTxStatus] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [txHash, setTxHash] = React.useState('')
    const [formChanged, setFormChanged] = React.useState(false)
    const [costPacket, setCostPacket] = React.useState({})
    // eslint-disable-next-line no-unused-vars
    const [loginOperation, setloginOperation] = React.useState({})
    // eslint-disable-next-line no-unused-vars
    const [loginOperationState, setloginOperationState] = React.useState({})
    const [transactionActive, setTransactionActive] = React.useState(false)
    const [operationIndex, setOperationIndex] = React.useState('')
    const [
        loginBeneficiaryAddressState,
        setloginBeneficiaryAddressState,
    ] = React.useState('')

    const [nodeInfo] = React.useState(JSON.parse(JSON.stringify(window.sentPacket)))
    const [beneficiaryAddress, setBeneficiaryAddress] = React.useState(
         window.sentPacket.costs[0].beneficiary || ""
    )
    const [
        // eslint-disable-next-line no-unused-vars
        loginBeneficiaryAddress,
        setloginBeneficiaryAddress,
    ] = React.useState(window.sentPacket.costs[0].beneficiary || {})
    // const [operation, setOperation] = React.useState(window.sentPacket.costs.cost1.acthCost);

    const link = document.createElement('div')
    document.body.style.cursor = 'default'

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
        if (nodeInfo === undefined || nodeInfo === null) {
            console.log('No Node found. Rerouting...')
            window.location.href = '/#/user/node-manager'
            window.location.reload()
        }
        console.log(nodeInfo)
        //window.sentPacket = null
    }, [])

    const goBack = () => {
        window.backIndex = nodeInfo.dBIndex
        window.location.href = nodeInfo.lastRef
    }

    const handleChangeCost = (op, val) => {
        if (!formChanged) setFormChanged(true)
        let obj = costPacket
        obj[op] = val
        setCostPacket(obj)
        console.log('op', op, 'val', val)
    }

    const generateCostForm = () => {
        return Object.values(nodeInfo.costs).map((prop, key) => {
            // console.log(key, prop)
            return (
                <>
                    {!transactionActive ? (
                        <CustomInput
                            success={loginOperationState[key + 1] === 'success'}
                            error={loginOperationState[key + 1] === 'error'}
                            labelText={`Operation ${key + 1}`}
                            id={`cost${key + 1}`}
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                type: 'number',
                                defaultValue: prop.node,
                                onChange: (e) => {
                                    handleChangeCost(
                                        e.target.id.substring(
                                            e.target.id.length - 1,
                                            e.target.id.length
                                        ),
                                        e.target.value
                                    )
                                },
                            }}
                        />
                    ) : (
                        <CustomInput
                            labelText={`Operation ${key + 1}`}
                            id=""
                            formControlProps={{
                                fullWidth: true,
                            }}
                            inputProps={{
                                defaultValue: prop.node,
                                disabled: true,
                            }}
                        />
                    )}
                </>
            )
        })
    }

    const changeCosts = (obj, _beneficiaryAddress, index, iteration) => {
        if (!index) {
            index = 1
        }
        console.log(costPacket)
        console.log(Object.values(costPacket).length)
        if(nodeInfo.costs[index-1]){
            console.log(nodeInfo.costs[index-1])
        }
        console.log(nodeInfo)
        console.log(_beneficiaryAddress)
        if (!formChanged) {
            return swal('Costs not changed')
        }

        if (!obj) {
            obj = costPacket
        }

        

        if (!iteration) {
            iteration = 1
        }

        if (!_beneficiaryAddress) {
            _beneficiaryAddress = beneficiaryAddress
        }

        console.log(nodeInfo.costs[index-1].beneficiary)
        console.log(_beneficiaryAddress)
        console.log(Object.values(obj).length, iteration, index)
        console.log(nodeInfo.costs[index-1].beneficiary === _beneficiaryAddress)
        console.log(obj)

        console.log(
            !obj[String(index)] &&
            nodeInfo.costs[index-1].beneficiary ===
            _beneficiaryAddress
            )

        if (
            !obj[String(index)] &&
            nodeInfo.costs[index-1].beneficiary ===
            _beneficiaryAddress
        ) {
            return changeCosts(obj, _beneficiaryAddress, index + 1, iteration)
        }

        let tempTxHash
        setShowHelp(false)
        setTxStatus(false)
        setTxHash('')
        setError(undefined)
        if (!transactionActive) {
            setTransactionActive(true)
        }

        if (!window.web3.utils.isAddress(_beneficiaryAddress)) {
            return swal({
                title: 'Submitted address is not a valid ethereum address!',
                text: 'Please check form and input a valid ethereum address.',
                icon: 'warning',
                button: 'Close',
            })
        }

        setOperationIndex(index)

        let newCost = obj[String(index)] || nodeInfo.costs[index-1].node

        console.log(
            nodeInfo.id,
            String(index),
            window.web3.utils.toWei(String(newCost)),
            _beneficiaryAddress)
        props.prufClient.do
            .setOperationCost(
                nodeInfo.id,
                String(index),
                window.web3.utils.toWei(String(newCost)),
                _beneficiaryAddress
            )
            // eslint-disable-next-line react/prop-types
            .send({ from: props.addr })
            .on('error', function (_error) {
                setFormChanged(false)
                setBeneficiaryAddress('')
                setloginOperation(nodeInfo.costs[iteration].acthCost)
                // setOperation(nodeInfo.costs[`cost${iteration}`].acthCost)
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
                return changeCosts(
                    obj,
                    _beneficiaryAddress,
                    index + 1,
                    iteration + 1
                )
            })
            .on('receipt', (receipt) => {
                setTransactionActive(false)
                setTxStatus(receipt.status)
                tempTxHash = receipt.transactionHash
                let str1 =
                    "Check out your TX <a href='https://kovan.etherscan.io/tx/"
                let str2 = "' target='_blank'>here</a>"
                link.innerHTML = String(str1 + tempTxHash + str2)
                window.replaceAssetData.refreshBals = true
        window.dispatchEvent(props.refresh)
                setTxHash(receipt.transactionHash)
                if (!nodeInfo.costs[index] && iteration + 1 > Object.values(obj).length){
                    console.log("exit")
                    return swal('Cost updates complete!').then(() => {
                        window.location.href = nodeInfo.lastRef
                    })
                } else if (nodeInfo.costs[index].beneficiary === _beneficiaryAddress && iteration + 1 > Object.values(obj).length) {
                    console.log("exit")
                    return swal('Cost updates complete!').then(() => {
                        window.location.href = nodeInfo.lastRef
                    })
                } else {
                    return changeCosts(
                        obj,
                        _beneficiaryAddress,
                        index + 1,
                        iteration + 1
                    )
                }
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
                    <LocalOffer />
                </CardIcon>
                <Button
                    color="info"
                    className="MLBGradient"
                    onClick={() => goBack()}
                >
                    Go Back
                </Button>
                <h4 className={classes.cardIconTitle}>
                    Change Node Operation Costs
                </h4>
            </CardHeader>
            <CardBody>
                <form>
                    {nodeInfo !== null && nodeInfo !== undefined && (
                        <h4>
                            Node Selected: {nodeInfo.name}, ({nodeInfo.id})
                        </h4>
                    )}
                    <>
                        <>
                            {nodeInfo.costs && (
                                <>
                                    {generateCostForm()}
                                    {!transactionActive ? (
                                        <CustomInput
                                            success={
                                                loginBeneficiaryAddressState ===
                                                'success'
                                            }
                                            error={
                                                loginBeneficiaryAddressState ===
                                                'error'
                                            }
                                            labelText="Beneficiary Address *"
                                            id="beneficiaryAddress"
                                            formControlProps={{
                                                fullWidth: true,
                                            }}
                                            inputProps={{
                                                defaultValue:
                                                    nodeInfo.costs[0]
                                                        .beneficiary,
                                                onChange: (event) => {
                                                    setFormChanged(true)
                                                    setBeneficiaryAddress(
                                                        event.target.value.trim()
                                                    )
                                                    if (
                                                        event.target.value !==
                                                        ''
                                                    ) {
                                                        setloginBeneficiaryAddressState(
                                                            'success'
                                                        )
                                                    } else {
                                                        setloginBeneficiaryAddressState(
                                                            'error'
                                                        )
                                                    }
                                                    setloginBeneficiaryAddress(
                                                        event.target.value
                                                    )
                                                },
                                            }}
                                        />
                                    ) : (
                                        <CustomInput
                                            labelText="beneficiary Address *"
                                            id=""
                                            formControlProps={{
                                                fullWidth: true,
                                            }}
                                            inputProps={{
                                                defaultValue: beneficiaryAddress,
                                                disabled: true,
                                            }}
                                        />
                                    )}
                                    <div className={classes.formCategory}>
                                        <small>*</small> Required fields
                                    </div>
                                </>
                            )}
                        </>
                    </>
                    {!transactionActive && (
                        <div className="MLBGradientSubmit">
                            <Button
                                color="info"
                                className="MLBGradient"
                                onClick={() => changeCosts()}
                            >
                                Update Costs
                            </Button>
                        </div>
                    )}
                    {transactionActive && (
                        <h3>
                            Updating operation cost {operationIndex}
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
