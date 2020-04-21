<template>
  <div class="modal fade" tabindex="-1" role="dialog">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	      	<h4 class="modal-title">Add/Edit</h4>
	      </div>
	      <div class="modal-body">
	        <div class="form-group">
		      	<label for="name">Plan</label>
			    <input id="name" type="text" v-model="name" class="form-control uppercase" placeholder="ex. Plan 1299">
			</div>
			<div class="form-group">
		      	<label for="monthly">Monthly price</label>
			    <input id="monthly" type="text" v-model="monthly" class="form-control" placeholder="ex. 1299">
			</div>
			<div class="form-group">
		      	<label for="mbps">Speed (mbps)</label>
			    <input id="mbps" type="number" v-model="mbps" class="form-control" placeholder="ex. 10">
			</div>
			<div class="form-group">
		      	<label for="description">Description</label>
			    <textarea id="description" class="form-control" v-model="description" placeholder="ex. Unlimited plan for as low as PHP 1,299 with speeds ranging from 3 MBps to 15 Mbps."></textarea>
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
				monthly: null,
				mbps: null,
				description: null
			}
		},
		computed: {
			
		},
		methods: {
			async save() {
				let error = '';
				
				try {
					if(this.name == null || this.name == '') {
						toastr.error('plan is required.');
						return;
					}
					
					if(this.monthly == null || this.monthly == '') {
						toastr.error('monthly price is required.');
						return;
					}
					
					if(this.mbps == null || this.mbps == '') {
						toastr.error('mbps is required.');
						return;
					}
					
					let response = await api.httpPost('/internet-plans', {
						name: this.name,
						monthly: this.monthly,
						mbps: this.mbps,
						description: this.description
					});
					
					if(response.data.data) {
						toastr.success('success');
						$('.modal').modal('hide');
						
						this.bus.$emit('updateList', {
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
			}
		},
		mounted() {
			const vm = this;
			
			vm.bus.$on('newPlan', () => {				
				$(function(){
					$('.modal').modal('show');
					
					$('.modal').on('hidden.bs.modal', function(e){
						vm.bus.$emit('onCloseModal', 'block');
					});
				});
			});
		},
		
		beforeDestroy() {
			this.bus.$off('newPlan');
		}
	}
</script>