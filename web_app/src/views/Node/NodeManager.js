import React from 'react'
import ChartistGraph from 'react-chartist'
import '../../assets/css/custom.css'
import swalReact from '@sweetalert/with-react'
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
// @material-ui/icons
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Tooltip from "@material-ui/core/Tooltip";
import MenuItem from '@material-ui/core/MenuItem'
// core components
import GridContainer from 'components/Grid/GridContainer.js'
import GridItem from 'components/Grid/GridItem.js'
import Button from 'components/CustomButtons/Button.js'
import Card from 'components/Card/Card.js'
import CardBody from 'components/Card/CardBody.js'
import CardIcon from 'components/Card/CardIcon.js'
import CardHeader from 'components/Card/CardHeader.js'
import ReactTable from 'components/ReactTable/ReactTable.js'
import ReactTableSimple from 'components/ReactTable/ReactTableSimple.js'
import CardFooter from 'components/Card/CardFooter.js'
import TextField from '@material-ui/core/TextField'
import {
    AccountBalance,
    AccountBalanceWallet,
    BarChartRounded,
    Dashboard,
    FiberManualRecordTwoTone,
    ListAltRounded,
    MultilineChart,
    Settings,
    ShowChart,
    VpnKey,
} from '@material-ui/icons'
import Danger from 'components/Typography/Danger'
import Pruf from '../../assets/img/pruftoken.png'
import { simpleBarChart, pieChart } from 'variables/charts.js'
import styles from 'assets/jss/material-dashboard-pro-react/views/dashboardStyle.js'
import chartStyles from 'assets/jss/material-dashboard-pro-react/views/chartsStyle.js'
import swal from 'sweetalert'
import { isMobile } from 'react-device-detect'
// import { tooltip } from 'assets/jss/material-dashboard-pro-react'

// const styles = {
//   cardIconTitle: {
//     ...cardTitle,
//     marginTop: "15px",
//     marginBottom: "0px"
//   }
// };

const useStyles = makeStyles(styles)
const useChartStyles = makeStyles(chartStyles)

