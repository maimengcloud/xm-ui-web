/* Layout */ 
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)

export default {
  routes: [ 
    {
      path: '/datav/xm',
      name: 'xmDatav',
      component: _import('datav/xm/FullScreenLayout'),

      iconCls: 'fa el-icon-menu',
      meta: {
        title: '项目大屏',
        icon: 'project'
      },
      // leaf: true,//只有一个节点
      children: [
        // { path: 'project/projectDatavFullScreen', component: _import('datav/xm/project/index'), name: 'projectDatavFullScreen', meta: {   title: '项目大屏' }},
        { path: 'project/projectDatavFullScreen', component: _import('datav/xm/project1/index'), name: 'projectDatavFullScreen', meta: {   title: '项目大屏' }},  
        // { path: 'branch/branchDatavFullScreen', component: _import('datav/xm/branch/index'), name: 'branchDatavFullScreen', meta: {   title: '机构大屏' }}, 
        { path: 'branch/branchDatavFullScreen', component: _import('datav/xm/branch1/index'), name: 'branchDatavFullScreen', meta: {   title: '机构大屏' }}, 
      ]
    }
  ]
}
