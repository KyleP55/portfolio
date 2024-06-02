import { useState } from "react";

function CreateRoomPopUp({ onCreate, onClose }) {
    const [roomName, setRoomName] = useState('');
    const [visability, setVisability] = useState('public');

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
                        value="public"
                        name="visability"
                        checked={visability === 'public'}
                        onChange={onOptionChange}
                    /> Public
                </div>
                <div>
                    <input
                        type='radio'
                        value="private"
                        name="visability"
                        checked={visability === 'private'}
                        onChange={onOptionChange}
                    /> Private
                </div>
            </div>

            <button onClick={onCreate.bind(this, roomName, visability)}>
                Create
            </button>
            <button onClick={onClose}>
                Cancel
            </button>
        </form>
    </div>)
}

export default CreateRoomPopUp;