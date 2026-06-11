import axios from 'axios'; 
const api = { 
    async get(url, headers, body) { 
        let res = await axios.get(url, { 
            params: body || {}, 
            headers: headers || {} 
        }); 
        return res.data; 
    }, 
    async post(url, headers, body) { 
        let res = await axios.post(url, body || {}, { 
            headers: headers || {} 
        }); 
        return res.data; 
    } 
} 
export default api;