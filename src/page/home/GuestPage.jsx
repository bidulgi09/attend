import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GuestStyles.css';
import Image from '../../assets/main.png';
import QuickAttend from '../../assets/quick_attend.svg?react';
import NoDownload from '../../assets/no_need_download.svg?react';
function GuestPage() {
    return (
        <div className="GuestPage">
            <div className="main-layout">
                <div className="title-container">
                    <div className="title">출첵커와 함께 하는 새로운 출석 관리 경험</div>
                    <div className="description">효율적이고 간편한 출석 관리를 시작하세요!</div>
                </div>
                <div className="content-container">
                    <img src={Image} width="350px" height="250px"/>
                    <nav className="text">
                        <Link to="/signup" className="signup-btn">지금 시작하기</Link>
                        <Link to="/more-info" className="more-info">더 알아보기</Link>
                        <div className="icons">
                            <div className="quick-attend">
                                <QuickAttend className="quick-attend-icon" width="100px" height="100px" color="white"/>
                                <div className="quick-attend-text">빠른 출석 체크</div>
                                <div className="quick-attend-subtext">간단한 QR/코드 기반 체크</div>
                            </div>
                            <div className="no-download">
                                <NoDownload className="no-download-icon" width="100px" height="100px" color="white"/>
                                <div className="no-download-text">필요없는 앱 설치</div>
                                <div className="no-download-subtext">웹 기반 출석체크</div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default GuestPage;