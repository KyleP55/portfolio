import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { UserContext } from '../context/userContext.js';

const serverURL = process.env.REACT_APP_BACKEND_URL;

function FindPopup({ isRoom, onClose }) {
  const userContext = useContext(UserContext);
  const [pubRooms, setPubRooms] = useState();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    async function getRooms() {
      axios.get(`${serverURL}/public`, { headers: { Authorization: 'bearer: ' + userContext.token}})
      .then((res) => {
        setPubRooms([...res.data]);
      });
    }

    getRooms();
  }, []);

  const roomForm = <>
    <div>
      {pubRooms && pubRooms.map((r) => {
        return <div key={r._id}
          className='chatNavButton'
          onClick={(e) => console.log(e)}>
            {r.name}
          </div>
      })}
    </div>
    <label><b>Search:</b></label>
    <input
        type="text"
        placeholder='Enter Room Name'
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
    />
  </>

  
  return(<div className="popupContainer">
    {isRoom && roomForm}
  </div>);
}

export default FindPopup();