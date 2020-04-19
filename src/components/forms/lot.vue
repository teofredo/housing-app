<template>
  <!-- Modal Structure -->
  <div class="modal">
    <div class="modal-content">
      <h5>Add/ Edit</h5>
      <!-- <p>A bunch of text</p> -->
      
      <div class="row">
	      <div class="col s3">
		    <select>
		      <option value="" disabled selected>Choose your option</option>
		      <option v-for="item in blocks">{{ item.name }}</option>
		    </select>
		    <label>Select block</label>
		  </div>
	  </div>
	  <div class="row">
	      <div class="input-field col s3">
		    <input id="name" type="text" class="validate" v-model="name">
		    <label for="name">{{ field }}</label>
		  </div>
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
	let selectInstance = null;
	
	export default {
		props: ['bus'],
		data() {
			return {
				parent: '#',
				endpoint: '',
				field: '',
				name: '',
				blocks: []
			}
		},
		methods: {			
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
			},
			
			async getBlocks() {
				try {
					let response = await api.httpGet('/blocks');
					this.blocks = response.data.data;
				} catch(e) {
					M.toast({html: 'failed to load blocks'});
				}
			},
			
			init() {
				let bus = this.bus;
				
				$(function(){
					//select
					let select = $('select')[0];
					selectInstance = M.FormSelect.init(select);
					
					//modal
					let modal = $('.modal')[0];
					modalInstance = M.Modal.init(modal, {
						dismissible: false,
						onCloseEnd() {
							bus.$emit('onCloseModal', 'lot');
						}
					});
				});
			}
		},
		mounted() {
			this.getBlocks();
			
			this.bus.$on('newLot', data => {
				this.init();
				
				this.parent = data.parent;
				this.endpoint = data.endpoint;
				this.field = data.field;
				
				$(function(){
					modalInstance.open();
				});
			});
		},
		
		beforeDestroy() {
			this.bus.$off('newLot');
		}
	}
</script>