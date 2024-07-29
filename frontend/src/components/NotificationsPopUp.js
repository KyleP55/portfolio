import { useContext } from "react";
import axios from "axios";
import { socket } from "../util/socket.js";

import { UserContext } from "../context/userContext.js";

const serverURL = process.env.REACT_APP_BACKEND_URL;

function NotificationsPopUp({ closeNotifications }) {
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
                            let targetID = userContext.notifications[index].from;
                            let newArr = [...userContext.notifications];
                            newArr.splice(index, 1);
                            userContext.setNotifications([...newArr]);

                            // update friends list
                            try {
                                axios.get(
                                    `${serverURL}/authAccounts/friends`,
                                    {
                                        headers: { Authorization: "bearer " + userContext.token },
                                        params: { id: userContext.id }
                                    }
                                ).then((res) => {
                                    userContext.setFriends([...res.data]);
                                });

                                // Send friend accepted notification
                                let info = {
                                    target: name,
                                    type: 'Accepted Friend Request',
                                    from: userContext.id,
                                    message: name + " accepted your friend request!"
                                }

                                axios.post(
                                    `${serverURL}/notifications/`,
                                    info,
                                    {
                                        headers: { Authorization: "bearer " + userContext.token }
                                    }
                                ).then((res) => {
                                    socket.emit('sendNotification', info);
                                });
                            } catch (err) {
                                console.log(err.message);
                            }

                            socket.emit('updateFriends', targetID);
                        }
                    });
                } catch (err) {
                    console.log(err.message);
                }
            }
        }
    }

    return (<div className='notificationsContainer' id='notificationsContainer'>
        <div className="closeBtnDiv"><div className="closebtn" onClick={closeNotifications}>
            &times;
        </div></div>
        {userContext.notifications.length > 0 && userContext.notifications.map((notification, i) => {
            return <div onClick={onClick.bind(this, i)} key={i} className="notification">
                <p className='notificationTitle'>{notification.type}</p>
                <p className='notificationText'>{notification.message}</p>
                <p className='notificationDate'>{notification.date}</p>
            </div>
        })}
        {userContext.notifications.length == 0 && <h2>No notifications!</h2>}
    </div>)
}

export default NotificationsPopUp;