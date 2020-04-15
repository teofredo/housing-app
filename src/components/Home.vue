<template>
	<h3>{{ appTitle }}</h3>
</template>

<script>
	import Vue from 'vue';
	
	export default {
		data() {
			return {
				appTitle: 'Welcome!'
			}
		},
		
		mounted() {
			this.appTitle = process.env.APP_TITLE
		}
	}
</script>