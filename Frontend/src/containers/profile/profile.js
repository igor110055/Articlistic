import React from 'react'
import UserPanel from './user-panel/user.panel'
import Userstories from './user-stories/user-stories'
import './profile.css'
import TempNavbar from "../navbar/tempNavbar";
const Profile = () => {
  return (<>
    <div id="index-navbar">
        <TempNavbar />
      </div>
      <UserPanel/>
    <div className='data'>
         
        
        <Userstories/>
    </div></>
  )
}

export default Profile