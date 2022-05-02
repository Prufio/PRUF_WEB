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
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-pro-react/components/footerStyle.js";
import buttonStyles from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.js";

const useStyles = makeStyles(styles);
const useButtonStyles = makeStyles(buttonStyles);

export default function Footer(props) {
  const classes = useStyles();
  const buttonClasses = useButtonStyles();
  const { fluid, white, rtlActive } = props;
  const [counter, setCounter] = React.useState(0);

  const copy = () => {
    document.body.style.cursor = "help";
    swalReact({
      content: (
        <>
          <button
            onClick={() => {
              setCounter(1);
            }}
          >
            <span className="bug">&#128128;</span>
          </button>
        </>
      ),
      buttons: "Close",
    });
  };

  const copy2 = () => {
    document.body.style.cursor = "auto";
    window.location.href = "/#/user/counter";
    setCounter(0);
  };

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
              {/* <a href="https://pruf.io/" className="links" target="_blank">
                {rtlActive ? "شركة" : "Company"}
              </a> */}
              <Button simple href="https://pruf.io/" target="_blank">
                <i
                  className={
                    classes.socialButtonsIcons +
                    " " +
                    classes.marginRight +
                    " fab fa-grav"
                  }
                />{" "}
                Website
              </Button>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Button
                color="twitter"
                simple
                href="https://twitter.com/prufteam"
                target="_blank"
              >
                <i
                  className={
                    classes.socialButtonsIcons +
                    " " +
                    classes.marginRight +
                    " fab fa-twitter"
                  }
                />{" "}
                Twitter
              </Button>
              {/* <a href="https://twitter.com/prufteam" className="links" target="_blank">
                {rtlActive ? "شركة" : "Twitter"}
              </a> */}
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              {/* <a href="https://github.com/Prufio" className="links" target="_blank">
                {rtlActive ? "شركة" : "Github"}
              </a> */}
              <Button simple href="https://github.com/Prufio" target="_blank">
                <i
                  className={
                    classes.socialButtonsIcons +
                    " " +
                    classes.marginRight +
                    " fab fa-github"
                  }
                />{" "}
                Github
              </Button>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <Button
                color="twitter"
                simple
                href="https://t.me/pruftalk"
                target="_blank"
              >
                <i
                  className={
                    classes.socialButtonsIcons +
                    " " +
                    classes.marginRight +
                    " fab fa-telegram"
                  }
                />{" "}
                Telegram
              </Button>
              {/* <a href="https://t.me/pruftalk" className="links" target="_blank">
                {rtlActive ? "شركة" : "Telegram"}
              </a> */}
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              {/* <a href="https://discord.com/invite/m4jsh6y" className="links" target="_blank">
                {rtlActive ? "شركة" : "Discord"}
              </a> */}
              <Button
                simple
                href="https://discord.com/invite/m4jsh6y"
                target="_blank"
              >
                <i
                  className={
                    classes.socialButtonsIcons +
                    " " +
                    classes.marginRight +
                    " fab fa-discord"
                  }
                />{" "}
                Discord
              </Button>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              {/* <a href="https://www.reddit.com/r/PRuF/" className="links" target="_blank">
                {rtlActive ? "شركة" : "Reddit"}
              </a> */}
              <Button
                color="reddit"
                simple
                href="https://www.reddit.com/r/PRuF/"
                target="_blank"
              >
                <i
                  className={
                    classes.socialButtonsIcons +
                    " " +
                    classes.marginRight +
                    " fab fa-reddit"
                  }
                />{" "}
                Reddit
              </Button>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              {isMobile && (
                <p className={classes.rightLogo}>
                  &copy;
                  {1900 + new Date().getYear()}
                  <a
                    href="https://pruf.io/"
                    className="lightBlue"
                    target="_blank"
                  >
                    PRüF
                  </a>
                </p>
              )}
              {!isMobile && (
                <p className="black">
                  <button
                    className="clearButton"
                    onClick={() => {
                      copy();
                    }}
                  >
                    &copy;
                  </button>
                  {counter === 0 && <>{1900 + new Date().getYear()}</>}
                  {counter === 1 && (
                    <button
                      onClick={() => {
                        swalReact({
                          content: (
                            <button
                              onClick={() => {
                                setCounter(2);
                              }}
                            >
                              <span className="bug">&#128125;</span>
                            </button>
                          ),
                          buttons: "Close",
                        });
                      }}
                      className="clearButton"
                    >
                      2021
                    </button>
                  )}
                  {counter === 2 && <>{1900 + new Date().getYear()}</>}
                  {counter === 0 && (
                    <button
                      href="https://pruf.io/"
                      className="clearButton"
                      target="_blank"
                    >
                      PRüF
                    </button>
                  )}
                  {counter === 1 && (
                    <button
                      href="https://pruf.io/"
                      className="clearButton"
                      target="_blank"
                    >
                      PRüF
                    </button>
                  )}
                  {counter === 2 && (
                    <button
                      onClick={() => {
                        copy2();
                      }}
                      className="clearButtonRed"
                    >
                      PRüF
                    </button>
                  )}
                </p>
              )}
            </ListItem>
          </List>
        </div>
        {/* {isMobile && (
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
              onClick={() => { copy() }}>
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
        )} */}
      </div>
    </footer>
  );
}

Footer.propTypes = {
  fluid: PropTypes.bool,
  white: PropTypes.bool,
  rtlActive: PropTypes.bool,
};
