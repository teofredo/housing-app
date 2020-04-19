<template>
	<div class="row">
		<div class="col-sm-3">
			<div class="row">
				<div class="col-sm-3">BLOCK</div>
				<div class="col-sm-offset-4 col-sm-5">
					<a href="#/admin/blocks" @click="newBlock">Add</a>
				</div>
			</div>
			
			<table>
				<tr style="background-color:yellow;">
					<td>BLOCK</td>
					<td>ACTION</td>
				</tr>
				
				<tr v-for="item in blocks">
					<td>{{ item.name }}</td>
					<td>Edit, Delete</td>
				</tr>
			</table>
		</div>
		
		<div class="col-sm-offset-1 col-sm-3">
			<div class="row">
				<div class="col-sm-3">LOT</div>
				<div class="col-sm-offset-4 col-sm-5">
					<a href="#/admin/blocks" @click="newLot">Add</a>
				</div>
			</div>
			
			<table>
				<tr style="background-color: yellow;">
					<td>Block</td>
					<td>Lot</td>
					<td>Action</td>
				</tr>
				<tr v-for="item in lots">
					<td>{{ item.block.data.name }}</td>
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
			
			async newBlock() {
				this.blockFrmEnabled = true;
				
				await this.$nextTick();
				
				this.bus.$emit('newBlock', {
					parent: '#/admin/blocks',
					endpoint: '/blocks',
					field: 'Block name'
				});
			},
			
			async newLot() {
				this.lotFrmEnabled = true;
				
				await this.$nextTick();
				
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
			
			this.bus.$on('onCloseModal', modal => {
				if(modal == 'block') {
					this.blockFrmEnabled = false;
					console.log(this.blockFrmEnabled);
				} else if(modal == 'lot') {
					this.lotFrmEnabled = false;
					console.log(this.lotFrmEnabled);
				}
			});
		},
		
		components: {
			BlockFrm,
			LotFrm
		},
		
		beforeDestroy() {
			this.bus.$off('onCloseModal');
		}
	}
</script>

<style>
	table, th, td {
	  	border: 1px solid black;
	}
	
	table {
		width: 100%;
	  	border-collapse: collapse;
	}
</style>