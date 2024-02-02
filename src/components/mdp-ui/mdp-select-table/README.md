### mdp-select-table 效果图
- 该组件与mdp-select效果一致，同样支持origin/tag/x三种风格，不同之处在于具有分页功能，适合超大表格数据的选择，如下图1所示，默认只会展示用过的数据，如果需要更多数据，需要点击【更多数据】按钮，将会弹出图2所示,当用户选中数据后，数据将填充到图1的下拉列表中，并且能够模拟select的选中事件
![mdp-select-table-select](/docs/images/ui-components/mdp-select-table-select.png)   

![mdp-select-table](/docs/images/ui-components/big-table-select.jpg)   

### 用法  

#### 最简单的用法，通过props定义编号及名称
```html  
<mdp-select-table :load-fun="loadFun" :props="propsCfgs"> 
</mdp-select-table>
``` 
```js 
  <script>
    export default {
      data() {
        return { 
            //从后台加载数据的api
            loadFun:this.$mdp.listBranch,  
            propsCfgs:{ 
              id:'branchId',//取api返回值中的branchId属性的值当成编号
              name:'branchName',//取api返回值中的branchName属性的值当成名称
            }
        }
      }
    }
  </script>
```

#### 通过props定义编号及名称，通过params传递后台查询参赛
```html  
<mdp-select-table ref="selectTableRef" :load-fun="loadFun" :props="propsCfgs" :params="{relType:'1'}"> 
</mdp-select-table>
``` 
```js 
  <script>
    export default {
      data() {
        return { 
            //从后台加载数据的api
            loadFun:this.$mdp.listBranch,  
            propsCfgs:{ 
              id:'branchId',//取api返回值中的branchId属性的值当成编号
              name:'branchName',//取api返回值中的branchName属性的值当成名称
            }
        }
      }
    }
  </script>
```

#### 通过props定义编号及名称，通过params传递后台查询参赛,通过插槽定义工具条
```html  
<mdp-select-table :load-fun="loadFun" :props="propsCfgs" :params="{relType:'1'}"> 
  <el-row  slot="toolbar">
    <el-button @click="addBranch">新增机构 </el-button>
    <el-button @click="$refs['selectTableRef'].$refs['tableDialog'].open()">更多数据</el-button>
  </el-row>
</mdp-select-table>
``` 
```js 
  <script>
    export default {
      data() {
        return { 
            //从后台加载数据的api
            loadFun:this.$mdp.listBranch,  
            propsCfgs:{ 
              id:'branchId',//取api返回值中的branchId属性的值当成编号
              name:'branchName',//取api返回值中的branchName属性的值当成名称
            }
        }
      },
      method:{
        addBranch(){
          //调起新增机构页面
        }
      }
    }
  </script>
```

#### 通过属性columnCfgs传入表格字段列表，mdp框架将解析出表头内容，用于配置显示列，排序，高级查询等
```html  
<mdp-select-table show-style="origin" :load-fun="loadFun" :column-cfgs="columnCfgs"> 
</mdp-select-table>
``` 
```js 
  <script>
    export default {
      data() {
        return { 
            //从后台加载数据的api
            loadFun:this.$mdp.listBranch,  
            columnCfgs:{
                [
                    {label:'机构编号',property:'id'},
                    {label:'机构名称',property:'branchName'},
                    {label:'地址',property:'address'},
                ]
            }
        }
      }
    }
  </script>
```

#### 多选、单选模式
```html 
<mdp-select-table show-style="origin" :load-fun="loadFun" :column-cfgs="columnCfgs" :multiple="true"> 
</mdp-select-table>
``` 
```js 
  <script>
    export default {
      data() {
        return { 
            //从后台加载数据的api
            loadFun:this.$mdp.listBranch,  
            columnCfgs:{
                [
                    {label:'机构编号',property:'id'},
                    {label:'机构名称',property:'branchName'},
                    {label:'地址',property:'address'},
                ]
            }
        }
      }
    }
  </script>
```


### Attributes
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
|loadFun|查询数据的接口函数|Promise|-| -
|params|提交给查询数据的接口的参赛，loadFun(params)|object|-|{}
|multiple|是否多选|boolean|—|false
|show-hi-query|是否显示高级查询|boolean|—|true
|show-common-query|是否显示常规查询|boolean|—|true 
|column-cfgs|表头列配置项列表|Array|-|-
|props|简化版的column-cfgs，如果配置了column-cfgs则该属性不起作用，只有两列编号及名称|Object|-|{id:'id',name:'name'} 
|show-type|组件分类|string|select / checkbox / radio| select
|show-style|展示风格|string|origin / tag / x| origin 
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
|placeholder|占位符|string|—|请选择 
|no-match-text|搜索条件无匹配时显示的文字，也可以使用slot="empty"设置|string|—|无匹配数据
|no-data-text|选项为空时显示的文字，也可以使用slot="empty"设置|string|—|无数据 



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
toolbar|下拉列表第一行工具条，默认为更多数据，可通过slot更改
info|鼠标未进入时展示的内容，showStyle=tag\x时有效
oper|鼠标进入后展示的内容，showStyle=tag\x时有效
~~prefix|Select 组件头部内容~~
empty|无选项时的列表

### column-cfgs 表头字段配置 
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
label|列名|string|—|—
property|属性名，驼峰命名，用于反解析出表字段|string|—|—
sortNo|前端显示排序，排序从0-999，越小越靠前,在表头、常规查询、高级查询的显示顺序|Number|—|—
isCommon|是否常用，用于常规查询是否显示|Boolean|true/false|false
colType|数据库字段类型| string/int/date/datatime/|string/int/date/datatime/|string
showHq|是否在高级查询中显示|boolean|true、false|true
showCol|列名|boolean|—|—
sqlOper|数据库操作符|string|gt/lt/ge/le/eq/ne/left_like/right_like/like/in/nin/bwtween/sql|eq
sqlVal|默认值|string|—|多选的话逗号分隔
beginVal|区间取值时的开始值|string|—|如果sqlOper=between,值存于beginVal及envVal中
endVal|区间取值时的结束值|string|—|如果sqlOper=between,值存于beginVal及envVal中
pk|是否为主键|boolean|true、false|false
itemCode|字典表中itemCode字段，填写了该值将从字典表加载下拉列表|string|—|—
colPrefix|属性需要添加前缀时使用，比如res.id=xxxxx,此次填写res.|string|—|—
disabledHq|是否允许编辑查询条件|boolean|—|—

### props 简易列配置

|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
id|编号列|string|id|id
name|名称列|string|name|name

### Methods

|方法名|说明|参数|
|--------|------|--------|
focus|使 input 获取焦点|-
blur|使 input 失去焦点，并隐藏下拉框|-