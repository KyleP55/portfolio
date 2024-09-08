import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

import { emailVali, passVali, passMatch, userVali } from '../util/formValidation.js';
import { UserContext } from '../context/userContext.js'

const serverURL = process.env.REACT_APP_BACKEND_URL;

function AccountCreationForm({ created }) {
    const nav = useNavigate();
    const userContext = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState([null, null, null, null]);

    useState(() => { console.log(confirmPassword) }, [confirmPassword])
    // Submit button
    async function onSubmitHandler(e) {
        e.preventDefault();
        const emailRes = await emailVali(email);
        const userRes = await userVali(name);

        // Check Validation/Set errors
        const newError = error.map((err, i) => {
            if (i === 0) return (emailRes);
            if (i === 1) return (passVali(password));
            if (i === 2) return (passMatch(password, confirmPassword));
            if (i === 3) return (userRes);
            return (null);
        });
        setError([...newError]);

        // Check if any errors exists
        let errors = false;
        newError.forEach((i) => { if (i !== null) errors = true; });
        if (errors) return;

        // Submit New Account
        const info = {
            email: email,
            password: password,
            userName: name,
        }

        try {
            await axios.post(serverURL + '/accounts/createAccount', info).then((res) => {
                const x = res.data;
                console.log(x);
                userContext.setUser(x.id, x.token, x.userName, email, ['66632d638777e339d560e413'], []);

                alert('Account Created!');

                Cookies.set('token', x.token, { expires: 7 });
                nav("/home");
            });
        } catch (err) {
            alert(err);
        }
    }

    return (<>
        <div className="row justify-content-center">
            <div className="col-xs-12 col-md-8 col-lg-6">
                <p className="center"><b>Note:</b> This server does <b>NOT</b> use https and does not recommend using real passwords or emails. This website does not require a valid email and does not have any password requirements.</p>
                <form className="formContainer">
                    <h1>Create Account!</h1>

                    <label>Email:</label>
                    <input
                        type="text"
                        placeholder='Enter Email'
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <p className='errorMessage'>{error[0]}</p>


                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder='Enter Password'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <p className='errorMessage'>{error[1]}</p>

                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                    <p className='errorMessage'>{error[2]}</p>

                    <label>User Name:</label>
                    <input
                        type="text"
                        placeholder='Enter User Name'
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    <p className='errorMessage'>{error[3]}</p>

                    <div className="formButtonContainer">
                        <button onClick={onSubmitHandler} className="button">Create</button>
                        <button onClick={() => nav('/')} className="button cancel">Back</button>
                    </div>
                </form>
            </div>
        </div>
    </>);
}

export default AccountCreationForm;