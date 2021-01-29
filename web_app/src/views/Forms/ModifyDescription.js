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
import { AddPhotoAlternateOutlined, KeyboardArrowLeft, Settings } from "@material-ui/icons";
import Check from "@material-ui/icons/Check";
import CardFooter from "components/Card/CardFooter.js";
import Share from "@material-ui/icons/Share";
import Print from "@material-ui/icons/Print";
import placeholder from "../../assets/img/placeholder.jpg";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import formStyles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);
const useFormStyles = makeStyles(formStyles);

export default function ModifyDescription(props) {
  const [asset, ] = React.useState(window.sentPacket)
  const [assetInfo, ] = React.useState({photo: window.sentPacket.photo, text: window.sentPacket.text, name: window.sentPacket.name});
  const [newAssetInfo, setNewAssetInfo] = React.useState({photo: window.sentPacket.photo, text: window.sentPacket.text, name: window.sentPacket.name});
  const [idxHash, ] = React.useState(window.sentPacket.idxHash)
  const [customJSON, setCustomJSON] = React.useState("")
  const [selectedImage, setSelectedImage] = React.useState("");
  const [selectedKey, setSelectedKey] = React.useState("");
  const [hasMounted, setHasMounted] = React.useState(false);
  const [additionalImages, setAdditionalImages] = React.useState([]);
  const [help, setHelp] = React.useState(false);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  // const link = document.createElement('div')
  const [advancedInput, setAdvancedInput] = React.useState(false);
  const image = "photo", text = "text";

  React.useEffect(() => {
    if (!hasMounted && assetInfo !== undefined) {
      setSelectedImage(assetInfo.photo.DisplayImage || Object.values(assetInfo.photo)[0] || "")
      if(assetInfo.photo.DisplayImage){
        setSelectedKey("DisplayImage");
      } else if (Object.values(assetInfo.photo)[0]) {
        setSelectedKey(Object.keys(assetInfo.photo)[0]);
      } else {
        setSelectedKey("");
      }
      setHasMounted(true)
    }
  })

  let fileInput = React.createRef();
  let fileInputJSON = React.createRef();

  const handleClick = () => {
    fileInput.current.click();
  }

  const removeElement = (type, rem) => {
    let tempObj = newAssetInfo;
    delete tempObj[type][rem];
    console.log(tempObj)
    setNewAssetInfo(tempObj);
    return forceUpdate()
  }

  const setDisplayImage = () => {
    let tempObj = newAssetInfo;
    tempObj.photo.DisplayImage = selectedImage;
    delete tempObj.photo[selectedKey]
    setNewAssetInfo(tempObj);
    setSelectedImage(tempObj.photo.DisplayImage);
    return forceUpdate()
  }

  const resetChanges = () => {
    setNewAssetInfo(assetInfo)
    return forceUpdate()
  }

  const submitChanges = () => {
    window.ipfs.add(newAssetInfo, (err, hash) => { // Upload buffer to IPFS
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
    if(!hash || !idxHash){return}

    console.log("idxHash", idxHash);
    console.log("addr: ", props.addr);

    await window.contracts.NP_NC.methods
      ._modIpfs1(idxHash, hash)
      .send({ from: props.addr })
      .on("error", function (_error) {
        console.log(_error)
      })
      .on("receipt", (receipt) => {
        console.log(receipt.status);
        window.resetInfo = true;
        return window.location.href = '/#/admin/dashboard'
      });
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

  const download = async (buffer, fileName) => {
    if (!buffer) return;
    let tempObj = newAssetInfo;
    tempObj.photo[fileName] = buffer;
    console.log(tempObj);
    setNewAssetInfo(tempObj);
    return forceUpdate()
  }

  const uploadImage = (e) => {
    e.preventDefault()
    if(!e.target.files[0]) return
    let file;
    //console.log(e.target.files[0]);
      file = e.target.files[0]
    const reader = new FileReader();
    reader.onloadend = (e) => {  
      const fileType = file.type;
      const fileName = file.name;
      const prefix = `data:${fileType};base64,`;
      const buf = Buffer(reader.result);
      const base64buf = prefix +  base64.encode(buf);
      download(base64buf, fileName)
    }
    //const photo = document.getElementById("photo");
    reader.readAsArrayBuffer(e.target.files[0]); // Read Provided File
  }

  const classes = useStyles();
  const formClasses = useFormStyles();

  if (asset === undefined || asset === null) {
    return window.location.href = "/#/admin/home"
  }

  const settings = () => {
    swal("What would you like to do with this image?", {
      buttons: {
        delete: {
          text: "Delete Image",
          value: "delete"
        },
        profile: {
          text: "Set as Profile Image",
          value: "profile"
        },
        back: {
          text: "Go Back",
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
                  text: "Yes",
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

          case "profile":
            setDisplayImage(selectedImage)
            swal("Profile image set!");
            break;

          case "back":
            break;

          default:
            return;
        }
      });
  }

  const generateThumbs = (obj) => {
    console.log(obj);
    let component = [], photos = Object.values(obj.photo), keys = Object.keys(obj.photo);
    console.log("photos", photos)
    
    if (photos.length === 0) {
      return (
        <div className="assetImageSelectorButton">
          <img title="View Image" src={placeholder} className="imageSelectorImage" alt="" />
        </div>
      )
    }
    for (let i = 0; i < photos.length; i++ ) {
        component.push(
          <div key={"thumb" + String(i)} value={keys[i]} className="assetImageSelectorButton" onClick={() => { showImage(photos[i], keys[i]) }}>
            <img title="View Image" src={photos[i]} className="imageSelectorImage" alt="" />
          </div>
        ) 
    }
    return component
  }

  const showImage = (e) => {
    console.log(selectedImage)
    console.log(e)
    setSelectedImage(e)
    setSelectedKey(e)
  }

  return (
    <Card>
      <>
        {!isMobile && (
          <CardHeader image className={classes.cardHeaderHoverCustom}>
            {newAssetInfo.photo.DisplayImage || Object.values(newAssetInfo.photo).length > 0 && (
              <>
                <Button large color="info" justIcon className="back">
                  <KeyboardArrowLeft />
                </Button>
                <Button large color="info" justIcon className="settings" onClick={() => { settings() }}>
                  <Settings />
                </Button>
                <img src={selectedImage} alt="..." />
              </>
            )}
            {!newAssetInfo.photo.DisplayImage && Object.values(newAssetInfo.photo).length === 0 && (<>
              <Tooltip
                id="tooltip-top"
                title="Back"
                placement="bottom"
                classes={{ tooltip: classes.tooltip }}
              >
                <Button large color="info" justIcon className="back">
                  <KeyboardArrowLeft />
                </Button>
              </Tooltip>
              {asset.identicon}
            </>)}
          </CardHeader>
        )}
        
        {isMobile && (
          <CardHeader image className={classes.cardHeaderHover}>
            {newAssetInfo.photo.DisplayImage || Object.values(newAssetInfo.photo).length > 0 && (
              <>
                <Button large color="info" justIcon className="back">
                  <KeyboardArrowLeft />
                </Button>
                <Button large color="info" justIcon className="settings" onClick={() => { settings() }}>
                  <Settings />
                </Button>
                <img src={selectedImage} alt="..." />
              </>
            )}
            {!newAssetInfo.photo.DisplayImage && Object.values(newAssetInfo.photo).length === 0 && (<>
              <Tooltip
                id="tooltip-top"
                title="Back"
                placement="bottom"
                classes={{ tooltip: classes.tooltip }}
              >
                <Button large color="info" justIcon className="back">
                  <KeyboardArrowLeft />
                </Button>
              </Tooltip>
              {asset.identicon}
            </>)}
          </CardHeader>
        )}
      </>
      <CardBody>

        <div className="imageSelector">
          <input type="file" onChange={uploadImage} ref={fileInput}/>
          <div className="imageSelectorPlus"><AddPhotoAlternateOutlined onClick={(e)=>{handleClick()}}/></div>
          {generateThumbs(newAssetInfo)}
        </div>
        <br />
        <h4>
          {/* Name:
        <>
            <CustomInput
              className="input"
              id="assetName"
              inputProps={{
                defaultValue: assetInfo.name
              }}
            />
          </> */}
          <TextField
            onChange={(e)=>{handleName(e.target.value)}}
            id="outlined-full-width"
            label="Name"
            // style={{ margin: 8 }}
            // placeholder="Placeholder"
            defaultValue={newAssetInfo.name}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
        </h4>
        <p
        // className={classes.cardCategory}
        >
          {/* Description:
          <> */}
          {/* <TextField
              id="outlined-multiline-static"
              rows={4}
              inputProps={{
                defaultValue: assetInfo.Description
              }}
            /> */}
          <TextField
            onChange={(e)=>{handleDescription(e.target.value)}}
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={4}
            defaultValue={newAssetInfo.text.Description}
            variant="outlined"
            fullWidth
          />
          {/* // </> */}
        </p>
        <TextField
          id="outlined-full-width"
          label="Add Data Field"
          // style={{ margin: 8 }}
          // placeholder="Input Here"
          // defaultValue={assetInfo.name}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
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
            <TextField
              onChange={(e)=>{setCustomJSON(e.target.value)}}
              id="outlined-full-width"
              label="Add Raw JSON object"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              helperText="e.g, {name: 'Asset name', photo: {photoKey1: photoVal1, ...}, text: {textKeyStr1: textValStr1, ...}}"
            />
            <Button color="info" className="submitChanges">Upload File</Button>
            <Button color="info" className="submitChanges">Backup JSON File</Button>
          </div>
        )}
        <Button onClick={()=>{submitChanges()}} color="info" className="submitChanges">Submit Changes</Button>

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
