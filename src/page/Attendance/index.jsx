import React, { useEffect } from 'react';
import UserManager from '../../server/utils/UserManager';
function Attendance({ user, setUser }) {
    useEffect(() => {
        const attend = async() => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const code = params.get('code');
            const subject_id = params.get('subject_id');
            if(token || code) {
                await UserManager.attend(user, setUser, { subject_id, token, code });
            }
        }
        attend();
    }, [user, setUser]);
    return <div>출석 처리 중...</div>
}

export default Attendance;