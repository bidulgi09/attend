import React from 'react';
import './styles.css';

function LogTab({ LogData, className }) {
    return (
        <div className={`LogTab ${className}`}>
            <p className="log-title">출석 기록</p>
            <div className="log-datas">
                {
                    (function() {
                        let res = [];
                        for(let i = 0; i < LogData.length; i++) {
                            res.push(
                                <div className="log-data" key={`log_${i}`}>
                                    <span className="log-subject" status={LogData[i].status}>[{LogData[i].subject_name}]&nbsp;</span>
                                    <span className="log-status">{LogData[i].status === 'present' ? '출석' : LogData[i].status === 'late' ? '결과' : '결석'}</span>
                                    <span className="log-date">{LogData[i].checked_at}</span>
                                </div>
                            )
                        }
                        return res;
                    })()
                }
            </div>
        </div>
    )
}

export default LogTab;