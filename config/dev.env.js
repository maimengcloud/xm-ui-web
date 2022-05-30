module.exports = {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',//环境版本号 如npm run build:${ENV_CONFIG},建议与spring.profiles.active=${ENV_CONFIG}一一对应
  VERSION: '"m1"',//产品版本号，nginx中通过此版本号导航到不同的静态资源目录，请求路径中用法如下：静态页面url=${DOMAIN}/${CONTEXT}/${VERSION}/#/{router.path}?${queryString}
  CONTEXT:'"xm"',//对应spring中的server.context-path
  BASE_API: '"api"'//api访问的统一入口,最后形成的apiUrl=${BASE_API}/${VERSION}/${spring.application.name}/${CONTEXT}/${ctrlUrl}
}
