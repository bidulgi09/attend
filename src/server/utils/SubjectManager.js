import api from './api.js'; 
const SubjectManager = { 
    headers: { "Content-Type": "application/json",'Authorization': `Bearer test` },
    async addSubject(subject) {
        try {
            let res = await api.post('/api/addSubject', this.headers, subject);
            return res;
        } catch(e) {
            return {};
        }
    },
    async getAll() {
        try {
            let res = await api.get('/api/subjectList', this.headers);
            return res;
        } catch(e) {
            return {};
        }
    },
    async connectStudent(subject_teacher_id, student_id) {
        try {
            let res = await api.post('/api/connectStudent', this.headers, { subject_teacher_id, student_id })
            return res;
        } catch(e) {
            return {};
        }
    },
    async createAttendanceSession(subject_id) {
        try {
            let res = await api.post('/api/attendanceSession', this.headers, { subject_id });
            return res;
        } catch(e) {
            return {};
        }
    }
} 
export default SubjectManager;