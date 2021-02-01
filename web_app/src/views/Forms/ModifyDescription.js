import React from "react";
import "../../assets/css/custom.css";
import { isMobile } from "react-device-detect";
import swal from 'sweetalert';
import base64 from 'base64-arraybuffer';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons

// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import TextField from "@material-ui/core/TextField";
import CardBody from "components/Card/CardBody.js";
import { AddPhotoAlternateOutlined, DeleteForever, DeleteForeverOutlined, Settings } from "@material-ui/icons";
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

if (window.contracts === undefined) { window.location.href = "/#/admin/home" }

export default function ModifyDescription(props) {
  const [transactionActive, setTransactionActive] = React.useState(false);

  const [error, setError] = React.useState("");
  const [showHelp, setShowHelp] = React.useState(false);
  const [txStatus, setTxStatus] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const [asset,] = React.useState(window.sentPacket)
  const [assetInfo,] = React.useState({ photo: window.sentPacket.photo, text: window.sentPacket.text, name: window.sentPacket.name, urls: window.sentPacket.urls || {} });
  const [newAssetInfo, setNewAssetInfo] = React.useState({ photo: window.sentPacket.photo, text: window.sentPacket.text, name: window.sentPacket.name, urls: window.sentPacket.urls || {} });
  const [idxHash,] = React.useState(window.sentPacket.idxHash)
  const [customJSON, setCustomJSON] = React.useState("")
  const [selectedImage, setSelectedImage] = React.useState("");
  const [selectedKey, setSelectedKey] = React.useState("");
  const [hasMounted, setHasMounted] = React.useState(false);
  const [additionalImages, setAdditionalImages] = React.useState([]);
  const [help, setHelp] = React.useState(false);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  // const link = document.createElement('div')
  const [advancedInput, setAdvancedInput] = React.useState(false);
  const link = document.createElement('div')
  const [currentUrl, setCurrentUrl] = React.useState("");
  const [currentUrlKey, setCurrentUrlKey] = React.useState("");
  const [loginURL, setloginURL] = React.useState("");
  const [loginURLState, setloginURLState] = React.useState("");
  const [loginURLTitle, setloginURLTitle] = React.useState("");
  const [loginURLTitleState, setloginURLTitleState] = React.useState("");
  const [downloadName, setDownloadName] = React.useState("")
  const [downloadLink, setDownloadLink] = React.useState("")
  const image = "photo", text = "text", url = "urls";
  const fs = require('fs');

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

  let fileInput = React.createRef();
  let fileInputJSON = React.createRef();

  const handleClick = () => {
    fileInput.current.click();
  }

  const handleJSON = () => {
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
    let tempObj = newAssetInfo;
    delete tempObj[type][rem];
    //console.log(tempObj)
    setNewAssetInfo(tempObj);
    if (type = image) {
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
    return forceUpdate()
  }

  const setDisplayImage = (img, key) => {
    console.log("Deleting: ", key)
    let tempObj = newAssetInfo;
    if (key === "DisplayImage") { return console.log("Nothing was done. Already set.") }
    let newKey = generateNewKey(tempObj)
    if (tempObj.photo.DisplayImage) {
      tempObj.photo[newKey] = tempObj.photo.DisplayImage
    }
    tempObj.photo.DisplayImage = img;
    delete tempObj.photo[key];
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
    let payload = JSON.stringify(newAssetInfo,null,5)
    let fileSize = Buffer.byteLength(payload, 'utf8')
    if (fileSize > 10000000) {
      return (
        swal({
          title: "Document size exceeds 10 MB limit! (" + String(fileSize) + "Bytes)",
          content: link,
          icon: "warning",
          button: "Close",
        })
      )
    }

    window.ipfs.add(payload, (err, hash) => { // Upload buffer to IPFS
      if (err) {
        console.error(err)
        return
      }

      let url = `https://ipfs.io/ipfs/${hash}`
      console.log(`Url --> ${url}`)
      let b32hash = window.utils.getBytes32FromIPFSHash(hash)
      updateAssetInfo(b32hash)
    })
  }

  const updateAssetInfo = async (hash) => {
    setHelp(false)
    if (!hash || !idxHash) { return }

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
        swal({
          title: "Information Update Failed!",
          content: link,
          icon: "warning",
          button: "Close",
        });
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
        });
        window.resetInfo = true;
        window.recount = true;
        window.location.href = "/#/admin/dashboard"
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
    let url = currentUrl, key = currentUrlKey, tempObj = newAssetInfo;
    if (!key || key === "") { return }
    if (!tempObj.urls) { tempObj.urls = {} }
    if (!url.includes("http")){
      url = "http://" + url
    }
    tempObj.urls[key] = url;
    console.log(tempObj)
    setNewAssetInfo(tempObj);
    return forceUpdate()
  }

  const handleName = (e) => {
    let tempObj = newAssetInfo;
    tempObj.name = e;
    setNewAssetInfo(tempObj);
  }


  const handleDescription = (e) => {
    let tempObj = newAssetInfo;
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

            <Button large color="info" justIcon className="back" onClick={() => { settings() }}>
              <Settings />
            </Button>
            <img src={selectedImage} alt="..." />
          </CardHeader>
        )
      } else if (newAssetInfo.photo.DisplayImage === undefined && Object.values(newAssetInfo.photo).length === 0) {
        return (
          <CardHeader image className={classes.cardHeaderHoverCustom}>
            <Tooltip
              id="tooltip-top"
              title="Back"
              placement="bottom"
              classes={{ tooltip: classes.tooltip }}
            >
            </Tooltip>
            {asset.identicon}
          </CardHeader>
        )
      }
    }
    else if (mobile) {
      if (newAssetInfo.photo.DisplayImage !== undefined || Object.values(newAssetInfo.photo).length > 0) {
        return (
          <CardHeader image className={classes.cardHeaderHover}>

            <Button large color="info" justIcon className="back" onClick={() => { settings() }}>
              <Settings />
            </Button>
            <img src={selectedImage} alt="..." />
          </CardHeader>
        )
      } else if (newAssetInfo.photo.DisplayImage === undefined && Object.values(newAssetInfo.photo).length === 0) {
        return (
          <CardHeader image className={classes.cardHeaderHover}>
            <Tooltip
              id="tooltip-top"
              title="Back"
              placement="bottom"
              classes={{ tooltip: classes.tooltip }}
            >
            </Tooltip>
            {asset.identicon}
          </CardHeader>
        )
      }
    }
  }

  const addImage = async (buffer, fileName, iteration) => {
    if (!buffer) return;
    if (!iteration) {
      iteration = 1;
    }
    let tempObj = newAssetInfo;
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
    tempObj.photo[fileName] = buffer;
    //console.log(tempObj);
    setNewAssetInfo(tempObj);
    if (selectedImage === "") {
      setSelectedImage(tempObj.photo[fileName])
      setSelectedKey(fileName)
    }
    return forceUpdate()
  }

  const uploadImage = (e) => {
    e.preventDefault()
    if (!e.target.files[0]) return
    let file;
    //console.log(e.target.files[0]);
    file = e.target.files[0]
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const fileType = file.type;
      const fileName = file.name;
      const prefix = `data:${fileType};base64,`;
      const buf = Buffer(reader.result);
      const base64buf = prefix + base64.encode(buf);
      addImage(base64buf, fileName)
    }
    //const photo = document.getElementById("photo");
    reader.readAsArrayBuffer(e.target.files[0]); // Read Provided File
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
        console.log(newObj);
        if(newObj.name && newObj.text && newObj.photo && newObj.urls){
          console.log("Setting new JSON config into state")
          setNewAssetInfo(newObj);
        }
        else{
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
    const data = new Blob([JSON.stringify(newAssetInfo,null,5)], { type: 'application/json' })
    const fileURL = URL.createObjectURL(data);
    const anchorTag = document.createElement('a');
    anchorTag.href = fileURL; anchorTag.target = '_blank'; anchorTag.className = 'imageInput';
    anchorTag.download = filename;
    document.body.appendChild(anchorTag);
    anchorTag.click();
    document.body.removeChild(anchorTag);
  }

  const classes = useStyles();
  const formClasses = useFormStyles();

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
    else if(Object.values(obj.urls).length === 0) { return }
    let urls = Object.values(obj.urls), keys = Object.keys(obj.urls), component = [<div key="UrlHeader"><h4 className="bold_h4"> Attatched Urls</h4><hr className="bold_hr" /></div>];
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

    if (photos.length === 0) {
      return (
        <div className="assetImageSelectorButton">
          <img title="View Image" src={placeholder} className="imageSelectorImage" alt="" />
        </div>
      )
    }
    for (let i = 0; i < photos.length; i++) {
      component.push(
        <div key={"thumb" + String(i)} value={keys[i]} className="assetImageSelectorButton" onClick={() => { showImage(photos[i], keys[i]) }}>
          <img title="View Image" src={photos[i]} className="imageSelectorImage" alt="" />
        </div>
      )
    }
    return component
  }

  const showImage = (img, key) => {
    //console.log(img, key)
    //console.log(selectedImage)
    //console.log(img)
    setSelectedImage(img)
    setSelectedKey(key)
  }

  return (
    <Card>
      <>
        {renderImage(isMobile)}
      </>
      <CardBody>

        <div className="imageSelector">
          <input type="file" onChange={uploadImage} ref={fileInput} className="imageInput" />
          <input type="file" onChange={useCustomJSON} ref={fileInputJSON} className="imageInput" />
          <div className="imageSelectorPlus" onClick={(e) => { handleClick() }}><AddPhotoAlternateOutlined /></div>
          {generateThumbs(newAssetInfo)}
        </div>
        <br />
        <TextField
          onChange={(e) => { handleName(e.target.value) }}
          id="outlined-full-width"
          label="Name"
          defaultValue={newAssetInfo.name}
          fullWidth
          key={newAssetInfo.name}
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
          defaultValue={newAssetInfo.text.Description || ""}
          key={newAssetInfo.text.Description || "noKeyAvailable"}
          variant="outlined"
          fullWidth
        />
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
        {advancedInput && (
          <div>
            <div>
              {generateUrls(newAssetInfo)}
              <h4 className="bold_h4"> New Url </h4><hr className="bold_hr" />
              <CustomInput
                success={loginURLState === "success"}
                error={loginURLState === "error"}
                labelText="Website Name"
                id="urlKey"
                inputProps={{
                  onChange: e => {
                    setCurrentUrlKey(e.target.value.trim())
                    if (e.target.value !== "") {
                      setloginURLState("success");
                    } else {
                      setloginURLState("error");
                    }
                    setloginURL(e.target.value);
                  },
                }}
              />

              <TextField
                success={loginURLTitleState === "success"}
                error={loginURLTitleState === "error"}
                onChange={(e) => {
                  setCurrentUrl(e.target.value.trim())
                  if (urlKeyIsGood(e.target.value)) {
                    setloginURLTitleState("success");
                  } else {
                    setloginURLTitleState("error");
                  }
                  setloginURLTitle(e.target.value);
                }}
                id="outlined-full-width"
                label="URL"
                fullWidth
                margin="normal"
                placeholder="ex. 'https://foo.web/dir'"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />

              <Button onClick={() => { submitCurrentUrl() }} color="info" className="submitChanges">Add New Url</Button>
            </div>
            <br />
            <h4 className="bold_h4"> Advanced JSON Options </h4><hr className="bold_hr" />
            <div className="URL">
            </div>
            <Button onClick={(e) => { handleJSON() }} className="submitChanges">Upload Custom JSON File</Button>
            <br />
            <Button onClick={() => createBackupJSON()} color="info" className="submitChanges">Download Current JSON File</Button>
          </div>

        )}
        {/*         {!transactionActive && assetInfo.name === newAssetInfo.name && Object.values(assetInfo.photo) === Object.values(newAssetInfo.photo) && Object.values(assetInfo.photo) === Object.values(newAssetInfo.photo) && (
          <Button disabled color="info" className="submitChanges">Submit Changes</Button>
        )} */}
        {/*         {!transactionActive && assetInfo.name !== newAssetInfo.name || Object.values(assetInfo.photo) !== Object.values(newAssetInfo.photo) || Object.values(assetInfo.photo) !== Object.values(newAssetInfo.photo) && (
           */}
        <hr className="medium_hr" />
        <Button onClick={() => { submitChanges() }} color="info" className="submitChanges">Submit Changes</Button>
        {/*         )} */}
        {/*         {transactionActive && (
          <h3>
            Changing Asset Information<div className="lds-ellipsisIF"><div></div><div></div><div></div></div>
          </h3>
        )} */}
      </CardBody>
      <CardFooter chart>
        {!isMobile && (
          <div className={classes.stats}>
            IDX Hash: {asset.idxHash}
          </div>
        )}
        {isMobile && (
          <div className={classes.stats}>
            IDX Hash: {asset.idxHash.substring(0, 12) + "..." + assetInfo.idxHash.substring(54, 66)}
          </div>
        )}
        <div className={classes.stats}>
          <Share />
          <Print />
        </div>
      </CardFooter>
    </Card>
  );
}
