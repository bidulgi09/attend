import React, { useState } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginPage from './page/login';
import SignupPage from './page/signup';
import HomePage from './page/home';
import SideBar from './components/SideBar';
import HeaderBar from './components/HeaderBar';

function App() {
    let [status, setStatus] = useState(false);

    return (
        <BrowserRouter>
            <div className='app-container'>
                <SideBar status={ status } setStatus={ setStatus }/>
                <div className='content-container'>
                    <HeaderBar status={ status } setStatus={ setStatus }/>
                    <div className='main-container'>
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/home" element={<HomePage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/signup" element={<SignupPage/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default App;
