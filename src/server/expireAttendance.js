import mysql from "mysql2"; 
import dbconfig from "../mysql_middleware/config/database.js"; 
const pool = mysql.createPool(dbconfig); 

function expireAttendance(sessionId) {
    pool.getConnection((err, connection) => {
        if(err) return;
        connection.query(`
            SELECT id, subject_id, teacher_id
            FROM attendance_sessions
            WHERE id = ?
                AND expires_at <= NOW()
                AND status = 'active'
            `, [sessionId], 
            function(error, results, fields) {
                if(error || results.length === 0) {
                    connection.release();
                    return;
                }
                const session = results[0];
                
                connection.query(`
                    INSERT INTO attendances
                        (session_id, subject_id, student_id, status)
                    SELECT
                        ?,
                        ?,
                        ss.student_id,
                        'absent'
                    FROM subject_students ss
                    LEFT JOIN attendances a
                        ON a.session_id = ?
                        AND a.student_id = ss.student_id
                    WHERE ss.subject_teacher_id = ?
                        AND a.id IS NULL
                    `, [session.id, session.subject_id, session.id, `${session.subject_id}-${session.teacher_id}`],
                    function(error) {
                        if(error) {
                            connection.release();
                            return error;
                        }
                        console.log("자동 결석 처리 결과:", result.affectedRows);
                        connection.query(`
                            UPDATE attendance_sessions
                            SET status='expired'
                            WHERE id = ?
                        `, [session.id],
                        function(error) {
                            connection.release();
                            if(error) return error;
                        })
                    });
            }
        );
    });
}