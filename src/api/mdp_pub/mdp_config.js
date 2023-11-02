/**
 *  BASE_API:对应api网关的外网访问地址，在config/dev.env.js 和 config/prod.env.js 中配置，
  * context:应用的上下文路径，即spring boot中的server.context-path,如果server.context-path为空，则取applicationName
 *  api的调用一般是 /${BASE_API}/${context}/${具体的后端服务路径}
 */

var sysName="唛盟智能开发";//系统名称，用于展示

export default {
  //登录相关
  getOauth2LoginContext:function(){
    return "oauth2client"
  },
  //短信相关
  getSmsContext: function() {
    return 'sms'
  },
  // 图片内容服务api路径
  getArcContext: function() {
    return 'arc'
  },

  // 图片内容服务api路径
  getFormContext: function() {
    return 'lcode'
  },
  // 低代码平台
  getLcodeContext: function() {
    return 'lcode'
  },
  // 工作流api路径
  getWorkflowContext: function() {
    return 'workflow'
  },
  // 协同办公系统api路径
  getOaContext: function() {
    return 'oa'
  },
  //项目管理
  getXmContext: function(){
    return 'xm'
  },
  //即时通讯
  getImContext:function(){
    return 'im'
  },
  //付款
  getPayContext:function() {
    return 'tpa'
  },
  //模块订单
  getMoContext(){
    return 'lcode'
  },
  // 系统管理api路径
  getSysContext: function() {
    return 'lcode'
  },
  getTpaContext: function(){
    return 'tpa'
  },
  // 商城管理后台api路径
  getMallmContext: function() {
    return 'mallm'
  },
  // 图片内容首页路径
  getArcIndexPath: function() {
    var uri=this.getApiBase()+"/"+this.getArcContext()+"/index.html"
    var uri=this.replaceUrl(uri)
    return this.getBaseDomainUrl()+uri;
  },
  // 图片展示或下载路径
  getArcFileUploadBasePath: function() {
    var uri=this.getApiBase()+"/"+this.getArcContext()
    var uri=this.replaceUrl(uri)
    return this.getBaseDomainUrl()+uri;
  },
  //excel上传路径
  getExcelUploadBasePath:function(){
    var uri=this.getApiBase()+"/"+this.getArcContext()
    var uri=this.replaceUrl(uri)
    return this.getBaseDomainUrl()+uri;
  },
  // 图片展示或下载路径
  getArcImagePath: function() {
    var uri=this.getApiBase()+"/"+this.getArcContext()
    var uri=this.replaceUrl(uri)
    return this.getBaseDomainUrl()+uri;
  },
  // 系统管理首页路径
  getSysIndexPath: function() {
    return '/'+this.getSysContext()+'/index.html'
  },
  // 商城管理后台首页路径
  getMallmIndexPath: function() {
    return '/mallm/mallm/index.html'
  },
  getWorkFlowEditorUrl: function() {
    return this.getWorkflowContext()+'/'+ process.env.VERSION + '/editor/editor/indexIframe.html'
  },

  getApiBase:function(){
    var base=`/${process.env.BASE_API}/${process.env.VERSION}/`
    return base.replace("//","/")
  },
  replaceUrl:function(url){
    url=url.replace("//","/")
    return url
  },
  //当前系统域名
  getBaseDomainUrl:function(){
    var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
    return curlDomain
  },
  getFixedDomain:function(){
    return "https://www.maimengcloud.com"
  },
  //系统名称
  getSysName: function() {
    return sysName
  },
  getWxpubConfig:function(){
    var config={
      appid:'wx2671d5db8346b6fc',
      appname:'唛盟项目管理平台',
      appType:'wxopen',
      scope:'snsapi_login'
    }
    return config;
  },
  /**
   * 本系统支持的动态组件编号列表
   * @returns
   */
  getSupportComponents:function(){
    return ['myFocus']
  }

}
