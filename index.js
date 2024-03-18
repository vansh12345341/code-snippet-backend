const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 4000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MySQL connection
const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'codesnippet.cboi0eu0oare.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'vansh1234',
    database: 'code_snippet' 
});

pool.getConnection((err, connection) => {
    if(err) throw err; 
    console.log('Connected as ID ' + connection.threadId);
    connection.release();
});

app.post('/submit', (req, res) => {
    const data = req.body; 
    const id = uuidv4();
    const query = "INSERT INTO data (id, username, code_language, stdin, source_code, submission_timestamp) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
    
    pool.query(query, [id, data.username, data.code_language, data.stdin, data.source_code], (error, results) => {
        if (error) {
            res.status(500).send('An error occurred');
            throw error;
        }
        res.send('Submission successful');
    });
});
app.get('/submissions', (req, res) => {
    const query = "SELECT id, username, code_language, stdin, submission_timestamp, source_code AS source_code_preview FROM data";
    
    pool.query(query, (error, results) => {
        if (error) {
            res.status(500).send('An error occurred');
            throw error;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});