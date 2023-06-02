import {createRouter, createWebHistory} from 'vue-router';
import UserLocation from '../pages/UserLocation.vue';

const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/', components:{default:UserLocation}
        }
    ]
});

export default router;