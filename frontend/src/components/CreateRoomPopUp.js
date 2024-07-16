import { useState } from "react";

function CreateRoomPopUp({ onCreate, onClose }) {
    const [roomName, setRoomName] = useState('');
    const [visability, setVisability] = useState(true);

    function onOptionChange(e) {
        setVisability(e.target.value);
    }

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
                        checked={visability === true}
                        onChange={onOptionChange}
                    /> Public
                </div>
                <div>
                    <input
                        type='radio'
                        value={false}
                        name="visability"
                        checked={visability === false}
                        onChange={onOptionChange}
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