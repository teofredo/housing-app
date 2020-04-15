import axios from 'axios';

var apiMixin = {
	methods: {
		httpGet(url, params) {
			return axios.get(`${process.env.API_URL}/api/v1`, params || {});
		}
	}
};