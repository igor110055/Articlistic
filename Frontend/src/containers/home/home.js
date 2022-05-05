import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Carousel from "react-material-ui-carousel";
import CarouselItem from "../../components/home/carouselItem";
import { useDispatch, useSelector } from "react-redux";
import { getFollowedWriters } from "./homeActions";
import WritersWithCards from "../../components/home/writersWithCards";
import MiniDrawer from "../../components/home/writerDrawer";
import WritersList from "../../components/home/writersList";
import Cookie from "js-cookie";
import r1 from "./../../Images/dummy/r1.jpg";
import r2 from "./../../Images/dummy/r2.jpg";
import r3 from "./../../Images/dummy/r3.jpg";
import { getAuthToken } from "../common/commonFunctions";

const Home = () => {
  const cs = [r1, r2, r3];
  const classes = useStyles();
  const dispatch = useDispatch();
  const [alreadySignedIn, setAlreadySignedIn] = useState(false);
  const [getFollowedInitiate, setGetFollowedInitiate] = useState(false);
  const [dataReceived, setDataReceived] = useState(false);
  // const [bookmarkDialog, setBookmarkDialog] = useState(false);
  const {
    isGettingFollowedWriters,
    getFollowedWritersError,
    // getFollowedWritersErrorMsg,
    // getFollowedWritersResp,
    userUserName
  } = useSelector(state => ({
    isGettingFollowedWriters: state.home.isGettingFollowedWriters,
    getFollowedWritersError: state.home.getFollowedWritersError,
    getFollowedWritersErrorMsg: state.home.getFollowedWritersErrorMsg,
    getFollowedWritersResp: state.home.getFollowedWritersResp,
    userUserName: state.user.userUserName
  }));

  useEffect(() => {
    if (getFollowedWritersError) {
      setGetFollowedInitiate(false);
      setDataReceived(false);
    } else {
      if (!isGettingFollowedWriters && getFollowedInitiate) {
        setDataReceived(true);
      }
    }
  }, [isGettingFollowedWriters]);

  useEffect(() => {
    if (userUserName !== "") {
      const temp = getAuthToken();
      dispatch(
        getFollowedWriters(
          {
            username: userUserName
          },
          temp
        )
      );
      setGetFollowedInitiate(true);
    }
  }, [userUserName]);

  useEffect(() => {
    if (Cookie.get("oneDayBeforeAccessToken")) {
      setAlreadySignedIn(true);
    } else {
      setAlreadySignedIn(false);
    }
  }, []);

  return (
    <div>
      {true ? (
        <div className={classes.home}>
          {/* {!alreadySignedIn && <Auth setAlreadySignedIn={setAlreadySignedIn} />} */}
          <div className={classes.writerList}>
            <WritersList />
          </div>
          <Carousel
            className={classes.carousel}
            animation="slide"
            interval={5000}
            indicatorContainerProps={{
              className: `${classes.carouselIndicatorContainer}`
            }}
            indicatorIconButtonProps={{
              style: {
                border: "1px solid rgba(216, 216, 216, 1)",
                color: "transparent",
                padding: "0px",
                width: "1rem",
                height: "1rem",
                marginRight: "1%"
              }
            }}
            activeIndicatorIconButtonProps={{
              style: {
                color: "rgba(216, 216, 216, 1)"
              }
            }}
            navButtonsAlwaysInvisible={true}
          >
            {cs.map(each => (
              <CarouselItem dummyImage={each} />
            ))}
          </Carousel>
          <MiniDrawer />

          <div className={classes.followedWriterContent}>
            {[1, 2, 3].map(eachWriter => (
              <WritersWithCards data={eachWriter} />
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh"
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  home: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: "75px",
    backgroundColor: "#F6F6F7",
    "@media (max-width:720px)": {
      // eslint-disable-line no-useless-computed-key
      paddingLeft: "0px"
    }
  },

  writerList: {
    display: "none",
    "@media (max-width:720px)": {
      // eslint-disable-line no-useless-computed-key
      display: "flex",
      marginTop: "4rem"
    }
  },

  carousel: {
    width: "90vw",
    // height: '100vh',
    // maxHeight: '40rem',
    // height: '50vh',
    // backgroundColor: 'red',
    height: "25rem",
    marginTop: "7rem",
    borderRadius: "20px",
    overflow: "hidden",
    "@media (max-width:720px)": {
      // eslint-disable-line no-useless-computed-key
      height: "fit-content",
      width: "100vw",
      borderRadius: "0px",
      marginTop: "0px"
    }
  },

  carouselIndicatorContainer: {
    marginTop: "-80px",
    display: "flex",
    paddingLeft: "1%",
    zIndex: "1",
    "@media (max-width:720px)": {
      // eslint-disable-line no-useless-computed-key
      marginTop: "-20px"
    },
    // backgroundColor: 'red',
    position: "absolute"
  },

  carouselIndicatorButton: {
    // backgroundColor: 'white',
    color: "red",
    border: "1px solid red"
    // height: '1px',
    // width: '1px',
  },

  followedWriterContent: {
    marginTop: "5rem"
  },

  bookmarkDialog: {
    display: "flex",
    justifyContent: "space-between",
    padding: "3%"
  }
});

export default Home;
