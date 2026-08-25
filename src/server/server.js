import dotenv from 'dotenv';
import express from "express"; 
import cors from 'cors'; 
import bodyParser from "body-parser"; 
import cookieParser from "cookie-parser";
import mysql from "mysql2"; 
import dbconfig from "../mysql_middleware/config/database.js"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from "uuid";
import checkDomainServer from "./utils/checkDomainServer.js";
import authenticateToken from "./utils/authenticateToken.js";
import multer from 'multer';
import crypto from 'crypto';

dotenv.config({ path: '.env' });

const app = express(); 
const port = process.env.PORT || 5000; 
const pool = mysql.createPool(dbconfig); 
const salt = 12;

const SUPABASE_URL = 'https://axpxtxdyknjciwomxulh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_kPhXQFcrsvcGAgVV0K5E4Q_5ASLXCgZ'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const upload = multer({
    storage: multer.memoryStorage()
});

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://attend-508x.onrender.com",
        "https://api.xn--wx6bnqz4a.xn--yq5b.xn--3e0b707e",
        "https://www.xn--wx6bnqz4a.xn--yq5b.xn--3e0b707e",
        "https://xn--wx6bnqz4a.xn--yq5b.xn--3e0b707e",
        "https://organic-engine-x5j4gjxjq7xxfv44w-5173.app.github.dev",
        "https://refactored-potato-4j66rr45x7753gvx-5173.app.github.dev",
        "https://cuddly-garbanzo-g466pp9j9wv9h9v4x.github.dev/",
        "https://bidulgi09.github.io"
    ], 
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 

