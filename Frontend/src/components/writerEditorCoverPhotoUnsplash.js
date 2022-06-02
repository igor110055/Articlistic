import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUnsplash } from "./../containers/unsplash/unsplashActions";
import { TextField, Dialog } from "@mui/material";
import { makeStyles } from "@mui/styles";

const WriterEditorCoverPhotoUnsplash = ({
  setUnsplashURL,
  setAddPhotoClicked,
  setSelectedPhoto,
  setOpenImageDialog,
  setUnsplashSelected
}) => {
  const [searchVal, setSearchVal] = useState("");
  const [submited, setSubmited] = useState(false);
  const [openPhotosDialog, setOpenPhotosDialog] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const [selectedImageURL, setSelectedImageURL] = useState(
    "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png"
  );
  const [imageSelected, setImageSelected] = useState(false);
  const dispatch = useDispatch();

  const {
    isGettingUnsplash,
    getUnsplashError,
    // getUnsplashErrorMsg,
    getUnsplashResp
  } = useSelector(state => ({
    isGettingUnsplash: state.unsplash.isGettingUnsplash,
    getUnsplashError: state.unsplash.getUnsplashError,
    // getUnsplashErrorMsg: state.unsplash.getUnsplashErrorMsg,
    getUnsplashResp: state.unsplash.getUnsplashResp
  }));

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
  };

  const classes = useStyles();
  const imageHandler = url => {
    setImageSelected(true);
    setUnsplashURL(url);
    setSubmited(false);
    setOpenImageDialog(false);
    setUnsplashSelected(false);
    // setAddPhotoClicked(false);
    // setSelectedPhoto(true);
  };

  return (
    <div className={classes.unsplash}>
      {!submited && (
        <TextField
          label="Search from Unsplash"
          variant="standard"
          fullWidth
          onChange={e => {
            setSearchVal(e.target.value);
          }}
          onKeyDown={e => {
            if (e.code === "Enter") {
              setSubmited(true);

              handleSearch();
            }
          }}
        />
      )}
      {!imageSelected && (
        <Dialog
          open={openPhotosDialog}
          onClose={() => {
            setOpenPhotosDialog(false);
            setOpenImageDialog(false);
            setUnsplashSelected(false);
          }}
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none"
            }
          }}
          classes={{ paper: classes.unsplashResult }}
        >
          {submited &&
          getUnsplashResp.results !== undefined &&
          getUnsplashResp.results.length > 0 ? (
            <div className={classes.unsplashImageContainer}>
              {submited &&
                getUnsplashResp.results !== undefined &&
                getUnsplashResp.results.map(eachImage => (
                  <img
                    src={eachImage.urls.small}
                    className={classes.imageStyle}
                    onClick={() =>
                      imageHandler(eachImage.urls.full, eachImage.description)
                    }
                    alt="url"
                  />
                ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bolder",
                fontSize: "2rem"
              }}
            >
              No results found
            </div>
          )}
        </Dialog>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  unsplash: {
    marginBottom: "3%"
    // paddingTop: '4rem',
  },
  e: {
    visibility: "hidden"
  },
  unsplashImageContainer: {
    paddingTop: "1em",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },

  imageStyle: {
    objectFit: "cover",
    minWidth: "180px",
    minHeight: "180px",
    maxWidth: "180px",
    maxHeight: "180px",
    marginBottom: "3%",
    // padding: '0% 2% 0% 2%',
    cursor: "pointer"
  },

  displayImageStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
    // height: '400px',
  },

  imageCaption: {
    width: "99%",
    textAlign: "center",
    border: "1px solid #ADADAD",
    height: "40px",
    marginTop: "1%",
    fontFamily: "Poppins",
    "&:focus": {
      outline: "none"
    }
  },

  displayImageInternal: {
    width: "100%",
    // height: '300px',
    objectFit: "cover"
  },
  unsplashResult: {
    maxHeight: "500px",
    overflowY: "auto",
    width: "100%",
    // marginTop: '3%',
    paddingTop: "1%",
    background: "transparent"
  }
});

export default WriterEditorCoverPhotoUnsplash;
