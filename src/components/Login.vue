<template>
    <div class="row">
        <div class="col-sm-4 col-sm-offset-5">
            <form v-on:submit="login" class="well" autocomplete="off">
                <h4 style="text-align:center;">Housing Villas Collection System</h4>
                
                <p :class="alertClass" v-html="alertMsg" v-if="showAlert" style="font-size: 9pt;"></p>

                <div class="form-group">            
                    <label for="username">Username</label>
                    <input type="text" v-model="username" class="form-control" id="username" required="">
                  </div>
                  <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" v-model="password" class="form-control" id="password" required="">
                  </div>
                  <button type="submit" class="btn btn-primary">Login</button>
            </form>
        </div>
    </div>
</template>

<script>
import api from '@services/api';
import toastr from 'toastr';
    
export default {
    data() {
        return {
            username: null,
            password: null,
            showAlert: false,
            alertMsg: null,
            alertClass: 'alert alert-danger'
        }
    },
    methods: {
        async login(event) {
            event.preventDefault();
            
            let response = await api.login(this.username, this.password);
            if(!response) {
                this.alert('alert alert-danger', 'Invalid username and/or password.');
                toastr.error('login failed');
                return;
            }
            
            toastr.success('logged in successfully');
            this.$router.push({ name: 'Home' });
        },

        alert(alertClass, alertMsg) {
            this.alertClass = alertClass;
            this.alertMsg = alertMsg;
            this.showAlert = true;
        }
    }
}  
</script>