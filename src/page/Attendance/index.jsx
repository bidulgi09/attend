import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManager from '../../server/utils/UserManager';
function Attendance({ user, setUser }) {
    const navigate = useNavigate();
    const process = useRef(false);
    useEffect(() => {
        if(!user || process.current) return;
        const attend = async() => {
            const params = new URLSearchParams(window.location.hash.split('?')[1] || '');

            const token = params.get('token');
            const code = params.get('code');
            const subject_id = params.get('subject_id');
            if(token || code) {
                process.current = true;
                let res = await UserManager.attend(user, setUser, { subject_id, token, code });
                if(res.results?.isAttend === true) {
                    alert("출석이 완료되었습니다");
                } else if(res.results?.reason === "Already attended.") {
                    alert("이미 출석하셨습니다");
                } else {
                    alert("출석에 실패했습니다");
                }
                return navigate('/home');
            }
            return navigate('/home');
        }
        attend();
    }, [user, setUser]);
    return <div>출석 처리 중...</div>
}

export default Attendance;