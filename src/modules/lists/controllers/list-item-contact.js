const axios = require('axios');
const Podcast = require('../../podcasts/models/podcast');
const Guest = require('../../people/models/guest');
const ProfileData = require('../../profile/models/profile-data')
const speakercsvuopload = require('../../../modules/csvupload/models/speakercsvupload');
const UserPodcast = require('../models/user-podcast');
const CustomError = require("../../common/errors/custom-error");
const UserPodcastEpisode = require('../models/user-podcast-episode');
const UserEventOrganization = require('../models/user-event-organization');
const UserBusiness = require('../models/user-business');
const UserMediaOutlet = require('../models/user-media-outlet');
const UserConference = require('../models/user-conference');
const UserGuest = require('../models/user-guest');
//speaker
const UserSpeaker = require('../models/user-speaker');
////
const EVENT_ORG_API = '/event-organizations/app/';
const BUSINESS_API = '/businesses/app/';
const MEDIA_API = '/media/app/';
const CONFERENCE_API = '/conferences/app/';
// const SPEAKER_API = '/speaker/app/'
// const PROFILE_API = '/speaker/public/';
// const PROFILE_API_APP = '/speaker/app/';



const contactDataFetcher = {

  getContactData: (listContact, callback) => {
    if (listContact.userPodcastId)
      contactDataFetcher.getPodcastContactData(listContact, callback);
    else if (listContact.userPodcastEpisodeId)
      contactDataFetcher.getEpisodeContactData(listContact, callback);
    else if (listContact.userEventOrganizationId)
      contactDataFetcher.getEventOrganizationContactData(listContact, callback);
    else if (listContact.userBusinessId)
      contactDataFetcher.getBusinessContactData(listContact, callback);
    else if (listContact.userMediaOutletId)
      contactDataFetcher.getMediaOutletContactData(listContact, callback);
    else if (listContact.userConferenceId) {
      contactDataFetcher.getConferenceContactData(listContact, callback);
    }
    else if (listContact.userGuestId)
      contactDataFetcher.getGuestContactData(listContact, callback);
    //speaker
    else if (listContact.userSpeakerId)
      contactDataFetcher.getSpeakerContactData(listContact, callback);

  },

  updateContactData: (listContact, callback) => {
    if (listContact.userEventOrganizationId)
      contactDataFetcher.updateEventOrganizationContactData(listContact, callback);
    else if (listContact.userMediaOutletId)
      contactDataFetcher.updateMediaOutletContactData(listContact, callback);
    else if (listContact.userConferenceId) {
      contactDataFetcher.updateConferenceContactData(listContact, callback);
    }
  },

  addContactData: (listContact, callback) => {
    if (listContact.userPodcastId)
      contactDataFetcher.addPodcastContactData(listContact, callback);
    else if (listContact.userPodcastEpisodeId)
      contactDataFetcher.addEpisodeContactData(listContact, callback);
    else if (listContact.userEventOrganizationId)
      contactDataFetcher.addEventOrganizationContactData(listContact, callback);
    else if (listContact.userBusinessId)
      contactDataFetcher.addBusinessContactData(listContact, callback);
    else if (listContact.userMediaOutletId)
      contactDataFetcher.addMediaOutletContactData(listContact, callback);
    else if (listContact.userConferenceId)
      contactDataFetcher.addConferenceContactData(listContact, callback);
    else if (listContact.userGuestId)
      contactDataFetcher.addGuestContactData(listContact, callback);
    //speaker
    else if (listContact.userSpeakerId)
      contactDataFetcher.addSpeakerContactData(listContact, callback);
  },

  getSpeakerContactData: (listContact, callback) => {
    UserSpeaker.findById(listContact.userSpeakerId, (err, userSpeaker) => {
      if (err) return callback(err);

      speakercsvuopload.findOne({ email: userSpeaker.speaker.email }).select('email').exec((err, resProfileData) => {
        if (err) return callback(err);
        return callback(null, resProfileData.email);
      })
    })
  },

  addSpeakerContactData: (listContact, callback) => {
    UserSpeaker.findById(listContact.userSpeakerId, (err, userSpeaker) => {
      if (err) return callback(err);

      speakercsvuopload.findOne({ email: userSpeaker.speaker.email }).select('email').exec((err, resProfileData) => {
        if (err) return callback(err);
        UserSpeaker.findByIdAndUpdate(listContact.userSpeakerId, { connected: true, editDate: Date.now() }, (err) => {
          if (err) return callback(err);

          callback(null, resProfileData.email);
        })
      })
    })
  },

  getPodcastContactData: (listContact, callback) => {
    UserPodcast.findById(listContact.userPodcastId, (err, userPodcast) => {
      if (err) return callback(err);

      //if (userPodcast.connected) return callback();

      Podcast.findOne({ listenNotesId: userPodcast.listenNotesId }).select('email').exec((err, podcast) => {
        if (err) return callback(err);
        return callback(null, podcast.email);
      })
    })
  },

  addPodcastContactData: (listContact, callback) => {
    UserPodcast.findById(listContact.userPodcastId, (err, userPodcast) => {
      if (err) return callback(err);

      //if (userPodcast.connected) return callback();

      Podcast.findOne({ listenNotesId: userPodcast.listenNotesId }).select('email').exec((err, podcast) => {
        if (err) return callback(err);
        UserPodcast.findByIdAndUpdate(userPodcast._id, { connected: true, editDate: Date.now() }, (err) => {
          if (err) return callback(err);

          callback(null, podcast.email);
        })
      })
    })
  },

  getEpisodeContactData: (listContact, callback) => {
    UserPodcastEpisode.findById(listContact.userPodcastEpisodeId, (err, userPodcastEpisode) => {
      if (err) return callback(err);

      //if (userPodcastEpisode.connected) return callback();

      Podcast.findOne({ listenNotesId: userPodcastEpisode.episode.podcastListenNotesId }).select('email').exec((err, podcast) => {
        if (err) return callback(err);
        return callback(null, podcast.email);
      })
    })
  },

  addEpisodeContactData: (listContact, callback) => {
    UserPodcastEpisode.findById(listContact.userPodcastEpisodeId, (err, userPodcastEpisode) => {
      if (err) return callback(err);

      //if (userPodcastEpisode.connected) return callback();

      Podcast.findOne({ listenNotesId: userPodcastEpisode.episode.podcastListenNotesId }).select('email').exec((err, podcast) => {
        if (err) return callback(err);
        UserPodcastEpisode.findByIdAndUpdate(userPodcastEpisode._id, { connected: true, editDate: Date.now() }, (err) => {
          if (err) return callback(err);

          callback(null, podcast.email);
        })
      })
    })
  },

  getEventOrganizationContactData: (listContact, callback) => {
    UserEventOrganization.findById(listContact.userEventOrganizationId).lean().exec((err, userEventOrganization) => {
      if (err) return callback(err);

      //if (userEventOrganization.connected) return callback();

      let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
      axios.get(process.env.MARKETING_SEARCH_URL + EVENT_ORG_API + userEventOrganization.eventOrganizationId + "/contact", { headers: { Authorization: authString } })
        .then(response => {
          const eventContactData = response.data;
          return callback(null, eventContactData.email);
        })
        .catch(error => {
          callback(error);
        })

    })
  },
  
  updateEventOrganizationContactData: (listContact, callback) => {
    UserEventOrganization.findById(listContact.userEventOrganizationId).lean().exec((err, userEventOrganization) => {
      if (err) return callback(err);
      let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
      axios.put(process.env.MARKETING_SEARCH_URL + EVENT_ORG_API + userEventOrganization.eventOrganizationId + "/contact", {}, { headers: { Authorization: authString } })
        .then(response => {
          return response
        })
        .catch(error => {
          callback(error);
        })
    })
  },

  addEventOrganizationContactData: (listContact, callback) => {
    UserEventOrganization.findById(listContact.userEventOrganizationId).lean().exec((err, userEventOrganization) => {
      if (err) return callback(err);

      //if (userEventOrganization.connected) return callback();

      let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
      axios.get(process.env.MARKETING_SEARCH_URL + EVENT_ORG_API + userEventOrganization.eventOrganizationId + "/contact", { headers: { Authorization: authString } })
        .then(response => {
          const eventContactData = response.data;

          let updatedObject = Object.assign(userEventOrganization.eventOrganization, eventContactData);
          delete updatedObject.email;
          UserEventOrganization.findByIdAndUpdate(userEventOrganization._id, { eventOrganization: updatedObject, connected: true, editDate: Date.now() }, (err) => {
            if (err) return callback(err);

            callback(null, eventContactData.email);
          })
        })
        .catch(error => {
          callback(error);
        })

    })
  },

  getBusinessContactData: (listContact, callback) => {
    UserBusiness.findById(listContact.userBusinessId).lean().exec((err, userBusiness) => {
      if (err) return callback(err);

      //if (userBusiness.connected) return callback();

      let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
      let type = userBusiness.business.organization ? 'national' : 'local';
      axios.get(process.env.MARKETING_SEARCH_URL + BUSINESS_API + type + "/" + userBusiness.businessId + "/contact", { headers: { Authorization: authString } })
        .then(response => {
          const businessData = response.data;
          return callback(null, businessData.email);
        })
        .catch(error => {
          callback(error);
        })
    })
  },

  addBusinessContactData: (listContact, callback) => {
    UserBusiness.findById(listContact.userBusinessId).lean().exec((err, userBusiness) => {
      if (err) return callback(err);

      //if (userBusiness.connected) return callback();

      let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
      let type = userBusiness.business.organization ? 'national' : 'local';
      axios.get(process.env.MARKETING_SEARCH_URL + BUSINESS_API + type + "/" + userBusiness.businessId + "/contact", { headers: { Authorization: authString } })
        .then(response => {
          const businessData = response.data;

          let updatedObject = Object.assign(userBusiness.business, businessData);
          delete updatedObject.email;
          UserBusiness.findByIdAndUpdate(userBusiness._id, { business: updatedObject, connected: true, editDate: Date.now() }, (err) => {
            if (err) return callback(err);

            callback(null, businessData.email);
          })
        })
        .catch(error => {
          callback(error);
        })
    })
  },

  getMediaOutletContactData: (listContact, callback) => {
    UserMediaOutlet.findById(listContact.userMediaOutletId).lean().exec((err, userMediaOutlet) => {
      if (err) return callback(err);

      //if (userMediaOutlet.connected) return callback();

      let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
      axios.get(process.env.MARKETING_SEARCH_URL + MEDIA_API + userMediaOutlet.mediaOutletId + "/contact", { headers: { Authorization: authString } })
        .then(response => {
          const mediaData = response.data;
          return callback(null, mediaData.email);
        })
        .catch(error => {
          callback(error);
        })
    })
  },

  updateMediaOutletContactData: (listContact, callback) => {
    UserMediaOutlet.findById(listContact.userMediaOutletId).lean().exec((err, userMediaOutlet) => {
      if (err) return callback(err);
      let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
      axios.put(process.env.MARKETING_SEARCH_URL + MEDIA_API + userMediaOutlet.mediaOutletId, {}, { headers: { Authorization: authString } })
        .then(response => {
          return response
        })
        .catch(error => {
          callback(error);
        })
    })
  },

  addMediaOutletContactData: (listContact, callback) => {
    UserMediaOutlet.findById(listContact.userMediaOutletId).lean().exec((err, userMediaOutlet) => {
      if (err) return callback(err);

      //if (userMediaOutlet.connected) return callback();

      let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
      axios.get(process.env.MARKETING_SEARCH_URL + MEDIA_API + userMediaOutlet.mediaOutletId + "/contact", { headers: { Authorization: authString } })
        .then(response => {
          const mediaData = response.data;

          let updatedObject = Object.assign(userMediaOutlet.mediaOutlet, mediaData);
          delete updatedObject.email;
          UserMediaOutlet.findByIdAndUpdate(userMediaOutlet._id, { mediaOutlet: updatedObject, connected: true, editDate: Date.now() }, (err) => {
            if (err) return callback(err);

            callback(null, mediaData.email);
          })
        })
        .catch(error => {
          callback(error);
        })
    })
  },

  getConferenceContactData: (listContact, callback) => {
    UserConference.findById(listContact.userConferenceId).lean().exec((err, userConference) => {
      if (err) return callback(err);

      let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
      axios.get(process.env.MARKETING_SEARCH_URL + CONFERENCE_API + userConference.conferenceId + "/contact", { headers: { Authorization: authString } })
        .then(response => {
          const conferenceData = response.data;
          return callback(null, conferenceData.email);
        })
        .catch(error => {
          callback(error);
        })
    })
  },

  updateConferenceContactData: (listContact, callback) => {
    UserConference.findById(listContact.userConferenceId).lean().exec((err, userConference) => {
      if (err) return callback(err);
      let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
      axios.put(process.env.MARKETING_SEARCH_URL + CONFERENCE_API + userConference.conferenceId, {}, { headers: { Authorization: authString } })
        .then(response => {
          return response
        })
        .catch(error => {
          callback(error);
        })
    })
  },

  addConferenceContactData: (listContact, callback) => {
    UserConference.findById(listContact.userConferenceId).lean().exec((err, userConference) => {
      if (err) return callback(err);

      //if (userConference.connected) return callback();

      let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
      axios.get(process.env.MARKETING_SEARCH_URL + CONFERENCE_API + userConference.conferenceId + "/contact", { headers: { Authorization: authString } })
        .then(response => {
          const conferenceData = response.data;

          let updatedObject = Object.assign(userConference.conference, conferenceData);
          delete updatedObject.email;
          UserConference.findByIdAndUpdate(userConference._id, { conference: updatedObject, connected: true, editDate: Date.now() }, (err) => {
            if (err) return callback(err);

            callback(null, conferenceData.email);
          })
        })
        .catch(error => {
          callback(error);
        })
    })
  },

  getGuestContactData: (listContact, callback) => {
    UserGuest.findById(listContact.userGuestId, (err, userGuest) => {
      if (err) return callback(err);

      if (userGuest.connected) return callback();

      Guest.findById(userGuest.guestId, (err, guest) => {
        if (err) return callback(err);
        return callback(null, guest.email);
      })
    })
  },

  addGuestContactData: (listContact, callback) => {
    UserGuest.findById(listContact.userGuestId, (err, userGuest) => {
      if (err) return callback(err);

      if (userGuest.connected) return callback();

      Guest.findById(userGuest.guestId, (err, guest) => {
        if (err) return callback(err);
        UserGuest.findByIdAndUpdate(userGuest._id, { connected: true, editDate: Date.now() }, (err) => {
          if (err) return callback(err);

          callback(null, guest.email);
        })
      })
    })
  },

  //speaker api call here 
  // addSpeakerContactData: (listContact, callback) => {
  //   UserSpeaker.findById(listContact.userSpeakerId).lean().exec((err, userSpeaker) => {
  //     if (err) return callback(err);
  //     let authString = 'Bearer ' + process.env.PROFILE_API_JWT;
  //     axios.get(process.env.BACK_BASE_URL + PROFILE_API + userSpeaker.speakerId + "/items/contact",
  //       {
  //         headers:
  //           { Authorization: authString }
  //       }
  //     ).then(response => {
  //       const speakerData = response.data;
  //       let updatedObject = Object.assign(userSpeaker.speaker, speakerData);
  //       delete updatedObject.email;
  //       userSpeaker.findByIdAndUpdate(userSpeaker._id, { speaker: updatedObject, connected: true, editDate: Date.now() }, (err) => {
  //         if (err) return callback(err);
  //         callback(null, speakerData.email);
  //       })
  //     })
  //       .catch(error => {
  //         callback(error);
  //       })
  //   })
  // },

  // speaker api end 





}

module.exports = contactDataFetcher;