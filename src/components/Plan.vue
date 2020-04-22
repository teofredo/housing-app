<template>
	<div>
		<div class="row">
			<div class="col-sm-9">INTERNET PLANS</div>
			<div class="col-sm-3">
				<a href="#/admin/plan" @click="newPlan">Add</a>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-10">
				<table class="table table-bordered">
					<thead>
						<th>Name</th>
						<th>Monthly</th>
						<th>MBPS</th>
						<th>Description</th>
						<th>Action</th>
					</thead>
					
					<tr v-for="item in plans">
						<td>{{ item.name }}</td>
						<td>{{ item.monthly | currency }}</td>
						<td>{{ item.mbps }}</td>
						<td>{{ item.description }}</td>
						<td>Edit, Delete</td>
					</tr>
				</table>
			</div>
		</div>
		<PlanFrm :bus="bus" v-if="planFrmEnabled" />
	</div>
</template>

<script>
	import Vue from 'vue';
	import api from '../services/api';
	import toastr from 'toastr';
	import PlanFrm from './forms/plan';
	import currency from '../filters/currency';
	
	export default {
		data() {
			return {
				bus: new Vue(),
				plans: [],
				planFrmEnabled: false
			}
		},
		
		methods: {
			async getPlans() {
				try {
					let response = await api.httpGet('/internet-plans');
					this.plans = response.data.data;	
				} catch(e) {
					toastr.error('failed to load internet plans');
				}
			},
			
			async newPlan() {
				this.planFrmEnabled = true;
				await this.$nextTick();
				this.bus.$emit('newPlan');
			},
			
			updatePlanList(data) {
				if(data.action == 'add') {
					this.plans.push(data.data);
				} else if(data.action == 'edit') {
					//
				}
			},
		},
		
		mounted() {
			this.getPlans();
			
			this.bus.$on('onCloseModal', modal => {
				this.planFrmEnabled = false;
			});
			
			this.bus.$on('updateList', data => {
				this.updatePlanList(data);
			});
		},
		
		components: {
			PlanFrm
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