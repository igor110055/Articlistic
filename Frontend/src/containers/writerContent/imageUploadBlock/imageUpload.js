import { useEffect, useRef, useState } from "react";
import axios from "axios";
// import Cookie from 'js-cookie';
// import crypto from 'crypto-js';
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { userUsername } from "../../user/userActions";
import { baseURL, endPoints } from "../../../utils/apiEndPoints";
import { getAuthToken } from "../../common/commonFunctions";

const ImageUpload = ({ onDataChange, data, readOnly }) => {
  // console.log(data);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [url, setUrl] = useState(data.url ? data.url : "");
  const [caption, setCaption] = useState(data.caption ? data.caption : "");
  const [progress, setProgress] = useState(0);
  const handleChange = e => {
    if (e.target.files[0].size / (1024 * 1024) <= 5) {
      setSelectedFile(e.target.files[0]);
      setUrl("");
    } else {
      alert("Add image of size less than 5mb");
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      fileUploadHandler();
    }
  }, [selectedFile]);

  const {
    user
    // createNewArticleResp,
    // isUploadingImage,
    // uploadImageError,
    // uploadImageResp,
  } = useSelector(state => ({
    user: state.user,
    createNewArticleResp: state.writerEditor.createNewArticleResp,
    isuploadingImage: state.writerEditor.isUploadingImage,
    uploadImageError: state.writerEditor.uploadImageError,
    uploadImageResp: state.writerEditor.uploadImageResp
  }));

  useEffect(() => {
    dispatch(
      userUsername(JSON.parse(localStorage.getItem("user")).userUserName)
    );
  }, []);

  const hiddenInput = useRef(null);
  const handleInputClicked = () => {
    hiddenInput.current.click();
  };

  const fileUploadHandler = e => {
    const publicationId = localStorage.getItem("publicationId");
    const fd = new FormData();
    fd.append("image", selectedFile, selectedFile.name);

    const temp = getAuthToken();
    // console.log(temp);
    axios
      .post(
        `${baseURL}/${endPoints.publicationUploadImage}?username=${user.userUserName}&publicationId=${publicationId}`,
        fd,
        {
          //for writers
          headers: {
            Authorization: temp
          },

          onUploadProgress: progressEvent => {
            setProgress(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          }
        }
      )
      .then(resp => {
        setUrl(resp.data.link);
        onDataChange(resp.data.link, caption);
      })
      .catch(error => {
        // console.log(error);
      });
  };

  if (!data.url && readOnly) {
    return <></>;
  }

  return (
    <div className={classes.imageUploadSection}>
      {url === "" ? (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: "none" }}
            ref={hiddenInput}
          />
          {progress === 0 ? (
            <div className={classes.input} onClick={handleInputClicked}>
              Select Image
            </div>
          ) : (
            <div className={classes.progress}>{progress}% Uploaded</div>
          )}
        </div>
      ) : (
        <div>
          <img src={url} className={classes.imageStyle} alt="style" />
          {!readOnly && (
            <input
              className={classes.captionStyle}
              value={caption}
              onChange={e => {
                setCaption(e.target.value);
                onDataChange(url, e.target.value);
              }}
              placeholder="Enter a caption"
            />
          )}
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  imageUploadSection: {
    marginBottom: "3%",
    paddingTop: "2%"
  },

  input: {
    width: "100%",
    border: "1px solid #6B6B6B",
    borderRadius: "5px",
    outline: "none",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2% 0% 2% 0%"
  },

  progress: {
    idth: "100%",
    border: "1px solid #6B6B6B",
    borderRadius: "5px",
    outline: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2% 0% 2% 0%"
  },

  imageStyle: {
    width: "100%"
  },

  captionStyle: {
    width: "100%",
    sidplay: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2% 0% 2% 0%",
    border: "1px solid #ADADAD",
    textAlign: "center",
    outline: "none",
    fontFamily: "Poppins",
    color: "#1A1A1A"
  }
});

export default ImageUpload;
