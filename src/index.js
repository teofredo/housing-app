import Vue from 'vue';
import App from './components/App';
import router from '@/routes/index';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// import 'flexboxgrid/css/flexboxgrid.min.css';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.css';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.js';

import 'toastr/build/toastr.min.css';
import 'toastr/build/toastr.min.js';

new Vue({
	el: '#app',
	render: h => h(App),
	router
});