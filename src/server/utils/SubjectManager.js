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
    },
    async connectStudent(subject_teacher_id, student_id) {
        let res = await api.post('/api/connectStudent', this.headers, { subject_teacher_id, student_id })
    }
} 
export default SubjectManager;