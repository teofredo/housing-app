import Vue from 'vue';
import VueRouter from 'vue-router';
import api from '@services/api';
import Sidebar from '@components/Sidebar';

Vue.use(VueRouter);

const routes = [
    {
        path: '*',
        redirect: '/admin'
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
                    default: require('@components/forms/NewAccount').default
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
                path: 'fees',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/Fee').default
                }
            },
            
            {
                path: 'water-rates',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/WaterRate').default
                }
            },

            {
                path: 'other-charges',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/OtherCharges').default
                }
            },

            {
                path: 'adjustments',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/Adjustment').default
                }
            },

            {
                path: 'water-reading',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/WaterReading').default
                }
            },

            {
                path: 'pos',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/Pos').default
                }
            },

            {
                path: 'month-dues',
                components: {
                    sidebar: Sidebar,
                    default: require('@components/generators/MonthDue').default
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
                component: require('@components/404').default
            }
        ]
    }
];

const router = new VueRouter({
    // mode: 'history',
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