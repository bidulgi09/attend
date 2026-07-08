import api from './api.js'; 
const SubjectManager = { 
    headers: { "Content-Type": "application/json",'Authorization': `Bearer test` },
    async addSubject(subject) {
        let res = await api.post('/api/addSubject', this.headers, subject);
        return res;
    },
} 
export default SubjectManager;