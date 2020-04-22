<template>
	<div>
		<div class="row">
			<div class="col-sm-12">Owner/Tenant</div>
		</div>
		<div class="row">
			<div class="col-sm-10">
				<div class="preloader" v-if="isLoading">Loading..</div>
				<table class="table table-bordered" v-if="!isLoading">
					<thead>
						<th>House No</th>
						<th>Type</th>
						<th>Lastname</th>
						<th>Firstname</th>
						<th>Middlename</th>
						<th>Suffix</th>
						<th>Contact No</th>
						<th>Moved in</th>
						<th>Block</th>
						<th>Lot</th>
						<th>Meter No</th>
						<th>Action</th>
					</thead>
					
					<tr v-for="item in householders">
						<td>{{ item.house_no }}</td>
						<td>{{ item.type }}</td>
						<td>{{ item.lastname.toUpperCase() }}</td>
						<td>{{ item.firstname.toUpperCase() }}</td>
						<td>{{ toUpperOrNot(item.middlename) }}</td>
						<td>{{ toUpperOrNot(item.suffix) }}</td>
						<td>{{ item.contact_no }}</td>
						<td>{{ item.moved_in }}</td>
						<td>{{ item.lot.data.block.data.name }}</td>
						<td>{{ item.lot.data.name }}</td>
						<td>{{ item.water_meter_no }}</td>
						<td>View, Edit, Delete</td>
					</tr>
				</table>
			</div>
			
			<!-- <HouseholderFrm :bus="bus" v-if="householderFrmEnabled" /> -->
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import api from '../services/api';
	import toastr from 'toastr';
	// import PlanFrm from './forms/account';
	
	export default {
		data() {
			return {
				bus: new Vue(),
				householders: [],
				householderFrmEnabled: false,
				isLoading: false
			}
		},
		
		methods: {
			async getAccounts() {
				try {
					this.isLoading = true;
					let response = await api.httpGet('/householders?_includes=lot,lot.block');
					this.householders = response.data.data;	
				} catch(e) {
					toastr.error('failed to load householders');
				} finally {
					this.isLoading = false;
				}
			},
			
			toUpperOrNot(name) {
				if(name == null || name == '') {
					return null;	
				}
				
				return name.toUpperCase();
			}
		},
		
		mounted() {
			this.getAccounts();
		},
		
		components: {
			// HouseholderFrm
		},
		
		beforeDestroy() {
		}
	}
</script>