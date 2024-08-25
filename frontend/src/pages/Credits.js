import logo from '../images/chatIcon.png';
import menuIcon from '../images/menuIcon.png';
import accountIcon from '../images/accountIcon.png';
import notificationIcon from '../images/notificationIcon.png';

function CreditsPage() {
    return (<div>
        <div>
            <h2>Welcome!</h2>
            <p>This is a chat app in progress that still has bugs and features being worked on.</p>
            <h2>To Do:</h2>
            <ol>
                <li>Finish mobile nav menu</li>
                <li>Add unread message notifications</li>
                <li>Add toaster pop ups for friends logging on/off</li>
                <li>Invite people to room by name</li>
            </ol>
            <h2>Known Bugs:</h2>
            <ol>
                <li>Endless reconnect prompt when diconnected</li>
                <li>Mobile menu button logging user out</li>
                <li>Chat Nav panel squished when mobile keyboard is open</li>
                <li>Logged in somewhere else prompt when app closed incorrectly</li>
            </ol>
        </div>
        <br />
        <div>
            <img src={logo} alt="Chat Icon" height="44" width="44" className="logoIcon" />
            <a href="https://www.flaticon.com/free-icons/communication" title="communication icons" target="_blank">Communication icons created by Vectors Market - Flaticon</a>
        </div>
        <div>
            <img src={menuIcon} alt="Menu Icon" height="44" className="logoIcon" />
            <a href="https://www.flaticon.com/free-icons/menu" title="menu icons" target="_blank">Menu icons created by Freepik - Flaticon</a>
        </div>
        <div>
            <img src={accountIcon} alt="Account Icon" height="44" className="logoIcon" />
            <a href="https://www.flaticon.com/free-icons/user" title="user icons" target="_blank">User icons created by Freepik - Flaticon</a>
        </div>
        <div>
            <img src={notificationIcon} alt="Notification Icon" height="44" className="logoIcon" />
            <a href="https://www.flaticon.com/free-icons/notification" title="notification icons" target="_blank">Notification icons created by Freepik - Flaticon</a>
        </div>
    </div>)
}

export default CreditsPage;