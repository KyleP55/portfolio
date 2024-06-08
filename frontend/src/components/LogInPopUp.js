import axios from 'axios';
import { useContext, useState } from 'react';
import Cookies from 'js-cookie';

import '../css/form.css'

import { UserContext } from '../context/userContext';
const serverURL = process.env.REACT_APP_BACKEND_URL;

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

            await axios.post(serverURL + '/accounts/login', info)
                .then((res) => {
                    let x = res.data;
                    userContext.setUser(x.id, x.token, x.userName, x.email, x.rooms, x.friends);

                    Cookies.set('token', res.data.token, { expires: 1 });
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