import { useContext } from "react";
import axios from "axios";

import { UserContext } from "../context/userContext.js";

const serverURL = process.env.REACT_APP_BACKEND_URL;

function NotificationsPopUp() {
    const userContext = useContext(UserContext);

    async function onClick(index) {
        // Friend Request
        if (userContext.notifications[index].type === "Friend Request") {
            let name = userContext.notifications[index].message.split(' wants')[0];
            let answer = window.confirm("Accept " + name + "'s friend request?");
            if (answer) {
                try {
                    await axios.post(
                        `${serverURL}/notifications/acceptfriend/${userContext.notifications[index]._id}`,
                        null,
                        {
                            headers: { Authorization: "bearer " + userContext.token }
                        }
                    ).then((res) => {
                        if (res.status === 200) {
                            let newArr = userContext.notifications;
                            newArr = newArr.splice(index, 1);
                            userContext.setNotifications([...newArr]);
                        }
                    });
                } catch (err) {
                    console.log(err.message);
                }
            }
        }
    }

    return (<div className='notificationsContainer' id='notificationsContainer'>
        {userContext.notifications && userContext.notifications.map((notification, i) => {
            return <div onClick={onClick.bind(this, i)} key={i} className="notification">
                <p className='notificationTitle'>{notification.type}</p>
                <p className='notificationText'>{notification.message}</p>
                <p className='notificationDate'>{notification.date}</p>
            </div>
        })}
    </div>)
}

export default NotificationsPopUp;