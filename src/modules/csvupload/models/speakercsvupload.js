const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let speakercsvuopload = new Schema({
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
    },
    podcasts: {type:Boolean, required: false},
    free_speaking: {type:Boolean, required: false},
    paid_speaking: {type:Boolean, required: false},
    virtual: {type:Boolean, required: false},
    conferences: {type:Boolean, required: false},
    connected: { type: Boolean, default: false },
    editDate: { type: Date, required: false},
    opportunities:{type:Array, required: false},
});
// speakercsvuopload.index({ listenNotesId : 1,title: 1 });



module.exports = mongoose.model('speakercsvuopload', speakercsvuopload, 'speakercsvuoploads');