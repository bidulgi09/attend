import axios from 'axios'; 

const api = { 
    async get(url, headers, body) { 
        let res = await axios.get("https://refactored-potato-4j66rr45x7753gvx-5000.app.github.dev" + url, { 
            params: body || {}, 
            headers: headers || {},
            withCredentials: true
        }); 
        return res.data; 
    }, 
    async post(url, headers, body) { 
        let res = await axios.post("https://refactored-potato-4j66rr45x7753gvx-5000.app.github.dev" + url, body || {}, { 
            headers: headers || {},
            withCredentials: true
        }); 
        return res.data; 
    }
} 
export default api;