export default function NodeManager(props) {
    // eslint-disable-next-line no-unused-vars
    const [simpleSelect, setSimpleSelect] = React.useState('')
    const [dash, setDash] = React.useState(true)
    const [delegation, setDelegation] = React.useState(false)
    const [analytics, setAnalytics] = React.useState(false)
    const [rewards, setRewards] = React.useState(true)
    // const [selectedNodeObj, setSelectedNodeObj] = React.useState({})
    const [totalRewards, setTotalRewards] = React.useState(false)
    const [delegationAmount, setDelegationAmount] = React.useState('')
    // const [actionState, setActionState] = React.useState({})
    const [forceReload] = React.useState(true)
    const [resetToDefault, setResetToDefault] = React.useState("")

    const classes = useStyles()
    const chartClasses = useChartStyles()

    const [delegationList, setDelegationList] = React.useState([
        ['Loading Nodes...', '~', '~', '~'],
    ])

    const actionInput = React.useRef();

    const thousandHashesOf = (varToHash) => {
        if (!window.web3.utils) return (window.location.href = '/#/user/home')
        let tempHash = varToHash
        for (let i = 0; i < 1000; i++) {
            tempHash = window.web3.utils.soliditySha3(tempHash)
            //console.log(tempHash);
        }
        return tempHash
    }

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
        //getNodesInWallet()
    }, [])

    const buildDelegationList = () => {
        let _delegationList = []
        // eslint-disable-next-line react/prop-types
        if (!props.nodeSets || !props.rootNames) return

        // eslint-disable-next-line react/prop-types
        for (let i = 0; i < Object.values(props.nodeSets).length; i++) {
            for (
                let x = 0;
                // eslint-disable-next-line react/prop-types
                x < Object.values(props.nodeSets)[i].length;
                x++
            ) {
                _delegationList.push([
                    // eslint-disable-next-line react/prop-types
                    props.rootNames[i],
                    // <button onClick={() => handleSimple({ name: props.rootNames[i], index: key, href: "view", id: Object.values(props.nodeSets)[i][x].id })}>{props.rootNames[i]}</Button>,
                    // eslint-disable-next-line react/prop-types
                    Object.values(props.nodeSets)[i][x].name,
                    // eslint-disable-next-line react/prop-types
                    Object.values(props.nodeSets)[i][x].id,
                    'N/A',
                    'N/A',
                ])
            }
        }

        setDelegationList(_delegationList)
    }
    // const [delegationData, setDelegationData] = React.useState(
    //   dataTable.dataRowsDelegation.map((prop, key) => {
    //     return {
    //       id: key,
    //       name: prop[0],
    //       nodeId: prop[1],
    //       totalStaked: prop[2],
    //       transactionsPerEpoch: prop[3],
    //       actions: (
    //         // we've added some custom button actions
    //         <div className="actions-right">
    //           {/* use this button to add a like kind of action */}
    //           <Button
    //             // justIcon
    //             // round
    //             simple
    //             onClick={() => {
    //               let obj = delegationData.find(o => o.id === key);
    //               alert(
    //                 "You've clicked LIKE button on \n{ \nName: " +
    //                 obj.name +
    //                 ", \nposition: " +
    //                 obj.position +
    //                 ", \noffice: " +
    //                 obj.office +
    //                 ", \nage: " +
    //                 obj.age +
    //                 "\n}."
    //               );
    //             }}
    //             color="info"
    //             className="like"
    //           >
    //             Delegate
    //           </Button>{" "}
    //         </div>
    //       )
    //     };
    //   })
    // );

    const setDashButton = () => {
        setDash(true)
        setDelegation(false)
        setAnalytics(false)
    }

    const setDelegationButton = () => {
        // setDash(false)
        // setDelegation(true)
        // setAnalytics(false)
        swal('Coming Soon!')
    }

    const setAnalyticsButton = () => {
        // setDash(false)
        // setDelegation(false)
        swal('Coming Soon!')
    }

    const setRewardsButton = () => {
        setRewards(true)
        setTotalRewards(false)
    }

    const setTotalRewardsButton = () => {
        setRewards(false)
        setTotalRewards(true)
    }

    // const clearInput = () => {
    // }

    const handleSimple = (e) => {
        console.log(e)
        if (!e) return
        let index = e.index
        if (e.href === "view") {
            if (e.name === "" || e.name === "Loading Nodes...") return;
            document.body.style.cursor = 'wait'
            let tempObj = {}
            console.log('props.nodeExtData', props.nodeExtData)

            // eslint-disable-next-line react/prop-types
            props.prufClient.get.node.name(props.nodeExtData[index].root)
                .then(e => {
                    tempObj.name = props.nodeExtData[index].name
                    tempObj.id = props.nodeExtData[index].id
                    tempObj.rootName = e
                        .toLowerCase()
                        .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                            letter.toUpperCase()
                        )
                    tempObj.root = props.nodeExtData[index].root
                    tempObj.managementType =
                        props.nodeExtData[index].managementType
                    tempObj.storageProvider =
                        props.nodeExtData[index].storageProvider
                    console.log('tempObj', tempObj)
                    document.body.style.cursor = 'auto'
                    swalReact({
                        content: (
                            <Card className="delegationCard">
                                <h4 className="delegationTitle">
                                    Node Information
                                    </h4>
                                <div className="delegationTips">
                                    <FiberManualRecordTwoTone className="delegationPin" />
                                    <h5 className="delegationTipsContent">
                                        Name:&nbsp;{tempObj.name} ID:(
                                            {tempObj.id})
                                        </h5>
                                </div>
                                <div className="delegationTips">
                                    <FiberManualRecordTwoTone className="delegationPin" />
                                    <h5 className="delegationTipsContent">
                                        Root Node:&nbsp;
                                        {tempObj.rootName} ID:(
                                            {tempObj.root})
                                        </h5>
                                </div>
                                <div className="delegationTips">
                                    <FiberManualRecordTwoTone className="delegationPin" />
                                    <h5 className="delegationTipsContent">
                                        Management Type:&nbsp;
                                        {tempObj.managementType}
                                    </h5>
                                </div>
                                <div className="delegationTips">
                                    <FiberManualRecordTwoTone className="delegationPin" />
                                    <h5 className="delegationTipsContent">
                                        Storage Provider:&nbsp;
                                        {tempObj.storageProvider}
                                    </h5>
                                </div>
                            </Card>
                        ),
                        buttons: {
                            close: {
                                text: 'Close',
                                className: 'delegationButtonBack',
                            },
                        },
                    }).then((value) => {
                        switch (value) {
                            case 'close':
                                setResetToDefault("")
                                break;

                            default:
                                break
                        }
                    })
                })
        } else {
            document.body.style.cursor = 'wait'
            // eslint-disable-next-line react/prop-types
            if (props.ps) {
                // eslint-disable-next-line react/prop-types
                props.ps.element.scrollTop = 0
                //console.log(props.ps.element.scrollTop)
            }
            let tempObj = JSON.parse(JSON.stringify(e))
            let costs = [];
            tempObj.lastRef = '/#/user/node-manager'
            tempObj.root = props.nodeExtData[index].root
            tempObj.id = props.nodeExtData[index].id
            tempObj.name = props.nodeExtData[index].name
            tempObj.custodyType = props.nodeExtData[index].custodyType
            tempObj.managementType = props.nodeExtData[index].managementType
            tempObj.discount = props.nodeExtData[index].discount
            tempObj.referenceAddress = props.nodeExtData[index].referenceAddress
            tempObj.index = index
            getAllCosts(tempObj)
        }
    }

    const getAllCosts = (obj, costs, iteration) => {
        if (!obj) return
        if (!costs) costs = [];
        if (!iteration) iteration = 1

        if (iteration >= 9) {
            obj.costs = costs;
            window.sentPacket = JSON.parse(JSON.stringify(obj))
            console.log(obj)
            console.log(window.sentPacket)
            setSimpleSelect(obj)
            return (window.location.href = obj.href)
        }

        props.prufClient.get.node.invoiceForOperation(String(obj.id), String(iteration)).then((e) => {
            costs.push(e)
            return getAllCosts(obj, costs, iteration + 1)
        })

    }

    const handleDelegation = (e) => {
        // eslint-disable-next-line react/prop-types
        if (props.ps) {
            // eslint-disable-next-line react/prop-types
            props.ps.element.scrollTop = 0
            //console.log(props.ps.element.scrollTop)
        }

        swalReact({
            content: (
                <Card className="delegationCard">
                    <h4 className="delegationTitle">Delegation Confirmation</h4>
                    <div className="delegationTips">
                        <FiberManualRecordTwoTone className="delegationPin" />
                        <h5 className="delegationTipsContent">
                            You can delegate to as many nodes as you want.
                        </h5>
                    </div>
                    <div className="delegationTips">
                        <FiberManualRecordTwoTone className="delegationPin" />
                        <h5 className="delegationTipsContent">
                            You can un-delegate at any time.
                        </h5>
                    </div>
                    <div className="delegationInfoSec">
                        <h4 className="delegationInfo">Node Name :</h4>
                        <h4>{e.name}</h4>
                    </div>
                    <div className="delegationInfoSec">
                        <h4 className="delegationInfo">Node ID :</h4>
                        <h4>{e.id}</h4>
                    </div>
                    <span className="currencyDignifier"> = PRüF</span>
                    <TextField
                        onChange={(e) => {
                            setDelegationAmount(e.target.value)
                        }}
                        id="outlined-full-width"
                        label="Amount"
                        // eslint-disable-next-line react/prop-types
                        defaultValue={Number(props.pruf).toFixed(2)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                    />
                    <TextField
                        // onChange={(e) => { handleName(e.target.value) }}
                        id="outlined-full-width"
                        label="Password"
                        // defaultValue={newAssetInfo.name}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                    />
                </Card>
            ),
            buttons: {
                back: {
                    text: 'Back',
                    value: 'back',
                    className: 'delegationButtonBack',
                },
                delete: {
                    text: 'Delegate',
                    value: 'delegate',
                    className: 'delegationButtonDelegate',
                },
            },
        }).then((value) => {
            switch (value) {
                case 'delegate':
                    // eslint-disable-next-line react/prop-types
                    if (delegationAmount > props.pruf) {
                        return swal('Insufficient Balance.')
                    }
                    swal('Delegation Set!')
                    break

                case 'back':
                    break

                default:
                    return
            }
        })
    }
    return (
        <GridContainer>
            <GridItem xs={12}>
                <Card>
                    <CardHeader icon className="nodeHeader">
                        <CardIcon className="headerIconBack">
                            <AccountBalance />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Node Manager</h4>
                        {dash && (
                            <Button className="nodeButtonActive">
                                <Dashboard />
                                Dashboard
                            </Button>
                        )}
                        {!dash && (
                            <Button
                                className="nodeButton"
                                onClick={() => {
                                    setDashButton(true)
                                }}
                            >
                                <Dashboard />
                                Dashboard
                            </Button>
                        )}
                        {analytics && (
                            <Button className="nodeButtonActive">
                                <BarChartRounded />
                                Analytics
                            </Button>
                        )}
                        {!analytics && (
                            <Button
                                className="nodeButton"
                                onClick={() => {
                                    setAnalyticsButton(true)
                                }}
                            >
                                <BarChartRounded />
                                Analytics
                            </Button>
                        )}
                        {delegation && (
                            <Button className="nodeButtonActive">
                                <ListAltRounded />
                                Delegation List
                            </Button>
                        )}
                        {!delegation && (
                            <Button
                                className="nodeButton"
                                onClick={() => {
                                    setDelegationButton(true)
                                }}
                            >
                                <ListAltRounded />
                                Delegation List
                            </Button>
                        )}
                    </CardHeader>
                    {/* <br/> */}
                </Card>
                <Card>
                    <CardBody>
                        {dash && !delegation && !analytics && !isMobile && (
                            <ReactTableSimple
                                columns={[
                                    {
                                        Header: 'Name',
                                        accessor: 'name',
                                    },
                                    {
                                        Header: 'Node ID',
                                        accessor: 'nodeId',
                                    },
                                    {
                                        Header: 'Total Delegated',
                                        accessor: 'totalDelegated',
                                    },
                                    {
                                        Header: 'Transaction Count',
                                        accessor: 'transactionsPerEpoch',
                                    },
                                    {
                                        Header: 'Actions',
                                        accessor: 'actions',
                                    },
                                ]}
                                data={props.heldNodeData.map((prop, key) => {
                                    return {
                                        id: key,
                                        name: prop[0] === 'No nodes held by user' || prop[0] === '' || prop[0] === 'Loading Nodes...' ? prop[0] : <button className="nodeButton2" onClick={() => handleSimple({ name: prop[0], index: key, href: "view" })}>{` ${prop[0]} `}</button>,
                                        nodeId: prop[1],
                                        totalDelegated: prop[2],
                                        transactionsPerEpoch: prop[3],
                                        actions: (
                                            // we've added some custom button actions
                                            <div className="actions-right">
                                                {/* use this button to add a like kind of action */}

                                                {prop[0] ===
                                                    'No nodes held by user' && (
                                                        <Button
                                                            simple
                                                            onClick={() => {
                                                                window.location.href =
                                                                    '/#/user/create-node'
                                                            }}
                                                            color="info"
                                                            className="like"
                                                        >
                                                            Create Node
                                                        </Button>
                                                    )}
                                                {prop[0] ===
                                                    'Loading Nodes...' && (
                                                        <Button
                                                            disabled
                                                            simple
                                                            onClick={() => {
                                                                window.location.href =
                                                                    '/#/user/create-node'
                                                            }}
                                                            color="info"
                                                            className="like"
                                                        >
                                                            Create Node
                                                        </Button>
                                                    )}
                                                {prop[0] === '' && (
                                                    <Button
                                                        simple
                                                        onClick={() => {
                                                            window.location.href =
                                                                '/#/user/create-node'
                                                        }}
                                                        color="info"
                                                        className="like"
                                                    >
                                                        Create Node
                                                    </Button>
                                                )}
                                                {prop[0] !==
                                                    'No nodes held by user' &&
                                                    prop[0] !==
                                                    'Loading Nodes...' &&
                                                    prop[0] !== '' && (
                                                        <form>
                                                            <FormControl className="nodeOptions">
                                                                <InputLabel className="functionSelectorText">
                                                                    <Danger>
                                                                        <Settings className="functionSelectorIcon" />
                                                                    </Danger>
                                                                    Options
                                                                </InputLabel>
                                                                <Select
                                                                    ref={actionInput}
                                                                    MenuProps={{
                                                                        className:
                                                                            classes.selectMenu,
                                                                    }}
                                                                    classes={{
                                                                        select:
                                                                            classes.select,
                                                                    }}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleSimple({
                                                                            name: prop[0],
                                                                            id: prop[1],
                                                                            index: key,
                                                                            href: e.target.value
                                                                        })
                                                                    }
                                                                    inputProps={{
                                                                        name:
                                                                            'simpleSelect',
                                                                        id: `simpleSelectDefault${key}`,
                                                                    }}
                                                                >
                                                                    <MenuItem
                                                                        id={`selectDefault${key}`}
                                                                        disabled
                                                                        classes={{
                                                                            root:
                                                                                classes.selectMenuItem,
                                                                        }}
                                                                    >
                                                                        Select
                                                                        an
                                                                        option
                                                                        from the
                                                                        list
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        id="ChangeName"
                                                                        classes={{
                                                                            root:
                                                                                classes.selectMenuItem,
                                                                            selected:
                                                                                classes.selectMenuItemSelected,
                                                                        }}
                                                                        value={'/#/user/change-name'}
                                                                    >
                                                                        Change
                                                                        Name
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        classes={{
                                                                            root:
                                                                                classes.selectMenuItem,
                                                                            selected:
                                                                                classes.selectMenuItemSelected,
                                                                        }}
                                                                        value={'/#/user/change-node-data'}
                                                                    >
                                                                        Update
                                                                        Data
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        id={`changecosts${key}`}
                                                                        classes={{
                                                                            root:
                                                                                classes.selectMenuItem,
                                                                            selected:
                                                                                classes.selectMenuItemSelected,
                                                                        }}
                                                                        value={'/#/user/change-costs'}
                                                                    >
                                                                        Update
                                                                        Operation
                                                                        Costs
                                                                    </MenuItem>
                                                                    {props.nodeExtData[
                                                                        key
                                                                    ] &&
                                                                        props.nodeExtData[
                                                                            key
                                                                        ]
                                                                            .managementType ===
                                                                        '3' && (
                                                                            <MenuItem
                                                                                id={`authuser${key}`}
                                                                                classes={{
                                                                                    root:
                                                                                        classes.selectMenuItem,
                                                                                    selected:
                                                                                        classes.selectMenuItemSelected,
                                                                                }}
                                                                                value={'/#/user/authorize-user'}
                                                                            >
                                                                                Authorize
                                                                                User
                                                                            </MenuItem>
                                                                        )}
                                                                    <MenuItem
                                                                        id={`transfer${key}`}
                                                                        classes={{
                                                                            root:
                                                                                classes.selectMenuItem,
                                                                            selected:
                                                                                classes.selectMenuItemSelected,
                                                                        }}
                                                                        value={'/#/user/transfer-node'}
                                                                    >
                                                                        Transfer
                                                                    </MenuItem>
                                                                    {props.nodeExtData[
                                                                        key
                                                                    ] &&
                                                                        props.nodeExtData[
                                                                            key
                                                                        ]
                                                                            .managementType ===
                                                                        '255' && (
                                                                            <MenuItem
                                                                                id={`finalize${key}`}
                                                                                classes={{
                                                                                    root:
                                                                                        classes.selectMenuItem,
                                                                                    selected:
                                                                                        classes.selectMenuItemSelected,
                                                                                }}
                                                                                value={'/#/user/finalize-node'}
                                                                            >
                                                                                Finalize
                                                                            </MenuItem>
                                                                        )}
                                                                </Select>
                                                            </FormControl>
                                                        </form>
                                                    )}
                                            </div>
                                        ),
                                    }
                                })
                                }
                            />
                        )}
                        {dash && !delegation && !analytics && isMobile && (
                            <ReactTableSimple
                                columns={[
                                    {
                                        Header: 'Name',
                                        accessor: 'name',
                                    },
                                    {
                                        Header: 'Actions',
                                        accessor: 'actions',
                                    },
                                ]}
                                data={props.heldNodeData.map((prop, key) => {
                                    return {
                                        id: key,
                                        name: prop[0] === 'No nodes held by user' || prop[0] === '' || prop[0] === 'Loading Nodes...' ? prop[0] : <button className="nodeButton2" onClick={() => handleSimple({ name: prop[0], index: key, href: "view" })}>{` ${prop[0]} `}</button>,
                                        actions: (
                                            // we've added some custom button actions
                                            <div className="actions-right">
                                                {/* use this button to add a like kind of action */}

                                                {prop[0] ===
                                                    'No nodes held by user' && (
                                                        <Button
                                                            simple
                                                            onClick={() => {
                                                                window.location.href =
                                                                    '/#/user/create-node'
                                                            }}
                                                            color="info"
                                                            className="like"
                                                        >
                                                            Create Node
                                                        </Button>
                                                    )}
                                                {prop[0] ===
                                                    'Loading Nodes...' && (
                                                        <Button
                                                            disabled
                                                            simple
                                                            onClick={() => {
                                                                window.location.href =
                                                                    '/#/user/create-node'
                                                            }}
                                                            color="info"
                                                            className="like"
                                                        >
                                                            Create Node
                                                        </Button>
                                                    )}
                                                {prop[0] === '' && (
                                                    <Button
                                                        simple
                                                        onClick={() => {
                                                            window.location.href =
                                                                '/#/user/create-node'
                                                        }}
                                                        color="info"
                                                        className="like"
                                                    >
                                                        Create Node
                                                    </Button>
                                                )}
                                                {prop[0] !==
                                                    'No nodes held by user' &&
                                                    prop[0] !==
                                                    'Loading Nodes...' &&
                                                    prop[0] !== '' && (
                                                        <form>
                                                            <FormControl className="nodeOptions">
                                                                <InputLabel className="functionSelectorText">
                                                                    <Danger>
                                                                        <Settings className="functionSelectorIcon" />
                                                                    </Danger>
                                                                    Options
                                                                </InputLabel>
                                                                <Select
                                                                    MenuProps={{
                                                                        className:
                                                                            classes.selectMenu,
                                                                    }}
                                                                    classes={{
                                                                        select:
                                                                            classes.select,
                                                                    }}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleSimple(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    inputProps={{
                                                                        name:
                                                                            'simpleSelect',
                                                                        id: '',
                                                                    }}
                                                                >
                                                                    <MenuItem
                                                                        disabled
                                                                        classes={{
                                                                            root:
                                                                                classes.selectMenuItem,
                                                                        }}
                                                                    >
                                                                        Select
                                                                        an
                                                                        option
                                                                        from the
                                                                        list
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        classes={{
                                                                            root:
                                                                                classes.selectMenuItem,
                                                                            selected:
                                                                                classes.selectMenuItemSelected,
                                                                        }}
                                                                        value={{
                                                                            href:
                                                                                '/#/user/change-name',
                                                                            name:
                                                                                prop[0],
                                                                            id:
                                                                                prop[1],
                                                                            index: key,
                                                                        }}
                                                                    >
                                                                        Change
                                                                        Name
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        classes={{
                                                                            root:
                                                                                classes.selectMenuItem,
                                                                            selected:
                                                                                classes.selectMenuItemSelected,
                                                                        }}
                                                                        value={{
                                                                            href:
                                                                                '/#/user/change-data',
                                                                            name:
                                                                                prop[0],
                                                                            id:
                                                                                prop[1],
                                                                            index: key,
                                                                        }}
                                                                    >
                                                                        Update
                                                                        Data
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        classes={{
                                                                            root:
                                                                                classes.selectMenuItem,
                                                                            selected:
                                                                                classes.selectMenuItemSelected,
                                                                        }}
                                                                        value={{
                                                                            href:
                                                                                '/#/user/change-costs',
                                                                            name:
                                                                                prop[0],
                                                                            id:
                                                                                prop[1],
                                                                            index: key,
                                                                        }}
                                                                    >
                                                                        Update
                                                                        Operation
                                                                        Costs
                                                                    </MenuItem>
                                                                    {props.nodeExtData[
                                                                        key
                                                                    ] &&
                                                                        props.nodeExtData[
                                                                            key
                                                                        ]
                                                                            .managementType ===
                                                                        '3' && (
                                                                            <MenuItem
                                                                                classes={{
                                                                                    root:
                                                                                        classes.selectMenuItem,
                                                                                    selected:
                                                                                        classes.selectMenuItemSelected,
                                                                                }}
                                                                                value={{
                                                                                    href:
                                                                                        '/#/user/authorize-user',
                                                                                    name:
                                                                                        prop[0],
                                                                                    id:
                                                                                        prop[1],
                                                                                    index: key,
                                                                                }}
                                                                            >
                                                                                Authorize
                                                                                User
                                                                            </MenuItem>
                                                                        )}
                                                                    <MenuItem
                                                                        classes={{
                                                                            root:
                                                                                classes.selectMenuItem,
                                                                            selected:
                                                                                classes.selectMenuItemSelected,
                                                                        }}
                                                                        value={{
                                                                            href:
                                                                                '/#/user/transfer-node',
                                                                            name:
                                                                                prop[0],
                                                                            id:
                                                                                prop[1],
                                                                            index: key,
                                                                        }}
                                                                    >
                                                                        Transfer
                                                                    </MenuItem>
                                                                    {props.nodeExtData[
                                                                        key
                                                                    ] &&
                                                                        props.nodeExtData[
                                                                            key
                                                                        ]
                                                                            .managementType ===
                                                                        '255' && (
                                                                            <MenuItem
                                                                                classes={{
                                                                                    root:
                                                                                        classes.selectMenuItem,
                                                                                    selected:
                                                                                        classes.selectMenuItemSelected,
                                                                                }}
                                                                                value={{
                                                                                    href:
                                                                                        '/#/user/finalize-node',
                                                                                    name:
                                                                                        prop[0],
                                                                                    id:
                                                                                        prop[1],
                                                                                    index: key,
                                                                                }}
                                                                            >
                                                                                Finalize
                                                                            </MenuItem>
                                                                        )}
                                                                </Select>
                                                            </FormControl>
                                                        </form>
                                                    )}
                                            </div>
                                        ),
                                    }
                                })}
                            />
                        )}
                        {!dash && delegation && !analytics && (
                            <ReactTable
                                columns={[
                                    {
                                        Header: 'Root',
                                        accessor: 'root',
                                    },
                                    {
                                        Header: 'Name',
                                        accessor: 'name',
                                    },
                                    {
                                        Header: 'Node ID',
                                        accessor: 'nodeId',
                                    },
                                    {
                                        Header: 'Total Delegated',
                                        accessor: 'totalStaked',
                                    },
                                    {
                                        Header: 'Transaction Count',
                                        accessor: 'transactionsPerEpoch',
                                    },
                                    {
                                        Header: 'Actions',
                                        accessor: 'actions',
                                    },
                                ]}
                                data={delegationList.map((prop, key) => {
                                    return {
                                        id: key,
                                        root: prop[0],
                                        name: prop[1],
                                        nodeId: prop[2],
                                        totalStaked: prop[3],
                                        transactionsPerEpoch: prop[4],
                                        actions: (
                                            // we've added some custom button actions
                                            <div className="actions-right">
                                                {/* use this button to add a like kind of action */}
                                                {prop[0] !==
                                                    'Loading Nodes...' && (
                                                        <Button
                                                            // justIcon
                                                            // round
                                                            // simple
                                                            onClick={() => {
                                                                handleDelegation({
                                                                    name: prop[1],
                                                                    id: prop[2],
                                                                    totalDelegated:
                                                                        prop[3],
                                                                })
                                                            }}
                                                            color="info"
                                                            className="delegateButton"
                                                        >
                                                            Delegate
                                                        </Button>
                                                    )}
                                                {prop[0] ===
                                                    'Loading Nodes...' && (
                                                        <Button
                                                            disabled
                                                            onClick={() => {
                                                                handleDelegation({
                                                                    name: prop[1],
                                                                    id: prop[2],
                                                                    totalDelegated:
                                                                        prop[3],
                                                                })
                                                            }}
                                                            color="info"
                                                            className="delegateButton"
                                                        >
                                                            Delegate
                                                        </Button>
                                                    )}
                                            </div>
                                        ),
                                    }
                                })}
                            />
                        )}
                        {!dash && !delegation && analytics && (
                            <>
                                <GridContainer>
                                    <GridItem xs={12} sm={6} md={6} lg={4}>
                                        <Card>
                                            <CardHeader
                                                color="danger"
                                                stats
                                                icon
                                            >
                                                <CardIcon className="headerIconBack">
                                                    <img
                                                        className="Icon"
                                                        src={Pruf}
                                                        alt=""
                                                    ></img>
                                                </CardIcon>
                                                <p
                                                    className={
                                                        classes.cardCategory
                                                    }
                                                >
                                                    PRüF Balance
                                                </p>
                                                <h3
                                                    className={
                                                        classes.cardTitle
                                                    }
                                                >
                                                    {/* eslint-disable-next-line react/prop-types */}
                                                    {props.pruf !== '~' ? (
                                                        <>
                                                            {String(
                                                                Math.round(
                                                                    Number(
                                                                        // eslint-disable-next-line react/prop-types
                                                                        props.pruf
                                                                    ) * 100
                                                                ) / 100
                                                            )}{' '}
                                                            <small>PRüF</small>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* eslint-disable-next-line react/prop-types */}
                                                            {props.pruf}{' '}
                                                            <small>PRüF</small>
                                                        </>
                                                    )}
                                                </h3>
                                                {/* <h3 className={classes.cardTitle}>
                        <small>PRüF</small>
                    </h3> */}
                                            </CardHeader>
                                            <CardFooter stats>
                                                {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                                            </CardFooter>
                                        </Card>
                                    </GridItem>
                                    <GridItem xs={12} sm={6} md={6} lg={4}>
                                        <Card>
                                            <CardHeader
                                                color="danger"
                                                stats
                                                icon
                                            >
                                                <CardIcon className="headerIconBack">
                                                    <AccountBalanceWallet />
                                                </CardIcon>
                                                <p
                                                    className={
                                                        classes.cardCategory
                                                    }
                                                >
                                                    Total Rewards
                                                </p>
                                                {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                                                <h3
                                                    className={
                                                        classes.cardTitle
                                                    }
                                                >
                                                    0 <small>PRüF</small>
                                                </h3>
                                            </CardHeader>
                                            <CardFooter stats>
                                                {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                                            </CardFooter>
                                        </Card>
                                    </GridItem>
                                    <GridItem xs={12} sm={6} md={6} lg={4}>
                                        <Card>
                                            <CardHeader
                                                color="danger"
                                                stats
                                                icon
                                            >
                                                <CardIcon className="headerIconBack">
                                                    <VpnKey />
                                                </CardIcon>
                                                <p
                                                    className={
                                                        classes.cardCategory
                                                    }
                                                >
                                                    Total Delegated
                                                </p>
                                                {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                                                <h3
                                                    className={
                                                        classes.cardTitle
                                                    }
                                                >
                                                    0 <small>PRüF</small>
                                                </h3>
                                            </CardHeader>
                                            <CardFooter stats>
                                                {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                                            </CardFooter>
                                        </Card>
                                    </GridItem>
                                </GridContainer>
                                {/* <Card className="rewardsHistorySlider"> */}
                                <GridContainer>
                                    <GridItem xs={12} sm={6} md={6} lg={3}>
                                        <Card>
                                            <CardHeader>
                                                <p
                                                    className={
                                                        classes.cardCategory
                                                    }
                                                >
                                                    Epoch xxx
                                                </p>
                                                {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                                            </CardHeader>
                                            <CardFooter stats>
                                                {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                                            </CardFooter>
                                        </Card>
                                    </GridItem>
                                    <GridItem xs={12} sm={6} md={6} lg={3}>
                                        <Card>
                                            <CardHeader>
                                                <p
                                                    className={
                                                        classes.cardCategory
                                                    }
                                                >
                                                    Epoch xxx
                                                </p>
                                                {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                                            </CardHeader>
                                            <CardFooter stats>
                                                {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                                            </CardFooter>
                                        </Card>
                                    </GridItem>
                                    <GridItem xs={12} sm={6} md={6} lg={3}>
                                        <Card>
                                            <CardHeader>
                                                <p
                                                    className={
                                                        classes.cardCategory
                                                    }
                                                >
                                                    Epoch xxx
                                                </p>
                                                {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                                            </CardHeader>
                                            <CardFooter stats>
                                                {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                                            </CardFooter>
                                        </Card>
                                    </GridItem>
                                    <GridItem xs={12} sm={6} md={6} lg={3}>
                                        <Card>
                                            <CardHeader>
                                                <p
                                                    className={
                                                        classes.cardCategory
                                                    }
                                                >
                                                    Epoch xxx
                                                </p>
                                                {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                                            </CardHeader>
                                            <CardFooter stats>
                                                {/* {!isRefreshingPruf && (
                      <div className="refresh">
                        <Cached onClick={() => refreshPrufBalance()} />
                      </div>
                    )}
                    {isRefreshingPruf && (
                      <div className={classes.stats}><div className="lds-ellipsisCard"><div></div><div></div><div></div></div></div>
                    )} */}
                                            </CardFooter>
                                        </Card>
                                    </GridItem>
                                </GridContainer>
                                {/* </Card> */}
                                {rewards && (
                                    <Button className="nodeButtonSmActive">
                                        <ShowChart />
                                        Rewards
                                    </Button>
                                )}
                                {!rewards && (
                                    <Button
                                        className="nodeButtonSm"
                                        onClick={() => {
                                            setRewardsButton(true)
                                        }}
                                    >
                                        <ShowChart />
                                        Rewards
                                    </Button>
                                )}
                                {totalRewards && (
                                    <Button className="nodeButtonSmActive">
                                        <MultilineChart />
                                        Total Rewards
                                    </Button>
                                )}
                                {!totalRewards && (
                                    <Button
                                        className="nodeButtonSm"
                                        onClick={() => {
                                            setTotalRewardsButton(true)
                                        }}
                                    >
                                        <MultilineChart />
                                        Total Rewards
                                    </Button>
                                )}
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={7}>
                                        <Card chart>
                                            <CardHeader color="info">
                                                <ChartistGraph
                                                    className="ct-chart-white-colors"
                                                    data={simpleBarChart.data}
                                                    type="Bar"
                                                    options={
                                                        simpleBarChart.options
                                                    }
                                                    responsiveOptions={
                                                        simpleBarChart.responsiveOptions
                                                    }
                                                    listener={
                                                        simpleBarChart.animation
                                                    }
                                                />
                                            </CardHeader>
                                            <br />
                                        </Card>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={5}>
                                        <Card>
                                            <CardHeader>
                                                <h4
                                                    className={
                                                        chartClasses.cardIconTitle
                                                    }
                                                >
                                                    Total Delegation
                                                    Distribution
                                                </h4>
                                            </CardHeader>
                                            <CardBody>
                                                <ChartistGraph
                                                    data={pieChart.data}
                                                    type="Pie"
                                                    options={pieChart.options}
                                                />
                                            </CardBody>
                                            <CardFooter
                                                stats
                                                className={
                                                    chartClasses.cardFooter
                                                }
                                            >
                                                <h6
                                                    className={
                                                        chartClasses.legendTitle
                                                    }
                                                >
                                                    Legend
                                                </h6>
                                                <i
                                                    className={
                                                        'fas fa-circle ' +
                                                        chartClasses.info
                                                    }
                                                />{' '}
                                                Transportation(Sporting){` `}
                                                <i
                                                    className={
                                                        'fas fa-circle ' +
                                                        chartClasses.warning
                                                    }
                                                />{' '}
                                                Collectables(Art)
                                                {` `}
                                                <i
                                                    className={
                                                        'fas fa-circle ' +
                                                        chartClasses.danger
                                                    }
                                                />{' '}
                                                Apparel(Shoes)
                                                {` `}
                                            </CardFooter>
                                        </Card>
                                    </GridItem>
                                </GridContainer>
                            </>
                        )}
                    </CardBody>
                </Card>
            </GridItem>
        </GridContainer>
    )
}
