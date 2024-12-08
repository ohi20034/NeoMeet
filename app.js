require('dotenv').config();

const express = require('express');
const app = express();

const pool = require('./util/database');

app.get('/', (req, res) => {
    res.send("hello world");
})


async function checkDbConnection() {
    console.log('hi');
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
        } else {
            console.log('Database is connected!');
            app.listen(process.env.PORT || 3000, () => {
                console.log(`Server running on port ${process.env.PORT || 3000}`);
            });

        }
    });
}

checkDbConnection();