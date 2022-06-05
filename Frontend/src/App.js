// import LandingPage from "./containers/loginSignup/landingPage";
import { getEnvVariables } from "./config";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import TempNavbar from "./containers/navbar/tempNavbar";
// import OnBoarding from "./containers/loginSignup/onBoarding";
import PrivateRoute from "./components/privateRoute";
// import Home from "./containers/home/home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import Cookie from "js-cookie";
import WriterSetting from "./containers/writerEditor/writerSetting";
import WriterEditor from "./containers/writerEditor/writerEditor";
import WriterContentContainer from "./containers/writerContent/writerContentContainer";
// import Auth from "./components/auth";
import NotFound from "./components/notFound";
import CustomizedSnackbars from "./components/materialuiSnackbar";
import { showSnackbar } from "./containers/common/commonActions";
import WriterPublicationEditor from "./containers/writerContent/writerPublicationEditor";
// import WriterAboutPublication from "./containers/writerContent/writerAboutPublication";
import AboutPublication from "./containers/writerContent/aboutPublication";
import "./App.css";
import MultipleTab from "./utils/MultipleTab";
import SignUp from "./containers/authentication/signup";
import SignIn from "./containers/authentication/signin";
// import PickFavWriters from "./containers/authentication/components/pick-fav-writers/pick-fav-writers";
import Homepage from "./containers/homepage/homepage";
import {
  getAuthToken,
  getRefreshToken
  } from "./containers/common/commonFunctions";
// import PickFavWriters from "./containers/authentication/components/pick-fav-writers/pick-fav-writers";
// import {
//   getAuthToken,
//   getRefreshToken,
// } from "./containers/common/commonFunctions";
// import getEnvVariables from "./config";
function App() {
  // const [alreadySignedIn, setAlreadySignedIn] = useState(Cookie.get('accessToken'));
  const [getEnvVariablesSuccess, setEnvVariablesSuccess] = useState(false);
  const [mulitpleTabs, setMultipleTabs] = useState(false);
  const { variant, message, open } = useSelector((state) => ({
    // thisState: state,
    loginError: state.signupReducer.isLoggedIn,
    variant: state.common.snackbar.variant,
    message: state.common.snackbar.message,
    open: state.common.snackbar.open,
  }));

  const dispatch = useDispatch();
  // useEffect(() => {
  //   console.log(thisState);
  // }, [thisState]);
  useEffect(() => {
    getEnvVariables(
      ["REACT_APP_ENCRYPTION_SALT", "REACT_APP_SERVER_LINK"],
      setEnvVariablesSuccess
    );

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    function updateOnlineStatus(event) {
      const condition = navigator.onLine ? "online" : "offline";
      if (condition === "online") {
        dispatch(showSnackbar("Your connection is back", "success"));
      } else {
        dispatch(
          showSnackbar("You have lost your internet connection", "error")
        );
      }
    }
  }, []);

  localStorage.openpages = Date.now();
  var onLocalStorageEvent = function (e) {
    if (e.key === "openpages") {
      // Listen if anybody else is opening the same page!
      localStorage.page_available = Date.now();
    }
    if (e.key === "page_available") {
      setMultipleTabs(true);
      // alert("Please Close other open tabs.");
    }
  };
  window.addEventListener("storage", onLocalStorageEvent, false);

  return (
    //for writers
    <div>
      {getEnvVariablesSuccess && (
        <div className="App">
          {!mulitpleTabs && (
            <Router>
              {/* <Auth> */}
              <Routes>
                <Route
                  exact
                  path="/writerDashboard/*"
                  element={
                    <PrivateRoute>
                      {/* <Home /> */}
                      <WriterContentContainer />
                    </PrivateRoute>
                  }
                />
                {/* <Route exact path="/login" element={<LandingPage />} /> */}
                {/* <Route exact path="/signup" element={<OnBoarding />} /> */}
                <Route exact path="/signup" element={<SignUp />} />
                <Route exact path="/login" element={<SignIn />} />
                {/* <Route exact path="/pick" element={<PickFavWriters />} /> */}
                {/* <Route
                  exact
                  path="/story"
                  element={
                    <PrivateRoute>
                      <WriterEditor />
                    </PrivateRoute>
                  }
                /> */}
                <Route
                  exact
                  path="/publication/:username/:publicationName"
                  element={
                    <PrivateRoute>
                      <AboutPublication />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/publication/edit"
                  element={
                    <PrivateRoute>
                      <WriterPublicationEditor />
                    </PrivateRoute>
                  }
                />
                 <Route
               exact
               path="/homepage"
               element={
                 <PrivateRoute>
                   <Homepage />
                 </PrivateRoute>
               }
	             />
                <Route
                  exact
                  path="/writersettings"
                  element={
                    <PrivateRoute>
                      <WriterSetting />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <NotFound />
                    </PrivateRoute>
                  }
                />
              </Routes>
              {/* </Auth> */}
            </Router>
          )}
          {mulitpleTabs && <MultipleTab />}
          <CustomizedSnackbars
            variant={variant}
            message={message}
            openS={open}
          />
          {/* <Navbar /> */}
        </div>
      )}
    </div>
  );
}

export default App;
