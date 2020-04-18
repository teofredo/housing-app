<template>
	<div class="row" style="padding-left:30px;">
       <ul>
			<li><router-link to="/admin">Home</router-link></li>
			<li><router-link to="/admin/blocks">Block</router-link></li>
			<li><router-link to="/admin/lots">Lot</router-link></li>
			<li><router-link to="/admin/logout">Logout</router-link></li>
			
			<!-- <li>
				Internet
				<ul>
					<li><router-link to="/plans">Plans</router-link></li>
					<li><router-link to="/subscriptions">Subscriptions</router-link></li>
				</ul>
			</li>
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
	</div>
</template>

<style>
    li {
        margin: 10px 0;
    }
    
    li a {
    	color: #2c3e50;
    }
    
    .router-link-exact-active {
        color: green;
    }
</style>