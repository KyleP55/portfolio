import logo from '../images/chatIcon.png';
import menuIcon from '../images/menuIcon.png';
import accountIcon from '../images/accountIcon.png';
import notificationIcon from '../images/accountIcon.png';

function CreditsPage() {
    return (<div>
        <div className="row">
            <img src={logo} alt="Chat Icon" height="44" className="logoIcon" />
            <a href="https://www.flaticon.com/free-icons/communication" title="communication icons">Communication icons created by Vectors Market - Flaticon</a>
        </div>
        <div>
            <img src={menuIcon} alt="Menu Icon" height="44" className="logoIcon" />
            <a href="https://www.flaticon.com/free-icons/menu" title="menu icons">Menu icons created by Freepik - Flaticon</a>
        </div>
        <div>
            <img src={accountIcon} alt="Account Icon" height="44" className="logoIcon" />
            <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a>
        </div>
        <div>
            <img src={notificationIcon} alt="Notification Icon" height="44" className="logoIcon" />
            <a href="https://www.flaticon.com/free-icons/notification" title="notification icons">Notification icons created by Freepik - Flaticon</a>
        </div>
    </div>)
}

export default CreditsPage;