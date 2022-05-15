import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
import Control from '../views/Control.vue'
import Parameter from '../views/Parameter.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Control',
    component: Control
  },  
  {
    path: '/parameters',
    name: 'Parameter',
    component: Parameter
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
