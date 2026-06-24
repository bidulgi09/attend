import axios from 'axios'; 

const api = { 
    async get(url, headers, body) { 
        let res = await axios.get("https://attend-508x.onrender.com" + url, { 
            params: body || {}, 
            headers: headers || {},
            withCredentials: true
        }); 
        return res.data; 
    }, 
    async post(url, headers, body) { 
        let res = await axios.post("https://attend-508x.onrender.com" + url, body || {}, { 
            headers: headers || {},
            withCredentials: true
        }); 
        return res.data; 
    }
} 
export default api;