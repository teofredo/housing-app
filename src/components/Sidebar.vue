<template>
	<nav class="row sidebar">
       <ul>
			<li><router-link to="/admin">Home</router-link></li>
			<li><router-link to="/admin/pos">POS</router-link></li>
			<li>Account
				<ul>
					<li><router-link to="/admin/other-charges">Charge</router-link></li>
					<li><router-link to="/admin/adjustments">Adjustment</router-link></li>
				</ul>
			</li>
			<li>
				Generators
				<ul>
					<li><router-link to="/admin/month-dues">Month dues</router-link></li>
					<li>SOA/Bills</li>
					<li>Reports</li>
					<li>Others</li>
				</ul>
			</li>
			<li>
				Customer
				<ul>
					<li><router-link to="/admin/new-account">New Account</router-link></li>
					<li><router-link to="/admin/householders">Owner/Tenant</router-link></li>
					<li><router-link to="/admin/accounts">Accounts</router-link></li>
				</ul>
			</li>
			<li>
				Internet
				<ul>
					<li><router-link to="/admin/subscription">Subscriptions</router-link></li>
					<li><router-link to="/admin/plan">Plans</router-link></li>
				</ul>
			</li>
			
			<li>
				Fees/Rates
				<ul>
					<li><router-link to="/admin/fees">Fees</router-link></li>
					<li><router-link to="/admin/water-rates">Water Rates</router-link></li>
				</ul>
			</li>

			<li><router-link to="/admin/blocks">Houses</router-link></li>
			<li>Users</li>
			<li><router-link to="/admin/logout">Logout</router-link></li>
		</ul>
	</nav>
</template>