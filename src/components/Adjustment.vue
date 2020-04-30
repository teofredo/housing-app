<template>
    <div>
        <div class="row">
            <form @submit="loadAdjustments($event)">
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
        		<div id="account-info" v-if="account">
                    <table>
                        <tr>
                            <th>Account No</th>
                            <td style="padding-left: 20px;">{{ account.account_no }}</td>
                        </tr>
                        <tr>
                            <th>Account Name</th>
                            <td style="padding-left: 20px;">{{ account.account_name }}</td>
                        </tr>
                    </table>
                    <br/>
                </div>

                <div id="loading" v-if="isLoading">Loading..</div>
                <a :href="parent" v-if="isLoaded" @click="newAdjustment">Add</a>

                <table class="table table-bordered" v-if="isLoaded">
                    <thead>
                        <th>Adjustment</th>
                        <th>Amount</th>
                        <th>Due date</th>
                        <th>Action</th>
                    </thead>
                    <tr v-for="item in adjustments">
                        <td>{{ item.description | truncate(0, 50) }}</td>
                        <td>{{ item.amount | currency}}</td>
                        <td>{{ item.due_date }}</td>
                        <td>Edit, Delete</td>
                    </tr>

                    <tr v-if="adjustments.length === 0">
                        <td colspan="6">empty</td>
                    </tr>
                </table>
    		</div>
    	</div>

        <AdjustmentFrm :bus="bus" v-if="adjustmentFrmEnabled" />
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
import truncate from '@filters/truncate';
import AdjustmentFrm from './forms/adjustment';

export default {
	data() {
		return {
			bus: new Vue(),
            account: null,
            adjustments: [],
            isLoading: false,
            dueDate: null,
            parent: '#',
            isLoaded: false,
            adjustmentFrmEnabled: false
		}
	},
	components: {
		AccountAutocomplete,
        flatPickr,
        AdjustmentFrm
	},
    filters: {
        currency, truncate
    },
	methods: {
        async loadAdjustments(event) {
            event.preventDefault();

            try {
                if(!this.account) {
                    toastr.error('please select account');
                    return;
                }

                if(this.dueDate == '' || this.dueDate == null) {
                    toastr.error('please select due date');
                    return;
                }

                this.isLoading = true;
                this.isLoaded = false;

                let params = {
                    '_includes': 'fee',
                    '_where': `account_id=${this.account.account_id},due_date=${this.dueDate}`
                };

                let response = await api.httpGet('/adjustments', {params: params});
                this.adjustments = response.data.data;

                this.isLoaded = true;
            } catch(e) {}

            this.isLoading = false;
        },

        clear() {
            this.isLoading = false;
            this.isLoaded = false;
            this.adjustments = [];
            this.account = null;
            this.dueDate = null;
            this.bus.$emit('clearSelectedAccount');
        },

        updateList(data) {
            console.log(data);
            if(data.action === 'add') {
                this.adjustments.push(data.data);
            } else if(data.action === 'edit') {
                //
            }
        },

        async newAdjustment() {
            this.adjustmentFrmEnabled = true;

            await this.$nextTick();

            this.bus.$emit('newAdjustment', {
                account: this.account, 
                due_date: this.dueDate
            });
        }
	},
	mounted() {
		this.bus.$on('onSelectAccount', account => {
            this.account = account;
		});

        this.bus.$on('updateList', data => {
            this.updateList(data);
        });

        this.bus.$on('onCloseModal', () => {
            this.adjustmentFrmEnabled = false;
        });

        this.parent = `#${this.$router.currentRoute.path}` || '#';
	},
	beforeDestroy() {
		this.bus.$off('onSelectAccount');
        this.bus.$off('updateList');
	}
}
</script>