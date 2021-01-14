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
      return window.location.href = "/#/user/transfer-asset"
    }
    if (event.target.value === "escrow") {
      return window.location.href = "/#/user/escrow-manager"
    }
    if (event.target.value === "import") {
      return window.location.href = "/#/user/import-asset"
    }
    if (event.target.value === "export") {
      return window.location.href = "/#/user/export-asset"
    }
    if (event.target.value === "discard") {
      return window.location.href = "/#/user/discard-asset"
    }
    if (event.target.value === "change-status") {
      return window.location.href = "/#/user/modify-status"
    }
    if (event.target.value === "decrement-counter") {
      return window.location.href = "/#/user/counter"
    }
    if (event.target.value === "edit-information") {
      return window.location.href = "/#/user/modify-description"
    }
    if (event.target.value === "edit-rightsholder") {
      return window.location.href = "/#/user/modify-rightsholder"
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
            <CardHeader onClick={(e) => setViewAsset(!viewAsset)} color="info" className={classes.cardHeaderHover}>
              <img src={pruftoken} alt="logo" className={classes.img} />
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
              <h4 className={classes.cardTitle}>Daily Sales</h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                increase in today sales.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      )}
      {viewAsset && (
        <div>
        <Card>
          <CardHeader color="info" className="assetHeader">
            <Tooltip
                  id="tooltip-top"
                  title="Back"
                  placement="top"
                  // classes={{ tooltip: classes.tooltip }}
                >
                  <Button 
                  onClick={(e) => setViewAsset(!viewAsset)}
                  className="exitAsset" 
                  simple
                  justIcon
                  >
                  <ExitToApp/>
                  </Button>
                </Tooltip>
            <img src={pruftoken} alt="logo" className="assetImage" />
          </CardHeader>
          <CardBody>
            <h4 className={classes.cardTitle}>Name: Bennny's Mongoose</h4>
            <h4 className={classes.cardTitle}>Class: Bicycles(UK)</h4>
            <h4 className={classes.cardTitle}>Status: Transferable</h4>
            <p className={classes.cardCategory}>
              Description: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
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
              IDX Hash: 0x6d5ffa25c1f9...1b8be12927
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
