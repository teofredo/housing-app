<template>
	<h1>month dues generator</h1>
</template>

<script>
import io from 'socket.io-client';

export default {
	data() {
		return {
			socket: null
		}
	},

	mounted() {
		this.socket = io(process.env.SOCKET_SERVER, {
			query: {
				access_token: localStorage.getItem('access_token')
			}
		});

		this.socket.on('connect', () => {
			socket.emit('get.process.by.id', {process_id: 1});

			socket.on('is.authenticated', response => {
				console.log(response);
			});
		});

		this.socket.on('error', error => {
			console.log(error);
		});
	}
}

</script>