const Podcast = require('../../podcasts/models/podcast');
var emailable = require('emailable')(process.env.EMAILABLE_API_KEY);
const ProfileData = require('../../profile/models/profile-data')
const speakercsvuopload = require('../../../modules/csvupload/models/speakercsvupload');
const Guest = require('../../people/models/guest');
const errorConstants = require('../../common/errors/constants');
const CustomError = require('../../common/errors/custom-error');

const emailLookUpController = {
  verifyWithChecker: (sequence, callback) => {
    getEmailToVerify(sequence, (err, emailObj) => {
      if (err) callback(err);
      else {
        if (emailObj.email) {
          if (emailObj.verification) {
            callback(null, emailObj.verification);
          }
          else {
            emailable.verify(sequence.emailTo.trim()).then(function (response) {
              if (response) {
                updateVerification(emailObj.type, emailObj.id, emailObj.verification, err => {
                  if (err) callback(err)
                  else
                    callback(null, response.state);
                })
              }
              else {
                callback(new CustomError(errorConstants.LOOKUP_EMAIL_CHECKER, errorConstants.STATUS_FAILED_SEND_LOOKUP));
              }
            })
          }
        }
        else {
          callback("Unforseen error, email missing");
        }
      }
    })
  },
};


const getEmailToVerify = (outreachSequence, callback) => {

  if (outreachSequence.userPodcastId)
    Podcast.findOne({ listenNotesId: outreachSequence.userPodcastId.podcast.listenNotesId }, (err, podcast) => {
      if (err) callback(err);
      else callback(null,
        {
          email: podcast.email,
          verification: podcast.verification,
          type: 'podcast',
          id: podcast._id
        });
    })


  else if (outreachSequence.userSpeakerId)


    speakercsvuopload.findOne({ email: outreachSequence.userSpeakerId.speaker.email }, (err, resProfileData) => {
      if (err) callback(err);
      else if (!resProfileData) callback(new CustomError('speaker not found', 404))
      else callback(null,
        {
          email: resProfileData.email,
          verification: resProfileData.verification,
          type: 'resProfileData',
          id: resProfileData._id
        });
    })


  else if (outreachSequence.userPodcastEpisodeId)
    Podcast.findOne({ listenNotesId: outreachSequence.userPodcastEpisodeId.episode.podcastListenNotesId }, (err, podcast) => {
      if (err) callback(err);
      else if (!podcast) callback(new CustomError('Podcast not found', 404))
      else callback(null,
        {
          email: podcast.email,
          verification: podcast.verification,
          type: 'podcast',
          id: podcast._id
        });
    })
  else if (outreachSequence.userGuestId)
    Guest.findById(outreachSequence.userGuestId.guest._id, (err, guest) => {
      if (err) callback(err);
      else callback(null,
        {
          email: guest.email,
          verification: guest.verification,
          type: 'guest',
          id: guest._id
        });
    })
  // TODO: Explain this
  else if (outreachSequence.userMediaOutletId)
    callback(null, {
      email: outreachSequence.emailTo,
      type: 'mediaOutlet'
    })
  else if (outreachSequence.userEventOrganizationId)
    callback(null, {
      email: outreachSequence.emailTo,
      type: 'eventOrganization'
    })
  else if (outreachSequence.userBusinessId)
    callback(null, {
      email: outreachSequence.emailTo,
      type: 'business'
    })
  else if (outreachSequence.userConferenceId)
    callback(null, {
      email: outreachSequence.emailTo,
      type: 'conference'
    })

}

const updateVerification = (type, id, verification, callback) => {
  // TODO: Update verification for other sources of email (Businesses and guests)
  switch (type) {
    case 'podcast':
      Podcast.findByIdAndUpdate(id, { verification: verification }, callback);
      break;
    case 'resProfileData':
      ProfileData.findByIdAndUpdate(id, { verification: verification }, callback);
      break;
    case 'guest':
      Guest.findByIdAndUpdate(id, { verification: verification }, callback);
      break;
    default:
      callback();
      break;
  }
}

module.exports = emailLookUpController;