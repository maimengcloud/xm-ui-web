
## 组件库[mdp-ui](/src/components/mdp-ui)  
mdp封装了几十个ui组件,使用mdp-ui与不使用mdp-ui的区别：写100行代码还是写1行代码的区别，代码量的减少立竿见影
- [mdp-ui](/src/components/mdp-ui)  
mdp的核心组件，该组件库为纯前端页面组件，无须配置任何后端api接口即可正确运行
- [mdp-ui-ext](/src/components/mdp-ui-ext)  
基于mdp-ui扩展的带有对接后台api业务加载能力的业务组件
>⚠️注意：[mdp-ui组件效果预览](https://maimengcloud.com/sys/m1/#/mdp/lcode/index)

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

### [mdp-table](/src/components/mdp-ui/mdp-table)  
表格，内置了增、删、改、查、高级查询、重置查询、导出、列配置、分页、批量编辑等功能、内置了对按钮权限的控制机制  
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