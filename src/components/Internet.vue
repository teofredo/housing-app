<template>
	<div>
		<div class="row">
			<div class="col-sm-3">INTERNET SUBSCRIPTIONS</div>
			<div class="col-sm-1 col-sm-offset-8">
				<a href="#/admin/subscription" @click="newSubscription">Add</a>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-12">
				<table class="table table-bordered">
					<thead>
						<th>Account No</th>
						<th>Account Name</th>
						<th>Plan</th>
						<th>MBPS</th>
						<th>Monthly</th>
						<th>active</th>
						<th>installed</th>
						<th>Start</th>
						<th>End</th>
						<th>Installed</th>
						<th>Action</th>
					</thead>
					
					<tr v-for="item in subscriptions">
						<td>{{ item.account.data.account_no }}</td>
						<td>{{ item.account.data.account_name }}</td>
						<td>{{ item.plan.data.name }}</td>
						<td>{{ item.plan.data.mbps }}</td>
						<td>{{ item.plan.data.monthly | currency }}</td>
						<td>{{ item.active ? 'yes' : 'no' }}</td>
						<td>{{ item.installed ? 'yes' : 'no' }}</td>
						<td>{{ item.start_date }}</td>
						<td>{{ item.end_date }}</td>
						<td>{{ item.installed_at }}</td>
						<td>Edit, Delete</td>
					</tr>
				</table>
			</div>
		</div>
		
		<SubscriptionFrm :bus="bus" v-if="subscriptionFrmEnabled" />
	</div>
</template>

<script>
	import Vue from 'vue';
	import api from '../services/api';
	import toastr from 'toastr';
	import SubscriptionFrm from './forms/subscription';
	import currency from '../filters/currency';
	
	export default {
		data() {
			return {
				bus: new Vue(),
				subscriptions: [],
				subscriptionFrmEnabled: false
			}
		},
		
		methods: {
			async getSubscriptions() {
				try {
					let response = await api.httpGet('/internet-subscriptions?_includes=account,plan');
					this.subscriptions = response.data.data;
				} catch(e) {
					toastr.error('failed to load lists');
				}
			},
			
			async newSubscription() {
				this.subscriptionFrmEnabled = true;
				await this.$nextTick();
				this.bus.$emit('newSubscription');
			},
			
			updateSubscriptionList(data) {
				console.log(data);
				
				if(data.action == 'add') {
					this.subscriptions.push(data.data);
				} else if(data.action == 'edit') {
					//
				}
			},
		},
		
		mounted() {
			this.getSubscriptions();
			
			this.bus.$on('onCloseModal', modal => {
				this.subscriptionFrmEnabled = false;
			});
			
			this.bus.$on('updateList', data => {
				this.updateSubscriptionList(data);
			});
		},
		
		components: {
			SubscriptionFrm
		},
		
		filters: {
			currency
		},
		
		beforeDestroy() {
			this.bus.$off('onCloseModal');
			this.bus.$off('updateList');
		}
	}
</script>