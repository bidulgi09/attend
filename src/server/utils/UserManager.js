import api from './api.js'; 
const UserManager = { 
    headers: { "Content-Type": "application/json",'Authorization': `Bearer test` },
    async check(email, id) {
        let res = await api.post('/api/check', this.headers, { email, id });
        return res;
    },
    async signUp(id, email, password, role) {
        let res = await api.post('/api/signUp', this.headers, { id, email, password, role }); 
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
    async logIn(id, password, role) {
        try {
            let res = await api.post('/api/logIn', this.headers, { id, password, role });
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
    },
    async uploadProfileImage(formData, user) {
        try {
            let res = await api.post('/upload', { "Content-Type": "multipart/form-data",'Authorization': `Bearer test` }, formData);
            return res;
        } catch(e) {
            console.log(e);
            return {};
        }
    }
} 
export default UserManager;