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
            if(res.status == 401) {
                await api.post('/api/refresh');
                res = await api.post('/api/upload', { "Content-Type": "multipart/form-data",'Authorization': `Bearer test` }, formData);
            }
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
            return res;
        } catch(e) {
            return {};
        }
    },
    async attend(user, setUser, { subject_id, token, code }) {
        try {
            let res;

            try {
                res = await api.post(
                    '/api/attendance',
                    this.headers,
                    { subject_id, token, code }
                );
            } catch (e) {
                if (e.response?.status !== 401) {
                    throw e;
                }

                await api.post('/api/refresh');

                res = await api.post(
                    '/api/attendance',
                    this.headers,
                    { subject_id, token, code }
                );
            }

            return res;
        } catch (e) {
            console.log(e);
            return {};
        }
    },
    async getAllAttendLog() {
        try{
            let res = await api.get('/api/attendance', this.headers);
            return res;
        } catch(e) {
            return {};
        }
    },
    async getUserLog(id) {
        try {
            let logs = await this.getAllAttendLog();
            return logs.results.list.filter(v => v.student_id === id);
        } catch(e) {
            return {};
        }
    }
} 
export default UserManager;