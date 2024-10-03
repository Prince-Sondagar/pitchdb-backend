/* eslint-disable linebreak-style */
const router = require('express').Router()
const routeInterceptor = require('../../modules/common/interceptors/route-interceptor');
const handleStandard = require("../../modules/common/util/handle-standard");
const eventSearchController = require("../../modules/search/controllers/event-search");
const mediaOutletSearchController = require("../../modules/search/controllers/media-outlet-search");
const conferenceSearchController = require("../../modules/search/controllers/conference-search");
const businessSearchController = require("../../modules/search/controllers/business-search");
const parametersController = require("../../modules/search/controllers/parameter-search");

const {
    BUSINESS_SEARCH,
    CONFERENCE_SEARCH,
    EVENT_SEARCH,
    MEDIA_SEARCH
} = require('../../modules/common/constants/users/permissions')

router.all('/*', routeInterceptor.verifyToken);
router.all('/*', routeInterceptor.verifySessionValidity);

//Business Search//

router.get('/businesses/local', routeInterceptor.verifyPrivileges({ requiredPrivileges: [BUSINESS_SEARCH] }), (req, res, next) => {
    businessSearchController.getBusinessSearchResults(req, "local", (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/businesses/national', routeInterceptor.verifyPrivileges({ requiredPrivileges: [BUSINESS_SEARCH] }), (req, res, next) => {
    businessSearchController.getBusinessSearchResults(req, "national", (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/businesses/descriptions', routeInterceptor.verifyPrivileges({ requiredPrivileges: [BUSINESS_SEARCH] }), (req, res, next) => {
    businessSearchController.getBusinessSearchResults(req, "descriptions", (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/businesses/local/:id', routeInterceptor.verifyPrivileges({ requiredPrivileges: [BUSINESS_SEARCH] }), (req, res, next) => {
    businessSearchController.getLocalBusinessById(req.params.id, (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

//Conference Search//

router.get('/conferences/', routeInterceptor.verifyPrivileges({ requiredPrivileges: [CONFERENCE_SEARCH] }), (req, res, next) => {
    conferenceSearchController.getConferenceSearchResults(req, (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/conferences/total', routeInterceptor.verifyPrivileges({ requiredPrivileges: [CONFERENCE_SEARCH] }), (req, res, next) => {
    conferenceSearchController.getConferenceSearchTotalResults(req, (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/conferences/categories', routeInterceptor.verifyPrivileges({ requiredPrivileges: [CONFERENCE_SEARCH] }), (req, res, next) => {
    conferenceSearchController.getConferenceParameters("categories", (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/conferences/maxAudience', routeInterceptor.verifyPrivileges({ requiredPrivileges: [CONFERENCE_SEARCH] }), (req, res, next) => {
    conferenceSearchController.getConferenceParameters("maxAudience", (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

//Event Organization Search//

router.get('/event-organizations', routeInterceptor.verifyPrivileges({ requiredPrivileges: [EVENT_SEARCH] }), (req, res, next) => {
    eventSearchController.getEventSearchResults(req, (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/event-organizations/total', routeInterceptor.verifyPrivileges({ requiredPrivileges: [EVENT_SEARCH] }), (req, res, next) => {
    eventSearchController.getEventSearchTotalResults(req, (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/event-organizations/:id', routeInterceptor.verifyPrivileges({ requiredPrivileges: [EVENT_SEARCH] }), (req, res, next) => {
    eventSearchController.getEventById(req.params.id, (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

//Media Search//

router.get('/media/', routeInterceptor.verifyPrivileges({ requiredPrivileges: [MEDIA_SEARCH] }), (req, res, next) => {
    mediaOutletSearchController.getMediaSearchResults(req, (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/media/total', routeInterceptor.verifyPrivileges({ requiredPrivileges: [MEDIA_SEARCH] }), (req, res, next) => {
    mediaOutletSearchController.getMediaSearchTotalResults(req, (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/media/positions', routeInterceptor.verifyPrivileges({ requiredPrivileges: [MEDIA_SEARCH] }), (req, res, next) => {
    mediaOutletSearchController.getMediaParameters(req, "positions", (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/media/genres', routeInterceptor.verifyPrivileges({ requiredPrivileges: [MEDIA_SEARCH] }), (req, res, next) => {
    mediaOutletSearchController.getMediaParameters(req, "genres", (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

//Parameter Search//

router.get('/parameters/job-titles', (req, res, next) => {
    parametersController.getSearchParameters(req, "job-titles", (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/parameters/industries', (req, res, next) => {
    parametersController.getSearchParameters(req, "industries", (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

router.get('/parameters/positions', (req, res, next) => {
    parametersController.getSearchParameters(req, "positions", (err, subscription) => {
        handleStandard(req, res, err, subscription, next);
    })
})

module.exports = router;