import React from 'react';
import TeacherPage from './TeacherPage.jsx';
import StudentPage from './StudentPage.jsx';
import GuestPage from './GuestPage.jsx';

function HomePage({ user, setUser }) {
    console.log(JSON.stringify(user, null, 4));
    return (user && user.isLogin && user.role === "Student") ? 
        <StudentPage user={user} setUser={setUser}/> : 
        (user && user.isLogin && user.role === "Teacher") ?
        <TeacherPage user={user} setUser={setUser}/> :
        <GuestPage/>;
}

export default HomePage;