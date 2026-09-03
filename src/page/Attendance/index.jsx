import React, { useEffect, useRef } from 'react';
import UserManager from '../../server/utils/UserManager';
function Attendance({ user, setUser }) {
        console.log("Attendance useEffect 렌더링");
    const process = useRef(false);
    useEffect(() => {
        if(!user || process.current) return;
        console.log("Attendance useEffect 시작");
        const attend = async() => {
            const params = new URLSearchParams(window.location.hash.split('?')[1] || '');

            const token = params.get('token');
            const code = params.get('code');
            const subject_id = params.get('subject_id');
            if(token || code) {
                process.current = true;
                await UserManager.attend(user, setUser, { subject_id, token, code });
                console.log("Attendance useEffect 완료");
            }
        }
        attend();
    }, [user, setUser]);
    return <div>출석 처리 중...</div>
}

export default Attendance;