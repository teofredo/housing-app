<template>
    <form v-on:submit="login" class="col-sm-3">
        <h3>Login</h3>
        <div class="row">
            <div style="color:red;">
                {{ message }}
            </div>
        </div>        
        <div class="form-group">            
            <label for="username">Username</label>
            <input type="text" v-model="username" class="form-control" id="username" required="">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" class="form-control" id="password" required="">
          </div>
          <button type="submit" class="btn btn-default">Submit</button>
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