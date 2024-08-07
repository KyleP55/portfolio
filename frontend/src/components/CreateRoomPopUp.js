import { useState } from "react";

function CreateRoomPopUp({ onCreate, onClose }) {
    const [roomName, setRoomName] = useState('');
    const [visability, setVisability] = useState(true);

    return (<div className="popupContainer">
        <form>
            <label>Room Name</label>
            <input
                type="text"
                placeholder='Room Name'
                onChange={(e) => setRoomName(e.target.value)}
                value={roomName}
                id="messageInput"
            />
            <div className="radioDiv">
                <div>
                    <input
                        type='radio'
                        value={true}
                        name="visability"
                        onChange={() => setVisability(true)}
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

            <button onClick={(e) => {
                e.preventDefault();
                onCreate(roomName, visability);
            }}>
                Create
            </button>
            <button onClick={onClose}>
                Cancel
            </button>
        </form>
    </div>)
}

export default CreateRoomPopUp;