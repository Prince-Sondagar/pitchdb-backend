/* eslint-disable linebreak-style */
const axios = require('axios');

const MEDIA_API = '/media/public/';
const MEDIA_API_APP = '/media/app/';

const Mediaotletcsvupload = require('../../csvupload/models/mediaotletcsvupload');

const authString = 'Bearer ' + process.env.MARKETING_API_JWT;

const mediaOutletSearchController = {
	getMediaSearchResults: (req, callback) => {
		axios.get(process.env.MARKETING_SEARCH_URL + MEDIA_API, {
			headers:
				{ Authorization: authString },
			params:
				req.query
		}).then(response => {
			callback(null, response.data);
		}).catch(error => {
			callback(error);
		})
	},

	getMediaSearchTotalResults: (req, callback) => {
		axios.get(process.env.MARKETING_SEARCH_URL + MEDIA_API + 'total', {
			headers: {
				Authorization: authString
			}
		}).then((response) => {
			callback(null, response.data);
		}).catch((error) => {
			callback(error);
		});
	},

	getMediaParameters: (req, type, callback) => {
		axios.get(process.env.MARKETING_SEARCH_URL + MEDIA_API + type, {
			headers:
			{ Authorization: authString },
			params:
			req.query
		}).then(response => {
			callback(null, response.data);
		}).catch(error => {
			callback(error);
		})
	},

	addMediadata: (req, callback) => {
		const data = req.body.requestBody;
		
		axios.post(process.env.MARKETING_SEARCH_URL + MEDIA_API_APP, data, {
			headers: { Authorization: authString },
		}).then(response => {
			callback(null, response.data);
		}).catch(error => {
			callback(error);
		})
	},

	getmediaoutletfields: (callback) => {
		callback(null, Mediaotletcsvupload.schema.obj);
	},
}

module.exports = mediaOutletSearchController;