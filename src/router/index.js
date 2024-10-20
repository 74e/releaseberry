import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/LibraryView.vue'
import Profile from '../views/ProfileView.vue'
import GlobalLibrary from '../views/GlobalLibraryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/user/:username?',
      name: 'profile',
      component: Profile
    },
    {
      path: '/global',
      name: 'global',
      component: GlobalLibrary
    }
  ]
})

export default router
