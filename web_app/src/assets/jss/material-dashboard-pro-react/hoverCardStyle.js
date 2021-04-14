const hoverCardStyle = {
  cardHover: {
    "&:hover": {
      "& $cardHeaderHover": {
        transform: "translate3d(0, -50px, 0)",
        cursor: "pointer",
      },
      "& $cardHeaderHoverDashboard": {
        transform: "translate3d(0, -10px, 0)",
        cursor: "pointer",
      },
      "& $cardHeaderHoverJdenticon": {
        transform: "translate3d(0, -10px, 0)",
        cursor: "pointer",
      }
    }
  },
  cardHeaderHover: {
    transition: "all 300ms cubic-bezier(0.34, 1.61, 0.7, 1)",
  },
  cardHeaderHoverDashboard: {
    transition: "all 300ms cubic-bezier(0.34, 1.61, 0.7, 1)",
    width: "calc(100% - 30px)",
  },
  cardHeaderHoverJdenticon: {
    transition: "all 300ms cubic-bezier(0.34, 1.61, 0.7, 1)",
    width: "100% !important",
    height: "100% !important",
    boxShadow: "0 10px 30px -12px rgb(0 0 0 / 42%), 0 4px 25px 0px rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(0 0 0 / 20%) !important",
    background: "transparent !important",
    border: "none !important",
  },
  cardHeaderHoverCustom: {
    transition: "all 300ms cubic-bezier(0.34, 1.61, 0.7, 1)",
    width: "calc(50% - 30px)",
  },
  cardHoverUnder: {
    position: "absolute",
    zIndex: "1",
    top: "-50px",
    width: "calc(100% - 30px)",
    left: "17px",
    right: "17px",
    textAlign: "center"
  }
};

export default hoverCardStyle;
