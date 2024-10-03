const express = require("express");
const router = express.Router();

const routeInterceptor = require("../../modules/common/interceptors/route-interceptor");
const searchController = require("../../modules/util/controllers/search");
const businessController = require("../../modules/search/controllers/business-search");
const conferenceController = require("../../modules/search/controllers/conference-search");
const eventController = require("../../modules/search/controllers/event-search");
const mediaOutletController = require("../../modules/search/controllers/media-outlet-search");
const profileSearchController = require("../../modules/search/controllers/speaker-search");
const profilejsonDataController = require("../../modules/parameters/controllers/profile")

const handleStandard = require("../../modules/common/util/handle-standard");

router.all("/*", routeInterceptor.verifyToken);
router.all("/*", routeInterceptor.verifyPrivileges({ isAdmin: true }));

router.get("/", (req, res, next) => {
  searchController.getSearches(req, (err, searches) => {
    handleStandard(req, res, err, searches, next);
  });
});

router.get("/count", (req, res, next) => {
  searchController.getSearchCount(req, (err, count) => {
    handleStandard(req, res, err, count, next);
  });
});

router.get("/getcurrentuser", (req, res, next) => {
  searchController.getcurrentuser(req, (err, count) => {
    handleStandard(req, res, err, count, next);
  });
});

router.post('/conferences', (req, res, next) => {
  conferenceController.addCsvdata(req, (err, result) => {
    handleStandard(req, res, err, result, next);
  })
})

router.post('/media', (req, res, next) => {
  mediaOutletController.addMediadata(req, (err, result) => {
    handleStandard(req, res, err, result, next);
  })
})

router.post('/event-organizations', (req, res, next) => {
  eventController.addAsscoaitiondata(req, (err, result) => {
    handleStandard(req, res, err, result, next);
  })
})

router.post('/national-business', (req, res, next) => {
  businessController.addNationalbusinessdata(req, (err, result) => {
    handleStandard(req, res, err, result, next);
  })
})

router.post('/local-business', (req, res, next) => {
  businessController.addLocalbusinessdata(req, (err, result) => {
    handleStandard(req, res, err, result, next);
  })
})
/// speaker csv start
// router.post('/local-speaker', (req, res, next) => {
//   profileSearchController.addSpeakersData(req, (err, result) => {
//     handleStandard(req, res, err, result, next);
//   })
// })

// router.get('/speaker-fields', (req, res, next) => {
//   profileSearchController.getspeakerdatafields((err, plans) => {
//     handleStandard(req, res, err, plans, next);
//   })
// })

// router.get('/profile', routeInterceptor.useCache(100), (req, res, next) => {
//   profilejsonDataController.getProfileJson((err, data) => {
//       handleStandard(req,res, err, data, next);
//   })
// });
//// speaker csv end
router.get('/conference-fields', (req, res, next) => {
  conferenceController.getcofrencefields((err, plans) => {
    handleStandard(req, res, err, plans, next);
  })
})
router.get('/media-fields', (req, res, next) => {
  mediaOutletController.getmediaoutletfields((err, plans) => {
    handleStandard(req, res, err, plans, next);
  })
})

router.get('/event-organization-fields', (req, res, next) => {
  eventController.getassocaitionfields((err, plans) => {
    handleStandard(req, res, err, plans, next);
  })
})

router.get('/national-business-fields', (req, res, next) => {
  businessController.getnationalbusinessfields((err, plans) => {
    handleStandard(req, res, err, plans, next);
  })
})

router.get('/local-business-fields', (req, res, next) => {
  businessController.getlocalbusinessfields((err, plans) => {
    handleStandard(req, res, err, plans, next);
  })
})

module.exports = router;
