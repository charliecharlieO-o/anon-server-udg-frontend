import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Home from '@/components/Home'
import Boards from '@/components/Boards'
import Contacts from '@/components/Contacts'
import Credits from '@/components/Credits'
import Information from '@/components/Info'
import Rules from '@/components/Rules'
import Board from '@/components/Board'
import Profile from '@/components/Profile'
import Thread from '@/components/Thread'

Vue.use(Router)

export default new Router({
  history: false,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/boards',
      name: 'boards',
      component: Boards
    },
    {
      path: '/networking',
      name: 'contacts',
      component: Contacts
    },
    {
      path: '/faq',
      name: 'faq',
      component: Information
    },
    {
      path: '/credits',
      name: 'credits',
      component: Credits
    },
    {
      path: '/rules',
      name: 'rules',
      component: Rules
    },
    // Dynamic Routing
    {
      path: '/board/:slug',
      name: 'board',
      component: Board
    },
    {
      path: '/profile/:profileId',
      name: 'profile',
      component: Profile
    },
    {
      path: '/thread/:id',
      name: 'thread',
      component: Thread,
      children: [{
        path: 'comment/:commentId/:sb',
        component: Thread
      }]
    }
  ]
})
