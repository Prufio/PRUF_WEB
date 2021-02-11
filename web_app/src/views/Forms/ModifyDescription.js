import React from "react";
import "../../assets/css/custom.css";
import { isMobile } from "react-device-detect";
import swal from 'sweetalert';
import base64 from 'base64-arraybuffer';
import validator from 'validator'
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Jdenticon from 'react-jdenticon';

// @material-ui/icons

// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import TextField from "@material-ui/core/TextField";
import CardBody from "components/Card/CardBody.js";
import { AddPhotoAlternateOutlined, DeleteForever, DeleteForeverOutlined, KeyboardArrowLeft, Settings, SettingsCellSharp } from "@material-ui/icons";
import Check from "@material-ui/icons/Check";
import CardFooter from "components/Card/CardFooter.js";
import Share from "@material-ui/icons/Share";
import Print from "@material-ui/icons/Print";
import placeholder from "../../assets/img/placeholder.jpg";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import formStyles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import Danger from "components/Typography/Danger";

const useStyles = makeStyles(styles);
const useFormStyles = makeStyles(formStyles);

export default function ModifyDescription(props) {

  if (window.contracts === undefined || !window.sentPacket) { window.location.href = "/#/user/home"; window.location.reload();}
  
  const [asset,] = React.useState(window.sentPacket);
  const [assetInfo,] = React.useState(JSON.parse(JSON.stringify({ photoUrls: window.sentPacket.photoUrls || {}, photo: window.sentPacket.photo || {}, text: window.sentPacket.text || {}, name: window.sentPacket.name || "", urls: window.sentPacket.urls || {} })));
  const [newAssetInfo, setNewAssetInfo] = React.useState(JSON.parse(JSON.stringify({ photoUrls: window.sentPacket.photoUrls || {}, photo: window.sentPacket.photo || {}, text: window.sentPacket.text || {}, name: window.sentPacket.name || "", urls: window.sentPacket.urls || {} })));
  const [idxHash,] = React.useState(window.sentPacket.idxHash);

  const [transactionActive, setTransactionActive] = React.useState(false);
  const [ipfsActive, setIpfsActive] = React.useState(false);
  const [advancedInput, setAdvancedInput] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [help, setHelp] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);

  const [txHash, setTxHash] = React.useState("");
  const [customJSON, setCustomJSON] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState("");
  const [selectedKey, setSelectedKey] = React.useState("");
  const [error, setError] = React.useState("");
  const [assetURL, setAssetURL] = React.useState("");
  const [URLTitle, setURLTitle] = React.useState("");
  const [loginURL, setloginURL] = React.useState("");
  const [loginURLState, setloginURLState] = React.useState("");
  const [loginURLTitle, setloginURLTitle] = React.useState("");
  const [loginURLTitleState, setloginURLTitleState] = React.useState("");
  const [downloadName, setDownloadName] = React.useState("");
  const [downloadLink, setDownloadLink] = React.useState("");
  const [copyText, setCopyText] = React.useState(false)

  const [additionalImages, setAdditionalImages] = React.useState([]);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  const link = document.createElement('div');
  const image = "photo", text = "text", url = "urls";
  const maxImageSize = 1000;
  const resizeImg = require('resize-img');
  const fs = require('fs');

  const classes = useStyles();
  const formClasses = useFormStyles();

  React.useEffect(() => {
    if (!hasMounted && assetInfo !== undefined) {
      setSelectedImage(assetInfo.photo.DisplayImage || Object.values(assetInfo.photo)[0] || "")
      if (assetInfo.photo.DisplayImage) {
        setSelectedKey("DisplayImage");
      } else if (Object.values(assetInfo.photo)[0] !== undefined) {
        setSelectedKey(Object.keys(assetInfo.photo)[0]);
      } else {
        setSelectedKey("");
      }
      window.sentPacket = {};
      setHasMounted(true)
    }
  })

  React.useEffect(() => {
    if (props.ps) {
      props.ps.element.scrollTop = 0;
      //console.log("Scrolled to ", props.ps.element.scrollTop)
    }
  }, [])

  if (assetInfo === undefined || assetInfo === null) {
    console.log("No asset found. Rerouting...")
    window.location.href = "/#/user/home"
    window.location.reload()
  }

  let fileInput = React.createRef();
  let fileInputJSON = React.createRef();

  const handleClick = () => {
    fileInput.current.value = "";
    fileInput.current.click();
  }

  const handleJSON = () => {
    fileInputJSON.current.value = "";
    fileInputJSON.current.click();
  }

  const getRandomInt = () => {
    return Math.floor(Math.random() * Math.floor(99999));
  }

  const generateNewKey = (obj) => {
    let key = "PRAT_Image_" + String(Object.values(obj.photo).length + getRandomInt())

    if (obj.photo[key]) {
      return generateNewKey(obj)
    }

    else {
      return key
    }
  }

  const removeElement = (type, rem) => {
    let tempObj = JSON.parse(JSON.stringify(newAssetInfo));
    delete tempObj[type][rem];
    //console.log(tempObj)
    if (type === image) {
      delete tempObj.photoUrls[rem];
      //console.log(rem)
      //console.log(tempObj)
      if (rem === "DisplayImage" && Object.values(tempObj.photo)[0]) {
        setSelectedImage(Object.values(tempObj.photo)[0])
        setSelectedKey(Object.keys(tempObj.photo)[0])
      }
      else if (rem !== "DisplayImage" && tempObj.photo.DisplayImage) {
        setSelectedImage(tempObj.photo.DisplayImage)
        setSelectedKey("DisplayImage")
      }
      else if (rem !== "DisplayImage" && Object.values(tempObj.photo)[0]) {
        setSelectedImage(Object.values(tempObj.photo)[0])
        setSelectedKey(Object.keys(tempObj.photo)[0])
      }
      else {
        setSelectedImage("")
        setSelectedKey("")
      }
    }
    setNewAssetInfo(tempObj);
    return forceUpdate()
  }

  const setDisplayImage = (img, key) => {
    console.log("Deleting: ", key)
    let tempObj = JSON.parse(JSON.stringify(newAssetInfo));
    if (key === "DisplayImage") { return console.log("Nothing was done. Already set.") }
    let newKey = generateNewKey(tempObj)
    if (tempObj.photo.DisplayImage) {
      tempObj.photo[newKey] = tempObj.photo.DisplayImage
      tempObj.photoUrls[newKey] = tempObj.photoUrls.DisplayImage
    }
    tempObj.photo.DisplayImage = img;
    tempObj.photoUrls.DisplayImage = tempObj.photoUrls[key]
    delete tempObj.photo[key];
    delete tempObj.photoUrls[key]
    //console.log(tempObj);
    setNewAssetInfo(tempObj);
    setSelectedImage(tempObj.photo.DisplayImage);
    setSelectedKey("DisplayImage");
    return forceUpdate()
  }

  const resetChanges = () => {
    setNewAssetInfo(assetInfo)
    return forceUpdate()
  }

  const submitChanges = () => {
    if (JSON.stringify(newAssetInfo) === JSON.stringify(assetInfo)) {
      return (
        swal({
          title: "New data matches old! No changes made.",
          icon: "warning",
          button: "Close",
        })
      )
    }
    let tempObj = JSON.parse(JSON.stringify(newAssetInfo));
    tempObj.photo = tempObj.photoUrls
    delete tempObj.photoUrls;

    let payload = JSON.stringify(tempObj, null, 5)
    let fileSize = Buffer.byteLength(payload, 'utf8')
    if (fileSize > 1000000) {
      return (
        swal({
          title: "Document size exceeds 1 MB limit! (" + String(fileSize) + "Bytes)",
          icon: "warning",
          button: "Close",
        })
      )
    }

    setIpfsActive(true);
    console.log("Submitting changes. Parsed Payload: ", tempObj)
    window.ipfs.add(payload, (err, hash) => { // Upload buffer to IPFS
      if (err) {
        console.error(err)
        return setIpfsActive(false);
      }

      let url = `https://ipfs.io/ipfs/${hash}`
      console.log(`Url --> ${url}`)
      let b32hash = window.utils.getBytes32FromIPFSHash(hash)
      setIpfsActive(false);
      updateAssetInfo(b32hash, tempObj)
    })
  }

  const thousandHashesOf = (varToHash) => {
    if(!window.web3) return window.location.href = "/#/user/home"
    let tempHash = varToHash;
    for (let i = 0; i < 1000; i++) {
      tempHash = window.web3.utils.soliditySha3(tempHash);
      //console.log(tempHash);
    }
    return tempHash;
  }

  const updateAssetInfo = async (hash, newAsset) => {
    
    setHelp(false)
    if (!hash || !idxHash) { return }

    const pageKey = thousandHashesOf(props.addr, props.winKey); //thousandHashesOf(props.addr, props.winKey)

    console.log("idxHash", idxHash);
    console.log("addr: ", props.addr);
    let tempTxHash;
    setShowHelp(false);
    setTxStatus(false);
    setTxHash("");
    setError(undefined);

    setTransactionActive(true);
    await window.contracts.NP_NC.methods
      ._modIpfs1(idxHash, hash)
      .send({ from: props.addr })
      .on("error", function (_error) {
        setTransactionActive(false);
        setTxStatus(false);
        setTxHash(Object.values(_error)[0].transactionHash);
        tempTxHash = Object.values(_error)[0].transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setError(Object.values(_error)[0]);
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
      })
      .on("receipt", (receipt) => {
        setTransactionActive(false);
        setTxStatus(receipt.status);
        tempTxHash = receipt.transactionHash
        let str1 = "Check out your TX <a href='https://kovan.etherscan.io/tx/"
        let str2 = "' target='_blank'>here</a>"
        link.innerHTML = String(str1 + tempTxHash + str2)
        setTxHash(receipt.transactionHash);
        swal({
          title: "Information Successfully Updated!",
          content: link,
          icon: "success",
          button: "Close",
        }).then(()=>{
          window.location.href = asset.lastRef;
          window.replaceAssetData = {key: pageKey, dBIndex: asset.dBIndex, newAsset: newAsset}
        })
      });
  }

  const urlKeyIsGood = (e) => {
    if (newAssetInfo.urls) {
      if (newAssetInfo.urls[e] || e === "") {
        return false
      }
    }
    return true
  }

  const submitCurrentUrl = () => {
    let url = assetURL, key = URLTitle, tempObj = JSON.parse(JSON.stringify(newAssetInfo));
    if ((url === "" && key !== "") || (url !== "" && key === "")) {
      if (url === "") {
        return setloginURLState("error")
      }
      if (key === "") {
        return setloginURLTitleState("error")
      }
    }
    if (!tempObj.urls) { tempObj.urls = {} }
    if (!url.includes("http")) {
      url = "http://" + url
    }
    tempObj.urls[key] = url;
    console.log(tempObj)
    setNewAssetInfo(tempObj);
    setAssetURL("")
    setURLTitle("")
    setloginURLState("")
    setloginURLTitleState("")
    return forceUpdate()
  }

  const handleName = (e) => {
    let tempObj = JSON.parse(JSON.stringify(newAssetInfo));
    tempObj.name = e;
    setNewAssetInfo(tempObj);
  }


  const handleDescription = (e) => {
    let tempObj = JSON.parse(JSON.stringify(newAssetInfo));
    tempObj.text.Description = e;
    setNewAssetInfo(tempObj);
  }

  const renderImage = (mobile) => {
    //console.log("AI", assetInfo)
    //console.log("NAI", newAssetInfo)
    if (!mobile) {
      if (newAssetInfo.photo.DisplayImage !== undefined || Object.values(newAssetInfo.photo).length > 0) {
        return (
          <CardHeader image className={classes.cardHeaderHoverCustom}>

            <Button color="info" justIcon className="back" onClick={() => { settings() }}>
              <Settings />
            </Button>
            <img src={selectedImage} alt="..." />
          </CardHeader>
        )
      } else if (newAssetInfo.photo.DisplayImage === undefined && Object.values(newAssetInfo.photo).length === 0) {
        return (
          <CardHeader image className={classes.cardHeaderHoverCustom}>
            <Button color="info" justIcon className="back" onClick={() => { settings() }}>
              <Settings />
            </Button>
            <Jdenticon value={asset.idxHash} />
          </CardHeader>
        )
      }
    }
    else if (mobile) {
      if (newAssetInfo.photo.DisplayImage !== undefined || Object.values(newAssetInfo.photo).length > 0) {
        return (
          <CardHeader image className={classes.cardHeaderHover}>

            <Button color="info" justIcon className="back" onClick={() => { settings() }}>
              <Settings />
            </Button>
            <img src={selectedImage} alt="..." />
          </CardHeader>
        )
      } else if (newAssetInfo.photo.DisplayImage === undefined && Object.values(newAssetInfo.photo).length === 0) {
        return (
          <CardHeader image className={classes.cardHeaderHover}>
            {/* <Tooltip
              id="tooltip-top"
              title="Back"
              placement="bottom"
              classes={{ tooltip: classes.tooltip }}
            >
            </Tooltip> */}
            {asset.identicon}
          </CardHeader>
        )
      }
    }
  }

  const addImage = async (prefix, buffer, fileName, iteration) => {
    if (!buffer) return;
    if (!iteration) {
      iteration = 1;
    }
    console.log(fileName);

    let tempObj = JSON.parse(JSON.stringify(newAssetInfo));
    if (tempObj.photo[fileName]) {
      //console.log("Already exists, adding copy")
      let tempFN = fileName
      tempFN += "_(" + iteration + ")"
      if (tempObj.photo[tempFN]) {
        return addImage(buffer, fileName, iteration + 1)
      }
      else {
        fileName = tempFN
      }
    }

    let tempBuffer = buffer;

    var i = new Image();

    i.onload = function () {
      console.log(i.height, i.width);
      if (i.height > maxImageSize || i.width > maxImageSize) {
        let newH, newW, ar;
        if (i.width > i.height) {
          ar = i.height / i.width;
          newW = maxImageSize;
          newH = ar * newW;
        }
        else {
          ar = i.width / i.height;
          newH = maxImageSize;
          newW = ar * newH;
        }
        console.log("Resizing image... ");
        resizeImg(tempBuffer, { height: newH, width: newW, format: "jpg" }).then((e) => {
          console.log("Resized to ", newH, "x", newW);
          tempObj.photo[fileName] = prefix + base64.encode(e);
          window.ipfs.add(prefix + base64.encode(e), (err, hash) => { // Upload image to IPFS
            if (err) {
              console.error(err)
              return setIsUploading(false);
            }
            let url = `https://ipfs.io/ipfs/${hash}`
            console.log(`Url --> ${url}`)
            tempObj.photoUrls[fileName] = url;
            setNewAssetInfo(tempObj);
            if (selectedImage === "") {
              setSelectedImage(tempObj.photo[fileName]);
              setSelectedKey(fileName);
            }
            setIsUploading(false)
            return forceUpdate();
          })
        })
      }
      else {
        resizeImg(tempBuffer, { height: i.height, width: i.width, format: "jpg" }).then((e) => {
          console.log("Converted to .JPG");
          tempObj.photo[fileName] = prefix + base64.encode(e);
          window.ipfs.add(prefix + base64.encode(e), (err, hash) => { // Upload image to IPFS
            if (err) {
              console.error(err)
              return setIsUploading(false);
            }

            let url = `https://ipfs.io/ipfs/${hash}`
            console.log(`Url --> ${url}`)
            tempObj.photoUrls[fileName] = url;
            setNewAssetInfo(tempObj);
            if (selectedImage === "") {
              setSelectedImage(tempObj.photo[fileName])
              setSelectedKey(fileName)
            }
            setIsUploading(false)
            return forceUpdate();
          })
        })
      };
    }

    i.src = prefix + base64.encode(tempBuffer)

  }

  const uploadImage = (e) => {
    e.preventDefault()
    if (!e.target.files[0]) return
    let file;
    //console.log(e.target.files[0]);
    file = e.target.files[0]
    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (!file.type.includes("image")) {
        //setIsUploading(false)
        return swal({
          title: "Unsupported File Type",
          button: "Close"
        })
      }
      setIsUploading(true)
      const fileType = file.type;
      const fileName = file.name;
      const prefix = `data:${fileType};base64,`;
      const buf = Buffer(reader.result);
      //const base64buf = prefix + base64.encode(buf);
      addImage(prefix, buf, fileName)
    }
    //const photo = document.getElementById("photo");
    reader.readAsArrayBuffer(e.target.files[0]); // Read Provided File
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

  const useCustomJSON = (e) => {
    if (!e.target.files[0]) return
    let newObj;
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const str = reader.result
      try {
        newObj = JSON.parse(str);
      } catch (file) {
        return console.log("Error converting file to JSON.", file);
      }

      if (newObj) {
        newObj.photoUrls = newAssetInfo.photoUrls;
        console.log(newObj);
        if (newObj.name && newObj.text && newObj.photo && newObj.urls) {
          console.log("Setting new JSON config into state")
          setNewAssetInfo(newObj);
          forceUpdate();
        }

        else {
          return console.log("Does not contain the requisite keys")
        }
        // forceUpdate()
        // return e.target.value = null;
      }
    }
    //const photo = document.getElementById("photo");
    reader.readAsText(e.target.files[0]); // Read Provided File

  }

  const createBackupJSON = () => {
    let filename;
    if (newAssetInfo.name !== "") {
      filename = newAssetInfo.name.replace(/ /g, "_") + '_Backup.json';
    } else {
      filename = 'unnamed_asset_backup.json';
    }

    let tempObj = JSON.parse(JSON.stringify(newAssetInfo));
    tempObj.photo = tempObj.photoUrls;
    delete tempObj.photoUrls;

    const data = new Blob([JSON.stringify(tempObj, null, 5)], { type: 'application/json' })
    const fileURL = URL.createObjectURL(data);
    const anchorTag = document.createElement('a');
    anchorTag.href = fileURL; anchorTag.target = '_blank'; anchorTag.className = 'imageInput';
    anchorTag.download = filename;
    document.body.appendChild(anchorTag);
    anchorTag.click();
    document.body.removeChild(anchorTag);
  }

  const settings = () => {
    swal("What would you like to do with this image?", {
      buttons: {
        delete: {
          text: "Delete",
          value: "delete"
        },
        profile: {
          text: "Set Default",
          value: "default"
        },
        back: {
          text: "Cancel",
          value: "back"
        }
      },
    })
      .then((value) => {
        let imgStat;
        switch (value) {

          case "delete":
            if (newAssetInfo.photo.DisplayImage === undefined && Object.values(newAssetInfo.photo).length === 0) {
              return swal("Cannot delete asset identicon.")
            }
            swal("Are you sure you want to delete this image?", {
              buttons: {
                yes: {
                  text: "Delete",
                  value: "yes"
                },
                no: {
                  text: "Cancel",
                  value: "no"
                }
              }
            })
              .then((value) => {
                switch (value) {
                  case "yes":
                    removeElement(image, selectedKey)
                    swal("Image Deleted!")
                    break;

                  case "no":
                    swal("Image not Deleted")
                    break;

                  default:
                    return;
                }
              })
            break;

          case "default":
            if (newAssetInfo.photo.DisplayImage === undefined && Object.values(newAssetInfo.photo).length === 0) {
              return swal("Cannot set asset identicon as default image.")
            }
            setDisplayImage(selectedImage, selectedKey)
            swal("Default image set!");
            break;

          case "back":
            break;

          default:
            return;
        }
      });
  }

  const deleteURL = (key) => {
    swal("Delete this URL?", {
      buttons: {
        delete: {
          text: "delete",
          value: "delete"
        },
        back: {
          text: "Cancel",
          value: "back"
        }
      },
    })
      .then((value) => {
        switch (value) {

          case "delete":
            swal("Are you sure you want to delete this extension?", {
              buttons: {
                yes: {
                  text: "Delete",
                  value: "yes"
                },
                no: {
                  text: "No",
                  value: "no"
                }
              }
            })
              .then((value) => {
                switch (value) {
                  case "yes":
                    removeElement(url, key)
                    break;

                  case "no":
                    break;

                  default:
                    return;
                }
              })
            break;

          case "back":
            break;

          default:
            return;
        }
      });
  }

  const generateUrls = (obj) => {
    if (!obj.urls) { return }
    else if (Object.values(obj.urls).length === 0) { return }
    let urls = Object.values(obj.urls), keys = Object.keys(obj.urls), component = [<div key="UrlHeader"><h4 className="bold_h4"> Attatched Links</h4><hr className="bold_hr" /></div>];
    for (let i = 0; i < urls.length; i++) {
      component.push(
        <div className="inlineDelete" key={"url" + i}>
          <div className="deleteURL" onClick={() => { deleteURL(keys[i]) }}>
            <Danger>
              <DeleteForever />
            </Danger>
          </div>
          <h4 className={classes.cardTitle}> {keys[i]}: <a href={urls[i]} target='_blank'>{urls[i]}</a></h4>
          <hr />
        </div>
      )
    }
    return component
  }

  const generateThumbs = (obj) => {
    //console.log(obj);
    let component = [], photos = Object.values(obj.photo), keys = Object.keys(obj.photo);
    //console.log("photos", photos)

    if (photos.length === 0 && !isUploading) {
      return (
        <div className="assetImageSelectorButton">
          <img title="View Image" src={placeholder} className="imageSelectorImage" alt="" />
        </div>
      )
    }
    if (photos.length === 0 && isUploading) {
      return (
        <>
          <div className="assetImageSelectorButton">
            <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
        </>
      )
    }
    for (let i = 0; i < photos.length; i++) {
      component.push(
        <div key={"thumb" + String(i)} value={keys[i]} className="assetImageSelectorButton" onClick={() => { showImage(photos[i], keys[i]) }}>
          <img title="View Image" src={photos[i]} className="imageSelectorImage" alt="" />
        </div>
      )
    }
    if (isUploading === true) {
      component.push (
        <div className="assetImageSelectorButton">
          <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      )
    }
    return component
  }

  const goBack = () => {
    window.location.href = asset.lastRef;
  }

  const showImage = (img, key) => {
    setSelectedImage(img)
    setSelectedKey(key)
  }

  return (
    <div>
      <Button color="info" className="MLBGradient" onClick={() => goBack()}>Go Back</Button>
      <Card>
        {renderImage(isMobile)}
        <CardBody>
          <div className="imageSelector">
            <input type="file" onChange={uploadImage} ref={fileInput} className="imageInput" />
            <input type="file" onChange={useCustomJSON} ref={fileInputJSON} className="imageInput" />
            {!isUploading && (
            <div className="imageSelectorPlus" onClick={(e) => { handleClick() }}><AddPhotoAlternateOutlined /></div>
            )}
            {isUploading && (
            <div className="imageSelectorPlus"><AddPhotoAlternateOutlined /></div>
            )}
            {generateThumbs(newAssetInfo)}
          </div>
          <br />
          {!transactionActive && (
            <>
              <TextField
                onChange={(e) => { handleName(e.target.value) }}
                id="outlined-full-width"
                label="Name"
                defaultValue={newAssetInfo.name}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
              <TextField
                onChange={(e) => { handleDescription(e.target.value) }}
                id="outlined-multiline-static"
                label="Description:"
                multiline
                rows={4}
                defaultValue={newAssetInfo.text.Description}
                variant="outlined"
                fullWidth
              />
            </>
          )}

          {transactionActive && (
            <>
              <TextField
                id="outlined-full-width"
                label="Name"
                defaultValue={newAssetInfo.name}
                fullWidth
                margin="normal"
                disabled="true"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
              <TextField
                disabled="true"
                id="outlined-multiline-static"
                label="Description:"
                multiline
                rows={4}
                defaultValue={newAssetInfo.text.Description}
                variant="outlined"
                fullWidth
              />
            </>
          )}
          {!transactionActive && (
            <div className={formClasses.checkboxAndRadio}>
              <FormControlLabel
                control={
                  <Checkbox
                    tabIndex={-1}
                    onClick={() => setAdvancedInput(!advancedInput)}
                    checkedIcon={<Check className={formClasses.checkedIcon} />}
                    icon={<Check className={formClasses.uncheckedIcon} />}
                    classes={{
                      checked: formClasses.checked,
                      root: formClasses.checkRoot
                    }}
                  />
                }
                classes={{
                  label: formClasses.label,
                  root: formClasses.labelRoot
                }}
                label="Advanced Options"
              />
            </div>
          )}
          {advancedInput && !transactionActive && (
            <div>
              <div>
                {generateUrls(newAssetInfo)}
                <h4 className="bold_h4"> New Link </h4><hr className="bold_hr" />
                <CustomInput
                  success={loginURLTitleState === "success"}
                  error={loginURLTitleState === "error"}
                  labelText="Link Name"
                  id="urlKey"
                  inputProps={{
                    value: URLTitle,
                    onChange: e => {
                      setURLTitle(e.target.value.trim())
                      if (urlKeyIsGood(e.target.value)) {
                        setloginURLTitleState("success");
                      } else {
                        setloginURLTitleState("error");
                      }
                      setloginURLTitle(e.target.value);
                    },
                  }}
                />

                <TextField
                  success={loginURLState === "success"}
                  error={loginURLState === "error"}
                  onChange={(e) => {
                    setAssetURL(e.target.value.trim())
                    if (validator.isURL(e.target.value)) {
                      setloginURLState("success");
                    } else {
                      setloginURLState("error");
                    }
                    setloginURL(e.target.value);
                  }}
                  value={assetURL}
                  id="outlined-full-width"
                  labelText="Link Address"
                  fullWidth
                  margin="normal"
                  placeholder="ex. 'https://foo.web/dir'"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <Button onClick={() => { submitCurrentUrl() }} color="info" className="advancedJSONButton">Add Link</Button>
              </div>
              <br />
              <h4 className="bold_h4"> Advanced JSON Options </h4><hr className="bold_hr" />
              <div className="URL">
              </div>
              {!isMobile && (
                <>
                  <Button onClick={(e) => { handleJSON() }} className="advancedJSONButton">Upload Custom IPFS Data</Button>
                  <br />
                  <Button onClick={() => createBackupJSON()} color="info" className="advancedJSONButton">Download Asset IPFS Data</Button>
                </>
              )}
            </div>
          )}
          {!transactionActive && !isUploading &&(
            <div className="MLBGradientSubmit">
              <hr className="medium_hr" />
              <Button onClick={() => { submitChanges() }} color="info" className="MLBGradient">Submit Changes</Button>
            </div>
          )}
          {!transactionActive && isUploading &&(
            <div className="MLBGradientSubmit">
              <hr className="medium_hr" />
              <Button disabled color="info" className="MLBGradient">Submit Changes</Button>
            </div>
          )}
          {!transactionActive && ipfsActive && (
            <h3>
              Uploading Extended Data<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
            </h3>
          )}
          {!ipfsActive && transactionActive && (
            <h3>
              Updating Asset<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
            </h3>
          )}
        </CardBody>
        <CardFooter chart>
          {!isMobile && (
            <>
              {!copyText && (
                <Tooltip
                  title="Copy to Clipboard"
                >
                  <div className={classes.stats}>
                    Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(idxHash) }}>{idxHash}</a>
                  </div>
                </Tooltip>
              )}
              {copyText && (
                <Tooltip
                  title="Copied to Clipboard"
                >
                  <div className={classes.stats}>
                    Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(idxHash) }}>{idxHash}</a>
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
                    Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(idxHash) }}>{idxHash.substring(0, 8) + "..." + idxHash.substring(58, 66)}</a>
                  </div>
                </Tooltip>
              )}
              {copyText && (
                <Tooltip
                  title="Copied to Clipboard"
                >
                  <div className={classes.stats}>
                    Asset ID: &nbsp; <a className="IDText" onClick={() => { copyTextSnippet(idxHash) }}>{idxHash.substring(0, 8) + "..." + idxHash.substring(58, 66)}</a>
                  </div>
                </Tooltip>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
