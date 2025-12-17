import "../css/features.css";


export default function FeaturesPage() {
    return (
        <div className="features-container">
            <header className="features-header">
                <h1>Chatty App</h1>
                <p className="features-description">
                    Chatty is a real-time MERN stack chat application that enables users to communicate through public rooms,
                    private rooms, and direct messaging with persistent conversations across devices.
                </p>
                <p className="features-tech">
                    <strong>Tech Stack:</strong> React, Node.js, Express, MongoDB, Socket.IO
                </p>
            </header>


            <section className="features-section">
                <h2>Core Features</h2>
                <ul>
                    <li>User authentication with secure login and account creation</li>
                    <li>Encrypted password storage in the database</li>
                    <li>Public and private chat rooms with search and join functionality</li>
                    <li>Friend system with 1-on-1 private messaging</li>
                    <li>Persistent message storage for access across multiple devices</li>
                </ul>
            </section>


            <section className="features-section">
                <h2>Real-Time Capabilities</h2>
                <ul>
                    <li>Live message delivery using WebSockets (Socket.IO)</li>
                    <li>Real-time notifications for new messages and room activity</li>
                    <li>Instant room updates without page refresh</li>
                </ul>
            </section>


            <section className="features-section">
                <h2>Planned Enhancements</h2>
                <ul className="upcoming">
                    <li>User account panel for managing profile and settings</li>
                    <li>User search to discover and add new friends</li>
                </ul>
            </section>


            <section className="features-section learnings">
                <h2>What I Learned</h2>
                <ul>
                    <li>Managing real-time communication with WebSockets</li>
                    <li>Designing MongoDB schemas for chat and user relationships</li>
                    <li>Handling authentication and protected routes in a MERN app</li>
                </ul>
            </section>
        </div>
    );
}