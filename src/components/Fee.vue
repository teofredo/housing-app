<template>
	<div>
		<div class="row">
			<div class="col-sm-3">FEES</div>
			<div class="col-sm-1 col-sm-offset-8">
				<a href="#/admin/fees" @click="newFee">Add</a>
			</div>
		</div>
		<div class="row">
			<div class="col-sm-12">
				<table class="table table-bordered">
					<thead>
						<!-- <th>Code</th> -->
						<th>Fee</th>
						<th>Amount</th>
						<th>other fee</th>
						<th>Description</th>
						<th>Action</th>
					</thead>
					
					<tr v-for="item in fees">
						<!-- <td>{{ item.code }}</td> -->
						<td>{{ item.name }}</td>
						<td>{{ item.fee | currency }}</td>
						<td>{{ item.other_fee ? 'yes' : 'no' }}</td>
						<td>{{ item.description | truncate(0, 100) }}</td>
						<td>Edit, Delete</td>
					</tr>
				</table>
			</div>
		</div>
		
		<FeeFrm :bus="bus" v-if="feeFrmEnabled" />
	</div>
</template>

<script>
	import Vue from 'vue';
	import api from '../services/api';
	import toastr from 'toastr';
	import FeeFrm from './forms/fee';
	import currency from '@filters/currency';
	import truncate from '@filters/truncate';
	
	export default {
		data() {
			return {
				bus: new Vue(),
				fees: [],
				feeFrmEnabled: false
			}
		},
		
		methods: {
			async getFees() {
				try {
					let response = await api.httpGet('/fees');
					this.fees = response.data.data;
				} catch(e) {
					toastr.error('failed to load lists');
				}
			},
			
			async newFee() {
				this.feeFrmEnabled = true;
				await this.$nextTick();
				this.bus.$emit('newFee');
			},
			
			updateFeeList(data) {
				console.log(data);
				
				if(data.action == 'add') {
					this.fees.push(data.data);
				} else if(data.action == 'edit') {
					//
				}
			},
		},
		
		mounted() {
			this.getFees();
			
			this.bus.$on('onCloseModal', modal => {
				this.feeFrmEnabled = false;
			});
			
			this.bus.$on('updateList', data => {
				this.updateFeeList(data);
			});
		},
		
		components: {
			FeeFrm
		},
		
		filters: {
			currency, truncate
		},
		
		beforeDestroy() {
			this.bus.$off('onCloseModal');
			this.bus.$off('updateList');
		}
	}
</script>