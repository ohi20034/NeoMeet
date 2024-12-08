const User = require('../models/User');

exports.createUser = async (req, res) => {
    const { name, email, password_hash, role, timezone, organization_name } = req.body;

    try {
        const result = await User.create({
            name,
            email,
            password_hash,
            role,
            timezone,
            organization_name
        });

        res.status(201).json({
            message: 'User created successfully!',
            userId: result.insertId
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.getByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.getById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const { token, user } = await User.login(email, password);
      return res.status(200).json({
        message: 'Login successful',
        token: token,
        user: {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          timezone: user.timezone,
          organizationName: user.organization_name,
        }
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message || 'Login failed. Please check your credentials.',
      });
    }
  };
