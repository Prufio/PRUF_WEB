import React from "react";
import PropTypes from "prop-types";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import RecordVoiceOver from "@material-ui/icons/RecordVoiceOver";
import Email from "@material-ui/icons/Email";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// core components
import NavPills from "components/NavPills/NavPills.js";
import { AssignmentTurnedIn, Security, VerifiedUser, VpnKey } from "@material-ui/icons";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  inputAdornment: {
    position: "relative"
  }
};

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      firstnameState: "",
      lastname: "",
      lastnameState: "",
      email: "",
      emailState: ""
    };
  }
  sendState() {
    return this.state;
  }
  // function that returns true if value is email, false otherwise
  // function that verifies if a string has a given length or not
  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={12} lg={10}>
          <NavPills
            color="rose"
            horizontal={{
              tabsGrid: { xs: 12, sm: 12, md: 4 },
              contentGrid: { xs: 12, sm: 12, md: 8 }
            }}
            tabs={[
              {
                tabButton: "Restrictive",
                tabIcon: VpnKey,
                tabContent: (
                  <span>
                    <p>
                      Collaboratively administrate empowered markets via
                      plug-and-play networks. Dynamically procrastinate B2C
                      users after installed base benefits.
                    </p>
                    <br />
                    <p>
                      Dramatically visualize customer directed convergence
                      without revolutionary ROI. Collaboratively
                      administrate empowered markets via plug-and-play
                      networks. Dynamically procrastinate B2C users after
                      installed base benefits.
                    </p>
                    <br />
                    <p>
                      Dramatically visualize customer directed convergence
                      without revolutionary ROI. Collaboratively
                      administrate empowered markets via plug-and-play
                      networks. Dynamically procrastinate B2C users after
                      installed base benefits.
                    </p>
                  </span>
                )
              },
              {
                tabButton: "Permissive",
                tabIcon: Security,
                tabContent: (
                  <span>
                    <p>
                      Efficiently unleash cross-media information without
                      cross-media value. Quickly maximize timely
                      deliverables for real-time schemas.
                    </p>
                    <br />
                    <p>
                      Dramatically maintain clicks-and-mortar solutions
                      without functional solutions. Dramatically visualize
                      customer directed convergence without revolutionary
                      ROI. Collaboratively administrate empowered markets
                      via plug-and-play networks. Dynamically procrastinate
                      B2C users after installed base benefits.
                    </p>
                  </span>
                )
              },
              {
                tabButton: "Authorized",
                tabIcon: AssignmentTurnedIn,
                tabContent: (
                  <span>
                    <p>
                      Efficiently unleash cross-media information without
                      cross-media value. Quickly maximize timely
                      deliverables for real-time schemas.
                    </p>
                    <br />
                    <p>
                      Dramatically maintain clicks-and-mortar solutions
                      without functional solutions. Dramatically visualize
                      customer directed convergence without revolutionary
                      ROI. Collaboratively administrate empowered markets
                      via plug-and-play networks. Dynamically procrastinate
                      B2C users after installed base benefits.
                    </p>
                  </span>
                )
              },
              {
                tabButton: "Trusted",
                tabIcon: VerifiedUser,
                tabContent: (
                  <span>
                    <p>
                      Efficiently unleash cross-media information without
                      cross-media value. Quickly maximize timely
                      deliverables for real-time schemas.
                    </p>
                    <br />
                    <p>
                      Dramatically maintain clicks-and-mortar solutions
                      without functional solutions. Dramatically visualize
                      customer directed convergence without revolutionary
                      ROI. Collaboratively administrate empowered markets
                      via plug-and-play networks. Dynamically procrastinate
                      B2C users after installed base benefits.
                    </p>
                  </span>
                )
              }
            ]}
          />
        </GridItem>
      </GridContainer>
    );
  }
}

Step1.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(Step1);
