const hoverCardStyle = {
  cardHover: {
    "&:hover": {
      "& $cardHeaderHover": {
        transform: "translate3d(0, -10px, 0)"
      },
      "& $cardHeaderHoverDashboard": {
        transform: "translate3d(0, -10px, 0)"
      }
    }
  },
  cardHeaderHover: {
    transition: "all 300ms cubic-bezier(0.34, 1.61, 0.7, 1)",
  },
  cardHeaderHoverDashboard: {
    transition: "all 300ms cubic-bezier(0.34, 1.61, 0.7, 1)",
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
