import { Navigate } from "react-router-dom";
import Cookie from "js-cookie";

const PrivateRoute = ({ children }) => {
  const alreadySignedIn = Cookie.get("accessToken");
  return alreadySignedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
