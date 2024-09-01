import { useEffect, useContext } from 'react';
import dotsIcon from '../images/dotsIcon.png';

import { UserContext } from '../context/userContext';

function FriendButton({ friend, viewRoom, removeRoom, closeNav }) {
    const usercontext = useContext(UserContext);

    // Color on type of room
    useEffect(() => {
        const element = document.getElementById(friend._id);
        if (!friend.online) {
            element.style.background = '#dbd0d0';
        } else {
            element.style.background = '#04AA6D';
        }
    }, [friend.online]);

    function changeRoom() {
        viewRoom(friend);
        closeNav();
    }

    return <div onClick={changeRoom} key={friend._id} className='chatNavButton' id={friend._id}>
        {friend.userName}
        <div onClick={(e) => {
            e.stopPropagation();
            removeRoom(friend, 'friend');
        }}>
            <img src={dotsIcon} className="dotsIcon" width="30px" />
        </div>
    </div>
}

export default FriendButton;