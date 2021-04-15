import React from "react";
import "../../assets/css/custom.css";
import { RWebShare } from "react-web-share";
import swal from "sweetalert";
import swalReact from "@sweetalert/with-react";
import { isAndroid, isMobile } from "react-device-detect";
import { QRCode } from "react-qrcode-logo";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Danger from "components/Typography/Danger.js";
import Checkbox from "@material-ui/core/Checkbox";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Check from "@material-ui/icons/Check";
import Share from "@material-ui/icons/Share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  DashboardOutlined,
  KeyboardArrowLeft,
  Settings,
} from "@material-ui/icons";
import Category from "@material-ui/icons/Category";
import AccountBox from "@material-ui/icons/AccountBox";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Tooltip from "@material-ui/core/Tooltip";

import QrReader from "react-qr-reader";
import Jdenticon from "react-jdenticon";

import imgStyles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import placeholder from "../../assets/img/placeholder.jpg";
import TextField from "@material-ui/core/TextField";
import Printer from "../../Resources/print";

const useStyles = makeStyles(styles);
const useImgStyles = makeStyles(imgStyles);

export default function Search(props) {
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [selectedEnabled, setSelectedEnabled] = React.useState("b");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [query, setQuery] = React.useState(null);
  const [scanQR, setScanQR] = React.useState(false);
  const [data, setData] = React.useState("");
  const [result, setResult] = React.useState("");
  const [error, setError] = React.useState("");
  const [inscription, setInscription] = React.useState("");
  const [moreInfo, setMoreInfo] = React.useState(false);
  const [authLevel, setAuthLevel] = React.useState("");
  const [asset, setAsset] = React.useState({});
  const [dBIndex, setDBIndex] = React.useState(null);
  const [price, setPrice] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  const [recycled, setRecycled] = React.useState(false);
  const [transaction, setTransaction] = React.useState(false);
  const [retrieving, setRetrieving] = React.useState(false);
  const [ownerOf, setOwnerOf] = React.useState(false);
  const [assetURL, setURL] = React.useState("");
  const [baseURL, setBaseURL] = React.useState(
    "https://app.pruf.io/#/user/search/"
  );
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isRecycling, setIsRecycling] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const [verifyResult, setVerifyResult] = React.useState("");
  const [assetClass, setAssetClass] = React.useState("");
  const [assetClassName, setAssetClassName] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [copyText, setCopyText] = React.useState(false);
  const [rootSelect, setRootSelect] = React.useState("");
  const [classSelect, setClassSelect] = React.useState("");
  const [selectedRootID, setSelectedRootID] = React.useState("");
  const [recycleCost, setRecycleCost] = React.useState("");

  const [IDXRawInput, setIDXRawInput] = React.useState(false);

  const [manufacturer, setManufacturer] = React.useState("");
  const [type, setType] = React.useState("");
  const [model, setModel] = React.useState("");
  const [serial, setSerial] = React.useState("");
  const [IDXRaw, setIDXRaw] = React.useState("");

  const [loginManufacturer, setloginManufacturer] = React.useState("");
  const [loginType, setloginType] = React.useState("");
  const [loginModel, setloginModel] = React.useState("");
  const [loginSerial, setloginSerial] = React.useState("");
  const [loginIDX, setloginIDX] = React.useState("");

  const [first, setFirst] = React.useState("");
  const [middle, setMiddle] = React.useState("");
  const [last, setLast] = React.useState("");
  const [ID, setID] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loginFirst, setloginFirst] = React.useState("");
  const [loginLast, setloginLast] = React.useState("");
  const [loginID, setloginID] = React.useState("");
  const [loginPassword, setloginPassword] = React.useState("");

  const [loginFirstState, setloginFirstState] = React.useState("");
  const [loginLastState, setloginLastState] = React.useState("");
  const [loginIDState, setloginIDState] = React.useState("");
  const [loginPasswordState, setloginPasswordState] = React.useState("");

  const [loginManufacturerState, setloginManufacturerState] = React.useState(
    ""
  );
  const [loginTypeState, setloginTypeState] = React.useState("");
  const [loginModelState, setloginModelState] = React.useState("");
  const [loginSerialState, setloginSerialState] = React.useState("");
  const [loginIDXState, setloginIDXState] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState("");

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const link = document.createElement("div");

  React.useEffect(() => {
    if (
      !window.idxQuery &&
      window.location.href.includes("0x") &&
      window.location.href.substring(
        window.location.href.indexOf("0x"),
        window.location.href.length
      ).length === 66
    ) {
      setQuery(
        window.location.href.substring(
          window.location.href.indexOf("0x"),
          window.location.href.length
        )
      );
    } else if (window.idxQuery) {
      setQuery(window.idxQuery);
      window.idxQuery = null;
    }
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
    if (window.backIndex) {
      window.backIndex = undefined;
    }
  }, []);

  React.useEffect(() => {
    if (window.contracts !== undefined && query) {
      checkInputs(query);
      setQuery(null);
    }
  }, [window.contracts, query]);

  // const refreshBalances = async () => {
  //   if (!window.web3.eth) return

  //   let pruf, ether;

  //   console.log("Refreshing ether bal")
  //   await window.web3.eth.getBalance(props.addr, (err, result) => {
  //     if (err) { console.log(err) }
  //     else { ether = window.web3.utils.fromWei(result, 'ether') }
  //     window.contracts.UTIL_TKN.methods.balanceOf(props.addr).call((err, result) => {
  //       if (err) { console.log(err) }
  //       else { pruf = window.web3.utils.fromWei(result, 'ether') }
  //       window.contracts.A_TKN.methods.balanceOf(props.addr).call((err, result) => {
  //         if (err) { console.log(err) }
  //         else { window.replaceAssetData = { assets: result, ether, pruf } }
  //       });
  //     });
  //   });
  // }

  // const rootLogin = (e) => {

  //   if (!e.target.value) return setRootSelect("")
  //   if (!props.IDHolder) {
  //     IDHolderPrompt()
  //   }

  //   else {
  //     setSelectedRootID(e.target.value)
  //   }
  // }

  const ACLogin = (event) => {
    if (!props.IDHolder) {
      IDHolderPrompt();
    } else {
      setAssetClass(event.target.value);
      setClassSelect(event.target.value);
      try {
        window.utils.resolveACFromID(event.target.value).then((e) => {
          let str = e
            .toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
          setAssetClassName(str);
          window.utils.getCosts(6, event.target.value).then((e) => {
            setRecycleCost(window.web3.utils.fromWei(e.newAsset));
          });
        });
      } catch {
        swal({
          title: "Could not find asset class",
          icon: "warning",
          text: "Please try again.",
          buttons: {
            close: {
              text: "close",
            },
          },
        });
      }
    }
  };

  const IDHolderPrompt = () => {
    let tempTxHash;

    swal({
      title: "In order to mint asset tokens, you must first have an ID token.",
      icon: "warning",
      text:
        "If you would like to mint asset tokens, please select Yes, it will mint you an ID token",
      buttons: {
        yes: {
          text: "Yes",
          value: "yes",
        },
        no: {
          text: "No",
          value: "no",
        },
      },
    }).then((value) => {
      switch (value) {
        case "yes":
          setTransactionActive(true);
          window.contracts.PARTY.methods
            .GET_ID()
            .send({ from: props.addr })
            .on("error", function (_error) {
              setTransactionActive(false);
              setTxStatus(false);
              setTxHash(Object.values(_error)[0].transactionHash);
              tempTxHash = Object.values(_error)[0].transactionHash;
              let str1 =
                "Check out your TX <a href='https://kovan.etherscan.io/tx/";
              let str2 = "' target='_blank'>here</a>";
              link.innerHTML = String(str1 + tempTxHash + str2);
              swal({
                title: "Something went wrong!",
                content: link,
                icon: "warning",
                button: "Close",
              });
            })
            .on("receipt", (receipt) => {
              setTransactionActive(false);
              setTxStatus(receipt.status);
              tempTxHash = receipt.transactionHash;
              let str1 =
                "Check out your TX <a href='https://kovan.etherscan.io/tx/";
              let str2 = "' target='_blank'>here</a>";
              link.innerHTML = String(str1 + tempTxHash + str2);
              swal({
                title: "ID Token Minted!",
                content: link,
                icon: "success",
                button: "Close",
              });
              window.replaceAssetData = { IDHolder: true };
            });
          break;

        case "no":
          break;

        default:
          break;
      }
    });
  };

  const showImage = (e) => {
    setSelectedImage(e);
  };

  const renderOptions = (status) => {
    // @dev add new status cases as they arise
    let component = [];
    if (!status || !asset.statusNum) return;
    switch (status) {
      case "50": {
        component.push(
          <Select
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
            <MenuItem
              disabled
              key="SelItem1"
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Select an option from the list
            </MenuItem>
            <MenuItem
              key="SelItem9"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="sell"
            >
              Set for sale
            </MenuItem>
            <MenuItem
              key="DisabledItem0"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="transfer"
            >
              Transfer (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem2"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="verify"
            >
              Verify
            </MenuItem>
            <MenuItem
              key="SelItem2"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="discard"
            >
              Discard (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem6"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="import"
            >
              Import (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem2"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="export"
            >
              Export (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem4"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="modify-status"
            >
              Change Status (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem3"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-information"
            >
              Update Asset Info (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem5"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-rightsholder"
            >
              Update Owner Info (Not Available in this Status)
            </MenuItem>
          </Select>
        );
        break;
      }
      case "51": {
        component.push(
          <Select
            key="Sel1"
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
            <MenuItem
              disabled
              key="SelItem1"
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Select an option from the list
            </MenuItem>
            <MenuItem
              key="SelItem9"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="sell"
            >
              Set for sale
            </MenuItem>
            <MenuItem
              key="SelItem2"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="transfer"
            >
              Transfer
            </MenuItem>
            <MenuItem
              key="SelItem3"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="verify"
            >
              Verify
            </MenuItem>
            <MenuItem
              key="DisabledItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="discard"
            >
              Discard (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem6"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="import"
            >
              Import (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem4"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="export"
            >
              Export
            </MenuItem>
            <MenuItem
              key="SelItem5"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="modify-status"
            >
              Change Status
            </MenuItem>
            <MenuItem
              key="SelItem6"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-information"
            >
              Update Asset Info
            </MenuItem>
            <MenuItem
              key="SelItem7"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-rightsholder"
            >
              Update Owner Info
            </MenuItem>
          </Select>
        );
        break;
      }
      case "52": {
        component.push(
          <Select
            key="Sel1"
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
            <MenuItem
              key="SelItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Select an option from the list
            </MenuItem>
            <MenuItem
              key="SelItem9"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="sell"
            >
              Set for sale
            </MenuItem>
            <MenuItem
              key="DisabledItem0"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="transfer"
            >
              Transfer (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem2"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="verify"
            >
              Verify
            </MenuItem>
            <MenuItem
              key="DisabledItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="discard"
            >
              Discard (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem6"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="import"
            >
              Import (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem2"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="export"
            >
              Export (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem3"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="modify-status"
            >
              Change Status
            </MenuItem>
            <MenuItem
              key="SelItem4"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-information"
            >
              Update Asset Info
            </MenuItem>
            <MenuItem
              key="SelItem5"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-rightsholder"
            >
              Update Owner Info
            </MenuItem>
          </Select>
        );
        break;
      }
      case "53": {
        component.push(
          <Select
            key="Sel1"
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
            <MenuItem
              key="SelItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Select an option from the list
            </MenuItem>
            <MenuItem
              key="SelItem9"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="sell"
            >
              Set for sale
            </MenuItem>
            <MenuItem
              key="DisabledItem0"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="transfer"
            >
              Transfer (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem2"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="verify"
            >
              Verify
            </MenuItem>
            <MenuItem
              key="DisabledItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="discard"
            >
              Discard (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem6"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="import"
            >
              Import (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem2"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="export"
            >
              Export (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem3"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="modify-status"
            >
              Change Status
            </MenuItem>
            <MenuItem
              key="SelItem4"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-information"
            >
              Update Asset Info
            </MenuItem>
            <MenuItem
              key="SelItem5"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-rightsholder"
            >
              Update Owner Info
            </MenuItem>
          </Select>
        );
        break;
      }
      case "54": {
        component.push(
          <Select
            key="Sel1"
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
            <MenuItem
              key="SelItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Select an option from the list
            </MenuItem>
            <MenuItem
              key="DisabledItem0"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="transfer"
            >
              Transfer (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem9"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="sell"
            >
              Set for sale
            </MenuItem>
            <MenuItem
              key="SelItem2"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="verify"
            >
              Verify
            </MenuItem>
            <MenuItem
              key="DisabledItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="discard"
            >
              Discard (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem6"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="import"
            >
              Import (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem2"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="export"
            >
              Export (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem3"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="modify-status"
            >
              Change Status
            </MenuItem>
            <MenuItem
              key="SelItem4"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-information"
            >
              Update Asset Info
            </MenuItem>
            <MenuItem
              key="SelItem5"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-rightsholder"
            >
              Update Owner Info
            </MenuItem>
          </Select>
        );
        break;
      }
      case "56": {
        component.push(
          <Select
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
            <MenuItem
              disabled
              key="SelItem1"
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Select an option from the list
            </MenuItem>
            <MenuItem
              key="SelItem9"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="sell"
            >
              Set for sale
            </MenuItem>
            <MenuItem
              key="DisabledItem0"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="transfer"
            >
              Transfer (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem2"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="verify"
            >
              Verify
            </MenuItem>
            <MenuItem
              key="DisabledItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="discard"
            >
              Discard (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem6"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="import"
            >
              Import (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem2"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="export"
            >
              Export (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem4"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="modify-status"
            >
              Change Status (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem3"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-information"
            >
              Update Asset Info (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem5"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-rightsholder"
            >
              Update Owner Info (Not Available in this Status)
            </MenuItem>
          </Select>
        );
        break;
      } // @dev rework when escrow released
      case "57": {
        component.push(
          <Select
            key="Sel1"
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
            <MenuItem
              disabled
              key="SelItem9"
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Select an option from the list
            </MenuItem>
            <MenuItem
              key="SelItem1"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="sell"
            >
              Set for sale
            </MenuItem>
            <MenuItem
              key="DisabledItem0"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="transfer"
            >
              Transfer (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem3"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="verify"
            >
              Verify
            </MenuItem>
            <MenuItem
              key="DisabledItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="discard"
            >
              Discard (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem6"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="import"
            >
              Import (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem2"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="export"
            >
              Export (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem5"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="modify-status"
            >
              Change Status
            </MenuItem>
            <MenuItem
              key="SelItem6"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-information"
            >
              Update Asset Info
            </MenuItem>
            <MenuItem
              key="SelItem7"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-rightsholder"
            >
              Update Owner Info
            </MenuItem>
          </Select>
        );
        break;
      }
      case "58": {
        component.push(
          <Select
            key="Sel1"
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
            <MenuItem
              disabled
              key="SelItem1"
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Select an option from the list
            </MenuItem>
            <MenuItem
              key="SelItem9"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="sell"
            >
              Set for sale
            </MenuItem>
            <MenuItem
              key="DisabledItem0"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="transfer"
            >
              Transfer (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem3"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="verify"
            >
              Verify
            </MenuItem>
            <MenuItem
              key="DisabledItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="discard"
            >
              Discard (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem6"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="import"
            >
              Import (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem2"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="export"
            >
              Export (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem5"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="modify-status"
            >
              Change Status
            </MenuItem>
            <MenuItem
              key="SelItem6"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-information"
            >
              Update Asset Info
            </MenuItem>
            <MenuItem
              key="SelItem7"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-rightsholder"
            >
              Update Owner Info
            </MenuItem>
          </Select>
        );
        break;
      }
      case "59": {
        component.push(
          <Select
            key="Sel1"
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
            <MenuItem
              key="SelItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Select an option from the list
            </MenuItem>
            <MenuItem
              key="SelItem9"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="sell"
            >
              Set for sale
            </MenuItem>
            <MenuItem
              key="DisabledItem0"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="transfer"
            >
              Transfer (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem2"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="discard"
            >
              Discard
            </MenuItem>
            <MenuItem
              key="DisabledItem6"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="import"
            >
              Import (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem2"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="export"
            >
              Export (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem3"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="verify"
            >
              Verify
            </MenuItem>
            <MenuItem
              key="SelItem5"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="modify-status"
            >
              Change Status
            </MenuItem>
            <MenuItem
              key="SelItem6"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-information"
            >
              Update Asset Info
            </MenuItem>
            <MenuItem
              key="SelItem7"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-rightsholder"
            >
              Update Owner Info
            </MenuItem>
          </Select>
        );
        break;
      }
      case "70": {
        component.push(
          <Select
            key="Sel1"
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
            <MenuItem
              key="SelItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
              }}
            >
              Select an option from the list
            </MenuItem>
            <MenuItem
              key="SelItem9"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="sell"
            >
              Set for sale
            </MenuItem>
            <MenuItem
              key="DisabledItem0"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="transfer"
            >
              Transfer (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem2"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="verify"
            >
              Verify
            </MenuItem>
            <MenuItem
              key="DisabledItem1"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="discard"
            >
              Discard (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="SelItem3"
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="import"
            >
              Import
            </MenuItem>
            <MenuItem
              key="DisabledItem2"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="export"
            >
              Export (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem4"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="modify-status"
            >
              Change Status (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem3"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-information"
            >
              Update Asset Info (Not Available in this Status)
            </MenuItem>
            <MenuItem
              key="DisabledItem5"
              disabled
              classes={{
                root: classes.selectMenuItem,
                selected: classes.selectMenuItemSelected,
              }}
              value="edit-rightsholder"
            >
              Update Owner Info (Not Available in this Status)
            </MenuItem>
          </Select>
        );
        break;
      }
      default: {
        console.log("Error in option switch");
      }
    }

    return component;
  };

  const getDBIndexOf = (e) => {
    if (!e) {
      return console.log("No ID given!");
    }
    let temp;

    for (let i = 0; i < props.assetArr.length; i++) {
      if (props.assetArr[i].id.toLowerCase() === e.toLowerCase()) {
        temp = i;
      }
    }

    if (temp) return setDBIndex(temp);
    else return console.log("Could not locate ID in dash!");
  };

  const handleSimple = (event) => {
    if (props.ps) {
      //console.log(props.ps)
      props.ps.element.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }

    let tempObj = JSON.parse(JSON.stringify(asset));

    tempObj.dBIndex = dBIndex;
    tempObj.lastRef = "/#/user/search";
    tempObj.root = selectedRootID;

    let e = event.target.value,
      href,
      costId = null;
    window.backIndex = null;

    switch (e) {
      case "transfer": {
        href = "/#/user/transfer-asset";
        costId = null;
        break;
      }
      case "sell": {
        href = "/#/user/set-for-sale";
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
        verify();
        break;
      }
      default: {
        console.log("Invalid menu selection: '", e, "'");
        href = "/#/user/home";
        break;
      }
    }
    if (costId !== null) {
      window.contracts.AC_MGR.methods
        .getServiceCosts(asset.assetClass, costId)
        .call((_error, _result) => {
          if (_error) {
            console.log("Error: ", _error);
          } else {
            let root = window.web3.utils.fromWei(Object.values(_result)[1]);
            let acth = window.web3.utils.fromWei(Object.values(_result)[3]);
            tempObj.opCost = String(Number(root) + Number(acth));

            console.log(tempObj);

            window.sentPacket = tempObj;
            setSimpleSelect(event.target.value);
            return (window.location.href = href);
          }
        });
    } else {
      console.log(tempObj);

      window.sentPacket = tempObj;
      setSimpleSelect(event.target.value);
      return (window.location.href = href);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleChangeEnabled = (event) => {
    setSelectedEnabled(event.target.value);
  };

  const handleScanQR = (event) => {
    setScanQR(!scanQR);
    setData();
    console.log("new value", !scanQR);
  };

  const verify = () => {
    setIsVerifying(true);
    if (props.ps) {
      console.log(props.ps);
      props.ps.element.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  };

  const recycle = () => {
    setIsRecycling(true);
    if (props.ps) {
      console.log(props.ps);
      props.ps.element.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  };

  const setIsNotVerifying = () => {
    setSimpleSelect("");
    setIsVerifying(false);
    setloginManufacturerState("");
    setloginTypeState("");
    setloginModelState("");
    setloginSerialState("");
    setloginIDXState("");
    setloginFirstState("");
    setloginLastState("");
    setloginIDState("");
    setloginPasswordState("");
  };

  const setIsNotRecycling = () => {
    setSimpleSelect("");
    setIsRecycling(false);
    setloginFirstState("");
    setloginLastState("");
    setloginIDState("");
    setloginPasswordState("");
  };

  const purchaseAsset = async () => {
    let newAsset = JSON.parse(JSON.stringify(asset));
    const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)
    let tempTxHash;
    console.log("Purchasing Asset");

    if (Number(props.pruf) < Number(price)) {
      swal({
        title: "Insufficient balance!",
        icon: "warning",
        button: "Close",
      });
      return console.log(price), console.log(props.pruf);
    }
    setTransaction(true);
    await window.contracts.PURCHASE.methods
      .purchaseWithPRUF(asset.id)
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransaction(false);
        tempTxHash = Object.values(_error)[0].transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        if (tempTxHash !== undefined) {
          swal({
            title: "Something went wrong!",
            content: link,
            icon: "warning",
            button: "Close",
          });
        }
        if (tempTxHash === undefined) {
          swal({
            title: "Something went wrong!",
            icon: "warning",
            button: "Close",
          });
        }
        console.log("Verification conf");
        setTxHash(Object.values(_error)[0].transactionHash);
        console.log(Object.values(_error)[0].transactionHash);
        console.log(_error);
        setError(_error);
      })
      .on("receipt", (receipt) => {
        setTransactionActive(false);
        setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        swal({
          title: "Purchase Success!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(() => {
          window.location.href = "/#/user/dashboard";
          window.replaceAssetData = { key: pageKey, newAsset: newAsset };
        });
      });
  };

  const recycleAsset = async () => {
    if (
      loginFirst === "" ||
      loginLast === "" ||
      loginID === "" ||
      loginPassword === ""
    ) {
      if (loginFirst === "") {
        setloginFirstState("error");
      }
      if (loginLast === "") {
        setloginLastState("error");
      }
      if (loginID === "") {
        setloginIDState("error");
      }
      if (loginPassword === "") {
        setloginPasswordState("error");
      }
      return;
    }

    const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)

    console.log("in RA");
    let idxHash = asset.id;
    let rgtHash;
    let rgtHashRaw;
    let tempTxHash;

    let newAsset = JSON.parse(JSON.stringify(asset));
    newAsset.status = "Out of Escrow";
    newAsset.statusNum = "58";

    if (middle === "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ""),
        String(last).replace(/\s/g, ""),
        String(ID).replace(/\s/g, ""),
        String(password).replace(/\s/g, "")
      );
    } else if (middle !== "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ""),
        String(middle).replace(/\s/g, ""),
        String(last).replace(/\s/g, ""),
        String(ID).replace(/\s/g, ""),
        String(password).replace(/\s/g, "")
      );
    }

    rgtHash = window.web3.utils.soliditySha3(
      String(idxHash),
      String(rgtHashRaw)
    );
    rgtHash = window.utils.tenThousandHashesOf(rgtHash);

    console.log("idxHash", idxHash);
    console.log("rgtHash", rgtHash);
    console.log("addr: ", window.addr);
    setTransaction(true);

    await window.contracts.RCLR.methods
      .recycle(idxHash, rgtHash, asset.assetClass)
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransaction(false);
        tempTxHash = Object.values(_error)[0].transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        if (tempTxHash !== undefined) {
          swal({
            title: "Something went wrong!",
            content: link,
            icon: "warning",
            button: "Close",
          });
        }
        if (tempTxHash === undefined) {
          swal({
            title: "Something went wrong!",
            icon: "warning",
            button: "Close",
          });
        }
        console.log("Verification conf");
        setTxHash(Object.values(_error)[0].transactionHash);
        console.log(Object.values(_error)[0].transactionHash);
        console.log(_error);
        setError(_error);
      })
      .on("receipt", (receipt) => {
        setTransactionActive(false);
        setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        swal({
          title: "Recycle Success!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(() => {
          window.newStat = { num: "58", str: "Out of Escrow" };
          window.location.href = "/#/user/dashboard";
          window.replaceAssetData = { key: pageKey, newAsset: newAsset };
        });
      });
    return;
  };

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return (window.location.href = "/#/user/home");
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  };

  const copyTextSnippet = (temp) => {
    if (isMobile) {
      navigator.clipboard.writeText(temp);
      swal("Asset ID Copied to Clipboard!");
    }

    if (!isMobile) {
      setCopyText(true);
      setTimeout(() => {
        setCopyText(false);
      }, 1000);
    }
  };

  const verifyAsset = async () => {
    if (
      loginFirst === "" ||
      loginLast === "" ||
      loginID === "" ||
      loginPassword === ""
    ) {
      if (loginFirst === "") {
        setloginFirstState("error");
      }
      if (loginLast === "") {
        setloginLastState("error");
      }
      if (loginID === "") {
        setloginIDState("error");
      }
      if (loginPassword === "") {
        setloginPasswordState("error");
      }
      return;
    }

    console.log("in vr");
    let extendedDataHash;
    let tempResult;
    let idxHash = asset.id;
    let rgtHashRaw;
    let rgtHash;

    if (middle === "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ""),
        String(last).replace(/\s/g, ""),
        String(ID).replace(/\s/g, ""),
        String(password).replace(/\s/g, "")
      );
    } else if (middle !== "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ""),
        String(middle).replace(/\s/g, ""),
        String(last).replace(/\s/g, ""),
        String(ID).replace(/\s/g, ""),
        String(password).replace(/\s/g, "")
      );
    }

    rgtHash = window.web3.utils.soliditySha3(
      String(idxHash),
      String(rgtHashRaw)
    );
    rgtHash = window.utils.tenThousandHashesOf(rgtHash);

    console.log("idxHash", idxHash);
    console.log("rgtHash", rgtHash);
    console.log("addr: ", window.addr);
    setTransaction(true);
    await window.contracts.STOR.methods
      ._verifyRightsHolder(idxHash, rgtHash)
      .call(function (_error, _result) {
        if (_error) {
          console.log(_error);
          setError(_error);
          setResult("");
          setTransaction(false);
        } else if (_result === "0") {
          console.log("Verification not Confirmed");
          swal({
            title: "Match Failed!",
            text: "Please make sure forms are filled out correctly.",
            icon: "warning",
            button: "Close",
          });
          setTransaction(false);
          setIsVerifying(false);
        } else {
          console.log("Verification Confirmed");
          swal({
            title: "Match Confirmed!",
            icon: "success",
            button: "Close",
          });
          setError("");
          setTransaction(false);
          setIsVerifying(false);
        }
      });
    return;
  };

  const handleOnScan = (e) => {
    if (!e) {
      return;
    }
    //console.log(e)
    if (
      e.includes("0x") &&
      e.substring(e.indexOf("0x"), e.indexOf("0x") + 66)
    ) {
      setScanQR(!scanQR);
      let scanQuery = e.substring(e.indexOf("0x"), e.indexOf("0x") + 66);
      console.log("Here is what we got in the scanner: ", scanQuery);
      checkInputs(scanQuery);
    } else {
      swal({
        title: "QR code does not contain a valid asset ID.",
        icon: "warning",
        button: "Close",
      });
    }
  };

  const blockchainVerifyAsset = async () => {
    if (!window.ethereum) {
      return swal({
        title: "Connect to an ethereum provider to use this functionality!",
        button: "Close",
      });
    }
    if (
      loginFirst === "" ||
      loginLast === "" ||
      loginID === "" ||
      loginPassword === ""
    ) {
      if (loginFirst === "") {
        setloginFirstState("error");
      }
      if (loginLast === "") {
        setloginLastState("error");
      }
      if (loginID === "") {
        setloginIDState("error");
      }
      if (loginPassword === "") {
        setloginPasswordState("error");
      }
      return;
    }

    console.log("in bvr");
    let idxHash = asset.id;
    let rgtHash;
    let rgtHashRaw;
    let receiptVal;
    let tempTxHash;

    if (middle === "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ""),
        String(last).replace(/\s/g, ""),
        String(ID).replace(/\s/g, ""),
        String(password).replace(/\s/g, "")
      );
    } else if (middle !== "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ""),
        String(middle).replace(/\s/g, ""),
        String(last).replace(/\s/g, ""),
        String(ID).replace(/\s/g, ""),
        String(password).replace(/\s/g, "")
      );
    }

    rgtHash = window.web3.utils.soliditySha3(
      String(idxHash),
      String(rgtHashRaw)
    );
    rgtHash = window.utils.tenThousandHashesOf(rgtHash);

    console.log("idxHash", idxHash);
    console.log("rgtHash", rgtHash);
    console.log("addr: ", props.addr);
    setTransaction(true);

    await window.contracts.STOR.methods
      .blockchainVerifyRightsHolder(idxHash, rgtHash)
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransaction(false);
        setIsVerifying(false);
        tempTxHash = Object.values(_error)[0].transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        setTxHash(Object.values(_error)[0].transactionHash);
        console.log(Object.values(_error)[0].transactionHash);
        console.log(_error);
        setError(_error);
      })
      .on("receipt", (receipt) => {
        receiptVal = receipt.events.REPORT.returnValues._msg;
        setTransaction(false);
        setIsVerifying(false);
        setTxHash(receipt.transactionHash);
        tempTxHash = receipt.transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
        let str2 = "' target='_blank'>here</a>";
        link.innerHTML = String(str1 + tempTxHash + str2);
        setVerifyResult(receiptVal);
        console.log("Verification Result :", receiptVal);
      });

    if (receiptVal === "Match confirmed") {
      swal({
        title: "Match Confirmed!",
        content: link,
        icon: "success",
        button: "Close",
      });
      console.log("Verification conf");
    }

    if (receiptVal !== "Match confirmed") {
      if (tempTxHash !== undefined) {
        swal({
          title: "Match Failed!",
          content: link,
          icon: "warning",
          button: "Close",
        });
      }
      if (tempTxHash === undefined) {
        swal({
          title: "Match Failed!",
          icon: "warning",
          button: "Close",
        });
      }
      console.log("Verification not conf");
    }

    return;
  };

  const checkInputs = (fromQR) => {
    let id;

    if (fromQR) {
      id = fromQR;
    } else if (IDXRawInput === true) {
      if (
        loginType === "" ||
        loginManufacturer === "" ||
        loginModel === "" ||
        loginSerial === ""
      ) {
        if (loginType === "") {
          setloginTypeState("error");
        }
        if (loginManufacturer === "") {
          setloginManufacturerState("error");
        }
        if (loginModel === "") {
          setloginModelState("error");
        }
        if (loginSerial === "") {
          setloginSerialState("error");
        }
        console.log("Error in inputs");
        return;
      }

      id = window.web3.utils.soliditySha3(
        String(type).replace(/\s/g, ""),
        String(manufacturer).replace(/\s/g, ""),
        String(model).replace(/\s/g, ""),
        String(serial).replace(/\s/g, "")
      );
      setIDXRawInput(false);
      setIDXRaw(id);
    } else {
      id = IDXRaw;
    }

    props.prufClient.utils.isValidId(id).then((e) => {
      if (!e) return;

      props.prufClient.get.assetExists(id).call((error, result) => {
        if (error) {
          swal({
            title: "Asset does not exist!",
            icon: "warning",
            button: "Close",
          });
          setIDXRaw("");
          setIDXRawInput(false);
        } else if ((result = "170")) {
          buildAsset(id);
        } else {
          swal({
            title: "Asset does not exist!",
            icon: "warning",
            button: "Close",
          });
          setIDXRaw("");
          setIDXRawInput(false);
        }
      });
    });
  };

  const checkIsHolder = async (id) => {
    if (!id) return;
    props.prufClient.get.ownerOfAsset(id).call((error, result) => {
      if (error) return;
      else {
        window.web3.utils.toChecksumAddress(result) ===
        window.web3.utils.toChecksumAddress(props.addr)
          ? setOwnerOf(true)
          : setOwnerOf(false);
      }
    });
  };

  const buildAsset = (id) => {
    if (!id) return;

    setURL(`${baseURL}${id}`);

    if (props.ps) {
      //console.log(props.ps)
      props.ps.element.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }

    setRetrieving(true);

    props.prufClient.get.assetRecord(id).call((_error, _result) => {
      if (_error) {
        console.log("IN ERROR IN ERROR IN ERROR");
        setError(_error);
        setResult("");
        setScanQR(false);
        setRetrieving(false);
        swal({
          title: "Asset not found!",
          icon: "warning",
          button: "Close",
        });
      } else {
        setScanQR(false);
        setResult(Object.values(_result));
        setError("");

        _result["0"] === "60" ? setRecycled(true) : checkIsHolder(id);

        let obj = {
          id: id,
          statusNum: _result["0"],
          forceModCount: _result["1"],
          assetClass: _result["2"],
          countPair: [_result["3"], _result["4"]],
          mutableDataA: _result["5"],
          mutableDataB: _result["6"],
          engravingA: _result["7"],
          engravingB: _result["8"],
          numberOfTransfers: _result["9"],
        };

        obj.identicon = <Jdenticon value={id} />;
        obj.identiconLG = <Jdenticon value={id} />;

        props.prufClient.utils.stringifyStatus(_result[0]).then((e) => {
          obj.status = e;
        });

        props.prufClient.get.assetPriceData(id).call((_error, _result) => {
          if (_error) {
            console.log("IN ERROR IN ERROR IN ERROR");
          } else {
            obj.price = _result["0"];
            obj.currency = _result["1"];

            _result["0"] !== "0"
              ? setPrice(window.web3.utils.fromWei(_result["0"]))
              : setPrice("");
            _result["1"] === "2" ? setCurrency("ü") : setCurrency("");

            props.prufClient.get
              .nodeData(obj.assetClass)
              .call((_error, _result) => {
                if (_error) {
                  console.log("IN ERROR IN ERROR IN ERROR");
                } else {
                  obj.assetClassName = _result.name;
                  obj.assetClassData = {
                    name: _result.name,
                    root: _result.assetClassRoot,
                    custodyType: _result.custodyType,
                    managementType: _result.managementType,
                    discount: _result.discount,
                    referenceAddress: _result.referenceAddress,
                    extData: _result["IPFS"],
                    storageProvider: _result.storageProvider,
                    switches: _result.switches,
                  };
                  setSelectedRootID(_result.assetClassRoot);
                  return getMutableData(obj);
                }
              });
          }
        });
      }
    });
  };

  const getMutableData = (asset) => {
    if (!asset) return console.log("Failed upon reception of:", asset);

    let obj = JSON.parse(JSON.stringify(asset));
    let storageProvider = obj.assetClassData.storageProvider;
    let mutableDataQuery;

    if (
      obj.mutableDataA ===
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      obj.mutableData = "";
      return getEngraving(obj);
    } else if (storageProvider === "1") {
      props.prufClient.utils.ipfsFromB32(obj.mutableDataA).then(async (e) => {
        let mutableDataQuery = e;
        console.log("MDQ", e);

        for await (const chunk of window.ipfs.cat(mutableDataQuery)) {
          let str = new TextDecoder("utf-8").decode(chunk);
          console.log(str);
          try {
            obj.mutableData = JSON.parse(str);
          } catch {
            obj.mutableData = str;
          }
          return getEngraving(obj);
        }
      });
    } else if (storageProvider === "2") {
      console.log(obj.mutableDataA, obj.mutableDataB);
      mutableDataQuery = window.web3.utils.hexToUtf8(
        obj.mutableDataA +
          obj.mutableDataB.substring(2, obj.mutableDataB.indexOf("0000000000"))
      );

      let xhr = new XMLHttpRequest();

      xhr.onload = () => {
        if (xhr.status !== 404) {
          try {
            props.arweaveClient.transactions.get(mutableDataQuery).then((e) => {
              let tempObj = {};
              e.get("tags").forEach((tag) => {
                let key = tag.get("name", { decode: true, string: true });
                let value = tag.get("value", { decode: true, string: true });
                tempObj[key] = value;
                //console.log(`${key} : ${value}`);
              });
              //tempObj.contentUrl = `https://arweave.net/${mutableDataQuery}`
              tempObj.contentUrl = `http://localhost:1984/${mutableDataQuery}`;
              obj.mutableData = tempObj;
              obj.contentUrl = `http://localhost:1984/${mutableDataQuery}`;
              return getEngraving(obj);
            });
          } catch {
            console.log("Id returned 404");
            obj.mutableData = "";
            obj.contentUrl = `http://localhost:1984/${mutableDataQuery}`;
            return getEngraving(obj);
          }
        } else {
          console.log("Gateway returned 404");
          obj.mutableData = "";
          obj.contentUrl = `http://localhost:1984/${mutableDataQuery}`;
          return getEngraving(obj);
        }
      };

      xhr.onerror = () => {
        console.log("Gateway returned 404");
        obj.mutableData = "";
        obj.contentUrl = `http://localhost:1984/${mutableDataQuery}`;
        return getEngraving(obj);
      };

      xhr.open("GET", `http://localhost:1984/tx/${mutableDataQuery}`, true);
      try {
        xhr.send(null);
      } catch {
        console.log("Gateway returned 404");
        obj.mutableData = "";
        obj.contentUrl = `http://localhost:1984/${mutableDataQuery}`;
        return getEngraving(obj);
      }
    }
  };

  const getEngraving = (asset) => {
    if (!asset) return console.log("Failed upon reception of:", asset);

    let obj = JSON.parse(JSON.stringify(asset));
    let storageProvider = obj.assetClassData.storageProvider;
    let engravingQuery;

    if (
      obj.engravingA ===
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      obj.engraving = "";
      return finalizeAsset(obj);
    } else if (storageProvider === "1") {
      props.prufClient.utils.ipfsFromB32(obj.engravingA).then((e) => {
        engravingQuery = e;
        for (const chunk of window.ipfs.cat(engravingQuery)) {
          let str = new TextDecoder("utf-8").decode(chunk);
          console.log(str);
          try {
            obj.engraving = JSON.parse(str);
          } catch {
            obj.engraving = str;
          }
          //console.log("EXIT")
          return finalizeAsset(obj);
        }
      });
    } else if (storageProvider === "2") {
      console.log(obj.engravingB.indexOf("0000000000000000000000"));
      engravingQuery = window.web3.utils.hexToUtf8(
        obj.engravingA +
          obj.engravingB.substring(
            2,
            obj.engravingB.indexOf("0000000000000000000000") + 1
          )
      );

      let xhr = new XMLHttpRequest();

      xhr.onload = () => {
        if (xhr.status !== 404) {
          try {
            props.arweaveClient.transactions.get(engravingQuery).then((e) => {
              if (!e) throw "Thrown";
              let tempObj = {};
              e.get("tags").forEach((tag) => {
                let key = tag.get("name", { decode: true, string: true });
                let value = tag.get("value", { decode: true, string: true });
                tempObj[key] = value;
                //console.log(`${key} : ${value}`);
              });
              //tempObj.contentUrl = `https://arweave.net/${engravingQuery}`
              tempObj.contentUrl = `http://localhost:1984/${engravingQuery}`;
              obj.engraving = tempObj;
              return finalizeAsset(obj);
            });
          } catch {
            console.log("In arweave catch clause");
            obj.engraving = "";
            return finalizeAsset(obj);
          }
        } else {
          console.log("Id returned 404");
          obj.engraving = "";
          obj.contentUrl = `http://localhost:1984/${engravingQuery}`;
          return finalizeAsset(obj);
        }
      };

      xhr.onerror = () => {
        console.log("Gateway returned 404");
        obj.engraving = "";
        obj.contentUrl = `http://localhost:1984/${engravingQuery}`;
        return finalizeAsset(obj);
      };

      xhr.open("GET", `http://localhost:1984/tx/${engravingQuery}`, true);
      try {
        xhr.send(null);
      } catch {
        console.log("Gateway returned 404");
        obj.engraving = "";
        obj.contentUrl = `http://localhost:1984/${engravingQuery}`;
        return finalizeAsset(obj);
      }
    }
  };

  const finalizeAsset = (asset) => {
    if (!asset) return console.log("Failed upon reception of:", asset);

    let obj = JSON.parse(JSON.stringify(asset));

    obj.photo = obj.engraving.photo || obj.mutableData.photo || {};
    obj.text = obj.engraving.text || obj.mutableData.text || {};
    obj.urls = obj.engraving.urls || obj.mutableData.urls || {};
    obj.name = obj.engraving.name || obj.mutableData.name || "Name Unavailable";
    obj.photoUrls = obj.engraving.photo || obj.mutableData.photo || {};
    obj.Description =
      obj.engraving.Description || obj.mutableData.Description || "";
    obj.ContentUrl =
      obj.engraving.contentUrl || obj.mutableData.contentUrl || "";

    let vals = Object.values(obj.photo),
      keys = Object.keys(obj.photo);

    console.log("Finalizing", obj);

    if (obj.assetClassData.storageProvider === "2") {
      console.log("detected storageProvider 2");

      if (
        obj.engraving.contentUrl &&
        obj.engraving["Content-Type"].includes("image")
      ) {
        obj.DisplayImage = obj.engraving.contentUrl;
        setAsset(obj);
        setSelectedImage(obj.DisplayImage);
        setRetrieving(false);
        setMoreInfo(true);
        return;
      } else if (
        obj.mutableData.contentUrl &&
        obj.mutableData["Content-Type"].includes("image")
      ) {
        obj.DisplayImage = obj.mutableData.contentUrl;
        setAsset(obj);
        setSelectedImage(obj.DisplayImage);
        setRetrieving(false);
        setMoreInfo(true);
        return;
      } else if (keys.length === 0) {
        obj.DisplayImage = "";
        setAsset(obj);
        setSelectedImage(obj.DisplayImage);
        setRetrieving(false);
        setMoreInfo(true);
        return;
      }
    } else if (obj.assetClassData.storageProvider === "1") {
      const getAndSet = (url) => {
        const req = new XMLHttpRequest();
        req.responseType = "text";

        req.onload = function () {
          console.log("response", this.response);
          if (this.response.includes("base64")) {
            obj.DisplayImage = this.response;
            setAsset(obj);
            setSelectedImage(obj.DisplayImage);
            setRetrieving(false);
            setMoreInfo(true);
            return;
          }
        };

        req.onerror = function (e) {
          //console.log("http request error")
          obj.DisplayImage = "";
          setAsset(obj);
          setSelectedImage(obj.DisplayImage);
          setRetrieving(false);
          setMoreInfo(true);
          return;
        };
        req.open("GET", url, true);
        try {
          req.send();
        } catch {
          obj.DisplayImage = "";
          setAsset(obj);
          setSelectedImage(obj.DisplayImage);
          setRetrieving(false);
          setMoreInfo(true);
          return;
        }
      };

      if (
        obj.engraving !== "" &&
        obj.engraving.DisplayImage !== "" &&
        obj.engraving.DisplayImage !== undefined
      ) {
        getAndSet(obj.engraving.DisplayImage);
      } else if (
        obj.mutableData !== "" &&
        obj.mutableData.DisplayImage !== "" &&
        obj.mutableData.DisplayImage !== undefined
      ) {
        getAndSet(obj.mutableData.DisplayImage);
      }
    } else if (keys.length > 0) {
      for (let i = 0; i < keys.length; i++) {
        const get = () => {
          if (vals[i].includes("data") && vals[i].includes("base64")) {
            obj.photo[keys[i]] = vals[i];
            if (keys[i] === "DisplayImage") {
              obj.DisplayImage = obj.photo[keys[i]];
            } else if (i === keys.length - 1) {
              //console.log("Setting Display Image")
              obj.DisplayImage = obj.photo[keys[0]];
            }
            setAsset(obj);
            setSelectedImage(obj.DisplayImage);
            forceUpdate();
            setRetrieving(false);
            setMoreInfo(true);
            return;
          } else if (!vals[i].includes("ipfs") && vals[i].includes("http")) {
            obj.photo[keys[i]] = vals[i];
            if (keys[i] === "DisplayImage") {
              //console.log("Setting Display Image")
              obj.DisplayImage = obj.photo[keys[i]];
            } else if (i === keys.length - 1) {
              //console.log("Setting Display Image")
              obj.DisplayImage = obj.photo[keys[0]];
            }
            setAsset(obj);
            setSelectedImage(obj.DisplayImage);
            forceUpdate();
            setRetrieving(false);
            setMoreInfo(true);
            return;
          } else {
            const req = new XMLHttpRequest();
            req.responseType = "text";

            req.onload = function (e) {
              //console.log("in onload")
              if (this.response.includes("base64")) {
                obj.photo[keys[i]] = this.response;
                if (keys[i] === "DisplayImage") {
                  //console.log("Setting Display Image")
                  obj.DisplayImage = obj.photo[keys[i]];
                } else if (i === keys.length - 1) {
                  //console.log("Setting Display Image")
                  obj.DisplayImage = obj.photo[keys[0]];
                }
                setAsset(obj);
                setSelectedImage(obj.DisplayImage);
                forceUpdate();
                setRetrieving(false);
                setMoreInfo(true);
                return;
              }
            };

            req.onerror = function (e) {
              //console.log("http request error")
              if (vals[i].includes("http")) {
                obj.photo[keys[i]] = vals[i];
                if (keys[i] === "DisplayImage") {
                  //console.log("Setting Display Image")
                  obj.DisplayImage = obj.photo[keys[i]];
                } else if (i === keys.length - 1) {
                  //console.log("Setting Display Image")
                  obj.DisplayImage = obj.photo[keys[0]];
                }
                setAsset(obj);
                setSelectedImage(obj.DisplayImage);
                forceUpdate();
                setRetrieving(false);
                setMoreInfo(true);
                return;
              }
            };
            req.open("GET", vals[i], true);
            req.send();
          }
        };
        get();
      }
    } else {
      console.log("No conditions met");
    }
  };

  const generateSubCatList = (arr) => {
    let subCatSelection = [
      <MenuItem
        disabled
        classes={{
          root: classes.selectMenuItem,
        }}
      >
        Select Subclass
      </MenuItem>,
    ];
    for (let i = 0; i < arr.length; i++) {
      subCatSelection.push(
        <MenuItem
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected,
          }}
          key={"key" + arr[i].name}
          value={String(arr[i].id)}
        >
          {arr[i].name}
        </MenuItem>
      );
    }
    console.log(arr);
    return subCatSelection;
  };

  const generateRootList = (arr) => {
    let rootNames = props.rootNames;
    let rootSelection = [
      <MenuItem
        disabled
        classes={{
          root: classes.selectMenuItem,
        }}
      >
        Select Class
      </MenuItem>,
    ];

    for (let i = 0; i < arr.length; i++) {
      rootSelection.push(
        <MenuItem
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected,
          }}
          value={String(arr[i])}
        >
          {rootNames[i]}
        </MenuItem>
      );
    }

    return rootSelection;
  };

  const back = () => {
    window.location.href = "/#/user/search";
    setMoreInfo(false);
  };

  const generateThumbs = (obj) => {
    console.log("obj", obj);
    if (!obj.photo) {
      return [];
    } else if (Object.values(obj.photo).length === 0) {
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
    let component = [],
      photos = Object.values(obj.photo);
    //console.log("photos", photos)
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

  const classes = useStyles();
  const imgClasses = useImgStyles();
  return (
    <>
      {window.contracts === undefined && (
        <Card>
          <CardHeader icon>
            <CardIcon className="headerIconBack">
              <DashboardOutlined />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Asset</h4>
          </CardHeader>
          <CardBody>
            <form>
              <h3>
                Connecting to the blockchain
                <div className="lds-ellipsisIF">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </h3>
            </form>
          </CardBody>
          <br />
        </Card>
      )}
      {window.contracts !== undefined && (
        <>
          {scanQR === false && moreInfo === false && (
            <Card>
              <CardHeader icon>
                <CardIcon className="headerIconBack">
                  <DashboardOutlined />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Asset</h4>
              </CardHeader>
              <CardBody>
                <form>
                  {IDXRawInput === true && !retrieving && (
                    <>
                      <CustomInput
                        success={loginManufacturerState === "success"}
                        error={loginManufacturerState === "error"}
                        labelText="Manufacturer *"
                        id="manufacturer"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (event) => {
                            setManufacturer(event.target.value.trim());
                            if (event.target.value !== "") {
                              setloginManufacturerState("success");
                            } else {
                              setloginManufacturerState("error");
                            }
                            setloginManufacturer(event.target.value);
                          },
                        }}
                      />
                      <CustomInput
                        success={loginTypeState === "success"}
                        error={loginTypeState === "error"}
                        labelText="Type *"
                        id="type"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (event) => {
                            setType(event.target.value.trim());
                            if (event.target.value !== "") {
                              setloginTypeState("success");
                            } else {
                              setloginTypeState("error");
                            }
                            setloginType(event.target.value);
                          },
                        }}
                      />
                      <CustomInput
                        success={loginModelState === "success"}
                        error={loginModelState === "error"}
                        labelText="Model *"
                        id="model"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (event) => {
                            setModel(event.target.value.trim());
                            if (event.target.value !== "") {
                              setloginModelState("success");
                            } else {
                              setloginModelState("error");
                            }
                            setloginModel(event.target.value);
                          },
                        }}
                      />
                      <CustomInput
                        success={loginSerialState === "success"}
                        error={loginSerialState === "error"}
                        labelText="Serial *"
                        id="serial"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (event) => {
                            setSerial(event.target.value.trim());
                            if (event.target.value !== "") {
                              setloginSerialState("success");
                            } else {
                              setloginSerialState("error");
                            }
                            setloginSerial(event.target.value);
                          },
                        }}
                      />
                      <div className={classes.formCategory}>
                        <small>*</small> Required fields
                      </div>
                    </>
                  )}
                  {IDXRawInput === true && retrieving && (
                    <>
                      <CustomInput
                        labelText={manufacturer}
                        id="manufacturer"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: true,
                        }}
                      />
                      <CustomInput
                        labelText={type}
                        id="type"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: true,
                        }}
                      />
                      <CustomInput
                        labelText={model}
                        id="model"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: true,
                        }}
                      />
                      <CustomInput
                        labelText={serial}
                        id="serial"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: true,
                        }}
                      />
                    </>
                  )}
                  {IDXRawInput === false && !retrieving && (
                    <>
                      <CustomInput
                        success={loginIDXState === "success"}
                        error={loginIDXState === "error"}
                        labelText="Asset ID *"
                        id="IDX"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          onChange: (event) => {
                            setIDXRaw(event.target.value.trim());
                            if (
                              event.target.value !== "" &&
                              event.target.value.trim().substring(0, 2) ===
                                "0x" &&
                              event.target.value.trim().length === 66
                            ) {
                              setloginIDXState("success");
                            } else {
                              setloginIDXState("error");
                            }
                            setloginIDX(event.target.value);
                          },
                        }}
                      />
                      <div className={classes.formCategory}>
                        <small>*</small> Required fields
                      </div>
                    </>
                  )}
                  {IDXRawInput === false && retrieving && (
                    <>
                      <CustomInput
                        labelText={IDXRaw}
                        id="IDX"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          disabled: true,
                        }}
                      />
                    </>
                  )}
                  {!retrieving && (
                    <>
                      <div
                        className="QRScanner"
                        value={scanQR}
                        onClick={(e) => handleScanQR(e)}
                      >
                        <Tooltip title="Scan QR">
                          <Icon fontSize="large">qr_code_scanner</Icon>
                        </Tooltip>
                      </div>
                      <div className={classes.checkboxAndRadio}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              tabIndex={-1}
                              onClick={() => setIDXRawInput(!IDXRawInput)}
                              checkedIcon={
                                <Check className={classes.checkedIcon} />
                              }
                              icon={<Check className={classes.uncheckedIcon} />}
                              classes={{
                                checked: classes.checked,
                                root: classes.checkRoot,
                              }}
                            />
                          }
                          classes={{
                            label: classes.label,
                            root: classes.labelRoot,
                          }}
                          label="Search via asset data fields"
                        />
                      </div>
                    </>
                  )}
                  {!retrieving && (
                    <div className="MLBGradientSubmit">
                      <Button
                        color="info"
                        className="MLBGradient"
                        onClick={(e) => checkInputs()}
                      >
                        Search Asset
                      </Button>
                    </div>
                  )}
                  {retrieving && (
                    <h3>
                      Retrieving Asset
                      <div className="lds-ellipsisIF">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </h3>
                  )}
                </form>
              </CardBody>
            </Card>
          )}
          {scanQR === true && !moreInfo && (
            <Card>
              <CardHeader icon>
                <CardIcon className="headerIconBack">
                  <DashboardOutlined />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>QR Scanner</h4>
              </CardHeader>
              <CardBody>
                {!retrieving && (
                  <QrReader
                    className="qrReader"
                    scanDelay={500}
                    onScan={(result) => handleOnScan(result)}
                    onError={(err) => {
                      if (err) {
                        console.info(err);
                      }
                    }}
                    style={{ width: "100%" }}
                  />
                )}
                {retrieving && (
                  <h3>
                    Retrieving Asset
                    <div className="lds-ellipsisIF">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </h3>
                )}
                <Button
                  value={scanQR}
                  onClick={(e) => handleScanQR(e)}
                  color="info"
                  className="MLBGradient"
                >
                  Back
                </Button>
              </CardBody>
            </Card>
          )}
          {moreInfo && (
            <Card>
              {!isVerifying && !isRecycling && (
                <>
                  {!isMobile && (
                    <CardHeader
                      image
                      className={imgClasses.cardHeaderHoverCustom}
                    >
                      {asset.photo !== undefined && (
                        <>
                          {asset.DisplayImage !== "" && (
                            <>
                              <Tooltip
                                id="tooltip-top"
                                title="Back"
                                placement="bottom"
                                classes={{ tooltip: classes.tooltip }}
                              >
                                <Button
                                  onClick={() => back()}
                                  large
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
                          {asset.DisplayImage === "" && (
                            <>
                              <Tooltip
                                id="tooltip-top"
                                title="Back"
                                placement="bottom"
                                classes={{ tooltip: classes.tooltip }}
                              >
                                <Button
                                  onClick={() => back()}
                                  large
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
                          {Object.values(asset.photo).length === 0 &&
                            asset.DisplayImage === "" && (
                              <>
                                <Tooltip
                                  id="tooltip-top"
                                  title="Back"
                                  placement="bottom"
                                  classes={{ tooltip: classes.tooltip }}
                                >
                                  <Button
                                    onClick={() => back()}
                                    large
                                    color="info"
                                    justIcon
                                    className="back"
                                  >
                                    <KeyboardArrowLeft />
                                  </Button>
                                </Tooltip>
                                <Jdenticon value={asset.id} />
                              </>
                            )}
                        </>
                      )}
                    </CardHeader>
                  )}
                  {isMobile && (
                    <CardHeader image className={imgClasses.cardHeaderHover}>
                      {asset.photo !== undefined && (
                        <>
                          {asset.DisplayImage !== "" && (
                            <>
                              <Tooltip
                                id="tooltip-top"
                                title="Back"
                                placement="bottom"
                                classes={{ tooltip: classes.tooltip }}
                              >
                                <Button
                                  onClick={() => back()}
                                  large
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
                          {asset.DisplayImage === "" && (
                            <>
                              <Tooltip
                                id="tooltip-top"
                                title="Back"
                                placement="bottom"
                                classes={{ tooltip: classes.tooltip }}
                              >
                                <Button
                                  onClick={() => back()}
                                  large
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
                          {Object.values(asset.photo).length === 0 &&
                            asset.DisplayImage === "" && (
                              <>
                                <Tooltip
                                  id="tooltip-top"
                                  title="Back"
                                  placement="bottom"
                                  classes={{ tooltip: classes.tooltip }}
                                >
                                  <Button
                                    onClick={() => back()}
                                    large
                                    color="info"
                                    justIcon
                                    className="back"
                                  >
                                    <KeyboardArrowLeft />
                                  </Button>
                                </Tooltip>
                                <Jdenticon value={asset.id} />
                              </>
                            )}
                        </>
                      )}
                    </CardHeader>
                  )}
                </>
              )}
              <CardBody>
                {!isVerifying && !isRecycling && (
                  <>
                    {Object.values(asset.photo).length > 1 && (
                      <div className="imageSelector">
                        {generateThumbs(asset)}
                      </div>
                    )}
                    <h4 className={classes.cardTitle}>Name: {asset.name}</h4>
                    <h4 className={classes.cardTitle}>
                      Node: {asset.assetClassName} (ID:{asset.assetClass})
                    </h4>
                    {currency === "" && (
                      <h4 className={classes.cardTitle}>
                        Status: {asset.status}{" "}
                      </h4>
                    )}
                    {currency !== "" && (
                      <>
                        <h4 className={classes.cardTitle}>Status: For Sale </h4>
                        <h4 className={classes.cardTitle}>
                          Price: {currency} {price}{" "}
                        </h4>
                      </>
                    )}
                    {asset.text !== undefined && (
                      <>
                        <br />
                        {asset.Description !== undefined && (
                          <TextField
                            id="outlined-multiline-static"
                            label="Description"
                            multiline
                            rows={4}
                            defaultValue={asset.Description}
                            variant="outlined"
                            fullWidth
                            disabled
                          />
                        )}
                        {asset.Description === undefined && (
                          <TextField
                            id="outlined-multiline-static"
                            label="Description: None"
                            multiline
                            rows={4}
                            defaultValue="No description set for this asset"
                            variant="outlined"
                            fullWidth
                            disabled
                          />
                        )}
                      </>
                    )}
                    {/*@dev URLs go here*/}
                    <br />
                  </>
                )}
                {!ownerOf && (
                  <div>
                    {/* {!transaction && (
                  <Button color="info" className="MLBGradient" onClick={(e) => blockchainVerifyAsset()}>Blockchain Verify</Button>
                )} */}
                    {recycled && !transaction && !isRecycling && props.addr && (
                      <>
                        {/* <h3>This asset has been discarded, to claim it, press "Recycle Asset" below!</h3> */}
                        <Button
                          onClick={() => {
                            recycle();
                          }}
                          color="info"
                          className="MLBGradient"
                        >
                          Recycle Asset
                        </Button>
                      </>
                    )}
                    {!transaction && isRecycling && (
                      <Button
                        color="info"
                        className="MLBGradient"
                        onClick={() => setIsNotRecycling()}
                      >
                        Back
                      </Button>
                    )}
                    {!transaction && !isVerifying && !recycled && (
                      <Button
                        color="info"
                        className="MLBGradient"
                        onClick={() => verify()}
                      >
                        Verify Owner
                      </Button>
                    )}
                    {!transaction && isVerifying && (
                      <Button
                        color="info"
                        className="MLBGradient"
                        onClick={() => setIsNotVerifying()}
                      >
                        Back
                      </Button>
                    )}
                    {currency !== "" && !transaction && (
                      <Button
                        onClick={() => {
                          purchaseAsset();
                        }}
                        color="info"
                        className="MLBGradient"
                      >
                        Purchase Item
                      </Button>
                    )}
                    {currency !== "" && transaction && (
                      <h3>
                        Purchasing Asset
                        <div className="lds-ellipsisIF">
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </h3>
                    )}
                    {isRecycling && (
                      <>
                        {props.IDHolder === false && (
                          <>
                            {assetClass === "" && transactionActive && (
                              <Card>
                                <CardHeader icon>
                                  <CardIcon className="headerIconBack">
                                    <Category />
                                  </CardIcon>
                                  <h4 className={classes.cardIconTitle}>
                                    Select Asset Subclass
                                  </h4>
                                </CardHeader>
                                <CardBody>
                                  <form>
                                    <h3>
                                      Creating ID
                                      <div className="lds-ellipsisIF">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                      </div>
                                    </h3>
                                  </form>
                                </CardBody>
                                <br />
                              </Card>
                            )}
                            {assetClass === "" && !transactionActive && (
                              <Card>
                                <CardHeader icon>
                                  <CardIcon className="headerIconBack">
                                    <Category />
                                  </CardIcon>
                                  <h4 className={classes.cardIconTitle}>
                                    Select Asset Subclass
                                  </h4>
                                </CardHeader>
                                <CardBody>
                                  <form>
                                    <FormControl
                                      fullWidth
                                      className={classes.selectFormControl}
                                    >
                                      {selectedRootID === "" ? (
                                        <>
                                          <InputLabel>
                                            Select Asset Subclass
                                          </InputLabel>
                                          <Select
                                            disabled
                                            MenuProps={{
                                              className: classes.selectMenu,
                                            }}
                                            classes={{
                                              select: classes.select,
                                            }}
                                            value={classSelect}
                                            onChange={() => {}}
                                            inputProps={{
                                              name: "classSelect",
                                              id: "class-select",
                                            }}
                                          ></Select>
                                        </>
                                      ) : (
                                        <>
                                          <InputLabel>
                                            Select Asset Subclass
                                          </InputLabel>
                                          <Select
                                            MenuProps={{
                                              className: classes.selectMenu,
                                            }}
                                            classes={{
                                              select: classes.select,
                                            }}
                                            value={classSelect}
                                            onChange={(e) => {
                                              ACLogin(e);
                                            }}
                                            inputProps={{
                                              name: "classSelect",
                                              id: "class-select",
                                            }}
                                          >
                                            {generateSubCatList(
                                              props.assetClassSets[
                                                selectedRootID
                                              ]
                                            )}
                                          </Select>
                                        </>
                                      )}
                                    </FormControl>
                                  </form>
                                </CardBody>
                                <br />
                              </Card>
                            )}
                          </>
                        )}
                        {props.IDHolder === true && (
                          <Card>
                            <CardHeader icon>
                              <CardIcon className="headerIconBack">
                                <AccountBox />
                              </CardIcon>
                              <h4 className={classes.cardIconTitle}>
                                New Owner Info
                              </h4>
                            </CardHeader>
                            <CardBody>
                              <form>
                                <h5>Asset Selected: {asset.name}</h5>
                                <>
                                  {!transaction && (
                                    <>
                                      <CustomInput
                                        success={loginFirstState === "success"}
                                        error={loginFirstState === "error"}
                                        labelText="First Name *"
                                        id="firstName"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          onChange: (event) => {
                                            setFirst(event.target.value.trim());
                                            if (event.target.value !== "") {
                                              setloginFirstState("success");
                                            } else {
                                              setloginFirstState("error");
                                            }
                                            setloginFirst(event.target.value);
                                          },
                                        }}
                                      />
                                      <CustomInput
                                        labelText="Middle Name"
                                        id="middleName"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          onChange: (event) => {
                                            setMiddle(
                                              event.target.value.trim()
                                            );
                                          },
                                        }}
                                      />
                                      <CustomInput
                                        success={loginLastState === "success"}
                                        error={loginLastState === "error"}
                                        labelText="Last Name *"
                                        id="lastName"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          onChange: (event) => {
                                            setLast(event.target.value.trim());
                                            if (event.target.value !== "") {
                                              setloginLastState("success");
                                            } else {
                                              setloginLastState("error");
                                            }
                                            setloginLast(event.target.value);
                                          },
                                        }}
                                      />
                                      <CustomInput
                                        success={loginIDState === "success"}
                                        error={loginIDState === "error"}
                                        labelText="ID Number *"
                                        id="idNumber"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          onChange: (event) => {
                                            setID(event.target.value.trim());
                                            if (event.target.value !== "") {
                                              setloginIDState("success");
                                            } else {
                                              setloginIDState("error");
                                            }
                                            setloginID(event.target.value);
                                          },
                                        }}
                                      />
                                      <CustomInput
                                        success={
                                          loginPasswordState === "success"
                                        }
                                        error={loginPasswordState === "error"}
                                        labelText="Password *"
                                        id="ownerpassword"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          type: "password",
                                          onChange: (event) => {
                                            setPassword(
                                              event.target.value.trim()
                                            );
                                            if (event.target.value !== "") {
                                              setloginPasswordState("success");
                                            } else {
                                              setloginPasswordState("error");
                                            }
                                            setloginPassword(
                                              event.target.value
                                            );
                                          },
                                        }}
                                      />
                                      <div className={classes.formCategory}>
                                        <small>*</small> Required fields
                                      </div>
                                    </>
                                  )}
                                  {transaction && (
                                    <>
                                      <CustomInput
                                        labelText={first}
                                        id="first"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          disabled: true,
                                        }}
                                      />
                                      <CustomInput
                                        labelText={middle}
                                        id="middle"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          disabled: true,
                                        }}
                                      />
                                      <CustomInput
                                        labelText={last}
                                        id="last"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          disabled: true,
                                        }}
                                      />
                                      <CustomInput
                                        labelText={ID}
                                        id="ID"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          disabled: true,
                                        }}
                                      />
                                      <CustomInput
                                        labelText={password}
                                        id="ownerpassword"
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        inputProps={{
                                          type: "password",
                                          disabled: true,
                                        }}
                                      />
                                    </>
                                  )}
                                </>
                                {!transaction && (
                                  <>
                                    {recycleCost > 0 ? (
                                      <h4>
                                        Cost to modify asset info: ü
                                        {recycleCost}
                                      </h4>
                                    ) : (
                                      <></>
                                    )}
                                    <Button
                                      color="info"
                                      className="MLBGradient"
                                      onClick={(e) => recycleAsset()}
                                    >
                                      Recycle Asset
                                    </Button>
                                  </>
                                )}
                                {transaction && (
                                  <h3>
                                    Recycling Asset
                                    <div className="lds-ellipsisIF">
                                      <div></div>
                                      <div></div>
                                      <div></div>
                                    </div>
                                  </h3>
                                )}
                              </form>
                            </CardBody>
                          </Card>
                        )}
                      </>
                    )}
                    {isVerifying && (
                      <Card>
                        <CardHeader icon>
                          <CardIcon className="headerIconBack">
                            <AccountBox />
                          </CardIcon>
                          <h4 className={classes.cardIconTitle}>
                            Verify Owner Info
                          </h4>
                        </CardHeader>
                        <CardBody>
                          <form>
                            <h5>Asset Selected: {asset.name}</h5>
                            <>
                              {!transaction && (
                                <>
                                  <CustomInput
                                    success={loginFirstState === "success"}
                                    error={loginFirstState === "error"}
                                    labelText="First Name *"
                                    id="firstName"
                                    formControlProps={{
                                      fullWidth: true,
                                    }}
                                    inputProps={{
                                      onChange: (event) => {
                                        setFirst(event.target.value.trim());
                                        if (event.target.value !== "") {
                                          setloginFirstState("success");
                                        } else {
                                          setloginFirstState("error");
                                        }
                                        setloginFirst(event.target.value);
                                      },
                                    }}
                                  />
                                  <CustomInput
                                    labelText="Middle Name"
                                    id="middleName"
                                    formControlProps={{
                                      fullWidth: true,
                                    }}
                                    inputProps={{
                                      onChange: (event) => {
                                        setMiddle(event.target.value.trim());
                                      },
                                    }}
                                  />
                                  <CustomInput
                                    success={loginLastState === "success"}
                                    error={loginLastState === "error"}
                                    labelText="Last Name *"
                                    id="lastName"
                                    formControlProps={{
                                      fullWidth: true,
                                    }}
                                    inputProps={{
                                      onChange: (event) => {
                                        setLast(event.target.value.trim());
                                        if (event.target.value !== "") {
                                          setloginLastState("success");
                                        } else {
                                          setloginLastState("error");
                                        }
                                        setloginLast(event.target.value);
                                      },
                                    }}
                                  />
                                  <CustomInput
                                    success={loginIDState === "success"}
                                    error={loginIDState === "error"}
                                    labelText="ID Number *"
                                    id="idNumber"
                                    formControlProps={{
                                      fullWidth: true,
                                    }}
                                    inputProps={{
                                      onChange: (event) => {
                                        setID(event.target.value.trim());
                                        if (event.target.value !== "") {
                                          setloginIDState("success");
                                        } else {
                                          setloginIDState("error");
                                        }
                                        setloginID(event.target.value);
                                      },
                                    }}
                                  />
                                  <CustomInput
                                    success={loginPasswordState === "success"}
                                    error={loginPasswordState === "error"}
                                    labelText="Password *"
                                    id="ownerpassword"
                                    formControlProps={{
                                      fullWidth: true,
                                    }}
                                    inputProps={{
                                      type: "password",
                                      onChange: (event) => {
                                        setPassword(event.target.value.trim());
                                        if (event.target.value !== "") {
                                          setloginPasswordState("success");
                                        } else {
                                          setloginPasswordState("error");
                                        }
                                        setloginPassword(event.target.value);
                                      },
                                    }}
                                  />
                                  <div className={classes.formCategory}>
                                    <small>*</small> Required fields
                                  </div>
                                </>
                              )}
                              {transaction && (
                                <>
                                  <CustomInput
                                    labelText={first}
                                    id="first"
                                    formControlProps={{
                                      fullWidth: true,
                                    }}
                                    inputProps={{
                                      disabled: true,
                                    }}
                                  />
                                  <CustomInput
                                    labelText={middle}
                                    id="middle"
                                    formControlProps={{
                                      fullWidth: true,
                                    }}
                                    inputProps={{
                                      disabled: true,
                                    }}
                                  />
                                  <CustomInput
                                    labelText={last}
                                    id="last"
                                    formControlProps={{
                                      fullWidth: true,
                                    }}
                                    inputProps={{
                                      disabled: true,
                                    }}
                                  />
                                  <CustomInput
                                    labelText={ID}
                                    id="ID"
                                    formControlProps={{
                                      fullWidth: true,
                                    }}
                                    inputProps={{
                                      disabled: true,
                                    }}
                                  />
                                  <CustomInput
                                    labelText={password}
                                    id="ownerpassword"
                                    formControlProps={{
                                      fullWidth: true,
                                    }}
                                    inputProps={{
                                      type: "password",
                                      disabled: true,
                                    }}
                                  />
                                </>
                              )}
                            </>
                            {!transaction && props.addr && (
                              <Button
                                color="info"
                                className="MLBGradient"
                                onClick={(e) => blockchainVerifyAsset()}
                              >
                                Blockchain Verify Owner
                              </Button>
                            )}
                            {!transaction && (
                              <Button
                                color="info"
                                className="MLBGradient"
                                onClick={(e) => verifyAsset()}
                              >
                                Verify Owner
                              </Button>
                            )}
                            {transaction && (
                              <h3>
                                Verifying Asset
                                <div className="lds-ellipsisIF">
                                  <div></div>
                                  <div></div>
                                  <div></div>
                                </div>
                              </h3>
                            )}
                          </form>
                        </CardBody>
                      </Card>
                    )}
                  </div>
                )}
                {ownerOf && !isVerifying && (
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
                      {renderOptions(asset.statusNum)}
                    </FormControl>
                  </div>
                )}
                {isVerifying && (
                  <Card>
                    <CardHeader icon>
                      <CardIcon className="headerIconBack">
                        <AccountBox />
                      </CardIcon>
                      <h4 className={classes.cardIconTitle}>
                        Verify Owner Info
                      </h4>
                    </CardHeader>
                    <CardBody>
                      <form>
                        <h5>Asset Selected: {asset.name}</h5>
                        <>
                          {!transaction && (
                            <>
                              <CustomInput
                                success={loginFirstState === "success"}
                                error={loginFirstState === "error"}
                                labelText="First Name *"
                                id="firstName"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  onChange: (event) => {
                                    setFirst(event.target.value.trim());
                                    if (event.target.value !== "") {
                                      setloginFirstState("success");
                                    } else {
                                      setloginFirstState("error");
                                    }
                                    setloginFirst(event.target.value);
                                  },
                                }}
                              />
                              <CustomInput
                                labelText="Middle Name"
                                id="middleName"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  onChange: (event) => {
                                    setMiddle(event.target.value.trim());
                                  },
                                }}
                              />
                              <CustomInput
                                success={loginLastState === "success"}
                                error={loginLastState === "error"}
                                labelText="Last Name *"
                                id="lastName"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  onChange: (event) => {
                                    setLast(event.target.value.trim());
                                    if (event.target.value !== "") {
                                      setloginLastState("success");
                                    } else {
                                      setloginLastState("error");
                                    }
                                    setloginLast(event.target.value);
                                  },
                                }}
                              />
                              <CustomInput
                                success={loginIDState === "success"}
                                error={loginIDState === "error"}
                                labelText="ID Number *"
                                id="idNumber"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  onChange: (event) => {
                                    setID(event.target.value.trim());
                                    if (event.target.value !== "") {
                                      setloginIDState("success");
                                    } else {
                                      setloginIDState("error");
                                    }
                                    setloginID(event.target.value);
                                  },
                                }}
                              />
                              <CustomInput
                                success={loginPasswordState === "success"}
                                error={loginPasswordState === "error"}
                                labelText="Password *"
                                id="ownerpassword"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  type: "password",
                                  onChange: (event) => {
                                    setPassword(event.target.value.trim());
                                    if (event.target.value !== "") {
                                      setloginPasswordState("success");
                                    } else {
                                      setloginPasswordState("error");
                                    }
                                    setloginPassword(event.target.value);
                                  },
                                }}
                              />
                              <div className={classes.formCategory}>
                                <small>*</small> Required fields
                              </div>
                            </>
                          )}
                          {transaction && (
                            <>
                              <CustomInput
                                labelText={first}
                                id="first"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              />
                              <CustomInput
                                labelText={middle}
                                id="middle"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              />
                              <CustomInput
                                labelText={last}
                                id="last"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              />
                              <CustomInput
                                labelText={ID}
                                id="ID"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  disabled: true,
                                }}
                              />
                              <CustomInput
                                labelText={password}
                                id="ownerpassword"
                                formControlProps={{
                                  fullWidth: true,
                                }}
                                inputProps={{
                                  type: "password",
                                  disabled: true,
                                }}
                              />
                            </>
                          )}
                        </>
                        {!transaction && props.addr && (
                          <Button
                            color="info"
                            className="MLBGradient"
                            onClick={(e) => blockchainVerifyAsset()}
                          >
                            Blockchain Verify Owner
                          </Button>
                        )}
                        {!transaction && (
                          <Button
                            color="info"
                            className="MLBGradient"
                            onClick={(e) => verifyAsset()}
                          >
                            Verify Owner
                          </Button>
                        )}
                        {transaction && (
                          <h3>
                            Verifying Asset
                            <div className="lds-ellipsisIF">
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          </h3>
                        )}
                      </form>
                    </CardBody>
                  </Card>
                )}
              </CardBody>
              <CardFooter>
                {!isMobile && (
                  <>
                    {!copyText && (
                      <Tooltip title="Copy to Clipboard">
                        <div className={classes.stats}>
                          Asset ID: &nbsp;{" "}
                          <Button
                            className="IDText"
                            onClick={() => {
                              copyTextSnippet(asset.id);
                            }}
                          >
                            {asset.id}
                          </Button>
                        </div>
                      </Tooltip>
                    )}
                    {copyText && (
                      <Tooltip title="Copied to Clipboard">
                        <div className={classes.stats}>
                          Asset ID: &nbsp;{" "}
                          <Button
                            className="IDText"
                            onClick={() => {
                              copyTextSnippet(asset.id);
                            }}
                          >
                            {asset.id}
                          </Button>
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
                          Asset ID: &nbsp;{" "}
                          <Button
                            className="IDText"
                            onClick={() => {
                              copyTextSnippet(asset.id);
                            }}
                          >
                            {asset.id.substring(0, 10) +
                              "..." +
                              asset.id.substring(56, 66)}
                          </Button>
                        </div>
                      </Tooltip>
                    )}
                    {copyText && (
                      <Tooltip title="Copied to Clipboard">
                        <div className={classes.stats}>
                          Asset ID: &nbsp;{" "}
                          <Button
                            className="IDText"
                            onClick={() => {
                              copyTextSnippet(asset.id);
                            }}
                          >
                            {asset.id.substring(0, 10) +
                              "..." +
                              asset.id.substring(56, 66)}
                          </Button>
                        </div>
                      </Tooltip>
                    )}
                  </>
                )}
                {isMobile && isAndroid && (
                  <Tooltip title="Copy to Clipboard">
                    <CopyToClipboard
                      text={asset.id}
                      onCopy={() => {
                        swal("Asset ID Copied to Clipboard!");
                      }}
                    >
                      <span>
                        Asset ID: &nbsp;{" "}
                        {asset.id.substring(0, 10) +
                          "..." +
                          asset.id.substring(56, 66)}
                      </span>
                    </CopyToClipboard>
                  </Tooltip>
                )}
                <div className="icons">
                  <RWebShare
                    className="shareMenu"
                    data={{
                      text: "Check out my PRüF-verified asset!",
                      url: assetURL,
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
                        name: asset.name,
                        idxHash: asset.id,
                        assetClassName: asset.assetClassName,
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
                              value={assetURL}
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
          )}
        </>
      )}
    </>
  );
}
