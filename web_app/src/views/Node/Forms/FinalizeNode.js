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
import Button from 'components/CustomButtons/Button.js'
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'

import styles from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle'
import {
    AssignmentTurnedIn,
    Category,
    CheckCircleOutline,
    KeyboardArrowLeft,
    Security,
    VerifiedUser,
    VpnKey,
} from '@material-ui/icons'
import ARweaveGreyPNG from '../../../assets/img/arweavegrey.png'
import ARweavePNG from '../../../assets/img/arweave.png'
import IPFSPNG from '../../../assets/img/ipfs.png'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'

// import Step1 from "./NodeWizzard/Step1.js";
// import Step2 from "./NodeWizzard/Step2.js";
const useStyles = makeStyles(styles)

export default function FinalizeNode(props) {
    //if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}

    const [transactionActive, setTransactionActive] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [txStatus, setTxStatus] = React.useState(false)
    // eslint-disable-next-line no-unused-vars
    const [txHash, setTxHash] = React.useState('')

    const [managementType, setManagementType] = React.useState('1')
    const [managementType1, setManagementType1] = React.useState(true)
    const [managementType2, setManagementType2] = React.useState(false)
    const [managementType3, setManagementType3] = React.useState(false)
    const [managementType4, setManagementType4] = React.useState(false)
    const [storageType, setStorageType] = React.useState('1')
    const [storageType1, setStorageType1] = React.useState(true)
    const [storageType2, setStorageType2] = React.useState(false)
    const [card1, setCard1] = React.useState(true)
    const [card2, setCard2] = React.useState(false)

    const [nodeInfo] = React.useState(window.sentPacket)

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

    const setManagementType1Button = () => {
        setManagementType('1')
        setManagementType1(true)
        setManagementType2(false)
        setManagementType3(false)
        setManagementType4(false)
    }

    const setManagementType2Button = () => {
        setManagementType('2')
        setManagementType1(false)
        setManagementType2(true)
        setManagementType3(false)
        setManagementType4(false)
    }

    const setManagementType3Button = () => {
        setManagementType('3')
        setManagementType1(false)
        setManagementType2(false)
        setManagementType3(true)
        setManagementType4(false)
    }

    const setManagementType4Button = () => {
        setManagementType('4')
        setManagementType1(false)
        setManagementType2(false)
        setManagementType3(false)
        setManagementType4(true)
    }

    const setStorageType1Button = () => {
        setStorageType('1')
        setStorageType1(true)
        setStorageType2(false)
    }

    const setStorageType2Button = () => {
        setStorageType('2')
        setStorageType1(false)
        setStorageType2(true)
    }

    const nextCard = () => {
        setCard1(false)
        setCard2(true)
        // eslint-disable-next-line react/prop-types
        props.ps.element.scrollTop = 0
    }

    const previousCard = () => {
        setCard1(true)
        setCard2(false)
        // eslint-disable-next-line react/prop-types
        props.ps.element.scrollTop = 0
    }

    const finalizeNode = async () => {
        //transfer held Node
        let tempTxHash

        swalReact({
            icon: 'warning',
            content: (
                <Card className="delegationCard">
                    <h4 className="delegationTitle">
                        Submitted information is immutable!
                    </h4>
                    <h5 className="finalizingTipsContent">
                        Please make sure the following info is correct before
                        submitting! These setting cannot be changed, and you can
                        only finalize a node once!
                    </h5>
                    <div className="delegationTips">
                        <h4 className="alertText">
                            Management Type: &nbsp;
                            {managementType === '1' && <>Private</>}
                            {managementType === '2' && <>Permissive</>}
                            {managementType === '3' && <>Authorized</>}
                            {/* {managementType === '4' && <>Trusted</>} */}
                        </h4>
                    </div>
                    <div className="delegationTips">
                        <h4 className="alertText">
                            Storage Type:
                            {storageType === '1' && (
                                <img src={IPFSPNG} className="IPFS2" alt="" />
                            )}
                            {storageType === '2' && (
                                <img
                                    src={ARweavePNG}
                                    className="ARweave3"
                                    alt=""
                                />
                            )}
                        </h4>
                    </div>
                </Card>
            ),
            buttons: {
                back: {
                    text: 'Go Back',
                    className: 'delegationButtonBack',
                },
                finalize: {
                    text: 'Finalize',
                    className: 'delegationButtonBack',
                },
            },
        }).then((value) => {
            switch (value) {
                case 'finalize':
                    setTransactionActive(true)

                    window.contracts.AC_MGR.methods
                        .updateACImmutable(
                            nodeInfo.id,
                            managementType,
                            storageType,
                            '0x0000000000000000000000000000000000000000'
                        )
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
                                title: 'Node Finalized!',
                                content: link,
                                icon: 'success',
                                button: 'Close',
                            })
                            window.replaceAssetData = { refreshBals: true }
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
                    Finalize Node: {nodeInfo.name}, ID: ({nodeInfo.id})
                </h4>
            </CardHeader>
            {card1 && (
                <Card className="Slider">
                    <CardHeader>
                        <h2 className={classes.cardIconTitle}>
                            Select Management Type
                        </h2>
                    </CardHeader>
                    <GridContainer>
                        <GridItem xs={12} sm={4}>
                            {!managementType1 && (
                                <Button
                                    className="managementType"
                                    color="info"
                                    onClick={() => setManagementType1Button()}
                                >
                                    <VpnKey />
                                    Private
                                </Button>
                            )}
                            {managementType1 && (
                                <Button
                                    className="managementTypeSelected"
                                    onClick={() => setManagementType1Button()}
                                >
                                    <VpnKey />
                                    Private
                                </Button>
                            )}
                            {!managementType2 && (
                                <Button
                                    className="managementType"
                                    color="info"
                                    onClick={() => setManagementType2Button()}
                                >
                                    <Security />
                                    Permissive
                                </Button>
                            )}
                            {managementType2 && (
                                <Button
                                    className="managementTypeSelected"
                                    onClick={() => setManagementType2Button()}
                                >
                                    <Security />
                                    Permissive
                                </Button>
                            )}
                            {!managementType3 && (
                                <Button
                                    className="managementType"
                                    color="info"
                                    onClick={() => setManagementType3Button()}
                                >
                                    <AssignmentTurnedIn />
                                    Authorized
                                </Button>
                            )}
                            {managementType3 && (
                                <Button
                                    className="managementTypeSelected"
                                    onClick={() => setManagementType3Button()}
                                >
                                    <AssignmentTurnedIn />
                                    Authorized
                                </Button>
                            )}
                            {/* {!managementType4 && (
                                <Button
                                    className="managementType"
                                    color="info"
                                    onClick={() => setManagementType4Button()}
                                >
                                    <VerifiedUser />
                                    Trusted
                                </Button>
                            )} */}
                            {/* {managementType4 && (
                                <Button
                                    className="managementTypeSelected"
                                    onClick={() => setManagementType4Button()}
                                >
                                    <VerifiedUser />
                                    Trusted
                                </Button>
                            )} */}
                        </GridItem>
                        <GridItem xs={12} sm={8}>
                            <Card className="slide-right">
                                {managementType1 && (
                                    <>
                                        <h3>Private</h3>
                                        <p>Guaranteed exclusivity.</p>
                                        <p>
                                            The Private management type is by
                                            far the most secure. With exclusive
                                            access to node operations, this type
                                            allows only the node owner to
                                            create, export, or import assets
                                            within the node. This enables a
                                            provably secure pattern for asset
                                            minting. Best suited for creators
                                            and curators.
                                        </p>
                                    </>
                                )}
                                {managementType2 && (
                                    <>
                                        <h3>Permissive</h3>
                                        <p>Flexibility.</p>
                                        <p>
                                            Much like the Private management
                                            type, Permissive management allows
                                            only the node owner to mint or
                                            import assets. This management type
                                            grants slightly more mobility to
                                            asset holders by allowing them to
                                            export their assets to other nodes.
                                        </p>
                                    </>
                                )}
                                {managementType3 && (
                                    <>
                                        <h3>Authorized</h3>
                                        <p>Dynamic Control.</p>
                                        <p>
                                            The Authorized management type is a
                                            robust and secure option, designed
                                            for private businesses or
                                            enterprises. Authorized management
                                            allows the node owner to specify
                                            addresses which can mint, import,
                                            and export assets. Address
                                            authorization can be granted or
                                            revoked by the node owner at any
                                            time.
                                        </p>
                                    </>
                                )}
                                {/* {managementType4 && (
                                    <>
                                        <h3>Trusted</h3>
                                        <p>User-First</p>
                                        <p>
                                            Public management is the
                                            user-sovereign approach. Any user
                                            who holds a verified ID Token may
                                            mint, import, and export assets. May
                                            apply to the management of any
                                            common goods or services.
                                        </p>
                                    </>
                                )} */}
                            </Card>
                        </GridItem>
                    </GridContainer>
                </Card>
            )}
            {card2 && (
                <Card>
                    <CardHeader>
                        <h2 className={classes.cardIconTitle}>
                            Select Storage Provider
                        </h2>
                    </CardHeader>
                    <GridContainer>
                        <GridItem xs={12} sm={4}>
                            {!storageType1 && (
                                <Button
                                    className="managementType"
                                    color="info"
                                    onClick={() => setStorageType1Button()}
                                >
                                    <img
                                        src={IPFSPNG}
                                        className="IPFS2"
                                        alt=""
                                    />
                                </Button>
                            )}
                            {storageType1 && (
                                <Button
                                    className="managementTypeSelected"
                                    onClick={() => setStorageType1Button()}
                                >
                                    <img
                                        src={IPFSPNG}
                                        className="IPFS2"
                                        alt=""
                                    />
                                </Button>
                            )}
                            {!storageType2 && (
                                <Button
                                    className="managementType"
                                    color="info"
                                    onClick={() => setStorageType2Button()}
                                >
                                    <img
                                        src={ARweaveGreyPNG}
                                        className="ARweave3"
                                        alt=""
                                    />
                                </Button>
                            )}
                            {storageType2 && (
                                <Button
                                    className="managementTypeSelected"
                                    onClick={() => setStorageType2Button()}
                                >
                                    <img
                                        src={ARweaveGreyPNG}
                                        className="ARweave3"
                                        alt=""
                                    />
                                </Button>
                            )}
                        </GridItem>
                        <GridItem xs={12} sm={8}>
                            <Card className="slide-right">
                                {storageType1 && (
                                    <>
                                        <a
                                            href="https://ipfs.io/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={IPFSPNG}
                                                className="IPFS3"
                                                alt=""
                                            ></img>
                                        </a>
                                        <p>
                                            The InterPlanetary File System
                                            (IPFS) is a protocol and
                                            peer-to-peer network for storing and
                                            sharing data in a distributed file
                                            system. IPFS allows users to not
                                            only receive but host content, in a
                                            similar manner to BitTorrent.
                                        </p>
                                    </>
                                )}
                                {storageType2 && (
                                    <>
                                        <a
                                            href="https://www.arweave.org/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={ARweavePNG}
                                                className="ARweave4"
                                                alt=""
                                            ></img>
                                        </a>
                                        <p>
                                            A novel data storage blockchain
                                            protocol enabling a permanent
                                            serverless web and creating truly
                                            permanent data storage for the first
                                            time.
                                        </p>
                                    </>
                                )}
                            </Card>
                        </GridItem>
                    </GridContainer>
                </Card>
            )}
            {!transactionActive && (
                <>
                    {card1 && (
                        <div className="MLBGradientSubmit">
                            <Button
                                className="MLBGradient"
                                onClick={() => nextCard()}
                                icon
                            >
                                Next <KeyboardArrowRight />{' '}
                            </Button>
                        </div>
                    )}
                    {card2 && (
                        <div className="MLBGradientSubmit">
                            <Button
                                className="MLBGradient"
                                onClick={() => finalizeNode()}
                                icon
                            >
                                Finish <CheckCircleOutline />{' '}
                            </Button>
                            <Button
                                className="MLBGradient"
                                onClick={() => previousCard()}
                                icon
                            >
                                {' '}
                                <KeyboardArrowLeft />
                                Back
                            </Button>
                        </div>
                    )}
                </>
            )}
            {transactionActive && (
                <h3>
                    Finalizing Node
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
