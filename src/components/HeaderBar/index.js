import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './styles.css';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as MenuIcon } from '../../assets/hamburger-light.svg';
import UserManager from '../../server/utils/UserManager';


function HeaderBar({ status, setStatus, user, setUser }) {
    const navigate=useNavigate();
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
    return (
        <header className='HeaderBar'>
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
                    {user.isLogin ?
                        <div className='header-tab' id={1} onClick={async () => { await logout(user) }}>로그아웃</div>
                        :
                        <>
                            <Link to="/login" className='header-tab' id={1}>로그인<div className='select_bar'/></Link>
                            <Link to="/signup" className='header-tab' id={2}>회원가입<div className='select_bar'/></Link>
                        </>
                    }
                    <Link to="/introduction" className='header-tab' id={3}>기능소개<div className='select_bar'/></Link>
                    <Link to="/ask" className='header-tab' id={4}>문의<div className='select_bar'/></Link>
                    <div className='header-tab' onClick={ change }>
                        <MenuIcon className='menu-icon' width='2.5rem' height='2.5rem'/>
                    <div className='select_bar'/></div>
                </nav>
        </header>
    );
}

export default HeaderBar;