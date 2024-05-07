import { useState } from 'react';

import SideNav from '../components/ui/SideNav';
import AccountCreationForm from '../components/semi-pages/AccountCreationForm.js';
import AccountCreated from '../components/semi-pages/AccountCreated.js';


function CreateAccountPage() {
    const [created, setCreated] = useState(false);

    function toggle() {
        setCreated(true);
    }

    return (<>
        <SideNav />
        {!created && <AccountCreationForm created={toggle} />}
        {created && <AccountCreated />}
    </>);
}

export default CreateAccountPage;