import React from 'react';
import './styles.css';

function DailySchedule({ scheduleData, className }) {
    return (
        <table className={`DailyScheduleTable ${className}`}>
            <thead>
                <tr>
                    <th className="title" colSpan={2}>
                        오늘의 시간표
                    </th>
                </tr>
                <tr>
                    <th>교시</th>
                    <th>과목</th>
                </tr>
            </thead>
            <tbody>
                {
                    (function() {
                        let res = [];
                        for(let i = 0; i < (scheduleData ? scheduleData.length : 7); i++) {
                            res.push(
                                <tr key={`tr_${i}`}>
                                    <th key={`th_${i}`}>{i+1}교시</th>
                                    <td key={`td_${i}`}>{scheduleData[i].subject_name ? ((scheduleData[i].subject_name || "공강") + (" (" + (scheduleData[i].grade || 0) + "-" + (scheduleData[i].class || 0) + ")")) : "공강"}</td>
                                </tr>
                            );
                        }
                        return res;
                    })()
                }
            </tbody>
        </table>
    );
}

export default DailySchedule;