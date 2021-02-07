import React from "react";
import "../../assets/css/custom.css";
import { isMobile } from "react-device-detect";
import { RWebShare } from "react-web-share";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import Refresh from "@material-ui/icons/Refresh";
import Share from "@material-ui/icons/Share";
import Create from "@material-ui/icons/Create";
import Edit from "@material-ui/icons/Edit";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import placeholder from "../../assets/img/placeholder.jpg";
import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import { DashboardOutlined, KeyboardArrowLeft } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Printer from "../../Resources/print"

const useStyles = makeStyles(styles);

export default function Dashboard(props) {

  React.useEffect(() => {
    if(props.ps){
      props.ps.element.scrollTop = 0;
      console.log("Scrolled to ", props.ps.element.scrollTop)
    }
  },[])

  const [viewAsset, setViewAsset] = React.useState(false)
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [selectedAssetObj, setSelectedAssetObj] = React.useState({});
  const [identicon, setIdenticon] = React.useState(<></>);
  const [baseURL, setBaseURL] = React.useState("https://indevapp.pruf.io/#/user/search/");
  const [URL, setURL] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState("")

  const moreInfo = (e) => {
    //console.log(props.ps);
    if(props.ps){
      //console.log(props.ps)
      props.ps.element.scrollTop = 0
    }
    //console.log(props.ps.element.scrollTop)
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


  const generateAssetDash = (obj) => {
    if (Object.values(obj).length > 0 && obj.names.length > 0) {
      let component = [];
      //console.log(obj)

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
                      urls: obj.descriptions[i].urls,
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
                    <Button simple color="info" justIcon onClick={() => { window.resetInfo = true; window.recount = true; }}>
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
                      urls: obj.descriptions[i].urls,
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

    else if (props.assets === "0") { return <h1>No assets held by user. <a href="/#/user/new-asset">Create One</a>.</h1> }

    else { return <><h3>Loading held assets</h3> <div className="lds-ellipsis"><div></div><div></div><div></div></div></> }

  }

  const generateThumbs = (obj) => {
    let component = [], photos = Object.values(obj.photo);
    //console.log("photos", photos)
    if (photos.length === 0) {
      return (
        <div className="assetImageSelectorButton">
          <img title="View Image" src={placeholder} className="imageSelectorImage" alt="" />
        </div>
      )
    }
    for (let i = 0; i < photos.length; i++) {
      component.push(
        <div key={"thumb" + String(i)} value={photos[i]} className="assetImageSelectorButton" onClick={() => { showImage(photos[i]) }}>
          <img title="View Image" src={photos[i]} className="imageSelectorImage" alt="" />
        </div>
      )
    }

    return component
  }

  const showImage = (e) => {
    var i = new Image(); 

    i.onload = function(){
      var j = new Image();
      j.onload = function(){
        let move = i.height-j.height
        if(props.ps){
          if(move < 0){
            props.ps.element.scrollTop += move
          } else {
            props.ps.element.scrollTop = 0
          }
          console.log("Scrolled ", move)
          //console.log(props.ps.element.scrollTop)
        }
        setSelectedImage(e)
      }
      j.src = selectedImage;
    };

    i.src = e; 
    //console.log(selectedImage)
    //console.log(e)
  }

  const handleSimple = event => {
    if(props.ps){
      props.ps.element.scrollTop = 0
      //console.log(props.ps.element.scrollTop)
    }  
    window.sentPacket = selectedAssetObj;
    //console.log(window.sentPacket);
    setSimpleSelect(event.target.value);
    let e = event.target.value, href;

    switch (e) {
      case "transfer": {
        href = "/#/user/transfer-asset";
        break
      }
      case "escrow": {
        href = "/#/user/escrow-manager";
        break
      }
      case "import": {
        href = "/#/user/import-asset";
        break
      }
      case "export": {
        href = "/#/user/export-asset";
        break
      }
      case "discard": {
        href = "/#/user/discard-asset";
        break
      }
      case "modify-status": {
        href = "/#/user/modify-status";
        break
      }
      case "edit-information": {
        href = "/#/user/modify-description";
        break
      }
      case "edit-rightsholder": {
        href = "/#/user/modify-rightsholder";
        break
      }
      default: {
        console.log("Invalid menu selection: '", e, "'");
        break
      }
    }

    return window.location.href = href;
  };

  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader icon>
              <CardIcon className="headerIconBack">
                <DashboardOutlined />
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
            <>
              {!isMobile && (
                <CardHeader image className={classes.cardHeaderHoverCustom}>
                  {selectedAssetObj.DisplayImage.length > 1 && (
                    <>
                      <Tooltip
                        id="tooltip-top"
                        title="Back"
                        placement="bottom"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <Button onClick={(e) => moreInfo("back")} large color="info" justIcon className="back">
                          <KeyboardArrowLeft />
                        </Button>
                      </Tooltip>
                      <img src={selectedImage} alt="..." />
                    </>
                  )}
                  {selectedAssetObj.DisplayImage.length === 0 && (
                  <>
                    <Tooltip
                      id="tooltip-top"
                      title="Back"
                      placement="bottom"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <Button onClick={(e) => moreInfo("back")} large color="info" justIcon className="back">
                        <KeyboardArrowLeft />
                      </Button>
                    </Tooltip>
                    {selectedAssetObj.identicon}
                  </>
                  )}
                </CardHeader>
              )}
              {isMobile && (
                <CardHeader image onClick={(e) => moreInfo("back")} className={classes.cardHeaderHover}>
                  {selectedAssetObj.DisplayImage.length > 1 && (
                    <>
                      <Tooltip
                        id="tooltip-top"
                        title="Back"
                        placement="bottom"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <Button onClick={(e) => moreInfo("back")} large color="info" justIcon className="back">
                          <KeyboardArrowLeft />
                        </Button>
                      </Tooltip>
                      <img src={selectedImage} alt="..." />
                    </>
                  )}
                  {selectedAssetObj.DisplayImage.length === 0 && (<>
                    <Tooltip
                      id="tooltip-top"
                      title="Back"
                      placement="bottom"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <Button onClick={(e) => moreInfo("back")} large color="info" justIcon className="back">
                        <KeyboardArrowLeft />
                      </Button>
                    </Tooltip>
                    {selectedAssetObj.identicon}
                  </>)}
                </CardHeader>
              )}
            </>
            <CardBody>
              {Object.values(selectedAssetObj.photo).length > 1 && (
                <div className="imageSelector">
                  {generateThumbs(selectedAssetObj)}
                </div>
              )}
              <br />
              <h4 className={classes.cardTitle}>Name: {selectedAssetObj.name}</h4>
              <h4 className={classes.cardTitle}>Class: {selectedAssetObj.assetClassName} (NODE ID: {selectedAssetObj.assetClass})</h4>
              <h4 className={classes.cardTitle}>Status: {selectedAssetObj.status}</h4>
              <br />
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={4}
                defaultValue={selectedAssetObj.Description}
                variant="outlined"
                fullWidth
                disabled
              />

              <br />
              <div>
                <FormControl
                  fullWidth
                  className={classes.selectFormControl}
                >
                  <InputLabel className="functionSelectorText">
                    <Danger>
                      <Create className="functionSelectorIcon" />
                    </Danger>
                    Actions
                        </InputLabel>
                  <Select
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
                      Select Action
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
                    {/* <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="escrow"
                    >
                      Escrow
                          </MenuItem> */}
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
                      value="modify-status"
                    >
                      Update Status
                          </MenuItem>
                    {/* <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="decrement-counter"
                    >
                      Decrement Counter
                          </MenuItem> */}
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="edit-information"
                    >
                      Update Extended Data
                          </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="edit-rightsholder"
                    >
                      Update Owner Information
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
                <RWebShare
                  className="shareMenu"
                  data={{
                    text: "Check out my PRüF-verified asset!",
                    url: URL,
                    title: "Share Asset Link",
                  }}
                >
                  <div className="printButton">
                    <Share />
                  </div>
                </RWebShare>
                <Printer />
              </div>
            </CardFooter>
          </Card>
        </div>
      )
      }
    </div>
  );
}
