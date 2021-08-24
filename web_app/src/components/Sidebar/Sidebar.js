/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import "../../assets/css/custom.css";
import { isMobile, isAndroid } from "react-device-detect";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { NavLink } from "react-router-dom";
import cx from "classnames";

import Blockies from "react-blockies";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Hidden from "@material-ui/core/Hidden";
import Collapse from "@material-ui/core/Collapse";
import Icon from "@material-ui/core/Icon";

// core components
import AdminNavbarLinks from "components/Navbars/userNavbarLinks.js";

import sidebarStyle from "assets/jss/material-dashboard-pro-react/components/sidebarStyle.js";
import pruftoken from "assets/img/pruftoken.png";
import pruftokenblk from "assets/img/Sidebar Backgrounds/pruftokenblk.png";
import { Tooltip } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";

var ps;

const getPrufColor = (type, addr) => {
  let color;
  switch (type) {
    case "primary": {
      if (isNaN(addr.charAt(8))) {
        color = "#005480";
      } else {
        color = "#2b00ff";
      }
      break;
    }

    case "secondary": {
      if (isNaN(addr.charAt(10))) {
        color = "#00a8ff";
      } else {
        color = "#017ec0";
      }
      break;
    }

    case "analogous": {
      if (isNaN(addr.charAt(12))) {
        color = "#00ff55";
      } else {
        color = "#ff1500";
      }
      break;
    }

    default: {
      break;
    }
  }

  return color;
};

