/* eslint-disable linebreak-style */
const axios = require('axios');

const EVENT_API = '/event-organizations/public/';
const EVENT_API_APP = '/event-organizations/app/';

const Associationcsvupload = require('../../csvupload/models/associationcsvupload');
const authString = 'Bearer ' + process.env.MARKETING_API_JWT;

const EventSearchController = {

    getEventSearchResults: (req, callback) => {
        axios.get(process.env.MARKETING_SEARCH_URL + EVENT_API,
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

    getEventSearchTotalResults: (req, callback) => {
        axios.get(process.env.MARKETING_SEARCH_URL + EVENT_API + 'total', {
            headers: { Authorization: authString },
        }).then(response => {
            callback(null, response.data);
        }).catch(error => {
            callback(error);
        })
    }, 

    getEventById: (eventId, callback) => {
        axios.get(process.env.MARKETING_SEARCH_URL + EVENT_API + eventId,
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

    addAsscoaitiondata: (req, callback) => {
        const data = req.body.requestBody;
        axios.post(process.env.MARKETING_SEARCH_URL + EVENT_API_APP, data,
            {
                headers: { Authorization: authString },
            }
        ).then(response => {
            callback(null, response.data);
        }).catch(error => {
            callback(error);
        })
    },

    getassocaitionfields: (callback) => {
        callback(null, Associationcsvupload.schema.obj);
    },
}

module.exports = EventSearchController;