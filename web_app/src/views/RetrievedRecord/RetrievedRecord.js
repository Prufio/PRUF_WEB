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

export default function RetrievedRecord() {

  // this.state = {
  //   status: undefined
  // }

  const [checkedA, setCheckedA] = React.useState(true);
  const [checkedB, setCheckedB] = React.useState(false);
  const [simpleSelect, setSimpleSelect] = React.useState("");
  // const [multipleSelect, setMultipleSelect] = React.useState([]);
  // const [tags, setTags] = React.useState(["pizza", "pasta", "parmesan"]);
  const handleSimple = event => {
    setSimpleSelect(event.target.value);
  }
  const classes = useStyles();
  return (
    <div>
      <Card>
        <CardHeader color="info" className="DBGradient">
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
          {/* {this.state.status = undefined && ( */}
              <Button color="success">Purchase Item</Button>
              {/* )} */}
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
