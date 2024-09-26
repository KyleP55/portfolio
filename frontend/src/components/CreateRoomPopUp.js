import { useState } from "react";

function CreateRoomPopUp({ onCreate, onClose }) {
    const [roomName, setRoomName] = useState('');
    const [visability, setVisability] = useState(true);

    return (<div className="popupContainer">
        <div className="findCloseDiv">
            <div className="findCloseBtn" onClick={onClose}>
        <p>&times;</p></div>
      </div>
      <h3 className="center">Create Room</h3>
        <form>
            <label>Room Name:</label>
            <input
                type="text"
                placeholder='Room Name'
                onChange={(e) => setRoomName(e.target.value)}
                value={roomName}
                className='messageInput'
                id="messageInput"
            />
            <div className="radioDiv">
                <div>
                    <input
                        type='radio'
                        value={true}
                        name="visability"
                        onChange={() => setVisability(true)}
                        checked
                    /> Public
                </div>
                <div>
                    <input
                        type='radio'
                        value={false}
                        name="visability"
                        onChange={() => setVisability(false)}
                    /> Private
                </div>
            </div>

            <button 
                className="chatNavButton" 
                onClick={(e) => {
                e.preventDefault();
                onCreate(roomName, visability);
            }}>
                Create
            </button>
            <button 
                className="chatNavButton"
                onClick={onClose}>
                Cancel
            </button>
        </form>
    </div>)
}

export default CreateRoomPopUp;