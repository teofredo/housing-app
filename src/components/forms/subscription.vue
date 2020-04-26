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
	        		<label for="input-dropdown">Account Name</label>
				    <input id="input-dropdown"
				    	type="text" 
				    	v-model="accountName" 
				    	class="dropdown-toggle form-control uppercase" 
				    	placeholder="search" 
				    	data-toggle="dropdown"
				    	@keyup.arrow-down="focusDropdown"
				    	required=""
				    	autocomplete="off">
				    	
				    <ul class="dropdown-menu" 
				    	aria-labelledby="input-dropdown"
				    	style="width: 100%;">
				    	<li v-for="item, index in filteredAccounts">
				    		<a href="#admin/subscription" 
				    			@click="selectAccount(item)"
				    			:data-index="index"
				    			:data-id="item.account_id">{{ item.account_no }} {{ item.account_name }}</a>
				    	</li>
				    </ul>
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
  	import response from '@mixins/response';
	
	export default {
		props: ['bus'],
		mixins: [response],
		components: {
			flatPickr
		},
		data() {
			return {
				accountName: null,
				accounts: [],
				selectedAccount: null,
				plans: [],
				plan: null,
				startDate: null,
				endDate: null
			}
		},
		computed: {
			filteredAccounts() {
				let vm = this;
				
				if(!vm.accountName) {
					return vm.accounts;
				}
				
				return vm.accounts.filter(function(account){
					return account.account_name.toLowerCase().indexOf(vm.accountName.toLowerCase()) > -1;
				});
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
			
			async getAccounts(){
				try {
					// this.isLoading = true;
					let response = await api.httpGet('/accounts');
					this.accounts = response.data.data;	
				} catch(e) {
					toastr.error('failed to load accounts');
				} finally {
					// this.isLoading = false;
				}
			},
			
			async getPlans() {
				try {
					let response = await api.httpGet('/internet-plans');
					this.plans = response.data.data;	
				} catch(e) {
					toastr.error('failed to load internet plans');
				}
			},
			
			selectAccount(account) {
				this.selectedAccount = account;
				this.accountName = account.account_name;
			},
			
			focusDropdown(event) {
				$(function(){
					$('.dropdown-menu a')[0].focus();
				});
				
				this.$nextTick();
			},
			
			getEndDate(dateObj, dateString) {
				let result = moment(dateString, 'YYYY-MM-DD').add('years', 1).format('YYYY-MM-DD');
				this.endDate = result;
			}
		},
		mounted() {
			const vm = this;
			
			vm.getAccounts();
			vm.getPlans();
			
			vm.bus.$on('newSubscription', () => {				
				$(function(){
					$('.modal').modal('show');
					
					$('.modal').on('hidden.bs.modal', function(e){
						localStorage.removeItem('data-oldIndex');
						$('#input-dropdown').off('keyup');
						$('.dropdown-menu').off('keyup');
						vm.bus.$emit('onCloseModal', 'block');
					});
				});
			});
			
			$(function(){
				$('.dropdown-menu').on('keyup', function(e){
					let keyCode = e.which || e.keycode;
					
					let target = $(e.target)[0];
					let index = target.dataset.index;
					let oldIndex = localStorage.getItem('data-oldIndex') || null;
					
					if(oldIndex == 0 && keyCode == 38) {
						$('#input-dropdown').focus();
					}
					
					localStorage.setItem('data-oldIndex', index);
				});
				
				$('#input-dropdown').on('keyup', function(e){
					let dropdown = $('.dropdown-toggle');
					
					if($('.dropdown .dropdown-menu').is(':hidden')) {
						dropdown.dropdown('toggle');	
					}
				});
			});
		},
		
		beforeDestroy() {
			this.bus.$off('newSubscription');
		}
	}
</script>