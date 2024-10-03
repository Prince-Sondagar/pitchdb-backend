/* eslint-disable linebreak-style */
const axios = require('axios');

const BUSINESS_API = '/businesses/public/';
const BUSINESS_API_APP = '/businesses/app/';

const Nationalbusinesscsvupload = require('../../csvupload/models/nationalbusinesscsvupload');
const Localbusinesscsvupload = require('../../csvupload/models/localbusinesscsvupload');



const businessSearchController = {

    getBusinessSearchResults: (req, type, callback) => {
        let authString = 'Bearer ' + process.env.MARKETING_API_JWT;

        axios.get(process.env.MARKETING_SEARCH_URL + BUSINESS_API + type,
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

    getLocalBusinessById: (businessId, callback) => {
        let authString = 'Bearer ' + process.env.MARKETING_API_JWT;

        axios.get(process.env.MARKETING_SEARCH_URL + BUSINESS_API + "local/" + businessId,
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

    addNationalbusinessdata: (req, callback) => {
        const data = req.body.requestBody;
        let authString = 'Bearer ' + process.env.MARKETING_API_JWT;

        axios.post(process.env.MARKETING_SEARCH_URL + BUSINESS_API_APP + 'national', data,
            {
                headers: { Authorization: authString },
            }
        ).then(response => {
            callback(null, response.data);
        }).catch(error => {
            callback(error);
        })
    },

    addLocalbusinessdata: (req, callback) => {
        const data = req.body.requestBody;
        let authString = 'Bearer ' + process.env.MARKETING_API_JWT;
        axios.post(process.env.MARKETING_SEARCH_URL + BUSINESS_API_APP + 'local', data,
            {
                headers: { Authorization: authString },
            }
        ).then(response => {
            callback(null, response.data);
        }).catch(error => {
            callback(error);
        })
    },

    getnationalbusinessfields: (callback) => {
        callback(null, Nationalbusinesscsvupload.schema.obj);
    },

    getlocalbusinessfields: (callback) => {
        callback(null, Localbusinesscsvupload.schema.obj);
    },
}

module.exports = businessSearchController;