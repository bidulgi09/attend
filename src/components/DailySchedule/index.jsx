import React from 'react';
import './styles.css';

function DailySchedule({ scheduleData }) {
    return (
        <table className="DailyScheduleTable">
            <thead>
                <th className="title" colSpan={2}>
                    오늘의 시간표
                </th>
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
                                    <td key={`td_${i}`}>{(scheduleData ? scheduleData[i] : "공강")}</td>
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