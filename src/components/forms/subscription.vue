<template>
  <div class="modal fade" tabindex="-1" role="dialog">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	      	<h4 class="modal-title">Add/Edit</h4>
	      </div>
	      <div class="modal-body">
	      	<div class="form-group">
				<label for="plan">Select Plan</label>
				<select id="plan" class="form-control" v-model="plan" required="">
					<option value="" selected="" disabled=""></option>
					<option v-for="item in plans" :value="item.plan_id">{{ item.name }}</option>
				</select>
			</div>
	        <div class="form-group">
	        	<div class="dropdown">
	        		<label for="input-dropdown">Select Account</label>
	        		<AccountAutocomplete :bus="bus" />
				</div>
			</div>
			<div class="form-group">
				<label for="start-date">Start date</label>
				<flat-pickr 
					v-model="startDate" 
					id="start-date" 
					class="form-control" 
					placeholder="select date"
					@on-change="getEndDate"></flat-pickr>
			</div>
			<div class="form-group">
				<label for="end-date">End date</label>
				<flat-pickr 
					v-model="endDate" 
					id="end-date" 
					class="form-control" 
					placeholder="select date"></flat-pickr>
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
	import flatPickr from 'vue-flatpickr-component';
  	import 'flatpickr/dist/flatpickr.css';
  	import moment from 'moment';
  	import AccountAutocomplete from '@components/common/account-autocomplete';
	
	export default {
		props: ['bus'],
		mixins: [
			require('@mixins/response').default	
		],
		components: {
			flatPickr,
			AccountAutocomplete
		},
		data() {
			return {
				selectedAccount: null,
				plans: [],
				plan: null,
				startDate: null,
				endDate: null
			}
		},
		methods: {
			async save() {
				let error = '';
				
				try {
					if(this.plan == null || this.plan == '') {
						toastr.error('please select plan');
						return;
					}
					
					if(this.selectedAccount == null || this.selectedAccount == '') {
						toastr.error('please select account');
						return;
					}
					
					if(this.startDate == null || this.startDate == '') {
						toastr.error('start date is required.');
						return;
					}
					
					if(this.endDate == null || this.endDate == '') {
						toastr.error('end date is required.');
						return;
					}
					
					let response = await api.httpPost('/internet-subscriptions', {
						account_id: this.selectedAccount.account_id,
						plan_id: this.plan,
						start_date: this.startDate,
						end_date: this.endDate
					});
										
					if(response.data.data) {
						let data = response.data.data;
						let subscriptionId = data.subscription_id;
						
						toastr.success('success');
						$('.modal').modal('hide');
						
						try {
							response = await api.httpGet(`/internet-subscriptions/${subscriptionId}?_includes=account,plan`);
							
							this.bus.$emit('updateList', {
								action: 'add',
								data: response.data.data
							});
						} catch(e) {}
						
						return;
					}
					
					error = this.parseError(response);
					
				} catch(e) {
					error = 'error';
				}
				
				toastr.error(error);
			},
			
			async getPlans() {
				try {
					let response = await api.httpGet('/internet-plans');
					this.plans = response.data.data;	
				} catch(e) {
					toastr.error('failed to load internet plans');
				}
			},
			
			getEndDate(dateObj, dateString) {
				let result = moment(dateString, 'YYYY-MM-DD')
					.add(1, 'years')
					.format('YYYY-MM-DD');
					
				this.endDate = result;
			}
		},
		mounted() {
			const vm = this;

			vm.getPlans();
			
			vm.bus.$on('newSubscription', () => {				
				$(function(){
					$('.modal').modal('show');
				});
			});

			vm.bus.$on('onSelectAccount', account => {
				this.selectedAccount = account;
			});
		},
		
		beforeDestroy() {
			this.bus.$off('newSubscription');
			this.bus.$off('onSelectAccount');
		}
	}
</script>