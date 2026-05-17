import React, { use, useState } from 'react'
import { ReactComponent as Logo } from './assets/logo.svg';
import './App.css';

import UserInput from './components/UserInput';
import UserButton from './components/UserButton';
import ToggleToken from './components/ToggleToken';

function App() {
    const [user, setUser] = useState({
        name: null,
        type: "학생",
        email: null,
        password: null
    });
    const setUserName = (event) => {
        console.log(Object.keys(event.target));
        return setUser(Object.assign(user, { name : event.target.value }));
    };
    const setUserType = (event) => {
        console.log(Object.keys(event.target));
        setRole(event.target.value == "학생" ? "Student" : "Teacher");
        return setUser(Object.assign(user, { type : event.target.value }));
    };
    const setUserEmail = (event) => {
        return setUser(Object.assign(user, { email : event.target.value }));
    };
    const setUserPW = (event) => {
        return setUser(Object.assign(user, { password : event.target.value }));
    };

    const [role, setRole] = useState('Student');



    const [lockedVisible, setLockedVisible] = useState(false);
    const [hoverVisible, setHoverVisible] = useState(false);

    const isVisible = hoverVisible || lockedVisible;
    

    return (
        <div className="App">
            <div className='login'>
                <Logo fill="red" />
                <form>
                    <div className='credentials-row toggle'>
                        <ToggleToken
                            name='user-type'
                            value='학생'
                            checked={role === 'Student'}
                            onChange={setUserType}
                        />
                        <ToggleToken
                            name='user-type'
                            value='교사'
                            checked={role === 'Teacher'}
                            onChange={setUserType}
                        />
                        <div className='indicator'></div>
                    </div>
                    <div className='credentials-row'>
                        <div className='inputs'>
                            <UserInput
                                name='user-name'
                                type='text'
                                placeholder='유저 아이디'
                                value={user.name}
                                onChange={ setUserName }
                            />
                            <div className='inputs pw-visible'>
                                <UserInput
                                    name='user-password'
                                    type={ isVisible ? 'text' : 'password' }
                                    placeholder='비밀번호'
                                    value={user.password}
                                    onChange={ setUserPW }
                                />
                                <div className='visible-toggle' 
                                    onClick={() => { setLockedVisible(!lockedVisible) }} 
                                    onMouseOver={() => { setHoverVisible(true) }} 
                                    onMouseOut={() => { setHoverVisible(false) }}
                                >
                                    <span id='pw-visible-btn'> { isVisible ? '비밀번호 보기' : '비밀번호 숨기기' }</span>
                                </div>
                            </div>
                        </div>
                        <UserButton
                            text='로그인'
                            onClick={() => { alert(`이름: ${user.name}\n직업: ${user.type}\n이메일: ${user.email}\n비밀번호: ${user.password}`) }}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default App;
