# mdp 贡献说明

## 目录说明

### 工程命名规范 

**前端工程命名规则：业务名-ui-web|-app|-uniapp**
**后端工程命名规则：业务名-backend**

- [-ui]代表前端
- [-web]代表电脑浏览器应用
- [-app]代表手机应用
- [-uniapp]代表小程序+app的综合体，或者仅代表小程序
- [-backend]代表后端
- [-cloud]代表适用于微服务、分布式、云环境
- [-bootstrap]代表属于打包类的工程，不能写业务代码

### 前端目录

```
业务-ui-web 
	├── build      		   => 编译构建相关
	├── config   		   => 编译构建配置项
	├── dist    		   => 编译后的产物
	├── src   		       => 源代码
	   ├── api 	           => 与后端交互的api接口列表，一个表一个文件，公共api放入$fly中
	      ├── fly.js 	   => 公共api放入fly中,自动注册成全局函数，页面上可以通过 $fly.xxxxApi()进行调用，无须引入任何文件
	   ├── assets 	       => 静态资源
	   ├── common 	       => 一些公共js脚本
	   ├── components 	   => 组件库
	   	  ├── Mdp 	       => mdp-ui基础组件库
	   	  ├── MdpExt 	   => mdp-ui扩展的组件库，一般根据业务需要抽取提炼新的组件放入该目录
	   ├── directive 	   => vue指令库
	   ├── icons 	       => 图标库
	   ├── lang 	       => 语言包
	   ├── mock 	       => 接口模拟数据
	   ├── router 	       => 路由库
	   ├── store 	       => 全局公共数据库
	   ├── styles 	       => css样式库
	   ├── views 	       => 业务功能的页面代码
	   ├── vuex 	       => vuex
	   ├── App.vue 	       => 总入口 vue
	   ├── main.js 	       => 总入口 js
	   ├── permission.js   => 路由菜单权限过滤

	├── static             => 某些静态资源
	├── .editorconfig      => 全局代码格式配置
	├── .gitattributes     => 文件编码格式配置
	├── CHANGELOG.md       => 重大更新日志
	├── CONTRIBUTE.md      => 贡献说明
	├── PLANS.md           => 重大开发计划说明
	├── README.md          => 项目说明
	├── LICENSE            => 协议
	├── favicon.ico        => 项目图标
	├── package.json       => 组件依赖关系
	├── index.html         => 总入口、首页
```


### 后端目录
**后端工程结构**

- 工程结构总图：
```
业务名-backend
	├── 业务名                  =>业务工程，主要用来书写业务代码
	├── 业务名-cloud-bootstrap  =>maven打包工程，禁止书写业务代码，部署到云环境
	├── 业务名-bootstrap        =>maven打包工程，禁止书写业务代码，部署到单体应用环境
	├── pom.xml                 =>maven pom文件
	 
```
- 工程结构明细图：	 
```
业务名-backend

	├── 业务名    		                                            => 业务主体工程，主要用来写业务功能代码
		├── logs      		                                        => 工程运行日志输出目录
		├── src      		                                        => src
			├── main      		                                    => 源码包
				├── com.企业名.业务名      		                     => 一级业务、产品、大模块之类的 
					├── DruidConfig.java                        => 数据库连接配置
					├── SwaggerConfig.java                      => wagger配置
					├── SysApplication.java                     => 启动类
					├── WebSecurityConfig.java                  => spring security配置 
					├── com.企业名.业务名.模块1      		          => 模块目录，一个模块=一个表 
						├── com.企业名.业务名.模块1.ctrl      		  => 控制器 
						├── com.企业名.业务名.模块1.entity      		  => 实体类，保持与数据库表一摸一样，不建议改动，代码生成器随时覆盖 
						├── com.企业名.业务名.模块1.mapper      		  => mybatis mapper文件,包含 Mapper.java Mapper.xml两个文件
						├── com.企业名.业务名.模块1.service      	  => 服务类,所有服务继承 BaseService
						├── com.企业名.业务名.模块1.vo      		      => 如果需要对entity进行扩展，可在此目录定义继承entity的子类 
				├── resources      		                             => 资源文件 
			├── test      		                                     => 测试用例 
		├── pom.xml      		                                     => maven pom文件 


	├── 业务名-cloud-bootstrap   		                             => 打包工程(微服务环境)
		├── logs      		                                        => 工程运行日志输出目录
		├── src      		                                        => src
			├── main      		                                    => 源码包
				├── com.企业名.业务名      		                     
						├── DruidConfig.java                        => 数据库连接配置
						├── SwaggerConfig.java                      => wagger配置
						├── SysApplication.java                     => 启动类
						├── WebSecurityConfig.java                  => spring security配置
				├── resources      		                             => 资源文件 
			├── test      		                                     => 测试用例 
		├── pom.xml      		                                     => maven pom文件  


	├── 业务名-bootstrap   		                                      => 打包工程（单体应用）
		├── logs      		                                        => 工程运行日志输出目录
		├── src      		                                        => src
			├── main      		                                    => 源码包
				├── com.企业名.业务名    		                     
						├── DruidConfig.java                        => 数据库连接配置
						├── SwaggerConfig.java                      => wagger配置
						├── SysApplication.java                     => 启动类
						├── WebSecurityConfig.java                  => spring security配置
				├── resources      		                             => 资源文件 
			├── test      		                                     => 测试用例 
		├── pom.xml      		                                     => maven pom文件  
	├── pom.xml   		                                             => maven pom文件
```

