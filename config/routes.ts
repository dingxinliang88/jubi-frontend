﻿export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  {
    path: '/user',
    layout: false,
    routes: [{ path: '/user/register', component: './User/Register' }],
  },
  { path: '/welcome', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', name: '管理页面', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '管理页面2', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/add_chart' },
  { path: '/add_chart', name: '智能分析', component: './Charts/Add' },
  { path: '/list_my_chart', name: '我的图表', component: './Charts/List' },
  { path: '*', layout: false, component: './404' },
];
