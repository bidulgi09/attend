import React, { useState, useRef, useEffect } from 'react';
import './TeacherStyles.css';
import { Helmet } from 'react-helmet-async';
import edit from '../../assets/edit.png';

import banner from '../../assets/배너.png';

import SubjectPopup from '../../components/SubjectPopup';
import GhostBox from '../../components/GhostBox';
import Schedule from '../../components/Schedule';
import NotesTab from '../../components/NotesTab';
import LogTab from '../../components/LogTab';
import QRCode from '../../components/QRCode';
import guest_profile from '../../uploads/guest_profile.png';
import UserManager from '../../server/utils/UserManager';
import SubjectManager from '../../server/utils/SubjectManager';
import DailySchedule from '../../components/DailySchedule';

function TeacherPage({ user, setUser }) {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState({});
    const [isPopup, setIsPopup] = useState(false);
    const dropdownRef = useRef(null);

    const fileInputRef = useRef(null);
    const [generatedURL, setGeneratedURL] = useState('');
    const [QRStatus, setQRStatus] = useState(false);
    const [studentID, setStudentID] = useState('');

    const [columnIndex, setColumnIndex] = useState(0);

    const handleAddItem = function () {
        setIsPopup(!isPopup)
    }
    useEffect(() => {
        let fetchItems = async () => {
            let subjects = await SubjectManager.getAll();
            setItems(subjects.results.list.filter(v => v.teacher_id === user.id));
        }
        fetchItems();
    }, [items]);
    useEffect(() => {
        function handleClickOutSide(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutSide);
        return () => document.removeEventListener('mousedown', handleClickOutSide);
    }, []);
    const addStudent = function (event) {
        if (/[^\d]/.test(event.target.value)) {
            event.target.value = event.target.value.replace(/[^\d]/g, '');
        }
        let val = event.target.value.replace(/[^\d]/g, '');
        if (val.length > 2) {
            event.target.value = val.substring(0, 2) + '-' + val.substring(2, 7);
        }
    }
    const removeLink = function () {
        setQRStatus(false);
        setGeneratedURL('');
    }
    const generateLink = function () {
        let url = window.location.origin + "/attend";
        let current_date = Date.now();

        const access_url = `${url}?t=${current_date}`;
        setQRStatus(true);
        setGeneratedURL(access_url);
    }

    function moveSlidePrev() {
        if(columnIndex == 0) return;
        let slideBox = document.querySelector(".slide_box")
        slideBox.style.transform = `translateX(${-(columnIndex - 1) * 50}dvw)`;
        setColumnIndex(columnIndex-1);
    } 
    function moveSlideNext() {
        let maxColumnIndex = document.getElementsByClassName("slide_item").length;
        if(columnIndex == maxColumnIndex) return;
        let slideBox = document.querySelector(".slide_box")
        slideBox.style.transform = `translateX(${-(columnIndex + 1) * 50}dvw)`;
        setColumnIndex(columnIndex+1);
    }

    let data = user ? user.data : [
        ["국어", "수학", "영어", "과학", "사회"],
        ["체육", "음악", "미술", "정보", "역사"],
        ["국어", "수학", "영어", "과학", "사회"],
        ["체육", "음악", "미술", "정보", "역사"],
        ["국어", "수학", "영어", "과학", "사회"]
    ];

    const handleProfileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        alert("프로필 업로드 중");
        const file = e.target.files[0];

        if (!file) return alert("프로필 업로드 실패");

        const formData = new FormData();
        formData.append('file', file);
        formData.append('user', JSON.stringify(user));

        let res = await UserManager.uploadProfileImage(formData, user);

        setUser(Object.assign(user, { avatar: res.results.url }));
        return alert("프로필 업로드 완료");
    };
    
    return (
        <div className="TeacherPage">
            <Helmet>
                <title>출첵커 | 홈</title>
            </Helmet>
            <SubjectPopup isopen={isPopup} setIsOpen={setIsPopup} user={user} />
            <form>
                <input type="file" name="profileImage" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
            </form>
            <div className='main'>
                <form className='attendence-form-main'>
                    <div className="dropdown" ref={dropdownRef}>
                        <span className="dropdown-box">
                            <button className="dropdown-placeholder" onClick={() => setIsOpen(!isOpen)}>
                                {selectedSubject.subject_name ? `${selectedSubject.subject_name}${(selectedSubject.subject_days.length > 0) ? (" (" + selectedSubject.subject_days.join(", ") + ")") : ""}` : "선택하기 v"}
                            </button>
                            {isOpen && (
                                <ul className="dropdown-menu">
                                    {
                                        items.map((item, i) => {
                                            return <li key={i} className='dropdown-item' onClick={() => { setIsOpen(false); setSelectedSubject(item); }}>
                                                {item.subject_name}{(item.subject_days.length > 0) && (" (" + item.subject_days.join(", ") + ")")}
                                            </li>
                                        })
                                    }
                                    <button className='add-btn' onClick={handleAddItem}>
                                        + 새 과목
                                    </button>
                                </ul>
                            )}
                        </span>
                        <input type="text" placeholder="학생 추가 (00-00000)" onChange={addStudent}></input>
                    </div>
                </form>
                <div className="row-wrapper slide">
                    <div className="prev" onClick={moveSlidePrev}>
                        {"<"}
                    </div>
                <div className="student-list">
                    <div className="slide_box">
                        <DailySchedule className="slide_item" scheduleData={Array(7).fill("공강")}/>
                    </div>
                </div>
                
                    <div className="next" onClick={moveSlideNext}>
                        {">"}
                    </div>
                </div>
            </div>
            <div className='profile-tab contents-wrapper'>
                <GhostBox />
                <div className='profile-info-wrapper'>
                    <div className='profile-img' onClick={handleProfileClick}>
                        <img src={(user && user.avatar) ? user.avatar : guest_profile} alt="Profile" />
                    </div>
                    <div className='name row-wrapper'>
                        <p>{user.isLogin ? user.name : 'Guest'}</p>
                        <img className='edit-icon' src={edit} width='12vh' height='12vh' />
                    </div>
                    <div className='grade'>
                        {user ? user.id : 'N/A'}
                    </div>
                    <form className='attendence-form-side' onSubmit={() => { event.preventDefault(); }}>
                        <div className="dropdown" ref={dropdownRef}>
                            <span className="dropdown-box">
                                <button className="dropdown-placeholder" onClick={() => setIsOpen(!isOpen)}>
                                    {selectedSubject.subject_name ? `${selectedSubject.subject_name}${(selectedSubject.subject_days.length > 0) ? (" (" + selectedSubject.subject_days.join(", ") + ")") : ""}` : "선택하기 v"}
                                </button>
                                {isOpen && (
                                    <ul className="dropdown-menu">
                                        {
                                            items.map((item, i) => {
                                                return <li key={i} className='dropdown-item' onClick={() => { setIsOpen(false); setSelectedSubject(item); }}>
                                                    {item.subject_name}{(item.subject_days.length > 0) && (" (" + item.subject_days.join(", ") + ")")}
                                                </li>
                                            })
                                        }
                                        <button className='add-btn' onClick={handleAddItem}>
                                            + 새 과목
                                        </button>
                                    </ul>
                                )}
                            </span>
                            <input type="text" placeholder="학생 추가 (00-00000)" onChange={addStudent}></input>
                        </div>
                        <button type="button" className="createQR" onClick={generateLink}>
                            QR 생성
                        </button>
                    </form>
                </div>
                <QRCode url={generatedURL} iscreated={QRStatus} removelink={removeLink} />
                <Schedule scheduleData={data} ishided={QRStatus} />
            </div>
        </div>
    )
}

export default TeacherPage;