import React from 'react';
import TeacherPage from './TeacherPage.jsx';
import StudentPage from './StudentPage.jsx';

function HomePage({ user, setUser }) {
    return (user && user.role === "Student") ? <StudentPage user={user} setUser={setUser}/> : <TeacherPage user={user} setUser={setUser}/>;
}

export default HomePage;