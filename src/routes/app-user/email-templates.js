/* eslint-disable linebreak-style */
const router = require('express').Router();
const emailTemplatecontroller = require('../../modules/emialtemplate/controllers/email-template');
const routeInterceptor = require('../../modules/common/interceptors/route-interceptor');
const handleStandard = require("../../modules/common/util/handle-standard");

router.all('/*', routeInterceptor.verifyToken);
router.all('/*', routeInterceptor.verifySessionValidity);

router.get("/", (req, res, next) => {
  emailTemplatecontroller.getAll(req.decoded.userId, (err, sequences) => {
    handleStandard(req, res, err, sequences, next);
  })
});

router.get('/:id', (req, res, next) => {
  emailTemplatecontroller.getOutreachDetail(req, (err, sequence) => {
    handleStandard(req, res, err, sequence, next);
  })
})

router.delete('/:id', (req, res, next) => {
  emailTemplatecontroller.deleteOutreachSequence(req.params.id, req.decoded.userId, (err) => {
    handleStandard(req, res, err, null, next);
  })
})

router.get('/:id/email-validity', (req, res, next) => {
  emailTemplatecontroller.getEmailReport(req, (err, report) => {
    handleStandard(req, res, err, report, next);
  })
})

router.put('/:id/email-validity', (req, res, next) => {
  emailTemplatecontroller.createEmailReport(req, (err, report) => {
    handleStandard(req, res, err, report, next);
  })
})

router.put('/:id/add-template', (req, res, next) => {
  emailTemplatecontroller.addEmailtemplate(req, (err, report) => {
    handleStandard(req, res, err, report, next);
  })
})

router.put('/:id/edit-template/:idNote', (req, res, next) => {
  emailTemplatecontroller.editEmailtemplate(req, (err, report) => {
    handleStandard(req, res, err, report, next);
  })
})

router.delete('/:id/remove-template/:idNote', (req, res, next) => {
  emailTemplatecontroller.removeEmailtemplate(req, (err, report) => {
    handleStandard(req, res, err, report, next);
  })
})

router.post('/sendemail', (req, res, next) => {
  emailTemplatecontroller.senEmail(req, (err, report) => {
    handleStandard(req, res, err, report, next);
  })
})
module.exports = router;