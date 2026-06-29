import React, { useState, useEffect } from 'react'
import Logo from '../../assets/logo.svg?react';
import EyePasswordShow from '../../assets/eye-password-show.svg?react';
import EyePasswordHide from '../../assets/eye-password-hide.svg?react';
import './styles.css';

import UserInput from '../../components/UserInput';
import UserButton from '../../components/UserButton';
import ToggleToken from '../../components/ToggleToken';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import UserManager from '../../server/utils/UserManager';

function LoginPage({user, setUser}) {
    const navigate = useNavigate();
    async function redirect(user) {
        let data = await UserManager.profile();
        if(data.success && user.isLogin) {
            return navigate('/home', { replace: true });
        }
    }
    async function login(user) {
        setIsLoading(true);
        let data = await UserManager.logIn(user.name, user.password, user.role);
        if(data.success) {
            setUser({...user, isLogin: true});
            alert("로그인 성공");
        } else {
            setUser({...user, isLogin: false});
            alert("로그인  실패\n" + JSON.stringify(data));
        }
        return setIsLoading(false);
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
        return setUser({...user, role : event.target.value == "학생" ? "Student" : "Teacher"});
    };
    const setUserPW = (event) => {
        return setUser({...user, password : event.target.value });
    };

    const [role, setRole] = useState('Student');
    const [isLoading, setIsLoading] = useState(false);


    const [lockedVisible, setLockedVisible] = useState(false);
    const [hoverVisible, setHoverVisible] = useState(false);

    const isVisible = hoverVisible || lockedVisible;
    

    return (
        <div className="LoginPage">
            <Helmet>
                <title>출첵커&nbsp;|&nbsp;로그인</title>
            </Helmet>
            <div className='login'>
                <Link to="/">
                    <Logo />
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
                                value={user.name || ""}
                                onChange={ setUserName }
                            />
                            <div className='inputs pw-visible'>
                                <UserInput
                                    name='user-password'
                                    type={ isVisible ? 'text' : 'password' }
                                    placeholder='비밀번호'
                                    value={user.password || ""}
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
                            text='로그인'
                            disabled={isLoading}
                            onClick={async () => { await login(user); }}
                        />
                    </div>
                    <div className="direct-signup">
                        <Link to="/signup"><span>회원가입</span></Link>&nbsp;|&nbsp;<Link to="/find-my-pw"><span>비밀번호 찾기</span></Link>&nbsp;|&nbsp;<Link to="/find-my-id"><span>아이디 찾기</span></Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
