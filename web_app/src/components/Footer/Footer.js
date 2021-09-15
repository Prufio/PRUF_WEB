/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import "../../assets/css/custom.css";
import swalReact from "@sweetalert/with-react";
import { isMobile } from "react-device-detect";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import Contacts from "@material-ui/icons/Contacts";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";

import styles from "assets/jss/material-dashboard-pro-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { fluid, white, rtlActive } = props;
  const [counter, setCounter] = React.useState(0);

  const copy = () => {
    document.body.style.cursor = 'help'
    swalReact({
      content: (
        <>
          <button onClick={() => { setCounter(1) }}><span className="bug">&#128128;</span></button>
        </>
      ),
      buttons: "Close",
    })
  }

  const copy2 = () => {
    document.body.style.cursor = 'auto'
    window.location.href = "/#/stake/counter"
    setCounter(0)
  }


  var container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white,
  });
  var anchor =
    classes.a +
    cx({
      [" " + classes.whiteColor]: white,
    });
  var block = cx({
    [classes.block]: true,
    [classes.whiteColor]: white,
  });

  return (
    <footer className={classes.footer}>
      <div className={container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="https://pruf.io/" className="splitterLinks" target="_blank">
                {rtlActive ? "شركة" : "Company"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://twitter.com/prufteam" className="splitterLinks" target="_blank">
                {rtlActive ? "شركة" : "Twitter"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://t.me/pruftalk" className="splitterLinks" target="_blank">
                {rtlActive ? "شركة" : "Telegram"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://github.com/Prufio" className="splitterLinks" target="_blank">
                {rtlActive ? "شركة" : "Github"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://www.reddit.com/r/PRuF/" className="splitterLinks" target="_blank">
                {rtlActive ? "شركة" : "Reddit"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://discord.com/invite/m4jsh6y" className="splitterLinks" target="_blank">
                {rtlActive ? "شركة" : "Discord"}
              </a>
            </ListItem>
          </List>
        </div>
        {isMobile && (
          <p className={classes.right}>
            &copy;
            {1900 + new Date().getYear()
            }
            {" "}
            <a href="https://pruf.io/" className="lightBlue" target="_blank">
              PRüF
            </a>
          </p>
        )}
        {!isMobile && (
          <p className={classes.right}>
            <button
              className="clearButton"
              >
              &copy;
                      </button>
            {counter === 0 && (
              <>
                {1900 + new Date().getYear()
                }
                {" "}
              </>
            )}
            {counter === 1 && (
              <button onClick={() => {
                swalReact({
                  content: (
                    <button onClick={() => { setCounter(2) }}><span className="bug">&#128125;</span></button>
                  ),
                  buttons: "Close",
                })
              }} className="clearButton">2021</button>
            )}
            {counter === 2 && (
              <>
                {1900 + new Date().getYear()
                }
                {" "}
              </>
            )}
            {counter === 0 && (
              <a href="https://pruf.io/" className="lightBlue" target="_blank">
                PRüF
              </a>
            )}
            {counter === 1 && (
              <a href="https://pruf.io/" className="lightBlue" target="_blank">
                PRüF
              </a>
            )}
            {counter === 2 && (
              <button onClick={() => { copy2() }} className="clearButtonRed">
                PRüF
              </button>
            )}
          </p>
        )}
      </div>
    </footer>
  );
}

Footer.propTypes = {
  fluid: PropTypes.bool,
  white: PropTypes.bool,
  rtlActive: PropTypes.bool,
};
