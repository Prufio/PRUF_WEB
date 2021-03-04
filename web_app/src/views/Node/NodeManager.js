import React from "react";
import ChartistGraph from "react-chartist";
import "../../assets/css/custom.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Assignment from "@material-ui/icons/Assignment";
import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import Close from "@material-ui/icons/Close";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import ReactTable from "components/ReactTable/ReactTable.js";
import ReactTableSimple from "components/ReactTable/ReactTableSimple.js";
import CardFooter from "components/Card/CardFooter.js";

import { dataTable } from "variables/general.js";

import { cardTitle } from "assets/jss/material-dashboard-pro-react.js";
import { AccountBalance, AccountBalanceOutlined, AccountBalanceWallet, AccountBalanceWalletOutlined, BarChartRounded, Dashboard, ListAltRounded, MultilineChart, Settings, ShowChart, Timeline, VpnKey } from "@material-ui/icons";
import { List } from "@material-ui/core";
import Danger from "components/Typography/Danger";
import Pruf from "../../assets/img/pruftoken.png";
import {
  roundedLineChart,
  straightLinesChart,
  simpleBarChart,
  colouredLineChart,
  multipleBarsChart,
  colouredLinesChart,
  pieChart
} from "variables/charts.js";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import chartStyles from "assets/jss/material-dashboard-pro-react/views/chartsStyle.js";


// const styles = {
//   cardIconTitle: {
//     ...cardTitle,
//     marginTop: "15px",
//     marginBottom: "0px"
//   }
// };

const useStyles = makeStyles(styles);
const useChartStyles = makeStyles(chartStyles);

