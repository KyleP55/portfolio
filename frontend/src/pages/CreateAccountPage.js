import { useState } from 'react';

import AccountCreationForm from '../components/AccountCreationForm.js';
import AccountCreated from '../components/AccountCreated.js';


function CreateAccountPage() {
    const [created, setCreated] = useState(false);

    function toggle() {
        setCreated(true);
    }

    return (<>
        {!created && <AccountCreationForm created={toggle} />}
        {created && <AccountCreated />}
    </>);
}

export default CreateAccountPage;