const speakercsvuopload = require("../../../modules/csvupload/models/speakercsvupload");

const Profiledatacontroller = {

  addProfiledata: (req, callback) => {
    const data = req.body.data;
    data.userId = req.decoded.userId;
    const filter = { userId: data.userId };
    const update = data;
    speakercsvuopload.findOne({ userId: data.userId }, (err, doc) => {
      if (doc == null || doc == "" || doc === undefined) {
        speakercsvuopload.create(data, function (err, docs) {
          if (err || !docs) {
            callback(err);
          } else {
            callback(null, docs);
          }
        });
      } else {
        speakercsvuopload.findOneAndUpdate(filter, update, function (err, docs) {
          if (err) {
            callback(err);
          } else {
            callback(null, docs);
          }
        });
      }
    });
  },

  addSpeakersData: (req, callback) => {
    const data = req.body.requestBody;
    speakercsvuopload.create(data, function (err, docs) {
      if (err || !docs) {
        callback(err);
      } else {
        callback(null, docs);
      }
    });
  },
  getspeakerdatafields: (callback) => {
    callback(null, speakercsvuopload.schema.obj);
  },

  getProfiledata: (req, callback) => {
    speakercsvuopload.findOne({ userId: req.decoded.userId }, (err, doc) => {
      if (err) {
        callback(err);
      } else {
        callback(null, doc);
      }
    });
  },
  getSpeakerById: (req, callback) => {
    speakercsvuopload.findById(req.params.id, (err, doc) => {
      if (err) {
        callback(err);
      } else {
        callback(null, doc);
      }
    });
  },
  //get expeert data
  getAllExperts: (req, callback) => {
    let keywords = req.params.id;
    regex = new RegExp(keywords, "i");
    let queryParams =
      keywords !== undefined
        ? {
            $and: [
              {
                $or: [
                  { image: regex },
                  { name: regex },
                  { email: regex },
                  { website: regex },
                  { businessname: regex },
                  { socialMediaLink1: regex },
                  { socialMediaLink2: regex },
                  { socialMediaLink3: regex },
                  { Equipment: regex },
                  { additionalinfo: regex },
                  { optionalcontactmethod: regex },
                  { subcategories: regex },
                  { shortbio: regex },
                  { topics: regex },
                  { detailedprofile: regex },
                  { qualification: regex },
                  { audience: regex },
                  { promotionPlan: regex },
                  { sampleQuestion: regex },
                  { ownpodcast: regex },
                  { podcasts: regex },
                  { free_speaking: regex },
                  { paid_speaking: regex },
                  { virtual: regex },
                  { conferences: regex },
                  { past_appereance1: regex },
                  { past_appereance2: regex },
                  { past_appereance3: regex },
                ],
              },
            ],
          }
        : keywords !== undefined
        ? {
            $or: [
              { name: regex },
              { email: regex },
              { website: regex },
              { businessname: regex },
              { socialMediaLink1: regex },
              { socialMediaLink2: regex },
              { socialMediaLink3: regex },
              { Equipment: regex },
              { additionalinfo: regex },
              { optionalcontactmethod: regex },
              { subcategories: regex },
              { shortbio: regex },
              { topics: regex },
              { detailedprofile: regex },
              { qualification: regex },
              { audience: regex },
              { promotionPlan: regex },
              { sampleQuestion: regex },
              { ownpodcast: regex },
              { past_appereance1: regex },
              { past_appereance2: regex },
              { podcasts: regex },
              { free_speaking: regex },
              { paid_speaking: regex },
              { virtual: regex },
              { conferences: regex },
              { past_appereance1: regex },
              { past_appereance2: regex },
              { past_appereance3: regex },
            ],
          }
        : {};
    speakercsvuopload
      .find(queryParams)
      .lean()
      .exec((err, doc) => {
        if (err) {
          callback(err);
        } else {
          callback(null, doc);
        }
      });
  },

  getProfilesearchdata: (req, callback) => {
    let keywords = JSON.parse(req.params.id).keyword;
    let searchGenres = JSON.parse(req.params.id).searchGenres;
    let selectSearchOpportunities = JSON.parse(req.params.id).selectSearchOpportunities;
    let offset = JSON.parse(req.params.id).filters.offset
      ? JSON.parse(req.params.id).filters.offset
      : 0;
    searchGenres = searchGenres && searchGenres.map((gId) => gId._id);
    selectSearchOpportunities = selectSearchOpportunities && selectSearchOpportunities.map((val) => val.value);
    regex = new RegExp(keywords, "i");
    let queryParams =
      keywords !== undefined &&
      keywords !== "experts" &&
      searchGenres.length > 0 &&
      selectSearchOpportunities.length > 0 
    ? {
      $and: [
        {
          $or: [
            { image: regex },
            { name: regex },
            { email: regex },
            { website: regex },
            { businessname: regex },
            { socialMediaLink1: regex },
            { socialMediaLink2: regex },
            { socialMediaLink3: regex },
            { Equipment: regex },
            { additionalinfo: regex },
            { optionalcontactmethod: regex },
            { subcategories: regex },
            { shortbio: regex },
            { topics: regex },
            { detailedprofile: regex },
            { qualification: regex },
            { audience: regex },
            { promotionPlan: regex },
            { sampleQuestion: regex },
            { ownpodcast: regex },
            { past_appereance1: regex },
            { past_appereance2: regex },
            { past_appereance3: regex },
          ],
        },
        {
          "searchGenres._id": { $in: searchGenres },
          image: { $exists: true, $not : /.*pitchdbLogo.*/i },
        },
        {
          "opportunities": { $in: selectSearchOpportunities },
          image: { $exists: true, $not : /.*pitchdbLogo.*/i },
        },
      ],
    }
    :  keywords !== undefined &&
      keywords !== "experts" &&
      selectSearchOpportunities.length > 0 
      ? {
      $and: [
        {
          $or: [
            { image: regex },
            { name: regex },
            { email: regex },
            { website: regex },
            { businessname: regex },
            { socialMediaLink1: regex },
            { socialMediaLink2: regex },
            { socialMediaLink3: regex },
            { Equipment: regex },
            { additionalinfo: regex },
            { optionalcontactmethod: regex },
            { subcategories: regex },
            { shortbio: regex },
            { topics: regex },
            { detailedprofile: regex },
            { qualification: regex },
            { audience: regex },
            { promotionPlan: regex },
            { sampleQuestion: regex },
            { ownpodcast: regex },
            { past_appereance1: regex },
            { past_appereance2: regex },
            { past_appereance3: regex },
          ],
        },
        {
          "opportunities": { $in: selectSearchOpportunities },
          image: { $exists: true, $not : /.*pitchdbLogo.*/i },
        },
      ],
    }
    : keywords !== undefined &&
      keywords !== "experts" &&
      searchGenres.length > 0
        ? {
            $and: [
              {
                $or: [
                  { image: regex },
                  { name: regex },
                  { email: regex },
                  { website: regex },
                  { businessname: regex },
                  { socialMediaLink1: regex },
                  { socialMediaLink2: regex },
                  { socialMediaLink3: regex },
                  { Equipment: regex },
                  { additionalinfo: regex },
                  { optionalcontactmethod: regex },
                  { subcategories: regex },
                  { shortbio: regex },
                  { topics: regex },
                  { detailedprofile: regex },
                  { qualification: regex },
                  { audience: regex },
                  { promotionPlan: regex },
                  { sampleQuestion: regex },
                  { ownpodcast: regex },
                  { past_appereance1: regex },
                  { past_appereance2: regex },
                  { past_appereance3: regex },
                ],
              },
              {
                "searchGenres._id": { $in: searchGenres },
                image: { $exists: true, $not : /.*pitchdbLogo.*/i },
              },
            ],
          }
        : keywords !== undefined && keywords !== "experts"
        ? {
            // $and: {
            $or: [
              { image: regex },
              { name: regex },
              { email: regex },
              { website: regex },
              { businessname: regex },
              { socialMediaLink1: regex },
              { socialMediaLink2: regex },
              { socialMediaLink3: regex },
              { Equipment: regex },
              { additionalinfo: regex },
              { optionalcontactmethod: regex },
              { subcategories: regex },
              { shortbio: regex },
              { topics: regex },
              { detailedprofile: regex },
              { qualification: regex },
              { audience: regex },
              { promotionPlan: regex },
              { sampleQuestion: regex },
              { ownpodcast: regex },
              { past_appereance1: regex },
              { past_appereance2: regex },
              { past_appereance3: regex },
            ],
            image: { $exists: true, $not : /.*pitchdbLogo.*/i },
            // },
          }
        : { $or: [{ image: regex }, { image: { $exists: true, $not : /.*pitchdbLogo.*/i } }] };

    speakercsvuopload
      .find(queryParams)
      .lean()
      .limit(20)
      .skip(offset)
      .sort({ label: 1 })
      .exec((err, doc) => {
        
        if (err) {
          callback(err);
        } else {
          let profileData;
          speakercsvuopload.countDocuments(
            { unPublishProfile: { $ne: "true" }, image: { $exists: true, $not : /.*pitchdbLogo.*/i }},
            function (err, totalCount) {
              profileData = {
                offset: offset + 20,
                results: doc,
                total: totalCount,
              };
              callback(null, profileData);
            }
          );
        }
      });
  },
};

module.exports = Profiledatacontroller;
