import api from './api.js'; 
const UserManager = { 
    headers: { "Content-Type": "application/json" },
    async checkEmail(email) {
        let res = await api.post('/api/checkEmail', this.headers, { email: email });
        return res.data;
    },
    async checkUserName(username) {
        let res = await api.post('/api/checkUserName', this.headers, { username: username });
        return res.data;
    },
    async checkPassword(password) {
        let res = await api.post('/api/checkPassword', this.headers, { password: password });
        return res.data;
    },
    async signUp({username, email, password}) { 
        let body = { 
            "username": username, 
            "email": email,
            "password": password
        }; 
        let res = await api.post('/api/signUp', this.headers, body); 
        return res.data; 
    } 
} 
export default UserManager;