import react, { useState } from 'react';
import './styles.css';

import SubjectManager from '../../server/utils/SubjectManager.js';
import UserManager from '../../server/utils/UserManager.js';

function SubjectPopup ({ isopen, user }) {
    const [data, setData] = useState({
        name: null,
        days: []
    });
    const setDays = function() {
        setData(Object.assign(data, {days: Array.from(document.getElementsByClassName("dayName")).filter(v => v.checked).map(v => v.value)}));
    }
    const setSubject = function(event) {
        setData(Object.assign(data, { name: event.target.value }));
    }
    const addSubject = async function(event) {
        event.preventDefault();
        console.log(data);
        let res = await SubjectManager.addSubject(data);
        console.log(user);
        UserManager.connectSubject(Object.assign(data, { id: res.results.subject.id }), user);
    }
    return (
        <div className="SubjectPopup" isopen={isopen.toString()}>
            <form className="subject-form" onChange={setDays} onSubmit={(e) => e.preventDefault()}>
                <p className="title">과목 추가</p>
                <div className="subject-input">
                    <input type="text" className="subject" placeholder='과목 입력' value={data.name} onChange={setSubject}></input>
                    <button className = "subject-submit" onClick={addSubject}>추가</button>
                </div>
                <span>요일 선택</span>
                <div className="days">
                    <div className="day">
                        <input type="checkbox" className="dayName" value="월"/>
                        <span>월</span>
                    </div>
                    
                    <div className="day">
                        <input type="checkbox" className="dayName" value="화"/>
                        <span>화</span>
                    </div>
                    <div className="day">
                        <input type="checkbox" className="dayName" value="수"/>
                        <span>수</span>
                    </div>
                    <div className="day">
                        <input type="checkbox" className="dayName" value="목"/>
                        <span>목</span>
                    </div>
                    <div className="day">
                        <input type="checkbox" className="dayName" value="금"/>
                        <span>금</span>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SubjectPopup;