export default [
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
  { path: '/', redirect: '/add_chart_async' },
  { path: '/add_chart_sync', name: '智能分析（同步）', component: './Charts/Add/Sync' },
  { path: '/add_chart_async', name: '智能分析（异步）', component: './Charts/Add/Async' },
  { path: '/list_my_chart', name: '我的图表', component: './Charts/List' },
  { path: '*', layout: false, component: './404' },
];
