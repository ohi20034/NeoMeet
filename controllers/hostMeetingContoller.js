const HostMeetings = require('../models/HostMeetings');

exports.createHostMeeting = async (req, res) => {
    const { host_id, meeting_date, time_slots, recurring } = req.body;

    try {
        const result = await HostMeetings.create({ host_id, meeting_date, time_slots, recurring });
        res.status(201).json({
            message: 'Host meeting created successfully!',
            meetingId: result.insertId
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getHostMeetingsByHostId = async (req, res) => {
    const { hostId } = req.params;

    try {
        const meetings = await HostMeetings.getAllByHostId(hostId);
        if (meetings.length === 0) {
            return res.status(404).json({ message: 'No meetings found for this host.' });
        }

        res.status(200).json(meetings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getHostMeetingById = async (req, res) => {
    const { meetingId } = req.params;

    try {
        const meeting = await HostMeetings.getById(meetingId);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }

        res.status(200).json(meeting);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateHostMeeting = async (req, res) => {
    const { meetingId } = req.params;
    const { meeting_date, time_slots, recurring } = req.body;

    try {
        // Check if meeting exists
        const meeting = await HostMeetings.getById(meetingId);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }

        // Update the meeting
        const result = await HostMeetings.update(meetingId, { meeting_date, time_slots, recurring });

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Failed to update meeting.' });
        }

        res.status(200).json({
            message: 'Meeting updated successfully!',
            updatedMeetingId: meetingId
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteHostMeeting = async (req, res) => {
    const { meetingId } = req.params;

    try {
        const meeting = await HostMeetings.getById(meetingId);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found.' });
        }

        const result = await HostMeetings.delete(meetingId);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Failed to delete meeting.' });
        }

        res.status(200).json({
            message: 'Meeting deleted successfully!',
            deletedMeetingId: meetingId
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};