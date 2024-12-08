const pool = require('../util/database');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password comparison
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for creating the token

class User {
  // Check if the Users table exists
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
            role ENUM('Host', 'Guest') NOT NULL,
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

  // Create a new user in the database
  static async create(userData) {
    try {
      await User.checkTableExists();
      const hashedPassword = await bcrypt.hash(userData.password_hash, 12); // Hash password
      const [result] = await pool.execute(
        'INSERT INTO Users (name, email, password_hash, role, timezone, organization_name) VALUES (?, ?, ?, ?, ?, ?)',
        [
          userData.name,
          userData.email,
          hashedPassword,
          userData.role,
          userData.timezone,
          userData.organization_name,
        ]
      );
      return result;
    } catch (err) {
      throw new Error('Error creating user: ' + err.message);
    }
  }

  // Get a user by email
  static async getByEmail(email) {
    try {
      await User.checkTableExists();
      const [rows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
      return rows[0]; // Return the first user
    } catch (err) {
      throw new Error('Error fetching user: ' + err.message);
    }
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword); // Compare the password with hashed one
  }

  // Add login method
  static async login(email, password) {
    try {
      await User.checkTableExists();
      const user = await User.getByEmail(email); // Get user by email

      if (!user) {
        throw new Error('Invalid email or password.');
      }

      // Compare provided password with stored hash
      const isPasswordValid = await User.comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password.');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '10d' } // Token expiration time set to 10 days
    );
    

      return { token, user };
    } catch (err) {
      throw new Error('Error logging in: ' + err.message);
    }
  }

}

module.exports = User;
