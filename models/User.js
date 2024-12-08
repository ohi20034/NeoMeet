const pool = require('../util/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

class User {

  static async checkTableExists() {
    try {
      const [rows] = await pool.execute("SHOW TABLES LIKE 'Users'");
      if (rows.length === 0) {
        await pool.execute(`
          CREATE TABLE Users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            timezone VARCHAR(50) NOT NULL,
            organization_name VARCHAR(255) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log("Users table created.");
      } else {
        console.log("Users table already exists.");
      }
    } catch (err) {
      throw new Error("Error checking or creating table: " + err.message);
    }
  }

  static async create(userData) {
    try {
      await User.checkTableExists();
      const hashedPassword = await bcrypt.hash(userData.password_hash, 12); 
      const [result] = await pool.execute(
        'INSERT INTO Users (name, email, password_hash, timezone, organization_name) VALUES (?,  ?, ?, ?, ?)',
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.timezone,
          userData.organization_name,
        ]
      );
      return result;
    } catch (err) {
      throw new Error('Error creating user: ' + err.message);
    }
  }


  static async getByEmail(email) {
    try {
      await User.checkTableExists();
      const [rows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
      return rows[0]; 
    } catch (err) {
      throw new Error('Error fetching user: ' + err.message);
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword); 
  }

  static async login(email, password) {
    try {
      await User.checkTableExists();
      const user = await User.getByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password.');
      }

      const isPasswordValid = await User.comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password.');
      }

      const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '10d' } 
    );
    

      return { token, user };
    } catch (err) {
      throw new Error('Error logging in: ' + err.message);
    }
  }

}

module.exports = User;
