import { makeStyles } from "@mui/styles";

/**
 * This function renders a error message
 * @returns A error message with a svg.
 */
export const Error = ({ message }) => {
  if (message === "Incorrect Username or Password") {
    message = "Incorrect username or password";
  }
  const classes = useStyles();
  return (
    <div className={classes.error}>
      <div className={classes.errorSVG}>
        <svg
          width="17"
          height="15"
          viewBox="0 0 17 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.2312 0.982933L16.729 12.0512C17.0903 12.6667 17.0903 13.4016 16.729 14.0171C16.3676 14.6325 15.7204 15 14.9978 15H2.00218C1.27949 15 0.63236 14.6326 0.271011 14.0171C-0.0903371 13.4016 -0.0903371 12.6667 0.271011 12.0512L6.76881 0.982933C7.13013 0.367482 7.77732 0 8.49998 0C9.22268 0 9.86984 0.367482 10.2312 0.982933ZM14.9978 14.0206C15.3604 14.0206 15.6851 13.8362 15.8664 13.5274C16.0477 13.2185 16.0477 12.8498 15.8665 12.541L9.36864 1.4727C9.18735 1.16387 8.86259 0.979505 8.50002 0.979505C8.13741 0.979505 7.81268 1.16387 7.63139 1.4727L1.13353 12.541C0.952238 12.8498 0.952238 13.2185 1.13353 13.5274C1.31482 13.8362 1.63954 14.0206 2.00218 14.0206H14.9978Z"
            fill="black"
          />
          <rect x="8" y="5" width="1" height="5" fill="black" />
          <path
            d="M8.5 11C8.2243 11 8 11.2243 8 11.5C8 11.7757 8.2243 12 8.5 12C8.77568 12 9 11.7757 9 11.5C9 11.2243 8.7757 11 8.5 11Z"
            fill="black"
          />
        </svg>
      </div>
      <div className={classes.errorMsg}>&nbsp;{message}</div>
    </div>
  );
};

const useStyles = makeStyles({
  error: {
    display: "flex",
    backgroundColor: "#FFBBBA",
    width: "100%",
    borderRadius: "10px",
    fontSize: "0.8em",
    padding: "0.4em 0 0.4em 0",
    justifyContent: "space-around",
    alignItems: "center",

    marginTop: "0.2em",
    marginBottom: "0.2em"
  },

  errorSVG: {
    margin: "1% 0% 0% 1%"
  },

  errorMsg: {
    width: "90%"
  }
});
