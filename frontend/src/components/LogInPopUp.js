import axios from 'axios';
import { useContext, useState } from 'react';

import { UserContext } from '../context/userContext';

function LogInPopUp({ toggle }) {
    const userContext = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    async function onSubmit(e) {
        e.preventDefault();

        try {
            const info = {
                email: email,
                password: pass
            }

            await axios.post('/accounts/login', info)
                .then((res) => {
                    userContext.setUser(res.data.id, res.data.token, res.data.userName);
                })
        } catch (err) {

        }
    }

    return (<>
        <div className="formPopUp">
            <form className="popUpBorder">
                <h1>Login</h1><br />

                <label><b>Email</b></label>
                <input
                    type="text"
                    placeholder='Enter Email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />

                <label><b>Password</b></label>
                <input
                    type="password"
                    placeholder='Enter Password'
                    onChange={(e) => setPass(e.target.value)}
                    value={pass}
                />

                <div className="formButtonContainer">
                    <button type="button" className="button" onClick={onSubmit}>Login</button>
                    <button type="button" className="button cancel" onClick={toggle}>Close</button>
                </div>
            </form>
        </div>
    </>);
}

export default LogInPopUp;