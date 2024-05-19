import { useState, useEffect, useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";

import "../css/topNavBar.css";

import LogInPopUp from "./LogInPopUp.js";

function TopNavBar() {
    const userContext = useContext(UserContext);
    const [logInWindow, setLogInWindow] = useState(false);

    function toggleWindow() {
        if (logInWindow) {
            setLogInWindow(false);
        } else {
            setLogInWindow(true);
        }
    }

    const unauthed = <>
        {logInWindow && <LogInPopUp toggle={toggleWindow} />}
        <a onClick={toggleWindow} className="accountText">
            Log In
        </a>
        <Link to="/createAccount" className="accountText">
            Create Account
        </Link>
    </>

    const authed = <>
        <p>Welcome Back {userContext.userName}</p>
        <a onClick={console.log('todo')} className="accountText">
            Log Out
        </a>
        <Link to="/account/login" className="accountText">
            My Account
        </Link>
    </>

    return (<>
        <div className="header">
            <div className="logo">
                <p>** logo **</p>
            </div>
            <div className="searchBar">

            </div>
            <div className="accountBars">
                {!userContext.id && unauthed}
                {userContext.id && authed}
            </div>
        </div>
        <Outlet />
    </>)
}

export default TopNavBar;