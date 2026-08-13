import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GuestStyles.css';
import Image from '../../assets/main.png';
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
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default GuestPage;