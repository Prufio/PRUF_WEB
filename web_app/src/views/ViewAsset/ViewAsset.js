import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Switch from "@material-ui/core/Switch";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


import pruftoken from "../../assets/img/pruftoken.png";
import "../../assets/css/custom.css";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import Create from "@material-ui/icons/Create";
import Share from "@material-ui/icons/Share";
import Print from "@material-ui/icons/Print";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Danger from "components/Typography/Danger.js";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
const useStyles = makeStyles(styles);

export default function ViewAsset() {

  const [checkedA, setCheckedA] = React.useState(true);
  const [checkedB, setCheckedB] = React.useState(false);
  const [simpleSelect, setSimpleSelect] = React.useState("");
  // const [multipleSelect, setMultipleSelect] = React.useState([]);
  // const [tags, setTags] = React.useState(["pizza", "pasta", "parmesan"]);
  const handleSimple = event => {
    setSimpleSelect(event.target.value);
    if (event.target.value === "transfer") {
      return window.location.href = "/#/user/transfer-asset"
    }
    if (event.target.value === "escrow") {
      return window.location.href = "/#/user/escrow-manager"
    }
    if (event.target.value === "import") {
      return window.location.href = "/#/user/import-asset"
    }
    if (event.target.value === "export") {
      return window.location.href = "/#/user/export-asset"
    }
    if (event.target.value === "discard") {
      return window.location.href = "/#/user/discard-asset"
    }
    if (event.target.value === "change-status") {
      return window.location.href = "/#/user/modify-status"
    }
    if (event.target.value === "decrement-counter") {
      return window.location.href = "/#/user/counter"
    }
    if (event.target.value === "edit-information") {
      return window.location.href = "/#/user/modify-description"
    }
    if (event.target.value === "edit-rightsholder") {
      return window.location.href = "/#/user/modify-rightsholder"
    }
  };
  const classes = useStyles();
  return (
    <div>
      <Card>
        <CardHeader color="info" className="assetHeader">
          <img src={pruftoken} alt="logo" className="assetImage" />
        </CardHeader>
        <CardBody>
          <h4 className={classes.cardTitle}>Name: Bennny's Mongoose</h4>
          <h4 className={classes.cardTitle}>Class: Bicycles(UK)</h4>
          <h4 className={classes.cardTitle}>Status: Transferable</h4>
          <p className={classes.cardCategory}>
            Description: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </p>
          <br />
          <div className={classes.stats}>
            <Danger>
              <Create
                className="functionSelectorIcon" />
            </Danger>
                <FormControl
                  fullWidth
                  className={classes.selectFormControl}
                >
                  <InputLabel
                    // htmlFor="simple-select"
                    // className={classes.selectLabel}
                    className="functionSelector"
                  >
                    Edit Asset
                        </InputLabel>
                  <Select
                    className="functionSelector"
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
                      value="escrow"
                    >
                      Escrow
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
                      value="change-status"
                    >
                      Change Status
                          </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="decrement-counter"
                    >
                      Decrement Counter
                          </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="edit-information"
                    >
                      Edit Information
                          </MenuItem>
                    <MenuItem
                      classes={{
                        root: classes.selectMenuItem,
                        selected: classes.selectMenuItemSelected
                      }}
                      value="edit-rightsholder"
                    >
                      Edit Rightsholder
                          </MenuItem>
                  </Select>
                </FormControl>
          </div>
        </CardBody>
        <CardFooter chart>
          <div className={classes.stats}>
            IDX Hash: 0x6d5ffa25c1f9...1b8be12927
              </div>
          <div className={classes.stats}>
            <Share />
            <Print />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
