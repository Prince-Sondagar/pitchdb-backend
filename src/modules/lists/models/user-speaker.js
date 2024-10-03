const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSpeaker = new Schema({
  // listenNotesId: { type: String, required: true },
  userId: { type: String, required: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'team', required: false },
  speakerId: { type: String,required: true },
  speaker:
        { 
        userId: { type: Schema.Types.ObjectId, ref: 'user'},
        teamId: { type: Schema.Types.ObjectId, ref: 'team', required: false },
        unPublishProfile: { type:Boolean, required: false},
        image:{ type:String, required: false},
        name:{ type:String, required: false},
        email:{type:String, required: false},
        businessname:{type:String, required: false},
        website:{type:String, required: false},
        socialMediaLink1:{type:String, required: false},
        socialMediaLink2:{type:String, required: false},
        socialMediaLink3:{type:String, required: false},
        Equipment:{type:String, required: false},
        additionalinfo:{type:String, required: false},
        optionalcontactmethod:{type:String, required: false},
        searchGenres:{type:Array, required: false},
        subcategories:{type:String, required: false},
        shortbio:{type:String, required: false},
        topics:{type:String, required: false},
        detailedprofile:{type:String, required: false},
        qualification:{type:String, required: false},
        audience:{type:String, required: false},
        promotionPlan:{type:String, required: false},
        sampleQuestion:{type:String, required: false},
        ownpodcast:{type:String, required: false},
        past_appereance1:{ 
            title: {type:String},
            id: {type:String}
        },
        past_appereance2:{
            title: {type:String},
            id: {type:String}
        },
        past_appereance3:{
            title: {type:String},
            id: {type:String}
          }},
  
  tag: { type: String, required: false },
  date: { type: Date, default: Date.now },
  //_id: false,
  email: { type: String, required: false },
  connected: { type: Boolean, default: false },
  oldUser: { type: String, default: 'none' },
  editDate: { type: Date, required: false},
  
});

userSpeaker.index({ userId: 1, speakerId: 1, oldUser: 1 }, { unique: true });
// userSpeaker.index({ userId: 1, 'speaker.feedUrl': 1, oldUser: 1 }, { unique: true });

module.exports = mongoose.model('userSpeaker', userSpeaker, 'userSpeakers');