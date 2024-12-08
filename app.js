
require('dotenv').config();

const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute');
const hostMeetingRoutes = require('./routes/hostMeetingRoute');
const guestMeetingRoutes = require('./routes/GuestRegistrationsMeetingRoute')
const verifyToken = require('./middleware/verifyToken');

const pool = require('./util/database');



app.use(express.json());

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});


app.use('/api', userRoutes);
app.use('/api', hostMeetingRoutes);
app.use('/api',guestMeetingRoutes);

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
        process.exit(1);  
    }
}

checkDbConnection();
