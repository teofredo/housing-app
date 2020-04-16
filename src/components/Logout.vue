<template>
	<h1>{{ message }}</h1>
</template>

<script>
	import api from '@services/api';
	
	export default {
		data() {
			return {
				message: ''	
			}
		},
		
		mounted() {
			this.logout();
		},
		
		methods: {
			async logout() {
				var response = await api.logout();
				if(!response) {
					this.message = 'logout failed';
					console.log('logout failed');
					return;
				}
				
				this.$router.push({name: 'Login'});	
			}
		}
	}
</script>