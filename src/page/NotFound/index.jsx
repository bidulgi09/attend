import React from 'react';
import './styles.css';
import { Link, useNavigate } from 'react-router-dom';

import Logo from '../../assets/logo.svg?react';

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="NotFound">
            <div className="phrase">
                <Logo className="logo" onClick={() => { navigate('/home'); }}/>
                <br/>
                <div className="main-text">404 Not Found</div>
                <span>존재하지 않는 페이지입니다.</span>
            </div>
            <div className="box">
                <div className="back" onClick={() => { navigate(-1); }}>이전 페이지</div>
                <div className="home" onClick={() => { navigate('/home'); }}>홈으로 가기</div>
            </div>
        </div>
    );
}

export default NotFound;