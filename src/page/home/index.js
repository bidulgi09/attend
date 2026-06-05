import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

import { ReactComponent as Logo } from '../../assets/logo.svg';

function HomePage() {
    return (
        <div className="HomePage">
            <header className='header'>
                <Link to="/" className='logo-box'>
                    <Logo className='logo'/>
                </Link>
                <nav className='tabs'>
                    <Link to="/login" className='header-tab' id={1}>로그인</Link>
                    <Link to="/signup" className='header-tab' id={2}>회원가입</Link>
                    <Link to="/login" className='header-tab' id={3}>후원하기</Link>
                </nav>
            </header>
            <main className='main'>
                 김멀대TV
            </main>
            <main className='main2'>
                 김멀대TV
            </main>
        </div>
    )
}

export default HomePage;