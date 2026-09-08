import React from 'react';
import './styles.css';

function NotesTab({ NotesData, className }) {
    return (
        <table className={`notes-table ${className}`}>
            <thead>
                <tr>
                    <th scope='col'>출석</th>
                    <th scope='col'>결과</th>
                    <th scope='col'>결석</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{NotesData.filter(v => v.status === 'present').length}</td>
                    <td>{NotesData.filter(v => v.status === 'late').length}</td>
                    <td>{NotesData.filter(v => v.status === 'absent').length}</td>
                </tr>
            </tbody>
        </table>
    );
}

export default NotesTab;