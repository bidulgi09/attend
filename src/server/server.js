const express = require("express"); 
const cors = require('cors'); 
const bodyParser = require("body-parser"); 
const cookieParser = require("cookie-parser");

const mysql = require("mysql2"); 
const dbconfig = require("../mysql_middleware/config/database.js"); 
const pool = mysql.createPool(dbconfig); 

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const salt = 12;

const REFRESH_TOKEN_EXPIRED_IN=(()=>new Date(Date.now() + 7*24*60*60*1000))();
const ACCESS_TOKEN_EXPIRED_IN=(()=>new Date(Date.now() + 3*60*60*1000))();

const checkDomainServer = require("./utils/checkDomainServer.js");
const authenticateToken = require("./utils/authenticateToken.js");

const app = express(); 
const port = 4000; 

app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cookieParser()); 

app.get('/api/userList', (req, res) => { 
    pool.getConnection(function(err, connection) { 
        if(err) throw err; 
        connection.query("SELECT * FROM users", function(error, results, fields) {
            connection.release(); 
            if(error) throw error;
            res.send(results); 
        }) 
    }) 
}); 

app.post('/api/checkEmail', (req, res) => { 
    pool.getConnection(function(err, connection) { 
        if(err) throw err; 
        let data = [ req.body.email ]; 
        connection.query('SELECT * FROM users WHERE email=?', data, async function(error, results, fields) { 
            connection.release(); 
            if(error) { 
                console.error(error); 
                res.status(500).json({ error: "데이터 검색 실패" }); 
                return; 
            } 
            if(results[0]) {
                res.send({ success: true, isAvailable: false, reason: 'already exists' }); 
            } else {
                let obj = { success: true, isAvailable: false, reason: null};
                if(!/^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(req.body.email) || !(await checkDomainServer(req.body.email.split('@')[1]).isValid)) {
                    obj.reason = 'invalid format';
                } else {
                    obj.isAvailable = true;
                }
                res.send({ success: true, result: obj}); 
            } 
        }); 
    }); 
}); 

app.post('/api/signUp', (req, res) => { 
    console.log(req.method);
    console.log(req.headers['content-type']);
    console.log(req.body + "hi")
    pool.getConnection(function(err, connection) { 
        if(err) throw err; 
        let password_hash = bcrypt.hashSync(req.body.password, salt);
        let datas = [ 
            req.body.username, 
            req.body.nickname || 'user', 
            req.body.email, 
            password_hash,
            req.body.role || 'USER' 
        ]; 
        connection.query('INSERT INTO users (username, nickname, email, password_hash, role) VALUES (?, ?, ?, ?, ?)', datas, function(error, results, fields) { 
            connection.release(); 
            if(error) { 
                console.error(error); 
                res.status(500).json({ error: "데이터 삽입 실패" }); 
                return; 
            } 
            res.json({ success: true, insertedId: results.insertId}); 
        }); 
    }); 
}); 

app.post('/api/logIn', (req, res) => {
    pool.getConnection(function(err, connection) {
        let data = [
            req.body.username
        ];

        connection.query('SELECT password_hash FROM users WHERE username = ?', data, function(error, results, fields) {
            if(error) {
                connection.release();
                console.log(error);
                res.status(500).json({ error : "데이터 조회 실패" });
                return;
            }
            if(results.length === 0) {
                connection.release();
                res.send({ success: false, result: { isLogIn: false, reason: "Account not found." } });
                return;
            } else {
                if(bcrypt.compareSync(req.body.password, results[0].password_hash)) {
                    let refresh_token=uuidv4();
                    let access_token=jwt.sign({ username: req.body.username }, "access_secret", { expiresIn: "3h" });
                    connection.query('UPDATE users SET refresh_token=?, expired_in=?, is_Active=? WHERE username=?', [refresh_token, REFRESH_TOKEN_EXPIRED_IN, true, req.body.username], function(error2, results2) {
                        connection.release();
                        if(error2) {
                            console.log(error2);
                            res.status(500).json({ error: "데이터 수정 실패" });
                            return;
                        }
                        res.cookie('refresh_token', refresh_token, {
                            expires: REFRESH_TOKEN_EXPIRED_IN,
                            httpOnly: true,
                            secure: false
                        });
                        
                        res.cookie('access_token', access_token, {
                            expires: ACCESS_TOKEN_EXPIRED_IN,
                            httpOnly: true,
                            secure: false
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

app.get('/api/profile', authenticateToken, (req, res) => {
    pool.getConnection(function(err, connection) {
        if(err) throw err;
        let data = [req.user.username];
        connection.query('SELECT * FROM users WHERE username=?', data, function(error, results, fields) {
            connection.release();
            if(error) {
                res.status(500).json({ error: "데이터 조회 실패" });
            }
            res.send({ success: true, result: results[0] });
            return;
        });
    });
});

app.post('/api/refresh', (req, res) => {
    pool.getConnection(function(err, connection) {
        if(err) throw err;
        if(!req.cookies.refresh_token) {
            return res.status(401).json({ error: "Refresh token required."});
        }
        let data = [req.cookies.refresh_token];
        connection.query('SELECT username, refresh_token, expired_in FROM users WHERE refresh_token=?', data, function(error, results, fields) {
            let user = results[0];
            if(error) {
                connection.release();
                res.status(500).json({ error: "데이터 조회 실패"});
            }
            if(!user) {
                connection.release();
                res.status(401).json({ success: false, results: {}, reason: "Not exists."});
                return;
            }
            if(user.refresh_token !== req.cookies.refresh_token || user.expired_in < new Date(Date.now())) {
                connection.release();
                res.status(403).json({ success: false, results: {}, reason: "Invalid refresh token" });
            }

            let new_refresh_token = uuidv4();
            let new_access_token = jwt.sign({ username: user.username }, "access_secret", { expiresIn: '3h' });
            res.cookie('refresh_token', new_refresh_token, {
                expires: REFRESH_TOKEN_EXPIRED_IN,
                httpOnly: true,
                secure: false
            });
            
            res.cookie('access_token', new_access_token, {
                expires: ACCESS_TOKEN_EXPIRED_IN,
                httpOnly: true,
                secure: false
            }); 

            res.send({ success: true, result: user });
            return;
        });
    });
});

app.patch('/api/password', (req, res) => {
    pool.getConnection(function(err, connection) {
        let data = [
            req.body.username
        ];

        connection.query('SELECT password_hash FROM users WHERE username = ?', data, function(error, results, fields) {
            if(error) {
                connection.release();
                console.log(error);
                res.status(500).json({ error : "데이터 조회 실패" });
                return;
            }
            if(results.length === 0) {
                connection.release();
                res.send({ success: false, result: { isLogIn: false, reason: "Account not found." } });
                return;
            } else {
                if(bcrypt.compareSync(req.body.password, results[0].password_hash)) {
                    if(!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{16,}$/.test(req.new_password)) {
                        connection.release();
                        res.status(401).json({ success: false, results: { isChanged: false, reason: "Invalid format" } });
                        return;
                    }
                    let refresh_token=uuidv4();
                    let access_token=jwt.sign({ username: req.body.username }, "access_secret", { expiresIn: "3h" });
                    let new_password_hash=bcrypt.hashSync(req.body.new_password, salt);
                    connection.query('UPDATE users SET password=? WHERE username=?', [new_password_hash, req.body.username], function(error2, results2) {
                        connection.release();
                        if(error2) {
                            console.log(error2);
                            res.status(500).json({ error: "데이터 수정 실패" });
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

app.listen(port, () => { 
    console.log("Example Server is Listening at http://localhost:" + port); 
});