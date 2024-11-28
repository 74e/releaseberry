import { createRouter, createWebHistory } from 'vue-router';
import Library from '../views/LibraryView.vue';
import Profile from '../views/ProfileView.vue';
import ReleaseBerryMainView from '../views/ReleaseBerryMainView.vue';
import Settings from '@/views/SettingsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/library',
      name: 'library',
      component: Library
    },
    {
      path: '/user/:handle?',
      name: 'profile',
      component: Profile
    },
    {
      path: '/',
      name: 'main',
      component: ReleaseBerryMainView
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

export default router;
