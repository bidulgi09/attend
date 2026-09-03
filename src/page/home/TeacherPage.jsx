import React, { useState, useRef, useEffect } from 'react';
import './TeacherStyles.css';
import { Helmet } from 'react-helmet-async';
import edit from '../../assets/edit.png';

import banner from '../../assets/배너.png';

import SubjectPopup from '../../components/SubjectPopup';
import Schedule from '../../components/Schedule';
import NotesTab from '../../components/NotesTab';
import LogTab from '../../components/LogTab';
import QRCode from '../../components/QRCode';
import guest_profile from '../../uploads/guest_profile.png';
import UserManager from '../../server/utils/UserManager';
import SubjectManager from '../../server/utils/SubjectManager';
import DailySchedule from '../../components/DailySchedule';
import InstructionStudents from '../../components/InstructionStudents';
import SelectSubjectPopup from '../../components/selectSubjectPopup';

function TeacherPage({ user, setUser }) {
    const [handleUserNameChange, setHandleUserNameChange] = useState(false);
    const dayIndex = new Date().getDay();
    const [currentDay, setCurrentDay] = useState(dayIndex >= 1 && dayIndex <= 5 ? dayIndex - 1 : 0);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isSelectSubjectPopupOpen, setIsSelectSubjectPopupOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState({});
    const [isPopup, setIsPopup] = useState(false);
    const dropdownRef = useRef(null);

    const fileInputRef = useRef(null);
    const [generatedURL, setGeneratedURL] = useState('');
    const [QRStatus, setQRStatus] = useState(false);
    const [studentID, setStudentID] = useState('');

    const [columnIndex, setColumnIndex] = useState(0);

    const [editingCell, setEditingCell] = useState({ row: null, col: null });
    const [newUserName, setNewUserName] = useState(user.name || "");
    const [subjectList, setSubjectList] = useState([]);
    
    let data = user.subjects;
    const handleAddItem = function () {
        setIsPopup(!isPopup)
    }
    useEffect(() => {
        let fetchItems = async () => {
            let subjects = await SubjectManager.getAll();
            setSubjectList(subjects.results.list);
            setItems(subjects.results.list.filter(v => v.teacher_id === user.id));
        }
        fetchItems();
    }, [items]);
    useEffect(() => {
        setCurrentDay(dayIndex >= 1 && dayIndex <= 5 ? dayIndex - 1 : 0);
        function handleClickOutSide(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutSide);
        return () => document.removeEventListener('mousedown', handleClickOutSide);
    }, []);
    useEffect(() => {
        const date = new Date();
        const now = date.getHours() * 60 + date.getMinutes();
        let schedule = [
            { h: 8, m: 20, id: user.subjects[0][currentDay].id, name: user.subjects[0][currentDay].name },
            { h: 9, m: 20, id: user.subjects[1][currentDay].id, name: user.subjects[1][currentDay].name },
            { h: 10, m: 20, id: user.subjects[2][currentDay].id, name: user.subjects[2][currentDay].name },
            { h: 11, m: 20, id: user.subjects[3][currentDay].id, name: user.subjects[3][currentDay].name },
            { h: 13, m: 20, id: user.subjects[4][currentDay].id, name: user.subjects[4][currentDay].name },
            { h: 14, m: 20, id: user.subjects[5][currentDay].id, name: user.subjects[5][currentDay].name },
            { h: 15, m: 20, id: user.subjects[6][currentDay].id, name: user.subjects[6][currentDay].name } 
        ];
        setCurrentSubject(schedule.find(v => (v.h + 1) * 60 + v.m >= now));
    }, [user, currentDay]);
    const addStudent = async function (event) {
        if (/[^\d]/.test(event.target.value)) {
            event.target.value = event.target.value.replace(/[^\d]/g, '');
        }
        let val = event.target.value.replace(/[^\d]/g, '');
        if (val.length > 2) {
            event.target.value = val.substring(0, 2) + '-' + val.substring(2, 7);
        }
        if (val.length === 7) {
            if(!selectedSubject.subject_name) {
                event.target.value = null;
                return alert("과목을 선택해주세요.");
            }
            let userList = await UserManager.userList();
            userList = userList.results;

            let student = userList.find(v => v.id == event.target.value && v.role == "Student" );
            if(!student) {
                event.target.value = null;
                return alert("해당 학생이 존재하지 않습니다.");
            }
            let res = await SubjectManager.connectStudent(selectedSubject.id+"-"+user.id, student.id);
            event.target.value = null;
            return alert(student.name + " 학생 추가 완료");
        }
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
    const removeLink = function () {
        setQRStatus(false);
        setGeneratedURL('');
    }
    const generateLink = async function (subjectId) {
        console.log(currentSubject);
        let data = await SubjectManager.createAttendanceSession(subjectId);
        if(!data.results.isCreated) return false;
        let url = window.location.origin + "/attendance?token=" + data.results.token + "&code=" + data.results.code + "&subject_id=" + subjectId;
        console.log(url);
        setQRStatus(true);
        setGeneratedURL(url);
    }

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
            <SubjectPopup isopen={isPopup} setIsOpen={setIsPopup} user={user}/>
            <SelectSubjectPopup isopen={isSelectSubjectPopupOpen} setIsOpen={setIsSelectSubjectPopupOpen} user={user} setUser={setUser} editingCell={editingCell} />
            <form>
                <input type="file" name="profileImage" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
            </form>
            <div className='main'>
                <form className='attendence-form-main' onClick={(event) => event.preventDefault() }>
                    <div className="dropdown" ref={dropdownRef}>
                        <div className="dropdown-box">
                            <button className="dropdown-placeholder" onClick={() => setIsOpen(prev => !prev)}>
                                {selectedSubject.subject_name ? `${selectedSubject.subject_name}${(selectedSubject.subject_days.length > 0) ? (" (" + selectedSubject.subject_days.join(", ") + ")") : ""}` : "선택하기 v"}
                            </button>
                            <ul className="dropdown-menu" data-is-open={isOpen.toString()}>
                                {
                                    items.map((item, i) => {
                                        return <li key={i} className='dropdown-item' onClick={() => { setIsOpen(false); setSelectedSubject(item); }}>
                                            {item.subject_name}{(item.subject_days.length > 0) && (" (" + item.subject_days.join(", ") + ")")}
                                        </li>
                                    })
                                }
                                <li className="dropdown-item">
                                    <button className='add-btn' onClick={handleAddItem}>
                                        + 새 과목
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <input type="text" placeholder="학생 추가 (00-00000)" onChange={async e => await addStudent(e)}></input>
                    </div>
                </form>
                <div className="row-wrapper slide">
                    <div className="prev" onClick={moveSlidePrev}>
                        {"<"}
                    </div>
                    <div className="student-list">
                        <div className="slide_box">
                            <DailySchedule className="slide_item" scheduleData={user.subjects.map(v => subjectList.find(x => x.id === v[currentDay].id) || {})}/>
                            <InstructionStudents className="slide_item" instructionData={{ lessonNumber: 1, grade: subjectList.find(v => v.id === user.subjects[0][currentDay].id)?.grade || 0, class: subjectList.find(v => v.id === user.subjects[0][currentDay].id)?.class || 0, lessonName: user.subjects[0][currentDay].name || "공강", students: subjectList.find(v => v.id === user.subjects[0][currentDay].id)?.students || [] }} />
                            <InstructionStudents className="slide_item" instructionData={{ lessonNumber: 2, grade: subjectList.find(v => v.id === user.subjects[1][currentDay].id)?.grade || 0, class: subjectList.find(v => v.id === user.subjects[1][currentDay].id)?.class || 0, lessonName: user.subjects[1][currentDay].name || "공강", students: subjectList.find(v => v.id === user.subjects[1][currentDay].id)?.students || [] }} />
                            <InstructionStudents className="slide_item" instructionData={{ lessonNumber: 3, grade: subjectList.find(v => v.id === user.subjects[2][currentDay].id)?.grade || 0, class: subjectList.find(v => v.id === user.subjects[2][currentDay].id)?.class || 0, lessonName: user.subjects[2][currentDay].name || "공강", students: subjectList.find(v => v.id === user.subjects[2][currentDay].id)?.students || [] }} />
                            <InstructionStudents className="slide_item" instructionData={{ lessonNumber: 4, grade: subjectList.find(v => v.id === user.subjects[3][currentDay].id)?.grade || 0, class: subjectList.find(v => v.id === user.subjects[3][currentDay].id)?.class || 0, lessonName: user.subjects[3][currentDay].name || "공강", students: subjectList.find(v => v.id === user.subjects[3][currentDay].id)?.students || [] }} />
                            <InstructionStudents className="slide_item" instructionData={{ lessonNumber: 5, grade: subjectList.find(v => v.id === user.subjects[4][currentDay].id)?.grade || 0, class: subjectList.find(v => v.id === user.subjects[4][currentDay].id)?.class || 0, lessonName: user.subjects[4][currentDay].name || "공강", students: subjectList.find(v => v.id === user.subjects[4][currentDay].id)?.students || [] }} />
                            <InstructionStudents className="slide_item" instructionData={{ lessonNumber: 6, grade: subjectList.find(v => v.id === user.subjects[5][currentDay].id)?.grade || 0, class: subjectList.find(v => v.id === user.subjects[5][currentDay].id)?.class || 0, lessonName: user.subjects[5][currentDay].name || "공강", students: subjectList.find(v => v.id === user.subjects[5][currentDay].id)?.students || [] }} />
                            <InstructionStudents className="slide_item" instructionData={{ lessonNumber: 7, grade: subjectList.find(v => v.id === user.subjects[6][currentDay].id)?.grade || 0, class: subjectList.find(v => v.id === user.subjects[6][currentDay].id)?.class || 0, lessonName: user.subjects[6][currentDay].name || "공강", students: subjectList.find(v => v.id === user.subjects[6][currentDay].id)?.students || [] }} />
                        </div>
                    </div>
                    <div className="next" onClick={moveSlideNext}>
                        {">"}
                    </div>
                </div>
            </div>
            <div className='profile-tab contents-wrapper'>
                <div className='profile-info-wrapper'>
                    <div className='profile-img' onClick={handleProfileClick}>
                        <img src={(user && user.avatar) ? user.avatar : guest_profile} alt="Profile" />
                    </div>
                    <div className='name'>
                        {
                            handleUserNameChange ? 
                            <div className="name-box">
                                <input className="new-name-input" type="text" placeholder=" 이름을 입력하세요." value={ newUserName } onChange={e => setNewUserName(e.target.value) }/>
                                <button className="new-name-submit" onClick={async (e) => await changeUserName(e)}>저장</button>
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
                    <form className='attendence-form-side' onSubmit={(event) => event.preventDefault() }>
                        <div className="dropdown" ref={dropdownRef}>
                            <span className="dropdown-box">
                                <button className="dropdown-placeholder" onClick={() => setIsOpen(!isOpen)}>
                                    {selectedSubject.subject_name ? `${selectedSubject.subject_name}${(selectedSubject.subject_days.length > 0) ? (" (" + selectedSubject.subject_days.join(", ") + ")") : ""}` : "선택하기 v"}
                                </button>
                                <ul className="dropdown-menu" data-is-open={isOpen.toString()}>
                                    {
                                        items.map((item, i) => {
                                            return <li key={i} className='dropdown-item' onClick={() => { setIsOpen(false); setSelectedSubject(item); }}>
                                                {item.subject_name}{(item.subject_days.length > 0) && (" (" + item.subject_days.join(", ") + ")")}
                                            </li>
                                        })
                                    }
                                    <li className='dropdown-item'>
                                        <button className='add-btn' onClick={handleAddItem}>
                                            + 새 과목
                                        </button>
                                    </li>
                                </ul>
                            </span>
                            <input type="text" placeholder="학생 추가 (00-00000)" onChange={addStudent}></input>
                        </div>
                        <button type="button" className="createQR" onClick={async() => await generateLink(currentSubject.id)}>
                            QR 생성
                        </button>
                    </form>
                </div>
                <QRCode url={generatedURL} iscreated={QRStatus} removelink={removeLink} />
                <Schedule scheduleData={user.subjects.map(v => v.map(v2 => subjectList.find(x => x.id === v2.id)))} ishided={QRStatus} setEditingCell={setEditingCell} setIsSelectSubjectPopupOpen={setIsSelectSubjectPopupOpen} />
            </div>
        </div>
    )
}

export default TeacherPage;