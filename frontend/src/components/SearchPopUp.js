import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { UserContext } from '../context/userContext.js';

const serverURL = process.env.REACT_APP_BACKEND_URL;

function SearchPopUp({ isRoom, onClose }) {
  const userContext = useContext(UserContext);
  const [pubRooms, setPubRooms] = useState();
  const [searchText, setSearchText] = useState('');

  // Load all public rooms
  useEffect(() => {
    async function getRooms() {
      try {
        axios.get(`${serverURL}/rooms/public`, { headers: { Authorization: 'bearer: ' + userContext.token}})
        .then((res) => {
          if (res.data) {
            // check what rooms you are already joined
            let newArr = [...res.data];
            res.data.forEach((r, i) => {
              userContext.rooms.forEach((myR) => {
                if (r._id === myR._id) newArr.splice(i, 1);
              });
            });
            setPubRooms([...newArr]);
          }
        });
      } catch(err) {
        alert(err.message);
      }
    }

    getRooms();
  }, []);

  // Join Room
  async function onRoomClick(room) {
    // Confirm
    let answer = window.confirm('Join room ' + room.name + '?');
    if (!answer) {
      return;
    }

    const info = {
      _id: userContext.id,
      roomID: room._id
    }

    try {
      axios.post(
        `${serverURL}/authAccounts/joinRoom`,
        info,
        { headers: { Authorization: "bearer " + userContext.token }}
      ).then((res) => {
        userContext.setRooms([...userContext.rooms, res.data]);
      });
    } catch(err) {
      alert(err.message);
    }
  }

  const roomForm = <>
    <div className="findDiv">
      <div className="findCloseDiv"><div className="findCloseBtn" onClick={onClose}>
              <p>&times;</p>
          </div></div>

      <div className="roomsDiv">
        {pubRooms && pubRooms.map((r) => {
          return <button key={r._id}
            className='chatNavButton'
            onClick={onRoomClick.bind(this, r)}>
              {r.name}
            </button>
        })}
      </div>
      <label><b>Search:</b></label>
      <input
          type="text"
          placeholder='Enter Room Name'
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
      />
    </div>
  </>

  
  return(<div className="popupContainer">
    {isRoom && roomForm}
  </div>);
}

export default SearchPopUp;