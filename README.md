# To start

这是一个项目管理系统项目，满足大中型it项目的全生命周期管理,包括项目立项、项目预算、项目计划、项目测试、任务管理、迭代管理、产品管理、用户故事管理、团队管理、文档管理、环境管理等，由广州擎勤网络科技有限公司研发。



` 前端`

# 前端开发工具
 node.js、webpacck、npm、eclipse、svn、安卓、ios等
 
# 前端ui-pc端
vue.js、element-ui、axios

# 前端ui-手机端
vue.js、vux、weui、weex

# 前端ui-微信公众号端
vue.js、vux

# 前端ui-微信小程序
微信开发工具


# 前端文件结构
* build - webpack config files
* config - webpack config files
* dist - build
* src -your app
    * api
    * assets
    * common
    * components - your vue components
    * mock
    * styles
    * views - your pages
    * vuex
    * App.vue
    * main.js - main file
    * routes.js
* static - static assets

# 前端web开发工具安装步骤 首次安装执行 1-6，添加工程执行 7-12
## 1 安装node.js 从网络下载最新稳定版本
node-v8.9.1-x64

## 2 安装 npm
npm install npm@latest -g

## 3 设置淘宝镜像及安装淘宝镜像命令cnpm （如有必要）
npm config set registry https://registry.npm.taobao.org 

npm install -g cnpm --registry=https://registry.npm.taobao.org

## 4 通过镜像下载 node-sass（如有必要）
cnpm install --save-dev node-sass

## 5 安装vue 命令行工具 （如有必要）
npm install -g vue-cli

## 6 设置eclipse 关联 .vue文件 
Window -> Preferences -> General -> Editors -> File Associations -> Add -> *.vue -> Add -> HTML Editor / JS Editor / CSS Editor 

## 7 用eclipse 从svn下载工程项目
svn地址  http://203.195.131.73:8085/svn/
如工程  mdp-arc-web

## 8 进入工程 目录 （假设工程在 D:\workspace\mdp-arc-web）
cd /D D:\workspace\mdp-arc-web

## 9 安装工程依赖包
 D:\workspace\mdp-arc-web > npm install
 
## 10 开发调试工程
npm dev

## 11 编译
npm build

## 12 拷贝编译后文件到后台工程（用于与后台工程一起打成jar包发布）（如有必要）
npm copyToStatic



`服务端`
# 服务端开发工具
jdk8、eclipse oxygen、svn、maven、oracle

# 服务端编程框架
spring boot 1.5、spring mvc 4、spring cloud 1.5、spring security 4、logback 1、mybatis 3、thymeleaf 3

# 服务端安装开发工具步骤 首次安装执行 1-3,开发打包部署执行4-5
## 1 安装开发工具
### 1.0 安装jdk8,  elcipse oxygen, svn 官网下载64位版本
jdk-8u121-windows-x64 
eclipse-jee-oxygen-3-win32-x86_64
TortoiseSVN-1.9.7.27907-x64

### 1.1 配置eclipse运行内存
在eclipse.ini中添加下面几个参数
-Xms512m
-Xmx1024m

### 1.2 从eclipse marketplace 下载版本控制插件工具svn 
eclipse -> help -> Eclipse marketplace,搜索svn，安装subclipse4.2.3

#### 1.2.1 设置eclipse svn 忽略的文件规则 */logs/* */target/* */node_modules/*
Window -> Preferences -> Team -> Ignored Resource -> Add pattern -> */logs/*
Window -> Preferences -> Team -> Ignored Resource -> Add pattern -> */target/*
Window -> Preferences -> Team -> Ignored Resource -> Add pattern -> */node_modules/*

### 1.3 设置eclipse工程编码为utf-8
Window -> Preferences -> General -> Content Types -> java Archive / java class path / Text -> utf-8
Window -> Preferences -> General -> Workspace -> Text file encoding / UTF-8

### 1.4 设置eclipse jdk
Window -> Preferences -> Java -> Installed JREs -> 选择一条 -> Edit -> C:\Program Files\Java\jdk1.8.0_121(假设jdk安装目录，注意不是jre目录)

### 1.5 设置eclipse 检查项，提升编译速度
Window -> Preferences -> Validation -> 找到build列 -> 只保留 Classpath Dependance Validator 选中状态

## 2 下载代码生成器mdp-dev
### 2.0 从svn下载mdp-dev工程，mdp自研发的开发工具
svn 地址为 http://203.195.131.73:8085/svn/mdp/trunk/mdp-dev
 
### 2.1 使用mdp-dev生成crud代码（开发业务功能时使用，先设计表结构，再生成代码）
使用/mdp-dev/src/test/java/com/qqkj/mdp/dev/TestCodegenService.java 进行代码生成

## 3 maven 设置
### 3.0 设置maven私服 用户密码 
将/mdp-dev/settings.xml拷贝到 C:\Users\Administrator\.m2目录下

### 3.1 安装本地jar包到私服（如果有本地jar包，目前有orcale的驱动包已经安装）
私服登录地址 http://203.195.131.73:8081/nexus 用户名、密码 admin/admin123

## 4 应用项目开发
### 4.0 从svn下载应用工程项目
svn 地址为 http://203.195.131.73:8085/svn/应用产品对应目录

### 4.1 从mven私服下载依赖jar包
在  Eclipse 工程目录鼠标右键 -> Maven -> Update Project

### 4.2 运行工程项目
在src/main/java 中找到 ***Application。java -> 鼠标右键 -> Run as -> Java Application
或者
在src/test/java 中找到 ***Application。java -> 鼠标右键 -> Run as -> Java Application

## 5 打包部署
### 5.0 工程打jar包
在  Eclipse 工程目录鼠标右键 -> Run as -> Maven Install

### 5.1 将打包好的jar包上传maven私服
在  Eclipse 工程目录鼠标右键 -> Run as -> Maven Buil -> deploy 




``` bash
# install dependencies
cnpm install

# serve with hot reload at localhost:8081
cnpm run dev

# build for production with minification
cnpm run build

```
 
 
` 其它一些常用命令 `
# 清除缓存  
npm cache clean --force

# npm国内代理镜像服务器 镜像使用方法（三种办法任意一种都能解决问题，建议使用第三种，将配置写死，下次用的时候配置还在）:
npm config set registry https://registry.npm.taobao.org 
npm info underscore （如果上面配置正确这个命令会有字符串response）


# Browser support

Modern browsers and IE 10+.

# License
[MIT](http://opensource.org/licenses/MIT)
