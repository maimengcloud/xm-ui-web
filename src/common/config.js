/**
 *  BASE_API:对应api网关的外网访问地址，在config/dev.env.js 和 config/prod.env.js 中配置，
 *  applicationName:微服务编号，即spring boot中的spring.application.name
 *  contextPath:应用的上下文路径，即spring boot中的server.context-path
 *  api的调用一般是 /${BASE_API}/${applicationName}/${contextPath}/${具体的后端服务路径}
 */

var sysName = 'oa协同办公系统'// 系统名称，用于展示

export default {
  getOauth2LoginBasePath:function(){
    return "/oauth2client"
  },

  getBaseDomainUrl:function(){
    return "https://www.qingqinkj.com"
  },

  getSysName: function() {
    return sysName
  },
  getSmsBasePath: function() {
    return '/sms/sms'
  },
  // 图片内容服务api路径
  getArcBasePath: function() {
    return '/arc/arc'
  },

  // 图片内容服务api路径
  getFormBasePath: function() {
    return '/form/form'
  },
  // 工作流api路径
  getWorkflowBasePath: function() {
    return '/workflow/workflow'
  },
  // 协同办公系统api路径
  getOaBasePath: function() {
    return '/oa/oa'
  },
  // 图片内容首页路径
  getArcIndexPath: function() {
    return '/arc/arc/index.html'
  },
  getBaseDomainUrl: function() {
    return window.location.protocol + '//' + window.location.host + '/api/' + process.env.VERSION
  },
  // 图片展示或下载路径
  getArcFileUploadBasePath: function() {
    return window.location.protocol + '//' + window.location.host + '/api/' + process.env.VERSION + '/arc/arc'
    // return process.env.BASE_API+'/arc/arc'
  },
  //excel上传路径
  getExcelUploadBasePath:function(){
    return window.location.protocol + '//' + window.location.host + '/api/' + process.env.VERSION + '/oa/oa'
  },
  // 图片展示或下载路径
  getArcImagePath: function() {
    return window.location.protocol + '//' + window.location.host + '/api/' + process.env.VERSION + '/arc/arc'
    // return process.env.BASE_API+'/arc/arc'
  },
  // 系统管理api路径
  getSysBasePath: function() {
    return '/sys/sys'
  },
  // 系统管理首页路径
  getSysIndexPath: function() {
    return '/sys/sys/index.html'
  },
  // 商城管理后台api路径
  getMallmBasePath: function() {
    return '/mallm/mallm'
  },
  // 商城管理后台首页路径
  getMallmIndexPath: function() {
    return '/mallm/mallm/index.html'
  },
  getWorkFlowEditorUrl: function() {
    return '/workflow/' + process.env.VERSION + '/editor/editor/indexIframe.html'
  },
  getXmBasePath: function(){
    return '/xm/xm'
  },
  getCoreBasePath: function(){
    return '/xm/xm'
  },
  getImBasePath:function(){
    return '/im/im'
  },
  getPayBasePath:function() {
    return '/tpa/pay'
  }


}
