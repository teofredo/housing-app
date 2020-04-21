import Vue from 'vue';
import VueRouter from 'vue-router';
import api from '@services/api';

import Sidebar from '@components/Sidebar';
import PageNotFound from '@components/404';

Vue.use(VueRouter);

const routes = [
    {
        path: '*',
        component: PageNotFound
    },
    
    {
        path: '/admin',
        component: require('@components/Main').default,
        children: [
            {
                path: '/',
                name: 'Home',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/Home').default
                }
            },
            
            {
                path: 'blocks',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/Block').default
                }
            },
            
            {
                path: 'subscription',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/Internet').default
                }
            },
            
            {
                path: 'plan',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/Plan').default
                }
            },
            
            {
                path: 'accounts',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/Account').default
                }
            },
            
            {
                path: 'new-account',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/NewAccount').default
                }
            },
            
            {
                path: 'householders',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/Householder').default
                }
            },
            
            {
                path: 'login',
                name: 'Login',
                component: require('@components/Login').default
            },
            
            {
                path: 'logout',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/Logout').default
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