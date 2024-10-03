/* eslint-disable linebreak-style */
const router = require('express').Router();
const profileController = require('../../modules/profile/controllers/profile-data');
const routeInterceptor = require('../../modules/common/interceptors/route-interceptor');
const handleStandard = require("../../modules/common/util/handle-standard");
const { SPEAKER_SEARCH } = require('../../modules/common/constants/users/permissions')

router.all('/*', routeInterceptor.verifyToken);
router.all('/*', routeInterceptor.verifySessionValidity);
router.all('/*', routeInterceptor.verifyPrivileges({ requiredPrivileges: [SPEAKER_SEARCH] }));


router.get("/primary", (req, res, next) => {
  profileController.getActiveEmailAccount(req.decoded.userId, (err, url) => {
    handleStandard(req, res, err, url, next);
  })
});

router.post('/addprofiledata', (req, res, next) => {
  profileController.addProfiledata(req, (err, data) => {
    handleStandard(req, res, err, data, next);
  })
});

///////////// csv start

router.post('/local-profile', (req, res, next) => {
  profileController.addSpeakersData(req, (err, result) => {
    handleStandard(req, res, err, result, next);
  })
})

router.get('/profile-fields', (req, res, next) => {
  profileController.getspeakerdatafields((err, plans) => {
    handleStandard(req, res, err, plans, next);
  })
})

////////// end
router.get('/:id/getprofiledata', (req, res, next) => {
  profileController.getProfiledata(req, (err, data) => {
    handleStandard(req, res, err, data, next);
  })
});
router.get('/:id/getspeakerdata', (req, res, next) => {
  profileController.getSpeakerById(req, (err, data) => {
    handleStandard(req, res, err, data, next);
  })
});


router.get('/:id/getprofilesearchdata', (req, res, next) => {
  profileController.getProfilesearchdata(req, (err, data) => {
    handleStandard(req, res, err, data, next);
  })
});

router.get('/getallexpertsdata', (req, res, next) => {
  profileController.getAllExperts(req, (err, data) => {
    handleStandard(req, res, err, data, next);
  })
});

router.get('/:id/getemailsignature', (req, res, next) => {
  emailAccountController.getemailsignature(req, (err, data) => {
    handleStandard(req, res, err, data, next);
  })
})

router.put('/:id/updateemailsignature', (req, res, next) => {
  emailAccountController.updateEmailsignature(req, (err, report) => {
    handleStandard(req, res, err, report, next);
  })
})


module.exports = router;