import React, { useState, useEffect } from 'react'
import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';

import NotFound from './page/NotFound';
import LoginPage from './page/login';
import SignupPage from './page/signup';
import HomePage from './page/home';
import SideBar from './components/SideBar';
import HeaderBar from './components/HeaderBar';

function App() {
    let [status, setStatus] = useState(false);
    const [user, setUser] = useState( localStorage.getItem('user_session') ?
        JSON.parse(localStorage.getItem('user_session')) :
        { 
            nickname: null,
            name: null,
            role: "Student",
            email: null,
            password: null,
            isLogin: false
        }
    );
    useEffect(() => {
        localStorage.setItem('user_session', JSON.stringify(user));
    }, [user]);
    return (
        <HashRouter>
            <div className='app-container'>
                <SideBar status={ status } setStatus={ setStatus } user={ user } setUser={ setUser }/>
                <div className='content-container'>
                    <HeaderBar status={ status } setStatus={ setStatus } user={ user } setUser={ setUser }/>
                    <div className='main-container'>
                        <Routes>
                            <Route path="/" element={<HomePage user={user} setUser={setUser}/>}/>
                            <Route path="/home" element={<HomePage user={user} setUser={setUser}/>}/>
                            <Route path="/login" element={<LoginPage user={user} setUser={setUser}/>}/>
                            <Route path="/signup" element={<SignupPage user={ user } setUser={ setUser }/>}/>
                            <Route path='*' element={<NotFound/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </HashRouter>
    )
}

export default App;
