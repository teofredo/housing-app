<template>
	<form @submit="createAccount($event)">
		<h3>New Account</h3>
		<div :class="alertClass" v-html="alertMsg" v-if="showAlert"></div>
		<div>
			<div class="row">
				<div class="col-sm-2">
					<div class="form-group">
						<label for="hhtype">Account type</label>
						<select id="hhtype" class="form-control" v-model="hhtype" ref="hhtype" required="">
							<option v-for="(item, index) in hhtypes" :value="item.name">{{ item.name }}</option>
						</select>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-2">
					<div class="form-group">
						<label for="block">Block</label>
						<select id="block" class="form-control" v-model="block" @change="onChangedBlock($event)" required="">
							<option v-for="item in blocks" :value="item.block_id">{{ item.name }}</option>
						</select>
					</div>
				</div>
				<div class="col-sm-2">
					<div class="form-group">
						<label for="lot">Lot</label>
						<select id="lot" class="form-control" v-model="lot" @change="onChangedLot($event)" required="">
							<option v-for="item in lots" :value="item.lot_id">{{ item.name }}</option>
						</select>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-3">
					<div class="form-group">
						<label for="moved-in">Moved-in date</label>
						<flat-pickr v-model="moved_in" id="moved-in" class="form-control" placeholder="select date"></flat-pickr>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-3">
					<div class="form-group">
				      	<label for="lastname">Lastname</label>
					    <input id="lastname" type="text" v-model="lastname" class="form-control uppercase" placeholder="ex. Llido" required="">
					</div>
				</div>
				<div class="col-sm-3">
					<div class="form-group">
				      	<label for="firstname">Firstname</label>
					    <input id="firstname" type="text" v-model="firstname" class="form-control uppercase" placeholder="ex. Teo" required="">
					</div>
				</div>
				<div class="col-sm-3">
					<div class="form-group">
				      	<label for="middlename">Middlename</label>
					    <input id="middlename" type="text" v-model="middlename" class="form-control uppercase" placeholder="ex. Cielo">
					</div>
				</div>
				<div class="col-sm-2">
					<div class="form-group">
				      	<label for="suffix">Suffix</label>
					    <input id="suffix" type="text" v-model="suffix" class="form-control uppercase" placeholder="ex. Jr">
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-sm-3">
					<div class="form-group">
				      	<label for="email">Email</label>
					    <input id="email" type="text" v-model="email" class="form-control" placeholder="ex. teo@gmail.com" required="">
					</div>
				</div>
				<div class="col-sm-3">
					<div class="form-group">
				      	<label for="contact_no">Contact No</label>
					    <textarea id="contact_no" v-model="contact_no" class="form-control" placeholder="ex. 09123456789; 09987654321" required=""></textarea>
					</div>
				</div>
			</div>
			<button type="submit" class="btn btn-md btn-primary">Submit</button>
			<button type="reset" class="btn btn-md btn-default">Clear</button>
		</div>
	</form>
</template>

<script>
	import api from '@services/api';
	import toastr from 'toastr';
	import _ from 'lodash';
	import flatPickr from 'vue-flatpickr-component';
  	import 'flatpickr/dist/flatpickr.css';
	
	export default {
		data() {
			return {
				lastname: null,
				firstname: null,
				middlename: null,
				suffix: null,
				email: null,
				contact_no: null,
				blocks: [],
				lots: [],
				block: null,
				lot: null,
				hhtypes: [
					{ name: 'owner', selected: 'selected' },
					{ name: 'tenant', selected: false }
				],
				hhtype: null,
				moved_in: null,
				alertClass: 'alert alert-success',
				alertMsg: '<strong>Success!</strong> Account has been created.',
				showAlert: false
			};
		},
		
		methods: {
			async getBlocks() {
				try {
					let response = await api.httpGet('/blocks?_includes=lots');
					console.log(response.data);
					this.blocks = response.data.data;
				} catch(e) {
					toastr.error('error loading blocks');
				}
			},
			
			onChangedBlock(event) {
				this.lots = [];				
				let block = _.find(this.blocks, {block_id: this.block});
				this.lots = block.lots.data || [];
			},
			
			onChangedLot(event) {
				console.log(this.lot, event);
			},
			
			async createAccount(event) {
				event.preventDefault();
				
				let error = '';
				
				try {
					let response = await api.httpPost('/accounts', {
						householder_type: this.hhtype,
						block_id: this.block,
						lot_id: this.lot,
						moved_in: this.moved_in,
						lastname: this.lastname,
						firstname: this.firstname,
						middlename: this.middlename,
						suffix: this.suffix,
						email: this.email,
						contact_no: this.contact_no
					});
					
					if(response.data.data) {
						toastr.success('Saved');
						this.alert('success', '<strong>Success!</strong> Account has been created.');
						return;
					}
					
					error = this.parseError(response);
					
				} catch(e) {
					error = e.message;
				}
				
				toastr.error(error);
				this.alert('danger', '<strong>Error!</strong> An error occured while creating account.');
			},
			
			alert($class, message) {
				this.alertClass = `alert alert-${$class}`;
				this.alertMsg = message;
				this.showAlert = true;
			}
		},
		
		mounted() {
			this.getBlocks();
			
			//select default account type
			let hhtypes = this.$refs.hhtype.children;
			if(hhtypes.length) {
				this.hhtype = hhtypes[0].value;
			}
		},
		
		components: {
			flatPickr
		},
		
		mixins: [
			require('@mixins/response').default	
		],
		
		watch: {
			moved_in: function(newVal, oldVal) {
				console.log(newVal);
			}
		}
	}
</script>