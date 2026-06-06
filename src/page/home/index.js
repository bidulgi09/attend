import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

import { ReactComponent as Logo } from '../../assets/logo.svg';

function HomePage() {
    return (
        <div className="HomePage">
            <header className='header'>
                <Link to="/" className='logo-box'>
                    <span className='logo-icon'>
                        <Logo className='logo'/>
                    </span>
                    <span>
                        <div className='name'>출첵커</div>
                        <div className='description'>출결관리 시스템</div>
                    </span>
                </Link>
                <nav className='tabs'>
                    <Link to="/login" className='header-tab' id={1}>로그인</Link>
                    <Link to="/signup" className='header-tab' id={2}>회원가입</Link>
                    <Link to="/introduction" className='header-tab' id={3}>기능소개</Link>
                    <Link to="/ask" className='header-tab' id={4}>문의</Link>
                </nav>
            </header>
            <main className='main'>
                 [박스1]
            </main>
            <main className='main2'>
                 [박스2]
            </main>
            <main className='main3'>
                 [박스3]
            </main>
        </div>
    )
}

export default HomePage;