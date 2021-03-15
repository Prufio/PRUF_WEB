import React from "react";
import "../assets/css/custom.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import { MenuBook } from "@material-ui/icons";

const useStyles = makeStyles(styles);

export default function Cookies(props) {

  const classes = useStyles();

  React.useEffect(() => {
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

  const goBack = () => {
    return window.location.href="/#/user/home"
  }

  return (
    <Card>
      <CardHeader icon>
        <CardIcon className="headerIconBack">
          <MenuBook />
        </CardIcon>
        <Button color="info" className="MLBGradient" onClick={() => goBack()}>Go Back</Button>
        <h4 className={classes.cardIconTitle}>Cookies Policy</h4>
      </CardHeader>
      <CardBody>
        <h5>PlaceHolder</h5>
      </CardBody>
    </Card>
  );
}