import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Cookie from 'js-cookie';

const PrivateRoute = ({ children }) => {
    const alreadySignedIn = Cookie.get('accessToken');
    // if ((localStorage.getItem('categories') === undefined || localStorage.getItem('categories') === null) && Cookie.get('accessToken')) { //add after create Profile and delete after map interest
    //     // console.log('g');
    //     return <Navigate to="/signup" />;
    // }
    // const [authenticated, setAuthenticated] = useState(false);
    return alreadySignedIn ? children : <Navigate to="/login" />;
}

export default PrivateRoute;