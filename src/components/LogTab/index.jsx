import React from 'react';
import './styles.css';

function LogTab({ LogData }) {
    return (
        <div className="LogTab">
            <p className="log-title">출석 기록</p>
            <div className="log-datas">
                {
                    (function() {
                        let res = [];
                        for(let i = 0; i < LogData.length; i++) {
                            res.push(
                                <div className="log-data" key={`log_${i}`}>
                                    <span className="log-subject" status={LogData[i].status}>[{LogData[i].subject}]&nbsp;</span>
                                    <span className="log-status">{LogData[i].status}</span>
                                    <span className="log-date">{LogData[i].date}</span>
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