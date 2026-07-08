import api from './api.js'; 
const SubjectManager = { 
    headers: { "Content-Type": "application/json",'Authorization': `Bearer test` },
    async add(subject) {
        let res = await api.post('/api/addSubject', this.headers, subject);
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
    }
} 
export default SubjectManager;