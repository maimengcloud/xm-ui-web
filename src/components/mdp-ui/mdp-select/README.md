### mdp-select 效果图
- origin风格    
![mdp-select](/docs/images/ui-components/select-origin.jpg)  
- tag风格    
![mdp-select-tag](/docs/images/ui-components/select-tag.jpg) 
- x风格  
1. 鼠标未进入  
![mdp-select-x-no-hove](/docs/images/ui-components/select-x-no-hove.jpg)  
2. 鼠标进入后  
![mdp-select-x-hove](/docs/images/ui-components/select-x-hove.jpg)  
### 用法
#### 字典列表

- 基本用法
从数据库表meta_meta_option加载 item_code='userStatus'的列表数据
```html
  <mdp-select v-model='form.userStatus' item-code='userStatus'/>
``` 
- 不同展示风格 
1. 按select的原始方式展示，用于查询条件、一般表单输入等场景
```html
  <mdp-select show-style="origin" v-model='form.userStatus' item-code='userStatus'/>
``` 
2. 鼠标未进入时，展示为tag,鼠标进入后，展示为下拉列表可选状态，用于可编辑表格
```html
  <mdp-select show-style="tag" v-model='form.userStatus' item-code='userStatus'/>
``` 
3. 相对于tag风格，x风格更综合，展示包括label、title、头像等
```html
  <mdp-select show-style="x" v-model='form.userStatus' item-code='userStatus'/>
``` 
- 带过滤条件用法  
可通过 params传递后台接受的任意参数
```html
  <mdp-select v-model='form.userStatus' item-code='userStatus' :params="{relyType:'1'}"/>
```
#### 自定义列表

```html
  <mdp-select v-model='userStatus' :options="[{id:'0',name:'无效'},{id:'1',name:'有效'}]"/>
```

#### 在原有列表添加额外的列表

```html
  <mdp-select v-model='userStatus' item-code="userStatus" :plus-options="[{id:'0',name:'无效'},{id:'1',name:'有效'}]"/>
```


#### 过滤掉部分不需要的列表选项
```js
 filterFun(option,options){
   if(option.id=='x' || option.relyType=='1'){
    return false;//过滤
   }else{
    return true
   }
 }
```
```html
  <mdp-select v-model='userStatus' item-code="userStatus" :filter-fun="filterFun"/>
```
#### 通过监听change2获取选中的对象
```js
 onUserStatusCange(option){
    this.username=option.name
    this.userType=option.relyType
 }
```
```html
  <mdp-select v-model='userStatus' item-code="userStatus" @change2="onUserStatusCange"/>
```

#### 从其它api获取数据
通过$mdp.listBranch查询后台数据，params将作为查询参数发给后台，props告诉组件id，name分别取后台返回的对象的哪个属性
```html
<mdp-select v-model='userStatus' :load-fun="$mdp.listBranch" :params="{type:'1'}" :props="{id:'branchId',name:'branchName'}"/>
```
### Attributes
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
|show-type|组件分类|string|select / checkbox / radio| select
|show-style|展示风格|string|origin / tag / x| origin
|props|对象属性对照|object| |{id:'id',name:'name'}
|loadFun|从后台加载数据的api|function,返回Promise| |
|split|多选的时候，如果要返回字符串时的分隔符，如果设置了值，v-mode传入传出的值将是被该分隔符分割的字符串,如v-model="1,2,3,4"|string| , |
|filterFun|从后台返回的数据进行过滤后再装载到下拉列表,filterFun(option,options),返回true\false,false则过滤掉|function| | 
|options|直接指定列表数据|Array
|plusOptions|在原有列表上添加额外的列表项 
|⚠️注意：|以上为mdp-ui对element-ui的改造，后面的属于element-ui的原有属性
|value / v-model|绑定值|boolean / string / number|—|—
|multiple|是否多选|boolean|—|false
|disabled|是否禁用|boolean|—|false
|value-key|作为 value 唯一标识的键名，绑定值为对象类型时必填|string|—|value
|size|输入框尺寸|string|medium/small/mini|—
|clearable|是否可以清空选项|boolean|—|false
|collapse-tags|多选时是否将选中值按文字的形式展示|boolean|—|false
|multiple-limit|多选时用户最多可以选择的项目数，为 0 则不限制|number|—|0
|name|select input 的 name 属性|string|—|—
|autocomplete|select input 的 autocomplete 属性|string|—|off
|~~auto-complete~~|下个主版本弃用|string|—|off
|placeholder|占位符|string|—|请选择
|filterable|是否可搜索|boolean|—|false
|~~allow-create~~|是否允许用户创建新条目，需配合 filterable 使用|boolean|—|false
|filter-method|自定义搜索方法|function|—|—
|~~remote~~|是否为远程搜索|boolean|—|false
|~~remote-method~~|远程搜索方法|function|—|—
|~~loading~~|是否正在从远程获取数据|boolean|—|false
|~~loading-text~~|远程加载时显示的文字|string|—|加载中
|no-match-text|搜索条件无匹配时显示的文字，也可以使用slot="empty"设置|string|—|无匹配数据
|no-data-text|选项为空时显示的文字，也可以使用slot="empty"设置|string|—|无数据
|popper-class|Select 下拉框的类名|string|—|—
|reserve-keyword|多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词|boolean|—|false
|~~default-first-option~~|在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用|boolean|-|false
|~~popper-append-to-body~~|是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false|boolean|-|true
|~~automatic-dropdown~~|对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单|boolean|-|false


### Events
|事件名称|说明|回调参数|
|--------|------|--------|
change2|选中值发生变化时触发，在需要获取值以外更多信息时使用|目前的选中的整个对象,如果multiple=false,返回一个对象，否则返回对象数组
change|选中值发生变化时触发|目前的选中值，如果multiple=false,返回一个值，否则返回值数组，如果split有则，则返回以split分割的字符串，如1,2,3,4,5
visible-change|下拉框出现/隐藏时触发|出现则为 true，隐藏则为 false
remove-tag|多选模式下移除tag时触发|移除的tag值
clear|可清空的单选模式下用户点击清空按钮时触发|—
blur|当 input 失去焦点时触发|(event: Event)
focus|当 input 获得焦点时触发|(event: Event)

### slot
|name|说明|
|--------|------|
—|Option 组件列表
info|鼠标未进入时展示的内容，showStyle=tag\x时有效
oper|鼠标进入后展示的内容，showStyle=tag\x时有效
~~prefix|Select 组件头部内容~~
empty|无选项时的列表

### ~~Option Group Attributes~~

|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
label|分组的组名|string|—|—
disabled|是否将该分组下所有选项置为禁用|boolean|—|false

### ~~Option Attributes~~

|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
value|选项的值|string/number/object|—|—
label|选项的标签，若不设置则默认与 value 相同|string/number|—|—
disabled|是否禁用该选项|boolean|—|false
### Methods

|方法名|说明|参数|
|--------|------|--------|
focus|使 input 获取焦点|-
blur|使 input 失去焦点，并隐藏下拉框|-