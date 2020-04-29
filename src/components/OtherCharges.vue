<template>
    <div>
        <div class="row">
            <form @submit="loadAccountCharges($event)">
                <div class="col-sm-6">
                    <AccountAutocomplete :bus="bus" placeholder="select account"/>
                </div>
                <div class="form-inline">
                    <div class="form-group">
                        <flat-pickr
                            id="due-date"
                            v-model="dueDate"
                            class="form-control"
                            placeholder="select due date"></flat-pickr>

                        <button type="submit" class="btn btn-primary">Load</button>
                        <button type="button" class="btn btn-default" @click="clear">Clear</button>
                    </div>
                </div>
            </form>
        </div>
    	<div class="row" style="margin-top: 10px;">
    		<div class="col-sm-12">
        		<div id="loading" v-if="isLoading">Loading..</div>
                <a :href="parent" v-if="isLoaded">Add</a>

                <table class="table table-bordered" v-if="!isLoading">
                    <thead>
                        <th>Account No</th>
                        <th>Account Name</th>
                        <th>Fee Name</th>
                        <th>Amount</th>
                        <th>Due date</th>
                        <th>Description</th>
                        <th>Action</th>
                    </thead>
                    <tr v-for="item in otherCharges">
                        <td>{{ item.account.data.account_no }}</td>
                        <td>{{ item.account.data.account_name }}</td>
                        <td>{{ item.fee.data.name }}</td>
                        <td>{{ item.fee.data.fee | currency}}</td>
                        <td>{{ item.due_date }}</td>
                        <td>{{ item.description }}</td>
                        <td>Edit, Delete</td>
                    </tr>

                    <tr v-if="otherCharges.length === 0">
                        <td colspan="6">empty</td>
                    </tr>
                </table>
    		</div>
    	</div>
    </div>
</template>

<script>
import Vue from 'vue';
import AccountAutocomplete from '@components/common/account-autocomplete';
import api from '@services/api';
import currency from '@filters/currency';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

export default {
	data() {
		return {
			bus: new Vue(),
			fees: [],
            account: null,
            otherCharges: [],
            isLoading: false,
            dueDate: null,
            parent: '#',
            isLoaded: false
		}
	},
	components: {
		AccountAutocomplete,
        flatPickr
	},
	methods: {
        async loadAccountCharges(event) {
            event.preventDefault();

            try {
                this.isLoading = true;
                this.isLoaded = false;

                let params = {
                    '_includes': 'fee,account',
                    '_where': `due_date=${this.dueDate}`
                };

                let response = await api.httpGet('/other-charges', {params: params});
                this.otherCharges = response.data.data;

                this.isLoaded = true;
            } catch(e) {}

            this.isLoading = false;
        },

        clear() {
            this.isLoading = false;
            this.isLoaded = false;
            this.otherCharges = [];
            this.account = null;
            this.dueDate = null;
            this.bus.$emit('clearSelectedAccount');
        }
	},
	mounted() {
		this.bus.$on('onSelectAccount', account => {
            this.account = account;
		});

        this.parent = `#${this.$router.currentRoute.path}` || '#';
	},
	beforeDestroy() {
		this.bus.$off('onSelectAccount');
	}
}
</script>