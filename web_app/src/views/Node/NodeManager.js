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
import { AccountBalance, BarChartRounded, Dashboard, ListAltRounded, MultilineChart, Settings, ShowChart, Timeline } from "@material-ui/icons";
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

const styles = {
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px"
  }
};

const useStyles = makeStyles(styles);

export default function NodeManager(props) {
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [dash, setDash] = React.useState(true)
  const [delegation, setDelegation] = React.useState(false)
  const [analytics, setAnalytics] = React.useState(false)

  const [dashData, setDashData] = React.useState(
    dataTable.dataRowsNodeDash.map((prop, key) => {
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
                let obj = dashData.find(o => o.id === key);
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
              {prop[0] === "No Nodes held" && (
                <>Create one</>
              )}
              {prop[0] !== "No Nodes held" && (

                <form>
                  <FormControl
                    className={classes.selectFormControl}
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
                        Update Node Data
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
                    </Select>
                  </FormControl>
                </form>
              )}
            </Button>{" "}
          </div>
        )
      };
    })
  );
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
              Delegate
            </Button>{" "}
          </div>
        )
      };
    })
  );
  const classes = useStyles();

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
            {dash && (
              <Button
                color="info"
                Icon
                className="nodeButtons1Active"
              >
                <Dashboard />
              Node Dashboard
              </Button>
            )}
            {!dash && (
              <Button
                Icon
                className="nodeButtons1"
                onClick={() => { setDashButton(true) }}
              >
                <Dashboard />
              Node Dashboard
              </Button>
            )}
            {delegation && (
              <Button
                color="info"
                Icon
                className="nodeButtons2Active"
              >
                <ListAltRounded />
              Delegation List
              </Button>
            )}
            {!delegation && (
              <Button
                Icon
                className="nodeButtons2"
                onClick={() => { setDelegationButton(true) }}
              >
                <ListAltRounded />
              Delegation List
              </Button>
            )}
            {analytics && (
              <Button
                color="info"
                Icon
                className="nodeButtons3Active"
              >
                <BarChartRounded />
              Analytics
              </Button>
            )}
            {!analytics && (
              <Button
                Icon
                className="nodeButtons3"
                onClick={() => { setAnalyticsButton(true) }}
              >
                <BarChartRounded />
              Analytics
              </Button>
            )}
          </CardHeader>
          {/* <br/> */}
        </Card>
        <Card>
          <CardBody>
            {dash && !delegation && !analytics && (
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
                    Header: "Total Staked",
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
                data={dashData}
              />
            )}
            {!dash && delegation && !analytics && (
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
                    Header: "Total Staked",
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
            {!dash && !delegation && analytics && (
              <>
                <GridContainer>
                  <GridItem xs={12} sm={6} md={6} lg={4}>
                    <Card>
                      <CardHeader color="danger" stats icon>
                        <CardIcon className="headerIconBack" onClick={() => window.open("https://pruf.io/")}>
                          <img className="Icon" src={Pruf}></img>
                        </CardIcon>
                        <p className={classes.cardCategory}>PRüF Balance</p>
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
                  <GridItem xs={12} sm={6} md={6} lg={4}>
                    <Card>
                      <CardHeader color="danger" stats icon>
                        <CardIcon className="headerIconBack" onClick={() => window.open("https://pruf.io/")}>
                          <img className="Icon" src={Pruf}></img>
                        </CardIcon>
                        <p className={classes.cardCategory}>Total Rewards</p>
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
                  <GridItem xs={12} sm={6} md={6} lg={4}>
                    <Card>
                      <CardHeader color="danger" stats icon>
                        <CardIcon className="headerIconBack" onClick={() => window.open("https://pruf.io/")}>
                          <img className="Icon" src={Pruf}></img>
                        </CardIcon>
                        <p className={classes.cardCategory}>Total Delegated</p>
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
                <Button
                  color="info"
                  Icon
                  className="nodeButtons1Active"
                >
                  <ShowChart />
              Rewards
              </Button>
                <Button
                  color="info"
                  Icon
                  className="nodeButtons1Active"
                >
                  <MultilineChart />
              Total Rewards
              </Button>
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
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={5}>
                    <Card>
                      <CardHeader color="danger" icon>
                        <CardIcon color="danger">
                          <Timeline />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Delegation Distribution</h4>
                      </CardHeader>
                      <CardBody>
                        <ChartistGraph
                          data={pieChart.data}
                          type="Pie"
                          options={pieChart.options}
                        />
                      </CardBody>
                      <CardFooter stats className={classes.cardFooter}>
                        <h6 className={classes.legendTitle}>Legend</h6>
                        <i className={"fas fa-circle " + classes.info} /> Apple{` `}
                        <i className={"fas fa-circle " + classes.warning} /> Samsung
              {` `}
                        <i className={"fas fa-circle " + classes.danger} /> Windows Phone
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
