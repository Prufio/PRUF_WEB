import React from "react";
import "../../assets/css/custom.css";
import { isMobile, isAndroid } from "react-device-detect";
import { RWebShare } from "react-web-share";
import swalReact from "@sweetalert/with-react";
import swal from "sweetalert";
import Jdenticon from "react-jdenticon";
import { QRCode } from "react-qrcode-logo";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Refresh from "@material-ui/icons/Refresh";
import Share from "@material-ui/icons/Share";

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
import {
  ArrowBackIos,
  ArrowForwardIos,
  DashboardOutlined,
  KeyboardArrowLeft,
  Settings,
} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Printer from "../../Resources/print";
import ARweavePNG from "../../assets/img/arweave.png";
import IPFSPNG from "../../assets/img/ipfs.png";

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  React.useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (props.ps) {
      // eslint-disable-next-line react/prop-types
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
    if (window.assetsPerPage) {
      setAssetsPerPage(window.assetsPerPage);
    }
  }, []);

  const [viewAsset, setViewAsset] = React.useState(false);
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [selectedAssetObj, setSelectedAssetObj] = React.useState({});
  // eslint-disable-next-line no-unused-vars
  const [identicon, setIdenticon] = React.useState(<></>);
  // eslint-disable-next-line no-unused-vars
  const [baseURL, setBaseURL] = React.useState(
    "https://app.pruf.io/#/user/search/"
  );
  const [URL, setURL] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState("");
  const [copyText, setCopyText] = React.useState(false);
  const [pageNum, setPageNum] = React.useState(1);
  const [assetsPerPage, setAssetsPerPage] = React.useState(8);
  // eslint-disable-next-line no-unused-vars
  const [currency, setCurrency] = React.useState("ü");

  // eslint-disable-next-line react/prop-types
  const numOfPages = Math.ceil(props.assetArr.length / assetsPerPage);

  const moreInfo = (e) => {
    //console.log(e);
    // eslint-disable-next-line react/prop-types
    if (props.ps) {
      //console.log(props.ps)
      // eslint-disable-next-line react/prop-types
      props.ps.element.scrollTop = 124;
    } else {
      window.scrollTo({ bottom: -124, behavior: "smooth" });
      document.documentElement.scrollTop = 124;
      document.scrollingElement.scrollTop = 124;
    }
    //console.log(props.ps.element.scrollTop)
    const url = String(baseURL) + String(e.id);

    if (e === "back") {
      // eslint-disable-next-line react/prop-types
      if (props.ps) {
        //console.log(props.ps)
        // eslint-disable-next-line react/prop-types
        props.ps.element.scrollTop = 0;
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
      }
      let _pageNum = pageNum;

      const getRightPage = () => {
        if (assetsPerPage * _pageNum <= selectedAssetObj.dBIndex) {
          _pageNum++;
          getRightPage();
        }
      };

      getRightPage();

      setPageNum(_pageNum);
      setSelectedAssetObj({});
      return setViewAsset(false);
    }
    if (e.DisplayImage !== undefined && e.DisplayImage !== "") {
      setSelectedImage(e.DisplayImage);
    } else {
      setSelectedImage("");
    }

    setViewAsset(true);
    setSelectedAssetObj(e);
    setIdenticon(<Jdenticon value={e.id} />);
    setURL(url);

    window.printObj = e;
  };

  const copyTextSnippet = (temp) => {
    navigator.clipboard.writeText(temp);
    if (isMobile) {
      swal("Asset ID Copied to Clipboard!");
    }
    if (!isMobile) {
      setCopyText(true);
      setTimeout(() => {
        setCopyText(false);
      }, 1000);
    }
  };

  const generateAssetDash = (arr) => {
    if (!arr) return <></>;
    //console.log(window.backIndex);
    if (
      window.backIndex > -1 &&
      window.backIndex !== null &&
      window.backIndex !== undefined
    ) {
      let backIndex = window.backIndex,
        newObj = {},
        newStat,
        newStatNum;

      if (window.newDescObj) {
        newObj = JSON.parse(JSON.stringify(window.newDescObj));
        if (newObj.photo.DisplayImage) {
          newObj.DisplayImage = newObj.photo.DisplayImage;
        } else if (newObj.photo && Object.values(newObj.photo).length > 0) {
          newObj.DisplayImage = Object.values(newObj.photo)[0];
        } else {
          newObj.DisplayImage = "";
        }
      } else if (arr[backIndex]) {
        newObj = JSON.parse(JSON.stringify(arr[backIndex]));
      }

      if (window.newStat) {
        newObj.statusNum = window.newStat.num;
        newObj.status = window.newStat.str;
        window.newStat = {}
      }

      if (window.costInfo) {
        newObj.currency = window.costInfo.currency
        newObj.price = window.costInfo.price
        window.costInfo = {}
      }

      newObj.dBIndex = backIndex

      window.newStat = null;
      window.newDescObj = null;

      moreInfo(newObj);

      window.backIndex = undefined;
    }

    if (arr.length > 0) {
      let component = [];
      let numOfPages = Math.ceil(arr.length / assetsPerPage);
      let start = pageNum * assetsPerPage - assetsPerPage;
      let end = start + assetsPerPage;

      if (pageNum === numOfPages) {
        end -= pageNum * assetsPerPage - arr.length;
      }
      //console.log(obj)

      for (let i = start; i < end; i++) {
        //console.log(i, "Adding: ", window.assets.descriptions[i], "and ", window.assets.ids[i])
        //console.log(i, arr.length - start)
        //if(i < arr.length - start){
        component.push(
          <GridItem key={"asset" + i} xs={12} sm={6} md={6} lg={3}>
            <Card chart className={classes.cardHover}>
              <>
                {!isMobile && (
                  <CardHeader
                    image
                    className={classes.cardHeaderHoverDashboard}
                  >
                    <button
                      className={classes.cardHeaderHoverJdenticon}
                      onClick={() =>
                        moreInfo(Object.assign(arr[i], { dBIndex: i }))
                      }
                    >
                      {arr[i].DisplayImage !== "" &&
                        arr[i].DisplayImage !== undefined && (
                          <img
                            title="View Asset"
                            src={arr[i].DisplayImage}
                            alt=""
                          />
                        )}

                      {arr[i].DisplayImage !== "" &&
                        arr[i].DisplayImage === undefined && (
                          <div className="jdenticonMoreInfo">
                            <Jdenticon value={arr[i].id} />
                          </div>
                        )}
                      {arr[i].DisplayImage === "" &&
                        arr[i].DisplayImage !== undefined && (
                          <div className="jdenticonMoreInfo">
                            <Jdenticon value={arr[i].id} />
                          </div>
                        )}
                    </button>
                  </CardHeader>
                )}
                {isMobile && (
                  <CardHeader image className={classes.cardHeaderHover}>
                    <button className={classes.cardHeaderHoverJdenticon}>
                      {arr[i].DisplayImage !== "" &&
                        arr[i].DisplayImage !== undefined && (
                          <img
                            title="View Asset"
                            src={arr[i].DisplayImage}
                            alt=""
                          />
                        )}

                      {arr[i].DisplayImage !== "" &&
                        arr[i].DisplayImage === undefined && (
                          <>
                            <Jdenticon value={arr[i].id} />
                          </>
                        )}
                      {arr[i].DisplayImage === "" &&
                        arr[i].DisplayImage !== undefined && (
                          <>
                            <Jdenticon value={arr[i].id} />
                          </>
                        )}
                    </button>
                  </CardHeader>
                )}
              </>

              <CardBody>
                {!isMobile && <div className={classes.cardHover}></div>}
                {isMobile && (
                  <div className={classes.cardHoverUnder}>
                    <Tooltip
                      id="tooltip-top"
                      title="View/Edit"
                      placement="bottom"
                      classes={{ tooltip: classes.tooltip }}
                    >
                      <Button
                        color="success"
                        simple
                        justIcon
                        onClick={() =>
                          moreInfo(Object.assign(arr[i], { dBIndex: i }))
                        }
                      >
                        <Icon>login</Icon>
                      </Button>
                    </Tooltip>
                  </div>
                )}
                <h4 className={classes.cardTitle}>{arr[i].name}</h4>
                {arr[i].currency === "0" && (
                  <h5 className={classes.cardTitle}>Status:&nbsp;{arr[i].status}</h5>
                )}
                {arr[i].currency === undefined && (
                  <h5 className={classes.cardTitle}>Status:&nbsp;{arr[i].status}</h5>
                )}
                {arr[i].currency !== "0" && (
                  <div>
                  <h5 className={classes.cardTitle}>Status:&nbsp;{arr[i].status}</h5>
                  <h5 className={classes.cardTitle}>Sale Price:&nbsp;ü{arr[i].price}</h5>
                  </div>
                )}
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

      return component;
      // eslint-disable-next-line react/prop-types
    } else if (props.assets === "0") {
      return (
        <h2>
          No assets held by user.{" "}
          <a className="lightBlue" href="/#/user/new-asset">
            Create One
          </a>
          .
        </h2>
      );
    } else {
      return (
        <>
          <h3>Getting Asset Data</h3>{" "}
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </>
      );
    }
  };

  const generateThumbs = (obj) => {
    let component = [],
      photos = Object.values(obj.photo);
    //console.log("photos", photos)
    if (photos.length === 0) {
      return (
        <div className="assetImageSelectorButton">
          <img
            title="View Image"
            src={placeholder}
            className="imageSelectorImage"
            alt=""
          />
        </div>
      );
    }
    for (let i = 0; i < photos.length; i++) {
      component.push(
        <div
          key={"thumb" + String(i)}
          value={photos[i]}
          className="assetImageSelectorButton"
          onClick={() => {
            showImage(photos[i]);
          }}
        >
          <img
            title="View Image"
            src={photos[i]}
            className="imageSelectorImage"
            alt=""
          />
        </div>
      );
    }
    return component;
  };

  const showImage = (e) => {
    setSelectedImage(e);

    //console.log(selectedImage)
    //console.log(e)
  };

  const newPageNum = (e) => {
    setPageNum(e);
  };

  const handleShowNum = (e) => {
    let _pageNum = pageNum;

    const getNewNum = () => {
      // eslint-disable-next-line react/prop-types
      if (_pageNum * e > props.assetArr.length && _pageNum !== 1) {
        _pageNum--;
        return getNewNum();
      }
    };

    getNewNum();

    setPageNum(_pageNum);
    setAssetsPerPage(e);
  };

  const renderOptions = (status) => {
    if (!status || !selectedAssetObj.statusNum) return;
    let na = '(Not Available in this Status)'
    let opt
    switch(status) {
      case "50" : {
        opt = [
          {
            dis: true,
            msg: selectedAssetObj.price === "0" ? `Set for sale ${na}` : `Update Price ${na}`,
            key: "sfsOption",
            val: "sell"
          },
          {
            dis: true,
            msg: `Transfer ${na}`,
            key: "txrOption", 
            val: "transfer"
          },
          {
            dis: false,
            msg: "Verify",
            key: "verOption",
            val: "verify"
          },
          {
            dis: true,
            msg: `Discard ${na}`,
            key: "dscOption",
            val: "discard"
          },
          {
            dis: true,
            msg: `Import ${na}`,
            key: "impOption",
            val: "import"
          },
          {
            dis: true,
            msg: `Export ${na}`,
            key: "expOption",
            val: "export"
          },
          {
            dis: true,
            msg: `Change Status ${na}`,
            key: "chsOption",
            val: "modify-status"
          },
          /* {
            dis: true,
            msg: `Update Mutable Info ${na}`,
            key: "umiOption",
            val: "edit-information"
          }, */
          {
            dis: true,
            msg: `Update Owner Info ${na}`,
            key: 'uoiOption',
            val: 'edit-rightsholder'
          }
        ]; break
      } case "51" : {
        opt = [
          {
            dis: false,
            msg: selectedAssetObj.price === "0" ? `Set for sale` : `Update Price`,
            key: "sfsOption",
            val: "sell"
          },
          {
            dis: false,
            msg: `Transfer`,
            key: "txrOption", 
            val: "transfer"
          },
          {
            dis: false,
            msg: "Verify",
            key: "verOption",
            val: "verify"
          },
          {
            dis: true,
            msg: `Discard ${na}`,
            key: "dscOption",
            val: "discard"
          },
          {
            dis: true,
            msg: `Import ${na}`,
            key: "impOption",
            val: "import"
          },
          {
            dis: false,
            msg: `Export`,
            key: "expOption",
            val: "export"
          },
          {
            dis: false,
            msg: `Change Status`,
            key: "chsOption",
            val: "modify-status"
          },
          /* {
            dis: false,
            msg: `Update Mutable Info`,
            key: "umiOption",
            val: "edit-information"
          }, */
          {
            dis: false,
            msg: `Update Owner Info`,
            key: 'uoiOption',
            val: 'edit-rightsholder'
          }
        ]; break
      } case "52" : {
        opt = [
          {
            dis: false,
            msg: selectedAssetObj.price === "0" ? `Set for sale` : `Update Price`,
            key: "sfsOption",
            val: "sell"
          },
          {
            dis: true,
            msg: `Transfer ${na}`,
            key: "txrOption", 
            val: "transfer"
          },
          {
            dis: false,
            msg: "Verify",
            key: "verOption",
            val: "verify"
          },
          {
            dis: true,
            msg: `Discard ${na}`,
            key: "dscOption",
            val: "discard"
          },
          {
            dis: true,
            msg: `Import ${na}`,
            key: "impOption",
            val: "import"
          },
          {
            dis: true,
            msg: `Export ${na}`,
            key: "expOption",
            val: "export"
          },
          {
            dis: false,
            msg: `Change Status`,
            key: "chsOption",
            val: "modify-status"
          },
          /* {
            dis: false,
            msg: `Update Mutable Info`,
            key: "umiOption",
            val: "edit-information"
          }, */
          {
            dis: false,
            msg: `Update Owner Info`,
            key: 'uoiOption',
            val: 'edit-rightsholder'
          }
        ]; break
      } case "53" : {
        opt = [
          {
            dis: true,
            msg: selectedAssetObj.price === "0" ? `Set for sale ${na}` : `Update Price ${na}`,
            key: "sfsOption",
            val: "sell"
          },
          {
            dis: true,
            msg: `Transfer ${na}`,
            key: "txrOption", 
            val: "transfer"
          },
          {
            dis: false,
            msg: "Verify",
            key: "verOption",
            val: "verify"
          },
          {
            dis: true,
            msg: `Discard ${na}`,
            key: "dscOption",
            val: "discard"
          },
          {
            dis: true,
            msg: `Import ${na}`,
            key: "impOption",
            val: "import"
          },
          {
            dis: true,
            msg: `Export ${na}`,
            key: "expOption",
            val: "export"
          },
          {
            dis: false,
            msg: `Change Status`,
            key: "chsOption",
            val: "modify-status"
          },
          /* {
            dis: true,
            msg: `Update Mutable Info ${na}`,
            key: "umiOption",
            val: "edit-information"
          }, */
          {
            dis: false,
            msg: `Update Owner Info`,
            key: 'uoiOption',
            val: 'edit-rightsholder'
          }
        ]; break
      } case "54" : {
        opt = [
          {
            dis: true,
            msg: selectedAssetObj.price === "0" ? `Set for sale ${na}` : `Update Price ${na}`,
            key: "sfsOption",
            val: "sell"
          },
          {
            dis: true,
            msg: `Transfer ${na}`,
            key: "txrOption", 
            val: "transfer"
          },
          {
            dis: false,
            msg: "Verify",
            key: "verOption",
            val: "verify"
          },
          {
            dis: true,
            msg: `Discard ${na}`,
            key: "dscOption",
            val: "discard"
          },
          {
            dis: true,
            msg: `Import ${na}`,
            key: "impOption",
            val: "import"
          },
          {
            dis: true,
            msg: `Export ${na}`,
            key: "expOption",
            val: "export"
          },
          {
            dis: false,
            msg: `Change Status`,
            key: "chsOption",
            val: "modify-status"
          },
          /* {
            dis: true,
            msg: `Update Mutable Info ${na}`,
            key: "umiOption",
            val: "edit-information"
          }, */
          {
            dis: false,
            msg: `Update Owner Info`,
            key: 'uoiOption',
            val: 'edit-rightsholder'
          }
        ]; break
      } case "56" : {
        opt = [
          {
            dis: true,
            msg: selectedAssetObj.price === "0" ? `Set for sale ${na}` : `Update Price ${na}`,
            key: "sfsOption",
            val: "sell"
          },
          {
            dis: true,
            msg: `Transfer ${na}`,
            key: "txrOption", 
            val: "transfer"
          },
          {
            dis: false,
            msg: "Verify",
            key: "verOption",
            val: "verify"
          },
          {
            dis: true,
            msg: `Discard ${na}`,
            key: "dscOption",
            val: "discard"
          },
          {
            dis: true,
            msg: `Import ${na}`,
            key: "impOption",
            val: "import"
          },
          {
            dis: true,
            msg: `Export ${na}`,
            key: "expOption",
            val: "export"
          },
          {
            dis: true,
            msg: `Change Status ${na}`,
            key: "chsOption",
            val: "modify-status"
          },
          /* {
            dis: true,
            msg: `Update Mutable Info ${na}`,
            key: "umiOption",
            val: "edit-information"
          }, */
          {
            dis: true,
            msg: `Update Owner Info ${na}`,
            key: 'uoiOption',
            val: 'edit-rightsholder'
          }
        ]; break
      } case "57" : {
        opt = [
          {
            dis: false,
            msg: selectedAssetObj.price === "0" ? `Set for sale` : `Update Price`,
            key: "sfsOption",
            val: "sell"
          },
          {
            dis: true,
            msg: `Transfer ${na}`,
            key: "txrOption", 
            val: "transfer"
          },
          {
            dis: false,
            msg: "Verify",
            key: "verOption",
            val: "verify"
          },
          {
            dis: true,
            msg: `Discard ${na}`,
            key: "dscOption",
            val: "discard"
          },
          {
            dis: true,
            msg: `Import ${na}`,
            key: "impOption",
            val: "import"
          },
          {
            dis: true,
            msg: `Export ${na}`,
            key: "expOption",
            val: "export"
          },
          {
            dis: false,
            msg: `Change Status`,
            key: "chsOption",
            val: "modify-status"
          },
          /* {
            dis: true,
            msg: `Update Mutable Info ${na}`,
            key: "umiOption",
            val: "edit-information"
          }, */
          {
            dis: false,
            msg: `Update Owner Info`,
            key: 'uoiOption',
            val: 'edit-rightsholder'
          }
        ]; break
      } case "58" : {
        opt = [
          {
            dis: false,
            msg: selectedAssetObj.price === "0" ? `Set for sale` : `Update Price`,
            key: "sfsOption",
            val: "sell"
          },
          {
            dis: true,
            msg: `Transfer ${na}`,
            key: "txrOption", 
            val: "transfer"
          },
          {
            dis: false,
            msg: "Verify",
            key: "verOption",
            val: "verify"
          },
          {
            dis: true,
            msg: `Discard ${na}`,
            key: "dscOption",
            val: "discard"
          },
          {
            dis: true,
            msg: `Import ${na}`,
            key: "impOption",
            val: "import"
          },
          {
            dis: true,
            msg: `Export ${na}`,
            key: "expOption",
            val: "export"
          },
          {
            dis: false,
            msg: `Change Status`,
            key: "chsOption",
            val: "modify-status"
          },
          /* {
            dis: true,
            msg: `Update Mutable Info ${na}`,
            key: "umiOption",
            val: "edit-information"
          }, */
          {
            dis: false,
            msg: `Update Owner Info`,
            key: 'uoiOption',
            val: 'edit-rightsholder'
          }
        ]; break
      } case "59" : {
        opt = [
          {
            dis: false,
            msg: selectedAssetObj.price === "0" ? `Set for sale` : `Update Price`,
            key: "sfsOption",
            val: "sell"
          },
          {
            dis: true,
            msg: `Transfer ${na}`,
            key: "txrOption", 
            val: "transfer"
          },
          {
            dis: false,
            msg: "Verify",
            key: "verOption",
            val: "verify"
          },
          {
            dis: false,
            msg: `Discard`,
            key: "dscOption",
            val: "discard"
          },
          {
            dis: true,
            msg: `Import ${na}`,
            key: "impOption",
            val: "import"
          },
          {
            dis: true,
            msg: `Export ${na}`,
            key: "expOption",
            val: "export"
          },
          {
            dis: false,
            msg: `Change Status`,
            key: "chsOption",
            val: "modify-status"
          },
          /* {
            dis: false,
            msg: `Update Mutable Info`,
            key: "umiOption",
            val: "edit-information"
          }, */
          {
            dis: false,
            msg: `Update Owner Info`,
            key: 'uoiOption',
            val: 'edit-rightsholder'
          }
        ]; break
      } case "70" : {
        opt = [
          {
            dis: false,
            msg: selectedAssetObj.price === "0" ? `Set for sale` : `Update Price`,
            key: "sfsOption",
            val: "sell"
          },
          {
            dis: true,
            msg: `Transfer ${na}`,
            key: "txrOption", 
            val: "transfer"
          },
          {
            dis: false,
            msg: "Verify",
            key: "verOption",
            val: "verify"
          },
          {
            dis: true,
            msg: `Discard ${na}`,
            key: "dscOption",
            val: "discard"
          },
          {
            dis: false,
            msg: `Import`,
            key: "impOption",
            val: "import"
          },
          {
            dis: true,
            msg: `Export ${na}`,
            key: "expOption",
            val: "export"
          },
          {
            dis: true,
            msg: `Change Status ${na}`,
            key: "chsOption",
            val: "modify-status"
          },
          /* {
            dis: true,
            msg: `Update Mutable Info ${na}`,
            key: "umiOption",
            val: "edit-information"
          }, */
          {
            dis: true,
            msg: `Update Owner Info ${na}`,
            key: 'uoiOption',
            val: 'edit-rightsholder'
          }
        ]; break
      } default: {
        console.log("Error in option switch");
      }
    }

    let options = opt.map((option) => {
      
      return (             
      <MenuItem
      key={option.key}
      disabled={option.dis}
      value={option.val}
      classes={{
        root: classes.selectMenuItem,
        selected: classes.selectMenuItemSelected,
      }}
    >
      {option.msg}
    </MenuItem>)
    })

    return(
      <Select
            key="OptionSelect"
            MenuProps={{
              className: classes.selectMenu,
            }}
            classes={{
              select: classes.select,
            }}
            value={simpleSelect}
            onChange={(e) => handleSimple(e)}
            inputProps={{
              name: "simpleSelect",
              id: "simple-select",
            }}
          >
            {options}
          </Select>
    )
  };

  const handleSimple = (event) => {
    // eslint-disable-next-line react/prop-types
    if (props.ps) {
      // eslint-disable-next-line react/prop-types
      props.ps.element.scrollTop = 0;
      //console.log(props.ps.element.scrollTop)
    }

    let tempObj = JSON.parse(JSON.stringify(selectedAssetObj));

    tempObj.lastRef = "/#/user/dashboard";

    let e = event.target.value,
      href,
      costId = null;

    switch (e) {
      case "sell": {
        href = "/#/user/set-for-sale";
        costId = null;
        break;
      }
      case "transfer": {
        href = "/#/user/transfer-asset";
        costId = null;
        break;
      }
      case "escrow": {
        href = "/#/user/escrow-manager";
        costId = null;
        break;
      }
      case "import": {
        href = "/#/user/import-asset";
        costId = 1;
        break;
      }
      case "export": {
        href = "/#/user/export-asset";
        costId = null;
        break;
      }
      case "discard": {
        href = "/#/user/discard-asset";
        costId = null;
        break;
      }
      case "modify-status": {
        href = "/#/user/modify-status";
        costId = 5;
        break;
      }
      case "edit-information": {
        href = "/#/user/modify-description";
        costId = 8;
        break;
      }
      case "edit-rightsholder": {
        href = "/#/user/modify-rightsholder";
        costId = 6;
        break;
      }
      case "verify": {
        href = "/#/user/verify-asset";
        costId = null;
        break;
      }
      default: {
        console.log("Invalid menu selection: '", e, "'");
        costId = null;
        break;
      }
    }
    if (costId !== null) {
      props.prufClient.get
        .operationCost(selectedAssetObj.nodeId, costId)
        .then(e => {
            tempObj.opCost = e.total
            window.sentPacket = JSON.parse(JSON.stringify(tempObj))
            window.assetsPerPage = assetsPerPage
            console.log(tempObj)
            console.log(window.sentPacket)
            setSimpleSelect(event.target.value)
            return (window.location.href = href)
        });
    } else {
      window.sentPacket = JSON.parse(JSON.stringify(tempObj));
      window.assetsPerPage = assetsPerPage;

      console.log(tempObj);
      console.log(window.sentPacket);
      setSimpleSelect(event.target.value);
      return (window.location.href = href);
    }
  };

  const classes = useStyles();
  return (
    <div>
      {/* <GridContainer> */}
      {/* <GridItem xs={12}> */}
      {!viewAsset && (
        <Card>
          <CardHeader icon>
            <CardIcon
              className="headerIconBack"
              onClick={() => {
                moreInfo("back");
              }}
            >
              <DashboardOutlined />
            </CardIcon>
            <div className="dashboardHeader">
              <div className="flexRowWithGap">
                <h4 className={classes.cardIconTitle}>Asset Dashboard</h4>
                <Tooltip title="Refresh">
                  <Icon
                    className="MLBGradientRefresh"
                    onClick={() => {
                      window.replaceAssetData.refreshAssets = true
                      window.dispatchEvent(props.refresh)
                    }}
                  >
                    <Refresh />
                  </Icon>
                </Tooltip>
              </div>
            </div>
            <br />
          </CardHeader>
          {/* eslint-disable-next-line react/prop-types*/}
          {!props.addr && props.isMounted && (
            <h3 className="bump">
              <br />
              Please connect to an Ethereum provider.
            </h3>
          )}
        </Card>
      )}
      {/* </GridItem> */}
      {/* </GridContainer> */}
      {/* eslint-disable-next-line react/prop-types */}
      {props.addr && props.isMounted && props.assets === "~" && (
        <GridContainer>
          <>
            <h3>Getting Token Balances</h3>
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </>
        </GridContainer>
      )}
      {/* eslint-disable-next-line react/prop-types */}
      {!props.addr && !props.isMounted && props.assets === "~" && (
        <GridContainer>
          <>
            <h3>Getting User Address</h3>
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </>
        </GridContainer>
      )}
      {/* eslint-disable-next-line react/prop-types */}
      {!viewAsset && props.addr && props.assets !== "~" && (
        // eslint-disable-next-line react/prop-types
        <GridContainer>{generateAssetDash(props.assetArr || [])}</GridContainer>
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
                        <Button
                          onClick={() => moreInfo("back")}
                          color="info"
                          justIcon
                          className="back"
                        >
                          <KeyboardArrowLeft />
                        </Button>
                      </Tooltip>
                      {selectedAssetObj.nodeData.storageProvider === "2" && (
                        <Tooltip title="See it on ARweave">
                          <a
                            href={`${selectedAssetObj.ContentUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img src={selectedImage} alt="" />
                          </a>
                        </Tooltip>
                      )}
                      {selectedAssetObj.nodeData.storageProvider === "1" && (
                        <img src={selectedImage} alt="" />
                      )}
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
                        <Button
                          onClick={() => moreInfo("back")}
                          color="info"
                          justIcon
                          className="back"
                        >
                          <KeyboardArrowLeft />
                        </Button>
                      </Tooltip>
                      <div className="jdenticonMoreInfo">
                        <Jdenticon value={selectedAssetObj.id} />
                      </div>
                    </>
                  )}
                </CardHeader>
              )}
              {isMobile && (
                <CardHeader
                  image
                  onClick={() => moreInfo("back")}
                  className={classes.cardHeaderHover}
                >
                  {selectedAssetObj.DisplayImage !== "" && (
                    <>
                      <Tooltip
                        id="tooltip-top"
                        title="Back"
                        placement="bottom"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <Button
                          onClick={() => moreInfo("back")}
                          color="info"
                          justIcon
                          className="back"
                        >
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
                        <Button
                          onClick={() => moreInfo("back")}
                          color="info"
                          justIcon
                          className="back"
                        >
                          <KeyboardArrowLeft />
                        </Button>
                      </Tooltip>
                      <div className="jdenticonMoreInfo">
                        <Jdenticon className="jdenticonMoreInfo" value={selectedAssetObj.id} />
                      </div>
                    </>
                  )}
                </CardHeader>
              )}
            </>
            <CardBody>
              {Object.values(selectedAssetObj.photo).length > 1 && (
                <div className="imageSelector">
                  {generateThumbs(selectedAssetObj)}
                </div>
              )}
              <div className="horizontal">
                <h4 className={classes.cardTitleContent}>
                  Name:&nbsp;
            </h4>
                <h4 className={classes.cardTitle}>
                  {selectedAssetObj.name}
                </h4>
              </div>
              <div className="horizontal">
                <h4 className={classes.cardTitleContent}>
                  Node:&nbsp;
            </h4>
                <h4 className={classes.cardTitle}>
                  {selectedAssetObj.nodeName}
                </h4>
              </div>

              {selectedAssetObj.currency === "0" && (
                <div className="horizontal">
                  <h4 className={classes.cardTitleContent}>
                    Status:&nbsp;
              </h4>
                  <h4 className={classes.cardTitle}>
                    {selectedAssetObj.status}
                  </h4>
                </div>
              )}
              {selectedAssetObj.currency === undefined && (
                <div className="horizontal">
                  <h4 className={classes.cardTitleContent}>
                    Status:&nbsp;
              </h4>
                  <h4 className={classes.cardTitle}>
                    {selectedAssetObj.status}
                  </h4>
                </div>
              )}
              {selectedAssetObj.currency !== "0" &&
                selectedAssetObj.currency !== undefined && (
                  <>
                    <div className="horizontal">
                      <h4 className={classes.cardTitleContent}>
                        Status:&nbsp;
                </h4>
                      <h4 className={classes.cardTitle}>
                        {selectedAssetObj.status}
                      </h4>
                    </div>
                    <div className="horizontal">
                      <h4 className={classes.cardTitleContent}>
                        Sale Price:&nbsp;
                </h4>
                      <h4 className={classes.cardTitle}>
                        {currency}{selectedAssetObj.price}
                      </h4>
                    </div>
                  </>
                )}
              {selectedAssetObj.Description !== undefined && (
                <>
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
                </>
              )}
              {selectedAssetObj.Description === undefined && (
                <TextField
                  id="outlined-multiline-static"
                  label="Description"
                  multiline
                  rows={4}
                  defaultValue="None"
                  variant="outlined"
                  fullWidth
                  disabled
                />
              )}
              {selectedAssetObj.nodeData.storageProvider === "2" && (
                <h6 className="storageProviderText">
                  See it on&nbsp;
                  <a
                    href={`${selectedAssetObj.ContentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={ARweavePNG} className="ARweave" alt=""></img>
                  </a>
                </h6>
              )}
              {selectedAssetObj.nodeData.storageProvider === "1" && (
                <h6 className="storageProviderText">
                  Stored on&nbsp;
                  <img src={IPFSPNG} className="IPFS" alt="" />
                </h6>
              )}
              {/*@dev URLs go here*/}
              <br />
              <div>
                <FormControl fullWidth className={classes.selectFormControl}>
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
                    <Tooltip title="Copy to Clipboard">
                      <div className={classes.stats}>
                        Asset ID:
                        <button
                          className="IDText"
                          onClick={() => {
                            copyTextSnippet(selectedAssetObj.id);
                          }}
                        >
                          {selectedAssetObj.id}
                        </button>
                      </div>
                    </Tooltip>
                  )}
                  {copyText && (
                    <Tooltip title="Copied to Clipboard">
                      <div className={classes.stats}>
                        Asset ID:
                        <button
                          className="IDText"
                          onClick={() => {
                            copyTextSnippet(selectedAssetObj.id);
                          }}
                        >
                          {selectedAssetObj.id}
                        </button>
                      </div>
                    </Tooltip>
                  )}
                </>
              )}
              {isMobile && !isAndroid && (
                <>
                  {!copyText && (
                    <Tooltip title="Copy to Clipboard">
                      <div className={classes.stats}>
                        Asset ID:
                        <button
                          className="IDText"
                          onClick={() => {
                            copyTextSnippet(selectedAssetObj.id);
                          }}
                        >
                          {selectedAssetObj.id.substring(0, 10) +
                            "..." +
                            selectedAssetObj.id.substring(56, 66)}
                        </button>
                      </div>
                    </Tooltip>
                  )}
                  {copyText && (
                    <Tooltip title="Copied to Clipboard">
                      <div className={classes.stats}>
                        Asset ID:
                        <button
                          className="IDText"
                          onClick={() => {
                            copyTextSnippet(selectedAssetObj.id);
                          }}
                        >
                          {selectedAssetObj.id.substring(0, 10) +
                            "..." +
                            selectedAssetObj.id.substring(56, 66)}
                        </button>
                      </div>
                    </Tooltip>
                  )}
                </>
              )}
              {isMobile && isAndroid && (
                <Tooltip title="Copy to Clipboard">
                  <CopyToClipboard
                    text={selectedAssetObj.id}
                    onCopy={() => {
                      swal("Asset ID Copied to Clipboard!");
                    }}
                  >
                    <span>
                      Asset ID:
                      {selectedAssetObj.id.substring(0, 10) +
                        "..." +
                        selectedAssetObj.id.substring(56, 66)}
                    </span>
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
                  <Tooltip title="Share Asset URL">
                    <Icon className="footerIcon">
                      <Share />
                    </Icon>
                  </Tooltip>
                </RWebShare>
                {!isMobile && (
                  <Printer
                    obj={{
                      name: selectedAssetObj.name,
                      id: selectedAssetObj.id,
                      nodeName: selectedAssetObj.nodeName,
                    }}
                  />
                )}
                <Tooltip title="View QR">
                  <Icon
                    className="footerIcon"
                    onClick={() => {
                      swalReact({
                        content: (
                          <QRCode
                            value={URL}
                            size="160"
                            fgColor="#002a40"
                            quietZone="2"
                            ecLevel="M"
                          />
                        ),
                        buttons: "close",
                      });
                    }}
                  >
                    qr_code
                  </Icon>
                </Tooltip>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {!viewAsset && (
        <Card className="dashboardFooter">
          {isMobile && (
            <h6>Assets Per Page: </h6>
          )}
          {!isMobile && (
            <h4>Assets Per Page: </h4>
          )}
          <br />
          <Select
            MenuProps={{
              className: classes.selectMenu,
            }}
            className="assetNumDropdown"
            value={assetsPerPage}
            onChange={(e) => {
              handleShowNum(e.target.value);
            }}
            inputProps={{
              name: "simpleSelect",
              id: "simple-select",
            }}
          >
            <MenuItem
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Assets per page
            </MenuItem>
            <MenuItem
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value={4}
            >
              4
            </MenuItem>
            <MenuItem
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value={8}
            >
              8
            </MenuItem>
            <MenuItem
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value={12}
            >
              12
            </MenuItem>
            <MenuItem
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value={16}
            >
              16
            </MenuItem>
            <MenuItem
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value={20}
            >
              20
            </MenuItem>
            <MenuItem
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value={60}
            >
              60
            </MenuItem>
          </Select>
          <div className="dashboardFooterPage">
            {numOfPages > 0 && pageNum > 1 && (
              <Button
                className="pageButton"
                icon
                onClick={() => {
                  newPageNum(pageNum - 1);
                }}
              >
                <ArrowBackIos />
              </Button>
            )}
            {numOfPages > 0 && pageNum === 1 && (
              <Button
                className="pageButton"
                disabled
                icon
                onClick={() => {
                  newPageNum(pageNum - 1);
                }}
              >
                <ArrowBackIos />
              </Button>
            )}

            {numOfPages > 0 && !isMobile && (
              <h4>
                Page {pageNum} / {numOfPages}
              </h4>
            )}

            {numOfPages > 0 && isMobile && (
              <h6>
                Page {pageNum} / {numOfPages}
              </h6>
            )}

            {numOfPages > 0 && pageNum !== numOfPages && (
              <Button
                className="pageButton"
                icon
                onClick={() => {
                  newPageNum(pageNum + 1);
                }}
              >
                <ArrowForwardIos />
              </Button>
            )}
            {numOfPages > 0 && pageNum === numOfPages && (
              <Button
                className="pageButton"
                icon
                disabled
                onClick={() => {
                  newPageNum(pageNum + 1);
                }}
              >
                <ArrowForwardIos />
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
