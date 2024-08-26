import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

import '../css/form.css'

import { UserContext } from '../context/userContext';
const serverURL = process.env.REACT_APP_BACKEND_URL;

function LogInPage() {
    const userContext = useContext(UserContext);
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    async function onSubmit(e) {
        e.preventDefault();

        try {
            const info = {
                email: email,
                password: pass
            }

            console.log(serverURL)

            await axios.post(serverURL + '/accounts/login', info)
                .then((res) => {
                    if (res.data.message) return alert('Error: ' + res.data.message)
                    let x = res.data;
                    userContext.setUser(x.id, x.token, x.userName, x.email, x.rooms, x.friends);

                    Cookies.set('token', res.data.token, { expires: 7 });
                    nav("/home")
                })
        } catch (err) {
            alert(err.message);
        }
    }

    return (<>
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-4 col-md-8 col-xs-12 mx-auto">
                    <div className="formContainer">
                        <form>
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
                                <button type="button" className="chatNavButton" onClick={onSubmit}>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>);

}

export default LogInPage;