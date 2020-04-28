<template>
	<div>
		<div class="row">
			<div class="col-sm-3">Water Rates</div>
			<div class="col-sm-1 col-sm-offset-8">
				<a href="#/admin/water-rates" @click="newWaterRate">Add</a>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-12">
				<table class="table table-bordered">
					<thead>
						<th>min fee</th>
						<th>min m3</th>
						<th>max m3</th>
						<th>per m3</th>
						<th>Action</th>
					</thead>
					
					<tr v-for="item in waterRates">
						<td>{{ item.min_fee | currency }}</td>
						<td>{{ item.min_m3 }}</td>
						<td>{{ item.max_m3 }}</td>
						<td>{{ item.per_m3 }}</td>
						<td>Edit, Delete</td>
					</tr>
				</table>
			</div>
		</div>
		
		<WaterRateFrm :bus="bus" v-if="waterRateFrmEnabled" />
	</div>
</template>

<script>
	import Vue from 'vue';
	import api from '../services/api';
	import toastr from 'toastr';
	import WaterRateFrm from './forms/water-rate';
	import currency from '@filters/currency';
	
	export default {
		data() {
			return {
				bus: new Vue(),
				waterRates: [],
				waterRateFrmEnabled: false
			}
		},
		
		methods: {
			async getWaterRates() {
				try {
					let response = await api.httpGet('/water-rates');
					this.waterRates = response.data.data;
				} catch(e) {
					toastr.error('failed to load lists');
				}
			},
			
			async newWaterRate() {
				this.waterRateFrmEnabled = true;
				await this.$nextTick();
				this.bus.$emit('newWaterRate');
			},
			
			updateList(data) {
				console.log(data);
				
				if(data.action == 'add') {
					this.waterRates.push(data.data);
				} else if(data.action == 'edit') {
					//
				}
			},
		},
		
		mounted() {
			this.getWaterRates();
			
			this.bus.$on('onCloseModal', modal => {
				this.waterRateFrmEnabled = false;
			});
			
			this.bus.$on('updateList', data => {
				this.updateList(data);
			});
		},
		
		components: {
			WaterRateFrm
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