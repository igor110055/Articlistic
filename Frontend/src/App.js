import { getEnvVariables } from "./config";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/privateRoute";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import WriterForm from "./containers/writerform/writerForm";
import WriterSetting from "./containers/writerEditor/writerSetting";
import WriterEditor from "./containers/writerEditor/writerEditor";
import WriterContentContainer from "./containers/writerContent/writerContentContainer";
import NotFound from "./components/notFound";
import CustomizedSnackbars from "./components/materialuiSnackbar";
import { showSnackbar } from "./containers/common/commonActions";
import WriterPublicationEditor from "./containers/writerContent/writerPublicationEditor";
import AboutPublication from "./containers/writerContent/aboutPublication";
import "./App.css";
import MultipleTab from "./utils/MultipleTab";
import MainLoader from "./components/mainLoader";
import SignUp from "./containers/authentication/signup";
import SignIn from "./containers/authentication/signin";
import Wallet from "./containers/wallet/wallet";
import Homepage from "./containers/homepage/homepage";

function App() {
  const [getEnvVariablesSuccess, setEnvVariablesSuccess] = useState(false);
  const [mulitpleTabs, setMultipleTabs] = useState(false);
  const { variant, message, open, state } = useSelector((state) => ({
    thisState: state,
    loginError: state.signupReducer.isLoggedIn,
    variant: state.common.snackbar.variant,
    message: state.common.snackbar.message,
    open: state.common.snackbar.open,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    getEnvVariables(
      [
        "REACT_APP_ENCRYPTION_SALT",
        "REACT_APP_SERVER_LINK",
        "GOOGLE_CLIENT_ID",
      ],
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

  useEffect(() => {
    console.log(state);
  }, [state]);

  localStorage.openpages = Date.now();
  var onLocalStorageEvent = function (e) {
    if (e.key === "openpages") {
      // Listen if anybody else is opening the same page!
      localStorage.page_available = Date.now();
    }
    if (e.key === "page_available") {
      setMultipleTabs(true);
    }
  };
  window.addEventListener("storage", onLocalStorageEvent, false);

  return (
    //for writers
    <div>
      {getEnvVariablesSuccess ? (
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
                <Route exact path="/signup" element={<SignUp />} />
                <Route exact path="/login" element={<SignIn />} />
                <Route exact path="/login/writer" element={<WriterForm />} />
                <Route
                  exact
                  path="/story"
                  element={
                    <PrivateRoute>
                      <WriterEditor />
                    </PrivateRoute>
                  }
                />
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
                  path="/wallet"
                  element={
                    <PrivateRoute>
                      <Wallet />
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
      ) : (
        <MainLoader />
      )}
    </div>
  );
}

export default App;
