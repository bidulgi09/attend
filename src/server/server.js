const express = require("express"); 
const cors = require('cors'); 
const bodyParser = require("body-parser"); 

const mysql = require("mysql2"); 
const dbconfig = require("../mysql_middleware/config/database.js"); 
const pool = mysql.createPool(dbconfig); 

const salt = 12;

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

app.post('/api/check', (req, res) => { 
    pool.getConnection(function(err, connection) { 
        if(err) throw err; 
        let data = [ req.body.email, req.body.username ]; 
        connection.query('SELECT email, username FROM users WHERE email=? OR username=?', data, async function(error, results, fields) { 
            connection.release(); 
            console.log(results);
            if(error) { 
                console.error(error); 
                res.status(500).json({ error: "데이터 검색 실패" }); 
                return; 
            } 

            let regex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            let domain = await checkDomainServer(req.body.email.split('@')[1]);
            console.log(regex.test(req.body.email));
            console.log(domain.isValid);
            console.log(results);
            if(!regex.test(req.body.email) || !domain.isValid || results.length > 0) {
                res.send({ success: true, isAvailable: false });
            } else {
                res.send({ success: true, isAvailable: true });
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
            res.json({ success: true, insertedId: results.insertedId}); 
        }); 
    }); 
}); 

app.listen(port, () => { 
    console.log("Example Server is Listening at https://localhost:" + port); 
});