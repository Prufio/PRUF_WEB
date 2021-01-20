import React from "react";
import "../../assets/css/custom.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Contacts from "@material-ui/icons/Contacts";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import Category from "@material-ui/icons/Category";
import AccountBox from "@material-ui/icons/AccountBox";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardText from "components/Card/CardText.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

export default function Verify() {
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
    <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info" className="DBGradient">
              <Category />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Asset Information</h4>
          </CardHeader>
          <CardBody>
            <form>
              <CustomInput
                labelText="Manufacturer"
                id="manufacturer"
                formControlProps={{
                  fullWidth: true
                }}
                // inputProps={{
                  // type: "email"
                // }}
              />
              <CustomInput
                labelText="Type"
                id="type"
                formControlProps={{
                  fullWidth: true
                }}
                // inputProps={{
                //   type: "password",
                //   autoComplete: "off"
                // }}
              />
              <CustomInput
                labelText="Model"
                id="model"
                formControlProps={{
                  fullWidth: true
                }}
                // inputProps={{
                  // type: "email"
                // }}
              />
              <CustomInput
                labelText="Serial"
                id="serial"
                formControlProps={{
                  fullWidth: true
                }}
                // inputProps={{
                //   type: "password",
                //   autoComplete: "off"
                // }}
              />
              <div className={classes.checkboxAndRadio}>
                <FormControlLabel
                  control={
                    <Checkbox
                      tabIndex={-1}
                      onClick={() => handleToggle(2)}
                      checkedIcon={<Check className={classes.checkedIcon} />}
                      icon={<Check className={classes.uncheckedIcon} />}
                      classes={{
                        checked: classes.checked,
                        root: classes.checkRoot
                      }}
                    />
                  }
                  classes={{
                    label: classes.label,
                    root: classes.labelRoot
                  }}
                  label="Input IDX Hash"
                />
              </div>
              <Button color="info" className="MLBGradient">Scan QR</Button>
            </form>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader color="info" icon>
            <CardIcon color="info" className="DBGradient">
              <AccountBox />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Owner Information</h4>
          </CardHeader>
          <CardBody>
            <form>
              <CustomInput
                labelText="First Name"
                id="first-name"
                formControlProps={{
                  fullWidth: true
                }}
                // inputProps={{
                  // type: "email"
                // }}
              />
              <CustomInput
                labelText="Middle Name"
                id="middle-name"
                formControlProps={{
                  fullWidth: true
                }}
                // inputProps={{
                //   type: "password",
                //   autoComplete: "off"
                // }}
              />
              <CustomInput
                labelText="Last Name"
                id="last-name"
                formControlProps={{
                  fullWidth: true
                }}
                // inputProps={{
                  // type: "email"
                // }}
              />
              <CustomInput
                labelText="ID Number"
                id="id-number"
                formControlProps={{
                  fullWidth: true
                }}
                // inputProps={{
                //   type: "password",
                //   autoComplete: "off"
                // }}
              />
              <CustomInput
                labelText="Password"
                id="password"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "password",
                  autoComplete: "off"
                }}
              />
              <Button color="info" className="MLBGradient">Verify</Button>
              <Button color="info" className="MLBGradient">Blockchain Verify</Button>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
