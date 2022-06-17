import { Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
function Uploadbutton({
  imagePreview,
  setImagePreview,
  image,
  setImage,
  fileInputRef,
  onFileUpload,
}) {
  const classes = useStyles();

  return (
    <Box className={classes.fileUpload}>
      {!imagePreview ? (
        <>
          <Button
            component="label"
            sx={{
              "&.MuiButton-text": { color: "#636363" },
              fontFamily: "Poppins",
              fontSize: "0.8em",
              textTransform: "capitalize",
              borderRadius: "10px",
              border: "2px solid #979797",
            }}
            style={{ width: "8rem", height: "4rem" }}
          >
            <h3> +Add Photo </h3>{" "}
            <input
              required
              accept="image/*"
              type="file"
              hidden
              ref={fileInputRef}
              onChange={onFileUpload}
            />
          </Button>
          <div className={classes.imageSize}>250 x 250 pixels</div>
        </>
      ) : (
        <img
          height={250}
          width={250}
          style={{ objectFit: "cover" }}
          src={imagePreview}
          alt="aboutPublication"
        />
      )}
    </Box>
  );
}

const useStyles = makeStyles({
  fileUpload: {
    background: "#D4E5DD",
    width: "238px",
    display: "flex",
    color: "#636363",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "180px",
    margin: "18px",
    borderRadius: "8px",
  },

  imageSize: {
    color: "#636363",
    fontSize: "0.8rem",
    marginTop: "5px",
  },
});
export default Uploadbutton;
