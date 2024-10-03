/* eslint-disable linebreak-style */
const axios = require('axios');

const CONFERENCES_API = '/conferences/public/';
const CONFERENCES_API_APP = '/conferences/app/';

const Csvupload = require('../../csvupload/models/csvupload');

const authString = 'Bearer ' + process.env.MARKETING_API_JWT;

const ConferenceSearchController = {
    getConferenceSearchResults: (req, callback) => {
        axios.get(process.env.MARKETING_SEARCH_URL + CONFERENCES_API,
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

    getConferenceSearchTotalResults: (req, callback) => {
        axios.get(process.env.MARKETING_SEARCH_URL + CONFERENCES_API + 'total', {
            headers: { Authorization: authString }
        }
        ).then(response => {
            callback(null, response.data);
        }).catch(error => {
            callback(error);
        })
    },

    getConferenceParameters: (type, callback) => {
        axios.get(process.env.MARKETING_SEARCH_URL + CONFERENCES_API + type, {
            headers: { Authorization: authString }
        }
        ).then(response => {
            callback(null, response.data);
        }).catch(error => {
            callback(error);
        })
    },

    getcofrencefields: (callback) => {
        callback(null, Csvupload.schema.obj);
    },

    addCsvdata: (req, callback) => {
        const data = req.body.requestBody;

        axios.post(process.env.MARKETING_SEARCH_URL + CONFERENCES_API_APP, data, {
            headers: { Authorization: authString },
        }
        ).then(response => {
            callback(null, response.data);
        }).catch(error => {
            callback(error);
        })

    },
}

module.exports = ConferenceSearchController;