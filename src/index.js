import Vue from 'vue';
import App from './components/App';
import router from '@/routes/index';
import api from '@/src/services/api';

router.beforeEach(async (to, from, next) => {
	var isAuthenticated = false;
	
	try {
		var response = await api.authUser();
		isAuthenticated = 'user_id' in response;
	} catch(e) {
		isAuthenticated = false;
	}
	
	if (to.name !== 'Login' && !isAuthenticated) {
		next({ name: 'Login' });
		return;
	}
	
  	next();
});

new Vue({
	el: '#app',
	render: h => h(App),
	router
});