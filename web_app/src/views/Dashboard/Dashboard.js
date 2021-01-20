import React from "react";
import "../../assets/css/custom.css";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

import { isMobile } from "react-device-detect";
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
import { ExitToApp, KeyboardArrowLeft } from "@material-ui/icons";
import { supportsGoWithoutReloadUsingHash } from "history/DOMUtils";

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


export default function Dashboard(props) {

  React.useEffect(() => {
    //if(assetObj !== props.assetObj) {setAssetObj(props.assetObj)}
    // returned function will be called on component unmount 
    return () => {

    }

  })


  const [viewAsset, setViewAsset] = React.useState(false)
  const [checkedA, setCheckedA] = React.useState(true);
  const [checkedB, setCheckedB] = React.useState(false);
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [assetObj, setAssetObj] = React.useState({});
  const [selectedAssetObj, setSelectedAssetObj] = React.useState({});
  const [identicon, setIdenticon] = React.useState(<></>);
  const [baseURL, setBaseURL] = React.useState("https://indevapp.pruf.io/#/admin/");
  const [URL, setURL] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState("")
  const [reset, setReset] = React.useState("")

  const moreInfo = (e) => {
    const url = String(baseURL) + String(e.idxHash)

    if (e === "back") { setSelectedAssetObj({}); return setViewAsset(false); }

    if (e.DisplayImage !== undefined && e.DisplayImage !== "") {
      setSelectedImage(e.DisplayImage);
    }

    else {
      setSelectedImage("")
    }

    setViewAsset(true);
    setSelectedAssetObj(e);
    setIdenticon(e.identicon);
    setURL(url)

    window.printObj = e;

  }

  const sendPacket = (obj, menu, link) => {
    window.sentPacket = obj
    window.menuChange = menu
    window.location.href = '/#/' + link
  }

  const generateAssetDash = (obj) => {
    if (Object.values(obj).length > 0 && obj.names.length > 0) {
      let component = [];
      console.log(obj)

      for (let i = 0; i < obj.ids.length; i++) {
        //console.log(i, "Adding: ", window.assets.descriptions[i], "and ", window.assets.ids[i])
        component.push(
          <GridItem key={"asset" + i} xs={12} sm={12} md={4}>
            <Card chart className={classes.cardHover}>
              <CardHeader image className={classes.cardHeaderHover}>
                <>
                  {!isMobile && (
                    <a onClick={() => moreInfo({
                      countPair: obj.countPairs[i],
                      idxHash: obj.ids[i],
                      descriptionObj: obj.descriptions[i],
                      DisplayImage: obj.displayImages[i],
                      name: obj.names[i],
                      assetClass: obj.assetClasses[i],
                      assetClassName: obj.assetClassNames[i],
                      status: obj.statuses[i],
                      statusNum: obj.statusNums[i],
                      Description: obj.descriptions[i].text.Description,
                      note: obj.notes[i],
                      text: obj.descriptions[i].text,
                      photo: obj.descriptions[i].photo,
                      identicon: obj.identiconsLG[i]
                    })}>

                      {obj.displayImages[i] !== "" && (
                        <img title="View Asset" src={obj.displayImages[i]} alt="" />
                      )}

                      {obj.displayImages[i] === "" && (
                        <>
                          {obj.identicons[i]}
                        </>
                      )}
                    </a>
                  )}
                  {isMobile && (
                    <a>

                      {obj.displayImages[i] !== "" && (
                        <img title="View Asset" src={obj.displayImages[i]} alt="" />
                      )}

                      {obj.displayImages[i] === "" && (
                        <>
                          {obj.identicons[i]}
                        </>
                      )}
                    </a>
                  )}
                </>
              </CardHeader>
              {/* <CardHeader onClick={(e) => setViewAsset(!viewAsset)} color="info" className="DBGradient">
            <img src={macbook} alt="logo" className="assetImage" />
            </CardHeader> */}
              <CardBody>
                <div className={classes.cardHoverUnder}>
                  <Tooltip
                    id="tooltip-top"
                    title="Refresh"
                    placement="bottom"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <Button simple color="info" justIcon onClick={() => window.location.reload()}>
                      <Refresh className={classes.underChartIcons} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    id="tooltip-top"
                    title="View/Edit"
                    placement="bottom"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <Button color="success" simple justIcon onClick={() => moreInfo({
                      countPair: obj.countPairs[i],
                      idxHash: obj.ids[i],
                      descriptionObj: obj.descriptions[i],
                      DisplayImage: obj.displayImages[i],
                      name: obj.names[i],
                      assetClass: obj.assetClasses[i],
                      assetClassName: obj.assetClassNames[i],
                      status: obj.statuses[i],
                      statusNum: obj.statusNums[i],
                      Description: obj.descriptions[i].text.Description,
                      note: obj.notes[i],
                      text: obj.descriptions[i].text,
                      photo: obj.descriptions[i].photo,
                      identicon: obj.identiconsLG[i]
                    })}>
                      <Edit className={classes.underChartIcons} />
                    </Button>
                  </Tooltip>
                </div>
                <h4 className={classes.cardTitle}>{obj.names[i]}</h4>
                <h5 className={classes.cardTitle}>Status: {obj.statuses[i]}</h5>

              </CardBody>
              {/* <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter> */}
            </Card>
          </GridItem>
        );
      }

      return component
    }

    else if (Object.values(obj).length > 0 && obj.names.length === 0) { console.log(obj); return <h1>No assets held by user</h1> }

    else { console.log(obj); return <><h3>Loading held assets</h3> <div className="lds-facebook"><div></div><div></div><div></div></div></> }

  }

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
          {generateAssetDash(props.assetObj)}
        </GridContainer>
      )}
      {viewAsset && (
        <div>
          <Card>
            <CardHeader image onClick={(e) => moreInfo("back")} className={classes.cardHeaderHover}>
              {selectedAssetObj.DisplayImage.length > 1 && (
                <>
                  <Tooltip
                    id="tooltip-top"
                    title="Back"
                    placement="bottom"
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <Button onClick={(e) => moreInfo("back")} x-large color="info" justIcon className="back">
                      <KeyboardArrowLeft />
                    </Button>
                  </Tooltip>
                  <img src={selectedAssetObj.DisplayImage} alt="..." />
                </>
              )}
              {selectedAssetObj.DisplayImage.length === 0 && (<>
                <Tooltip
                  id="tooltip-top"
                  title="Back"
                  placement="bottom"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <Button onClick={(e) => moreInfo("back")} x-large color="info" justIcon className="back">
                    <KeyboardArrowLeft />
                  </Button>
                </Tooltip>
                {selectedAssetObj.identicon}
              </>)}
            </CardHeader>
            {/* <CardHeader color="info" className="DBGradient">
            <img src={macbook} alt="logo" className="assetImage" />
          </CardHeader> */}
            <CardBody>
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
              <h4 className={classes.cardTitle}>Name: {selectedAssetObj.name}</h4>
              <h4 className={classes.cardTitle}>Class: {selectedAssetObj.assetClassName} (NODE ID: {selectedAssetObj.assetClass})</h4>
              <h4 className={classes.cardTitle}>Status: {selectedAssetObj.status}</h4>
              <p className={classes.cardCategory}>Description: {selectedAssetObj.Description}</p>

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
                  <InputLabel>
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
            <CardFooter>
              {!isMobile && (
                <div className={classes.stats}>
                  IDX Hash: {selectedAssetObj.idxHash}
                </div>
              )}
              {isMobile && (
                <div className={classes.stats}>
                  IDX Hash: {selectedAssetObj.idxHash.substring(0, 12) + "..." + selectedAssetObj.idxHash.substring(54, 66)}
                </div>
              )}
              <div className={classes.stats}>
                <Share />
                <Print />
              </div>
            </CardFooter>
          </Card>
        </div>
      )
      }
    </div >
  );
}
