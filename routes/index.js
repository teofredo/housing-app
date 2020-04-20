import Vue from 'vue';
import VueRouter from 'vue-router';
import api from '@services/api';

//components
import Sidebar from '@components/Sidebar';
import Main from '@components/Main';
import Block from '@components/Block';
import PageNotFound from '@components/404';
import Home from '@components/Home';
import Lot from '@components/Lot';
import Internet from '@components/Internet';
import Plan from '@components/Plan';
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
        component: Main,
        children: [
            {
                path: '/',
                name: 'Home',
                components: {
                    sidebar: Sidebar,
                    default: Home
                }
            },
            
            {
                path: 'blocks',
                components: {
                    sidebar: Sidebar,
                    default: Block
                }
            },
            
            {
                path: 'subscription',
                components: {
                    sidebar: Sidebar,
                    default: Internet
                }
            },
            
            {
                path: 'plan',
                components: {
                    sidebar: Sidebar,
                    default: Plan
                }
            },
            
            {
                path: 'login',
                name: 'Login',
                component: Login
            },
            
            {
                path: 'logout',
                components: {
                    sidebar: Sidebar,
                    default: Logout
                }
            },
            
            {
                path: '*',
                component: PageNotFound
            }
        ]
    }
];

const router = new VueRouter({
    mode: 'hash',
    routes
});

//guard
router.beforeEach(async (to, from, next) => {
    var isAuthenticated = await api.isAuth();   
    
    if (to.name !== 'Login' && !isAuthenticated) {
        next({ name: 'Login' });
        return;
    }
    
    next();
});

export default router;