// We've created this component so we can have a ref to the wrapper of the links that appears in our sidebar.
// This was necessary so that we could initialize PerfectScrollbar on the links.
// There might be something with the Hidden component from material-ui, and we didn't have access to
// the links, and couldn't initialize the plugin.
class SidebarWrapper extends React.Component {
  sidebarWrapper = React.createRef();
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.sidebarWrapper.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    const { className, bridge, headerLinks, links } = this.props;
    return (
      <div className={className} ref={this.sidebarWrapper}>
        {bridge}
        {headerLinks}
        {links}
      </div>
    );
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copyText: false,
      openAvatar: false,
      miniActive: true,
      ...this.getCollapseStates(props.routes),
    };
  }
  mainPanel = React.createRef();
  // this creates the intial state of this component based on the collapse routes
  // that it gets through this.props.routes
  getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: this.getCollapseInitialState(prop.views),
          ...this.getCollapseStates(prop.views),
          ...initialState,
        };
      }
      return null;
    });
    return initialState;
  };

  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.jsx - route /bridge/regular-forms
  getCollapseInitialState(routes) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute = (routeName) => {
    return window.location.href.indexOf(routeName) > -1 ? "active" : "";
  };
  openCollapse(collapse) {
    var st = {};
    st[collapse] = !this.state[collapse];
    this.setState(st);
  }
  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = (routes) => {
    const { classes, color, rtlActive } = this.props;
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !this.state[prop.state];
        const navLinkClasses =
          classes.itemLink +
          " " +
          cx({
            [" " + classes.collapseActive]: this.getCollapseInitialState(
              prop.views
            ),
          });
        const itemText =
          classes.itemText +
          " " +
          cx({
            [classes.itemTextMini]:
              this.props.miniActive && this.state.miniActive,
            [classes.itemTextMiniRTL]:
              rtlActive && this.props.miniActive && this.state.miniActive,
            [classes.itemTextRTL]: rtlActive,
          });
        const collapseItemText =
          classes.collapseItemText +
          " " +
          cx({
            [classes.collapseItemTextMini]:
              this.props.miniActive && this.state.miniActive,
            [classes.collapseItemTextMiniRTL]:
              rtlActive && this.props.miniActive && this.state.miniActive,
            [classes.collapseItemTextRTL]: rtlActive,
          });
        const itemIcon =
          classes.itemIcon +
          " " +
          cx({
            [classes.itemIconRTL]: rtlActive,
          });
        const caret =
          classes.caret +
          " " +
          cx({
            [classes.caretRTL]: rtlActive,
          });
        const collapseItemMini =
          classes.collapseItemMini +
          " " +
          cx({
            [classes.collapseItemMiniRTL]: rtlActive,
          });
        return (
          <ListItem
            key={key}
            className={cx(
              { [classes.item]: prop.icon !== undefined },
              { [classes.collapseItem]: prop.icon === undefined }
            )}
          >
            <NavLink
              to={"#"}
              className={navLinkClasses}
              onClick={(e) => {
                e.preventDefault();
                this.setState(st);
              }}
            >
              {prop.icon !== undefined ? (
                typeof prop.icon === "string" ? (
                  <Icon className={itemIcon}>{prop.icon}</Icon>
                ) : (
                  <prop.icon className={itemIcon} />
                )
              ) : (
                <span className={collapseItemMini}>
                  {rtlActive ? prop.rtlMini : prop.mini}
                </span>
              )}
              <ListItemText
                primary={rtlActive ? prop.rtlName : prop.name}
                secondary={
                  <b
                    className={
                      caret +
                      " " +
                      (this.state[prop.state] ? classes.caretActive : "")
                    }
                  />
                }
                disableTypography={true}
                className={cx(
                  { [itemText]: prop.icon !== undefined },
                  { [collapseItemText]: prop.icon === undefined }
                )}
              />
            </NavLink>
            <Collapse in={this.state[prop.state]} unmountOnExit>
              <List className={classes.list + " " + classes.collapseList}>
                {this.createLinks(prop.views)}
              </List>
            </Collapse>
          </ListItem>
        );
      }
      const innerNavLinkClasses =
        classes.collapseItemLink +
        " " +
        cx({
          [" " + classes[color]]: this.activeRoute(prop.path),
        });
      const collapseItemMini =
        classes.collapseItemMini +
        " " +
        cx({
          [classes.collapseItemMiniRTL]: rtlActive,
        });
      const navLinkClasses =
        classes.itemLink +
        " " +
        cx({
          [" " + classes[color]]: this.activeRoute(prop.path),
        });
      const itemText =
        classes.itemText +
        " " +
        cx({
          [classes.itemTextMini]:
            this.props.miniActive && this.state.miniActive,
          [classes.itemTextMiniRTL]:
            rtlActive && this.props.miniActive && this.state.miniActive,
          [classes.itemTextRTL]: rtlActive,
        });
      const collapseItemText =
        classes.collapseItemText +
        " " +
        cx({
          [classes.collapseItemTextMini]:
            this.props.miniActive && this.state.miniActive,
          [classes.collapseItemTextMiniRTL]:
            rtlActive && this.props.miniActive && this.state.miniActive,
          [classes.collapseItemTextRTL]: rtlActive,
        });
      const itemIcon =
        classes.itemIcon +
        " " +
        cx({
          [classes.itemIconRTL]: rtlActive,
        });
      return (
        <ListItem
          key={key}
          className={cx(
            { [classes.item]: prop.icon !== undefined },
            { [classes.collapseItem]: prop.icon === undefined }
          )}
        >
          <NavLink
            to={prop.layout + prop.path}
            className={cx(
              { [navLinkClasses]: prop.icon !== undefined },
              { [innerNavLinkClasses]: prop.icon === undefined }
            )}
          >
            {prop.icon !== undefined ? (
              typeof prop.icon === "string" ? (
                <Icon className={itemIcon}>{prop.icon}</Icon>
              ) : (
                <prop.icon className={itemIcon} />
              )
            ) : (
              <span className={collapseItemMini}>
                {rtlActive ? prop.rtlMini : prop.mini}
              </span>
            )}
            <ListItemText
              primary={rtlActive ? prop.rtlName : prop.name}
              disableTypography={true}
              className={cx(
                { [itemText]: prop.icon !== undefined },
                { [collapseItemText]: prop.icon === undefined }
              )}
            />
          </NavLink>
        </ListItem>
      );
    });
  };
  render() {
    const {
      classes,
      logo,
      image,
      logoText,
      routes,
      bgColor,
      addr,
      rtlActive,
    } = this.props;
    const itemText =
      classes.itemText +
      " " +
      cx({
        [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
        [classes.itemTextMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.itemTextRTL]: rtlActive,
      });
    const collapseItemText =
      classes.collapseItemText +
      " " +
      cx({
        [classes.collapseItemTextMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextRTL]: rtlActive,
      });
    const splitWrapperClass =
      classes.bridge +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white",
      });
    const caret =
      classes.caret +
      " " +
      cx({
        [classes.caretRTL]: rtlActive,
      });
    const collapseItemMini =
      classes.collapseItemMini +
      " " +
      cx({
        [classes.collapseItemMiniRTL]: rtlActive,
      });
    const photo =
      classes.photo +
      " " +
      cx({
        [classes.photoRTL]: rtlActive,
      });

    const copyTextSnippet = (temp) => {
      navigator.clipboard.writeText(temp);
      if (isMobile) {
        swal("Address Copied to Clipboard!");
      }
      if (!isMobile) {
        this.setState({ copyText: true });
        setTimeout(() => {
          this.setState({ copyText: false });
        }, 1000);
      }
    };

    var bridge = (
      <div className={logoClasses}>
        {!this.props.miniActive && isAndroid && (
          <>
            {addr === undefined && (
              <img src={pruftoken} alt="logo" className="addressIcon" />
            )}
            {addr === "" && (
              <img src={pruftoken} alt="logo" className="addressIcon" />
            )}

            {isAndroid && addr !== undefined && (
              <CopyToClipboard
                text={addr}
                onCopy={() => {
                  swal(
                    "Address Copied to Clipboard!\n" +
                    addr.substring(0, 8) +
                    "..." +
                    addr.substring(34, 42)
                  );
                }}
              >
              <button className="addressIconButton">
                <Blockies
                  scale={4}
                  color={getPrufColor("primary", addr)}
                  bgColor={getPrufColor("secondary", addr)}
                  spotColor={getPrufColor("analogous", addr)}
                  size={15}
                  seed={addr}
                  className="addressIconAndroid"
                />
              </button>
              </CopyToClipboard>
            )}
          </>
        )}

        {this.props.miniActive && isAndroid && (
          <a>
            {(addr === undefined || addr === "") && (
              <img src={pruftoken} alt="logo" className="addressIcon" />
            )}
            {addr !== undefined && addr !== "" && (
              <CopyToClipboard
                text={addr}
                onCopy={() => {
                  swal(
                    "Address Copied to Clipboard!\n" +
                    addr.substring(0, 8) +
                    "..." +
                    addr.substring(34, 42)
                  );
                }}
              >
              <button className="addressIconButton">
                <Blockies
                  scale={4}
                  color={getPrufColor("primary", addr)}
                  bgColor={getPrufColor("secondary", addr)}
                  spotColor={getPrufColor("analogous", addr)}
                  size={15}
                  seed={addr}
                  className="addressIconAndroid"
                />
              </button>
              </CopyToClipboard>
            )}
          </a>
        )}
        {!isAndroid && (
          <>
            <a className={logoMini}>
              {addr === undefined && (
                <img src={pruftoken} alt="logo" className="addressIcon" />
              )}
              {addr === "" && (
                <img src={pruftoken} alt="logo" className="addressIcon" />
              )}
              {addr !== undefined && addr !== "" && !isMobile && (
                  <Blockies
                    scale={4}
                    color={getPrufColor("primary", addr)}
                    bgColor={getPrufColor("secondary", addr)}
                    spotColor={getPrufColor("analogous", addr)}
                    size={15}
                    seed={addr}
                    className="addressIcon"
                  />
              )}
              {addr !== undefined && addr !== "" && isMobile && (
                <button className="addressIconButton" onClick={() => { copyTextSnippet(addr); }}>
                  <Blockies
                    scale={4}
                    color={getPrufColor("primary", addr)}
                    bgColor={getPrufColor("secondary", addr)}
                    spotColor={getPrufColor("analogous", addr)}
                    size={15}
                    seed={addr}
                    className="addressIconMobile"
                  />
                </button>
              )}
            </a>
            <a className={logoNormal}>
              {!this.props.miniActive && (
                <>
                  {addr !== undefined && !isMobile && (
                    <>
                      {!this.state.copyText && bgColor !== "white" && (
                        <Tooltip title="Copy to Clipboard" arrow>
                          <h5>
                            <button
                              className="addressText"
                              onClick={() => {
                                copyTextSnippet(addr);
                              }}
                            >
                              {addr.substring(0, 8) +
                                "..." +
                                addr.substring(34, 42)}
                            </button>
                          </h5>
                        </Tooltip>
                      )}

                      {this.state.copyText &&
                        (bgColor !== "white" || bgColor === undefined) && (
                          <Tooltip title="Copied to Clipboard" arrow>
                            <h5>
                              <button
                                className="addressText"
                                onClick={() => {
                                  copyTextSnippet(addr);
                                }}
                              >
                                {addr.substring(0, 8) +
                                  "..." +
                                  addr.substring(34, 42)}
                              </button>
                            </h5>
                          </Tooltip>
                        )}

                      {!this.state.copyText && bgColor === "white" && (
                        <Tooltip title="Copy to Clipboard" arrow>
                          <h5>
                            <button
                              className="addressTextBlack"
                              onClick={() => {
                                copyTextSnippet(addr);
                              }}
                            >
                              {addr.substring(0, 8) +
                                "..." +
                                addr.substring(34, 42)}
                            </button>
                          </h5>
                        </Tooltip>
                      )}

                      {this.state.copyText && bgColor === "white" && (
                        <Tooltip title="Copied to Clipboard" arrow>
                          <h5>
                            <button
                              className="addressTextBlack"
                              onClick={() => {
                                copyTextSnippet(addr);
                              }}
                            >
                              {addr.substring(0, 8) +
                                "..." +
                                addr.substring(34, 42)}
                            </button>
                          </h5>
                        </Tooltip>
                      )}
                    </>
                  )}

                  {addr === undefined && bgColor !== "white" && (
                    <h5 className="addressText">User Address Unavailable</h5>
                  )}

                  {addr === undefined && bgColor === "white" && (
                    <h5 className="addressTextBlack">
                      User Address Unavailable
                    </h5>
                  )}
                </>
              )}
              {this.props.miniActive && !isMobile && (
                <>
                  {addr !== undefined && (
                    <>
                      {!this.state.copyText && bgColor !== "white" && (
                        <Tooltip title="Copy to Clipboard" arrow>
                          <h5>
                            <button
                              className="addressText"
                              onClick={() => {
                                copyTextSnippet(addr);
                              }}
                            >
                              {addr.substring(0, 8) +
                                "..." +
                                addr.substring(34, 42)}
                            </button>
                          </h5>
                        </Tooltip>
                      )}

                      {this.state.copyText &&
                        (bgColor !== "white" || bgColor === undefined) && (
                          <Tooltip title="Copied to Clipboard" arrow>
                            <h5>
                              <button
                                className="addressText"
                                onClick={() => {
                                  copyTextSnippet(addr);
                                }}
                              >
                                {addr.substring(0, 8) +
                                  "..." +
                                  addr.substring(34, 42)}
                              </button>
                            </h5>
                          </Tooltip>
                        )}

                      {!this.state.copyText && bgColor === "white" && (
                        <Tooltip title="Copy to Clipboard" arrow>
                          <h5>
                            <button
                              className="addressTextBlack"
                              onClick={() => {
                                copyTextSnippet(addr);
                              }}
                            >
                              {addr.substring(0, 8) +
                                "..." +
                                addr.substring(34, 42)}
                            </button>
                          </h5>
                        </Tooltip>
                      )}

                      {this.state.copyText && bgColor === "white" && (
                        <Tooltip title="Copied to Clipboard" arrow>
                          <h5>
                            <button
                              className="addressTextBlack"
                              onClick={() => {
                                copyTextSnippet(addr);
                              }}
                            >
                              {addr.substring(0, 8) +
                                "..." +
                                addr.substring(34, 42)}
                            </button>
                          </h5>
                        </Tooltip>
                      )}
                    </>
                  )}

                  {addr !== undefined && isAndroid && (
                    <CopyToClipboard
                      text={addr}
                      onCopy={() => {
                        swal(
                          "Address Copied to Clipboard!\n" +
                          addr.substring(0, 8) +
                          "..." +
                          addr.substring(34, 42)
                        );
                      }}
                    >
                    <button className="addressIconButton">
                      <Blockies
                        scale={4}
                        color={getPrufColor("primary", addr)}
                        bgColor={getPrufColor("secondary", addr)}
                        spotColor={getPrufColor("analogous", addr)}
                        size={15}
                        seed={addr}
                        className="addressIconAndroid"
                      />
                    </button>
                    </CopyToClipboard>
                  )}

                  {addr === undefined && bgColor !== "white" && (
                    <h5 className="addressText">User Address Unavailable</h5>
                  )}

                  {addr === undefined && bgColor === "white" && (
                    <h5 className="addressTextBlack">
                      User Address Unavailable
                    </h5>
                  )}
                </>
              )}
            </a>
          </>
        )}
      </div>
    );

    var links = (
      <List className={classes.list}>{this.createLinks(routes)}</List>
    );

    const logoNormal =
      classes.logoNormal +
      " " +
      cx({
        [classes.logoNormalSidebarMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.logoNormalSidebarMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.logoNormalRTL]: rtlActive,
      });
    const logoMini =
      classes.logoMini +
      " " +
      cx({
        [classes.logoMiniRTL]: rtlActive,
      });
    const logoClasses =
      classes.logo +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white",
      });
    var brand = (
      <div className={logoClasses}>
        <a href="/#/stake" className={logoMini}>
          {bgColor !== "white" && (
            <img src={pruftoken} alt="logo" className={classes.img} />
          )}
          {bgColor === "white" && (
            <img src={pruftokenblk} alt="logo" className={classes.img} />
          )}
        </a>
        <a href="/#/stake" className={logoNormal}>
          PRüF DASHBOARD
        </a>
      </div>
    );
    const drawerPaper =
      classes.drawerPaper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.drawerPaperRTL]: rtlActive,
      });
    const sidebarWrapper =
      classes.sidebarWrapper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.sidebarWrapperWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1,
      });
    return (
      <div ref={this.mainPanel}>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={rtlActive ? "left" : "right"}
            open={this.props.open}
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"],
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              bridge={bridge}
              headerLinks={<AdminNavbarLinks rtlActive={rtlActive} />}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            anchor={rtlActive ? "right" : "left"}
            variant="permanent"
            open
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"],
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              bridge={bridge}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  bgColor: "blue",
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  bgColor: PropTypes.oneOf(["white", "black", "blue", "darkBlue"]),
  rtlActive: PropTypes.bool,
  color: PropTypes.oneOf([
    "white",
    "red",
    "orange",
    "green",
    "blue",
    "purple",
    "rose",
  ]),
  logo: PropTypes.object,
  logoText: PropTypes.string,
  image: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  miniActive: PropTypes.bool,
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
};

SidebarWrapper.propTypes = {
  className: PropTypes.string,
  bridge: PropTypes.object,
  headerLinks: PropTypes.object,
  links: PropTypes.object,
};

export default withStyles(sidebarStyle)(Sidebar);
