<template>
	<div class="modal fade" tabindex="-1" role="dialog">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <h4 class="modal-title">Add/Edit</h4>
	      </div>
	      <div class="modal-body">
	      	<div class="form-group">
	      		<label for="block">Select Block</label>
	      		<select id="block" class="form-control" v-model="block">
			      <option v-for="item in blocks" :value="item.block_id">{{ item.name }}</option>
			    </select>
	      	</div>
	        <div class="form-group">
		      	<label for="name">Lot name</label>
			    <input id="name" type="text" v-model="name" class="form-control uppercase" placeholder="ex. LOT 1">
			  </div>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
	        <button type="button" class="btn btn-primary" @click="save">Save</button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
</template>

<script>
	import api from '@services/api';
	import toastr from 'toastr';
	
	export default {
		props: ['bus'],
		data() {
			return {
				name: null,
				block: null,
				blocks: []
			}
		},
		methods: {			
			async save() {
				let error = '';
				
				try {
					if(this.block == null || this.block == '') {
						toastr.error('please select block.');
						return;
					}
					
					if(this.name == null || this.name == '') {
						toastr.error('Lot name is required.');
						return;
					}
					
					let response = await api.httpPost('/lots', {
						block_id: this.block,
						name: this.name
					});
					
					let data = response.data.data || {};
					if(data) {
						toastr.success('success');
						$('.modal').modal('hide');
						
						let response = await api.httpGet(`/lots/${data.lot_id}?_includes=block`);	
						if(response.data.error) {
							toastr.error('failed to update lot list');
							return;
						}
						
						this.bus.$emit('updateList', {
							list: 'lot',
							action: 'add',
							data: response.data.data
						});
						
						return;
					}
					
					let errors = JSON.parse(response.data.error.message);
					error = '';
					Object.keys(errors).forEach(key => {
						error += `${errors[key].toString()}<br/>`;
					});
					
				} catch(e) {
					error = 'error';
				}
				
				toastr.error(error);
			},
			
			async getBlocks() {
				try {
					let response = await api.httpGet('/blocks');
					this.blocks = response.data.data;
				} catch(e) {
					toastr.error('failed to load blocks');
				}
			}
		},
		mounted() {
			const vm = this;
			
			vm.getBlocks();
			
			vm.bus.$on('newLot', () => {
				$(function(){
					$('.modal').modal('show');
					
					$('.modal').on('hidden.bs.modal', function(e){
						vm.bus.$emit('onCloseModal', 'lot');
					});
				});
			});
		},
		
		beforeDestroy() {
			this.bus.$off('newLot');
		}
	}
</script>

<style>
	.uppercase {
	    text-transform: uppercase;
	}
	.uppercase:placeholder-shown {
	    text-transform: none;
	}
</style>