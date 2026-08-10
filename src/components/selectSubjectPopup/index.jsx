import React, { useState, useEffect } from 'react';
import './styles.css';

import SubjectManager from '../../server/utils/SubjectManager.js';
import UserManager from '../../server/utils/UserManager.js';

function SelectSubjectPopup({ isopen, setIsOpen, scheduleData, setScheduleData, editingCell }) {
    const [subjectList, setSubjectList] = useState([]);
    useEffect(() => {
        let fetchItems = async () => {
            let subjects = await SubjectManager.getAll();
            console.log(subjects);
            setSubjectList(subjects.results.list);
        }
        fetchItems();
    }, []);
    const days = ['월', '화', '수', '목', '금'];
    const [subject, setSubject] = useState('');
    return (
        <div className="SelectSubjectPopup" isopen={isopen.toString()}>
            <div className="close" onClick={() => setIsOpen(!isopen)}>X</div>
            <div className="subject-form" onSubmit={(e) => e.preventDefault()}>
                <p className="title">{days[editingCell.col]}요일 {editingCell.row + 1}교시 과목 변경</p>
                <div className="subject-input">
                    <input type="text" className="subject" placeholder='과목 입력' value={subject} onChange={e => setSubject(e.target.value)}></input>
                    <div className="subject-list">
                        {
                            subjectList.filter(v => v.subject_name.includes(subject)).map((subject, index) => {
                                return (
                                    <div className="subject-item" key={index}>
                                        <span>{subject.subject_name} - {subject.teacher_name}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectSubjectPopup;