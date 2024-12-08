const express = require('express');
const router = express.Router();
const hostMeetingController = require('../controllers/hostMeetingContoller');


router.post('/hostmeetings', hostMeetingController.createHostMeeting);


router.get('/hostmeetings/host/:hostId', hostMeetingController.getHostMeetingsByHostId);


router.get('/hostmeetings/:meetingId', hostMeetingController.getHostMeetingById);

router.put('/hostmeetings/:meetingId', hostMeetingController.updateHostMeeting);

router.delete('/hostmeetings/:meetingId', hostMeetingController.deleteHostMeeting);

module.exports = router;
