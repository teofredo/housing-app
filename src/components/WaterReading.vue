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
		<div class="row" v-if="householder">
			{{ householder.account.data.account_name }}
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
			householder: null
		}
	},

	methods: {
		async find(event) {
			event.preventDefault();

			try {
				let response = await api.httpGet('/householders', {
					params: {
						'_includes': 'account',
						'_find': `water_meter_no=${this.meterNo}`
					}
				});
				
				if(response.data.data) {
					this.householder = response.data.data;
					return;
				}

			} catch(e) {}

			toastr.error('failed to fetch account info');
		}
	}
}
</script>