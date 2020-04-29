<template>
  <div class="modal fade" tabindex="-1" role="dialog">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	      	<h4 class="modal-title">Add/Edit</h4>
	      </div>
	      <div class="modal-body">
	        <div class="form-group">
		      	<label for="min-m3">minimum m3</label>
			    <input id="min-m3" type="number" v-model="minM3" class="form-control" placeholder="ex. 0.00" @change="checkValue" required="">
			</div>
			<div class="form-group">
		      	<label for="max-m3">maximum m3</label>
			    <input id="max-m3" type="number" v-model="maxM3" class="form-control" placeholder="10.00" required="">
			</div>
			<div class="form-group">
				<label for="per-m3">per m3</label>
				<input type="text" id="per-m3" class="form-control" v-model="perM3" required="" placeholder="ex. 40.00">
			</div>
			<div class="form-group" v-if="isMinM3Zero">
				<label for="min-fee">minimum fee</label>
				<input type="text" id="min-fee" class="form-control" v-model="minFee" placeholder="ex. 350.00">
			</div>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-primary" @click="save">Save</button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
</template>

<script>
	import api from '@services/api';
	import toastr from 'toastr';
	
	export default {
		props: ['bus'],
		mixins: [
			require('@mixins/response').default	
		],
		data() {
			return {
				minM3: null,
				maxM3: null,
				perM3: null,
				minFee: null,
				isMinM3Zero: false
			}
		},
		computed: {
			
		},
		methods: {
			async save() {
				let error = '';
				
				try {
					if(this.minM3 == null || this.minM3 == '') {
						toastr.error('minimum m3 is required.');
						return;
					}
					
					if(this.maxM3 == null || this.maxM3 == '') {
						toastr.error('maximum m3 is required.');
						return;
					}

					if(this.perM3 == null || this.perM3 == '') {
						toastr.error('rate per m3 is required.');
						return;
					}

					let n = Number.parseFloat(this.minM3);
					if(Number.isNaN(n)) {
						toastr.error('invalid minimum m3');
						return;
					} 

					if(n == 0) {
						if(this.minFee == null || this.minFee == '') {
							toastr.error('minimum fee is required');
							return;
						}
					}
					
					let response = await api.httpPost('/water-rates', {
						min_m3: this.minM3,
						max_m3: this.maxM3,
						per_m3: this.perM3,
						min_fee: this.minFee || 0
					});
					
					if(response.data.data) {
						toastr.success('success');
						$('.modal').modal('hide');
						
						this.bus.$emit('updateList', {
							action: 'add',
							data: response.data.data
						});
						
						return;
					}
					
					error = this.parseError(response);
					
				} catch(e) {
					error = 'error';
				}
				
				toastr.error(error);
			},

			checkValue() {
				let n = Number.parseFloat(this.minM3);
				if(Number.isNaN(n)) {
					this.isMinM3Zero = false;
					toastr.error('invalid minimum m3');
					return;
				}

				this.isMinM3Zero = n == 0;
			}
		},
		mounted() {
			const vm = this;
			
			vm.bus.$on('newWaterRate', () => {				
				$(function(){
					$('.modal').modal('show');
					
					$('.modal').on('hidden.bs.modal', function(e){
						vm.bus.$emit('onCloseModal');
					});
				});
			});
		},
		
		beforeDestroy() {
			this.bus.$off('newWaterRate');
		}
	}
</script>