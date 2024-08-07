import { useEffect } from 'react';
import dotsIcon from '../images/dotsIcon.png';
import hideIcon from '../images/hide.png';

function RoomButton({ info, viewRoom, removeRoom }) {

    function changeRoom() {
        viewRoom(info);
    }

    return <button onClick={changeRoom} className='chatNavButton' id={info._id}>
        {!info.public && <img src={hideIcon} className="hideIcon" height="16px" />}
        {info.name}
        <div onClick={(e) => {
            e.stopPropagation();
            removeRoom(info, 'room');
        }}>
            <img src={dotsIcon} className="dotsIcon" width="30px" />
        </div>
    </button>
}

export default RoomButton;