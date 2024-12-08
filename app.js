
require('dotenv').config();

const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const verifyToken = require('./middleware/verifyToken');

const pool = require('./util/database');



app.use(express.json());

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// First use the userRoutes
app.use('/api', userRoutes);


async function checkDbConnection() {
    try {
        const connection = await pool.getConnection();

        console.log('Database is connected!');

        connection.release();

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });

    } catch (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);  // Exit the process to avoid running the app without DB connection
    }
}

checkDbConnection();
