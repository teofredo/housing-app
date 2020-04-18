import Vue from 'vue';
import App from './components/App';
import router from '@/routes/index';

import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'

new Vue({
	el: '#app',
	render: h => h(App),
	router
});