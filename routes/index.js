import Vue from 'vue';
import VueRouter from 'vue-router';

//components
import Sidebar from '@components/Sidebar';
import Main from '@components/Main';
import Block from '@components/Block';
import PageNotFound from '@components/404';
import Home from '@components/Home';
import Lot from '@components/Lot';
import Internet from '@components/Internet';
import Login from '@components/Login';
import Logout from '@components/Logout';

Vue.use(VueRouter);

const routes = [
    {
        path: '*',
        component: PageNotFound
    },
    
    {
        path: '/admin',
        components: {
            main: Main,
            sidebar: Sidebar
        },
        children: [
            {
                path: '/',
                components: {
                    default: Home
                }
            },
            
            {
                path: 'blocks',
                component: Block
            },
            
            {
                path: 'lots',
                component: Lot
            },
            
            {
                path: 'login',
                name: 'Login',
                component: Login
            },
            
            {
                path: 'logout',
                component: Logout
            },
            
            {
                path: '*',
                component: PageNotFound
            }
        ]
    }
];

export default new VueRouter({
    mode: 'hash',
    routes
});