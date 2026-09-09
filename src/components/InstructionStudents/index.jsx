import React, { useState, useEffect } from 'react';
import './styles.css';

import UserManager from '../../server/utils/UserManager';

function InstructionStudents({ instructionData, className }) {
    let [attendedStudents, setAttendedStudents] = useState([]);
    
    useEffect(() => {
        async function getAttendLog() {
            let res = await UserManager.getAllAttendLog();
            res = res.results.list;
            setAttendedStudents(res.filter(student => new Date(student.checked_at) >= new Date().setHours(0, 0, 0, 0)));
        }
        getAttendLog();
    }, [attendedStudents]);

    return (
        <div className={`InstructionStudents ${className}`}>
            <h2>{instructionData.lessonNumber}교시 - {instructionData.lessonName} ({instructionData.grade + "-" + instructionData.class})</h2>
            <ul className="InstructionStudentsList">
                {
                    instructionData.students.map((student, index) => {
                        let isAttended = attendedStudents.find(attendedStudent => attendedStudent.student_id === student.id && attendedStudent.subject_id === instructionData.id);
                        console.log(isAttended?.status);
                        return (
                            <li key={index} className="student" status={isAttended?.status} onClick={() => alert(`학생 이름: ${student.name}\n학생 ID: ${student.id}\n출석상태: ${isAttended?.status == "present" ? "출석" : isAttended?.status == "absent" ? "결석" : "미출석"}`)}>
                                [{isAttended?.status == "present" ? "출석" : isAttended?.status == "absent" ? "결석" : isAttended?.status === "late" ? "지각" : "미출석"}]<br/>{student.id}<br/>{student.name}
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

export default InstructionStudents;