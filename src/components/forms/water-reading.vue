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
			    <input id="account-name" type="text" v-model="accountName" class="form-control" readonly="">
			</div>
			<div class="form-group">
		      	<label for="meter-no">Meter No.</label>
			    <input id="meter-no" type="text" v-model="meterNo" class="form-control" readonly="">
			</div>
			<div class="form-group">
				<label for="due-date">Due date</label>
				<flat-pickr 
					v-model="dueDate" 
					id="due-date" 
					class="form-control" 
					placeholder="select date"></flat-pickr>
			</div>
			<div class="form-group">
				<label for="current-reading">Current reading</label>
				<input type="text" id="current-reading" class="form-control" v-model="currentReading" placeholder="ex. 20.10">
			</div>
			<div class="form-group">
				<label for="read-by">Read by</label>
				<input type="text" v-model="readBy" class="form-control uppercase" placeholder="ex.TEO">
			</div>
	      </div>
	      <div class="modal-footer">
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
	
	export default {
		props: ['bus'],
		mixins: [
			require('@mixins/response').default	
		],
		data() {
			return {
				dueDate: null,
				account: null,
				accountName: null,
				meterNo: null,
				currentReading: null,
				readBy: null
			}
		},
		components: {
			flatPickr
		},
		methods: {
			async save() {
				let error = '';
				
				try {
					if(!this.account) {
						toastr.error('invalid account');
						return;
					}
					
					if(this.dueDate == null || this.dueDate == '') {
						toastr.error('due date is required.');
						return;
					}

					if(this.meterNo == null || this.meterNo == '') {
						toastr.error('meter number is required.');
						return;
					}

					if(this.currentReading == null || this.currentReading == '') {
						toastr.error('current reading is required.');
						return;
					}

					let n = Number.parseFloat(this.currentReading);
					if(Number.isNaN(n)) {
						toastr.error('invalid current reading');
						return;
					} 
					
					let response = await api.httpPost('/water-readings', {
						account_id: this.account.account_id,
						meter_no: this.meterNo,
						curr_read: this.currentReading,
						due_date: this.dueDate,
						read_by: this.readBy
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
			
			vm.bus.$on('newReading', data => {
				this.account = data.account;
				this.accountName = `${data.account.account_no} ${data.account.account_name}`;
				this.meterNo = data.meter_no.toUpperCase();

				$(function(){
					$('.modal').modal('show');
					
					$('.modal').on('hidden.bs.modal', function(e){
						vm.bus.$emit('onCloseModal');
					});
				});
			});
		},
		
		beforeDestroy() {
			this.bus.$off('newReading');
		}
	}
</script>