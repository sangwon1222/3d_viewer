import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('./pages/home.vue') },
  { path: '/home', component: () => import('./pages/home.vue') }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
