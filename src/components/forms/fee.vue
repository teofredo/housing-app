<template>
  <div class="modal fade" tabindex="-1" role="dialog">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	      	<h4 class="modal-title">Add/Edit</h4>
	      </div>
	      <div class="modal-body">
	        <div class="form-group">
		      	<label for="name">Fee</label>
			    <input id="name" type="text" v-model="name" class="form-control" placeholder="ex. Association dues">
			</div>
			<div class="form-group">
		      	<label for="amount">Amount</label>
			    <input id="amount" type="text" v-model="amount" class="form-control" placeholder="0.00">
			</div>
			<div class="form-group">
				<label for="description">Description</label>
				<textarea class="form-control" v-model="description" :placeholder="sampleDescription"></textarea>
			</div>
			<div class="checkbox">
		      	<label>
			    	<input id="otherFee" type="checkbox" v-model="otherFee">
			    	other fee
			    </label>
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
				name: null,
				amount: null,
				otherFee: false,
				description: null,
				sampleDescription: 'Ex. Association dues are currently computed based on prevailing rates & service charges. This inlcudes for 24hrs security , CCTV, Street Lights, Garbage collection, Villas street cleaner & garbage collection personnel.'
			}
		},
		computed: {
			
		},
		methods: {
			async save() {
				let error = '';
				
				try {
					if(this.name == null || this.name == '') {
						toastr.error('fee name is required.');
						return;
					}
					
					if(this.amount == null || this.amount == '') {
						toastr.error('amount is required.');
						return;
					}
					
					let response = await api.httpPost('/fees', {
						name: this.name,
						fee: this.amount,
						other_fee: this.otherFee,
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
					
					error = this.parseError(response);
					
				} catch(e) {
					error = 'error';
				}
				
				toastr.error(error);
			}
		},
		mounted() {
			const vm = this;
			
			vm.bus.$on('newFee', () => {				
				$(function(){
					$('.modal').modal('show');
					
					$('.modal').on('hidden.bs.modal', function(e){
						vm.bus.$emit('onCloseModal');
					});
				});
			});
		},
		
		beforeDestroy() {
			this.bus.$off('newFee');
		}
	}
</script>