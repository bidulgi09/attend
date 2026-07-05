import React, { useState } from 'react';
import './TeacherStyles.css';
import { Helmet } from 'react-helmet-async';
import edit from '../../assets/edit.png';

import banner from '../../assets/배너.png';

import GhostBox from '../../components/GhostBox';
import Schedule from '../../components/Schedule';
import NotesTab from '../../components/NotesTab';
import LogTab from '../../components/LogTab';
import QRCode from '../../components/QRCode';

function TeacherPage({ user, setUser }) {
    const [ generatedURL, setGeneratedURL ] = useState('');
    const [ QRStatus, setQRStatus ] = useState(false);
    const removeLink = function() {
        setQRStatus(false);
        setGeneratedURL('');
    }
    const generateLink = function() {
        let url = window.location.origin + "/attend";
        let current_date = Date.now();
        
        const access_url = `${url}?t=${current_date}`;
        setQRStatus(true);
        setGeneratedURL(access_url);
    }
    
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
    return (
        <div className="TeacherPage">
            <Helmet>
                <title>출첵커 | 홈</title>
            </Helmet>
            <div className='main'>
                <form className='attendence-form-main'>
                    <input type="text" placeholder="학생 추가 (00-00000)"></input>
                </form>
                <NotesTab NotesData={{ attendance: 10, result: 5, absence: 2, earlyLeave: 1 }} />
                <LogTab LogData={logData} />
            </div>
            <div className='profile-tab contents-wrapper'>
                <GhostBox/>
                <div className='profile-info-wrapper'>
                    <div className='profile-img'>
                        <img src={(user && user.avatar) ? user.avatar : 'https://i.pinimg.com/originals/78/20/45/7820459062e377482125ab4bafbd992f.jpg'} alt="Profile" />
                    </div>
                    <div className='name row-wrapper'>
                        <p>{user ? user.name : 'Guest'}</p>
                        <img className='edit-icon' src={edit} width='12vh' height='12vh' />
                    </div>
                    <div className='grade'>
                        {user ? user.grade : 'N/A'}
                    </div>
                    <form className='attendence-form-side'>
                        <input type="text" placeholder="학생 추가 (00-00000)"></input>
                        <button type="button" onClick={generateLink}>
                            QR 생성
                        </button>
                    </form>
                </div>
                <QRCode url={generatedURL} iscreated={QRStatus} removelink={removeLink}/>
                <Schedule scheduleData={data} ishided={QRStatus}/>
            </div>
        </div>
    )
}

export default TeacherPage;