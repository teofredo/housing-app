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

		<div v-if="isLoading && !householder">Loading...</div>

		<div class="row" v-if="householder" style="margin-top:5px;">
			Owner/Tenant Account: {{ account.account_no }} {{ account.account_name }} 
			<a :href="thisRoute" @click="newReading">Add Reading</a>
			<br/>

			<table class="table">
				<thead>
					<th>due date</th>
					<th>prev</th>
					<th>current</th>
					<th>consumption</th>
					<th>rate applied</th>
					<th>minimum</th>
					<th>amount due</th>
					<th>read date</th>
					<th>read by</th>
					<th>Action</th>
				</thead>
				<tr v-for="r in readings">
					<td>{{ r.due_date }}</td>
					<td>{{ r.prev_read }}</td>
					<td>{{ r.curr_read }}</td>
					<td>{{ r.curr_read - r.prev_read }}</td>
					<td>{{ r.rate_applied }}</td>
					<td>{{ r.is_minimum ? 'yes' : 'no' }}</td>
					<td>{{ getAmountDue(r) | currency}}</td>
					<td>{{ r.curr_read_date }}</td>
					<td>{{ r.read_by }}</td>
					<td>Edit, Delete</td>
				</tr>
			</table>
		</div>
		<div class="row" v-if="invalidMeterNo" style="font-style: italic;color: red;">
			{{ invalidMeterNo }}
		</div>

		<WaterReading :bus="bus" v-if="waterReadingFrmEnabled"/>
	</div>
</template>

<script>
import Vue from 'vue';
import api from '@services/api';
import toastr from 'toastr';
import WaterReading from '@components/forms/water-reading';
import currency from '@filters/currency';

export default {
	data() {
		return {
			bus: new Vue(),
			meterNo: null,
			householder: null,
			invalidMeterNo: null,
			account: null,
			readings: null,
			waterReadingFrmEnabled: false,
			thisRoute: `#${this.$router.currentRoute.path}`,
			isLoading: false
		}
	},

	mixins: [
		require('@mixins/response').default
	],

	components: {
		WaterReading
	},

	methods: {
		async find(event) {
			event.preventDefault();

			this.isLoading = true;
			this.householder = null;

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
					this.getReadings();
					return;
				}

				error = this.parseError(response);
				this.invalidMeterNo = '** No account associated with this meter no. please try again.';

			} catch(error) {
				error = 'failed to fetch account info';
			} finally {
				this.isLoading = false;
			}

			toastr.error(error);
		},

		async getReadings() {
			let error = '';

			try {
				let response = await api.httpGet('/water-readings', {
					params: {
						'_where': `account_id:${this.account.account_id}`,
						'_orderby': 'due_date:desc',
						'_limit': 5
					}
				});
				this.readings = response.data.data;
				return;

				error = 'failed to load readings';

			} catch(e) {
				error = e;
			}

			toastr.error(error);
		},

		async newReading() {
			this.waterReadingFrmEnabled = true;
			await this.$nextTick();
			this.bus.$emit('newReading', {
				account: this.account,
				meter_no: this.meterNo
			});
		},

		updateList(data) {
			if(data.action == 'add') {
				this.readings.splice(0, 0, data.data);
			} else if(data.action == 'edit') {
				//
			}
		},

		getAmountDue(r) {
			if(r.is_minimum) {
				return r.rate_applied;
			}

			let consumption = r.curr_read - r.prev_read;
			return (consumption * r.rate_applied).toFixed(2);
		}
	},

	mounted() {
		this.bus.$on('onCloseModal', modal => {
			this.waterReadingFrmEnabled = false;
		});
		
		this.bus.$on('updateList', data => {
			this.updateList(data);
		});
	},

	beforeDestroy() {
		this.bus.$off('updateList');
	}
}
</script>