export default function NodeManager(props) {
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [dash, setDash] = React.useState(false)
  const [Delegation, setDelegation] = React.useState(false)
  const [analytics, setAnalytics] = React.useState(true)
  const [rewards, setRewards] = React.useState(true)
  const [totalRewards, setTotalRewards] = React.useState(false)

  const classes = useStyles();
  const chartClasses = useChartStyles();

  const [nodeData, setNodeData] = React.useState(
    [["Loading Nodes...", "~", "~", "~"]],
  );

  const thousandHashesOf = (varToHash) => {
    if (!window.web3.utils) return window.location.href = "/#/user/home"
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  }

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
    //getNodesInWallet()
  }, [])

  React.useEffect(() => {
    if (props.nodeList && props.nodeList.length === Number(props.nodes)) {
      setNodeData(props.nodeList)
    }
    else if (Number(props.nodes) === 0) setNodeData([["No nodes held by user", "~", "~", "~"]])
    else {
      getNodesInWallet(Number(props.nodes))
    }

  }, [props.nodes])

  const getNodesInWallet = async (bal, ids) => {
    const pageKey = thousandHashesOf(props.addr, props.winKey);
    if (!window.contracts || !props.addr) return

    if (!bal) {
      await window.contracts.AC_TKN.methods.balanceOf(props.addr).call((error, result) => {
        if (error) { console.log(error) }
        else if (result > 0) {
          getNodesInWallet(result)
        }
        else {
          window.replaceAssetData = { key: pageKey, nodeList: [["No nodes held by user", "~", "~", "~"]] }
          setNodeData([["No nodes held by user", "~", "~", "~"]])
        }
      });
    }

    else if (!ids) {
      let nodeIDs = []
      for (let i = 0; i < Number(bal); i++) {
        await window.contracts.AC_TKN.methods.tokenOfOwnerByIndex(props.addr, i)
          .call((_error, _result) => {
            if (_error) {
              return (console.log("IN ERROR IN ERROR IN ERROR"))
            } else {
              nodeIDs.push(_result)
            }
          });
      }

      setTimeout(() => {
        getNodesInWallet(bal, nodeIDs)
      }, 300)

    }

    else {
      let nodeData = [];
      for (let i = 0; i < ids.length; i++) {
        await window.contracts.AC_MGR.methods
          .getAC_name(ids[i])
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              nodeData.push(
                [_result.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), String(ids[i]), "N/A", "N/A"]
              )
            }
          });
      }

      setTimeout(() => {
        console.log(nodeData)
        window.replaceAssetData = { nodeList: nodeData }
      }, 300)
      setNodeData([nodeData, ["~", "~", "~", "~"]])
    }

  }

  // const [dashData, setDashData] = React.useState(
  //   nodeData.map((prop, key) => {
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
  //               let obj = dashData.find(o => o.id === key);
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
  //             {prop[0] === "No nodes held by user" && (
  //               <>Create Node</>
  //             )}
  //             {prop[0] !== "No nodes held by user" && (

  //               <form>
  //                 <FormControl
  //                   className={classes.selectFormControl}
  //                 >
  //                   <InputLabel className="functionSelectorText">
  //                     <Danger>
  //                       <Settings className="functionSelectorIcon" />
  //                     </Danger>
  //                 Options
  //                     </InputLabel>
  //                   <Select
  //                     MenuProps={{
  //                       className: classes.selectMenu
  //                     }}
  //                     classes={{
  //                       select: classes.select
  //                     }}
  //                     value={simpleSelect}
  //                     onChange={(e) => handleSimple(e)}
  //                     inputProps={{
  //                       name: "simpleSelect",
  //                       id: "simple-select"
  //                     }}
  //                   >
  //                     <MenuItem
  //                       disabled
  //                       classes={{
  //                         root: classes.selectMenuItem
  //                       }}
  //                     >
  //                       Select an option from the list
  //                         </MenuItem>
  //                     <MenuItem
  //                       classes={{
  //                         root: classes.selectMenuItem,
  //                         selected: classes.selectMenuItemSelected
  //                       }}
  //                       value="name"
  //                     >
  //                       Change Name
  //             </MenuItem>
  //                     <MenuItem
  //                       disabled
  //                       classes={{
  //                         root: classes.selectMenuItem,
  //                         selected: classes.selectMenuItemSelected
  //                       }}
  //                       value="data"
  //                     >
  //                       Update Node Data
  //             </MenuItem>
  //                     <MenuItem
  //                       classes={{
  //                         root: classes.selectMenuItem,
  //                         selected: classes.selectMenuItemSelected
  //                       }}
  //                       value="costs"
  //                     >
  //                       Update Operation Costs
  //                         </MenuItem>
  //                   </Select>
  //                 </FormControl>
  //               </form>
  //             )}
  //           </Button>{" "}
  //         </div>
  //       )
  //     };
  //   })
  // );
  const [delegationData, setDelegationData] = React.useState(
    dataTable.dataRowsDelegation.map((prop, key) => {
      return {
        id: key,
        name: prop[0],
        nodeId: prop[1],
        totalStaked: prop[2],
        transactionsPerEpoch: prop[3],
        actions: (
          // we've added some custom button actions
          <div className="actions-right">
            {/* use this button to add a like kind of action */}
            <Button
              // justIcon
              // round
              simple
              onClick={() => {
                let obj = delegationData.find(o => o.id === key);
                alert(
                  "You've clicked LIKE button on \n{ \nName: " +
                  obj.name +
                  ", \nposition: " +
                  obj.position +
                  ", \noffice: " +
                  obj.office +
                  ", \nage: " +
                  obj.age +
                  "\n}."
                );
              }}
              color="info"
              className="like"
            >
              Delegation
            </Button>{" "}
          </div>
        )
      };
    })
  );

  const setDashButton = () => {
    setDash(true)
    setDelegation(false)
    setAnalytics(false)
  }

  const setDelegationButton = () => {
    setDash(false)
    setDelegation(true)
    setAnalytics(false)

  }

  const setAnalyticsButton = () => {
    setDash(false)
    setDelegation(false)
    setAnalytics(true)

  }

  const setRewardsButton = () => {
    setRewards(true)
    setTotalRewards(false)

  }

  const setTotalRewardsButton = () => {
    setRewards(false)
    setTotalRewards(true)

  }




  const handleSimple = event => {
    if (props.ps) {
      props.ps.element.scrollTop = 0
      //console.log(props.ps.element.scrollTop)
    }
    //console.log(window.sentPacket);
    setSimpleSelect(event.target.value);
    let e = event.target.value, href;

    switch (e) {
      case "name": {
        href = "/#/user/change-name";
        break
      }
      case "data": {
        href = "/#/user/change-data";
        break
      }
      case "costs": {
        href = "/#/user/change-costs";
        break
      }
      case "transfer": {
        href = "/#/user/transfer-node";
        break
      }
      default: {
        console.log("Invalid menu selection: '", e, "'");
        break
      }
    }

    return window.location.href = href;
  };
  return (
    <GridContainer>
      <GridItem xs={12}>
        <Card>
          <CardHeader icon className="nodeHeader">
            <CardIcon className="headerIconBack">
              <AccountBalance />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Node Manager</h4>
            {analytics && (
              <Button
                Icon
                className="nodeButtonActive"
              >
                <BarChartRounded />
              Analytics
              </Button>
            )}
            {!analytics && (
              <Button
                Icon
                className="nodeButton"
                onClick={() => { setAnalyticsButton(true) }}
              >
                <BarChartRounded />
              Analytics
              </Button>
            )}
            {Delegation && (
              <Button
                Icon
                className="nodeButtonActive"
              >
                <ListAltRounded />
              Delegation List
              </Button>
            )}
            {!Delegation && (
              <Button
                Icon
                className="nodeButton"
                onClick={() => { setDelegationButton(true) }}
              >
                <ListAltRounded />
              Delegation List
              </Button>
            )}
            {dash && (
              <Button
                Icon
                className="nodeButtonActive"
              >
                <Dashboard />
              Dashboard
              </Button>
            )}
            {!dash && (
              <Button
                Icon
                className="nodeButton"
                onClick={() => { setDashButton(true) }}
              >
                <Dashboard />
              Dashboard
              </Button>
            )}
          </CardHeader>
          {/* <br/> */}
        </Card>
        <Card>
          <CardBody>
            {dash && !Delegation && !analytics && (
              <ReactTableSimple
                columns={[
                  {
                    Header: "Name",
                    accessor: "name"
                  },
                  {
                    Header: "Node ID",
                    accessor: "nodeId"
                  },
                  {
                    Header: "Total Delegated",
                    accessor: "totalStaked"
                  },
                  {
                    Header: "Transactions This Epoch",
                    accessor: "transactionsPerEpoch"
                  },
                  {
                    Header: "Actions",
                    accessor: "actions"
                  }
                ]}
                data={
                  nodeData.map((prop, key) => {
                    return {
                      id: key,
                      name: prop[0],
                      nodeId: prop[1],
                      totalStaked: prop[2],
                      transactionsPerEpoch: prop[3],
                      actions: (
                        // we've added some custom button actions
                        <div className="actions-right">
                          {/* use this button to add a like kind of action */}

                          {prop[0] === "No nodes held by user" && (
                            <Button
                              simple
                              onClick={() => {
                                window.location.href = "/#/user/create-node"
                              }}
                              color="info"
                              className="like"
                            >
                              Create Node
                            </Button>
                          )}
                          {prop[0] === "Loading Nodes..." && (
                            <Button
                              simple
                              onClick={() => {
                                window.location.href = "/#/user/create-node"
                              }}
                              color="info"
                              className="like"
                            >
                              Create Node
                            </Button>
                          )}
                          {prop[0] === "~" && (
                            <Button
                              simple
                              onClick={() => {
                                window.location.href = "/#/user/create-node"
                              }}
                              color="info"
                              className="like"
                            >
                              Create Node
                            </Button>
                          )}
                          {prop[0] !== "No nodes held by user" && prop[0] !== "Loading Nodes..." && prop[0] !== "~" && (

                            <form>
                              <FormControl
                                className="nodeOptions"
                              >
                                <InputLabel className="functionSelectorText">
                                  <Danger>
                                    <Settings className="functionSelectorIcon" />
                                  </Danger>
                                Options
                                    </InputLabel>
                                <Select
                                  MenuProps={{
                                    className: classes.selectMenu
                                  }}
                                  classes={{
                                    select: classes.select
                                  }}
                                  value={simpleSelect}
                                  onChange={(e) => handleSimple(e)}
                                  inputProps={{
                                    name: "simpleSelect",
                                    id: "simple-select"
                                  }}
                                >
                                  <MenuItem
                                    disabled
                                    classes={{
                                      root: classes.selectMenuItem
                                    }}
                                  >
                                    Select an option from the list
                                        </MenuItem>
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected
                                    }}
                                    value="name"
                                  >
                                    Change Name
                            </MenuItem>
                                  <MenuItem
                                    disabled
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected
                                    }}
                                    value="data"
                                  >
                                    Update Data
                            </MenuItem>
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected
                                    }}
                                    value="costs"
                                  >
                                    Update Operation Costs
                                        </MenuItem>
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected
                                    }}
                                    value="transfer"
                                  >
                                    Transfer
                                        </MenuItem>
                                </Select>
                              </FormControl>
                            </form>
                          )}
                        </div>
                      )
                    };
                  })
                }
              />
            )}
            {!dash && Delegation && !analytics && (
              <ReactTable
                columns={[
                  {
                    Header: "Name",
                    accessor: "name"
                  },
                  {
                    Header: "Node ID",
                    accessor: "nodeId"
                  },
                  {
                    Header: "Total Delegated",
                    accessor: "totalStaked"
                  },
                  {
                    Header: "Transactions This Epoch",
                    accessor: "transactionsPerEpoch"
                  },
                  {
                    Header: "Actions",
                    accessor: "actions"
                  }
                ]}
                data={delegationData}
              />
            )}
            {!dash && !Delegation && analytics && (
              <>
                <GridContainer>
                  <GridItem xs={12} sm={6} md={6} lg={4}>
                    <Card>
                      <CardHeader color="danger" stats icon>
                        <CardIcon className="headerIconBack">
                          <img className="Icon" src={Pruf}></img>
                        </CardIcon>
                        <p className={classes.cardCategory}>PRüF Balance</p>
                        <h3 className={classes.cardTitle}>
                          {props.pruf !== "~"
                            ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                            : <>{props.pruf} <small>PRüF</small></>}
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
                      <CardHeader color="danger" stats icon>
                        <CardIcon className="headerIconBack">
                          <AccountBalanceWallet />
                        </CardIcon>
                        <p className={classes.cardCategory}>Total Rewards</p>
                        {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                        <h3 className={classes.cardTitle}>
                          <small>0 PRüF</small>
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
                      <CardHeader color="danger" stats icon>
                        <CardIcon className="headerIconBack">
                          <VpnKey />
                        </CardIcon>
                        <p className={classes.cardCategory}>Total Delegated</p>
                        {/* <h3 className={classes.cardTitle}>
                      {props.pruf !== "~"
                        ? <>{String(Math.round(Number(props.pruf) * 100) / 100)} <small>PRüF</small></>
                        : <>{props.pruf} <small>PRüF</small></>}
                    </h3> */}
                        <h3 className={classes.cardTitle}>
                          <small>0 PRüF</small>
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
                        <p className={classes.cardCategory}>Epoch xxx</p>
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
                        <p className={classes.cardCategory}>Epoch xxx</p>
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
                        <p className={classes.cardCategory}>Epoch xxx</p>
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
                        <p className={classes.cardCategory}>Epoch xxx</p>
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
                  <Button
                    Icon
                    className="nodeButtonSmActive"
                  >
                    <ShowChart />
              Rewards
                  </Button>
                )}
                {!rewards && (
                  <Button
                    Icon
                    className="nodeButtonSm"
                    onClick={() => { setRewardsButton(true) }}
                  >
                    <ShowChart />
            Rewards
                  </Button>
                )}
                {totalRewards && (
                  <Button
                    Icon
                    className="nodeButtonSmActive"
                  >
                    <MultilineChart />
              Total Rewards
                  </Button>
                )}
                {!totalRewards && (
                  <Button
                    Icon
                    className="nodeButtonSm"
                    onClick={() => { setTotalRewardsButton(true) }}
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
                          options={simpleBarChart.options}
                          responsiveOptions={simpleBarChart.responsiveOptions}
                          listener={simpleBarChart.animation}
                        />
                      </CardHeader>
                      <br />
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={5}>
                    <Card>
                      <CardHeader>
                        <h4 className={chartClasses.cardIconTitle}>Total Delegation Distribution</h4>
                      </CardHeader>
                      <CardBody>
                        <ChartistGraph
                          data={pieChart.data}
                          type="Pie"
                          options={pieChart.options}
                        />
                      </CardBody>
                      <CardFooter stats className={chartClasses.cardFooter}>
                        <h6 className={chartClasses.legendTitle}>Legend</h6>
                        <i className={"fas fa-circle " + chartClasses.info} /> Transportation(Sporting){` `}
                        <i className={"fas fa-circle " + chartClasses.warning} /> Collectables(Art)
              {` `}
                        <i className={"fas fa-circle " + chartClasses.danger} /> Apparel(Shoes)
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
  );
}
