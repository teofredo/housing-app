<template>
    <form class="col s6" v-on:submit="login">
        <h5>Login</h5>
    	<div class="row">
            <div class="input-field col s3">
              <input id="username" type="text" class="validate" v-model="username">
              <label for="username">Username</label>
            </div>                
        </div>
        <div class="row">
            <div class="input-field col s3">
              <input id="password" type="password" class="validate" v-model="password">
              <label for="password">Password</label>
            </div>
        </div>
        <button class="btn waves-effect waves-light" type="submit" name="action">Submit</button>
    </form>
</template>

<script>
import api from '@services/api';
    
export default {
    data() {
        return {
            username: null,
            password: null
        }
    },
    methods: {
        login(event) {
            api.login(this.username, this.password);
        }
    }
}  
</script>