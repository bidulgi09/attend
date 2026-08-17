import React, { useState, useEffect } from 'react';
import './styles.css';

import SubjectManager from '../../server/utils/SubjectManager.js';
import UserManager from '../../server/utils/UserManager.js';

function SelectSubjectPopup({ isopen, setIsOpen, user, setUser, editingCell }) {
    const [subjectList, setSubjectList] = useState([]);
    useEffect(() => {
        let fetchItems = async () => {
            let subjects = await SubjectManager.getAll();
            setSubjectList(subjects.results.list);
        }
        
        console.log(user);
        fetchItems();
    }, []);
    const days = ['월', '화', '수', '목', '금'];
    const [subject, setSubject] = useState('');
    function updateSubject(, subject) {
        let selectedSubject = subject.name;
        let selectedSubjectId = subject.id;
        let subjects = user.subjects;
        subjects[editingCell.row][editingCell.col] = selectedSubject;
        setUser({...user, subjects});
    }
    return (
        <div className="SelectSubjectPopup" isopen={isopen.toString()}>
            <div className="close" onClick={() => setIsOpen(!isopen)}>X</div>
            <div className="subject-form" onSubmit={(e) => e.preventDefault()}>
                <p className="title">{days[editingCell.col]}요일 {editingCell.row + 1}교시</p>
                <div className="subject-input">
                    <input type="text" className="subject" placeholder='과목 입력' value={subject} onChange={e => setSubject(e.target.value)}></input>
                    <div className="subject-list">
                        {
                            subjectList.filter(v => (v.subject_name.includes(subject) || v.teacher_name.includes(subject)) && v.subject_days.includes(days[editingCell.col])).map((subject, index) => {
                                return (
                                    <div className="subject-item" key={index} onClick={ e => { updateSubject(e, subject) } }>
                                        {index + 1}. {subject.subject_name} ({subject.subject_days.join(", ")}) - {subject.teacher_name}
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