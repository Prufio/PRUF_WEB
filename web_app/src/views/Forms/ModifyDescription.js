import React from "react";
import "../../assets/css/custom.css";
import { isMobile } from "react-device-detect";
import swal from 'sweetalert';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons

// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CardBody from "components/Card/CardBody.js";
import { AddPhotoAlternateOutlined, Description, ExitToApp, KeyboardArrowLeft, Settings } from "@material-ui/icons";
import CardFooter from "components/Card/CardFooter.js";
import Share from "@material-ui/icons/Share";
import Print from "@material-ui/icons/Print";
import placeholder from "../../assets/img/placeholder.jpg";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function ModifyDescription() {
  const [assetInfo, setAssetInfo] = React.useState(window.sentPacket)
  const [selectedImage, setSelectedImage] = React.useState("")
  const [hasMounted, setHasMounted] = React.useState(false);
  const [simpleSelect, setSimpleSelect] = React.useState("");
  const link = document.createElement('div')

  React.useEffect(() => {
    if (!hasMounted && assetInfo !== undefined) {
      setSelectedImage(assetInfo.photo.DisplayImage || Object.values(assetInfo.photo)[0] || "")
      setHasMounted(true)
    }
  })

  window.sentPacket = null

  const classes = useStyles();

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
          <div className="imageSelectorPlus"><AddPhotoAlternateOutlined /></div>
          {generateThumbs(assetInfo)}
        </div>
        <br />
        <h4 className={classes.cardTitle}>
          Name:
        <>
            <CustomInput
              id="assetName"
              inputProps={{
                defaultValue: assetInfo.name
              }}
            />
          </>
        </h4>
        <h4 className={classes.cardTitle}>Class: {assetInfo.assetClassName} (NODE ID: {assetInfo.assetClass})</h4>
        <h4 className={classes.cardTitle}>Status: {assetInfo.status}</h4>
        <p className={classes.cardCategory}>
          Description:
          <>
            <CustomInput
              id="assetName"
              inputProps={{
                defaultValue: assetInfo.Description
              }}
            />
          </>
        </p>
        <CustomInput
          labelText="Add Text Field"
          id="extraField"
          formControlProps={{
            fullWidth: true
          }}
        />
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
