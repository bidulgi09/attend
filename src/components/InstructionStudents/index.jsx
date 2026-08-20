import React from 'react';
import './styles.css';

function InstructionStudents({ instructionData, className }) {
    return (
        <div className={`InstructionStudents ${className}`}>
            <h2>{instructionData.lessonNumber}교시 - {instructionData.lessonName} ({instructionData.grade + "-" + instructionData.class})</h2>
            <ul className="InstructionStudentsList">
                {
                    instructionData.students.map((student, index) => (
                        <li key={index}>{student.id}<br/>{student.name}</li>
                    ))
                }
            </ul>
        </div>
    );
}

export default InstructionStudents;