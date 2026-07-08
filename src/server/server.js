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
        "https://organic-engine-x5j4gjxjq7xxfv44w-5173.app.github.dev",
        "https://refactored-potato-4j66rr45x7753gvx-5173.app.github.dev",
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
        connection.query("SELECT id, name, email, role, avatar FROM students UNION ALL SELECT id, name, email, role, avatar FROM teachers;", function(error, results, fields) {
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
        ]; 
        connection.query(`INSERT INTO ${table} (id, name, email, password_hash) VALUES (?, ?, ?, ?);`, datas, function(error, results, fields) { 
            connection.release(); 
            if(error) {
                console.log(error);
                res.status(500).json({ success: false, results: { insertedId: -1, reason: "Fail to search" } });
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
        connection.query(`SELECT id, email, name, role, avatar FROM ${table} WHERE id=?;`, data, function(error, results, fields) {
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
        connection.query("INSERT INTO subject_teachers (subject_id, teacher_id, days) VALUE (?, ?, ?)", [req.body.subject.id, req.body.teacher.id, JSON.stringify(req.body.subject.days)], function(error, result, fields) {
            connection.release();
            if(error) return res.json({ success: false, results: { isConnected: false, reason: error }});
            return res.json({ success: true, results: { isConnected: true, insertId: res.insertId }});
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
                a.teacher_id AS teacher_id, a.days AS subject_days, 
                COALESCE(
                    (
                        SELECT b.student_id FROM subject_students AS b WHERE b.subject_teacher_id = a.teacher_id
                    ),
                    JSON_ARRAY()
                ) AS students
            FROM subject_teachers AS a 
            INNER JOIN subjects AS c 
                ON a.subject_id = c.id 
            GROUP BY a.subject_id, c.name, a.teacher_id, a.days`, function(error, result, fields) {
                connection.release();
                if(error) return res.json({ success: false, results: { isLoaded: false, reason: error }});
                result.forEach(v => {
                    return v.students = JSON.parse(v.students);
                });
                return res.json({ success: true, results: { isLoaded: true, list: result }}); 
            })
    })
})
app.listen(port, () => { 
    console.log("Example Server is Listening at http://localhost:" + port); 
});