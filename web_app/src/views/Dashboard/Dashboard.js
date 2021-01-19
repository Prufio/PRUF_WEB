import React from "react";
import "../../assets/css/custom.css";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Refresh from "@material-ui/icons/Refresh";
import Category from "@material-ui/icons/Category";
import Share from "@material-ui/icons/Share";
import Print from "@material-ui/icons/Print";
import Create from "@material-ui/icons/Create";
import Edit from "@material-ui/icons/Edit";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import pruftoken from "assets/img/pruftoken.png";
import macbook from "../../assets/img/MacBook.jpg";
import Nike from "assets/img/Nike.png";
import Mustang from "assets/img/Mustang.png";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

import priceImage1 from "assets/img/card-2.jpeg";
import priceImage2 from "assets/img/card-3.jpeg";
import priceImage3 from "assets/img/card-1.jpeg";
import { ExitToApp } from "@material-ui/icons";

const us_flag = require("assets/img/flags/US.png");
const de_flag = require("assets/img/flags/DE.png");
const au_flag = require("assets/img/flags/AU.png");
const gb_flag = require("assets/img/flags/GB.png");
const ro_flag = require("assets/img/flags/RO.png");
const br_flag = require("assets/img/flags/BR.png");

var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};

const useStyles = makeStyles(styles);

export default function Dashboard() {

  const [viewAsset, setViewAsset] = React.useState(false)
  const [checkedA, setCheckedA] = React.useState(true);
  const [checkedB, setCheckedB] = React.useState(false);
  const [simpleSelect, setSimpleSelect] = React.useState("");

  

  // const handleSetViewAsset = event => {
  //   setViewAsset(!viewAsset);
  //   console.log("new value", !viewAsset)
  // };

  const handleSimple = event => {
    setSimpleSelect(event.target.value);
    if (event.target.value === "transfer") {
      return window.location.href = "/#/admin/transfer-asset"
    }
    if (event.target.value === "escrow") {
      return window.location.href = "/#/admin/escrow-manager"
    }
    if (event.target.value === "import") {
      return window.location.href = "/#/admin/import-asset"
    }
    if (event.target.value === "export") {
      return window.location.href = "/#/admin/export-asset"
    }
    if (event.target.value === "discard") {
      return window.location.href = "/#/admin/discard-asset"
    }
    if (event.target.value === "change-status") {
      return window.location.href = "/#/admin/modify-status"
    }
    if (event.target.value === "decrement-counter") {
      return window.location.href = "/#/admin/counter"
    }
    if (event.target.value === "edit-information") {
      return window.location.href = "/#/admin/modify-description"
    }
    if (event.target.value === "edit-rightsholder") {
      return window.location.href = "/#/admin/modify-rightsholder"
    }
  };
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader icon>
              <CardIcon className="headerIconBack">
                <Category />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Asset Dashboard
              </h4>
              <br />
            </CardHeader>
          </Card>
        </GridItem>
      </GridContainer>
{!viewAsset && (
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart className={classes.cardHover}>
            <CardHeader onClick={(e) => setViewAsset(!viewAsset)} color="info" className="DBGradient">
            <img src={macbook} alt="logo" className="assetImage" />
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title="Refresh"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button simple color="info" justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Edit"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" simple justIcon>
                    <Edit className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardTitle}>Macbook Air 2020</h4>
              <h5 className={classes.cardTitle}>Status: Transferrable</h5>
              
            </CardBody>
            {/* <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart className={classes.cardHover}>
            <CardHeader onClick={(e) => setViewAsset(!viewAsset)} color="info" className="DBGradient">
            <img src={Nike} alt="logo" className="assetImage" />
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title="Refresh"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button simple color="info" justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Edit"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" simple justIcon>
                    <Edit className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardTitle}>Off-White AF1's</h4>
              <h5 className={classes.cardTitle}>Status: Stolen</h5>
              
            </CardBody>
            {/* <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart className={classes.cardHover}>
            <CardHeader onClick={(e) => setViewAsset(!viewAsset)} color="info" className="DBGradient">
            <img src={Mustang} alt="logo" className="assetImage" />
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title="Refresh"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button simple color="info" justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Edit"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" simple justIcon>
                    <Edit className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardTitle}>2020 Ford Mustang</h4>
              <h5 className={classes.cardTitle}>Status: Non-Transferrable</h5>
              
            </CardBody>
            {/* <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter> */}
          </Card>
        </GridItem>
      </GridContainer>
      )}
      {viewAsset && (
        <div>
        <Card>
          <CardHeader color="info" className="DBGradient">
            <img src={macbook} alt="logo" className="assetImage" />
          </CardHeader>
          <CardBody>
          <Tooltip
                  id="tooltip-top"
                  title="Back"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button onClick={(e) => setViewAsset(!viewAsset)} simple color="info" justIcon>
                  <ExitToApp />
                  </Button>
                </Tooltip>
            {/* <Tooltip
                  id="tooltip-top"
                  title="Back"
                  placement="top" color="info"
                  // classes={{ tooltip: classes.tooltip }}
                >
                  <Button 
                  onClick={(e) => setViewAsset(!viewAsset)}
                  className="exitAsset" 
                  simple
                  justIcon color="success"
                  >
                  <ExitToApp />
                  </Button>
                </Tooltip> */}
            <h4 className={classes.cardTitle}>Name: Macbook Air 2020</h4>
            <h4 className={classes.cardTitle}>Class: Personal Computers (ID: 11)</h4>
            <h4 className={classes.cardTitle}>Status: Transferrable</h4>
            <p className={classes.cardCategory}>
              Description: Slightly used, like new. Comes with box and original charger.
                </p>
            <br />
            <div className={classes.stats}>
              <Danger>
                <Create
                  className="functionSelectorIcon" />
              </Danger>
                  <FormControl
                    fullWidth
                    className={classes.selectFormControl}
                  >
                    <InputLabel
                      // htmlFor="simple-select"
                      // className={classes.selectLabel}
                      className="functionSelector"
                    >
                      Edit Asset
                          </InputLabel>
                    <Select
                      className="functionSelector"
                      MenuProps={{
                        className: classes.selectMenu
                      }}
                      classes={{
                        select: classes.select
                      }}
                      value={simpleSelect}
                      onChange={handleSimple}
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
                        Select Function
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
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="escrow"
                      >
                        Escrow
                            </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="import"
                      >
                        Import
                            </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="export"
                      >
                        Export
                            </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="discard"
                      >
                        Discard
                            </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="change-status"
                      >
                        Change Status
                            </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="decrement-counter"
                      >
                        Decrement Counter
                            </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="edit-information"
                      >
                        Edit Information
                            </MenuItem>
                      <MenuItem
                        classes={{
                          root: classes.selectMenuItem,
                          selected: classes.selectMenuItemSelected
                        }}
                        value="edit-rightsholder"
                      >
                        Edit Rightsholder
                            </MenuItem>
                    </Select>
                  </FormControl>
            </div>
          </CardBody>
          <CardFooter chart>
            <div className={classes.stats}>
              IDX Hash: 0x8adbd0ab0401fa6...e6f3dcde1b953fcc4e
                </div>
            <div className={classes.stats}>
              <Share />
              <Print />
            </div>
          </CardFooter>
        </Card>
      </div>
      )}
    </div>
  );
}
