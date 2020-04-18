<template>
    <form class="col s6" v-on:submit="login">
        <h5>Login</h5>
        
        <div class="row">
            <div class="col s6" style="color:red;">
                {{ message }}
            </div>
        </div>
        
    	<div class="row">
            <div class="input-field col s3">
              <input id="username" type="text" class="validate" v-model="username" required="">
              <label for="username">Username</label>
            </div>
        </div>
        
        <div class="row">
            <div class="input-field col s3">
              <input id="password" type="password" class="validate" v-model="password" required="">
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
            password: null,
            message: ''
        }
    },
    methods: {
        async login(event) {
            event.preventDefault();
            
            let response = await api.login(this.username, this.password);
            if(!response) {
                this.message = 'Invalid username and/or password.';
                return;
            }
            
            this.$router.push({ name: 'Home' });
        }
    }
}  
</script>