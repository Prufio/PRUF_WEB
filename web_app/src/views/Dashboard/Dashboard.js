import React from "react";
import "../../assets/css/custom.css";
import { isMobile, isAndroid } from "react-device-detect";
import { RWebShare } from "react-web-share";
import swalReact from '@sweetalert/with-react';
import Jdenticon from 'react-jdenticon';
import { QRCode } from 'react-qrcode-logo';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from '@material-ui/core/Icon';
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";

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
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    }
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;

    }
    if (window.assetsPerPage) {
      setAssetsPerPage(window.assetsPerPage);
    }
  }, [])

  const [viewAsset, setViewAsset] = React.useState(false);
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [selectedAssetObj, setSelectedAssetObj] = React.useState({});
  const [identicon, setIdenticon] = React.useState(<></>);
  const [baseURL, setBaseURL] = React.useState("https://app.pruf.io/#/user/search/");
  const [URL, setURL] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState("");
  const [copyText, setCopyText] = React.useState(false);
  const [pageNum, setPageNum] = React.useState(1);
  const [assetsPerPage, setAssetsPerPage] = React.useState(6);

  const numOfPages = Math.ceil(props.assetArr.length / assetsPerPage)


  const moreInfo = (e) => {
    //console.log(props.ps);
    if (props.ps) {
      //console.log(props.ps)
      props.ps.element.scrollTop = 0
    }
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;

    }
    //console.log(props.ps.element.scrollTop)
    const url = String(baseURL) + String(e.idxHash)

    if (e === "back") {
      let _pageNum = pageNum;

      const getRightPage = () => {
        if (assetsPerPage * _pageNum <= selectedAssetObj.dBIndex) {
          _pageNum++
          getRightPage()
        }
      }

      getRightPage();

      setPageNum(_pageNum);
      setSelectedAssetObj({});
      return setViewAsset(false);
    }

    if (e.DisplayImage !== undefined && e.DisplayImage !== "") {
      setSelectedImage(e.DisplayImage);
    }

    else {
      setSelectedImage("")
    }

    setViewAsset(true);
    setSelectedAssetObj(e);
    setIdenticon(<Jdenticon value={e.id} />);
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



    if (!arr) return <></>;

    if (window.backIndex) {
      let backIndex = window.backIndex, newObj, newStat, newStatNum;

      if(window.newDescObj) {
        newObj = window.newDescObj
      } 

      else {
        newObj = { text: arr[backIndex].text, photo: arr[backIndex].photo, urls: arr[backIndex].urls, name: arr[backIndex].name }
      }

      if(window.newStat){
        newStatNum = window.newStat.num;
        newStat = window.newStat.str;
      }
      
      else {
        newStatNum = arr[backIndex].statusNum;
        newStat = arr[backIndex].status;
      }

      window.newStat = null;
      window.newDescObj = null;

      moreInfo({
        dBIndex: backIndex,
        id: arr[backIndex].id,
        countPair: arr[backIndex].countPair,
        idxHash: arr[backIndex].id,
        descriptionObj: newObj,
        DisplayImage: arr[backIndex].DisplayImage,
        name: arr[backIndex].name,
        assetClass: arr[backIndex].assetClass,
        assetClassName: arr[backIndex].assetClassName,
        status: newStat,
        statusNum: newStatNum,
        Description: newObj.text.Description,
        note: arr[backIndex].note,
        text: newObj.text,
        urls: newObj.urls,
        photo: newObj.photo,
        photoUrls: newObj.photoUrls,
        identicon: arr[backIndex].identicon
      });
      window.backIndex = undefined
    }

    if (arr.length > 0) {
      let component = [];
      let numOfPages = Math.ceil(arr.length / assetsPerPage)
      let start = (pageNum * assetsPerPage) - assetsPerPage;
      let end = start + assetsPerPage;

      if (pageNum === numOfPages) {
        end -= (pageNum * assetsPerPage) - arr.length;
      }
      //console.log(obj)

      for (let i = start; i < end; i++) {
        //console.log(i, "Adding: ", window.assets.descriptions[i], "and ", window.assets.ids[i])
        //console.log(i, arr.length - start)
        //if(i < arr.length - start){
        component.push(
          <GridItem key={"asset" + i} xs={12} sm={12} md={4}>
            <Card chart className={classes.cardHover}>
              <>
                {!isMobile && (
                  <CardHeader image className={classes.cardHeaderHoverDashboard}>
                    <a className="dashboardAssetImage" onClick={() => moreInfo({
                      dBIndex: i,
                      id: arr[i].id,
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
                          <Jdenticon value={arr[i].id} />
                        </>
                      )}
                      {arr[i].DisplayImage === "" && arr[i].DisplayImage !== undefined && (
                        <>
                          <Jdenticon value={arr[i].id} />
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
                          <Jdenticon value={arr[i].id} />
                        </>
                      )}
                      {arr[i].DisplayImage === "" && arr[i].DisplayImage !== undefined && (
                        <>
                          <Jdenticon value={arr[i].id} />
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
                        dBIndex: i,
                        id: arr[i].id,
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
        //}
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

  const newPageNum = (e) => {
    /* if (props.ps) {
      //console.log(props.ps)
      props.ps.element.scrollTop = 0
    }
    else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;

    } */
    setPageNum(e)
  }

  const handleShowNum = (e) => {
    let _pageNum = pageNum;

    const getNewNum = () => {
      if (_pageNum * e > props.assetArr.length && _pageNum !== 1) {
        _pageNum--
        return getNewNum()
      }
    }

    getNewNum();

    setPageNum(_pageNum);
    setAssetsPerPage(e);

  }

  const renderOptions = (status) => {
    let component = [];
    if (!selectedAssetObj.statusNum) return

    switch (status) {
      case ("51"): {
        component.push(
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
              value="export"
            >
              Export
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
        )
        break
      }
      case ("50"): {
        component.push(
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
              Select Action
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
        )
        break
      }
      case ("52"): {
        component.push(
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
              Select Action
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
              value="modify-status"
            >
              Change Status
                          </MenuItem>
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
        )
        break
      }
      case ("53"): {
        component.push(
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
              Select Action
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
              value="modify-status"
            >
              Change Status
                          </MenuItem>
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
        )
        break
      }
      case ("54"): {
        component.push(
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
              Select Action
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
              value="modify-status"
            >
              Change Status
                          </MenuItem>
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
        )
        break
      }
      case ("59"): {
        component.push(
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
              Select Action
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
              value="verify"
            >
              Verify
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
              value="modify-status"
            >
              Change Status
            </MenuItem>
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
        )
        break
      }
      case ("70"): {
        component.push(
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
              Select Action
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
          </Select>
        )
        break
      }
      default: {
        console.log("Error in option switch")
      }
    }

    return component
  }

  const handleSimple = event => {
    if (props.ps) {
      props.ps.element.scrollTop = 0
      //console.log(props.ps.element.scrollTop)
    }

    let tempObj = JSON.parse(JSON.stringify(selectedAssetObj))

    tempObj.lastRef = "/#/user/dashboard";

    window.sentPacket = JSON.parse(JSON.stringify(tempObj));
    window.assetsPerPage = assetsPerPage;

    console.log(tempObj)
    console.log(window.sentPacket)
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
            <CardHeader icon >
              <CardIcon className="headerIconBack" onClick={() => { moreInfo("back") }}>
                <DashboardOutlined />
              </CardIcon>
              <div className="dashboardHeader">
                <div className="flexRowWithGap">
                  <h4 className={classes.cardIconTitle}>
                    Asset Dashboard
              </h4>
                  <Select
                    MenuProps={{
                      className: classes.selectMenu
                    }}
                    classes={{
                      select: classes.select
                    }}
                    value={assetsPerPage}
                    onChange={(e) => { handleShowNum(e.target.value) }}
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
                      Assets per page
                        </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value={3}
                    >
                      3
                        </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value={6}
                    >
                      6
                        </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value={9}
                    >
                      9
                        </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value={12}
                    >
                      12
                        </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value={15}
                    >
                      15
                        </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value={60}
                    >
                      60
                        </MenuItem>
                  </Select>
                  {/* <Tooltip
                  title="Refresh"
                >
                  <Icon className="MLBGradientRefresh" onClick={() => { window.location.reload(); }}>
                    <Refresh />
                  </Icon>
                </Tooltip> */}
                </div>
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
        <>
          <GridContainer>
            {generateAssetDash(props.assetArr || [])}
          </GridContainer>
          <div className="flexRow">
            {numOfPages > 0 && pageNum > 1 && (
              <><Button onClick={() => { newPageNum(pageNum - 1) }}>{"<-"}</Button></>
            )}
            {numOfPages > 0 && pageNum === 1 && (
              <><Button disabled onClick={() => { newPageNum(pageNum - 1) }}>{"<-"}</Button></>
            )}

            {numOfPages > 0 && (
              <h4>Page {pageNum} out of {numOfPages}</h4>
            )}

            {numOfPages > 0 && pageNum !== numOfPages && (
              <><Button onClick={() => { newPageNum(pageNum + 1) }}>{"->"}</Button></>
            )}
            {numOfPages > 0 && pageNum === numOfPages && (
              <><Button disabled onClick={() => { newPageNum(pageNum + 1) }}>{"->"}</Button></>
            )}
          </div>
        </>
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
                        <Button onClick={(e) => moreInfo("back")} color="info" justIcon className="back">
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
                        <Button onClick={(e) => moreInfo("back")} color="info" justIcon className="back">
                          <KeyboardArrowLeft />
                        </Button>
                      </Tooltip>
                      <Jdenticon value={selectedAssetObj.id} />
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
                        <Button onClick={(e) => moreInfo("back")} color="info" justIcon className="back">
                          <KeyboardArrowLeft />
                        </Button>
                      </Tooltip>
                      <img src={selectedImage} alt="..." />
                    </>
                  )}
                  {selectedAssetObj.DisplayImage === "" && (<>
                    <Tooltip
                      id="tooltip-top"
                      title="Back"
                      placement="bottom"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <Button onClick={(e) => moreInfo("back")} color="info" justIcon className="back">
                        <KeyboardArrowLeft />
                      </Button>
                    </Tooltip>
                    <Jdenticon value={selectedAssetObj.id} />
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
                  {renderOptions(selectedAssetObj.statusNum)}
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
              {isMobile && !isAndroid && (
                <>
                  {!copyText && (
                    <Tooltip
                      title="Copy to Clipboard"
                    >
                      <div className={classes.stats}>
                        Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(selectedAssetObj.idxHash) }}>{selectedAssetObj.idxHash.substring(0, 10) + "..." + selectedAssetObj.idxHash.substring(56, 66)}</a>
                      </div>
                    </Tooltip>
                  )}
                  {copyText && (
                    <Tooltip
                      title="Copied to Clipboard"
                    >
                      <div className={classes.stats}>
                        Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(selectedAssetObj.idxHash) }}>{selectedAssetObj.idxHash.substring(0, 10) + "..." + selectedAssetObj.idxHash.substring(56, 66)}</a>
                      </div>
                    </Tooltip>
                  )}
                </>
              )}
              {isMobile && isAndroid && (
                <Tooltip
                  title="Copy to Clipboard"
                >
                  <CopyToClipboard text={selectedAssetObj.idxHash}
                    onCopy={() => { swal("Asset ID Copied to Clipboard!") }}>
                    <span>Asset ID: &nbsp; {selectedAssetObj.idxHash.substring(0, 14) + "..." + selectedAssetObj.idxHash.substring(52, 66)}</span>
                  </CopyToClipboard>
                </Tooltip>
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
