import axios from 'axios';

axios.defaults.baseURL = process.env.API_URL;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
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
	
	login(username, password) {
		var params = {
			grant_type: 'password',
			username,
			password
		};
		
		return this.httpPost('/login', params)
			.then(response => {
				var data = response.data;
				setAccessToken(data.access_token);
			})
			.catch(error => console.log(error));
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
		
		return;
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
	}
};