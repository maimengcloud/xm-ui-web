<p align="center">
	<a href="https://maimengcloud.com/"  target="_blank">
	    <img src="https://maimengcloud.com/img/728c2dec5c1055349455.png" width="400" alt="logo">
	</a>
</p>
<p align="center">
	<strong>唛盟企业级研发管理系统(xm)：涵盖项目规划、需求管理、开发迭代、版本控制、缺陷跟踪、测试管理、工时管理、效能分析等环
节，实现项目全过程、全方位管理的一站式devOps解决方案</strong>
</p>

<p align="center">
	<a target="_blank" href="https://gitee.com/qingqinkj/mdp-lcode-ui-web">
        <img src='https://gitee.com/maimengcloud/xm-ui-web/badge/star.svg?theme=gvp' alt='gitee star'/>
    </a> 
</p>
<p align="center">
	👉 <a target="_blank" href="https://maimengcloud.com/xm/m1">https://maimengcloud.com</a>  👈
</p>

## 快速导航 
- [唛盟-后端开发底座](https://gitee.com/qingqinkj/mdp-core) 
- [前端组件](https://e.gitee.com/qingqinkj/repos/qingqinkj/mdp-lcode-ui-web/sources)
- [后端服务](https://e.gitee.com/qingqinkj/repos/qingqinkj/mdp-lcode-backend/sources)  
- [体验环境](https://maimengcloud.com/lcode/m1/) 
  登陆界面上选择演示账号登陆或者直接扫码登陆，无须注册

## 📢 简介[唛盟低代码开发平台mdp-lcode](/)
唛盟低代码开发平台简称唛盟或者mdp. 
唛盟旨在为企业开发业务系统提供一整套解决方案，唛盟具有高效率、低代码、功能丰富等特点。企业可以在唛盟工程之上，加入更多其它业务功能；也可以以唛盟作为模板，创建新的工程，用于开发其它业务。使用唛盟构建应用，您不用考虑多租户、登录、统一认证中心、权限、菜单管理、系统管理、公共组件、公共api、代码冗余、数据字典、图片库、文件库、智能表单、工作流、微服务互相调用、全局跟踪定位bug、多主键crud,复杂sql查询等各种问题，这些问题的解决方案都作为扩展功能内置唛盟工程中了。  
💪给你一个使用唛盟的理由：代码大量减少、开发so easy、前后端MIT协议、全部开源、永久免费

### 唛盟主体工程
唛盟属于前后端严格分离的一套系统，分为前端工程、后端工程两部分
- [mdp-lcode-ui-web](https://gitee.com/qingqinkj/mdp-lcode-ui-web)
唛盟的前端工程,以vue.js为主
- [mdp-lcode-backend](https://gitee.com/qingqinkj/mdp-lcode-backend)
唛盟的后端工程，java语言为主  

### 配套工程
- [mdp-code-generator](https://gitee.com/qingqinkj/mdp-code-generator) 代码生成器  
生成代码两种方式，  
一、使用代码生成器本地工程，好处是代码可以直接覆盖到本地业务工程，避免复制黏贴出错。  
二、如果不需要本地生成代码，也可以在低代码平台在线生成。[在线生成代码](https://maimengcloud.com/lcode/m1/#/mdp/lcode/gen)  
- [mdp-sys-backend](https://gitee.com/qingqinkj/mdp-sys-backend)   
  登陆、角色管理、权限管理、组织、人员、菜单、部门、元数据等管理功能的服务接口，默认打包合并到mdp-lcode-backend中，如果不涉及改动，无须关注该工程
  
- [mdp-core](https://gitee.com/qingqinkj/mdp-core)   
  该工程作为所有后端的公共封装，不包含任何的业务功能，仅作为后端系统的技术底座，包含一些公共工具、服务类抽象、dao层抽象等。  
  默认打包进mdp-lcode-backend中，一般无须理会  


>⚠️注意：企业可以单独使用mdp-lcode-ui-web作为前端，单独开发后端系统；也可以使用**唛盟团队** 配套开源的后端系统[mdp-lcode-backend](https://gitee.com/qingqinkj/mdp-lcode-backend)作为后端服务。  


## 😭 日常开发中，您是否有以下痛点？

- **团队中缺乏企业级前后端分离的开发底座**，需要在各种框架中进行摸索、整合。
- 重复造轮子现象严重、浪费人力、对开发者经验要求过高。
- 缺乏统一的开发模式，缺乏公共组件的抽取和共享机制，导致业务代码混乱不堪、代码臃肿、bug多、维护困难
- 缺乏统一的足够灵活的权限管理机制，开发人员不得不写一堆的权限代码混入业务代码中，前端权限、后端权限控制混乱不堪
- 缺乏统一的能够覆盖前后端的、满足前后端分离的代码生成器，代码模板无法按企业现状进行重新编辑、修改
- 缺乏统一的编程规范，或者具有书面编程规范，难以贯彻落实到开发中，代码还是五花八门
- 缺乏统一的元数据(数据字典)管理机制，前后的数据共享调用困难，下拉列表数据混乱不堪
- 缺乏统一的流程管理机制，要想进行流程类业务开发非常困难
- 缺乏统一的国际化机制，国际化实施困难，不得不针对各种语言发布多个版本，无法解决后端国际化、前端国际化等问题
- 缺乏统一的微服务、分布式系统整合机制，微服务互相调用、微服务的权限管理困难
- 缺乏统一的认证中心，单点登录实施困难
- 缺乏统一的支付整合机制，接入微信、支付宝、paypal等困难
- 缺乏项目管理工具，项目计划、任务委派、质量管理、需求管理、持续集成等完全没概念
- **让 唛盟-mdp 来帮你解决这些痛点吧！然而，这些只是 唛盟-mdp 解决的最基础的功能。**

## 😁 为什么要使用 [唛盟-mdp](https://gitee.com/qingqinkj/mdp-core)

- 完全开源、永久免费的企业级开发底座
  1. 使用mdp能够带来开发效率的大幅提升，代码行数大幅减少，质量提升明显
  2. 使用mdp能够大幅度降低对开发人员的经验要求，大幅度降低人力成本
  3. mdp对各种开源组件进行了融合改进，提供了针对企业开发中各种问题的最佳解决方案
  4. 企业使用一套开源软件即同时拥有前端开发框架及后端开发框架

- 统一的开发模式
  1. 前后端分离
  2. 前后端都分别进行了技术组件、业务组件的抽取、共享，企业可以进行再提炼、抽象，形成更多的公共组件，对后续开发形成强力的支撑作用

- 足够灵活的权限管理机制
  1. 前端提供统一的按钮级别的权限判断接口、提供路由菜单的权限控制机制
  2. 后端实现api接口的自动注册、自动审核
  3. 基于岗位-部门-角色-菜单及按钮-后端api-人员 6要素的权限管理机制，可以0编程实现绝大多数的权限需求

- 基于领域驱动设计(DDD)的框架及代码生成器
  1. 代码生成器覆盖前端、后端，支持任意时刻的重新生成，支持命令行、开发工具插件、在线三种方式生成代码，生成的代码可以0编程使用
  2. 代码生成器代码模板可以按企业现状进行修改、满足不断发展、持续改进的需求
  3. 支持多个表一次性生成，也就是可以一次性生成几十到几百张表的增删改查功能，而开发人员仅需要填写表名即可完成

- 提供完整的编程规范说明
  1. mdp的框架提供了完备的接口说明、组件说明、组件使用场景等
  2. mdp维护团队提供在线支持，及时解答、解决开发者使用过程中的问题

- 提供强大的元数据(数据字典)管理机制
  1. 内置了元数据管理模块，并实现了元数据的分布式缓存、客户端缓存、元数据分发、缓存清理等
  2. 开发者在客户端、任意微服务中、任意单体应用中可以快速获取元数据
  3. 元数据的调用效率等同于调用本地map缓存，几乎可以忽略使用元数据的性能开销问题

- 整合了最新版本的强大的flowable工作流引擎
  1. 基于mdp框架重新开发了流程中心、任务中心、流程的发布、上下架等功能
  2. 提供分布式环境下的流程调用、流程整合问题的解决方案
  3. 提供在线流程设计器，并整合了mdp的权限机制

- 提供强大的国际化解决方案
  1. 前后端均支持分别进行国际化
  2. 多语言的支持与业务代码完全解耦，彻底解决硬编码进行语言切换的问题

- 整合了强大的微服务框架
  1. mdp平台任意组件均同时支持微服务环境、单体应用环境运行，开发人员开发的时候可以以单体应用的方式开发，然后以微服务方式发布到生产、测试环境
  2. 提供微服务的治理

- 强大的DAO层
  1. 支持基于xml文件的sql编写
  2. 支持无xml方式的数据访问
  3. 支持多主键（对mybatis plus进行升级，解决了多主键、多表联合查询等问题）
  4. 支持多数据源，通过备注实现数据源切换
  5. 支持前端构建任意复杂的查询条件并提供对应的最佳实践，支持前端输入框输入>,=,*,$IS NULL,$IN,$NOT IN等运算操作符，支持前端通过 or and 连接符构建任意复杂的条件表达式

- 强大的web ui
  1. 提供好用好看的ui组件库
  2. 提供页面高级查询功能、可以组装任意复杂的查询条件
  3. 提供针对元数据(数据字典)的引用、针对任意表的引用的组件库
  4. 提供导入、导出等基础功能
  5. 提供按钮权限判断接口、
  6. 提供动态菜单功能

- 提供自定义表单解决方案
  1. 自定义表单设计
  2. 表单展现
  3. 表单数据管理
  4. 自定义表单与工作流整合使用
  5. 自定义表单发布成普通菜单

- 整合了微信支付、支付宝支付、paypal支付
  1. 提供支付、订单、支付通知底层框架，可以快速整合各种支付功能
  2. 整合了微信支付功能，进行配置文件更新即可使用
  3. 整合了支付宝支付功能，进行配置文件更新即可使用
  4. 整合了paypal支付，进行配置文件更新即可使用

- 整合了oauth2.0框架
  1. 提供oauth2.0的整体框架，构建统一认证中心、单点登录等不再是难事
  2. 整合了微信、支付宝、手机验证码、账户密码等登录方式

## 💪 内置功能

```
角色权限
	├── 角色管理                  => 角色crud、分配菜单、分配权限
	├── 权限定义                  => 权限crud
	├── 菜单管理                  => 菜单(按钮)crud、分配菜单(按钮)给角色、
	├── 模块管理                  => 模块crud
	├── 已开模块                  => 查看企业(个人)已开通的模块
	 
组织管理
	├── 机构管理                  => 企业信息维护、管理员维护、账户信息维护、企业产品维护、
	├── 用户管理                  => 用户的crud、分配岗位、分配部门、重置密码、邀请
	├── 部门管理                  => 部门curd、分配岗位到部门、查看部门用户
	├── 公司管理                  => 公司curd（超级管理员使用）
	├── 岗位管理                  => 岗位curd、分配角色到岗位、岗位人员查看
	├── 注销审核                  => 审核用户的注销申请
平台管理
	├── 平台配置                  => 配置平台的信息
	├── 个人认证审核               => 审核个人的实名认证请求
	├── 企业认证审核               => 审核企业的实名认证请求
元数据管理
	├── 字典管理                  => 数据字典的crud
	├── 列表维护                  => 下拉列表数据项的crud
	├── 参数定义                  => 公共系统参数的crud
审批中心
	├── 待执行                    => 我的待执行任务查询、任务执行
	├── 日历任务                  => 我的待执行任务查询、任务执行
	├── 发起流程                  => 发起流程
审批监控
	├── 我发起的流程                  => 查询我发起的流程
	├── 我监控的流程                  => 查询我监控的流程、催办
	├── 我参与的流程                  => 查询我参与过的流程
流程模型
	├── 流程编辑器                => 在线流程编辑器
	├── 模型发布                  => 流程模型发布
	├── 模型设置                  => 设置流程与智能表单的关联、模型的启动条件、审批人、权限等
低代码
	├── 表单中心                  => 智能表单的门户
	├── 表单设计                  => 进行智能表单设计、权限设置、在线查看源代码等
	├── 数据录入、查询             => 查询表单已录入的数据
	├── 代码生成器                 => 在线生成crud的前端页面代码(表单、表格、api)，后端代码（控制层、服务层、dao层代码），前后端0修改即可正常运行
```

## 组件库[mdp-ui](/src/components/mdp-ui)  

mdp封装了几十个ui组件,使用mdp-ui与不使用mdp-ui的区别：写100行代码还是写1行代码的区别，代码量的减少立竿见影
- [mdp-ui](/src/components/mdp-ui)  
mdp的核心组件，该组件库为纯前端页面组件，无须配置任何后端api接口即可正确运行
- [mdp-ui-ext](/src/components/mdp-ui-ext)  
基于mdp-ui扩展的带有对接后台api业务加载能力的业务组件

>⚠️注意：先行体验一把[mdp-ui组件效果预览](https://maimengcloud.com/lcode/m1/#/mdp/lcode/index)

### ⚙快速开始
>找到[main.js](/src/main.js) 添加下面代码
```js
//mdp-ui 基础组件
import MdpComponents from '@/components/mdp-ui/index.js'
Vue.use(MdpComponents)

//mdp-ui-ext拓展的组件
import MdpUiExtComponents from '@/components/mdp-ui-ext/index.js'
Vue.use(MdpUiExtComponents) 

// 公共api
import mdp from "@/api/mdp_pub"; 
Vue.prototype.$mdp = mdp;

```

### [mdp-dialog](/src/components/mdp-ui/mdp-dialog)  
弹框，可以把任意页面装配成弹框，无须定义多余的变量及函数  
- 相对于el-dialog来说，要使用弹窗，事情还真不少。需要定义visible变量，定义showDialog,closeDialog两个函数，最关键一点是如果要父页面传递参数到窗口内组件，还得在父页面定义一个变量，通过props属性传递。相当麻烦。如果某个功能弹窗特别多，会有一堆的控制弹窗的变量及函数，非常恶心。mdp-dialog则完全解决上述问题。

### [mdp-table](/src/components/mdp-ui/mdp-table)  
表格，内置了增、删、改、查、高级查询、重置查询、导出、列配置、分页、批量编辑等功能、内置了对按钮权限的控制机制  
功能非常强大，懂的都懂。

- 综合管理  
![综合管理表格](/docs/images/ui-components/table-mng.jpg)  
- 可编辑表格    
![可编辑表格](/docs/images/ui-components/edit-table.jpg)  
- 可编辑-树状表格    
![可编辑-树状表格](/docs/images/ui-components/left-right-tree-table.jpg)  

### [mdp-select](/src/components/mdp-ui/mdp-select)  
下拉列表，支持对数据字典、元数据的引用，支持对任意小表表格数据的引用，支持参数化加载后台数据，对后台加载的数据进行缓存   
![mdp-select](/docs/images/ui-components/select-origin.jpg)  

### [mdp-select-table](/src/components/mdp-ui/mdp-select-table)  
超大表格下拉列表，与mdp-select相比，该组件具有分页查询功能   
![分页选择表格数据](/docs/images/ui-components/big-table-select.jpg)  

### [mdp-select-user](/src/components/mdp-ui-ext/mdp-select-user)  
用户选择下拉列表，与mdp-select-table组件类似，仅仅针对用户的头像做了特殊处理  
![用户选择](/docs/images/ui-components/select-user.jpg)  

### [mdp-input](/src/components/mdp-ui/mdp-input)  
输入框

### [mdp-date](/src/components/mdp-ui/mdp-date)  
日期

### [mdp-date-range](/src/components/mdp-ui/mdp-date-range)  
区间日期

### [mdp-number](/src/components/mdp-ui/mdp-number)  
数字输入

### [mdp-hi-query](/src/components/mdp-ui/mdp-hi-query)  
高级查询，可以由用户自定义任意复杂的查询条件  
![高级查询](/docs/images/ui-components/hi-query.jpg)  

### [mdp-table-configs](/src/components/mdp-ui/mdp-table-configs)  
表格配置，用于控制表格的列显示与否  
![表格配置列显示隐藏](/docs/images/ui-components/table-column-configs.jpg)  

### [mdp-transfer](/src/components/mdp-ui/mdp-transfer)  
穿梭框

### [mdp-cate-tree](/src/components/mdp-ui-ext/mdp-cate-tree)  
文档、文章目录树

### [mdp-expand](/src/components/mdp-ui-ext/mdp-expand)  
智能表单相关组件

### [mdp-ext-infos](/src/components/mdp-ui-ext/mdp-ext-infos)  
自动扩展字段信息


### [mdp-image](/src/components/mdp-ui-ext/mdp-image)  
图片库，图片的增删改查、上传、下载

### [mdp-select-image](/src/components/mdp-ui-ext/mdp-select-image)  
图片选择器,支持图片的上传下载、上传后的统一管理、共享

### [mdp-select-dept](/src/components/mdp-ui-ext/mdp-select-dept)  
部门选择，支持树状机构，异步加载，支持分页查询，任意大数据量

### [mdp-select-att](/src/components/mdp-ui-ext/mdp-select-att)  
附件库,支持附件的上传下载、上传后的统一管理、共享

### [mdp-select-cate](/src/components/mdp-ui-ext/mdp-select-cate)  
文档、文章目录树选择器

### [mdp-select-tag](/src/components/mdp-ui-ext/mdp-select-tag)  
标签库,支持标签的统一管理、共享


### [mdp-meta-item](/src/components/mdp-ui-ext/[mdp-meta-item)  
元数据管理库、支持元数据的crud

### [mdp-meta-option](/src/components/mdp-ui-ext/mdp-meta-option)  
元数据管理库-列表数据组件、支持列表数据的crud

### [mdp-rich-text](/src/components/mdp-ui-ext/mdp-rich-text)  
富文本编辑器，整合了mdp-select-image作为插件

## 🔃 api
- [api](/src/api/)  
业务api，哪里用到哪里就单独引入
### [api/mdp_pub/index.js](/src/api/mdp_pub/index.js)  
公共api总入口,注册到vue全局函数中，可以在页面中任意地方直接使用,公共api总入口，如需要添加公共api,请在此文件添加  
### [mdp_api_base.js](/src/api/mdp_pub/mdp_api_base.js)  
为mdp框架核心的与后端交互的api,自动注册为全局公共函数，可通过$mdp.xxx调用，可改，但不要新增，删除任何一个api.
### [mdp_api_ext.js](/src/api/mdp_pub/mdp_api_ext.js)  
为mdp扩展的组件与后端交互的api,自动注册为全局公共函数，可通过$mdp.xxx调用，可改，但不要新增，删除任何一个api.
### [mdp_api_biz.js](/src/api/mdp_pub/mdp_api_biz.js)  
为mdp扩展的组件与后端交互的api,自动注册为全局公共函数，可通过$mdp.xxx调用，可改,可新增必要的api.

```html
<el-button @click="$mdp.xxxApi()"/>
```
```js
  this.$mdp.xxxApi()
```
- [login](/src/api/login.js)  
登录相关api 

## ↕️ 指令
- [v-adaptive](./directive/el-table/index.js) 
让表格自动适应，表格底部始终保持距离视窗底部一定距离(默认 30px)
```
<el-table v-adaptive="{bottomOffset:30}"/>
```



## ⌨ 技术栈

vue全家桶 + element-ui + axios

## 💻 样例项目

- [低代码平台] (https://maimengcloud.com/lcode/m1/)
- [系统管理] (https://maimengcloud.com/sys/m1/)
- [协同办公] (https://maimengcloud.com/oa/m1/)
- [项目管理] (https://maimengcloud.com/xm/m1/)
- [流程管理] (https://maimengcloud.com/workflow/m1/)

## ⚙ 快速开始

>⚠️注意：该项目使用 element-ui@2.3.0+ 版本，所以最低兼容 vue@2.5.0+

### 前序准备

- 你的本地环境需要安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。我们的技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) and [element-ui](https://github.com/ElemeFE/element)，提前了解和学习这些知识会对使用本项目有很大的帮助。

- 该项目属于网页版前端项目，所有api由 [mdp-lcode-backend](https://gitee.com/qingqinkj/mdp-lcode-backend)提供，请下载该项目

- 代码生成器下载 [mdp-code-generator](https://gitee.com/qingqinkj/mdp-code-generator) 也可以在低代码平台在线生成

### 开发
```bash
# 克隆项目
git clone https://gitee.com/qingqinkj/mdp-lcode-ui-web.git

# 安装依赖
npm install
   
# 建议不要用cnpm安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```
浏览器访问 http://localhost:8015

#### 登录相关
登录api，对接后台接口有两种方式，分别为对接统一认证中心、对接mdp-lcode-backend
默认对接mdp-lcode-backend中的登录模块，如果想切换，更改[mdp_config.js中的getOauth2LoginContext函数即可](src/api/mdp_pub/mdp_config.js) 
- 对接统一认证中心进行登录
```js
  getOauth2LoginContext:function(){
    return "oauth2client"
  }
```
- 对接mdp-lcode-backend进行登录
```js
  getOauth2LoginContext:function(){
    return "lcode"
  }
```
### 发布
```bash
# 构建测试环境
npm run build:sit

# 构建生成环境
npm run build:prod
```

### 🔔️ 特别提醒

mdp 3.0 版本已经开始规划更新了，尽请期待新版本的诞生吧

### 🗒️ 版本更新日志

升级前必看：[CHANGELOG.md](/docs/CHANGELOG.md) 


## 🚀 基于mdp框架拓展的开源项目
>⚠️ 注意：以下拓展的框架或者子系统，由mdp开源团队基于项目经验进行总结抽取，可用可不用，可以以jar包方式合并到现有工程进行发布，也可单独发布成单体应用、微服务应用

- 第三方支付框架,整合了微信支付、支付宝支付、paypal支付
  1. [mdp-tpa-pay-backend](https://gitee.com/qingqinkj/mdp-tpa-pay-backend) 后端

- 即时通讯框架
  1. [mdp-im-uniapp](https://gitee.com/qingqinkj/mdp-im-uniapp) 前端app
  2. [mdp-im-web](https://gitee.com/qingqinkj/mdp-im-web) 前端浏览器
  3. [mdp-im-backend](https://gitee.com/qingqinkj/mdp-im-backend) 后端

- 统一认证中心框架
  2. [mdp-oauth2-backend](https://gitee.com/qingqinkj/mdp-oauth2-backend) 后端

- 微服务框架
  1. [mdp-cloud-backend](https://gitee.com/qingqinkj/mdp-cloud-backend) 后端

- 工作流管理子系统
  1. [mdp-workflow-ui-web](https://gitee.com/qingqinkj/mdp-workflow-ui-web) 前端 
  2. [mdp-workflow-backend](https://gitee.com/qingqinkj/mdp-workflow-backend) 后端

- 低代码平台
  1. [mdp-lcode-ui-web](https://gitee.com/qingqinkj/mdp-lcode-ui-web) 前端 
  2. [mdp-lcode-backend](https://gitee.com/qingqinkj/mdp-lcode-backend) 后端

- 内容管理子系统
  1. [mdp-arc-ui-web](https://gitee.com/qingqinkj/mdp-arc-ui-web) 前端
  2. [mdp-arc-backend](https://gitee.com/qingqinkj/mdp-arc-backend) 后端

- 短信子系统
  1. [mdp-sms-ui-web](https://gitee.com/qingqinkj/mdp-sms-ui-web) 前端
  2. [mdp-sms-backend](https://gitee.com/qingqinkj/mdp-sms-backend) 后端

- 项目管理子系统
  1. [xm-crowd-ui-web](https://gitee.com/qingqinkj/xm-crowd-ui-web) 前端众包 
  2. [xm-ui-web](https://gitee.com/qingqinkj/xm-ui-web) 前端管理端
  3. [xm-backend](https://gitee.com/qingqinkj/xm-backend) 后端

- 财务管理子系统
  1. [ac-core-ui-web](https://gitee.com/qingqinkj/ac-core-ui-web) 前端管理端
  2. [ac-backend](https://gitee.com/qingqinkj/ac-backend) 后端


## 📝 常见问题、操作说明 
- [FQA](https://maimengcloud.com/#/openCommunity/fqa) 

## 💯 实践案例

1. [低代码平台](https://maimengcloud.com/lcode/m1/)
1. [系统管理](https://maimengcloud.com/sys/m1/)
2. [协同办公](https://maimengcloud.com/oa/m1/)
3. [唛盟众包-网页](https://maimengcloud.com) 
3. [项目管理-网页](https://maimengcloud.com/xm/m1/) 
4. 项目管理-小程序   
   <img src="https://maimengcloud.com/img/77639c6907935d3b699f.png" alt="drawing" width="200"/>
5. [流程管理](https://maimengcloud.com/workflow/m1/)

## 🔨贡献指南

### 贡献须知

mdp 作为开源项目，离不开社区的支持，欢迎任何人修改和提出建议。贡献无论大小，你的贡献会帮助背后成千上万的使用者以及开发者，你做出的贡献也会永远的保留在项目的贡献者名单中，这也是开源项目的意义所在！

为了保证项目代码的质量与规范，以及帮助你更快的了解项目的结构，请在贡献之前阅读：

- [mdp 贡献说明](https://gitee.com/qingqinkj/mdp-core/blob/master/docs/CONTRIBUTE.md)

### 贡献步骤

1. Fork 本仓库。

2. Fork 后会在你的帐号下多了一个和本仓库一模一样的仓库，把你帐号的仓库 clone 到本地。

   注意替换掉链接中的`分支名`和`用户名`。

   如果是贡献代码，分支名填 `dev`；如果是贡献文档，分支名填 `docs`

   ```bash
   git clone -b 分支名 https://gitee.com/用户名/mdp-lcode-ui-web.git
   ```

3. 修改代码/文档，修改后提交上来。

   ```bash
   # 把修改的文件添加到暂存区
   git add .
   # 提交到本地仓库，说明你具体做了什么修改
   git commit -m '填写你做了什么修改'
   # 推送到远程仓库，分支名替换成 dev 或者 docs
   git push origin 分支名
   ```

4. 登录你的仓库，然后会看到一条 PR 请求，点击请求合并，等待管理员把你的代码合并进来。

### 项目分支说明

| 分支     | 说明                                            |
|--------|-----------------------------------------------|
| master | 主分支，受保护分支，此分支不接受 PR。在 dev 分支后经过测试没问题后会合并到此分支。 |
| dev    | 开发分支，接受 PR，PR 请提交到 dev 分支。                    |


## 🐞 交流讨论 、反馈 BUG、提出建议等

1. 快扫描下方左侧微信二维码和我们一起交流讨论吧！（备注 唛盟-mdp 进群） 
<img src="https://maimengcloud.com/img/5ff0a747a4a1f14cf6a5.png" alt="drawing" width="200"/>

2. 唛盟微信公众号查看一些基础教程  
<img src="https://maimengcloud.com/img/f3f91bac3a3735264a66.png" alt="drawing" width="200"/>

3. 反馈 BUG、提出建议，欢迎新建：[issues](https://gitee.com/qingqinkj/mdp-lcode-ui-web/issues)，开发人员会不定时查看回复。
4. 参与贡献，请查看[贡献指南](#🔨贡献指南)。

## 💲 打赏
 **感谢所有赞赏以及参与贡献的小伙伴，你们的支持是我们不断更新前进的动力！微信扫一扫，赏杯咖啡呗！**    
 <img src="https://maimengcloud.com/img/97094cc1553fe0b0046c.jpg" alt="drawing" width="300"/>

## 🔔商务合作 

序号|合作项目| 详细介绍 | 费用说明|
----------------------|------------|----------------------|-----|
1.| 打赏获得赞助商名额| 在赞助商列表展示（添加微信沟通） |不限额度|
2.| 新组件开发| 提供组件扩展、优化服务 |500元/每个组件起步，视复杂程度而定|
3.| 开发问题解答|如果使用该产品遇到棘手问题需要解决，添加微信进行沟通解决 |250元/一次 限一个小时的工作时长，超过1个小时无法解决，退款一半或者延时1个小时，还不能解决，全额退款|
4.| 开发培训|提供开发流程介绍、技术介绍、功能介绍、部署流程介绍，仅限线上培训 |500元/课程 时长2小时
5.| 扩展问题解答|如果需要使用该产品进行自有业务系统研发，需要我方提供意见建议，我方收取一定费用后提供相应服务 |2000元/一次 限8小时的工作时长，超出8个小时双方无法达成一致意见，退500元，如需加时处理按250/小时计算加时费用。|
6.| 广告合作|广告位(精品项目推荐、赞助商展位) |加微信沟通|

