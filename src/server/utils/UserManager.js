import api from './api.js'; 
const UserManager = { 
    headers: { "Content-Type": "application/json",'Authorization': `Bearer test`, },
    async check(email, username) {
        let res = await api.post('/api/check', this.headers, { email, username });
        return res;
    },
    async signUp(username, email, password, role) {
        let res = await api.post('/api/signUp', this.headers, { username, email, password, role }); 
        return res; 
    },
    async profile() {
        try {
            let res = await api.get('/api/profile', this.headers);
            return res;
        } catch(e) {
            console.log(e);
            return {};
        }
    },
    async logIn(username, password, role) {
        try {
            let res = await api.post('/api/logIn', this.headers, { username, password, role });
            return res;
        } catch(e) {
            console.log(e);
            return {};
        }
    },
    async logOut() {
        try {
            let res = await api.post('/api/logOut', this.headers);
            return res;
        } catch(e) {
            console.log(e);
            return {};
        }
    }
} 
export default UserManager;