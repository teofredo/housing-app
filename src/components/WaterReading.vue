<template>
	<div class="">
		<div class="row">
			<form class="form-inline" @submit="find($event)">
				<div class="form-group">
					<label for="meter-no">Meter No.</label>
					<input type="text" 
						v-model="meterNo" 
						class="form-control uppercase" 
						required=""
						placeholder="ex. 0YX1YBG1">
				</div>
				<button type="submit" class="btn btn-primary">Find</button>
			</form>
		</div>
		<div class="row" v-if="householder" style="margin-top:5px;">
			Owner/Tenant Account: {{ account.account_no }} {{ account.account_name }}
			<br/>

			<table>
				<thead>
					<th>due date</th>
					<th>prev</th>
					<th>current</th>
					<th>consumption</th>
					<th>read date</th>
					<th>read by</th>
					<th>Action</th>
				</thead>
				<tr>
					<td><td/>
					<td><td/>
					<td><td/>
					<td><td/>
					<td><td/>
					<td><td/>	
				</tr>
			</table>
		</div>
		<div class="row" v-if="invalidMeterNo" style="font-style: italic;color: red;">
			{{ invalidMeterNo }}
		</div>
	</div>
</template>

<script>
import api from '@services/api';
import toastr from 'toastr';

export default {
	data() {
		return {
			meterNo: null,
			householder: null,
			invalidMeterNo: null,
			account: null
		}
	},

	mixins: [
		require('@mixins/response').default
	],

	methods: {
		async find(event) {
			event.preventDefault();

			let error = '';
			this.invalidMeterNo = null;

			try {
				let response = await api.httpGet('/householders', {
					params: {
						'_includes': 'account',
						'_find': `water_meter_no:${this.meterNo.toUpperCase()}`
					}
				});
				
				if(response.data.data) {
					this.householder = response.data.data;
					this.account = this.householder.account.data;
					return;
				}

				error = this.parseError(response);
				this.invalidMeterNo = '** No account associated with this meter no. please try again.';

			} catch(error) {
				error = 'failed to fetch account info';
			}

			toastr.error(error);
		},

		async getReadings() {
			try {
				let response = await api.httpGet()
			} catch(e) {}
		}
	}
}
</script>