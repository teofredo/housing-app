<template>
	<div class="row">
		<div class="col-sm-12">
    		<label for="input-dropdown">Select Account</label>
            <AccountAutocomplete :bus="bus" />

            <table class="table">
                <tr>
                    <th>Account No</th>
                    <th>Account Name</th>
                    <th>Fee Name</th>
                    <th>Amount</th>
                    <th>Due date</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </table>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';
import AccountAutocomplete from '@components/common/account-autocomplete';
import api from '@services/api';

export default {
	data() {
		return {
			bus: new Vue(),
			fees: [],
            account: null,
            otherCharges: []
		}
	},
	components: {
		AccountAutocomplete
	},
	methods: {
        async loadAccountCharges() {
            try {
                let response = await api.httpGet('/other-charges');
                this.otherCharges = response.data.data;
            } catch(e) {}
        }
	},
	mounted() {
		this.bus.$on('onSelectAccount', account => {
			console.log(account);
            this.account = account;
            this.loadAccountCharges();
		});
	},
	beforeDestroy() {
		this.bus.$off('onSelectAccount');
	}
}
</script>