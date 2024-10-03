/* eslint-disable linebreak-style */
const router = require('express').Router()
const routeInterceptor = require('../../modules/common/interceptors/route-interceptor');
const stagesChartController = require("../../modules/charts/controllers/stage");
const handleStandard = require("../../modules/common/util/handle-standard");

const validations = require('./validations/charts');

router.all('/*', routeInterceptor.verifyToken);
router.all('/*', routeInterceptor.verifySessionValidity);

router.get('/stages/summary', validations.getStagesSummary, (req, res, next) => {
  stagesChartController.getSummary(req, (err, summary) => {
    handleStandard(req, res, err, summary, next);
  })
});

router.get('/stages/amounts', validations.getStagesAmounts, (req, res, next) => {
  stagesChartController.getAmount(req, (err, amounts) => {
    handleStandard(req, res, err, amounts, next);
  })
});

router.get('/stages/amountspodcast', validations.getStagesAmounts, (req, res, next) => {
  stagesChartController.getAmountpodcast(req, (err, amounts) => {
    handleStandard(req, res, err, amounts, next);
  })
});
router.get('/stages/amountsspeaker', validations.getStagesAmounts, (req, res, next) => {
  stagesChartController.getAmountspeaker(req, (err, amounts) => {
    handleStandard(req, res, err, amounts, next);
  })
});

router.get('/stages/amountsmedia', validations.getStagesAmounts, (req, res, next) => {
  stagesChartController.getAmountmedia(req, (err, amounts) => {
    handleStandard(req, res, err, amounts, next);
  })
});

router.get('/stages/amountsconference', validations.getStagesAmounts, (req, res, next) => {
  stagesChartController.getAmountconference(req, (err, amounts) => {
    handleStandard(req, res, err, amounts, next);
  })
});

router.get('/stages/amountsassociation', validations.getStagesAmounts, (req, res, next) => {
  stagesChartController.getAmountassociation(req, (err, amounts) => {
    handleStandard(req, res, err, amounts, next);
  })
});

router.get('/stages/amountsbookedpodcast', validations.getStagesAmounts, (req, res, next) => {
  stagesChartController.getAmountbookedpodcast(req, (err, amounts) => {
    handleStandard(req, res, err, amounts, next);
  })
});

router.get('/stages/amountsbookedspeaker', validations.getStagesAmounts, (req, res, next) => {
  stagesChartController.getAmountbookedspeaker(req, (err, amounts) => {
    handleStandard(req, res, err, amounts, next);
  })
});

router.get('/stages/amountsbookedmedia', validations.getStagesAmounts, (req, res, next) => {
  stagesChartController.getAmountbookedmedia(req, (err, amounts) => {
    handleStandard(req, res, err, amounts, next);
  })
});

router.get('/stages/amountsbookedconference', validations.getStagesAmounts, (req, res, next) => {
  stagesChartController.getAmountbookedconference(req, (err, amounts) => {
    handleStandard(req, res, err, amounts, next);
  })
});

router.get('/stages/amountsbookedassociation', validations.getStagesAmounts, (req, res, next) => {
  stagesChartController.getAmountbookedassociation(req, (err, amounts) => {
    handleStandard(req, res, err, amounts, next);
  })
});
module.exports = router;