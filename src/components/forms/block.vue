<template>
  <div class="modal fade" tabindex="-1" role="dialog">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	      	<h4 class="modal-title">Add/Edit</h4>
	      </div>
	      <div class="modal-body">
	        <div class="form-group">
		      	<label for="name">Block name</label>
			    <input id="name" type="text" v-model="name" class="form-control uppercase" placeholder="ex. BLK 1">
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
		mixins: [
			require('@mixins/response').default	
		],
		data() {
			return {
				name: null
			}
		},
		computed: {
			
		},
		methods: {
			async save() {
				let error = '';
				
				try {
					if(this.name == null || this.name == '') {
						toastr.error('block name is required.');
						return;
					}
					
					let response = await api.httpPost('/blocks', {
						name: this.name
					});
					
					if(response.data.data) {
						toastr.success('success');
						$('.modal').modal('hide');
						
						this.bus.$emit('updateList', {
							list: 'block',
							action: 'add',
							data: response.data.data
						});
						
						return;
					}
					
					error = this.parseError(response);
					
				} catch(e) {
					error = 'error';
				}
				
				toastr.error(error);
			}
		},
		mounted() {
			const vm = this;
			
			vm.bus.$on('newBlock', () => {				
				$(function(){
					$('.modal').modal('show');
					
					$('.modal').on('hidden.bs.modal', function(e){
						vm.bus.$emit('onCloseModal', 'block');
					});
				});
			});
		},
		
		beforeDestroy() {
			this.bus.$off('newBlock');
		}
	}
</script>