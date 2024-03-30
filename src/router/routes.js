import AuthGuard from 'src/guard/AuthGuard.js';

const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '',   name:"Login",component: () => import('pages/LoginPage.vue') }
    ]
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter:AuthGuard,
    children: [
      { path: '', component: () => import('pages/HomePage.vue') }
    ]
  },
  {
    path: '/list',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter:AuthGuard,
    children: [
      { path: '', component: () => import('pages/ListPage.vue') }
    ]
  },
  {
    path: '/create',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter:AuthGuard,
    children: [
      { path: '', component: () => import('pages/CreatePage.vue') }
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
