import { TextareaAutosize } from "@mui/base";
import { makeStyles } from "@mui/styles";
import { useState } from "react";

const Quote = ({ onDataChange, data, readOnly }) => {
  const classes = useStyles();
  const [text, setText] = useState(data.text);
  const handleQuote = (e) => {
    setText(e.target.value);
    onDataChange(e.target.value);
  };
  if (!data.text && readOnly) {
    return <></>;
  }

  return (
    <div
      className={classes.blockQuote}
      cite="https://datatracker.ietf.org/doc/html/rfc1149"
    >
      <TextareaAutosize
        className={classes.blockInput}
        value={text}
        onChange={handleQuote}
      />
    </div>
  );
};

const useStyles = makeStyles({
  blockQuote: {
    fontSize: "50px",
    textTransform: "uppercase",
    marginBottom: "3%",
    paddingLeft: "10px",
    // borderLeft: '5px linear-gradient(128.16deg, #2B56FF 100%, #1395FD 90.57%)',
    // borderImageSlice: '60 30',
    // borderImageSource: 'linear-gradient(to left, #743ad5, #d53a9d)',
    // display: 'inline-flex',
    borderStyle: "solid",
    borderWidth: "0px",
    borderBottom: "none",
    borderRight: "none !important",
    borderTop: "none !important",

    width: "100%",
    marginLeft: "0px",
  },

  blockInput: {
    // marginTop: '-10px',
    // marginBottom: '-10px',
    minHeight: "20px",
    minWidth: "calc(100% - 20px)",
    fontFamily: "Poppins",
    fontSize: "16px",
    borderStyle: "solid",
    borderWidth: "5px",
    borderBottom: "none",
    borderRight: "none !important",
    borderTop: "none !important",
    paddingLeft: "9px",
    borderImage:
      "linear-gradient(rgba(43, 86, 255, 1), rgba(19, 149, 253, 1)) 1",
    color: "#1A1A1A",
    lineHeight: "38px",
    // minWidth: '100%',
    "&:focus": {
      outline: "none",
    },
    height: "auto",
    resize: "none",
  },
});

export default Quote;
