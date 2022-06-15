import React,{useEffect} from "react";
import UserPanel from "./user-panel/user.panel";
import Userstories from "./user-stories/user-stories";
import "./profile.css";
import TempNavbar from "../navbar/tempNavbar";
import { useDispatch, useSelector } from "react-redux";
import { getuser,getArticlesInit } from "./profileAction";
import { getAuthToken, getRefreshToken } from "../common/commonFunctions";
import { useLocation,useHistory } from 'react-router-dom';
const Profile = () => {
    const dispatch=useDispatch();
    const state= localStorage.getItem('user');
    const user = JSON.parse(state);
//    const query = new URLSearchParams(this.props.location.search);
//     console.log(query.get('username'));
    console.log(user);
    useEffect(()=>{
        const token=getAuthToken();
        dispatch(getuser({username:user.userUserName,token}));
        const fetchArticles = skip => {
            const authToken = getAuthToken();
            const data = {
              authToken,
              skip: 0,
              limit: 15,
              filters: "PUBLISHED",
              currentArticles: []
            };
            dispatch(getArticlesInit(data));
          };
          fetchArticles();
    },[])
  return (
    <>
      <div id="index-navbar">
        <TempNavbar />
      </div>
      <div className="profile-page">
        <UserPanel />
        <div className="data">
          <Userstories />
        </div>
      </div>
    </>
  );
};

export default Profile;
