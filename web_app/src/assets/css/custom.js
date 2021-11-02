import "./custom.css";
  
  const engravingStyles = (theme) => ({
      engraving: {
          "& .MuiFormLabel-root": {
            color: "black !important",
            fontSize: "20px !important",
            fontWeight: "500",
          },
          "& .MuiInputBase-input": {
            fontSize: "16px !important",
            color: "rgba(0, 0, 0,.65) !important",
          },
      },
  });
  
  export default engravingStyles;