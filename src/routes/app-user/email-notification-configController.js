const router = require("express").Router();
const handleStandard = require("../../modules/common/util/handle-standard");
const EmailNotificationConfigrationcontroller = require("../../modules/profile/controllers/email-notificationConfig");

router.post("/addemailconfigration", (req, res, next) => {
  EmailNotificationConfigrationcontroller.addEmailnotificationConfig(
    req,
    (err, data) => {
      handleStandard(req, res, err, data, next);
    }
  );
});

router.get("/:id/getemailconfigration", (req, res, next) => {
  EmailNotificationConfigrationcontroller.getEmailnotificationConfig(
    req,
    (err, data) => {
      handleStandard(req, res, err, data, next);
    }
  );
});

module.exports = router;
