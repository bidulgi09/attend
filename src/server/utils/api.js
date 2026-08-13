import axios from 'axios'; 

const api = { 
    async get(url, headers, body) { 
        let res = await axios.get("https://api.xn--wx6bnqz4a.xn--yq5b.xn--3e0b707e" + url, { 
            params: body || {}, 
            headers: headers || {},
            withCredentials: true
        }); 
        return res.data; 
    }, 
    async post(url, headers, body) { 
        let res = await axios.post("https://api.xn--wx6bnqz4a.xn--yq5b.xn--3e0b707e" + url, body || {}, { 
            headers: headers || {},
            withCredentials: true
        }); 
        return res.data; 
    }
} 
export default api;