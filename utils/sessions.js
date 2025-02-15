const session = require('express-session');

class CustomSessionStore extends session.Store{
    constructor () {
        super();
        this.sessions = {}
    }

    get(sid, callback) {
        const session = this.sessions[sid] ? JSON.parse(this.sessions[sid]) : null;
        console.log("Custom session retrieved");
        callback(null, session);
   }

   set(sid, session, callback) {
    this.sessions[sid] = JSON.stringify(session);
    const auth0_sid = JSON.parse(this.sessions[sid]).data.sid;
    console.log("Session created, Auth0 session ID: " + auth0_sid);
    callback(null);
   }

   destroy(sid, callback) {
    delete this.sessions[sid];
    console.log("Custom session destroyed");
    callback(null);
   }
}

module.exports = CustomSessionStore;