<template>
	<a href="#/admin" @click="openFancy">open fancy</a>
</template>

<script>
	export default {
		methods: {
			openFancy() {
				$(function(){
					$.fancybox.open('<div class="message"><h2>Hello!</h2><p>You are awesome!</p></div>');	
				});
			}
		}
	}
</script>