import { Link } from "react-router-dom";

function AccountCreated() {
    return (<>
        <div className="page">
            <h1>Account Created!</h1>
            <Link to='/'>Back to Home</Link>
        </div>
    </>)
}

export default AccountCreated;