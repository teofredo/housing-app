import Sidebar from '@components/Sidebar';
import Main from '@components/Main';
import Block from '@components/Block';
import PageNotFound from '@components/404';
import Home from '@components/Home';
import Lot from '@components/Lot';
import Internet from '@components/Internet';

export default [
    {
        path: '*',
        name: 'pagenotfound',
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
            }
        ]
    }
];