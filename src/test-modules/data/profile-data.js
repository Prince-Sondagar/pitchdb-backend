module.exports = {
    modelName: 'speakercsvuopload',
    model: require('../../modules/csvupload/models/speakercsvupload'),
  
    basicProfileData: (users) => {
      return [
        {
            userId: users[0]._id
        }
      ]
    }
  }