import { makeStyles } from "@mui/styles";
import {
  Checkbox,
  Button,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from "@mui/material";
import { useRef, useState, useCallback, useEffect } from "react";
import ReactTags from "react-tag-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { getArticle, uploadArticle } from "./writerEditorActions";
import { userUsername } from "./../user/userActions";
import Cookie from "js-cookie";
import { useNavigate } from "react-router";
import Auth from "../../components/auth";
import { getPublications } from "../writerContent/writerActions";
import { getAuthToken } from "../common/commonFunctions";
import { PublicationTextField, validateURL } from "../../utils/common";

const WriterSetting = () => {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);
  const [tags, setTags] = useState([]);
  const [getArticleInitiate, setGetArticleInitiate] = useState(false);
  const [tagValidation, setTagValidation] = useState("");
  const [articleData, setArticleData] = useState({});
  const [noCategoriesFound, setNoCategoriesFound] = useState(false);
  const [alreadySignedIn, setAlreadySignedIn] = useState(false);
  const [selectedPublicationId, setSelectedPublicationId] = useState("c41f8076-fb90-4f1b-a215-cf718972e84e");
  const [publicationErrorMsg, setPublicationErrorMsg] = useState("");
  const [canonicalLink, setCanonicalLink] = useState("");
  const [canonicalChecked, setCanonicalChecked] = useState(false);
  const [canonicalError, setCanonicalError] = useState("");

  const navigate = useNavigate();
  const reactTags = useRef();
  const handleCheck = () => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };
  const handleCanonicalCheck = () => {
    setCanonicalChecked(!canonicalChecked);
  };

  useEffect(() => {
    if (localStorage.getItem("publicationId") !== "undefined") {
      setSelectedPublicationId(localStorage.getItem("publicationId"));
    }
  }, []);

  const onDelete = useCallback(
    (tagIndex) => {
      setTags(tags.filter((_, i) => i !== tagIndex));
    },
    [tags]
  );

  const onAddition = useCallback(
    (newTag) => {
      for (let i of tags) {
        if (i.name === newTag.name) {
          return;
        }
      }
      setTags([...tags, newTag]);
    },
    [tags]
  );

  const dispatch = useDispatch();
  const {
    isGettingArticle,
    getArticleError,
    getArticleResp,
    userUserName,
    isUploadingArticle,
    publicationsData,
    uploadArticleError,
  } = useSelector((state) => ({
    isGettingArticle: state.writerEditor.isGettingArticle,
    getArticleError: state.writerEditor.getArticleError,
    getArticleResp: state.writerEditor.getArticleResp,
    publicationsData: state.writerContent.publicationsData,
    userUserName: state.user.userUserName,
    isUploadingArticle: state.writerEditor.isUploadingArticle,
    uploadArticleError: state.writerEditor.uploadArticleError,
  }));

  useEffect(() => {
    if (uploadArticleError) {
      setArticleData({});
    } else {
      if (!isUploadingArticle && getArticleInitiate) {
        setArticleData(getArticleResp.article);
        // localStorage.setItem('article', JSON.stringify(getArticleResp));
        localStorage.removeItem("article");
        localStorage.removeItem("articleId");
        navigate("/writerDashboard");
      }
    }
  }, [isUploadingArticle]);

  useEffect(() => {
    if (getArticleError) {
      setArticleData({});
    } else {
      if (!isGettingArticle && getArticleInitiate) {
        if (getArticleResp?.article?.status !== "DRAFT") {
          let temp = [];
          for (let i of getArticleResp.article.storySetting.categories) {
            temp.push({
              name: i,
            });
          }
          // console.log(temp);
          setTags(temp);
        }
        setArticleData(getArticleResp.article);
        let fetchedCanonicalLink =
          getArticleResp?.article?.storySetting?.canonicalUrl ||
          getArticleResp?.article?.originUrl ||
          "";
        setCanonicalLink(
          getArticleResp?.article?.storySetting?.canonicalUrl ||
            getArticleResp?.article?.originUrl ||
            ""
        );
        setCanonicalChecked(fetchedCanonicalLink !== "");
      }
    }
  }, [isGettingArticle]);

  useEffect(() => {
    if (Cookie.get("oneDayBeforeAccessToken")) {
      setAlreadySignedIn(true);
    } else {
      setAlreadySignedIn(false);
    }
    const token = getAuthToken();
    dispatch(
      userUsername(JSON.parse(localStorage.getItem("user")).userUserName)
    );
    dispatch(
      getPublications({
        token,
        userUserName: JSON.parse(localStorage.getItem("user")).userUserName,
      })
    );
  }, []);

  useEffect(() => {
    if (userUserName !== "") {
      const temp = getAuthToken();
      // const articleId = JSON.parse(localStorage.getItem('article')).article.articleId;
      dispatch(
        getArticle(
          {
            articleId: localStorage.getItem("articleId"),
            username: userUserName,
          },
          temp
        )
      );
      setGetArticleInitiate(true);
    }
  }, [userUserName]);

  // console.log(articleData);

  const publish = () => {
    if (!selectedPublicationId) {
      setPublicationErrorMsg("Please select a publication");
      return;
    }

    if (
      canonicalChecked &&
      (!validateURL(canonicalLink) || canonicalLink === "")
    ) {
      setCanonicalError("Please enter a valid canonical URL.");
      return;
    }

    if (tags.length < 1) {
      setNoCategoriesFound(true);
    } else {
      setNoCategoriesFound(false);
      const temp = getAuthToken();
      const date = new Date().getTime();
      const finalTags = [];
      for (let i of tags) {
        finalTags.push(i.name);
      }
      if (canonicalChecked) {
        // console.log(articleData);
        let writeup = articleData?.writeup;
        let articlePic = articleData?.public?.articlePic;
        // console.log(articlePic);
        if (articleData?.status === "PUBLISHED") {
          writeup = localStorage.getItem("article");
          articlePic = localStorage.getItem("articlePic");
        }
        const articleTitle = localStorage.getItem("articleTitle");
        const articleDes = localStorage.getItem("articleDes");
        dispatch(
          uploadArticle(
            {
              main: {
                writeup: writeup,
                status: "PUBLISHED",
                title: articleTitle,
                writerName: userUserName,
                body: articleDes,
                readingTime: articleData?.public?.readingTime,
                date: date,
                earlyAccess: true,
                earlyAccessLastDate: date,
                canonicalUrl: canonicalLink || "",
                categories: finalTags,
                articlePic: articlePic,
                publicationId: selectedPublicationId,
              },

              qParams: {
                writer: userUserName,
                articleId: articleData.articleId,
              },
            },
            temp
          )
        );
      } else if (checked === false) {
        // console.log(articleData);
        let writeup = articleData?.writeup;
        let articlePic = articleData?.public?.articlePic;
        // console.log(articlePic);
        if (articleData?.status === "PUBLISHED") {
          writeup = localStorage.getItem("article");
          articlePic = localStorage.getItem("articlePic");
        }
        const articleTitle = localStorage.getItem("articleTitle");
        const articleDes = localStorage.getItem("articleDes");

        dispatch(
          uploadArticle(
            {
              main: {
                writeup: writeup,
                status: "PUBLISHED",
                title: articleTitle,
                writerName: userUserName,
                body: articleDes,
                readingTime: articleData?.public?.readingTime,
                date: date,
                earlyAccess: true,
                earlyAccessLastDate: date,
                categories: finalTags,
                articlePic: articlePic,
                publicationId: selectedPublicationId,
              },

              qParams: {
                writer: userUserName,
                articleId: articleData.articleId,
              },
            },
            temp
          )
        );
      } else {
        dispatch(
          uploadArticle(
            {
              main: {
                writeup: JSON.stringify({
                  time: new Date().getTime(),
                  blocks: [
                    {
                      type: "header",
                      data: {
                        text: "Attentioun editor!",
                        level: 1,
                      },
                    },
                  ],
                }),
                status: "PUBLISHED",
                title: "abc",
                writer: "abc",
                body: "abc",
                readingTime: articleData?.readingTime,
                date: date,
                earlyAccess: false,
                // earlyAccessLastDate: date,
                categories: finalTags,
                articlePic: articleData.articlePic,
                // writeup: JSON.stringify(articleData),
                // status: "PUBLISHED",
                // title: "titleakjfd",
                // writer: "Check",
                // body: "descriptionkahsfgs",
                // readingTime: "6 mins",
                // date: date,
                // earlyAccess: true,
                // earlyAccessLastDate: date,
                // categories: ["travel", "fiction"],
              },

              qParams: {
                username: userUserName,
                articleId: articleData.articleId,
              },
            },
            temp
          )
        );
      }
    }
  };

  const handleSelectPublication = (e) => {
    setPublicationErrorMsg("");
    setSelectedPublicationId(e.target.value);
  };

  return (
    <div className={classes.whiteBackground}>
      {!alreadySignedIn && <Auth setAlreadySignedIn={setAlreadySignedIn} />}
      <div className={classes.saveBar}>
        <Button
          sx={{
            "&.MuiButton-text": { color: "black" },
            fontFamily: "Poppins",
            fontWeight: "700",
            fontSize: "0.9em",
            textTransform: "capitalize",
            width: "6rem",
            height: "38px",
            borderRadius: "10px",
            border: "2px solid #979797",
          }}
          style={{ marginLeft: "1rem" }}
          disabled={isUploadingArticle}
          onClick={() => {
            navigate("/story");
          }}
        >
          Back
        </Button>
        <Button
          sx={{
            "&.MuiButton-text": { color: "white" },
            fontFamily: "Poppins",
            fontWeight: "700",
            fontSize: "0.9em",
            textTransform: "capitalize",
            background:
              "linear-gradient(136.99deg, #FFA700 10.01%, #FF6D00 81.93%)",
            borderRadius: "10px",
          }}
          style={{ marginRight: "0.5%", width: "8rem" }}
          disabled={isUploadingArticle || isGettingArticle}
          onClick={publish}
        >
          {isUploadingArticle ? (
            <CircularProgress size={20} style={{ color: "white" }} />
          ) : getArticleResp?.article?.status === "PUBLISHED" ? (
            `Republish`
          ) : (
            `Publish`
          )}
        </Button>
      </div>

      <div className={classes.settingContainer}>
        <div className={classes.settingContainerWrap}>
          <div className={classes.writerSettinggTitle}>Tags</div>
          <div className={classes.writerSettingCard}>
            <div className={classes.cardTitle}>Reader Interests</div>
            {tagValidation && (
              <div className={classes.tagValidation}> {tagValidation} </div>
            )}
            {noCategoriesFound && (
              <div className={classes.disabledPublicationMsg}>
                Please add atleast one tag.{" "}
              </div>
            )}
            <div>
              <ReactTags
                ref={reactTags}
                tags={tags}
                onDelete={onDelete}
                onAddition={(e) => {
                  setTagValidation("");
                  if (!/^[a-zA-Z]*$/g.test(e.name)) {
                    setTagValidation(
                      "Tags shouldn't include symbols or numbers"
                    );
                    return;
                  }
                  if (e.name.length > 30 || e.name.length < 3) {
                    setTagValidation("Tags should be in range (3-30 letters)");
                    return;
                  }
                  onAddition(e);
                }}
                allowNew={true}
              />
            </div>
          </div>
        </div>

        <div className={classes.settingContainerWrap}>
          <div className={classes.writerSettinggTitle}>
            Publication Settings
          </div>
          <div className={classes.writerSettingCard}>
            <div className={classes.cardTitle}>Select a Publication</div>
            {localStorage.getItem("articleStatus") === "PUBLISHED" && (
              <div className={classes.disabledPublicationMsg}>
                {" "}
                Publication cannot be changed for already published story.{" "}
              </div>
            )}

            {publicationErrorMsg && (
              <Alert style={{ margin: "10px" }} severity="error">
                {publicationErrorMsg}
              </Alert>
            )}
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={selectedPublicationId}
              onChange={handleSelectPublication}
            >
              {publicationsData.map((publication) => (
                <FormControlLabel
                  disabled={
                    localStorage.getItem("articleStatus") === "PUBLISHED"
                  }
                  key={publication.publicationId}
                  value={publication.publicationId}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: "#59C995",
                        "&.Mui-checked": {
                          color: "#59C995",
                        },
                        "&.Mui-disabled": {
                          color: "gray",
                        },
                      }}
                    />
                  }
                  label={
                    <span className={classes.publicationRadioBtns}>
                      {publication.publicationName}
                    </span>
                  }
                />
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className={classes.settingContainerWrap}>
          <div className={classes.writerSettinggTitle}>SEO Settings</div>
          <div className={classes.writerSettingCard}>
            <div className={classes.canonicalTitle}>
              <Checkbox
                checked={canonicalChecked}
                alignItems="center"
                lable="Customize Canonical Link"
                onChange={handleCanonicalCheck}
                size="small"
                style={{ color: "#59C995", borderRadius: "5px" }}
              />
              Customize Canonical Link
            </div>
            {canonicalChecked && (
              <>
                <div className={classes.canonicalSubtitle}>
                  If your article was originally published on another platform,
                  and you want search engines to index that article instead of
                  your story on Attentioun, then you can set the canonical link
                  here.
                </div>
                <PublicationTextField
                  onChange={(e) => {
                    setCanonicalError("");
                    setCanonicalLink(e.target.value.substring(0, 80));
                  }}
                  // fullWidth
                  value={canonicalLink}
                  error={canonicalError ? true : false}
                  helperText={
                    <div style={{ fontFamily: "Roboto" }}>{canonicalError}</div>
                  }
                  label="Link URL"
                  inputProps={{
                    style: {
                      fontFamily: "Roboto",
                      color: "#636363",
                      fontSize: "16px",
                      height: "14px",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontFamily: "Roboto",
                      fontSize: "16px",
                      fontWeight: "500",
                    },
                  }}
                  style={{
                    width: "calc(100% - 32px)",
                    marginTop: "16px",
                    marginLeft: "10px",
                  }}
                />
              </>
            )}
          </div>
        </div>
        <div className={classes.settingContainerWrap}>
          <div className={classes.writerSettinggTitle}>Publish Settings</div>
          <div className={classes.writerSettingCard}>
            {/* <div className={classes.cardTitle}>Get early access</div> */}
            <div style={{ fontFamily: "Roboto", color: "#636363" }}>
              <Checkbox
                checked={true}
                disabled
                lable="Early Access"
                onChange={handleCheck}
              />
              {`Early Access (Coming Soon 🤫)`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginError = ({ message }) => {
  const classes = useStyles();
  return (
    <div className={classes.loginErrorContainer}>
      <div className={classes.loginError}>
        <div className={classes.loginErrorSVG}>
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
        <div className={classes.loginErrorMsg}>{message}</div>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  whiteBackground: {
    background: "#FFFFFF !important",
  },
  settingContainer: {
    marginTop: "4rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    minHeight: "calc(100vh - 10rem)",
  },

  settingContainerWrap: {
    width: "30%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },

  canonicalTitle: {
    // fontWeight: 'bold',
    fontFamily: "RobotoBold",
    fontSize: "16px",
    color: "#636363",
  },

  canonicalSubtitle: {
    color: "#636363",
    fontSize: "16px",
    fontFamily: "Roboto",
    padding: "10px",
    paddingBottom: "0px",
  },

  writerSettinggTitle: {
    fontWeight: "bold",
    color: "rgba(99, 99, 99, 1)",
    fontSize: "20px",
    color: "#636363",
    letterSpacing: "-0.05",
    lineHeight: "33px",
    marginBottom: "2%",
    display: "flex",
    fontFamily: "PoppinsBold",
    alignItems: "flex-start",
    width: "100%",
  },

  writerSettingCard: {
    border: "1px solid rgba(151, 151, 151, 0.5)",
    borderRadius: "10px",
    width: "15rem",
    padding: "3%",
    marginBottom: "10%",
    width: "100%",
  },

  cardTitle: {
    fontSize: "16px",
    lineHeight: "35px",
    color: "#636363",
    letterSpacing: "0.2px",
    fontFamily: "RobotoBold",
    marginBottom: "10px",
  },

  publicationRadioBtns: {
    fontSize: "15px",
    fontFamily: "Roboto",
    color: "#444444",
  },

  saveBar: {
    width: "100%",
    // marginTop: '4rem',
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0px 2px 24px rgba(199, 212, 223, 0.37612)",
    alginItems: "center",
    padding: "0.6% 0% 0.6% 0%",
  },

  saveBarButton: {
    background: "linear-gradient(136.99deg, #FFA700 10.01%, #FF6D00 81.93%)",
    color: "white",
    padding: "1% 1% 1% 1%",
    borderRadius: "5px",
    marginRight: "2%",
    cursor: "pointer",
    fontWeight: "bold",
  },

  loginErrorContainer: {
    display: "flex",
    justifyContent: "center",
    aligntems: "center",
  },

  loginError: {
    display: "flex",
    backgroundColor: "#FFBBBA",
    width: "20%",
    borderRadius: "10px",
    fontSize: "0.8em",
    padding: "1.4% 0% 1.4% 0%",
    justifyContent: "space-around",
    marginTop: "2%",
    height: "0.8rem",
    position: "absolute",
  },

  loginErrorSVG: {
    margin: "-0.3% 5% 0% 5%",
  },

  loginErrorMsg: {
    display: "flex",
    alignItems: "center",
    width: "90%",
  },

  tagValidation: {
    alignSelf: "center",
    marginBottom: "5px",
    color: "black",
    fontFamily: "Poppins",
    padding: "5px",
    width: "270px",
    borderRadius: "10px",
    fontSize: "12px",
    backgroundColor: "#FFDC9A",
  },
  disabledPublicationMsg: {
    alignSelf: "center",
    marginBottom: "5px",
    paddingLeft: "10px",
    color: "black",
    fontFamily: "Poppins",
    padding: "5px",
    width: "375px",
    borderRadius: "10px",
    fontSize: "12px",
    backgroundColor: "#FFDC9A",
  },
});

export default WriterSetting;