## [java]一些规范说明

1. 写完代码后在保证不影响其他的人的代码情况下尽量统一格式化一下代码
	1. 采用 4 个空格缩进，禁止使用 tab 字符
	2. 如果使用 tab 缩进，必须设置 1 个 tab 为 4 个空格。IDEA 设置 tab 为 4 个空格时，
	   请勿勾选 Use tab character；而在 eclipse 中，必须勾选 insert spaces for tabs
2. Java 代码需要保证新增方法都有充足、标准的 JavaDoc 注释
3. 在修改 Bug、新增功能尽量保证最小提交的方式提交代码，减少多个功能一个 commit
4. 所有接口 url 都需要遵循下划线模式
5. Java 代码、方法需要遵循小驼峰法
6. Java 类名需要遵循大驼峰法
7. 前端项目统一采用 `prettier` 方式来格式化（需要安装插件）
8. 所有 controller 层的接口都需要添加文档注释（至少包含接口的作用说明、参数说明、返回值说明及添加 apiDoc 文档注释）

> 注：由于旧代码存在很多不规范问题，会逐步调整为新规范。在新写的代码都需要需要遵循上面说明
>
>
### 类的文档注释规范（Javadoc）

```
/**
 * xxxxxxxx
 * @author xxxx
 * @since ${DATE}
 */
```

> 这里采用 `@since` 声明创建日期是因为 `Javadoc` 规范里面并没有 `@date` 标记所以采用 `@since` 代替

### Java 代码规范

> 推荐安装 `Alibaba Java Coding Guidelines`（`p3c`） 插件


## changelog 更新规范

> 在新加功能、修复bug、优化功能在完成时候都需要在 [CHANGELOG.md](./CHANGELOG.md) 记录

1. 如果是使用者反馈的bug，在修复后需要备注反馈人的昵称
2. 如果是 issue 需要备注 issue 地址以及平台（Gitee、GitHub）
3. 如果是 pr 需要备注 pr 地址以及平台（Gitee、GitHub）
4. 根据变动情况确定影响范围：如果影响 只：`agent`、`server` 其中一个，就使用【agent】、【server】开头，如果都影响就不用
5. 可以视情况添加其他说明：如提交记录
6. emoji 表情参考：[https://emojixd.com/](https://emojixd.com/)


## 分支说明

1. 新功能都提交到 dev 分支, 不能提交到 master 分支
2. PR 提交到 dev 分支
3. 一般功能开发可以直接提交到 dev 分支，较大功能开发需要新建分支提交

## 需要的小组

1. 后端小组 （主要任务：根据需求开发对应的接口）
2. 前端小组 （主要任务：优化前端 UI 交互和对接部分接口）
3. 文档小组 （主要任务：完善、补充 mdp 使用文档）
4. 视频小组 （主要任务：录制 mdp 相关的使用视频）
5. 测试小组 （主要任务：参与 mdp 新版内测、日常开发测试相关任务）