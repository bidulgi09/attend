import React from 'react';
import './styles.css';

function Schedule({ scheduleData }) {
    return (
        <table className="ScheduleTable">
            <thead>
                <tr>
                    <th></th>
                    <th>월</th>
                    <th>화</th>
                    <th>수</th>
                    <th>목</th>
                    <th>금</th>
                </tr>
            </thead>
            <tbody>
                {
                    (function() {
                        let res = [];
                        for(let i = 0; i < scheduleData ? scheduleData.length : 7; i++) {
                            let row=[];
                            for(let j = 0; j < scheduleData ? scheduleData.length : 5; j++) {
                                row.push(<td key={`td_${j}`}>{scheduleData ? scheduleData[i][j] : "공강"}</td>);
                            }
                            res.push(<tr key={`tr_${i}`}><th key={`th_${i}`}>{i+1}교시</th>{row}</tr>);
                        }
                        return res;
                    })()
                }
            </tbody>
        </table>
    );
}

export default Schedule;