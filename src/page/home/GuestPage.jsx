import React from 'react';
import './GuestStyles.css';

function GuestPage() {
    return (
        <div className="GuestPage">
            <div className="main-layout">
                <div className="title-container">
                    <div className="title">출첵커와 함께 하는 새로운 출석 관리 경험</div>
                    <div className="description">효율적이고 간편한 출석 관리를 시작하세요!</div>
                </div>
                <div className="content-container">
                    <img src="src/assets/서비스.png" width="200px" height="200px"></img>
                    <div className="text">
                        <div className="signin-btn">지금 회원가입하기</div>
                        <div className="more-info">더 알아보기</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuestPage;