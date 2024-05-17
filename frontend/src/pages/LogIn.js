import { useState } from 'react';

import "../css/form.css";

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();

    return (<div>
        <h1>Log In!</h1>
        <form>
            <label>User Email:</label>
            <input
                type="text"
                placeholder='email@email.com'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                maxlength="4"
            />

            <label>Password:</label>
            <input
                type="text"
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                maxlength="4"
            />
            <p className='errorMessage'>{error}</p>
        </form>
    </div>)
}

export default LogIn;