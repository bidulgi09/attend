import React, { useRef } from 'react';
import './StudentStyles.css';
import { Helmet } from 'react-helmet-async';
import edit from '../../assets/edit.png';

import banner from '../../assets/배너.png';

import GhostBox from '../../components/GhostBox';
import Schedule from '../../components/Schedule';
import NotesTab from '../../components/NotesTab';
import LogTab from '../../components/LogTab';

import UserManager from '../../server/utils/UserManager';

function StudentPage({ user, setUser }) {
    const fileInputRef = useRef(null);

    let data = user ? user.data : [
        ["국어", "수학", "영어", "과학", "사회"],
        ["체육", "음악", "미술", "정보", "역사"],
        ["국어", "수학", "영어", "과학", "사회"],
        ["체육", "음악", "미술", "정보", "역사"],
        ["국어", "수학", "영어", "과학", "사회"]
    ];

    const logData = [
        { date: "2023-01-01", status: "출석", subject: "국어" },
        { date: "2023-01-02", status: "출석", subject: "체육" },
        { date: "2023-01-02", status: "출석", subject: "미술" },
        { date: "2023-01-03", status: "출석", subject: "음악" },
        { date: "2023-01-04", status: "결석", subject: "미술" },
        { date: "2023-01-05", status: "조퇴", subject: "음악" },
        { date: "2023-01-06", status: "결과", subject: "수학" },
        { date: "2023-01-07", status: "출석", subject: "수학" },
        { date: "2023-01-07", status: "출석", subject: "영어" },
        { date: "2023-01-08", status: "결과", subject: "영어" },
        { date: "2023-01-08", status: "출석", subject: "과학" },
        { date: "2023-01-08", status: "출석", subject: "사회" },
        { date: "2023-01-09", status: "결과", subject: "과학" },
        { date: "2023-01-10", status: "결과", subject: "사회" },
        { date: "2023-01-11", status: "결석", subject: "체육" },
        { date: "2023-01-11", status: "출석", subject: "한문" },
        { date: "2023-01-12", status: "출석", subject: "코딩" },
        { date: "2023-01-13", status: "결과", subject: "국어" }
    ];

    const handleProfileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);
        UserManager.uploadProfileImage(formData);
    };

    return (
        <div className="StudentPage">
            <Helmet>
                <title>출첵커 | 홈</title>
            </Helmet>
            <form>
                <input type="file" name="profileImage" ref={ fileInputRef } onClick={ handleFileChange }style={{ display: "none" }}/>
            </form>
            <div className='main'>
                <form className='attendence-form-main'>
                    <input type="text" placeholder="출석 코드"></input>
                </form>
                <NotesTab NotesData={{ attendance: 10, result: 5, absence: 2, earlyLeave: 1 }} />
                <LogTab LogData={logData} />
            </div>
            <div className='profile-tab contents-wrapper'>
                <GhostBox/>
                <div className='profile-info-wrapper'>
                    <div className='profile-img' onClick={ handleProfileClick }>
                        <img src={(user && user.avatar) ? user.avatar : 'src/uploads/guest_profile.png'} alt="Profile" />
                    </div>
                    <div className='name row-wrapper'>
                        <p>{user.isLogin ? user.name : 'Guest'}</p>
                        <img className='edit-icon' src={edit} width='12vh' height='12vh' />
                    </div>
                    <div className='grade'>
                        {user ? user.id : 'N/A'}
                    </div>
                    <form className='attendence-form-side'>
                        <input type="text" placeholder="출석 코드"></input>
                    </form>
                </div>
                <Schedule scheduleData={data}/>
            </div>
        </div>
    );
}

export default StudentPage;