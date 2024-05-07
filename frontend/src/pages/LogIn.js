import { useState } from 'react';

import "../css/form.css";

function LogIn() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState();

    return (<div>
        <h1>Log In!</h1>
        <form>
            <label>Access Code:</label>
            <input
                type="text"
                placeholder='Enter Code'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                maxlength="4"
            />

            <label>Access Code:</label>
            <input
                type="text"
                placeholder='Enter Code'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                maxlength="4"
            />
            <p className='errorMessage'>{error}</p>
        </form>
    </div>)
}

export default LogIn;