import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { getRefreshToken, logout } from "../loginSignup/loginSignupAction";
import Cookie from 'js-cookie';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userUsername } from "../user/userActions";
import WriterDashboard from "../writerContent/writerDahsboard";
import TempNavbar from "../navbar/tempNavbar";
import WriterContent from "../writerContent/writerContent";
import Auth from "../../components/auth";
import { getAuthToken } from "../common/commonFunctions";
import {
    // BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
import WriterStories from "./writerStories";
import WriterPublication from "./writerPublication";
import WriterCommunity from "./writerCommunity";

const WriterContentContainer = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [submitClicked, setSubmitClicked] = useState(false);
    const [alreadySignedIn, setAlreadySignedIn] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);

    /* Checking if the user is already signed in. If the user is already signed in, it will set
    alreadySignedIn to true. */
    useEffect(() => {
        if (Cookie.get('oneDayBeforeAccessToken')) {
            setAlreadySignedIn(true);
        } else {
            setAlreadySignedIn(false);
        }
        dispatch(userUsername(JSON.parse(localStorage.getItem('user'))?.userUserName))
    }, []);

    const {
        isLoggingOut,
        logoutError,
        user,
        isGettingRefreshToken,
        getRefreshTokenError,
        // getRefreshTokenErrorMsg,
        getRefreshTokenResp,
    } = useSelector((state) => ({
        isLoggingOut: state.loginSignup.isLoggingOut,
        logoutError: state.loginSignup.logoutError,
        user: state.user,
        isGettingRefreshToken: state.loginSignup.isGettingRefreshToken,
        getRefreshTokenError: state.loginSignup.getRefreshTokenError,
        getRefreshTokenErrorMsg: state.loginSignup.getRefreshTokenErrorMsg,
        getRefreshTokenResp: state.loginSignup.getRefreshTokenResp,
    }));

    useEffect(() => {
        if (logoutError) {

        } else {
            if (!isLoggingOut && submitClicked) {
                Cookie.remove('accessToken');
                Cookie.remove('refreshToken');
                Cookie.remove('oneDayBeforeAccessToken');
                localStorage.removeItem('categories');
                navigate('/login');
            }
        }
    }, [isLoggingOut]);
    const handleSignout = () => {
        const temp = getAuthToken();
        dispatch(logout({
            accessToken: temp,
            username: user.userUserName,
        }, temp));
        setSubmitClicked(true);
    }

    useEffect(() => {
        if (getRefreshTokenError) {
            setKeepSignedIn(false);
        } else {
            if (!isGettingRefreshToken && keepSignedIn) {
                const encAccessToken = getRefreshTokenResp.accessToken
                Cookie.set("accessToken", encAccessToken, { expires: 7 });
                Cookie.set('oneDayBeforeAccessToken', encAccessToken, { expires: 6 });
                setAlreadySignedIn(true);
            }
        }
    }, [isGettingRefreshToken]);

    const handleKeepSignedIn = () => {
        dispatch(getRefreshToken({}, Cookie.get('refreshToken')));
        setKeepSignedIn(true);
    }

    return (
        <div>
            <TempNavbar />
            {!alreadySignedIn && <Auth setAlreadySignedIn={setAlreadySignedIn} />}
            <div className={classes.homeContainer}>
                <WriterContent />
            </div>
            <Routes>
            <Route exact path="/" element={<WriterDashboard />} />
            <Route exact path="stories" element={<WriterStories />} />
            <Route exact path="community" element={<WriterCommunity />} />
            <Route  exact path="publications" element={<WriterPublication />} />
            {/* <Route index element={< />} /> */}
          </Routes>
        </div>
    );
}

const useStyles = makeStyles({
    homeContainer: {
        minHeight: '(100vh - 4.4rem)',
        backgroundColor: 'white',
        width: '100%',
        marginTop: '4.2rem',
    },

    signedInDialog: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '3%',
    }
})

export default WriterContentContainer;