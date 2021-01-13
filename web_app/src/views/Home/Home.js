import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";

import Eth from "../../assets/img/eth-logo.png";
import Pruf from "../../assets/img/pruftoken.png";
// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import Store from "@material-ui/icons/Store";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import Warning from "@material-ui/icons/Warning";
import Add from "@material-ui/icons/Add";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Refresh from "@material-ui/icons/Refresh";
import Edit from "@material-ui/icons/Edit";
import Place from "@material-ui/icons/Place";
import ArtTrack from "@material-ui/icons/ArtTrack";
import Language from "@material-ui/icons/Language";
import Category from "@material-ui/icons/Category";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Danger from "components/Typography/Danger.js";
import Success from "components/Typography/Success.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import "../../assets/css/custom.css";

import priceImage1 from "assets/img/card-2.jpeg";
import priceImage2 from "assets/img/card-3.jpeg";
import priceImage3 from "assets/img/card-1.jpeg";
import { Cached, CategoryRounded } from "@material-ui/icons";

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
  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Category/>
              </CardIcon>
              <p className={classes.cardCategory}>Assets Held</p>
              <h3 className={classes.cardTitle}>
                7 <small>Assets</small>
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Success>
                  <Add />
                </Success>
                <a href="/admin/new-record">
                  Create New Record
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <img className="Icon" src={Eth}></img>
              </CardIcon>
              <p className={classes.cardCategory}>ETH Balance</p>
              <h3 className={classes.cardTitle}>
                
                1.01 <small>Ether</small>
                </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Cached />
                <a href="">
                Refresh
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="success">
              <img className="Icon" src={Pruf}></img>
              </CardIcon>
              <p className={classes.cardCategory}>PRüF Balance</p>
              <h3 className={classes.cardTitle}>
                125,345 <small>PRüF</small>
                </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Cached />
                <a href="">
                Refresh
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <h3>Marketspace</h3>
      <br />
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card product className={classes.cardHover}>
            <CardHeader image className={classes.cardHeaderHover}>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={priceImage1} alt="..." />
              </a>
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title="View"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="transparent" simple justIcon>
                    <ArtTrack className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Edit"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" simple justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Remove"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="danger" simple justIcon>
                    <Edit className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardProductTitle}>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  Cozy 5 Stars Apartment
                </a>
              </h4>
              <p className={classes.cardProductDesciprion}>
                The place is close to Barceloneta Beach and bus stop just 2 min
                by walk and near to {'"'}Naviglio{'"'} where you can enjoy the
                main night life in Barcelona.
              </p>
            </CardBody>
            <CardFooter product>
              <div className={classes.price}>
                <h4>$899/night</h4>
              </div>
              <div className={`${classes.stats} ${classes.productStats}`}>
                <Place /> Barcelona, Spain
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card product className={classes.cardHover}>
            <CardHeader image className={classes.cardHeaderHover}>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={priceImage2} alt="..." />
              </a>
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title="View"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="transparent" simple justIcon>
                    <ArtTrack className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Edit"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" simple justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Remove"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="danger" simple justIcon>
                    <Edit className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardProductTitle}>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  Office Studio
                </a>
              </h4>
              <p className={classes.cardProductDesciprion}>
                The place is close to Metro Station and bus stop just 2 min by
                walk and near to {'"'}Naviglio{'"'} where you can enjoy the
                night life in London, UK.
              </p>
            </CardBody>
            <CardFooter product>
              <div className={classes.price}>
                <h4>$1.119/night</h4>
              </div>
              <div className={`${classes.stats} ${classes.productStats}`}>
                <Place /> London, UK
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card product className={classes.cardHover}>
            <CardHeader image className={classes.cardHeaderHover}>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={priceImage3} alt="..." />
              </a>
            </CardHeader>
            <CardBody>
              <div className={classes.cardHoverUnder}>
                <Tooltip
                  id="tooltip-top"
                  title="View"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="transparent" simple justIcon>
                    <ArtTrack className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Edit"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="success" simple justIcon>
                    <Refresh className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
                <Tooltip
                  id="tooltip-top"
                  title="Remove"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button color="danger" simple justIcon>
                    <Edit className={classes.underChartIcons} />
                  </Button>
                </Tooltip>
              </div>
              <h4 className={classes.cardProductTitle}>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  Beautiful Castle
                </a>
              </h4>
              <p className={classes.cardProductDesciprion}>
                The place is close to Metro Station and bus stop just 2 min by
                walk and near to {'"'}Naviglio{'"'} where you can enjoy the main
                night life in Milan.
              </p>
            </CardBody>
            <CardFooter product>
              <div className={classes.price}>
                <h4>$459/night</h4>
              </div>
              <div className={`${classes.stats} ${classes.productStats}`}>
                <Place /> Milan, Italy
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
