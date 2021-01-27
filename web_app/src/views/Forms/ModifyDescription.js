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
import { Description, ExitToApp, KeyboardArrowLeft } from "@material-ui/icons";
import CardFooter from "components/Card/CardFooter.js";
import Share from "@material-ui/icons/Share";
import Print from "@material-ui/icons/Print";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function ModifyDescription() {
  const [assetInfo, setAssetInfo] = React.useState(window.sentPacket)

  const link = document.createElement('div')


  window.sentPacket = null

  const classes = useStyles();

  if (assetInfo === undefined || assetInfo === null) {
    return window.location.href = "/#/admin/home"
  }

  return (
    <Card>
      <>
        {!isMobile && (
          <CardHeader image className={classes.cardHeaderHoverCustom}>
            {assetInfo.DisplayImage.length > 1 && (
              <>
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
                <img src={assetInfo.DisplayImage} alt="..." />
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
                <img src={assetInfo.DisplayImage} alt="..." />
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
        <h4 className={classes.cardTitle}>
          Name:
        <div className="input">
            <CustomInput
              // labelText={assetInfo.name}
              id="assetName"
              formControlProps={{
                fullWidth: true
              }}
            inputProps={{
              defaultValue: assetInfo.name
              // onChange: event => {
              //   setNameTag(event.target.value.trim())
              // },
            }}
            />
          </div>
        </h4>
        <h4 className={classes.cardTitle}>Class: {assetInfo.assetClassName} (NODE ID: {assetInfo.assetClass})</h4>
        <h4 className={classes.cardTitle}>Status: {assetInfo.status}</h4>
        <p className={classes.cardCategory}>
          Description: 
        <div className="inputDescription">
            <CustomInput
              // labelText={assetInfo.Description}
              id="assetName"
              // value={currentDescription}
              formControlProps={{
                fullWidth: true
              }}
            inputProps={{
              defaultValue: assetInfo.Description
              // onChange: event => {
              //   setNameTag(event.target.value.trim())
              // },
            }}
            />
          </div>
          </p>
          <CustomInput
              labelText="Add Text Field"
              id="extraField"
              // value={currentDescription}
              formControlProps={{
                fullWidth: true
              }}
            // inputProps={{
              // defaultValue: assetInfo.Description
              // onChange: event => {
              //   setNameTag(event.target.value.trim())
              // },
            // }}
            />
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