app.get("/ping", (req, res) => {
    res.json({ message: "pong" });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try{ 
    if(!req.file) return res.status(500).json({ success: true, results: { isUploaded: false, reason: "Cannot find uploaded file."}});
    
    const fileName = `${Date.now()}.${req.file.originalname.split('.').pop()}`;
    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: true
        });
    if(error) return res.send({ success: true, results: { isUploaded: false, reason: error } });
    
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
    let user = JSON.parse(req.body.user);
    if(!user || !user.role) return res.send({ success: true, results: { isUploaded: false, reason: "Unknown User."} }); 
    pool.getConnection(function(err, connection) {
        if(err) return res.send({ success: true, results: { isUploaded: false, reason: err } });
        if(!req.cookies.access_token) {
            connection.release();
            return res.status(401).json({ error: "Anauthorized user." });
        }
        let table = user.role === "Student" ? "students" : "teachers"
        connection.query(`UPDATE ${table} SET avatar = ? WHERE id = ?`, [publicUrl, user.id], function(errors, results, fields) {
            connection.release();
            if(errors) return res.send({ success: true, results: { isUploaded: false, reason: errors }});
            return res.send({ success: true, results: { isUploaded: true, url: publicUrl }});
        });
    });
    } catch(e) {
        console.log(e);
        return res.send(e);
    }
})
app.get('/api/userList', (req, res) => { 
    pool.getConnection(function(err, connection) { 
        if(err) return res.status(500).json({ success: false, results: { isSearched: false, reason: err } });
        connection.query("SELECT id, name, email, role, avatar, subjects FROM students UNION ALL SELECT id, name, email, role, avatar, subjects FROM teachers;", function(error, results, fields) {
            connection.release(); 
            if(error) return res.status(500).json({ success: false, results: { isSearched: false, reason: error } });
            return res.send({ counts: results.length, results }); 
        }) 
    }) 
}); 
app.post('/api/check', (req, res) => { 
    pool.getConnection(function(err, connection) { 
        if(err) return res.status(500).json({ success: false, results: { isAvailable: false, reason: err } });
        let data = [ req.body.email, req.body.id, req.body.email, req.body.id ]; 
        connection.query('SELECT email, id, role FROM students WHERE email=? OR id=? UNION ALL SELECT email, id, role FROM teachers WHERE email=? OR id=?;', data, async function(error, results, fields) { 
            connection.release(); 
            if(error) { 
                console.error(error); 
                res.status(500).json({ error: "데이터 검색 실패" }); 
                return; 
            } 

            let regex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            let domain = await checkDomainServer(req.body.email.split('@')[1]);
            if(!regex.test(req.body.email) || !domain.isValid || results.length > 0) {
                res.send({ success: true, results: { isAvailable: false, reason: "Invalid email" }});
            } else {
                res.send({ success: true, results: { isAvailable: true } });
            }
        }); 
    }); 
}); 
app.post('/api/signUp', (req, res) => {
    pool.getConnection(function(err, connection) { 
        if(err) return res.status(500).json({ success: false, results: { insertedId: -1, reason: err } });
        let password_hash = bcrypt.hashSync(req.body.password, salt);
        let table = req.body.role === "Student" ? "students" : "teachers"
        let datas = [
            req.body.id, 
            req.body.name || (() => {
                const timestamp = Date.now().toString(36); // 현재 시간을 36진수로 변환
                const randomStr = Math.random().toString(36).substring(2, 6); // 4자리 난수
                return `user_${timestamp}${randomStr}`;
            })(), 
            req.body.email, 
            password_hash,
            JSON.stringify(Array.from({ length: 7 }, () => Array.from({ length: 5 }, () => { return { id: null, name: null } })))
        ]; 
        connection.query(`INSERT INTO ${table} (id, name, email, password_hash, subjects) VALUES (?, ?, ?, ?, ?);`, datas, function(error, results, fields) { 
            connection.release();
            if(error) {
                console.log(error);
                res.status(500).json({ success: false, results: { insertedId: -1, reason: error } });
                return;
            }
            res.json({ success: true, results: { insertedId: results.insertId }}); 
        }); 
    }); 
});
app.post('/api/deleteAccount', (req, res) => {
    pool.getConnection(function(err, connection) { 
        if(err) return res.status(500).json({ success: false, results: { isDeleted: false, reason: err } });
        let table = req.body.role === "Student" ? "students" : "teachers"
        let datas = [ 
            req.body.id,
        ]; 
        connection.query(`SELECT password_hash FROM ${table} WHERE id=?;`, datas, function(error, results, fields) { 
            if(error) {
                connection.release();
                res.status(500).json({ success: false, results: { isDeleted: false, reason: "Fail to search" } });
                return;
            }
            if(bcrypt.compareSync(req.body.password, results[0].password_hash)) {
                datas.push(results[0].password_hash);
                connection.query(`DELETE FROM ${table} WHERE id=? AND password_hash=?;`, datas, function(error2, results2) {
                    connection.release(); 
                    if(error2) { 
                        console.error(error2); 
                        res.status(500).json({ error: "데이터 삭제 실패" }); 
                        return; 
                    }
                    res.json({ success: true, results: { isDeleted: results2.affectedRows===1 } });
                });
            } else {
                connection.release();
                res.send({ success: false, results: { isDeleted: false, reason: "Invalid password." }});
                return;
            }
        }); 
    }); 
});
app.post('/api/logIn', (req, res) => {
    const REFRESH_TOKEN_EXPIRED_IN=(()=>new Date(Date.now() + 7*24*60*60*1000))();
    const ACCESS_TOKEN_EXPIRED_IN=(()=>new Date(Date.now() + 3*60*60*1000))();
    pool.getConnection(function(err, connection) {
        if(err) return res.status(500).json({ success: false, results: { isLogin: false, reason: err } });
        let table = req.body.role === "Student" ? "students" : "teachers"
        let data = [
            req.body.id,
        ];
        connection.query(`SELECT password_hash FROM ${table} WHERE id = ?`, data, function(error, results, fields) {
            if(error) {
                connection.release();
                res.status(500).json({ success: false, results: { isLogin: false, reason: "Fail to search" } });
                return;
            }
            if(results.length === 0) {
                connection.release();
                res.send({ success: false, results: { isLogIn: false, reason: "Account not found." } });
                return;
            } else {
                if(bcrypt.compareSync(req.body.password, results[0].password_hash)) {
                    let refresh_token=uuidv4();
                    let access_token=jwt.sign({ id: req.body.id, role: req.body.role }, "access_secret", { expiresIn: "3h" });
                    connection.query(`UPDATE ${table} SET refresh_token=?, expired_in=? WHERE id=?;`, [refresh_token, REFRESH_TOKEN_EXPIRED_IN, req.body.id], function(error2, results2) {
                        connection.release();
                        if(error2) {
                            res.status(500).json({ error: "데이터 수정 실패" });
                            return;
                        }
                        res.cookie('refresh_token', refresh_token, {
                            expires: REFRESH_TOKEN_EXPIRED_IN,
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none'
                        });
                        
                        res.cookie('access_token', access_token, {
                            expires: ACCESS_TOKEN_EXPIRED_IN,
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none'
                        });
                        res.send({ success: true, results: { isLogIn: true, refresh_token: { value: refresh_token, expiry: REFRESH_TOKEN_EXPIRED_IN } }});
                        return;
                    });
                } else {
                    connection.release();
                    res.send({ success: false, results: { isLogIn: false, reason: "Invalid password." }});
                    return;
                }
            }
        });
    });
});
app.post('/api/logOut', (req, res) => {
    pool.getConnection(function(err, connection) {
        if(err) return res.status(500).json({ success: false, results: { isLogOut: false, reason: err } });
        if(!req.cookies.access_token) {
            connection.release();
            res.send({ success: false, results: { isLogOut: false, reason: "Unauthorized" } });
            return;
        }
        let user_data = jwt.decode(req.cookies.access_token);
        let table = user_data.role === "Student" ? "students" : "teachers"
        let data = [null, null, user_data.id];
        connection.query(`UPDATE ${table} SET refresh_token=?, expired_in=? WHERE id=?`, data, function(error, results, fields) {
            connection.release();
            if(error) {
                res.status(500).send({ error: "데이터 갱신 실패" });
                return;
            }
            if(results.affectedRows === 0) {
                res.status(403).send({ success: true, results: { isLogOut: false, reason: "user not found"}});
                return;
            }
            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
            res.clearCookie("access_token", {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
            res.send({ success: true, results: { isLogOut: true }});
        });
    });
});
app.get('/api/profile', authenticateToken, (req, res) => {
    pool.getConnection(function(err, connection) {
        if(err) return res.status(500).json({ success: false, results: { isLoaded: false, reason: err } });
        if(!req.user || !req.user.id) {
            connection.release();
            res.send({ success: false, results: { isLoaded: false, reason: "Unauthorized"}});
            return;
        }
        let table = req.user.role === "Student" ? "students" : "teachers";
        let data = [req.user.id];
        connection.query(`SELECT id, email, name, role, avatar, subjects FROM ${table} WHERE id=?;`, data, function(error, results, fields) {
            connection.release();
            if(error) {
                res.status(500).json({ success: false, results: { isLoaded: false, reason: "Fail to search" } });
                return;
            }
            res.send({ success: true, results: { isLoaded: true, user: results[0] } });
            return;
        });
    });
});
app.post('/api/updateUser', (req, res) => {
    const user = req.body;
    pool.getConnection(function(err, connection) {
        if(err) return res.status(500).json({ success: false, results: { isUpdated: false, reason: err }});
        if(!req.cookies.access_token) {
            connection.release();
            return res.status(401).json({ error: "Anauthorized user" });
        }
        let data = [ user.email, user.name, user.role, user.subjects, user.id ];
        let table = user.role === "Student" ? "students" : "teachers";
        connection.query(`UPDATE ${table} SET email=?, name=?, role=?, subjects=? WHERE id=? `, data, function(errors, result, fields) {
            connection.release();
            if(errors) return res.send({ success: true, results: { isUpdated: false, reason: errors }});
            return res.send({ success: true, results: { isUpdated: true }});
        });
    })
});
app.post('/api/refresh', (req, res) => {
    const REFRESH_TOKEN_EXPIRED_IN=(()=>new Date(Date.now() + 7*24*60*60*1000))();
    const ACCESS_TOKEN_EXPIRED_IN=(()=>new Date(Date.now() + 3*60*60*1000))();
    pool.getConnection(function(err, connection) {
        if(err) return res.status(500).json({ success: false, results: { isRefreshed: false, reason: err } });
        if(!req.cookies.refresh_token) {
            connection.release();
            return res.status(401).json({ error: "Refresh token required."});   
        }
        let data = [req.cookies.refresh_token, req.cookies.refresh_token];
        connection.query('SELECT id, refresh_token, expired_in FROM students WHERE refresh_token=? UNION ALL SELECT id, refresh_token, expired_in FROM teachers WHERE refresh_token=?;', data, function(error, results, fields) {
            let user = results[0];
            if(error) {
                connection.release();
                res.status(500).json({ success: false, results: { isRefreshed: false, reason: "Fail to search" } });
                return;
            }
            if(!user) {
                connection.release();
                res.status(401).json({ success: false, results: { isRefreshed: false, reason: "Not exists." } });
                return;
            }
            if(user.refresh_token !== req.cookies.refresh_token || user.expired_in < new Date(Date.now())) {
                connection.release();
                res.status(403).json({ success: false, results: { isRefreshed: false, reason: "Invalid refresh token" } });
                return;
            }

            let table = user.role === "Student" ? "students" : "teachers"
            let new_refresh_token = uuidv4();
            let new_access_token = jwt.sign({ id: user.id, role: user.role }, "access_secret", { expiresIn: '3h' });
            connection.query(`UPDATE ${table} SET refresh_token=?, expired_in=? WHERE id=?;`, [new_refresh_token, REFRESH_TOKEN_EXPIRED_IN, user.id], function(error2, results2) {
                connection.release();
                if(error2) {
                    res.status(500).json({ success: false, results: { isRefreshed: false, reason: "Fail to update" } });
                    return;
                }
                res.cookie('refresh_token', new_refresh_token, {
                    expires: REFRESH_TOKEN_EXPIRED_IN,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                });
                
                res.cookie('access_token', new_access_token, {
                    expires: ACCESS_TOKEN_EXPIRED_IN,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                }); 

                res.send({ success: true, results: { isRefreshed: true, data: user } });
                return;
            });
        });
    });
});
app.patch('/api/password', (req, res) => {
    pool.getConnection(function(err, connection) {
        if(err) {
            res.status(500).json({ success: false, results: { isChanged: false, reason: "Fail to search" } });
            return;
        }
        let table = req.body.role === "Student" ? "students" : "teachers"
        let data = [
            req.body.id
        ];

        connection.query(`SELECT password_hash FROM ${table} WHERE id = ?;`, data, function(error, results, fields) {
            if(error) {
                connection.release();
                res.status(500).json({ success: false, results: { isChanged: false, reason: "Fail to search" } });
                return;
            }
            if(results.length === 0) {
                connection.release();
                res.send({ success: false, results: { isChanged: false, reason: "Account not found." } });
                return;
            } else {
                if(bcrypt.compareSync(req.body.password, results[0].password_hash)) {
                    if(!/^[a-zA-Z0-9]{8,16}$/.test(req.body.new_password)) {
                        connection.release();
                        res.status(401).json({ success: false, results: { isChanged: false, reason: "Invalid format" } });
                        return;
                    }
                    let table = req.body.role === "Student" ? "students" : "teachers"
                    let refresh_token=uuidv4();
                    let access_token=jwt.sign({ id: req.body.id, role: req.body.role }, "access_secret", { expiresIn: "3h" });
                    let new_password_hash=bcrypt.hashSync(req.body.new_password, salt);
                    connection.query(`UPDATE ${table} SET password_hash=? WHERE id=?;`, [new_password_hash, req.body.id], function(error2, results2) {
                        connection.release();
                        if(error2) {
                            res.status(500).json({ success: false, results: { isChanged: false, reason: "Fail to update" } });
                            return;
                        }
                        res.send({ success: true, results: { isChanged: true, new_password: req.body.new_password }});
                        return;
                    });
                } else {
                    connection.release();
                    res.send({ success: false, results: { isChanged: false, reason: "Invalid password." }});
                    return;
                }
            }
        });
    });
});

app.post('/api/addSubject', (req, res) => {
    pool.getConnection(function(err, connection) {
        if(err) return res.status(500).json({ success: false, results: { isAdded: false, reason: err }});
        connection.query("INSERT INTO subjects (name) VALUES (?)", [req.body.name], function(error, result, fields) {
            if(error) {
                if(error.code === "ER_DUP_ENTRY") {
                    return connection.query("SELECT id FROM subjects WHERE name=?", [req.body.name], function(error2, result2) {
                        connection.release();
                        if(error2) 
                            return res.json({ success: false, results: { isAdded: false, reason: error2 } });
                        return res.json({ success: true, results: { isAdded: true, subject: { id: result2[0].id } } });
                    });
                } else {
                    connection.release();
                    return res.json({ success: false, results: { isAdded: false, reason: error }});
                }
            }
            connection.release();
            return res.json({ success: true, results: { isAdded: true, subject: { id: result.insertId } } });
        });
    });
});

app.post('/api/connectSubject', (req, res) => {
    pool.getConnection(function(err, connection) {
            console.log(req.body);
        if(err) return res.status(500).json({ success: false, results: { isConnected: false, reason: err }});
        connection.query("INSERT INTO subject_teachers (subject_id, teacher_id, grade, class, days) VALUES (?, ?, ?, ?, ?)", [req.body.subject.id, req.body.teacher.id, req.body.subject.grade, req.body.subject.class, JSON.stringify(req.body.subject.days)], function(error, result, fields) {
            connection.release();
            if(error) return res.json({ success: false, results: { isConnected: false, reason: error }});
            return res.json({ success: true, results: { isConnected: true, insertId: result.insertId }});
        });
    })
});

app.post('/api/connectStudent', (req, res) => {
    pool.getConnection(function(err, connection) {
            console.log(req.body);
        if(err) return res.status(500).json({ success: false, results: { isConnected: false, reason: err }});
        connection.query("INSERT INTO subject_students (subject_teacher_id, student_id) VALUES (?, ?)", [req.body.subject_teacher_id, req.body.student_id], function(error, result, fields) {
            connection.release();
            if(error) return res.json({ success: false, results: { isConnected: false, reason: error }});
            return res.json({ success: true, results: { isConnected: true, insertId: result.insertId }});
        });
    })
});

app.get('/api/subjectList', (req, res) => {
    pool.getConnection(function(err, connection) {
        if(err) return res.status(500).json({ success: false, results: { isLoaded: false, reason: err }});
        connection.query(
            `SELECT 
                a.id AS id,
                a.subject_id AS subject_id, c.name AS subject_name, 
                a.teacher_id AS teacher_id, d.name AS teacher_name,
                a.grade AS grade, a.class AS class, 
                a.days AS subject_days,
                COALESCE(
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', b.student_id,
                                'name', e.name
                            )
                        ) 
                        FROM subject_students AS b 
                        INNER JOIN students AS e
                            ON b.student_id = e.id
                        WHERE b.subject_teacher_id = CONCAT(a.id, '-', a.teacher_id)
                    ),
                    JSON_ARRAY()
                ) AS students
            FROM subject_teachers AS a 
            INNER JOIN subjects AS c 
                ON a.subject_id = c.id 
            INNER JOIN teachers AS d
                ON a.teacher_id = d.id
            GROUP BY a.id, a.subject_id, c.name, a.teacher_id, a.days, d.name`, 
            function(error, result, fields) {
                connection.release();
                if(error) return res.json({ success: false, results: { isLoaded: false, reason: error }});
                result.forEach(v => {
                    v.subject_days = typeof v.subject_days== 'object' ? v.subject_days: JSON.parse(v.subject_days);
                    v.students = typeof v.students == 'object' ? v.students : JSON.parse(v.students);
                    return;
                });
                return res.json({ success: true, results: { isLoaded: true, list: result }}); 
            })
    })
});

app.post('/api/attendance_session', authenticateToken, (req, res) => {
    pool.getConnection(function(err, connection) {
        if(err) return res.status(500).json({ success: false, results: { isCreated: false, reason: err }});
        if(req.user.role !== "Teacher") {
            connection.release();
            res.send({ success: false, results: { isCreated: false, reason: "Unauthorized" } });
            return;
        }
        
        let token = crypto.randomBytes(16).toString('hex');
        let code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
        let expires_at = new Date(Date.now() + 50 * 60 * 1000);
        connection.query(`
            SELECT id 
            FROM attendance_sessions 
            WHERE subject_id = ? 
                AND teacher_id = ? 
                AND status='ACTIVE' 
                AND expires_at > NOW()
            LIMIT 1
        `, [req.body.subject_id, req.user.id], 
        function(error, rows) {
            if(error) {
                connection.release();
                return res.status(500).json({ success: false, results: { isCreated: false, reason: error }});
            }
            if(rows.length > 0) {
                connection.release();
                return res.json({ success: false, results: { isCreated: false, reason: "An active session already exists for this subject." }});
            }
            connection.query(`
            INSERT INTO attendance_sessions (subject_id, teacher_id, code, token, expires_at) 
                VALUES (?, ?, ?, ?, ?)
            `, [req.body.subject_id, req.user.id, code, token, expires_at],
            function(error2, result, fields) {
                connection.release();
                if(error2) return res.status(500).json({ success: false, results: { isCreated: false, reason: error2 }});
                return res.json({ success: true, results: { isCreated: true, session_id: result.insertId, token, code, expires_at }});
            });
        });
    });
});
app.post('/api/attendance', authenticateToken, (req, res) => {
    pool.getConnection(function(err, connection) {
        if(err) return res.status(500).json({ success: false, results: { isAttend: false, reason: err }});
        
        if(req.user.role !== "Student") {
            connection.release();
            return res.status(403).json({ success: false, results: { isAttend: false, reason: "Unauthorized" }});
        }
        const { token, code } = req.body;
        if(!token && !code) {
            connection.release();
            return res.status(400).json({ success: false, results: { isAttend: false, reason: "Token or code is required." }});
        }
        const student_id = req.user.id;
        connection.query(`
            SELECT id, subject_id, expires_at
            FROM attendance_session
            WHERE
                ${token ? `token = ?` : `code = ?`}
                AND status = 'ACTIVE'
            LIMIT 1
        `, [token || code], 
        function(error, rows, fields) {
            if(error) {
                connection.release();
                return res.status(500).json({ success: false, results: { isAttend: false, reason: error }});
            }
            if(rows.length === 0) {
                connection.release();
                return res.status(400).json({ success:false, results: { isAttend: false, reason: "No active session found for the provided token or code." }});
            }
            connection.query(`
                SELECT id FROM  attendances
                WHERE session_id = ? AND student_id = ?
            `, [rows[0].id, student_id],
            function(error3, result, fields) {
                if(error3) {
                    connection.release();
                    return res.status(500).json({ success: false, results: { isAttend: false, reason: error3 }});
                }
                if(result.length > 0) {
                    connection.release();
                    return res.json({ success: true, results: { isAttend: false, reason: "Already attended."}});
                }
                let status = new Date(rows[0].expires_at) < new Date() ? 'ABSENCE' : 
                            new Date(new Date(rows[0].expires_at) - 35 * 60 * 1000) < new Date() ? 'LATE' : 'PRESENT';
                connection.query(`
                   INSERT INTO attendances (session_id, student_id, status, checked_at)
                   VALUES (?, ?, ?, ?) 
                `, [rows[0].id, student_id, status, new Date()],
                function(error4, result2, fields) {
                    connection.release();
                    if(error4) return res.status(500).json({ success: false, results: { isAttend: false, reason: error4 }});
                    return res.json({ success: true, results: { isAttend: true }});
                });
            });
        });
    });
});

app.listen(port, () => { 
    console.log("Example Server is Listening at http://localhost:" + port); 
});