class InMemorySessionStore {
    constructor() {
        this.sessions = new Map();
    }

    // Key: AccountId
    // socketID: 
    // userName: 
    // sessionID:

    findSession(id) {
        return this.sessions.get(id);
    }

    findSessionByName(name) {
        for (let [key, value] of this.sessions) {
            if (value.userName === name) {
                return this.sessions.get(key);
            }
        }
    }

    findSessionBySocketID(sID) {
        if (sID) {
            for (let [key, value] of this.sessions.entries()) {
                if (value.socketID === sID) {
                    return key;
                }
            }
        }
    }

    saveSession(id, session) {
        this.sessions.set(id, session);
    }

    deleteSession(id) {
        this.sessions.delete(id);
    }

    findAllSessions() {
        return [...this.sessions.keys()];
    }
}

module.exports = {
    InMemorySessionStore
};