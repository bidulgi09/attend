import api from './api.js'; 
const SubjectManager = { 
    headers: { "Content-Type": "application/json",'Authorization': `Bearer test` },
    async addSubject(subject) {
        let res = await api.post('/api/addSubject', this.headers, subject);
        return res;
    },
    async getAll() {
        let res = await api.get('/api/subjectList', this.headers);
        return res;
    }
} 
export default SubjectManager;