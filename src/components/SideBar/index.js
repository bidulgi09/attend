import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import UserManager from '../../server/utils/UserManager';

function SideBar({ status, setStatus, user, setUser }) {
    const navigate=useNavigate({ user, setUser});
    async function logout(user) {
        let data = await UserManager.logOut();
        let update = {...user, isLogin: false};
        setUser(update);
        if(data.success && !update.isLogin) {
            return navigate('/login', { replace: true });
        }
    }

    function change() {
        setStatus(!status);
    }
    if(status === 'on')
        return;
    return (
        <div className='SideBar'>
            <div className='side-container' isOpened={ String(status) }>
                <Link className='tab' to="/home">홈</Link>
                <hr/>
                {user.isLogin ?
                    <div className='tab' onClick={async () => { await logout(user) }}>로그아웃</div>
                    :
                    <>
                        <Link className='tab' to="/login">로그인</Link>
                        <hr/>
                        <Link className='tab' to="/signup">가입</Link>
                    </>
                }
            </div>
            <div className='outside' onClick={ change }/>
        </div>
    )
}

export default SideBar;