const pool = require('../util/database');

class HostMeetings {
    static async checkTableExists() {
        try {
            const [rows] = await pool.execute("SHOW TABLES LIKE 'HostMeetings'");
            if (rows.length === 0) {
                await pool.execute(`
          CREATE TABLE HostMeetings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            host_id INT,                      
            meeting_date DATE,                 
            time_slots TEXT,
            recurring BOOLEAN DEFAULT FALSE,                   
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (host_id) REFERENCES Users(user_id) ON DELETE CASCADE
          )
        `);
                console.log("HostMeetings table created.");
            } else {
                console.log("HostMeetings table already exists.");
            }
        } catch (err) {
            throw new Error("Error checking or creating table: " + err.message);
        }
    }

    static async create(meetingData) {
        try {
            await HostMeetings.checkTableExists();
            const { host_id, meeting_date, time_slots } = meetingData;
            const timeSlotsString = JSON.stringify(time_slots); // Convert time slots to a JSON string

            const [result] = await pool.execute(
                'INSERT INTO HostMeetings (host_id, meeting_date, time_slots) VALUES (?, ?, ?)',
                [host_id, meeting_date, timeSlotsString]
            );
            return result;
        } catch (err) {
            throw new Error('Error creating host meeting: ' + err.message);
        }
    }

    static async getAllByHostId(host_id) {
        try {
            const [rows] = await pool.execute('SELECT * FROM HostMeetings WHERE host_id = ?', [host_id]);
            return rows;
        } catch (err) {
            throw new Error('Error fetching host meetings: ' + err.message);
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.execute('SELECT * FROM HostMeetings WHERE id = ?', [id]);
            return rows[0];
        } catch (err) {
            throw new Error('Error fetching host meeting: ' + err.message);
        }
    }

    static async update(id, meetingData) {
        try {
            const { meeting_date, time_slots } = meetingData;
            const timeSlotsString = JSON.stringify(time_slots); // Convert time slots to a JSON string

            const [result] = await pool.execute(
                `UPDATE HostMeetings 
         SET meeting_date = ?, time_slots = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
                [meeting_date, timeSlotsString, id]
            );

            return result;
        } catch (err) {
            throw new Error('Error updating host meeting: ' + err.message);
        }
    }

    static async delete(id) {
        try {
            const [result] = await pool.execute('DELETE FROM HostMeetings WHERE id = ?', [id]);
            return result;
        } catch (err) {
            throw new Error('Error deleting host meeting: ' + err.message);
        }
    }

}

module.exports = HostMeetings;
