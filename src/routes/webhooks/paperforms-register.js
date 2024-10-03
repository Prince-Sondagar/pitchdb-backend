const router = require('express').Router();
const userController = require('../../modules/users/controllers/user');
const handleStandard = require("../../modules/common/util/handle-standard");

router.post('/', (req, res, next) => {
   userController.createFromWebHook(req.body, req.query, false, (err) => {
        handleStandard(req,res, err, null, next);
   })
});

router.post('/v2', (req, res, next) => {
   userController.createFromWebHook(req.body, req.query, true, (err) => {
        handleStandard(req,res, err, null, next);
   })
});

module.exports = router;