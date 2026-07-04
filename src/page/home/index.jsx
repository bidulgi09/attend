import React from 'react';
import './styles.css';
import { Helmet } from 'react-helmet-async';
import edit from '../../assets/edit.png';
import Schedule from '../../components/Schedule';

import banner from '../../assets/배너.png';
import NotesTab from '../../components/NotesTab';
function HomePage({ user, setUser }) {
    return (
        <div className="HomePage">
            <Helmet>
                <title>출첵커 | 홈</title>
            </Helmet>
            
            <div className='background'>
                <div className='banner'>
                    <ul className='rolling'>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                    <ul className='rolling'>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                </div>
                <div className='banner'>
                    <ul className='rolling'>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                    <ul className='rolling'>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                        <li><img src={banner} width={"300px"} height={"100%"}></img></li>
                    </ul>
                </div>
            </div>
            <div className='main'>
                <NotesTab NotesData={{ attendance: 10, result: 5, absence: 2, earlyLeave: 1 }} />
                <NotesTab NotesData={{ attendance: 8, result: 3, absence: 4, earlyLeave: 2 }} />
            </div>
            <div className='profile-tab contents-wrapper'> 
                <div className='profile-img'>
                    <img src={user ? user.avatar : 'https://i.pinimg.com/originals/78/20/45/7820459062e377482125ab4bafbd992f.jpg'} alt="Profile" />
                </div>
                <div className='name row-wrapper'>
                    <p>{user ? user.name : 'Guest'}</p>
                    <img className='edit-icon' src={edit} width='12vh' height='12vh' />
                </div>
                <div className='grade'>
                    {user ? user.grade : 'N/A'}
                </div>
                <form className='attendance-form'>
                    <input type="text" placeholder="출석 코드"></input>
                </form>
                <Schedule />
            </div>
        </div>
    )
}

export default HomePage;