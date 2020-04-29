<template>
	<div class="dropdown">
		<input id="input-dropdown"
	    	type="text" 
	    	v-model="accountName" 
	    	class="dropdown-toggle form-control uppercase" 
	    	placeholder="search" 
	    	data-toggle="dropdown"
	    	@keyup.arrow-down="focusDropdown"
	    	required=""
	    	autocomplete="off">
	    	
	    <ul class="dropdown-menu" 
	    	aria-labelledby="input-dropdown"
	    	style="width:100%;">
	    	<li v-for="item, index in filteredAccounts">
	    		<a :href="parent" 
	    			@click="selectAccount(item)"
	    			:data-index="index"
	    			:data-id="item.account_id">{{ item.account_no }} {{ item.account_name }}</a>
	    	</li>
	    </ul>
	</div>
</template>

<script>
import api from '@services/api';
import toastr from 'toastr';

export default {
	props: ['bus'],
	data() {
		return {
			accountName: null,
			accounts: [],
			selectedAccount: null,
			parent: '#'
		}
	},
	computed: {
		filteredAccounts() {
			let vm = this;
			
			if(!vm.accountName) {
				return vm.accounts;
			}
			
			return vm.accounts.filter(function(account){
				return account.account_name.toLowerCase().indexOf(vm.accountName.toLowerCase()) > -1;
			});
		}
	},
	methods: {
		async getAccounts() {
			try {
				let response = await api.httpGet('/accounts');
				this.accounts = response.data.data;	
			} catch(e) {
				toastr.error('failed to load accounts');
			}
		},
		selectAccount(account) {
			this.selectedAccount = account;
			this.accountName = account.account_name;
			this.bus.$emit('onSelectAccount', account);
		},
		
		focusDropdown(event) {
			$(function(){
				$('.dropdown-menu a')[0].focus();
			});
			
			this.$nextTick();
		}
	},
	mounted() {
		const vm = this;
			
		vm.getAccounts();
		
		$(function(){
			$('.dropdown-menu').on('keyup', function(e){
				let keyCode = e.which || e.keycode;
				
				let target = $(e.target)[0];
				let index = target.dataset.index;
				let oldIndex = localStorage.getItem('data-oldIndex') || null;
				
				if(oldIndex == 0 && keyCode == 38) {
					$('#input-dropdown').focus();
				}
				
				localStorage.setItem('data-oldIndex', index);
			});
			
			$('#input-dropdown').on('keyup', function(e){
				let dropdown = $('.dropdown-toggle');
				
				if($('.dropdown .dropdown-menu').is(':hidden')) {
					dropdown.dropdown('toggle');	
				}
			});
		});

		vm.parent = `#${vm.$router.currentRoute.path}` || '#';
	},
	beforeDestroy() {
		localStorage.removeItem('data-oldIndex');
		$(function(){
			$('#input-dropdown').off('keyup');
			$('.dropdown-menu').off('keyup');
		});
	}
}
</script>