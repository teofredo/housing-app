<template>
  <!-- Modal Structure -->
  <div class="modal">
    <div class="row">
      <h5>Add/ Edit</h5>
      <!-- <p>A bunch of text</p> -->
      
      <div class="form-group">
      	<label for="name">{{ field }}</label>
	    <input id="name" type="text" v-model="name" class="form-control">
	  </div>
      	
      	<button @click="save">Save</button>
      	
  		<button data-fancybox-close>Close</button>
    </div>
  </div>
</template>

<script>
	import api from '@services/api';
	import toastr from 'toastr';
		
	let modalInstance = null;
	
	export default {
		props: ['bus'],
		data() {
			return {
				parent: '#',
				endpoint: '',
				field: '',
				name: ''
			}
		},
		methods: {
			async save() {
				let error = '';
				
				try {
					if(this.name == null || this.name == '') {
						toastr.error(`${this.field} is required.`);
						return;
					}
					
					let response = await api.httpPost(this.endpoint, {
						name: this.name
					});
					
					if(response.data.data) {
						toastr.success('success');
						$.fancybox.close();
						return;
					}
					
					let errors = JSON.parse(response.data.error.message);
					error = '';
					Object.keys(errors).forEach(key => {
						error += `${errors[key].toString()};<br/>`;
					});
					
				} catch(e) {
					error = 'error';
				}
				
				toastr(error);
			}
		},
		mounted() {
			this.bus.$on('newBlock', data => {
				console.log(data);
				
				this.parent = data.parent;
				this.endpoint = data.endpoint;
				this.field = data.field;
				
				$(function(){
					let elem = $('.modal');
					$.fancybox.open(elem, {
						// modal: true
					});
				});
			});
		},
		
		beforeDestroy() {
			this.bus.$off('newBlock');
		}
	}
</script>