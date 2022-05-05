import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUnsplash } from "./unsplashActions";
import { TextField, Button, Dialog } from "@mui/material";
import { makeStyles } from "@mui/styles";

const Unsplash = ({ onDataChange, data, readOnly }) => {
  const [searchVal, setSearchVal] = useState("");
  const [submited, setSubmited] = useState(false);
  const [openPhotosDialog, setOpenPhotosDialog] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const [selectedImageURL, setSelectedImageURL] = useState(data.url);
  const [imageSelected, setImageSelected] = useState(false);
  const [imageCaption, setImageCaption] = useState(data.caption);
  const [name, setName] = useState("");
  const [userLink, setUserLink] = useState("");
  const dispatch = useDispatch();

  const {
    isGettingUnsplash,
    getUnsplashError,
    getUnsplashErrorMsg,
    getUnsplashResp,
  } = useSelector((state) => ({
    isGettingUnsplash: state.unsplash.isGettingUnsplash,
    getUnsplashError: state.unsplash.getUnsplashError,
    getUnsplashErrorMsg: state.unsplash.getUnsplashErrorMsg,
    getUnsplashResp: state.unsplash.getUnsplashResp,
  }));

  useEffect(() => {
    if (data.url !== "") {
      setSelectedImageURL(data.url);
    }
  }, [data]);

  useEffect(() => {
    if (getUnsplashError) {
      setSubmited(false);
    } else {
      if (!isGettingUnsplash && submited) {
        setOpenPhotosDialog(true);
        setSearchClicked(true);
      }
    }
  }, [isGettingUnsplash]);
  const handleSearch = () => {
    dispatch(getUnsplash(searchVal));
    setSubmited(true);
  };

  const classes = useStyles();
  const imageHandler = (url, caption, userName, link) => {
    // console.log(caption);
    setSelectedImageURL(url);
    setImageSelected(true);
    onDataChange(url, caption);
    setImageCaption(caption);
    setName(userName);
    setUserLink(link);
  };

  if (!data.url && readOnly) {
    return <></>;
  }

  return (
    <div className={classes.unsplash}>
      {(!searchClicked || !imageSelected) && data.url === "" ? (
        <TextField
          label="Search from Unsplash"
          variant="standard"
          fullWidth
          onChange={(e) => {
            setSearchVal(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              handleSearch();
            }
          }}
        />
      ) : (
        <div>
          <div className={classes.displayImageStyle}>
            <img
              src={selectedImageURL}
              className={classes.displayImageInternal}
            />
          </div>
          <div className={classes.uname}>
            Photo by{" "}
            <a style={{ color: "black" }} href={userLink} target="_blank">
              {name}
            </a>{" "}
            on Unsplash
          </div>
          {readOnly && data.caption !== null && (
            <div>
              <div
                type="text"
                className={classes.imageCaption}
                value={imageCaption}
              >
                {" "}
                {data.caption}{" "}
              </div>
            </div>
          )}
          {!readOnly && data.caption !== null && (
            <div>
              <input
                type="text"
                className={classes.imageCaption}
                value={imageCaption}
                onChange={(e) => {
                  setImageCaption(e.target.value);
                  onDataChange(selectedImageURL, e.target.value);
                }}
              />
            </div>
          )}
        </div>
      )}
      {!imageSelected && (
        <div
          className={classes.unsplashResult}
          open={openPhotosDialog}
          onClose={() => setOpenPhotosDialog(false)}
          classes={{ paper: classes.dialogPaper }}
        >
          <div className={classes.unsplashImageContainer}>
            {submited &&
              getUnsplashResp.results !== undefined &&
              getUnsplashResp.results.map((eachImage) => (
                <img
                  src={eachImage.urls.small}
                  className={classes.imageStyle}
                  onClick={() =>
                    imageHandler(
                      eachImage.urls.full,
                      eachImage.description,
                      eachImage.user.name,
                      eachImage.links.html
                    )
                  }
                />
              ))}
          </div>
        </div>
      )}
      {/* <Button onClick={handleSearch}>Search</Button> */}
    </div>
  );
};

const useStyles = makeStyles({
  unsplash: {
    marginBottom: "3%",
    paddingTop: "2%",
  },

  unsplashImageContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },

  imageStyle: {
    objectFit: "cover",
    minWidth: "200px",
    minHeight: "200px",
    maxWidth: "200px",
    maxHeight: "200px",
    marginBottom: "3%",
    cursor: "pointer",
  },

  displayImageStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // height: '400px',
  },

  uname: {
    width: "100%",
    textAlign: "center",
    backgroundColor: "#F7F7F7",
    fontSize: "14px",
    marginTop: "2px",
    color: "#616161",
  },

  imageCaption: {
    width: "100%",
    textAlign: "center",
    border: "1px solid #ADADAD",
    padding: "2% 0% 2% 0%",
    marginTop: "1%",
    fontFamily: "Poppins",
    "&:focus": {
      outline: "none",
    },
    color: "#616161",
  },

  displayImageInternal: {
    width: "100%",
    // height: '300px',
    objectFit: "cover",
  },
  unsplashResult: {
    maxHeight: "500px",
    overflowY: "auto",
    marginTop: "3%",
  },
});

export default Unsplash;
