import { useState } from 'react';

import AccountCreationForm from '../components/AccountCreationForm.js';
import AccountCreated from '../components/AccountCreated.js';


function CreateAccountPage() {
    const [created, setCreated] = useState(false);

    function toggle() {
        setCreated(true);
    }

    return (<div className="pageContainer">
        {!created && <AccountCreationForm created={toggle} />}
        {created && <AccountCreated />}
    </div>);
}

export default CreateAccountPage;