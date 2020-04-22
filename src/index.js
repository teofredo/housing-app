// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import 'toastr/build/toastr.min.css';
import 'toastr/build/toastr.min.js';

import '@assets/styles/app.scss';

import Vue from 'vue';
import App from './components/App';
import router from '@/routes/index';

new Vue({
	el: '#app',
	render: h => h(App),
	router
});