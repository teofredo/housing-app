<template>
	<div class="">
		<div class="row">
			<div class="col-sm-6">
				<AccountAutocomplete :bus="bus" placeholder="select account"/>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';
import AccountAutocomplete from '@components/common/account-autocomplete';
import api from '@services/api';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import toastr from 'toastr';
import currency from '@filters/currency';

export default {
	data() {
		return {
			bus: new Vue(),
			account: null,
			refNo: null,
			amountDue: null,
			amountReceived: null,
			dueDate: null
		}
	},

	components: {
		AccountAutocomplete,
		flatPickr
	}
}
</script>