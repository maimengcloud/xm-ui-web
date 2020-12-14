import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'

//文档中心
import ArchiveMng from './views/mdp/arc/archive/ArchiveMng.vue' 
import ArchiveListFlow from './views/mdp/arc/archive/ArchiveListFlow.vue' 
import ArchiveAttachmentMng from './views/mdp/arc/archiveAttachment/ArchiveAttachmentMng.vue' 
import ArcCategoryMng from './views/mdp/arc/category/CategoryMng.vue' 
import UploadAdd from './views/mdp/arc/image/UploadAdd.vue'
//内容分发
import SendPlanMng from './views/mdp/arc/send/sendPlan/SendPlanMng.vue' 

//商城专题设置
//商城end

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    }, 
    {
        path: '/',
        component: Home,
        name: '',
        hidden: true
    },
    {
        path: '/oa',
        component: Home,
        name: '内容/文档中心',
        iconCls: 'fa el-icon-menu',
        //leaf: true,//只有一个节点
        children: [
        	{ path: '/arc/Index', component: ArchiveMng, name: '文档管理' },
        	{ path: '/mdp/arc/archive/ArchiveMng/query', component: ArchiveMng, name: '文档查阅' },
        	{ path: '/mdp/arc/archive/ArchiveListFlow', component: ArchiveListFlow, name: '流程归档查阅' },
        	{ path: '/mdp/arc/archiveAttachment/ArchiveAttachmentMng', component: ArchiveAttachmentMng, name: '附件管理' },
            { path: '/mdp/arc/category/CategoryMng', component: ArcCategoryMng, name: '分类管理' },
            { path: '/mdp/arc/image/UploadAdd',component:UploadAdd,name:'图片管理'}
        ]
    }, 
    {
        path: '/oa',
        component: Home,
        name: '内容分发',
        iconCls: 'fa el-icon-menu',
        //leaf: true,//只有一个节点
        children: [
        	{ path: '/mdp/arc/archive/ArchiveMng/1', component: ArchiveMng, name: '文档分发' },
        	{ path: '/mdp/arc/send/sendPlan/SendPlanMng', component: SendPlanMng, name: '分发计划管理' },
        	{ path: '/mdp/arc/send/sendPlan/SendPlanMng/1', component: SendPlanMng, name: '分发结果' },
        	{ path: '/mdp/arc/archive/ArchiveMng/2', component: ArchiveMng, name: '分发模板设置' }
        ]
    },  

];

export default routes;