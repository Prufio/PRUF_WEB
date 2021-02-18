import React from "react";
import "../../assets/css/custom.css";
import { RWebShare } from "react-web-share";
import swal from 'sweetalert';
import swalReact from '@sweetalert/with-react';
import { isAndroid, isMobile } from "react-device-detect";
import { QRCode } from 'react-qrcode-logo';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Danger from "components/Typography/Danger.js";
import Checkbox from "@material-ui/core/Checkbox";
import Icon from '@material-ui/core/Icon';

// @material-ui/icons
import Check from "@material-ui/icons/Check";
import Share from "@material-ui/icons/Share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Create from "@material-ui/icons/Create";
import { DashboardOutlined, KeyboardArrowLeft, Scanner, Settings } from "@material-ui/icons";
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

import QrReader from 'react-qr-reader'
import Jdenticon from 'react-jdenticon';

import imgStyles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import placeholder from "../../assets/img/placeholder.jpg";
import TextField from "@material-ui/core/TextField";
import Printer from "../../Resources/print"


const useStyles = makeStyles(styles);
const useImgStyles = makeStyles(imgStyles);

export default function Search(props) {

  const [simpleSelect, setSimpleSelect] = React.useState("");
  const [selectedEnabled, setSelectedEnabled] = React.useState("b");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [query, setQuery] = React.useState(null)
  const [scanQR, setScanQR] = React.useState(false)
  const [data, setData] = React.useState("");
  const [result, setResult] = React.useState("");
  const [error, setError] = React.useState("");
  const [inscription, setInscription] = React.useState("");
  const [moreInfo, setMoreInfo] = React.useState(false);
  const [authLevel, setAuthLevel] = React.useState("");
  const [ipfsObject, setIpfsObject] = React.useState({});
  const [asset, setAsset] = React.useState({});
  const [dBIndex, setDBIndex] = React.useState(null);
  const [price, setPrice] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  const [recycled, setRecycled] = React.useState(false);
  const [transaction, setTransaction] = React.useState(false);
  const [retrieving, setRetrieving] = React.useState(false);
  const [ownerOf, setOwnerOf] = React.useState(false);
  const [assetURL, setURL] = React.useState("");
  const [baseURL, setBaseURL] = React.useState("https://app.pruf.io/#/user/search/");
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [isRecycling, setIsRecycling] = React.useState(false)
  const [txHash, setTxHash] = React.useState("")
  const [verifyResult, setVerifyResult] = React.useState("")
  const [assetClass, setAssetClass] = React.useState("");
  const [assetClassName, setAssetClassName] = React.useState("");
  const [transactionActive, setTransactionActive] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [copyText, setCopyText] = React.useState(false)


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

  const [loginManufacturerState, setloginManufacturerState] = React.useState("");
  const [loginTypeState, setloginTypeState] = React.useState("");
  const [loginModelState, setloginModelState] = React.useState("");
  const [loginSerialState, setloginSerialState] = React.useState("");
  const [loginIDXState, setloginIDXState] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState("")

  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const link = document.createElement('div');

  React.useEffect(() => {
    if (!window.idxQuery && window.location.href.includes("0x") && window.location.href.substring(window.location.href.indexOf('0x'), window.location.href.length).length === 66) {
      setQuery(window.location.href.substring(window.location.href.indexOf('0x'), window.location.href.length));
    }
    else if (window.idxQuery) {
      setQuery(window.idxQuery);
      window.idxQuery = null;
    }
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    }
    else {
      window.scrollTo({top: 0, behavior: 'smooth'})
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      
    }
  }, [])

  React.useEffect(() => {
    if (window.contracts !== undefined && query) { retrieveRecordQR(query); setQuery(null); }
  }, [window.contracts, query])


  const refreshBalances = async () => {
    if(!window.web3.eth) return

    let pruf, ether;
    
    console.log("Refreshing ether bal")
    await window.web3.eth.getBalance(props.addr, (err, result) => {
      if (err) { console.log(err) } 
      else { ether = window.web3.utils.fromWei(result, 'ether') }
      window.contracts.UTIL_TKN.methods.balanceOf(props.addr).call((err, result) => {
        if (err) { console.log(err) }
        else { pruf = window.web3.utils.fromWei(result, 'ether') }
        window.contracts.A_TKN.methods.balanceOf(props.addr).call((err, result) => {
          if (err) { console.log(err) }
          else { window.replaceAssetData = {assets: result, ether, pruf} }
        });
      });
    });
  }

  const ACLogin = event => {
    if (!props.IDHolder) {
      IDHolderPrompt()
    }
    else {
      setAssetClass(event.target.value);
      if (event.target.value === "1000003") {
        setAssetClassName("Trinkets")
      }
      if (event.target.value === "1000004") {
        setAssetClassName("Personal Computers")
      }
    }
  };

  const IDHolderPrompt = () => {
    let tempTxHash;

    swal({
      title: "In order to mint asset tokens, you must first have an ID token.",
      icon: "warning",
      text: "If you would like to mint asset tokens, please select Yes, it will mint you an ID token",
      buttons: {
        yes: {
          text: "Yes",
          value: "yes"
        },
        no: {
          text: "No",
          value: "no"
        }
      },
    })
      .then((value) => {
        switch (value) {

          case "yes":
            setTransactionActive(true)
            window.contracts.PARTY.methods
              .GET_ID()
              .send({ from: props.addr })
              .on("error", function (_error) {
                setTransactionActive(false);
                setTxStatus(false);
                setTxHash(Object.values(_error)[0].transactionHash);
                tempTxHash = Object.values(_error)[0].transactionHash;
                let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
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
                let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/";
                let str2 = "' target='_blank'>here</a>";
                link.innerHTML = String(str1 + tempTxHash + str2);
                swal({
                  title: "ID Token Minted!",
                  content: link,
                  icon: "success",
                  button: "Close"
                });
                window.replaceAssetData = {IDHolder: true}
              })
            break;

          case "no":
            break;

          default:
            break;
        }
      });


  }

  const showImage = (e) => {
    setSelectedImage(e)
  }

  const getDBIndexOf = (e) => {

    if (!e) { return console.log("No ID given!") }
    let temp;

    for (let i = 0; i < props.assetArr.length; i++) {
      if (props.assetArr[i].id.toLowerCase() === e.toLowerCase()) {

        temp = i
      }
    }

    if (temp) return setDBIndex(temp);

    else return console.log("Could not locate ID in dash!")
  }

  const handleSimple = event => {
    if (props.ps) {
      console.log(props.ps)
      props.ps.element.scrollTop = 0
    }
    else {
      window.scrollTo({top: 0, behavior: 'smooth'})
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      
    }
    let temp = Object.assign(asset, ipfsObject)
    let tempObj = JSON.parse(JSON.stringify(temp))

    tempObj.dBIndex = dBIndex
    tempObj.lastRef = "/#/user/search"

    console.log(tempObj)

    window.sentPacket = tempObj;
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
        verify();
        break
      }
      default: {
        console.log("Invalid menu selection: '", e, "'");
        break
      }
    }
    if (href !== undefined) {
      return window.location.href = href;
    }
  };

  const handleChange = event => {
    setSelectedValue(event.target.value);
  };

  const handleChangeEnabled = event => {
    setSelectedEnabled(event.target.value);
  };

  const handleScanQR = event => {
    setScanQR(!scanQR);
    setData()
    console.log("new value", !scanQR)
  };

  const verify = () => {
    setIsVerifying(true)
    if (props.ps) {
      console.log(props.ps)
      props.ps.element.scrollTop = 0
    }
    else {
      window.scrollTo({top: 0, behavior: 'smooth'})
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      
    }
  };

  const recycle = () => {
    setIsRecycling(true);
    if (props.ps) {
      console.log(props.ps)
      props.ps.element.scrollTop = 0
    }
    else {
      window.scrollTo({top: 0, behavior: 'smooth'})
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      
    }
  };

  const setIsNotVerifying = () => {
    setSimpleSelect("")
    setIsVerifying(false)
    setloginManufacturerState("");
    setloginTypeState("");
    setloginModelState("");
    setloginSerialState("");
    setloginIDXState("");
    setloginFirstState("");
    setloginLastState("");
    setloginIDState("");
    setloginPasswordState("");
  }

  const setIsNotRecycling = () => {
    setSimpleSelect("")
    setIsRecycling(false)
    setloginFirstState("");
    setloginLastState("");
    setloginIDState("");
    setloginPasswordState("");
  }

  const getIPFSJSONObject = async (lookup) => {
    //console.log(lookup)
    for await (const chunk of window.ipfs.cat(lookup)) {
      let result = new TextDecoder("utf-8").decode(chunk);
      if (!result) {
        console.log(lookup, "Something went wrong. Unable to find file on IPFS");
        setRetrieving(false);
        return setIpfsObject({ text: {}, photo: {}, urls: {}, name: "", displayImage: "" })
      }

      else {
        //console.log(lookup, "Here's what we found for asset description: ", result);
        let assetObj = JSON.parse(result)
        assetObj.photoUrls = JSON.parse(result).photo;
        let vals = Object.values(assetObj.photo), keys = Object.keys(assetObj.photo);

        if (keys.length < 1) {
          setIpfsObject(assetObj)
          setSelectedImage("")
          setMoreInfo(true);
          setRetrieving(false);
          return console.log(assetObj);
        }

        for (let i = 0; i < keys.length; i++) {
          const get = () => {
            if (vals[i].includes("data") && vals[i].includes("base64")) {
              assetObj.photo[keys[i]] = vals[i];
              console.log(assetObj.photo[keys[i]]);
              if (keys[i] === "DisplayImage") {
                console.log("Setting Display Image")
                assetObj.DisplayImage = (assetObj.photo[keys[i]])
              }
              else if (i === keys.length - 1) {
                console.log("Setting Display Image")
                assetObj.DisplayImage = (assetObj.photo[keys[0]])
              }

              if (i + 1 === keys.length) {
                setIpfsObject(assetObj)
                setSelectedImage(assetObj.DisplayImage)
                setMoreInfo(true);
                setRetrieving(false);
                console.log(assetObj);
                console.log(assetObj.DisplayImage);
              }

              forceUpdate();
            }

            else if (!vals[i].includes("ipfs") && vals[i].includes("http")) {
              assetObj.photo[keys[i]] = vals[i];
              if (keys[i] === "DisplayImage") {
                console.log("Setting Display Image")
                assetObj.DisplayImage = (assetObj.photo[keys[i]])
              }
              else if (i === keys.length - 1) {
                console.log("Setting Display Image")
                assetObj.DisplayImage = (assetObj.photo[keys[0]])
              }

              if (i + 1 === keys.length) {
                setIpfsObject(assetObj)
                setSelectedImage(assetObj.DisplayImage)
                setMoreInfo(true);
                setRetrieving(false);
                console.log(assetObj);
                console.log(assetObj.DisplayImage);
              }

              forceUpdate();
            }

            else {
              const req = new XMLHttpRequest();
              req.responseType = "text";

              req.onload = function (e) {
                console.log("in onload")
                if (this.response.includes("base64")) {
                  assetObj.photo[keys[i]] = this.response;
                  console.log(assetObj.photo[keys[i]]);

                  if (keys[i] === "DisplayImage") {
                    console.log("Setting Display Image")
                    assetObj.DisplayImage = assetObj.photo[keys[i]]
                  }

                  else if (i === keys.length - 1) {
                    console.log("Setting Display Image")
                    assetObj.DisplayImage = assetObj.photo[keys[0]]
                  }
                  forceUpdate();
                }

                if (i + 1 === keys.length) {
                  setIpfsObject(assetObj)
                  setSelectedImage(assetObj.DisplayImage)
                  setMoreInfo(true);
                  setRetrieving(false);
                  console.log(assetObj);
                  console.log(assetObj.DisplayImage);
                }
              }

              req.onerror = function (e) {
                console.log("http request error")
                if (vals[i].includes("http")) {
                  assetObj.photo[keys[i]] = vals[i];
                  if (keys[i] === "DisplayImage") {
                    console.log("Setting Display Image")
                    assetObj.DisplayImage = (assetObj.photo[keys[i]])
                  }
                  else if (i === keys.length - 1) {
                    console.log("Setting Display Image")
                    assetObj.DisplayImage = (assetObj.photo[keys[0]])
                  }
                  forceUpdate();
                }

                if (i + 1 === keys.length) {
                  setIpfsObject(assetObj)
                  setSelectedImage(assetObj.DisplayImage)
                  setMoreInfo(true);
                  setRetrieving(false);
                  console.log(assetObj);
                  console.log(assetObj.DisplayImage);
                }
              }

              req.open('GET', vals[i], true);
              req.send();
            }

          }
          await get()
          }
          
        }

      };
    
  };

  const getACData = async (ref, ac) => {
    let tempData;
    let tempAC;

    if (window.contracts !== undefined) {

      if (ref === "name") {
        console.log("Using name ref")
        await window.contracts.AC_MGR.methods
          .resolveAssetClass(ac)
          .call((_error, _result) => {
            if (_error) { console.log("Error: ", _error) }
            else {
              if (Number(_result) > 0) { tempAC = Number(_result) }
              else { return 0 }
            }
          });
      }

      else if (ref === "id") { tempAC = ac; }

      await window.contracts.AC_MGR.methods
        .getAC_data(tempAC)
        .call((_error, _result) => {
          if (_error) { console.log("Error: ", _error) }
          else {
            let _custodyType;

            if (Object.values(_result)[1] === "1") {
              _custodyType = "Custodial"
            }

            else {
              _custodyType = "Non-Custodial"
            }

            tempData = {
              root: Object.values(_result)[0],
              custodyType: _custodyType,
              discount: Object.values(_result)[2],
              exData: Object.values(_result)[3],
              AC: tempAC
            }
          }
        });
      return tempData;
    }
  }

  /* const purchaseAsset = async () => {
    console.log("Purchasing Asset")
    if (window.balances.prufTokenBalance < window.web3.utils.fromWei(price)) { console.log("insufficient balance"); return console.log(window.web3.utils.fromWei(price)) }
    setTransaction(true)
    await window.contracts.PURCHASE.methods
      .purchaseWithPRUF(asset.idxHash)
      .send({ from: props.addr })
      .on("error", function (_error) {
        setMoreInfo(false);
        setTransaction(false);
        console.log(Object.values(_error)[0].transactionHash);
      })
      .on("receipt", (receipt) => {
        setTransaction(false);
        window.location.href = "/#/user/dashboard"
        window.location.reload()
        console.log(receipt.events.REPORT.returnValues._msg);
      });
  } */


  const recycleAsset = async () => {
    if (loginFirst === "" || loginLast === "" || loginID === "" || loginPassword === "") {

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

    console.log("in RA")
    let idxHash = asset.idxHash;
    let rgtHash;
    let rgtHashRaw;
    let receiptVal;
    let tempTxHash;

    let temp = Object.assign(asset, ipfsObject)
    let newAsset = JSON.parse(JSON.stringify(temp))
    newAsset.status = "Out of Escrow"
    newAsset.statusNum = "58"

    if (middle === "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ''),
        String(last).replace(/\s/g, ''),
        String(ID).replace(/\s/g, ''),
        String(password).replace(/\s/g, '')
      )
    }


    else if (middle !== "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ''),
        String(middle).replace(/\s/g, ''),
        String(last).replace(/\s/g, ''),
        String(ID).replace(/\s/g, ''),
        String(password).replace(/\s/g, ''),
      )
    }


    rgtHash = window.web3.utils.soliditySha3(String(idxHash), String(rgtHashRaw));
    rgtHash = window.utils.tenThousandHashesOf(rgtHash);

    console.log("idxHash", idxHash);
    console.log("rgtHash", rgtHash);
    console.log("addr: ", window.addr);
    setTransaction(true)

    await window.contracts.RCLR.methods
      .$recycle(idxHash, rgtHash, asset.assetClass)
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransaction(false);
        tempTxHash = Object.values(_error)[0].transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
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
        console.log("Verification conf")
        setTxHash(Object.values(_error)[0].transactionHash);
        console.log(Object.values(_error)[0].transactionHash);
        console.log(_error)
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
          button: "Close"
        }).then(() => {
          window.location.href = "/#/user/dashboard";
          window.replaceAssetData = { key: pageKey, newAsset: newAsset }
        })
      });

    return;
  }

  const thousandHashesOf = (varToHash) => {
    if (!window.web3) return window.location.href = "/#/user/home"
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  }

  const copyTextSnippet = (temp) => {

    if (isMobile) {
      navigator.clipboard.writeText(temp)
      swal("Asset ID Copied to Clipboard!")
    }

    if (!isMobile) {
      setCopyText(true)
      setTimeout(() => { setCopyText(false) }, 1000);
    }

  }

  const verifyAsset = async () => {
    if (loginFirst === "" || loginLast === "" || loginID === "" || loginPassword === "") {
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

    console.log("in vr")
    let ipfsHash;
    let tempResult;
    let idxHash = asset.idxHash;
    let rgtHashRaw;
    let rgtHash

    if (middle === "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ''),
        String(last).replace(/\s/g, ''),
        String(ID).replace(/\s/g, ''),
        String(password).replace(/\s/g, ''),
      )
    }


    else if (middle !== "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ''),
        String(middle).replace(/\s/g, ''),
        String(last).replace(/\s/g, ''),
        String(ID).replace(/\s/g, ''),
        String(password).replace(/\s/g, ''),
      )
    }


    rgtHash = window.web3.utils.soliditySha3(String(idxHash), String(rgtHashRaw));
    rgtHash = window.utils.tenThousandHashesOf(rgtHash);

    console.log("idxHash", idxHash);
    console.log("rgtHash", rgtHash);
    console.log("addr: ", window.addr);
    setTransaction(true)
    await window.contracts.STOR.methods
      ._verifyRightsHolder(idxHash, rgtHash)
      .call(
        function (_error, _result) {
          if (_error) {
            console.log(_error)
            setError(_error);
            setResult("");
            setTransaction(false)
          }
          else if (_result === "0") {
            console.log("Verification not Confirmed");
            swal({
              title: "Match Failed!",
              text: "Please make sure forms are filled out correctly.",
              icon: "warning",
              button: "Close",
            });
            setTransaction(false)
            setIsVerifying(false)
          }
          else {
            console.log("Verification Confirmed");
            swal({
              title: "Match Confirmed!",
              // text: "Check your TX here:" + txHash,
              icon: "success",
              button: "Close",
            });
            setError("");
            setTransaction(false)
            setIsVerifying(false)
          }
        });
    return;
  }

  const handleOnScan = (e) => {
    if (!e) {
      return
    }
    //console.log(e)
    if (e.includes("0x") && e.substring(e.indexOf("0x"), e.indexOf("0x") + 66)) {
      setScanQR(!scanQR);
      let scanQuery = e.substring(e.indexOf("0x"), e.indexOf("0x") + 66)
      console.log("Here is what we got in the scanner: ", scanQuery)
      retrieveRecordQR(scanQuery);
    }
    else {
      swal({
        title: "QR code does not contain a valid asset ID.",
        icon: "warning",
        button: "Close",
      });
    }
  }

  const blockchainVerifyAsset = async () => {
    if (!window.ethereum) { return swal({ title: "Connect to an ethereum provider to use this functionality!", button: "Close", }) }
    if (loginFirst === "" || loginLast === "" || loginID === "" || loginPassword === "") {

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

    console.log("in bvr")
    let idxHash = asset.idxHash;
    let rgtHash;
    let rgtHashRaw;
    let receiptVal;
    let tempTxHash;

    if (middle === "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ''),
        String(last).replace(/\s/g, ''),
        String(ID).replace(/\s/g, ''),
        String(password).replace(/\s/g, ''),
      )
    }


    else if (middle !== "") {
      rgtHashRaw = window.web3.utils.soliditySha3(
        String(first).replace(/\s/g, ''),
        String(middle).replace(/\s/g, ''),
        String(last).replace(/\s/g, ''),
        String(ID).replace(/\s/g, ''),
        String(password).replace(/\s/g, ''),
      )
    }


    rgtHash = window.web3.utils.soliditySha3(String(idxHash), String(rgtHashRaw));
    rgtHash = window.utils.tenThousandHashesOf(rgtHash);

    console.log("idxHash", idxHash);
    console.log("rgtHash", rgtHash);
    console.log("addr: ", props.addr);
    setTransaction(true)

    await window.contracts.STOR.methods
      .blockchainVerifyRightsHolder(idxHash, rgtHash)
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransaction(false);
        setIsVerifying(false)
        tempTxHash = Object.values(_error)[0].transactionHash;
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setTxHash(Object.values(_error)[0].transactionHash);
        console.log(Object.values(_error)[0].transactionHash);
        console.log(_error)
        setError(_error);
      })
      .on("receipt", (receipt) => {
        receiptVal = receipt.events.REPORT.returnValues._msg;
        setTransaction(false)
        setIsVerifying(false)
        setTxHash(receipt.transactionHash)
        tempTxHash = receipt.transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setVerifyResult(receiptVal)
        console.log("Verification Result :", receiptVal);
      });


    if (receiptVal === "Match confirmed") {
      swal({
        title: "Match Confirmed!",
        content: link,
        icon: "success",
        button: "Close",
      });
      console.log("Verification conf")
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
      console.log("Verification not conf")
    }

    return;
  }

  const retrieveRecord = async () => {
    if (props.ps) {
      console.log(props.ps)
      props.ps.element.scrollTop = 0
    }
    else {
      window.scrollTo({top: 0, behavior: 'smooth'})
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      
    }
    if (!IDXRawInput) {
      if (loginType === "" || loginManufacturer === "" || loginModel === "" || loginSerial === "") {

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
        return;
      }
    }

    if (IDXRawInput) {
      if (loginIDX === "") {
        setloginIDXState("error");
        return;
      }
    }

    console.log("in rr")
    let ipfsHash;
    let tempResult;
    let idxHash;

    if (IDXRawInput === true) {
      idxHash = IDXRaw
    }


    else if (IDXRawInput === false) {
      idxHash = window.web3.utils.soliditySha3(
        String(type).replace(/\s/g, ''),
        String(manufacturer).replace(/\s/g, ''),
        String(model).replace(/\s/g, ''),
        String(serial).replace(/\s/g, ''),
      )
    }

    let doesExist = await window.utils.checkAssetExistsBare(idxHash);

    if (!doesExist) {
      swal({
        title: "Asset does not exist!",
        icon: "warning",
        button: "Close",
      })
      setIDXRaw("")
      setIDXRawInput(false)
    }
    else {
      setRetrieving(true)
      console.log("idxHash", idxHash);
      console.log("addr: ", props.addr);

      await window.contracts.STOR.methods
        .retrieveShortRecord(idxHash)
        .call(
          function (_error, _result) {
            if (_error) {
              setRetrieving(false);
              setError(_error);
              setResult("");
              setIDXRaw("")
              setIDXRawInput(false)
              /*             setManufacturer("")
                          setloginManufacturer("")
                          setloginManufacturerState("")
                          setType("")
                          setloginType("")
                          setloginTypeState("")
                          setModel("")
                          setloginModel("")
                          setloginModelState("")
                          setSerial("")
                          setloginSerial("")
                          setloginSerialState("") */
              swal({
                title: "Asset not found!",
                // text: "Check your TX here:" + txHash,
                icon: "warning",
                button: "Close",
              });
            }
            else {
              setIDXRaw("")
              setIDXRawInput(false)
              setloginIDXState("")
              setManufacturer("")
              setloginManufacturer("")
              setloginManufacturerState("")
              setType("")
              setloginType("")
              setloginTypeState("")
              setModel("")
              setloginModel("")
              setloginModelState("")
              setSerial("")
              setloginSerial("")
              setloginSerialState("")
              console.log("rr conf");
              setResult(Object.values(_result));
              setError("");
              tempResult = Object.values(_result);
              if (Object.values(_result)[5] > 0) { ipfsHash = window.utils.getIpfsHashFromBytes32(Object.values(_result)[5]); }
              console.log("ipfs data in promise", ipfsHash)
              if (Object.values(_result)[6] > 0) {
                console.log("Getting ipfs2 set up...")
                let knownUrl = "https://ipfs.io/ipfs/";
                let hash = String(window.utils.getIpfsHashFromBytes32(Object.values(_result)[6]));
                let fullUrl = knownUrl + hash;
                console.log(fullUrl);
                setInscription(fullUrl)
              }
            }
          });

      setURL(String(baseURL) + String(idxHash))

      window.assetClass = tempResult[2]
      let assetClassName = await window.utils.getACName(tempResult[2])

      window.assetInfo = {
        assetClassName: assetClassName,
        assetClass: tempResult[2],
        status: await window.utils.getStatusString(String(tempResult[0])),
        statusNum: String(tempResult[0]),
        idx: idxHash
      }

      await window.utils.resolveACFromID(tempResult[2])
      await getACData("id", window.assetClass)

      console.log(window.authLevel);

      await getIPFSJSONObject(ipfsHash);
      setAuthLevel(window.authLevel);
      setScanQR(false);
      setAsset({
        assetClassName: window.assetClassName,
        assetClass: tempResult[2],
        status: window.assetInfo.status,
        statusNum: String(tempResult[0]),
        idxHash: idxHash,
      })

      if (tempResult[0] === "60") {
        setRecycled(true)
      }
      else if (tempResult[0] !== "60") {
        await window.utils.checkHoldsToken("asset", idxHash, props.addr)
          .then((e) => {
            console.log("is Owner Of? ", e)
            if (e) {
              getDBIndexOf(idxHash)
              setOwnerOf(true)
            }
          })
      }
    }
  }

  const retrieveRecordQR = async (query) => {

    let doesExist = await window.utils.checkAssetExistsBare(query);

    if (!doesExist) {
      swal({
        title: "Asset Asset does not exist!",
        icon: "warning",
        button: "Close",
      })
      return setScanQR(false)
    }

    if (props.ps) {
      console.log(props.ps)
      props.ps.element.scrollTop = 0
    }
    else {
      window.scrollTo({top: 0, behavior: 'smooth'})
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      
    }
    setRetrieving(true)
    console.log("in rrqr")
    let ipfsHash;
    let tempResult;
    let idxHash = query;

    console.log("idxHash", idxHash);
    console.log("addr: ", props.addr);

    await window.contracts.STOR.methods
      .retrieveShortRecord(idxHash)
      .call(
        function (_error, _result) {
          if (_error) {
            console.log(_error);
            setError(_error);
            setResult("");
            setScanQR(false);
            setRetrieving(false);
            swal({
              title: "Asset not found!",
              icon: "warning",
              button: "Close",
            });
          }
          else {
            setScanQR(false);
            console.log("rrqr conf");
            setResult(Object.values(_result));
            setError("");
            tempResult = Object.values(_result);
            window.printObj = Object.values(_result);
            if (Object.values(_result)[5] > 0) { ipfsHash = window.utils.getIpfsHashFromBytes32(Object.values(_result)[5]); }
            console.log("ipfs data in promise", ipfsHash);
            if (Object.values(_result)[6] > 0); {
              console.log("Getting ipfs2 set up...");
              let knownUrl = "https://ipfs.io/ipfs/";
              let hash = String(window.utils.getIpfsHashFromBytes32(Object.values(_result)[6]));
              let fullUrl = knownUrl + hash;
              console.log(fullUrl);
              setInscription(fullUrl);
            }
          }
        });

    setURL(String(baseURL) + String(idxHash))


    window.assetClass = tempResult[2]
    let assetClassName = await window.utils.getACName(tempResult[2])

    window.assetInfo = {
      assetClassName: assetClassName,
      assetClass: tempResult[2],
      status: await window.utils.getStatusString(String(tempResult[0])),
      statusNum: String(tempResult[0]),
      idx: idxHash
    }

    await window.utils.resolveACFromID(tempResult[2])
    await getACData("id", window.assetClass)

    console.log(window.authLevel);

    await getIPFSJSONObject(ipfsHash);
    setAuthLevel(window.authLevel);
    setAsset({
      assetClassName: window.assetClassName,
      assetClass: tempResult[2],
      status: window.assetInfo.status,
      statusNum: String(tempResult[0]),
      idxHash: idxHash,
    })

    if (tempResult[0] === "60") {
      setRecycled(true)
    }
    else if (tempResult[0] !== "60") {
      await window.utils.checkHoldsToken("asset", idxHash, props.addr)
        .then((e) => {
          console.log("is Owner Of? ", e)
          if (e) {
            setOwnerOf(true)
          }
        })
    }


  }

  const back = () => {
    window.location.href = "/#/user/search";
    setMoreInfo(false)

  }

  const generateThumbs = (obj) => {
    console.log("obj", obj)
    if (!obj.photo) {
      return []
    }
    else if (Object.values(obj.photo).length === 0) {
      return (
        <div className="assetImageSelectorButton">
          <img title="View Image" src={placeholder} className="imageSelectorImage" alt="" />
        </div>
      )
    }
    let component = [], photos = Object.values(obj.photo);
    //console.log("photos", photos)
    for (let i = 0; i < photos.length; i++) {
      component.push(
        <div key={"thumb" + String(i)} value={photos[i]} className="assetImageSelectorButton" onClick={() => { showImage(photos[i]) }}>
          <img title="View Image" src={photos[i]} className="imageSelectorImage" alt="" />
        </div>
      )
    }
    return component
  }

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
                Connecting to the blockchain<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
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
                  {IDXRawInput === false && !retrieving && (
                    <>
                      <CustomInput
                        success={loginManufacturerState === "success"}
                        error={loginManufacturerState === "error"}
                        labelText="Manufacturer *"
                        id="manufacturer"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            setManufacturer(event.target.value.trim())
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
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            setType(event.target.value.trim())
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
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            setModel(event.target.value.trim())
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
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            setSerial(event.target.value.trim())
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
                  {IDXRawInput === false && retrieving && (
                    <>
                      <CustomInput
                        labelText={manufacturer}
                        id="manufacturer"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                        }}
                      />
                      <CustomInput
                        labelText={type}
                        id="type"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                        }}
                      />
                      <CustomInput
                        labelText={model}
                        id="model"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                        }}
                      />
                      <CustomInput
                        labelText={serial}
                        id="serial"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                        }}
                      />
                    </>
                  )}
                  {!retrieving && (
                    <div className={classes.checkboxAndRadio}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            tabIndex={-1}
                            onClick={() => setIDXRawInput(!IDXRawInput)}
                            checkedIcon={<Check className={classes.checkedIcon} />}
                            icon={<Check className={classes.uncheckedIcon} />}
                            classes={{
                              checked: classes.checked,
                              root: classes.checkRoot
                            }}
                          />
                        }
                        classes={{
                          label: classes.label,
                          root: classes.labelRoot
                        }}
                        label="Search via asset ID"
                      />
                    </div>
                  )}
                  {IDXRawInput === true && !retrieving && (
                    <>
                      <CustomInput
                        success={loginIDXState === "success"}
                        error={loginIDXState === "error"}
                        labelText="Asset ID *"
                        id="IDX"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          onChange: event => {
                            setIDXRaw(event.target.value.trim())
                            if (event.target.value !== "" && event.target.value.trim().substring(0, 2) === "0x" && event.target.value.trim().length === 66) {
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
                  {IDXRawInput === true && retrieving && (
                    <>
                      <CustomInput
                        labelText={IDXRaw}
                        id="IDX"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true
                        }}
                      />
                    </>
                  )}
                  {!retrieving && (
                    <div className="QRScanner" value={scanQR} onClick={(e) => handleScanQR(e)}>
                      <Tooltip
                        title="Scan QR"
                      >
                        <Icon fontSize="large">
                          qr_code_scanner
                  </Icon>
                      </Tooltip>
                    </div>
                  )}
                  {!retrieving && (
                    <div className="MLBGradientSubmit">
                      <Button color="info" className="MLBGradient" onClick={(e) => retrieveRecord()} >Search Asset</Button>
                    </div>
                  )}
                  {retrieving && (
                    <h3>
                      Retrieving Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
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
                    style={{ width: '100%' }}
                  />
                )}
                {retrieving && (
                  <h3>
                    Retrieving Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
                  </h3>
                )}
                <Button value={scanQR} onClick={(e) => handleScanQR(e)} color="info" className="MLBGradient">Back</Button>
              </CardBody>
            </Card>
          )}
          {moreInfo && (
            <Card>
              {!isVerifying && !isRecycling && (
                <>
                  {!isMobile && (
                    <CardHeader image className={imgClasses.cardHeaderHoverCustom}>
                      {ipfsObject.photo !== undefined && (
                        <>
                          {Object.values(ipfsObject.photo).length > 0 && (
                            <>
                              {ipfsObject.DisplayImage !== "" && (
                                <>
                                  <Tooltip
                                    id="tooltip-top"
                                    title="Back"
                                    placement="bottom"
                                    classes={{ tooltip: classes.tooltip }}
                                  >
                                    <Button onClick={() => back()} large color="info" justIcon className="back">
                                      <KeyboardArrowLeft />
                                    </Button>
                                  </Tooltip>
                                  <img src={selectedImage} alt="..." />
                                </>
                              )}
                              {ipfsObject.DisplayImage === "" && (
                                <>
                                  <Tooltip
                                    id="tooltip-top"
                                    title="Back"
                                    placement="bottom"
                                    classes={{ tooltip: classes.tooltip }}
                                  >
                                    <Button onClick={() => back()} large color="info" justIcon className="back">
                                      <KeyboardArrowLeft />
                                    </Button>
                                  </Tooltip>
                                  <img src={selectedImage} alt="..." />
                                </>
                              )}
                            </>
                          )}
                          {Object.values(ipfsObject.photo).length === 0 && (
                            <>
                              <Tooltip
                                id="tooltip-top"
                                title="Back"
                                placement="bottom"
                                classes={{ tooltip: classes.tooltip }}
                              >
                                <Button onClick={() => back()} large color="info" justIcon className="back">
                                  <KeyboardArrowLeft />
                                </Button>
                              </Tooltip>
                              <Jdenticon value={asset.idxHash} />
                            </>
                          )}
                        </>
                      )}
                    </CardHeader>
                  )}
                  {isMobile && (
                    <CardHeader image className={imgClasses.cardHeaderHover}>
                      {ipfsObject.photo !== undefined && (
                        <>
                          {Object.values(ipfsObject.photo).length > 0 && (
                            <>
                              {ipfsObject.DisplayImage !== "" && (
                                <>
                                  <Tooltip
                                    id="tooltip-top"
                                    title="Back"
                                    placement="bottom"
                                    classes={{ tooltip: classes.tooltip }}
                                  >
                                    <Button onClick={() => back()} large color="info" justIcon className="back">
                                      <KeyboardArrowLeft />
                                    </Button>
                                  </Tooltip>
                                  <img src={selectedImage} alt="..." />
                                </>
                              )}
                              {ipfsObject.DisplayImage === "" && (
                                <>
                                  <Tooltip
                                    id="tooltip-top"
                                    title="Back"
                                    placement="bottom"
                                    classes={{ tooltip: classes.tooltip }}
                                  >
                                    <Button onClick={() => back()} large color="info" justIcon className="back">
                                      <KeyboardArrowLeft />
                                    </Button>
                                  </Tooltip>
                                  <img src={selectedImage} alt="..." />
                                </>
                              )}
                            </>
                          )}
                          {Object.values(ipfsObject.photo).length === 0 && (
                            <>
                              <Tooltip
                                id="tooltip-top"
                                title="Back"
                                placement="bottom"
                                classes={{ tooltip: classes.tooltip }}
                              >
                                <Button onClick={() => back()} large color="info" justIcon className="back">
                                  <KeyboardArrowLeft />
                                </Button>
                              </Tooltip>
                              <Jdenticon value={asset.idxHash} />
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
                    {Object.values(ipfsObject.photo).length > 1 && (
                      <div className="imageSelector">
                        {generateThumbs(ipfsObject)}
                      </div>
                    )}
                    <h4 className={classes.cardTitle}>Name: {ipfsObject.name}</h4>
                    <h4 className={classes.cardTitle}>Class: {asset.assetClassName} (NODE ID:{asset.assetClass})</h4>
                    {currency === "" && (<h4 className={classes.cardTitle}>Status: {asset.status} </h4>)}
                    {currency !== "" && (
                      <>
                        <h4 className={classes.cardTitle}>Status: For Sale </h4>
                        <h4 className={classes.cardTitle}>Price: {currency} {price} </h4>
                      </>
                    )}
                    {ipfsObject.text !== undefined && (
                      <>
                        <br />
                        {
                          ipfsObject.text.Description !== undefined && (
                            <TextField
                              id="outlined-multiline-static"
                              label="Description"
                              multiline
                              rows={4}
                              defaultValue={ipfsObject.text.Description}
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                          )
                        }
                        {ipfsObject.text.Description === undefined && (
                          <TextField
                            id="outlined-multiline-static"
                            label="Description: None"
                            multiline
                            rows={4}
                            defaultValue={ipfsObject.text.Description}
                            variant="outlined"
                            fullWidth
                            disabled
                          />
                        )}
                        {/* {ipfsObject.text.Description === undefined && Object.values(ipfsObject.text).length > 0 && (
                  <p className={classes.cardCategory}>
                    Text Element: {Object.values(ipfsObject.text)[0]}
                  </p>
                )} */}
                      </>
                    )}
                    <br />
                    {/* {currency !== "" && !transaction && (
              <Button onClick={() => { purchaseAsset() }} color="info" className="MLBGradient">Purchase Item</Button>
            )}

            {currency !== "" && transaction && (
              <Button disabled color="info" className="MLBGradient">Transaction Pending . . .</Button>
            )} */}
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
                        <Button onClick={() => { recycle() }} color="info" className="MLBGradient">Recycle Asset</Button>
                      </>
                    )}
                    {!transaction && isRecycling && (
                      <Button color="info" className="MLBGradient" onClick={() => setIsNotRecycling()}>Back</Button>
                    )}
                    {!transaction && !isVerifying && !recycled && (
                      <Button color="info" className="MLBGradient" onClick={() => verify()}>Verify Owner</Button>
                    )}
                    {!transaction && isVerifying && (
                      <Button color="info" className="MLBGradient" onClick={() => setIsNotVerifying()}>Back</Button>
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
                                  <h4 className={classes.cardIconTitle}>Select Asset Class</h4>
                                </CardHeader>
                                <CardBody>
                                  <form>
                                    <h3>
                                      Creating ID<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
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
                                  <h4 className={classes.cardIconTitle}>Select Asset Class</h4>
                                </CardHeader>
                                <CardBody>
                                  <form>
                                    <FormControl
                                      fullWidth
                                      className={classes.selectFormControl}
                                    >
                                      <InputLabel
                                      >
                                        Select Asset Class
                        </InputLabel>
                                      <Select
                                        MenuProps={{
                                          className: classes.selectMenu
                                        }}
                                        classes={{
                                          select: classes.select
                                        }}
                                        value={simpleSelect}
                                        onChange={(e) => { ACLogin(e) }}
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
                                          Select Asset Class
                          </MenuItem>
                                        <MenuItem
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                          }}
                                          value="1000003"
                                        >
                                          Trinkets
                          </MenuItem>
                                        <MenuItem
                                          classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                          }}
                                          value="1000004"
                                        >
                                          Personal Computers
                          </MenuItem>
                                      </Select>
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
                              <h4 className={classes.cardIconTitle}>New Owner Info</h4>
                            </CardHeader>
                            <CardBody>
                              <form>
                                <h5>Asset Selected: {ipfsObject.name}</h5>
                                <>
                                  {!transaction && (
                                    <>
                                      <CustomInput
                                        success={loginFirstState === "success"}
                                        error={loginFirstState === "error"}
                                        labelText="First Name *"
                                        id="firstName"
                                        formControlProps={{
                                          fullWidth: true
                                        }}
                                        inputProps={{
                                          onChange: event => {
                                            setFirst(event.target.value.trim())
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
                                          fullWidth: true
                                        }}
                                        inputProps={{
                                          onChange: event => {
                                            setMiddle(event.target.value.trim())
                                          },
                                        }}
                                      />
                                      <CustomInput
                                        success={loginLastState === "success"}
                                        error={loginLastState === "error"}
                                        labelText="Last Name *"
                                        id="lastName"
                                        formControlProps={{
                                          fullWidth: true
                                        }}
                                        inputProps={{
                                          onChange: event => {
                                            setLast(event.target.value.trim())
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
                                          fullWidth: true
                                        }}
                                        inputProps={{
                                          onChange: event => {
                                            setID(event.target.value.trim())
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
                                          fullWidth: true
                                        }}
                                        inputProps={{
                                          type: "password",
                                          onChange: event => {
                                            setPassword(event.target.value.trim())
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
                                          fullWidth: true
                                        }}
                                        inputProps={{
                                          disabled: true
                                        }}
                                      />
                                      <CustomInput
                                        labelText={middle}
                                        id="middle"
                                        formControlProps={{
                                          fullWidth: true
                                        }}
                                        inputProps={{
                                          disabled: true
                                        }}
                                      />
                                      <CustomInput
                                        labelText={last}
                                        id="last"
                                        formControlProps={{
                                          fullWidth: true
                                        }}
                                        inputProps={{
                                          disabled: true
                                        }}
                                      />
                                      <CustomInput
                                        labelText={ID}
                                        id="ID"
                                        formControlProps={{
                                          fullWidth: true
                                        }}
                                        inputProps={{
                                          disabled: true
                                        }}
                                      />
                                      <CustomInput
                                        labelText={password}
                                        id="ownerpassword"
                                        formControlProps={{
                                          fullWidth: true
                                        }}
                                        inputProps={{
                                          type: "password",
                                          disabled: true
                                        }}
                                      />
                                    </>
                                  )}
                                </>
                                {!transaction && (
                                  <Button color="info" className="MLBGradient" onClick={(e) => recycleAsset()}>Recycle Asset</Button>
                                )}
                                {transaction && (
                                  <h3>
                                    Recycling Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
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
                          <h4 className={classes.cardIconTitle}>Verify Owner Info</h4>
                        </CardHeader>
                        <CardBody>
                          <form>
                            <h5>Asset Selected: {ipfsObject.name}</h5>
                            <>
                              {!transaction && (
                                <>
                                  <CustomInput
                                    success={loginFirstState === "success"}
                                    error={loginFirstState === "error"}
                                    labelText="First Name *"
                                    id="firstName"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      onChange: event => {
                                        setFirst(event.target.value.trim())
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
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      onChange: event => {
                                        setMiddle(event.target.value.trim())
                                      },
                                    }}
                                  />
                                  <CustomInput
                                    success={loginLastState === "success"}
                                    error={loginLastState === "error"}
                                    labelText="Last Name *"
                                    id="lastName"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      onChange: event => {
                                        setLast(event.target.value.trim())
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
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      onChange: event => {
                                        setID(event.target.value.trim())
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
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      type: "password",
                                      onChange: event => {
                                        setPassword(event.target.value.trim())
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
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      disabled: true
                                    }}
                                  />
                                  <CustomInput
                                    labelText={middle}
                                    id="middle"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      disabled: true
                                    }}
                                  />
                                  <CustomInput
                                    labelText={last}
                                    id="last"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      disabled: true
                                    }}
                                  />
                                  <CustomInput
                                    labelText={ID}
                                    id="ID"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      disabled: true
                                    }}
                                  />
                                  <CustomInput
                                    labelText={password}
                                    id="ownerpassword"
                                    formControlProps={{
                                      fullWidth: true
                                    }}
                                    inputProps={{
                                      type: "password",
                                      disabled: true
                                    }}
                                  />
                                </>
                              )}
                            </>
                            {!transaction && props.addr && (
                              <Button color="info" className="MLBGradient" onClick={(e) => blockchainVerifyAsset()}>Blockchain Verify Owner</Button>
                            )}
                            {!transaction && (
                              <Button color="info" className="MLBGradient" onClick={(e) => verifyAsset()}>Verify Owner</Button>
                            )}
                            {transaction && (
                              <h3>
                                Verifying Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
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
                          Change Asset Info
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
                )}
                {isVerifying && (
                  <Card>
                    <CardHeader icon>
                      <CardIcon className="headerIconBack">
                        <AccountBox />
                      </CardIcon>
                      <h4 className={classes.cardIconTitle}>Verify Owner Info</h4>
                    </CardHeader>
                    <CardBody>
                      <form>
                        <h5>Asset Selected: {ipfsObject.name}</h5>
                        <>
                          {!transaction && (
                            <>
                              <CustomInput
                                success={loginFirstState === "success"}
                                error={loginFirstState === "error"}
                                labelText="First Name *"
                                id="firstName"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  onChange: event => {
                                    setFirst(event.target.value.trim())
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
                                  fullWidth: true
                                }}
                                inputProps={{
                                  onChange: event => {
                                    setMiddle(event.target.value.trim())
                                  },
                                }}
                              />
                              <CustomInput
                                success={loginLastState === "success"}
                                error={loginLastState === "error"}
                                labelText="Last Name *"
                                id="lastName"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  onChange: event => {
                                    setLast(event.target.value.trim())
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
                                  fullWidth: true
                                }}
                                inputProps={{
                                  onChange: event => {
                                    setID(event.target.value.trim())
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
                                  fullWidth: true
                                }}
                                inputProps={{
                                  type: "password",
                                  onChange: event => {
                                    setPassword(event.target.value.trim())
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
                                  fullWidth: true
                                }}
                                inputProps={{
                                  disabled: true
                                }}
                              />
                              <CustomInput
                                labelText={middle}
                                id="middle"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  disabled: true
                                }}
                              />
                              <CustomInput
                                labelText={last}
                                id="last"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  disabled: true
                                }}
                              />
                              <CustomInput
                                labelText={ID}
                                id="ID"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  disabled: true
                                }}
                              />
                              <CustomInput
                                labelText={password}
                                id="ownerpassword"
                                formControlProps={{
                                  fullWidth: true
                                }}
                                inputProps={{
                                  type: "password",
                                  disabled: true
                                }}
                              />
                            </>
                          )}
                        </>
                        {!transaction && props.addr && (
                          <Button color="info" className="MLBGradient" onClick={(e) => blockchainVerifyAsset()}>Blockchain Verify Owner</Button>
                        )}
                        {!transaction && (
                          <Button color="info" className="MLBGradient" onClick={(e) => verifyAsset()}>Verify Owner</Button>
                        )}
                        {transaction && (
                          <h3>
                            Verifying Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
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
                      <Tooltip
                        title="Copy to Clipboard"
                      >
                        <div className={classes.stats}>
                          Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(asset.idxHash) }}>{asset.idxHash}</a>
                        </div>
                      </Tooltip>
                    )}
                    {copyText && (
                      <Tooltip
                        title="Copied to Clipboard"
                      >
                        <div className={classes.stats}>
                          Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(asset.idxHash) }}>{asset.idxHash}</a>
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
                          Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(asset.idxHash) }}>{asset.idxHash.substring(0, 10) + "..." + asset.idxHash.substring(56, 66)}</a>
                        </div>
                      </Tooltip>
                    )}
                    {copyText && (
                      <Tooltip
                        title="Copied to Clipboard"
                      >
                        <div className={classes.stats}>
                          Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(asset.idxHash) }}>{asset.idxHash.substring(0, 10) + "..." + asset.idxHash.substring(56, 66)}</a>
                        </div>
                      </Tooltip>
                    )}
                  </>
                )}
                {isMobile && isAndroid && (
                  <Tooltip
                    title="Copy to Clipboard"
                  >
                    <CopyToClipboard text={asset.idxHash}
                      onCopy={() => { swal("Asset ID Copied to Clipboard!") }}>
                      <span>Asset ID: &nbsp; {asset.idxHash.substring(0, 14) + "..." + asset.idxHash.substring(52, 66)}</span>
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

                    <Tooltip
                      title="Share Asset URL"
                    >
                      <Icon className="footerIcon">
                        <Share />
                      </Icon>
                    </Tooltip>
                  </RWebShare>
                  {!isMobile && (
                    <Printer obj={{ name: ipfsObject.name, idxHash: asset.idxHash, assetClassName: asset.assetClassName }} />
                  )}
                  <Tooltip
                    title="View QR"
                  >
                    <Icon
                      className="footerIcon"
                      onClick={() => {
                        swalReact({
                          content: <QRCode
                            value={assetURL}
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
          )}
        </>
      )}
    </>
  );
}
