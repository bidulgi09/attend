import React, { useState, useEffect } from 'react'
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as EyePasswordShow } from '../../assets/eye-password-show.svg';
import { ReactComponent as EyePasswordHide } from '../../assets/eye-password-hide.svg';
import './styles.css';

import UserInput from '../../components/UserInput';
import UserButton from '../../components/UserButton';
import ToggleToken from '../../components/ToggleToken';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import api from '../../server/utils/api.js';
import UserManager from '../../server/utils/UserManager.js';

function SignupPage({ user, setUser }) {
    const navigate = useNavigate();
    async function redirect(user) {
        let data = await UserManager.profile();
        if(data.success && user.isLogin) {
            return navigate('/home', { replace: true });
        }
    }
    async function signup(user) {
        let data = await UserManager.signUp(user.name, user.email, user.password, user.role);
        if(data.success) {    
            let login = await UserManager.logIn(user.name, user.password, user.role);
            if(login.success) {
                setUser({...user, isLogin: true});
                alert("가입 성공");
            } else {
                setUser({...user, isLogin: false});
                alert("가입  실패\n" + JSON.stringify(data));
            }
        } else {
            setUser({...user, isLogin: false});
            alert("가입  실패\n" + JSON.stringify(data));
        }
        return;
    }
    useEffect(() => {
        redirect(user);
    }, [user.isLogin]);

    useEffect(() => {
        redirect(user);
    }, []);
    
    const setUserName = (event) => {
        return setUser({...user, name : event.target.value });
    };
    const setUserRole = (event) => {
        setRole(event.target.value == "학생" ? "Student" : "Teacher");
        return setUser({...user, role : event.target.value === "학생" ? "Student" : "Teacher"});
    };
    const setUserEmail = (event) => {
        return setUser({...user, email : event.target.value });
    };
    const setUserPW = (event) => {
        return setUser({...user, password : event.target.value });
    };

    const [role, setRole] = useState('Student');



    const [lockedVisible, setLockedVisible] = useState(false);
    const [hoverVisible, setHoverVisible] = useState(false);

    const isVisible = hoverVisible || lockedVisible;
    

    return (
        <div className="SignupPage">
            <Helmet>
                <title>출첵커 | 회원가입</title>
            </Helmet>
            <div className='signup'>
                <Link to="/">
                    <Logo fill="red" />
                </Link>
                <form>
                    <div className='credentials-row toggle'>
                        <ToggleToken
                            name='user-type'
                            value='학생'
                            checked={role === 'Student'}
                            onChange={setUserRole}
                        />
                        <ToggleToken
                            name='user-type'
                            value='교사'
                            checked={role === 'Teacher'}
                            onChange={setUserRole}
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
                                value={user.email} 
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
                            onClick={async() => { await signup(user); }} 
                        />
                    </div>
                    <div className="direct-signup">
                        <Link to="/login"><span>로그인하러 가기</span></Link>&nbsp;&nbsp;&nbsp;<Link to="/find-my-pw"><span>비밀번호 찾기</span></Link>&nbsp;&nbsp;&nbsp;<Link to="/find-my-id"><span>아이디 찾기</span></Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;