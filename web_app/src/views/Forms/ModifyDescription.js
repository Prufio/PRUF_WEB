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

export default function ModifyDescription() {
  const [assetInfo, setAssetInfo] = React.useState(window.sentPacket)
  const [selectedImage, setSelectedImage] = React.useState("")
  const [hasMounted, setHasMounted] = React.useState(false);
  const [advancedInput, setAdvancedInput] = React.useState(false);

  React.useEffect(() => {
    if (!hasMounted && assetInfo !== undefined) {
      setSelectedImage(assetInfo.photo.DisplayImage || Object.values(assetInfo.photo)[0] || "")
      setHasMounted(true)
    }
  })

  let fileInput = React.createRef();
  
  const handleClick = () => {
    fileInput.current.click();
  }
  const getImageFromLastUrl = () => {
    window.ipfs.cat(lastImage.hash, async (error, result) => {
      if (error) {
        console.log(lookup, "Something went wrong. Unable to find file on IPFS");
      } else {
        console.log(base64.decode(result))
      }
  })
}

  const uploadImage = (e) => {
    e.preventDefault()
    let file;
    console.log(e.target.files[0]);
    if(e !== undefined){
      file = e.target.files[0]
    }
    const reader = new FileReader();
    reader.onloadend = (e) => {  
      const fileType = file.type;
      const prefix = `data:${fileType};base64,`;
      const buf = Buffer(reader.result);
      const base64buf =prefix +  base64.encode(buf);
      window.ipfs.add(base64buf, (err, hash) => { // Upload buffer to IPFS
        if (err) {
          console.error(err)
          return
        }
  
        let url = `https://ipfs.io/ipfs/${hash}`
        console.log(`Url --> ${url}`)
        setLastImage({hash, url})
      })
    }
    //const photo = document.getElementById("photo");
    reader.readAsArrayBuffer(e.target.files[0]); // Read Provided File
  }

  window.sentPacket = null

  const classes = useStyles();
  const formClasses = useFormStyles();

  if (assetInfo === undefined || assetInfo === null) {
    return window.location.href = "/#/admin/home"
  }

  const settings = () => {
    swal("What would you like to do with this image?", {
      buttons: {
        delete: {
          text: "Delete image",
          value: "delete"
        },
        profile: {
          text: "Set as Profile Image",
          value: "profile"
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
            swal("Profile image set!");
            break;

          default:
            return;
        }
      });
  }

  const generateThumbs = (obj) => {
    let component = [], photos = Object.values(obj.photo);
    console.log("photos", photos)
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
    console.log(selectedImage)
    console.log(e)
    setSelectedImage(e)
  }

  return (
    <Card>
      <>
        {!isMobile && (
          <CardHeader image className={classes.cardHeaderHoverCustom}>
            {assetInfo.DisplayImage.length > 1 && (
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
            {assetInfo.DisplayImage.length === 0 && (<>
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
              {assetInfo.identicon}
            </>)}
          </CardHeader>
        )}
        {isMobile && (
          <CardHeader image className={classes.cardHeaderHover}>
            {assetInfo.DisplayImage.length > 1 && (
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
            {assetInfo.DisplayImage.length === 0 && (<>
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
              {assetInfo.identicon}
            </>)}
          </CardHeader>
        )}
      </>
      <CardBody>

        <div className="imageSelector">
          <input type="file" onChange={uploadImage} ref={fileInput}/>
          <div className="imageSelectorPlus"><AddPhotoAlternateOutlined onClick={(e)=>{handleClick()}}/></div>
          {generateThumbs(assetInfo)}
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
            id="outlined-full-width"
            label="Name"
            // style={{ margin: 8 }}
            // placeholder="Placeholder"
            defaultValue={assetInfo.name}
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
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={4}
            defaultValue={assetInfo.Description}
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
              id="outlined-full-width"
              label="Add Raw JSON object"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              helperText="e.g, {'MyImage': 'MyBeautifuImage.png', 'TextEntry': 'I Like Trains'}"
            />
            <Button color="info" className="submitChanges">Submit JSON Object</Button>
            <Button color="info" className="submitChanges">Download Full JSON File</Button>
          </div>
        )}
        <Button color="info" className="submitChanges">Submit Changes</Button>

      </CardBody>
      <CardFooter chart>
        {!isMobile && (
          <div className={classes.stats}>
            IDX Hash: {assetInfo.idxHash}
          </div>
        )}
        {isMobile && (
          <div className={classes.stats}>
            IDX Hash: {assetInfo.idxHash.substring(0, 12) + "..." + assetInfo.idxHash.substring(54, 66)}
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
