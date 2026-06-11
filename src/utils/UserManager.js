import api from './Api.js'; 
const UserManager = { 
    cache: {}, 
    headers: { "Content-Type": "application/json" },
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