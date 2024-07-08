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
import NotificationsPopUp from "./NotificationsPopUp.js";

const serverURL = process.env.REACT_APP_BACKEND_URL;
let mobileDropDown = false;
let notificationsOpen = false;

function TopNavBar() {
    const userContext = useContext(UserContext);
    const [logInWindow, setLogInWindow] = useState(false);
    const [socketLogOut, setSocketLogOut] = useState(false);
    const [updateFriendsID, setUpdateFriendsID] = useState();

    // Check for Cookie Token/Get 
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
        Cookies.remove('sSID');
        userContext.setUser(null, null, null, null, null, null, null);
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

    // Toggle notifications
    function onNotifications() {
        if (notificationsOpen) {
            document.getElementById('notificationsContainer').style.left = "100vw";
            notificationsOpen = false;
        } else {
            document.getElementById('notificationsContainer').style.left = "calc(100vw - 300px)";
            notificationsOpen = true;
        }
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
            <div onClick={onNotifications}>
                <img src={notificationIcon} alt="Menu Icon" height="28" className="menuIcon" />
                {userContext.notifications.length > 0 &&
                    <div className="notificationNumber">
                        {userContext.notifications.length}
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
        {/* Desktop/Tablet */}
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
        {/* Mobile */}
        <div className="navHeader">
            <div className="logo">
                <img src={logo} alt="Chat Icon" height="44" className="logoIcon" />
            </div>
            <h3 className="nameText">Chatty App!</h3>
            <div id="menuIcon" onClick={onMobileNavClick}>
                <img src={accountIcon} alt="Menu Icon" height="38" className="menuIcon" />
                {userContext.notifications > 0 &&
                    <div className="notificationNumber">
                        {userContext.notifications.length}
                    </div>
                }
            </div>
        </div>
        {/* Mobile Drop Down Menu */}
        <div className="topNavMenu" id="topNavMenu">
            {!userContext.id && mobileUnauthed}
            {userContext.id && mobileAuthed}
            <a onClick={mobileNavFunc.bind(this, 0)} className="">
                Notifications
            </a>
        </div>
        <NotificationsPopUp closeNotifications={onNotifications} />
        <Outlet context={[socketLogOut, setSocketLogOut]} />
    </>)
}

export default TopNavBar;