const GuestRegistration = require('../models/GuestRegistrationsMeeting');

exports.createGuestRegistration = async (req, res) => {
  const { meeting_id, name, phone, email, message } = req.body;

  try {
    const result = await GuestRegistration.create({
      meeting_id,
      name,
      phone,
      email,
      message,
    });

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
