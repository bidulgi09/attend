import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import UserManager from '../../server/utils/UserManager';

function SideBar({ status, setStatus, user, setUser }) {
    const navigate=useNavigate({ user, setUser});
    async function logout(user) {
        let data = await UserManager.logOut();
        let update = {
            name: '',
            password: '',
            email: '',
            role: 'Student',
            isLogin: false
        };
        setUser(update);
        if(data.success) {
            localStorage.removeItem('user_session');
            return navigate('/login', { replace: true });
        }
    }

    function change() {
        setStatus(!status);
    }
    return (
        <div className='SideBar'>
            <div className='side-container' isopened={ String(status) }>
                <Link className='tab' to="/home" onClick={ change }>홈</Link>
                <hr/>
                {user.isLogin ?
                    <div className='tab' onClick={async () => { await logout(user); change(); }}>로그아웃</div>
                    :
                    <>
                        <Link className='tab' to="/login" onClick={ change }>로그인</Link>
                        <hr/>
                        <Link className='tab' to="/signup" onClick={ change }>회원가입</Link>
                        <hr/>
                        <Link className='tab' to="/introduction" onClick={ change }>기능소개</Link>
                        <hr/>
                        <Link className='tab' to="/ask" onClick={ change }>문의</Link>
                    </>
                }
            </div>
            <div className='outside' onClick={ () => { if(status) return change(); }}/>
        </div>
    )
}

export default SideBar;