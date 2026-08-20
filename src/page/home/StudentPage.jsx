import React, { useState, useEffect, useRef } from 'react';
import './StudentStyles.css';
import { Helmet } from 'react-helmet-async';
import edit from '../../assets/edit.png';

import banner from '../../assets/배너.png';

import Schedule from '../../components/Schedule';
import NotesTab from '../../components/NotesTab';
import LogTab from '../../components/LogTab';
import DailySchedule from '../../components/DailySchedule';
import SelectSubjectPopup from '../../components/selectSubjectPopup';

import guest_profile from '../../uploads/guest_profile.png';
import UserManager from '../../server/utils/UserManager';
import SubjectManager from '../../server/utils/SubjectManager';

function StudentPage({ user, setUser }) {
    const fileInputRef = useRef(null);

    let data = user.subjects;
    const dayIndex = new Date().getDay();
    const [currentDay, setCurrentDay] = useState(dayIndex >= 1 && dayIndex <= 5 ? dayIndex - 1 : 0);
    const [editingCell, setEditingCell] = useState({ row: null, col: null });
    const [columnIndex, setColumnIndex] = useState(0);
    const [items, setItems] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [isSelectSubjectPopupOpen, setIsSelectSubjectPopupOpen] = useState(false);
    const [handleUserNameChange, setHandleUserNameChange] = useState(false);
    const [newUserName, setNewUserName] = useState(user.name || "");
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
    useEffect(() => {
        let fetchItems = async () => {
            let subjects = await SubjectManager.getAll();
            setSubjectList(subjects.results.list);
            setItems(subjects.results.list.filter(v => v.teacher_id === user.id));
        }
        fetchItems();
    }, [items]);
    function moveSlidePrev() {
        if(columnIndex == 0) return;
        let slideBox = document.querySelector(".slide_box")
        slideBox.style.transform = `translateX(${-(columnIndex - 1) * 60}dvw)`;
        setColumnIndex(columnIndex-1);
    } 
    function moveSlideNext() {
        let maxColumnIndex = document.getElementsByClassName("slide_item").length;
        if(columnIndex == maxColumnIndex - 1) return;
        let slideBox = document.querySelector(".slide_box")
        slideBox.style.transform = `translateX(${-(columnIndex + 1) * 60}dvw)`;
        setColumnIndex(columnIndex+1);
    }
    const changeUserName = async function() {
        if (!newUserName || newUserName.trim() === '') {
            return alert("이름을 입력해주세요.");
        }
        let res = { ...user, name: newUserName };
        setUser({ ...user, name: newUserName });
        setHandleUserNameChange(false);
        await UserManager.setUser(res);
        return alert("이름이 변경되었습니다.");
    }
    const handleProfileClick = (e) => {
        e.stopPropagation();
        if(!user || !user.id) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }
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
        
        setUser({...user, avatar: res.results.url});
        return alert("프로필 업로드 완료");
    };
    
    return (
        <div className="StudentPage">
            <Helmet>
                <title>출첵커 | 홈</title>
            </Helmet>
            <SelectSubjectPopup isopen={isSelectSubjectPopupOpen} setIsOpen={setIsSelectSubjectPopupOpen} user={user} setUser={setUser} editingCell={editingCell} />
            <form onSubmit={(e) => e.preventDefault() }>
                <input type="file" name="profileImage" ref={ fileInputRef } onChange={ handleFileChange }style={{ display: "none" }}/>
            </form>
            <div className='main'>
                <form className='attendence-form-main'>
                    <input type="text" placeholder="출석 코드"></input>
                </form>
                <div className="row-wrapper slide">
                    <div className="prev" onClick={moveSlidePrev}>
                        {"<"}
                    </div>
                    <div className="student-list">
                        <div className="slide_box">
                            <DailySchedule className="slide_item" scheduleData={user.subjects.map(v => v[currentDay] || {})}/>
                            <NotesTab className="slide_item" NotesData={{ attendance: 10, result: 5, absence: 2, earlyLeave: 1 }} />
                            <LogTab className="slide_item" LogData={logData} />
                        </div>
                    </div>
                    <div className="next" onClick={moveSlideNext}>
                        {">"}
                    </div>
                </div>
            </div>
            <div className='profile-tab contents-wrapper'>
                <div className='profile-info-wrapper'>
                    <div className='profile-img' onClick={ handleProfileClick }>
                        <img src={(user && user.avatar) ? user.avatar : guest_profile} alt="Profile" />
                    </div>
                    <div className='name'>
                        {
                            handleUserNameChange ? 
                            <div className="name-box">
                                <input className="new-name-input" type="text" placeholder = " 이름을 입력하세요." value = { newUserName } onChange={e => setNewUserName(e.target.value) }/>
                                <button className="new-name-submit" onClick={async (e) => await changeUserName(e) }>저장</button>
                            </div>:
                            <div className="name-box">
                                <p>{user.isLogin ? user.name : 'Guest'}</p>&nbsp;&nbsp;&nbsp;
                                <img className='edit-icon' src={edit} width='12vh' height='12vh' onClick={() => setHandleUserNameChange(!handleUserNameChange)} />
                            </div>   
                        }
                    </div>
                    <div className='grade'>
                        {user ? user.id : 'N/A'}
                    </div>
                    <form className='attendence-form-side'>
                        <input type="text" placeholder="출석 코드"></input>
                    </form>
                </div>
                <Schedule scheduleData={user.subjects.map(v => v.map(v2 => subjectList.find(x => x.id === v2.id)))} ishided={false} setEditingCell={setEditingCell} setIsSelectSubjectPopupOpen={setIsSelectSubjectPopupOpen} />
            </div>
        </div>
    );
}

export default StudentPage;