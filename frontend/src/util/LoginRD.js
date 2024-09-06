import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { UserContext } from "../context/userContext";
 
const LoginRD = ({ children, loginPage }) => {
  const userContext = useContext(UserContext);

  if (loginPage) {
    return userContext.id ? <Navigate to='/home' /> : children;
  }
  return userContext.id ? children : <Navigate to='/' />;
}
 
export default LoginRD;