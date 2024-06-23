import { useState, useEffect, useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

import "../css/topNavBar.css";

import { UserContext } from "../context/userContext";
import LogInPopUp from "./LogInPopUp.js";
import logo from '../images/chatIcon.png';
import accountIcon from '../images/accountIcon.png';
import notificationIcon from '../images/notificationIcon.png';

const serverURL = process.env.REACT_APP_BACKEND_URL;
let mobileDropDown = false;

function TopNavBar() {
    const userContext = useContext(UserContext);
    const [logInWindow, setLogInWindow] = useState(false);
    const [notifications, setNotifications] = useState();
    const [socketLogOut, setSocketLogOut] = useState(false);

    // Check for Cookie Token/Get notifications
    useEffect(() => {
        let token = Cookies.get('token');
        let accountID = null;

        // Restore Session
        async function restoreSession() {
            try {
                await axios.get(`${serverURL}/authAccounts/context`, { headers: { Authorization: "bearer " + token } })
                    .then((res) => {
                        if (res.data.message === "jwt expired" || !res.status === "OK") return logOut();
                        let x = res.data;
                        userContext.setUser(x._id, token, x.userName, x.email, x.rooms, x.friends);
                        accountID = x._id;
                        console.log(x)
                    });
            } catch (err) {
                alert('Error Connected to Backend');
            }
        }

        // Get Notifications
        async function getNotifications() {
            try {
                if (!accountID) accountID = userContext.id;
                await axios.get(`${serverURL}/notifications/${accountID}`, { headers: { Authorization: "bearer " + token } })
                    .then((res) => {
                        if (res.data.length > 0) setNotifications(res.data);
                    });
            } catch (err) {
                alert(err.message);
            }
        }

        if (token && !userContext.userName) restoreSession();
        getNotifications();
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
        userContext.setUser(null, null, null, null, null, null);
        setSocketLogOut(true);
    }

    // Toggle Mobile Nav
    function onMobileNavClick() {
        let dropDown = document.getElementById('topNavMenu');
        if (mobileDropDown) {
            dropDown.style.height = "0px";
        } else {
            dropDown.style.height = "120px";
        }

        mobileDropDown = !mobileDropDown;
    }

    // Mobile Nav Usage
    function mobileNavFunc(option) {
        mobileDropDown = false;
        document.getElementById('topNavMenu').style.height = "0px";
        if (userContext.id) {
            if (option == 0) logOut();
            if (option == 1) console.log('my account');
        } else {
            if (option == 0) console.log('goto log in page');
            if (option == 1) window.open("/createAccount");
        }
        if (option == 2) console.log('notification drop down');
    }

    // Links depending on signed in or not
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
        <a>
            <div>
                <img src={notificationIcon} alt="Menu Icon" height="28" className="menuIcon" />
                {notifications &&
                    <div className="notificationNumber">
                        {notifications.length}
                    </div>
                }
            </div>
        </a>
    </>

    const mobileUnauthed = <>
        <a onClick={mobileNavFunc.bind(this, 0)} className="">
            Log In
        </a>
        <a onClick={mobileNavFunc.bind(this, 0)} className="">
            Create Account
        </a>
    </>

    const mobileAuthed = <>
        <a onClick={mobileNavFunc.bind(this, 0)} className="">
            Log Out
        </a>
        <a onClick={mobileNavFunc.bind(this, 0)} className="">
            My Account
        </a>
    </>

    // JSX
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
                <img src={accountIcon} alt="Menu Icon" height="38" className="menuIcon" />
                {notifications &&
                    <div className="notificationNumber">
                        {notifications.length}
                    </div>
                }
            </div>
        </div>
        <div className="topNavMenu" id="topNavMenu">
            {!userContext.id && mobileUnauthed}
            {userContext.id && mobileAuthed}
            <a onClick={mobileNavFunc.bind(this, 0)} className="">
                Notifications
            </a>
        </div>
        <Outlet context={[socketLogOut, setSocketLogOut]} />
    </>)
}

export default TopNavBar;