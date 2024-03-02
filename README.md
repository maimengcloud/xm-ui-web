<p align="center">
	<a href="https://maimengcloud.com/"  target="_blank">
	    <img src="https://maimengcloud.com/img/728c2dec5c1055349455.png" width="400" alt="logo">
	</a>
</p>
<p align="center">
	<strong>唛盟xm：涵盖项目规划、需求管理、开发迭代、版本控制、缺陷跟踪、测试管理、工时管理、效能分析等环
节，实现项目全过程、全方位管理的一站式企业研发项目管理解决方案</strong>
</p>

<p align="center">
	<a target="_blank" href="https://gitee.com/maimengcloud/xm-ui-web">
        <img src='https://gitee.com/maimengcloud/xm-ui-web/badge/star.svg?theme=gvp' alt='gitee star'/>
    </a> 
</p>
<p align="center">
	👉 <a target="_blank" href="https://maimengcloud.com/xm/m1/">https://maimengcloud.com</a>  👈
</p>

## 快速导航
- [前端组件](https://gitee.com/maimengcloud/xm-ui-web)
- [后端服务](https://gitee.com/maimengcloud/xm-backend)
- [体验环境](https://maimengcloud.com/xm/m1/)
  登陆界面上选择演示账号登陆(账号密码：demo-branch-01 888888)或者直接扫码登陆，无须注册

## 📢 简介[唛盟xm](/)
唛盟企业级研发管理系统简称唛盟xm,属于唛盟生态的专业子系统之一，以研发管理为核心，涵盖项目规划、需求管理、开发迭代、版本控制、缺陷跟踪、测试管理、工时管理、效能分析等环节，实现全过程、全方位的研发管理。通过该系统，企业能够优化研发流程，提高研发效率，降低研发成本，提高市场竞争力。   
💪唛盟生态遵循 <strong>“一个底座+N个专业子系统”</strong> 的架构，基于同一个底座的各个专业子系统可以任意组合形成一个大的业务系统  
一个底座： [mdp-core](https://gitee.com/maimengcloud/mdp-core)  
N个专业子系统： [低代码mdp-lcode](https://gitee.com/maimengcloud/mdp-lcode-ui-web)、 
[账户、权限、组织管理mdp-sys](https://gitee.com/maimengcloud/mdp-lcode-backend/tree/master/mdp-sys)、
[第三方支付登录等mdp-tpa](https://gitee.com/maimengcloud/mdp-tpa-backend)、
[统一认证中心mdp-oauth2](https://gitee.com/maimengcloud/mdp-oauth2-backend)、
[内容管理mdp-arc](https://gitee.com/maimengcloud/mdp-arc-ui-web)、
[工作流mdp-workflow](https://gitee.com/maimengcloud/mdp-workflow-backend)、
[短信mdp-sms](https://gitee.com/maimengcloud/mdp-sms-ui-web)、
[代码生成器mdp-code](https://gitee.com/maimengcloud/mdp-code-generator) 、
[研发项目管理xm](https://gitee.com/maimengcloud/xm-ui-web)、
[即时通讯mdp-im](https://gitee.com/maimengcloud/mdp-im-web)、
[财务ac](https://gitee.com/maimengcloud/ac-core-ui-web)、
[协同办公oa](https://gitee.com/maimengcloud/oa-ui-web)  
上述专业子系统全部开源


### 唛盟xm主体工程
唛盟xm使用[唛盟低代码开发平台](https://gitee.com/maimengcloud/mdp-lcode-ui-web)开发，属于前后端严格分离的一套系统，分为前端工程、后端工程两部分
- [xm-ui-web 必须](https://gitee.com/maimengcloud/xm-ui-web)
  唛盟的前端工程,以vue.js为主
- [xm-backend 必须](https://gitee.com/maimengcloud/xm-backend)
  唛盟的后端工程，java语言为主
  
### 唛盟账号管理工程
唛盟xm的账户管理、组织管理、菜单管理等沿用唛盟低代码的功能
- [mdp-lcode-ui-web 必须](https://gitee.com/maimengcloud/mdp-lcode-ui-web)
唛盟低代码的前端工程,以vue.js为主
- [mdp-lcode-backend 必须](https://gitee.com/maimengcloud/mdp-lcode-backend)
唛盟低代码的后端工程，java语言为主  

### 高级配套工程
- [mdp-cloud-backend 非必须](https://gitee.com/maimengcloud/mdp-cloud-backend)   
  该工程作为spring cloud的扩展工程，如果需要将系统发布到spring cloud环境，需要下载该工程重新打包，不包含任何的业务功能，仅作为后端接入cloud环境使用

- [mdp-oauth2-backend 非必须](https://gitee.com/maimengcloud/mdp-oauth2-backend)   
  该工程为统一认证中心，作为spring oauth2的扩展工程，如果需要将系统接入oauth2环境，需要下载该工程重新打包，该工程实现分布式单点登陆；支持微信、支付宝、短信、账户密码等多种登陆方式

### 开发辅助工具
- [mdp-code-generator 非必须](https://gitee.com/maimengcloud/mdp-code-generator) 代码生成器  
  生成代码两种方式，  
  一、使用代码生成器本地工程，好处是代码可以直接覆盖到本地业务工程，避免复制黏贴出错。  
  二、如果不需要本地生成代码，也可以在低代码平台在线生成。[在线生成代码](https://maimengcloud.com/lcode/m1/#/mdp/lcode/gen)

## 😭 日常项目管理中，您是否有以下痛点？
### 需求管控困难
- 需求不明确：客户提出一些模糊的需求,这可能导致开发团队对需求的理解存在偏差。
- 信息分散、杂乱：需求可能散落在多个地方，如邮件、Excel表格、即时通讯工具、不同的项目组等无法进行统一管理。
- 需求追溯困难：提出者、评审者、实施人等不明确，导致责任不清、分工不明等问题产生。
- 需求与开发脱节：无法实时跟踪需求完成情况。无法实时定位需求进度落后原因，进而无法做出补救措施。
- 需求与测试不匹配：需求文档与测试用例不匹配导致测试工作无法顺利进行
- 需求变更频发：频繁变更需求，给开发团队带来很大的困扰。

### 任务管理困难
- 任务分配不明确：任务通过口头或邮件形式进行分配，这可能导致任务责任不明确和任务重叠。
- 任务发布、沟通困难：由于涉及的成员和部门众多，信息同步不及时，很容易导致项目协作混乱。
- 任务进度把控难：缺乏有效的工具来跟踪任务进度，团队成员很难准确把握项目的整体完成情况，也无法针对性地进行调整。
- 任务风险管理不充分：常常忽视任务风险管理，导致项目面临较大的风险。
- 工时统计困难：手动记录工时不仅容易出错，而且难以统计和分析，这不仅影响团队成员的个人成果统计，也影响团队之间的凝聚力和协作效果。

### 质量管理困难
- 质量标准不明确：缺乏明确的质量标准和规范，导致团队成员对质量要求的理解存在差异，从而影响软件质量。
- 质量保证不到位：导致软件存在缺陷和漏洞，影响用户体验和产品可靠性。
- 测试不全面：缺乏缺陷登记跟踪工具、缺乏测试用例管理工具，导致一些潜在问题未被发现和解决，从而影响软件质量。
- 质量管理与开发流程不融合：质量管理与开发流程相互分离，导致质量管理与开发效率相互影响，难以实现高效的软件开发。

### 缺乏协作&沟通
- 沟通渠道不统一：在开发团队中，不同的成员可能有不同的沟通渠道，导致信息分散，难以统一管理。
- 沟通不够及时：在开发过程中，有时沟通不够及时，导致一些重要信息滞后的处理，影响了项目进度。
- 沟通不够清晰：由于技术术语或背景知识的不同，团队成员之间的沟通有时不够清晰，导致理解上的偏差。
- 沟通缺乏反馈机制：在沟通中，有时缺乏反馈机制，导致对问题的处理不够及时和有效。

### 缺乏效能分析
- 缺乏组织级、项目级、产品级、团队级、个人级、迭代级等不同组织级别的效能分析：企业在长期项目实施过程中，未构建起从组织级到个人级的效能分析体系，无法全面掌握企业的项目运作全貌，进而无法有效进行资源调配，利益最大化。
- 缺乏对不同职能部门的多维度的效能分析
- 缺乏风险预警、风险分析
- 项目报告不全面、不准确
- 质量报告不全面、不准确
- 进度计划汇总、分解困难

## 解决之道
![解决之道](/docs/images/xm-jg/xm-1-jjzd.png)

### 系统概况
![系统概况](/docs/images/xm-jg/xm-2-xtgk.png)

### 系统特点
![系统特点](/docs/images/xm-jg/xm-3-xttd.png)

### 系统功能
![系统功能](/docs/images/xm-jg/xm-4-xtgn.png)

### 技术架构
![技术架构](/docs/images/xm-jg/xm-5-jsjg.png)


### 应用架构
![应用架构](/docs/images/xm-jg/xm-6-yyjg.png)


### 项目总体管理
![项目总体管理](/docs/images/xm-jg/xm-8-ztgl.png)


### 需求管理
![需求管理](/docs/images/xm-jg/xm-9-xqgl.png)


### 项目计划
![项目计划](/docs/images/xm-jg/xm-10-xmjh.png)


### 质量管理
![质量管理](/docs/images/xm-jg/xm-11-zlgl.png)


### 迭代管理
![迭代管理](/docs/images/xm-jg/xm-12-ddgl.png)


### 效能分析
![效能分析](/docs/images/xm-jg/xm-13-xnfx.png)
 
## 💪 功能展示
### 项目立项
![项目立项](/docs/images/xm-zs/xm-zs-1-xmlx.png)


### 项目总体
![项目总体](/docs/images/xm-zs/xm-zs-2-xmzt.png)


### 组织架构
![组织架构](/docs/images/xm-zs/xm-zs-3-zzjg.png)


### 项目报告
![项目报告](/docs/images/xm-zs/xm-zs-4-xmbg.png)


### 需求管理
![需求管理](/docs/images/xm-zs/xm-zs-5-xqgl.png)


### 用户故事
![用户故事](/docs/images/xm-zs/xm-zs-6-yhgs.png)


### 项目计划
![项目计划](/docs/images/xm-zs/xm-zs-7-xmjh.png)


### 项目计划-任务
![项目计划-任务](/docs/images/xm-zs/xm-zs-8-jhrw.png)


### 迭代概览
![迭代管理](/docs/images/xm-zs/xm-zs-9-ddgl.png)


### 迭代维护
![项目立项](/docs/images/xm-zs/xm-zs-10-ddwh.png)


### 测试管理
![项目立项](/docs/images/xm-zs/xm-zs-11-csgl.png)


### 测试报告
![项目立项](/docs/images/xm-zs/xm-zs-12-csbg.png)

### 缺陷管理
![项目立项](/docs/images/xm-zs/xm-zs-13-qxgl.png)

### 财务费用
![项目立项](/docs/images/xm-zs/xm-zs-14-cwfy.png)

### 驾驶舱
![项目立项](/docs/images/xm-zs/xm-zs-15-jsc.png)

### 效能分析
![项目立项](/docs/images/xm-zs/xm-zs-16-xnfx.png)

### 燃尽图
![项目立项](/docs/images/xm-zs/xm-zs-17-rjt.png)

### 每日工作项分布
![项目立项](/docs/images/xm-zs/xm-zs-18-gzxfb.png)

### 任务年龄分布
![项目立项](/docs/images/xm-zs/xm-zs-19-rwnlfb.png)

### 任务排行棒
![项目立项](/docs/images/xm-zs/xm-zs-20-rwphb.png)

### 测试用例规划分析
![项目立项](/docs/images/xm-zs/xm-zs-21-csylghfx.png)

## 客户端展示
### 小程序
![项目立项](/docs/images/xm-zs/xm-zs-22-xcx.png)

### 审批管理
![项目立项](/docs/images/xm-zs/xm-zs-23-spgl.png)

### 测试管理
![项目立项](/docs/images/xm-zs/xm-zs-24-csgl.png)


## ⌨ 技术栈

vue全家桶 + element-ui + axios

## 💻 样例项目

- [项目管理] (https://maimengcloud.com/xm/m1/)

## ⚙ 快速开始

>⚠️注意：该项目使用 element-ui@2.3.0+ 版本，所以最低兼容 vue@2.5.0+ nodejs版本v14.16.1

>⚠️注意：该项目基于唛盟低代码开发平台构建，开发前请仔细阅读[唛盟低代码开发平台的readme](https://gitee.com/maimengcloud/mdp-lcode-ui-web/blob/master/README.md)有助于您更好的运行本项目
### 前序准备

- 你的本地环境需要安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。我们的技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) and [element-ui](https://github.com/ElemeFE/element)，提前了解和学习这些知识会对使用本项目有很大的帮助。

- 该项目属于网页版前端项目，所有api由 [xm-backend](https://gitee.com/maimengcloud/xm-backend)提供，请下载该项目

- 代码生成器下载 [mdp-code-generator](https://gitee.com/maimengcloud/mdp-code-generator) 也可以在低代码平台在线生成

### 开发
```bash
# 克隆项目
git clone https://gitee.com/maimengcloud/xm-ui-web.git

# 安装依赖
npm install
   
# 建议不要用cnpm安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
# npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev

# 启动后端服务,具体点击下面链接
[唛盟xm-backend](https://gitee.com/maimengcloud/xm-backend)
```
浏览器访问 http://localhost:8067

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

### 常见问题
#### 开发部署类常见问题
答复：此类问题请参考[唛盟低代码开发平台-常见问题](https://gitee.com/maimengcloud/mdp-lcode-ui-web/blob/master/README.md#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
#### 研发管理相关的业务问题
答复：待补充

### 🔔️ 特别提醒

mdp 3.0 版本已经开始规划更新了，尽请期待新版本的诞生吧

### 🗒️ 版本更新日志

升级前必看：[CHANGELOG.md](/docs/CHANGELOG.md)


## 💯 实践案例

1. [唛盟众包-网页](https://maimengcloud.com)
2. [项目管理-网页](https://maimengcloud.com/xm/m1/)
3. 项目管理-小程序   
   <img src="https://maimengcloud.com/img/77639c6907935d3b699f.png" alt="drawing" width="200"/>


## 🐞 交流讨论 、反馈 BUG、提出建议等

1. 快扫描下方左侧微信二维码和我们一起交流讨论吧！（备注 唛盟-xm 进群）
   <img src="https://maimengcloud.com/img/5ff0a747a4a1f14cf6a5.png" alt="drawing" width="200"/>

2. 唛盟微信公众号查看一些基础教程  
   <img src="https://maimengcloud.com/img/f3f91bac3a3735264a66.png" alt="drawing" width="200"/>

3. 反馈 BUG、提出建议，欢迎新建：[issues](https://gitee.com/maimengcloud/xm-ui-web/issues)，开发人员会不定时查看回复。
4. 参与贡献，请查看[贡献指南](#🔨贡献指南)。

## 💲 打赏
**感谢所有赞赏以及参与贡献的小伙伴，你们的支持是我们不断更新前进的动力！微信扫一扫，赏杯咖啡呗！**    
<img src="https://maimengcloud.com/img/97094cc1553fe0b0046c.jpg" alt="drawing" width="300"/>

## 🔔商务合作

序号|合作项目| 详细介绍 | 费用说明|
----------------------|------------|----------------------|-----|
1.| 打赏获得赞助商名额| 在赞助商列表展示（添加微信沟通） |不限额度|
2.| 新组件开发| 提供组件扩展、优化服务 |视复杂程度而定|
3.| 开发问题解答|如果使用该产品遇到棘手问题需要解决，添加微信进行沟通解决 |免费|
4.| 开发培训|提供开发流程介绍、技术介绍、功能介绍、部署流程介绍，仅限线上培训 |加微信详聊|
5.| 扩展问题解答|如果需要使用该产品进行自有业务系统研发，需要我方提供意见建议，我方收取一定费用后提供相应服务 |加微信详聊|
6.| 广告合作|广告位(精品项目推荐、赞助商展位) |加微信沟通|

