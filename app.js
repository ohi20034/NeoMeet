require('dotenv').config();

const express = require('express');
const app = express();

const pool = require('./util/database');

app.use(express.json());


async function checkDbConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database is connected!');

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
        connection.release(); // Always release the connection after use
    } catch (err) {
        throw new Error('Error connecting to the database: ' + err.message);
    }
}

checkDbConnection();