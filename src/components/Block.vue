<template>
	<div class="row">
		<div class="col s3">
			<div class="row">
				<div class="col s3">BLOCK</div>
				<div class="col s5 offset-s4">
					<a href="#/admin/blocks" @click="newBlock">Add</a>
				</div>
			</div>
			
			<table>
				<thead>
					<th>Block</th>
					<th>Action</th>
				</thead>
				<tbody>
					<tr v-for="item in blocks">
						<td>{{ item.name }}</td>
						<td>Edit, Delete</td>
					</tr>
				</tbody>
			</table>
		</div>
		
		<div class="col s3 offset-s1">
			<div class="row">
				<div class="col s3">LOT</div>
				<div class="col s5 offset-s4">
					<a href="#/admin/blocks" @click="newLot">Add</a>
				</div>
			</div>
			
			<table>
				<thead>
					<th>Block</th>
					<th>Lot</th>
					<th>Action</th>
				</thead>
				<tbody>
					<tr v-for="item in lots">
						<td>{{ item.block.data.name }}</td>
						<td>{{ item.name }}</td>
						<td>Edit, Delete</td>
					</tr>
				</tbody>
			</table>
		</div>
		
		<modal :bus="bus" />
	</div>	
</template>

<script>
	import Vue from 'vue';
	import api from '../services/api';
	import modal from './utility/modal';
	
	export default {
		data() {
			return {
				bus: new Vue(),
				blocks: [],
				lots: []
			}
		},
		
		methods: {
			async getBlocks() {
				try {
					let response = await api.httpGet('/blocks');
					this.blocks = response.data.data;					
				} catch(e) {
					M.toast({html: 'failed to load blocks'});
				}
			},
			
			async getLots() {
				try {
					let response = await api.httpGet('/lots?_includes=block');
					this.lots = response.data.data;					
				} catch(e) {
					M.toast({html: 'failed to load lots'});
				}
			},
			
			newBlock() {
				this.bus.$emit('newBlock', {
					parent: '#/admin/blocks',
					endpoint: '/blocks',
					field: 'Block name'
				});
			},
			
			newLot() {
				this.bus.$emit('newLot', {
					parent: '#/admin/blocks',
					endpoint: '/lots',
					field: 'Lot name'
				});	
			}
		},
		
		mounted() {
			this.getBlocks();
			this.getLots();
		},
		
		components: { modal }
	}
</script>

<style>
	tbody {
		display:block;
		height:500px;
		overflow:auto;
	}
	thead, tbody tr {
		display:table;
		width:100%;
		table-layout:fixed;
	}
	thead {
		width: calc( 100% - 1em )
	}
	table {
		width:100%;
	}
</style>