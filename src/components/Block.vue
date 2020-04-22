<template>
	<div class="row">
		<div class="col-sm-3">
			<div class="row">
				<div class="col-sm-10">LOT</div>
				<div class="col-sm-2">
					<a href="#/admin/blocks" @click="newLot">Add</a>
				</div>
			</div>
			
			<table class="table table-bordered datatable">
				<thead>
					<th>Block</th>
					<th>Lot</th>
					<th>Action</th>
				</thead>
				<tr v-for="item in lots">
					<td>{{ item.block.data.name }}</td>
					<td>{{ item.name }}</td>
					<td>Edit, Delete</td>
				</tr>
			</table>
		</div>
		<div class="col-sm-3">
			<div class="row">
				<div class="col-sm-10">BLOCK</div>
				<div class="col-sm-2">
					<a href="#/admin/blocks" @click="newBlock">Add</a>
				</div>
			</div>
			
			<table class="table table-bordered datatable">
				<thead>
					<th>BLOCK</th>
					<th>ACTION</th>
				</thead>
				
				<tr v-for="item in blocks">
					<td>{{ item.name }}</td>
					<td>Edit, Delete</td>
				</tr>
			</table>
		</div>
		
		<BlockFrm :bus="bus" v-if="blockFrmEnabled" />
		<LotFrm :bus="bus" v-if="lotFrmEnabled" />
	</div>	
</template>

<script>
	import Vue from 'vue';
	import api from '../services/api';
	import toastr from 'toastr';
	import BlockFrm from './forms/block';
	import LotFrm from './forms/lot';
	
	export default {
		data() {
			return {
				bus: new Vue(),
				blocks: [],
				lots: [],
				blockFrmEnabled: false,
				lotFrmEnabled: false
			}
		},
		
		methods: {
			async getBlocks() {
				try {
					let response = await api.httpGet('/blocks');
					this.blocks = response.data.data;
				} catch(e) {
					toastr.error('error loading blocks');
				}
			},
			
			async getLots() {
				try {
					let response = await api.httpGet('/lots?_includes=block');
					this.lots = response.data.data;
				} catch(e) {
					toastr.error('failed to load lots');
				}
			},
			
			async newBlock() {
				this.blockFrmEnabled = true;
				await this.$nextTick();
				this.bus.$emit('newBlock');
			},
			
			async newLot() {
				this.lotFrmEnabled = true;
				await this.$nextTick();
				this.bus.$emit('newLot');	
			},
			
			updateBlockList(data) {
				if(data.action == 'add') {
					this.blocks.push(data.data);
				} else if(data.action == 'edit') {
					// let blockId = data.data.block_id;
					// let block = _.find(this.blocks, {block_id: blockId});
					// _.extend(block, data.data);
					
					// _.each(this.blocks, (value, index) => {
					// 	if(value.block_id == blockId) {
					// 		this.blocks[index] = block;
					// 		return false;
					// 	}
					// });
				}
			},
			
			updateLotList(data) {
				if(data.action == 'add') {
					this.lots.push(data.data);
				} else if(data.action == 'edit') {
					//
				}
			}
		},
		
		mounted() {
			this.getBlocks();
			this.getLots();
			
			this.bus.$on('onCloseModal', modal => {
				if(modal == 'block') {
					this.blockFrmEnabled = false;
				} else if(modal == 'lot') {
					this.lotFrmEnabled = false;
				}
			});
			
			this.bus.$on('updateList', data => {
				if(data.list == 'block') {
					this.updateBlockList(data);
				} else if(data.list == 'lot') {
					this.updateLotList(data);
				}
			});
		},
		
		components: {
			BlockFrm,
			LotFrm
		},
		
		beforeDestroy() {
			this.bus.$off('onCloseModal');
			this.bus.$off('updateList');
		}
	}
</script>