import { colors } from "@material-ui/core";
import {
  drawerWidth,
  drawerMiniWidth,
  transition,
  containerFluid,
} from "assets/jss/material-dashboard-pro-react.js";

const appStyle = (theme) => ({
  wrapper: {
    position: "relative",
    top: "0",
    height: "100vh",
    "&:after": {
      display: "table",
      clear: "both",
      content: '" "',
    },
  },
  mainPanel: {
    transitionProperty: "top, bottom, width",
    transitionDuration: ".2s, .2s, .35s",
    transitionTimingFunction: "linear, linear, ease",
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    overflow: "auto",
    position: "relative",
    float: "right",
    ...transition,
    maxHeight: "100%",
    width: "100%",
    overflowScrolling: "touch",
  },
  content: {
    marginTop: "40px",
    padding: "30px 15px",
    minHeight: "calc(100vh - 123px)",
  },
  container: { ...containerFluid },
  map: {
    marginTop: "70px",
  },
  mainPanelSidebarMini: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerMiniWidth}px)`,
    },
  },
  mainPanelWithPerfectScrollbar: {
    overflow: "hidden !important",
  },
  toolTip: {
    backgroundColor: "transparent !important;",
    color: "black !important"
  }
});

export default appStyle;
