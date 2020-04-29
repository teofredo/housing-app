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
				<input type="text" v-model="dueDate" class="form-control" readonly="">
			</div>
			<div class="form-group">
		      	<label for="select-fee">Select fee</label>
			    <select class="form-control" v-model="fee" @change="onChangeFee">
			    	<option value="" selected="" disabled=""></option>
			    	<option v-for="item in fees" :value="item.fee_id">{{ item.name }}</option>
			    </select>
			</div>
			<div class="form-group">
		      	<label for="fee-amount">Amount</label>
			    <input id="fee-amount" type="text" v-model="amount" class="form-control">
			</div>
			<div class="form-group" v-if="feeCode == 'other'">
		      	<label for="description">Description</label>
			    <textarea id="description" v-model="description" class="form-control" placeholder="please specify"></textarea>
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
				fee: null,
				amount: null,
				description: null,
				dueDate: null,
				fees: [],
				feeCode: null
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

					if(this.fee == null || this.fee == '') {
						toastr.error('please select fee');
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
					
					let response = await api.httpPost('/other-charges', {
						account_id: this.account.account_id,
						fee_id: this.fee,
						description: this.description,
						amount: this.amount,
						due_date: this.dueDate
					});
					
					if(response.data.data) {
						toastr.success('success');
						$('.modal').modal('hide');

						try {
							let id = response.data.data.id;
							response = await api.httpGet(`/other-charges/${id}?_includes=fee`);
						
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
			},

			async getFees() {
				try {
					let response = await api.httpGet('/fees');
					this.fees = response.data.data;
				} catch(e) {
					toastr.error('failed to load fees');
				}
			},

			onChangeFee() {
				let fee = _.find(this.fees, {fee_id: this.fee});
				if(!fee) return;
				this.feeCode = fee.code;
				this.amount = fee.fee;
				if(fee.code != 'other') {
					this.description = fee.name;
				} else {
					this.description = null;
				}
			}
		},
		mounted() {
			const vm = this;

			this.getFees();
			
			vm.bus.$on('newCharge', data => {
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
			this.bus.$off('newCharge');
		}
	}
</script>