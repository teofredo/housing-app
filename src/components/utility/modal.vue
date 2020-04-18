<template>
  <!-- Modal Structure -->
  <div class="modal">
    <div class="modal-content">
      <h5>Create</h5>
      <!-- <p>A bunch of text</p> -->
      
      <div class="input-field">
	    <input id="name" type="text" class="validate" v-model="name">
	    <label for="name">{{ field }}</label>
	  </div>
            
    </div>
    <div class="modal-footer">
      <a v-bind:href="parent"
      	@click="save" 
      	class="waves-green btn-flat">Save</a>
      	
      	<a v-bind:href="parent"
      		class="modal-close waves-effect btn-flat">Close</a>
    </div>
  </div>
</template>

<script>
	import api from '@services/api';
	
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
			openModal() {
				let modal = $('.modal')[0];
				
				modalInstance = M.Modal.init(modal, {
					dismissible: false
				});
				
				modalInstance.open();
			},
			
			async save() {
				let error = '';
				
				try {
					if(this.name == null || this.name == '') {
						M.toast({html: `${this.field} is required.`});
						return;
					}
					
					let response = await api.httpPost(this.endpoint, {
						name: this.name
					});
					
					if(response.data.data) {
						M.toast({html: 'success'});	
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
				
				M.toast({html: error});
			}
		},
		mounted() {
			this.bus.$on('newBlock', data => {
				let vm = this;
				console.log(data);
				
				this.parent = data.parent;
				this.endpoint = data.endpoint;
				this.field = data.field;
				
				$(function(){
					// $('.modal').modal();
					vm.openModal();
				});
			});
			
			this.bus.$on('newLot', data => {
				let vm = this;
				console.log(data);
				
				this.parent = data.parent;
				this.endpoint = data.endpoint;
				this.field = data.field;
				
				$(function(){
					// $('.modal').modal();
					vm.openModal();
				});
			});
		}
	}
</script>