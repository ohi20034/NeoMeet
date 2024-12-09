const pool = require('../util/database');
const User = require('../models/User');
const HostMeetings = require('../models/GuestRegistrationsMeeting')

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

exports.searchNearestMeeting = async (req, res) => {
  const { date, time, host_name } = req.query;

  try {

    await User.checkTableExists();
    await HostMeetings.checkTableExists();

  
    const [users] = await pool.execute(
      'SELECT * FROM Users WHERE name LIKE ?', 
      [`%${host_name}%`]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Host not found' });
    }

    const hostIds = users.map(user => user.user_id);
    const hostIdsString = hostIds.join(',');

 
    const [meetings] = await pool.execute(
      `
      SELECT hm.*, u.name AS host_name
      FROM HostMeetings hm
      JOIN Users u ON hm.host_id = u.user_id
      WHERE hm.meeting_date = ?
      AND EXISTS (
        SELECT 1
        FROM JSON_TABLE(
          hm.time_slots, '$[*]'
          COLUMNS (
            start_time TIME PATH '$.start_time'
          )
        ) jt
        WHERE jt.start_time = ?
      )
      AND hm.host_id IN (${hostIdsString})
      `,
      [date, time]
    );

    if (meetings.length === 0) {
      return res.status(404).json({ message: 'No meetings found for the given criteria' });
    }

    res.status(200).json({ meetings });
  } catch (err) {
    res.status(500).json({ message: 'Error searching nearest meeting', error: err.message });
  }
};
