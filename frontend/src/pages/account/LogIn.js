import { useState } from 'react';

import "../../css/form.css";

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (<div className="container">
        <form>
            <div className="block">
                <label>Email:</label>
                <input />
            </div>
            <div className="block">
                <label>Password:</label>
                <input />
            </div>
            <div>
                <button>Sign In</button>
            </div>
            <div>
                <button>Sign In as Guest</button>
            </div>
            <div>
                <button>Create Account</button>
            </div>
        </form>
    </div>)
}

export default LogIn;