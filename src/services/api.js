import axios from 'axios';

axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

var apiUrl = process.env.API_URL;

var setAccessToken = function(accessToken){
	accessToken = `Bearer ${accessToken}`;
	localStorage.setItem('access_token', accessToken);
	axios.defaults.headers.common['Authorization'] = accessToken;
}

export default {
	httpGet(endpoint, params) {
		return axios.get(endpoint, params || {});
	},
	
	httpPost(endpoint, params) {
		return axios.post(endpoint, params || {});
	},
	
	httpRequest(url, data, method) {
		return axios({
			method: method || 'GET',
			url: url,
			data: data || {}
		});
	},
	
	async login(username, password) {
		try {
			var params = {
				grant_type: 'password',
				username,
				password
			};
			
			let response = await this.httpPost('/login', params);
			let data = response.data || {};
			
			if('error' in response || 'error' in data) {
				return false;
			}
			
			setAccessToken(data.access_token);
			return true;
						
		} catch(e) {}
		
		return false;
	},
	
	async logout() {
		try {
			var response = await this.httpPost('/logout');
			var data = response.data;
			if('status' in data && data.status == 'success') {
				localStorage.removeItem('access_token');
				localStorage.removeItem('user');
				return response;
			}			
		} catch(e) {}
		
		return false;
	},
	
	async authUser() {
		var user = localStorage.getItem('user');
		if(user) {
			return JSON.parse(user);
		}
		
		var response = await this.httpGet('/auth-user');
		
		user = response.data.data;
		
		if('user_id' in user) {
			localStorage.setItem('user', JSON.stringify(user));
		}
		
		return user;
	},
	
	async isAuth() {
		try {
			var response = await this.authUser();
			return 'user_id' in response;
		} catch(e) {}
		
		return false;
	}
};