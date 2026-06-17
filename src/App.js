import React, { useState, useEffect } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';

import LoginPage from './page/login';
import SignupPage from './page/signup';
import HomePage from './page/home';
import SideBar from './components/SideBar';
import HeaderBar from './components/HeaderBar';

function App() {
    let [status, setStatus] = useState(false);
    
    const [user, setUser] = useState( sessionStorage.getItem('user_session') ?
        JSON.parse(sessionStorage.getItem('user_session')) :
        { 
            name: null,
            role: "Student",
            email: null,
            password: null,
            isLogin: false
        }
    );
    useEffect(() => {
        sessionStorage.setItem('user_session', JSON.stringify(user));
    }, [user]);
    return (
        <BrowserRouter>
            <div className='app-container'>
                <SideBar status={ status } setStatus={ setStatus }/>
                <div className='content-container'>
                    <HeaderBar status={ status } setStatus={ setStatus } user={ user } setUser={ setUser }/>
                    <div className='main-container'>
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/home" element={<HomePage/>}/>
                            <Route path="/login" element={<LoginPage user={user} setUser={setUser}/>}/>
                            <Route path="/signup" element={<SignupPage/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App;
