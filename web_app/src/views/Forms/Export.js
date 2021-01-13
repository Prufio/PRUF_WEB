import React from "react";
import "../../assets/css/custom.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Warning from "components/Typography/Warning.js";
import Danger from "components/Typography/Danger.js";


// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardText from "components/Card/CardText.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { DeleteOutline, FlightTakeoff } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function Export() {
  const [checked, setChecked] = React.useState([24, 22]);
  const [selectedEnabled, setSelectedEnabled] = React.useState("b");
  const [selectedValue, setSelectedValue] = React.useState(null);
  const handleChange = event => {
    setSelectedValue(event.target.value);
  };
  const handleChangeEnabled = event => {
    setSelectedEnabled(event.target.value);
  };
  const handleToggle = value => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  const classes = useStyles();
  return (
    <Card>
      <CardHeader color="info" icon>
        <CardIcon color="info">
          <FlightTakeoff />
        </CardIcon>
        <h3 className={classes.cardIconTitle}>Export Asset</h3>
      </CardHeader>
      <CardBody>
        <form>
          <h4>Asset Selected: </h4>
          <Danger><h4>Disclaimer:</h4></Danger>
          <h5> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</h5>
          <Button color="info">Export Asset</Button>
        </form>
      </CardBody>
    </Card>
  );
}
