/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

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
  var container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white
  });
  var anchor =
    classes.a +
    cx({
      [" " + classes.whiteColor]: white
    });
  var block = cx({
    [classes.block]: true,
    [classes.whiteColor]: white
  });
  return (
    <footer className={classes.footer}>
      <div className={container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="/#/admin/home" className={block}>
                {rtlActive ? "الصفحة الرئيسية" : "Home"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://pruf.io/" className={block}>
                {rtlActive ? "شركة" : "Company"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://twitter.com/prufteam" className={block}>
                {rtlActive ? "شركة" : "Twitter"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://t.me/pruftalk" className={block}>
                {rtlActive ? "شركة" : "Telegram"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://github.com/Prufio" className={block}>
                {rtlActive ? "شركة" : "Github"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://www.reddit.com/r/PRuF/" className={block}>
                {rtlActive ? "شركة" : "Reddit"}
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="https://discord.com/invite/m4jsh6y" className={block}>
                {rtlActive ? "شركة" : "Discord"}
              </a>
            </ListItem>
          </List>
        </div>
        <p className={classes.right}>
          &copy; {1900 + new Date().getYear()}{" "}
          <a
            href="https://pruf.io/"
            className={anchor}
            target="_blank"
          >
            {rtlActive ? "توقيت الإبداعية" : "PRüF"}
          </a>
          {rtlActive
            ? ", مصنوعة مع الحب لشبكة الإنترنت أفضل"
            : ", made for the people"}
        </p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  fluid: PropTypes.bool,
  white: PropTypes.bool,
  rtlActive: PropTypes.bool
};
