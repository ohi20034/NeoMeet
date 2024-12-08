const pool = require('../util/database');

class GuestRegistration {
  static async checkTableExists() {
    try {
      const [rows] = await pool.execute("SHOW TABLES LIKE 'GuestRegistrations'");
      if (rows.length === 0) {
        await pool.execute(`
          CREATE TABLE GuestRegistrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            meeting_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);
        console.log('GuestRegistrations table created.');
      } else {
        console.log('GuestRegistrations table already exists.');
      }
    } catch (err) {
      throw new Error('Error checking or creating table: ' + err.message);
    }
  }

  static async create(registrationData) {
    try {
      await GuestRegistration.checkTableExists();
      const [result] = await pool.execute(
        'INSERT INTO GuestRegistrations (meeting_id, name, phone, email, message) VALUES (?, ?, ?, ?, ?)',
        [
          registrationData.meeting_id,
          registrationData.name,
          registrationData.phone,
          registrationData.email,
          registrationData.message,
        ]
      );
      return result;
    } catch (err) {
      throw new Error('Error creating guest registration: ' + err.message);
    }
  }

  static async getByMeetingId(meeting_id) {
    try {
      await GuestRegistration.checkTableExists();
      const [rows] = await pool.execute(
        'SELECT * FROM GuestRegistrations WHERE meeting_id = ?',
        [meeting_id]
      );
      return rows;
    } catch (err) {
      throw new Error('Error fetching registrations: ' + err.message);
    }
  }

  static async deleteById(id) {
    try {
      await GuestRegistration.checkTableExists();
      const [result] = await pool.execute('DELETE FROM GuestRegistrations WHERE id = ?', [id]);
      return result;
    } catch (err) {
      throw new Error('Error deleting registration: ' + err.message);
    }
  }
}

module.exports = GuestRegistration;
