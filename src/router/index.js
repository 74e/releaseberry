import { createRouter, createWebHistory } from 'vue-router';
import Library from '../views/LibraryView.vue';
import Profile from '../views/ProfileView.vue';
import GlobalLibrary from '../views/GlobalLibraryView.vue';
import Settings from '@/views/SettingsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'library',
      component: Library
    },
    {
      path: '/user/:handle?',
      name: 'profile',
      component: Profile
    },
    {
      path: '/global',
      name: 'global',
      component: GlobalLibrary
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
});

export default router;
