import React, { useState } from 'react'
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as EyePasswordShow } from '../../assets/eye-password-show.svg';
import { ReactComponent as EyePasswordHide } from '../../assets/eye-password-hide.svg';
import './styles.css';

import UserInput from '../../components/UserInput';
import UserButton from '../../components/UserButton';
import ToggleToken from '../../components/ToggleToken';
import { Link } from 'react-router-dom';

import api from '../../server/utils/Api.js';
import UserManager from '../../server/utils/UserManager.js';

function LoginPage() {
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
        setRole(event.target.value === "학생" ? "Student" : "Teacher");
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
        <div className="LoginPage">
            <div className='login'>
                <Link to="/">
                    <Logo fill="red" />
                </Link>
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
                            <UserInput 
                                name='user-email' 
                                type='email' 
                                placeholder='이메일 주소' 
                                value={user.name} 
                                onChange={ setUserEmail } 
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
                                    <span id='pw-visible-btn'> { isVisible ? <EyePasswordShow width="30px" height="14px"/> : <EyePasswordHide width="30px" height="14px"/> }</span>
                                </div>
                            </div>
                        </div>
                        <UserButton
                            text='가입'
                            onClick={() => { UserManager.signUp({ "username" : user.name, "email" : user.email, "password" : user.password }); }} 
                        />
                    </div>
                    <div className="direct-signup">
                        <div onClick={async() => {alert(await api.get("/api/userList"))}}>ㅁㄴㅇㄹ</div><Link to="/find-my-pw"><span>비밀번호 찾기</span></Link>&nbsp;&nbsp;&nbsp;<Link to="/find-my-id"><span>아이디 찾기</span></Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;