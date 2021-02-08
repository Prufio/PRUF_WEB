/*eslint-disable*/
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
// nodejs library to set properties for components
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import { ClickAwayListener } from '@material-ui/core';

import styles from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";

import BloomWB from "assets/img/Sidebar Backgrounds/BloomWB.jpg";
import BloomBW from "assets/img/Sidebar Backgrounds/BloomBW.jpg";
import TracesWB from "assets/img/Sidebar Backgrounds/TracesWB.jpg";
import TracesBW from "assets/img/Sidebar Backgrounds/TracesBW.jpg";
import PRUFMatrix from "assets/img/Sidebar Backgrounds/PRUFMatrix.jpg";
import Space from "assets/img/Sidebar Backgrounds/PrufSpace.jpg";

import Button from "components/CustomButtons/Button.js";
import { Icon } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function FixedPlugin(props) {
  const [classes, setClasses] = React.useState("dropdown show");
  const [bg_checked, setBg_checked] = React.useState(true);
  const [bgImage, setBgImage] = React.useState(props.bgImage);
  const [showImage, setShowImage] = React.useState(true);
  const [showPlugin, setShowPlugin] = React.useState(false);
  const handleClick = () => {
    setShowPlugin(true)
    props.handleFixedClick();
  };
  const handleChange = name => event => {
    switch (name) {
      case "miniActive":
        props.sidebarMinimize();
        break;
      case "image":
        if (event.target.checked) {
          props.handleImageClick(bgImage);
        } else {
          props.handleImageClick();
        }
        setShowImage(event.target.checked);
        break;
      default:
        break;
    }
  };

  const handleClickAway = () => {
    setShowPlugin(false)
  }
  const classesObj = useStyles();
  return (

    <ClickAwayListener onClickAway={handleClickAway}>
      <div
        className={"fixed-plugin" + (props.rtlActive ? " fixed-plugin-rtl" : "")}
      >
        <div id="fixedPluginClasses" className={props.fixedClasses}>
          <div onClick={handleClick}>
            {/* <i className="fa fa-cog fa-2x" /> */}
            <Icon className="fixedPlugin">
              {/* <span class="material-icons"> */}
            tune
            {/* </span> */}
            </Icon>
          </div>
          {showPlugin === true && (
            <ul className="dropdown-menu">
              <li className="header-title">SIDEBAR BACKGROUND</li>
              <li className="adjustments-line">
                <a className="switch-trigger active-color">
                  <div className="badge-colors text-center">
                    {bgImage === TracesBW && (
                      <span
                        className={
                          props.bgColor === "black"
                            ? "badge filter badge-black active"
                            : "badge filter badge-black"
                        }
                        data-color="orange"
                        onClick={() => {
                          props.handleBgColorClick("black");
                          props.handleImageClick(TracesWB);
                          setBgImage(TracesWB);
                        }}
                      />
                    )}
                    {bgImage === BloomBW && (
                      <span
                        className={
                          props.bgColor === "black"
                            ? "badge filter badge-black active"
                            : "badge filter badge-black"
                        }
                        data-color="orange"
                        onClick={() => {
                          props.handleBgColorClick("black");
                          props.handleImageClick(BloomWB);
                          setBgImage(BloomWB);
                        }}
                      />
                    )}
                    {bgImage !== BloomBW && bgImage !== TracesBW && (
                      <span
                        className={
                          props.bgColor === "black"
                            ? "badge filter badge-black active"
                            : "badge filter badge-black"
                        }
                        data-color="orange"
                        onClick={() => {
                          props.handleBgColorClick("black");
                        }}
                      />
                    )}
                    {bgImage === BloomWB && (
                      <span
                        className={
                          props.bgColor === "white"
                            ? "badge filter badge-white active"
                            : "badge filter badge-white"
                        }
                        data-color="orange"
                        onClick={() => {
                          props.handleBgColorClick("white");
                          props.handleImageClick(BloomBW);
                          setBgImage(BloomBW);
                        }}
                      />
                    )}
                    {bgImage === TracesWB && (
                      <span
                        className={
                          props.bgColor === "white"
                            ? "badge filter badge-white active"
                            : "badge filter badge-white"
                        }
                        data-color="orange"
                        onClick={() => {
                          props.handleBgColorClick("white");
                          props.handleImageClick(TracesBW);
                          setBgImage(TracesBW);
                        }}
                      />
                    )}
                    {bgImage !== TracesWB && bgImage !== BloomWB && (
                      <span
                        className={
                          props.bgColor === "white"
                            ? "badge filter badge-white active"
                            : "badge filter badge-white"
                        }
                        data-color="orange"
                        onClick={() => {
                          props.handleBgColorClick("white");
                        }}
                      />
                    )}
                    {bgImage === TracesBW && (
                      <span
                        className={
                          props.bgColor === "darkBlue"
                            ? "badge filter badge-darkBlue active"
                            : "badge filter badge-darkBlue"
                        }
                        data-color="orange"
                        onClick={() => {
                          props.handleBgColorClick("darkBlue");
                          props.handleImageClick(TracesWB);
                          setBgImage(TracesWB);
                        }}
                      />
                    )}
                    {bgImage === BloomBW && (
                      <span
                        className={
                          props.bgColor === "darkBlue"
                            ? "badge filter badge-darkBlue active"
                            : "badge filter badge-darkBlue"
                        }
                        data-color="orange"
                        onClick={() => {
                          props.handleBgColorClick("darkBlue");
                          props.handleImageClick(BloomWB);
                          setBgImage(BloomWB);
                        }}
                      />
                    )}
                    {bgImage !== BloomBW && bgImage !== TracesBW && (
                      <span
                        className={
                          props.bgColor === "darkBlue"
                            ? "badge filter badge-darkBlue active"
                            : "badge filter badge-darkBlue"
                        }
                        data-color="orange"
                        onClick={() => {
                          props.handleBgColorClick("darkBlue");
                        }}
                      />
                    )}
                  </div>
                  <div className="clearfix" />
                </a>
              </li>
              <li className="adjustments-line">
                <a className="switch-trigger">
                  <p className="switch-label">Sidebar Image</p>
                  <Switch
                    checked={showImage}
                    onChange={handleChange("image")}
                    value="sidebarMini"
                    classes={{
                      switchBase: classesObj.switchBase,
                      checked: classesObj.switchChecked,
                      thumb: classesObj.switchIcon,
                      track: classesObj.switchBar
                    }}
                  />
                  <div className="clearfix" />
                </a>
              </li>
              <li className="header-title">Sidebar Backgrounds</li>
              <li className={bgImage === BloomWB ? "active" : ""}>
                {props.bgColor !== "white" && (
                  <a
                    className="img-holder switch-trigger"
                    onClick={() => {
                      setShowImage(true);
                      setBgImage(BloomWB);
                      props.handleImageClick(BloomWB);
                    }}
                  >
                    <img src={BloomWB} alt="..." />
                  </a>
                )}
                {props.bgColor === "white" && (
                  <a
                    className="img-holder switch-trigger"
                    onClick={() => {
                      setShowImage(true);
                      setBgImage(BloomBW);
                      props.handleImageClick(BloomBW);
                    }}
                  >
                    <img src={BloomBW} alt="..." />
                  </a>
                )}
              </li>
              <li className={bgImage === TracesWB ? "active" : ""}>
                {props.bgColor !== "white" && (
                  <a
                    className="img-holder switch-trigger"
                    onClick={() => {
                      setShowImage(true);
                      setBgImage(TracesWB);
                      props.handleImageClick(TracesWB);
                    }}
                  >
                    <img src={TracesWB} alt="..." />
                  </a>
                )}
                {props.bgColor === "white" && (
                  <a
                    className="img-holder switch-trigger"
                    onClick={() => {
                      setShowImage(true);
                      setBgImage(TracesBW);
                      props.handleImageClick(TracesBW);
                    }}
                  >
                    <img src={TracesBW} alt="..." />
                  </a>
                )}
              </li>
              <li className={bgImage === PRUFMatrix ? "active" : ""}>
                <a
                  className="img-holder switch-trigger"
                  onClick={() => {
                    setShowImage(true);
                    setBgImage(PRUFMatrix);
                    props.handleImageClick(PRUFMatrix);
                  }}
                >
                  <img src={PRUFMatrix} alt="..." />
                </a>
              </li>
              <li className={bgImage === Space ? "active" : ""}>
                <a
                  className="img-holder switch-trigger"
                  onClick={() => {
                    setShowImage(true);
                    setBgImage(Space);
                    props.handleImageClick(Space);
                  }}
                >
                  <img src={Space} alt="..." />
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </ClickAwayListener>
  );
}

FixedPlugin.propTypes = {
  bgImage: PropTypes.string,
  handleFixedClick: PropTypes.func,
  miniActive: PropTypes.bool,
  fixedClasses: PropTypes.string,
  bgColor: PropTypes.oneOf(["white", "black", "darkBlue"]),
  color: PropTypes.oneOf([
    "white",
    "red",
    "orange",
    "green",
    "blue",
    "purple",
    "rose",
    "darkBlue"
  ]),
  handleBgColorClick: PropTypes.func,
  handleColorClick: PropTypes.func,
  handleImageClick: PropTypes.func,
  sidebarMinimize: PropTypes.func,
  rtlActive: PropTypes.bool
};
