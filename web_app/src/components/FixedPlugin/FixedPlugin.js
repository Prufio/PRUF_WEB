/*eslint-disable*/
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
// nodejs library to set properties for components
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

import styles from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";

import imagine1 from "assets/img/sidebar-1.jpg";
import imagine2 from "assets/img/sidebar-2.jpg";
import imagine3 from "assets/img/sidebar-3.jpg";
import imagine4 from "assets/img/sidebar-4.jpg";

import Button from "components/CustomButtons/Button.js";

const useStyles = makeStyles(styles);

export default function FixedPlugin(props) {
  const [classes, setClasses] = React.useState("dropdown show");
  const [bg_checked, setBg_checked] = React.useState(true);
  const [bgImage, setBgImage] = React.useState(props.bgImage);
  const [showImage, setShowImage] = React.useState(true);
  const handleClick = () => {
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
  const classesObj = useStyles();
  return (
    <div
      className={"fixed-plugin" + (props.rtlActive ? " fixed-plugin-rtl" : "")}
    >
      <div id="fixedPluginClasses" className={props.fixedClasses}>
        <div onClick={handleClick}>
          <i className="fa fa-cog fa-2x" />
        </div>
        <ul className="dropdown-menu">
          <li className="header-title">SIDEBAR BACKGROUND</li>
          <li className="adjustments-line">
            <a className="switch-trigger active-color">
              <div className="badge-colors text-center">
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
              </div>
              <div className="clearfix" />
            </a>
          </li>
          <li className="adjustments-line">
            <a className="switch-trigger">
              <p className="switch-label">Sidebar Mini</p>
              <Switch
                checked={props.miniActive}
                onChange={handleChange("miniActive")}
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
          <li className={bgImage === imagine1 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setShowImage(true);
                setBgImage(imagine1);
                props.handleImageClick(imagine1);
              }}
            >
              <img src={imagine1} alt="..." />
            </a>
          </li>
          <li className={bgImage === imagine2 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setShowImage(true);
                setBgImage(imagine2);
                props.handleImageClick(imagine2);
              }}
            >
              <img src={imagine2} alt="..." />
            </a>
          </li>
          <li className={bgImage === imagine3 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setShowImage(true);
                setBgImage(imagine3);
                props.handleImageClick(imagine3);
              }}
            >
              <img src={imagine3} alt="..." />
            </a>
          </li>
          <li className={bgImage === imagine4 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setShowImage(true);
                setBgImage(imagine4);
                props.handleImageClick(imagine4);
              }}
            >
              <img src={imagine4} alt="..." />
            </a>
          </li>
        </ul>
      </div>
    </div>
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
