<template>
	<div>
		<div class="row">
			<div class="col-sm-12">ACCOUNTS</div>
		</div>
		<div class="row">
			<div class="col-sm-10">
				<div class="preloader" v-if="isLoading">Loading..</div>
				<table class="table table-bordered" v-if="!isLoading">
					<thead>
						<th>Account No</th>
						<th>Account Name</th>
						<th>Email</th>
						<th>Username</th>
						<th>Status</th>
						<th>Activated</th>
						<th>Action</th>
					</thead>
					
					<tr v-for="item in accounts">
						<td>{{ item.account_no }}</td>
						<td>{{ item.account_name }}</td>
						<td>{{ item.email }}</td>
						<td>{{ item.username }}</td>
						<td>{{ item.status }}</td>
						<td>{{ item.activated_at }}</td>
						<td>View, Edit, Delete</td>
					</tr>
				</table>
			</div>
			
			<!-- <AccountFrm :bus="bus" v-if="accountFrmEnabled" /> -->
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import api from '../services/api';
	import toastr from 'toastr';
	// import AccountFrm from './forms/account';
	
	export default {
		data() {
			return {
				bus: new Vue(),
				accounts: [],
				accountFrmEnabled: false,
				isLoading: false
			}
		},
		
		methods: {
			async getAccounts() {
				try {
					this.isLoading = true;
					let response = await api.httpGet('/accounts');
					this.accounts = response.data.data;	
				} catch(e) {
					toastr.error('failed to load accounts');
				} finally {
					this.isLoading = false;
				}
			}
		},
		
		mounted() {
			this.getAccounts();
		},
		
		components: {
			// AccountFrm
		},
		
		beforeDestroy() {
		}
	}
</script>