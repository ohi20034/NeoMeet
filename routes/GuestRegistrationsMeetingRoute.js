const express = require('express');
const router = express.Router();
const guestRegistrationController = require('../controllers/GuestRegistrationsMeetingContoller');


router.post('/guestregistrations', guestRegistrationController.createGuestRegistration);


router.get('/guestregistrations/meeting/:meetingId', guestRegistrationController.getRegistrationsByMeetingId);

router.get('/getAllMeeting/:hostId', guestRegistrationController.getAllMeeting);
router.delete('/guestregistrations/:registrationId', guestRegistrationController.deleteGuestRegistration);

module.exports = router;