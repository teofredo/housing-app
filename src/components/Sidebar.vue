<template>
	<nav class="row">
       <ul>
			<li><router-link to="/admin">Home</router-link></li>
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
					<li><router-link to="/admin/fees">Fixed</router-link></li>
					<li><router-link to="/admin/water-rates">Water Rates</router-link></li>
				</ul>
			</li>

			<li><router-link to="/admin/blocks">Block/Lot</router-link></li>
			<li><router-link to="/admin/logout">Logout</router-link></li>
			
			<!-- 
			<li><router-link to="/accounts">Accounts</router-link></li>
			<li>
				Settings
				<ul>
					<li><router-link to="/fees">Fees</router-link></li>
					<li><router-link to="/water-rates">Water rates</router-link></li>
					<li><router-link to="/advance">Advanced</router-link></li>
				</ol>
			</li>
			<li>
				Reports
				<ul>
					<li><router-link to="/soa">SOA</router-link></li>
					<li><router-link to="/sales">Sales</router-link></li>
				</ul>
			</li>
			<li><router-link to="/users">Users</router-link></li> -->
		</ul>
	</nav>
</template>

<style>
    li {
        margin: 5px 0;
    }
    
    li a {
    	color: #2c3e50;
    }
    
    .router-link-exact-active {
        color: green;
    }
</style>