import api from './api.js'; 
const UserManager = { 
    headers: { "Content-Type": "application/json",'Authorization': `Bearer test` },
    async check(email, id) {
        let res = await api.post('/api/check', this.headers, { email, id });
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
    },
    async logIn(id, password, role) {
        try {
            let res = await api.post('/api/logIn', this.headers, { id, password, role });
            return res;
        } catch(e) {
            console.log(e);
            return {};
        }
    },
    async logOut() {
        try {
            let res = await api.post('/api/logOut', this.headers);
            return res;
        } catch(e) {
            console.log(e);
            return {};
        }
    },
    async uploadProfileImage(formData, user) {
        try {
            let res = await api.post('/api/upload', { "Content-Type": "multipart/form-data",'Authorization': `Bearer test` }, formData);
            return res;
        } catch(e) {
            console.log(e);
            return {};
        }
    },
    async setUser(user) {
        try {
            let res = await api.post('/api/updateUser', this.headers, typeof user.subjects === 'object' ? {...user, subjects: JSON.stringify(user.subjects)} : user);
            return res;
        } catch(e) {
            console.log(e);
            return {};
        }
    },
    async userList() {
        try {
            let res = await api.get('/api/userList', this.headers);
            return res;
        } catch(e) {
            return {};
        }
    },
    async getUserById(id) {
        try {
            let res = await this.userList();
            return res.results.find(v => v.id === id);
        } catch(e) {
            return {};
        }
    },
    async connectSubject(subject, user) {
        try {
            let res = await api.post('/api/connectSubject', this.headers, { subject, teacher: user });
        } catch(e) {
            return {};
        }
    },
    async attend(user, setUser, { subject_id, token, code }) {
        try {
            let res = await api.post('/api/attendance', this.headers, { subject_id, token, code });
            this.pushAttendLog(user, setUser, subject_id, res.results.status);
            return res;
        } catch(e) {
            return {};
        }
    },
    pushAttendLog(user, setUser, subject_id, status) {
        if(!user.log.find(log => log.date === new Date().toISOString().split('T')[0] && log.subject_id == subject_id)) {
            setUser(prev => { return {
                ...user,
                log: [
                    ...prev.log, 
                    {
                        date: new Date().toISOString().split('T')[0],
                        subject_id: subject_id,
                        subject_name: user.subjects.find(subject => subject.id == subject_id).name,
                        status: status
                    }
                ]
            }});
        }
    }
} 
export default UserManager;