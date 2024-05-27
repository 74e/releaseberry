import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/MainView.vue'
import Profile from '../views/ProfileView.vue'
import Notes from '../views/NotesView.vue'
import Calendar from '../views/CalendarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/user/:id',
      name: 'profile',
      component: Profile
    },
    {
      path: '/notes',
      name: 'notes',
      component: Notes
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar
    }
  ]
})

export default router
