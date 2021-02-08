import React from "react";
import "../../assets/css/custom.css";
import { isMobile } from "react-device-detect";
import { RWebShare } from "react-web-share";
import swalReact from '@sweetalert/with-react';
import { QRCode } from 'react-qrcode-logo';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from '@material-ui/core/Icon';

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
import { DashboardOutlined, KeyboardArrowLeft, Settings } from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Printer from "../../Resources/print"
import swal from "sweetalert";

const useStyles = makeStyles(styles);

export default function Dashboard(props) {

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      console.log("Scrolled to ", props.ps.element.scrollTop)
    }
  }, [])

  const [viewAsset, setViewAsset] = React.useState(false)
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [selectedAssetObj, setSelectedAssetObj] = React.useState({});
  const [identicon, setIdenticon] = React.useState(<></>);
  const [baseURL, setBaseURL] = React.useState("https://app.pruf.io/#/user/search/");
  const [URL, setURL] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState("")
  const [copyText, setCopyText] = React.useState(false)

  const moreInfo = (e) => {
    //console.log(props.ps);
    if (props.ps) {
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

  const copyTextSnippet = (temp) => {
    navigator.clipboard.writeText(temp)
    if (isMobile) {
      swal("Asset ID Copied to Clipboard!")
    }
    if (!isMobile) {
      setCopyText(true)
      setTimeout(() => { setCopyText(false) }, 1000);
    }
  }

  const generateAssetDash = (arr) => {
    if (arr.length > 0) {
      let component = [];
      //console.log(obj)

      for (let i = 0; i < arr.length; i++) {
        //console.log(i, "Adding: ", window.assets.descriptions[i], "and ", window.assets.ids[i])
        component.push(
          <GridItem key={"asset" + i} xs={12} sm={12} md={4}>
            <Card chart className={classes.cardHover}>
              <>
                {!isMobile && (
                  <CardHeader image className={classes.cardHeaderHoverDashboard}>
                    <a className="dashboardAssetImage" onClick={() => moreInfo({
                      countPair: arr[i].countPair,
                      idxHash: arr[i].id,
                      descriptionObj: { text: arr[i].text, photo: arr[i].photo, urls: arr[i].urls, name: arr[i].name },
                      DisplayImage: arr[i].DisplayImage,
                      name: arr[i].name,
                      assetClass: arr[i].assetClass,
                      assetClassName: arr[i].assetClassName,
                      status: arr[i].status,
                      statusNum: arr[i].statusNum,
                      Description: arr[i].text.Description,
                      note: arr[i].note,
                      text: arr[i].text,
                      urls: arr[i].urls,
                      photo: arr[i].photo,
                      photoUrls: arr[i].photoUrls,
                      identicon: arr[i].identicon
                    })}>

                      {arr[i].DisplayImage !== "" && arr[i].DisplayImage !== undefined && (
                        <img title="View Asset" src={arr[i].DisplayImage} alt="" />
                      )}

                      {arr[i].DisplayImage !== "" && arr[i].DisplayImage === undefined && (
                        <>
                          {arr[i].identicon}
                        </>
                      )}
                      {arr[i].DisplayImage === "" && arr[i].DisplayImage !== undefined && (
                        <>
                          {arr[i].identicon}
                        </>
                      )}
                    </a>
                  </CardHeader>
                )}
                {isMobile && (
                  <CardHeader image className={classes.cardHeaderHover}>
                    <a>

                      {arr[i].DisplayImage !== "" && arr[i].DisplayImage !== undefined && (
                        <img title="View Asset" src={arr[i].DisplayImage} alt="" />
                      )}

                      {arr[i].DisplayImage !== "" && arr[i].DisplayImage === undefined && (
                        <>
                          {arr[i].identicon}
                        </>
                      )}
                      {arr[i].DisplayImage === "" && arr[i].DisplayImage !== undefined && (
                        <>
                          {arr[i].identicon}
                        </>
                      )}
                    </a>
                  </CardHeader>
                )}
              </>
              {/* <CardHeader onClick={(e) => setViewAsset(!viewAsset)} color="info" className="DBGradient">
            <img src={macbook} alt="logo" className="assetImage" />
            </CardHeader> */}
              <CardBody>
                {!isMobile && (
                  <div className={classes.cardHover}>
                  </div>
                )}
                {isMobile && (
                  <div className={classes.cardHoverUnder}>
                    <Tooltip
                      id="tooltip-top"
                      title="View/Edit"
                      placement="bottom"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <Button color="success" simple justIcon onClick={() => moreInfo({
                        countPair: arr[i].countPair,
                        idxHash: arr[i].id,
                        descriptionObj: { text: arr[i].text, photo: arr[i].photo, urls: arr[i].urls, name: arr[i].name },
                        DisplayImage: arr[i].DisplayImage,
                        name: arr[i].name,
                        assetClass: arr[i].assetClass,
                        assetClassName: arr[i].assetClassName,
                        status: arr[i].status,
                        statusNum: arr[i].statusNum,
                        Description: arr[i].text.Description,
                        note: arr[i].note,
                        text: arr[i].text,
                        urls: arr[i].urls,
                        photo: arr[i].photo,
                        photoUrls: arr[i].photoUrls,
                        identicon: arr[i].identicon
                      })}>
                        <Icon>
                          login
</Icon>
                      </Button>
                    </Tooltip>
                  </div>
                )}
                <h4 className={classes.cardTitle}>{arr[i].name}</h4>
                <h5 className={classes.cardTitle}>Status: {arr[i].status}</h5>

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

    else { return <><h3>Getting Asset Data</h3> <div className="lds-ellipsis"><div></div><div></div><div></div></div></> }

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

    i.onload = function () {
      var j = new Image();
      j.onload = function () {
        // let move = i.height - j.height
        // if (props.ps) {
        //   if (move < 0) {
        //     props.ps.element.scrollTop += move
        //   } else {
        //     props.ps.element.scrollTop = 0
        //   }
        //   console.log("Scrolled ", move)
        //   //console.log(props.ps.element.scrollTop)
        // }
        setSelectedImage(e)
      }
      j.src = selectedImage;
    };

    i.src = e;
    //console.log(selectedImage)
    //console.log(e)
  }

  const handleSimple = event => {
    if (props.ps) {
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
      case "verify": {
        href = "/#/user/verify-asset";
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
              <div className="dashboardHeader">
                <h4 className={classes.cardIconTitle}>
                  Asset Dashboard
              </h4>
                <Tooltip
                  title="Refresh"
                >
                  <Icon className="MLBGradientRefresh" onClick={() => { window.location.reload(); }}>
                    <Refresh />
                  </Icon>
                </Tooltip>
              </div>
              <br />
            </CardHeader>
            {!props.addr && props.isMounted && (
              <h3 className="bump"><br />Please connect to an Ethereum provider.</h3>
            )}
          </Card>
        </GridItem>
      </GridContainer>
      {props.addr && props.isMounted && props.assets === "~" && (
        <GridContainer>
          <><h3>Getting Token Balances</h3><div className="lds-ellipsis"><div></div><div></div><div></div></div></>
        </GridContainer>
      )}
      {!props.addr && !props.isMounted && props.assets === "~" && (
        <GridContainer>
          <><h3>Getting User Address</h3><div className="lds-ellipsis"><div></div><div></div><div></div></div></>
        </GridContainer>
      )}
      {!viewAsset && props.addr && props.assets !== "~" && (
        <GridContainer>
          {generateAssetDash(props.assetArr || [])}
        </GridContainer>
      )}
      {viewAsset && (
        <div>
          <Card>
            <>
              {!isMobile && (
                <CardHeader image className={classes.cardHeaderHoverCustom}>
                  {selectedAssetObj.DisplayImage !== "" && (
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
                  {selectedAssetObj.DisplayImage === "" && (
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
                  {selectedAssetObj.DisplayImage !== "" && (
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
                  {selectedAssetObj.DisplayImage.length === "" && (<>
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
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="verify"
                    >
                      Verify
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
                      value="modify-status"
                    >
                      Change Status
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
                      Update Asset Info
                          </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="edit-rightsholder"
                    >
                      Update Owner Info
                          </MenuItem>
                  </Select>
                </FormControl>
              </div>
            </CardBody>
            <CardFooter>
              {!isMobile && (
                <>
                  {!copyText && (
                    <Tooltip
                      title="Copy to Clipboard"
                    >
                      <div className={classes.stats}>
                        Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(selectedAssetObj.idxHash) }}>{selectedAssetObj.idxHash}</a>
                      </div>
                    </Tooltip>
                  )}
                  {copyText && (
                    <Tooltip
                      title="Copied to Clipboard"
                    >
                      <div className={classes.stats}>
                        Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(selectedAssetObj.idxHash) }}>{selectedAssetObj.idxHash}</a>
                      </div>
                    </Tooltip>
                  )}
                </>
              )}
              {isMobile && (
                <>
                  {!copyText && (
                    <Tooltip
                      title="Copy to Clipboard"
                    >
                      <div className={classes.stats}>
                        Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(selectedAssetObj.idxHash) }}>{selectedAssetObj.idxHash.substring(0, 8) + "..." + selectedAssetObj.idxHash.substring(58, 66)}</a>
                      </div>
                    </Tooltip>
                  )}
                  {copyText && (
                    <Tooltip
                      title="Copied to Clipboard"
                    >
                      <div className={classes.stats}>
                        Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(selectedAssetObj.idxHash) }}>{selectedAssetObj.idxHash.substring(0, 8) + "..." + selectedAssetObj.idxHash.substring(58, 66)}</a>
                      </div>
                    </Tooltip>
                  )}
                </>
              )}
              <div className="icons">
                <RWebShare
                  className="shareMenu"
                  data={{
                    text: "Check out my PRüF-verified asset!",
                    url: URL,
                    title: "Share Asset Link",
                  }}
                >

                  <Tooltip
                    title="Share Asset URL"
                  >
                    <Icon className="footerIcon">
                      <Share />
                    </Icon>
                  </Tooltip>
                </RWebShare>
                {!isMobile && (
                  <Printer obj={{ name: selectedAssetObj.name, idxHash: selectedAssetObj.idxHash, assetClassName: selectedAssetObj.assetClassName }} />
                )}
                <Tooltip
                  title="View QR"
                >
                  <Icon
                    className="footerIcon"
                    onClick={() => {
                      swalReact({
                        content: <QRCode
                          value={URL}
                          size="160"
                          fgColor="#002a40"
                          quietZone="2"
                          ecLevel="M"
                        />,
                        buttons: "close"
                      })
                    }}>
                    qr_code
                </Icon>
                </Tooltip>
              </div>
            </CardFooter>
          </Card>
        </div>
      )
      }
    </div>
  );
}
