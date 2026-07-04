import React from 'react';
import TeacherPage from './TeacherPage.jsx';
import StudentPage from './StudentPage.jsx';

function HomePage({ user, setUser }) {
    return (user && user.role) === "Student" ? StudentPage : TeacherPage;
}

export default HomePage;