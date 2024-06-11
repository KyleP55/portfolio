import { useState, useEffect, useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

import "../css/topNavBar.css";

import { UserContext } from "../context/userContext";
import LogInPopUp from "./LogInPopUp.js";
import logo from '../images/chatIcon.png';
import menuIcon from '../images/menuIcon.png';

const serverURL = process.env.REACT_APP_BACKEND_URL;

function TopNavBar() {
    const userContext = useContext(UserContext);
    const [logInWindow, setLogInWindow] = useState(false);

    // Check for Cookie Token
    useEffect(() => {
        let token = Cookies.get('token');
        async function restoreSession() {
            try {
                await axios.get(`${serverURL}/authAccounts/context`, { headers: { Authorization: "bearer " + token } })
                    .then((res) => {
                        if (res.data.message === "jwt expired") return logOut();
                        let x = res.data;
                        userContext.setUser(x._id, token, x.userName, x.email, x.rooms, x.friends);
                    });
            } catch (err) {
                alert('Error Connected to Backend');
            }
        }
        if (token && !userContext.userName) restoreSession();
    }, []);

    // Toggle Login Pop Up
    function toggleWindow() {
        if (logInWindow) {
            setLogInWindow(false);
        } else {
            setLogInWindow(true);
        }
    }

    // Sign Out
    function logOut() {
        Cookies.remove('token');
        window.location.reload();
    }

    // Toggle Mobile Nav
    function onMobileNavClick() {
        document.getElementById('topNavMenu').style.height = "200px"
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
        <p className="accountText">Welcome Back {userContext.userName}!</p>
        <a onClick={logOut} className="accountText">
            Log Out
        </a>
        <Link to="/account/login" className="accountText">
            My Account
        </Link>
    </>

    return (<>
        <div className="header">
            <div className="logo">
                <img src={logo} alt="Chat Icon" height="44" className="logoIcon" />
                <h3 className="nameText">Chatty App!</h3>
            </div>

            <div className="accountBars navLinks">
                {!userContext.id && unauthed}
                {userContext.id && authed}
            </div>
        </div>
        <div className="navHeader">
            <div className="logo">
                <img src={logo} alt="Chat Icon" height="44" className="logoIcon" />
            </div>
            <h3 className="nameText">Chatty App!</h3>
            <div id="menuIcon" onClick={onMobileNavClick}>
                <img src={menuIcon} alt="Menu Icon" height="38" className="menuIcon" />
            </div>
        </div>
        <div className="topNavMenu" id="topNavMenu">
            <a>test</a>
            <a>test2</a>
            <a>test3</a>
        </div>
        <Outlet />
    </>)
}

export default TopNavBar;