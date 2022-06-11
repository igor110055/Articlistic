import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import WriterDashboardCard from "../../components/writerDashboardCard";
import { useSelector, useDispatch } from "react-redux";
import {
  createNewArticle,
  discardArticle,
  getAllArticles,
} from "../writerEditor/writerEditorActions";
import graph from "./../../Images/graph.png";
import progress from "./../../Images/progress.png";
import { useNavigate } from "react-router";
import { userUsername } from "../user/userActions";
import Loader from "../../components/home/loader";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { baseURL, endPoints } from "../../utils/apiEndPoints";
import { getAuthToken } from "../common/commonFunctions";

const WriterDashboard = () => {
  const [createClicked, setCreateClicked] = useState(false);
  const [getAllArticlesI, setGetAllArticlesI] = useState(false);
  const [readyWriteups, setReadyWriteups] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [requestCounter, setRequestCounter] = useState(0);
  const navigate = useNavigate();
  const {
    userUserName,
    isCreatingNewArticle,
    createNewArticleError,
    createNewArticleResp,
    isGettingAllArticles,
    getAllArticlesError,
    getAllArticlesErrorMsg,
    getAllArticlesResp,
  } = useSelector((state) => ({
    userUserName: state.user.userUserName,
    isCreatingNewArticle: state.writerEditor.isCreatingNewArticle,
    createNewArticleError: state.writerEditor.createNewArticleError,
    createNewArticleResp: state.writerEditor.createNewArticleResp,
    isGettingAllArticles: state.writerEditor.isGettingAllArticles,
    getAllArticlesError: state.writerEditor.getAllArticlesError,
    getAllArticlesErrorMsg: state.writerEditor.getAllArticlesErrorMsg,
    getAllArticlesResp: state.writerEditor.getAllArticlesResp,
  }));

  useEffect(() => {
    if (createNewArticleError) {
      setCreateClicked(false);
    } else {
      if (!isCreatingNewArticle && createClicked) {
        setCreateClicked(false);
        localStorage.setItem("articleId", createNewArticleResp?.articleId);
        navigate("/story");
      }
    }
  }, [isCreatingNewArticle]);

  useEffect(() => {
    const isWriter = localStorage.getItem("isWriter");
    if (isWriter !== true && isWriter !== "true") navigate("/homepage");
  }, []);

  useEffect(() => {
    if (getAllArticlesError) {
    } else {
      if (!isGettingAllArticles && getAllArticlesI) {
        setReadyWriteups([...readyWriteups, ...getAllArticlesResp.articles]);
      }
    }
  }, [isGettingAllArticles]);
  // console.log(readyWriteups);

  const fetchArticles = (skip) => {
    const temp = getAuthToken();
    // dispatch(userUsername(JSON.parse(localStorage.getItem('user')).userUserName));
    // dispatch(getAllArticles({
    //     skip: 0,
    //     limit: 10,
    //     filters: 'PUBLISHED',
    // }, temp));
    // setGetAllArticlesI(true);
    const params = new URLSearchParams({
      skip: skip,
      limit: 10,
      // filters: "PUBLISHED",
    });
    axios
      .get(`${baseURL}/${endPoints.getAllArticles}?${params}`, {
        headers: {
          Authorization: temp,
        },
      })
      .then((res) => {
        setRequestCounter(requestCounter + 1);
        if (res.data.articles.length === 0) {
          setHasMore(false);
        }
        setReadyWriteups([...readyWriteups, ...res.data.articles]);
      });
  };

  useEffect(() => {
    if (userUserName !== "") {
      fetchArticles(0);
    }
  }, [userUserName]);

  useEffect(() => {
    dispatch(
      userUsername(JSON.parse(localStorage.getItem("user")).userUserName)
    );
  }, []);

  useEffect(() => {
    getWriterName();
  }, []);

  const getWriterName = async () => {
    try {
      const user = localStorage.getItem("user");
      const userDetails = JSON.parse(user);
      const response = await axios.get(
        `${baseURL}/users/name?username=${userDetails?.userUserName}`
      );
      localStorage.setItem("writerName", response.data.name);
    } catch (e) {
      console.log(e);
    }
  };

  const dispatch = useDispatch();
  const classes = useStyles();
  // console.log(readyWriteups);
  return (
    <div style={{ paddingTop: "0rem", backgroundColor: "#F6F6F7" }}>
      <div className={classes.writerDashboardContainer}>
        <div className={classes.writerDashboard}>
          <div id="scrollableDiv" className={classes.writerDashboardLeft}>
            <div
              style={{
                color: "rgba(49, 61, 124, 1)",
                fontWeight: 600,
                paddingBottom: "10px",
                fontSize: "18px",
              }}
            >
              My Stories
            </div>
            {/* {readyWriteups === false ? (<div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {isGettingAllArticles && <Loader />}
                        </div>) : (
                            <div className={classes.writerCards}>
                                {readyWriteups.length < 1 && <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No story yet</div>}
                                <InfiniteScroll
                                    dataLength={readyWriteups.length}
                                    hasMore={true}
                                    loader={<Loader />}
                                    next={fetchArticles}>
                                    {readyWriteups.map((eachCard) => (
                                        <WriterDashboardCard status={eachCard.status} title={eachCard?.public?.title} subtitle={eachCard?.public?.body} pic={eachCard?.public?.articlePic} articleId={eachCard.articleId} />
                                    ))}
                                </InfiniteScroll>
                            </div>
                        )}
                        {readyWriteups.length > 6 && <button className={classes.writerDashboardLeftButton}>See more</button>} */}
            <InfiniteScroll
              dataLength={readyWriteups.length}
              next={() => {
                fetchArticles(skip + 10);
                setSkip(skip + 10);
              }}
              // onScroll={() => console.log('ashkf')}
              hasMore={hasMore}
              loader={<Loader />}
              scrollableTarget="scrollableDiv"
            >
              {/* <div id="scrollableDiv" style={{ height: 'auto', maxHeight: '40rem', overflow: 'auto' }}> */}
              {readyWriteups.map((eachCard) => {
                if (!eachCard.deleteAt)
                  return (
                    <WriterDashboardCard
                      status={eachCard.status}
                      title={eachCard?.public?.title}
                      subtitle={eachCard?.public?.body}
                      pic={eachCard?.public?.articlePic}
                      articleId={eachCard.articleId}
                      key={eachCard.articleId}
                    />
                  );
              })}
              {/* </div> */}
            </InfiniteScroll>
            {hasMore ? (
              ""
            ) : (
              <div
                style={{
                  minHeight: requestCounter <= 1 ? "60vh" : "0vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {requestCounter <= 1 ? "Create a Story 👨‍💻" : ""}
              </div>
            )}
          </div>
          <div className={classes.writerDashboardRight}>
            <div className={classes.writerDashboardGraph}>
              <img
                src={graph}
                style={{ width: "100%", filter: "blur(3px)" }}
                alt="graph"
              />
              <div style={{ position: "absolute" }}>
                Earnings and Analytics (Coming soon)
              </div>
            </div>
            <div className={classes.writerDashboardProgress}>
              <img
                src={progress}
                style={{ width: "100%", filter: "blur(3px)" }}
                alt="progress"
              />
              <div style={{ position: "absolute", marginBottom: "2.5%" }}>
                Stats and KPI (Coming soon)
              </div>
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
  );
};

const useStyles = makeStyles({
  saveBar: {
    width: "100%",
    // marginTop: '4rem',
    display: "flex",
    justifyContent: "space-between",
    alginItems: "center",
    padding: "0.3% 0% 0.3% 0%",
    height: "3rem",
    // position: 'fixed',
    backgroundColor: "white",
    zIndex: 1,
  },

  saveBaricon: {
    width: "40px",
    marginLeft: "1%",
  },

  saveBarLeft: {
    display: "flex",
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "1%",
  },

  saveBarLeftMyStories: {
    padding: "0.8% 0% 0.8% 0%",
    textAlign: "center",
    width: "9.125em",
    border: "1px solid rgba(151, 151, 151, 0.3)",
    borderRadius: "10px",
  },

  saveBarRight: {
    display: "flex",
    alignItems: "center",
  },

  writerDashboardContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F7",
    // marginTop: '7rem',
    minHeight: "calc(100vh - 4rem)",
  },

  writerDashboard: {
    display: "flex",
    minHeight: "90%",
    height: "80vh",
    maxHeight: "50rem",
    // width: '90vw',
  },

  writerDashboardLeft: {
    borderRadius: "20px",
    backgroundColor: "white",
    width: "35vw",
    padding: "2% 3% 0% 3%",
    marginRight: "2%",
    overflow: "auto",
    minHeight: "90%",
    maxHeight: "31.50",
  },

  writerCards: {
    display: "flex",
    flexDirection: "column-reverse",
    paddingTop: "2%",
    // minHeight: '100%',
  },

  writerDashboardLeftButton: {
    background: "linear-gradient(136.99deg, #5BCB97 10.01%, #28A59D 81.93%)",
    border: "none",
    color: "white",
    fontWeight: "bold",
    padding: "3% 5% 3% 5%",
    borderRadius: "10px",
    marginBottom: "2%",
    fontFamily: "Poppins",
  },

  writerDashboardRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "50vw",
    height: "100%",
    pointerEvents: "none",
  },

  writerDashboardLeftCardContainer: {},

  writerDashboardGraph: {
    borderRadius: "20px",
    // overflow: 'hidden',
    width: "93%",
    backgroundColor: "white",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "3%",
  },

  writerDashboardProgress: {
    borderRadius: "20px",
    overflow: "hidden",
    width: "93%",
    backgroundColor: "white",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WriterDashboard;
