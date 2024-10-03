/* eslint-disable linebreak-style */
const axios = require('axios');

// const PROFILE_API = '/businesses/public/';
const PROFILE_API = '/speaker/public/';
const PROFILE_API_APP = '/speaker/app/';

// const speakercsvuopload = require('../../../modules/csvupload/models/speakercsvupload');




const profileSearchController = {

    getProfileSearchResults: (req, type, callback) => {
        let authString = 'Bearer ' + process.env.PROFILE_API_JWT;

        axios.get(process.env.BACK_BASE_URL + PROFILE_API + type,
            {
                headers:
                    { Authorization: authString },
                params:
                    req.query
            }
        ).then(response => {
            callback(null, response.data);
        })
            .catch(error => {
                callback(error);
            })

    },
    

    getLocalProfileById: (profileId, callback) => {
        let authString = 'Bearer ' + process.env.PROFILE_API_JWT;

        axios.get(process.env.BACK_BASE_URL + PROFILE_API + "local/" + profileId,
            {
                headers:
                    { Authorization: authString }
            }
        ).then(response => {
            callback(null, response.data);
        })
            .catch(error => {
                callback(error);
            })
    },

    addProfiledata: (req, callback) => {
        const data = req.body.requestBody;
        let authString = 'Bearer ' + process.env.PROFILE_API_JWT;

        axios.post(process.env.BACK_BASE_URL + PROFILE_API_APP + 'profile', data,
            {
                headers: { Authorization: authString },
            }
        ).then(response => {
            callback(null, response.data);
        }).catch(error => {
            callback(error);
        })
    },

    addLocalprofiledata: (req, callback) => {
        const data = req.body.requestBody;
        let authString = 'Bearer ' + process.env.PROFILE_API_JWT;

        axios.post(process.env.BACK_BASE_URL + PROFILE_API_APP + 'local', data,
            {
                headers: { Authorization: authString },
            }
        ).then(response => {
            callback(null, response.data);
        }).catch(error => {
            callback(error);
        })
    },

    //// csv api start



   
}

module.exports = profileSearchController;