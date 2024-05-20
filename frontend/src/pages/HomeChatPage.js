

import ChatNav from "../components/ChatNav.js";



function HomeChatPage() {

    return (<div className="container-fluid">
        <div className="row vh-100">
            <ChatNav />
            <div className="col-lg-10">
                <p>Some Chat Boxes</p>
            </div>

        </div>
    </div>);
}

export default HomeChatPage;