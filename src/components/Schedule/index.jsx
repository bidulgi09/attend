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
                        if(scheduleData.length === 0) {
                            return [];
                        }
                        for(let i = 0; i < scheduleData.length; i++) {
                            let row=[];
                            for(let j = 0; j < scheduleData[i].length; j++) {
                                row.push(<td key={`td_${j}`}>{scheduleData[i][j]}</td>);
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