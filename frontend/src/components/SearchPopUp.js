import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { UserContext } from '../context/userContext.js';
import { socket } from "../util/socket.js";

const serverURL = process.env.REACT_APP_BACKEND_URL;

function SearchPopUp({ isRoom, onClose }) {
  const userContext = useContext(UserContext);
  const [pubRooms, setPubRooms] = useState();
  const [searchText, setSearchText] = useState('');

  // Load all public rooms
  useEffect(() => {
    async function getRooms() {
      try {
        axios.get(`${serverURL}/rooms/public`, { headers: { Authorization: 'bearer: ' + userContext.token } })
          .then((res) => {
            if (res.data) {
              // check what rooms you are already joined
              let newArr = [...res.data];

              res.data.forEach((r, i) => {
                userContext.rooms.forEach((myR) => {
                  if (r._id === myR._id) newArr.splice(i, 1);
                  i--;
                });
              });
              setPubRooms([...newArr]);
            }
          });
      } catch (err) {
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
        { headers: { Authorization: "bearer " + userContext.token } }
      ).then((res) => {
        userContext.setRooms([...userContext.rooms, res.data]);
        socket.emit('joinRoom', res.data._id);
      });
    } catch (err) {
      alert(err.message);
    }
  }

  // Search Room
  async function searchRoom() {
    let found = false;
    // Check if you belong to room already
    userContext.rooms.forEach((r) => {
      if (r.name === searchText) {
        alert('You already belong to this room!');
        found = true;
      }
    });
    if (found) return;


    try {
      const res = await axios.get(`${serverURL}/rooms/search/${searchText}`,
        { headers: { Authorization: 'bearer ' + userContext.token } }
      );

      if (res.data.errorMessage) {
        alert(res.data.errorMessage);
        return;
      } else {
        // Confirm
        let answer = window.confirm('Join room ' + res.name + '?');
        if (!answer) {
          return;
        }

        const info = {
          _id: userContext.id,
          roomID: res.id
        }

        // ********** ADD PUBLIC CHECK ******
        // Join Room
        axios.post(
          `${serverURL}/authAccounts/joinRoom`,
          info,
          { headers: { Authorization: "bearer " + userContext.token } }
        ).then((res) => {
          userContext.setRooms([...userContext.rooms, res.data]);
          socket.emit('joinRoom', res.data._id);
        });

        alert('Request to join room ' + searchText + ' sent!');
      }


    } catch (err) {
      console.log(err.message);
    }
  }

  // User Search
  async function searchUser() {
    let found = false;
    // Check if you already have this friend
    userContext.friends.forEach((r) => {
      if (r.userName === searchText) {
        alert('You already belong to this room!');
        found = true;
      }
    });
    if (found) return;

    try {
      const res = await axios.get(`${serverURL}/authAccounts/getUsers/${searchText}`,
        { headers: { Authorization: 'bearer ' + userContext.token } }
      );

      if (res.data.errorMessage) {
        alert(res.data.errorMessage);
        return;
      } else {
        // Confirm
        let answer = window.confirm('Send friend request to ' + res.body.name + '?');
        if (!answer) {
          return;
        }

        // Add Friend
        const info = {
          id: userContext.id,
          name: res.body.name
        }

        axios.post(
          `${serverURL}/authAccounts/joinRoom`,
          info,
          { headers: { Authorization: "bearer " + userContext.token } }
        ).then((res) => {
          userContext.setRooms([...userContext.friends, res.data]);
          socket.emit('joinRoom', res.data._id);
        });
        alert('Friend request sent to ' + searchText + '!');
      }


    } catch (err) {
      console.log(err.message);
    }
  }

  const roomForm = <>
    <div className="roomsListDiv">
      {pubRooms && pubRooms.map((r) => {
        return <button key={r._id}
          className='chatNavButton'
          onClick={onRoomClick.bind(this, r)}>
          {r.name}
        </button>
      })}
      {pubRooms && pubRooms.length < 1 &&
        <h2 className="centerTitle">No Public Rooms To Join</h2>}
    </div>
    <label><b>Search:</b></label>
    <input
      type="text"
      placeholder='Enter Room Name'
      onChange={(e) => setSearchText(e.target.value)}
      value={searchText}
    />
    <div className="chatNavButton" onClick={searchRoom}>
      Search
    </div>
  </>

  const friendForm = <>
    <label><b>Search:</b></label>
    <input
      type="text"
      placeholder='Enter User Name'
      onChange={(e) => setSearchText(e.target.value)}
      value={searchText}
    />
    <div className="chatNavButton" onClick={searchUser}>
      Search
    </div>
  </>

  return (<div className="popupContainer">
    <div className="findDiv">
      <div className="findCloseDiv"><div className="findCloseBtn" onClick={onClose}>
        <p>&times;</p>
      </div></div>
      {isRoom === true && roomForm}
      {/*!isRoom === false && friendForm*/}
    </div>
  </div>);
}

export default SearchPopUp;