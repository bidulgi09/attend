const express = require("express"); 
const cors = require('cors'); 
const bodyParser = require("body-parser"); 

const mysql = require("mysql"); 
const dbconfig = require("../mysql_middleware/config/database.js"); 
const pool = mysql.createPool(dbconfig); 

const jwt = require("jsonwebtoken");

const checkDomainServer = require("./utils/checkDomainServer.js");

const app = express(); 
const port = 4000; 

app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

app.get('/api/userList', (req, res) => { 
    pool.getConnection(function(err, connection) { 
        if(err) throw err; 
        connection.query("SELECT * FROM users", function(error, results, fields) { 
            res.send(results); 
            connection.release(); 
            if(error) throw error; 
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
        let password_hash = jwt.sign({ password: req.body.password }, "kimmeoldaeTV");
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
            res.json({ success: true, insertedId: results.insertedId}); 
        }); 
    }); 
}); 

app.listen(port, () => { 
    console.log("Example Server is Listening at https://localhost:" + port); 
});