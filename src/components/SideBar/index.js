import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function SideBar({ status, setStatus }) {
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
                <Link className='tab' to="/login">로그인</Link>
                <hr/>
                <Link className='tab' to="/signup">가입</Link>
            </div>
            <div className='outside' onClick={ change }/>
        </div>
    )
}

export default SideBar;