<template>
  <div class="modal fade" tabindex="-1" role="dialog">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	      	<h4 class="modal-title">Add/Edit</h4>
	      </div>
	      <div class="modal-body">
	        <div class="form-group">
		      	<label for="account-name">Account</label>
			    <input id="account-name" type="text" v-model="accountName" class="form-control uppercase" readonly="">
			</div>
			<div class="form-group">
				<label for="due-date">Due date</label>
				<input id="due-date" type="text" v-model="dueDate" class="form-control" readonly="">
			</div>
			<div class="form-group">
		      	<label for="description">Description</label>
			    <textarea id="description" v-model="description" class="form-control" placeholder="please specify"></textarea>
			</div>
			<div class="form-group">
		      	<label for="amount">Amount</label>
			    <input id="amount" type="text" v-model="amount" class="form-control">
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
	import _ from 'lodash';
	
	export default {
		props: ['bus'],
		mixins: [
			require('@mixins/response').default	
		],
		data() {
			return {
				account: null,
				accountName: null,
				amount: null,
				description: null,
				dueDate: null
			}
		},
		computed: {
			
		},
		methods: {
			async save() {
				let error = '';
				
				try {
					if(this.account == null || this.account == '') {
						toastr.error('account is required.');
						return;
					}

					if(this.amount == null || this.amount == '') {
						toastr.error('amount is required');
						return;
					}

					if(this.description == null || this.description == '') {
						toastr.error('description is required');
						return;
					}
					
					let response = await api.httpPost('/adjustments', {
						account_id: this.account.account_id,
						description: this.description,
						amount: this.amount,
						due_date: this.dueDate
					});
					
					if(response.data.data) {
						toastr.success('success');
						$('.modal').modal('hide');

						try {
							let id = response.data.data.id;
							response = await api.httpGet(`/adjustments/${id}`);
						
							this.bus.$emit('updateList', {
								action: 'add',
								data: response.data.data
							});
						} catch(e) {
							toastr.error('failed to update list');
						}
						
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
			
			vm.bus.$on('newAdjustment', data => {
console.log(data);

				this.account = data.account;
				this.accountName = `${data.account.account_no} ${data.account.account_name}`;
				this.dueDate = data.due_date;

				$(function(){
					$('.modal').modal('show');
					
					$('.modal').on('hidden.bs.modal', function(e){
						vm.bus.$emit('onCloseModal');
					});
				});
			});
		},
		
		beforeDestroy() {
			this.bus.$off('newAdjustment');
		}
	}
</script>