const pool = require('../util/database');

exports.createGuestRegistration = async (req, res) => {
    const { meeting_id, name, phone, email, message, started_time, ended_time } = req.body;
  
    try {
      const [rows] = await db.query(
        `
        SELECT * 
        FROM hostmeetings
        WHERE meeting_id = ?  
          AND book_id = 0
          AND (start_time < ? AND end_time > ?)
        `,
        [meeting_id, ended_time, started_time]
      );
  
      if (rows.length > 0) {
        return res.status(400).json({ message: 'The selected time slot is already booked.' });
      }

      const [result] = await db.query(
        `
        INSERT INTO guestregistrations (meeting_id, name, phone, email, message)
        VALUES (?, ?, ?, ?, ?)
        `,
        [meeting_id, name, phone, email, message]
      );
  
      res.status(201).json({
        message: 'Guest registration created successfully!',
        registrationId: result.insertId,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.getRegistrationsByMeetingId = async (req, res) => {
  const { meetingId } = req.params;

  try {
    const registrations = await GuestRegistration.getByMeetingId(meetingId);

    if (!registrations.length) {
      return res.status(404).json({ message: 'No registrations found for this meeting.' });
    }

    res.status(200).json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllMeeting = async (req, res) => {
  const { hostId } = req.params;

  console.log('Received hostId:', hostId); 

  if (!hostId) {
      return res.status(400).json({ message: 'hostId is required' });
  }

  try {
      const [rows] = await pool.execute(`SELECT * FROM hostmeetings WHERE host_id = ?`, [hostId]);
      if (rows.length === 0) {
          return res.status(404).json({ message: 'No meetings found for this host.' });
      } 
      res.status(200).json(rows);
  } catch (error) {
      console.error('Error fetching host meetings:', error); 
      res.status(500).json({ message: 'Error fetching host meetings', error: error.message });
  }
};


exports.deleteGuestRegistration = async (req, res) => {
  const { registrationId } = req.params;

  try {
    const result = await GuestRegistration.deleteById(registrationId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Guest registration not found.' });
    }

    res.status(200).json({ message: 'Guest registration deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
