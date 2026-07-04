import React from 'react';
import './styles.css';

function NotesTab({ NotesData }) {
    return (
        <table className="notes-table">
            <thead>
                <tr>
                    <th scope='col'>출석</th>
                    <th scope='col'>결과</th>
                    <th scope='col'>결석</th>
                    <th scope='col'>조퇴</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>10</td>
                    <td>5</td>
                    <td>2</td>
                    <td>1</td>
                </tr>
            </tbody>
        </table>
    );
}

export default NotesTab;