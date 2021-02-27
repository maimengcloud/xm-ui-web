const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token, 
  userInfo: state => state.user.userInfo,
  workShop:state=>state.user.workShop,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  myDepts: state => state.user.myDepts,
  myShops: state => state.user.myShops,
  myLocations: state => state.user.myLocations,
  myBranchs: state => state.user.myBranchs,
  myMenus: state => state.user.myMenus,
  myPosts: state => state.user.myPosts,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  added: state => state.permission.added,
  isLoadOk:state=>state.user.isLoadOk
}
export default getters
