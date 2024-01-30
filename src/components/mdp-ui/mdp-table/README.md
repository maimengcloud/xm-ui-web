### mdp-table
该组件相对于el-table，进行了以下优化：
内置了增、删、改、查、高级查询、重置查询、导出、列配置、分页、批量编辑等功能、内置了对按钮权限的控制机制,功能非常强大

- 综合管理  
  ![综合管理表格](/docs/images/ui-components/table-mng.jpg)
- 可编辑表格    
  ![可编辑表格](/docs/images/ui-components/edit-table.jpg)
- 可编辑-树状表格    
  ![可编辑-树状表格](/docs/images/ui-components/left-right-tree-table.jpg)

### 用法

#### 基本用法，根el-table保持一致,直接定义表头，mdp框架将解析出表头内容，用于配置显示列，排序，高级查询等
```html 
<mdp-table :crud-apis="crudApis">
    <el-table-column
        prop="bizDate"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="stuName"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="stuAddress"
        label="地址">
      </el-table-column>
</mdp-table>
``` 
```js 
  <script>
    export default {
      data() {
        return { 
            //操作后台数据的api列表
            crudApis:{
                list:this.$mdp.listUser,
                add: this.$mdp.addUser,
                edit: this.$mdp.editUser,
                del: this.$mdp.delUser,
                editSomeFields:this.$mdp.editSomeFieldsUser,
            } 
        }
      }
    }
  </script>
```


#### 通过属性columnCfgs传入表格字段列表，mdp框架将解析出表头内容，用于配置显示列，排序，高级查询等
```html  
<mdp-table :crud-apis="crudApis" :column-cfgs="columnCfgs"> 
</mdp-table>
``` 
```js 
  <script>
    export default {
      data() {
        return { 
            //操作后台数据的api列表
            crudApis:{
                list:this.$mdp.listUser,
                add: this.$mdp.addUser,
                edit: this.$mdp.editUser,
                del: this.$mdp.delUser,
                editSomeFields:this.$mdp.editSomeFieldsUser,
            },
            columnCfgs:{
                [
                    {label:'日期',property:'bizDate'},
                    {label:'姓名',property:'stuName'},
                    {label:'地址',property:'stuAddress'},
                ]
            }
        }
      }
    }
  </script>
```

#### 多选、单选模式、可编辑表格
```html 
<mdp-table :crud-apis="crudApis" :column-cfgs="columnCfgs" :multiple="true" :edit="true"> 
</mdp-table>
``` 
```js 
  <script>
    export default {
      data() {
        return { 
            //操作后台数据的api列表
            crudApis:{
                list:this.$mdp.listUser,
                add: this.$mdp.addUser,
                edit: this.$mdp.editUser,
                del: this.$mdp.delUser,
                editSomeFields:this.$mdp.editSomeFieldsUser,
            },
            columnCfgs:{
                [
                    {label:'日期',property:'bizDate'},
                    {label:'姓名',property:'stuName'},
                    {label:'地址',property:'stuAddress'},
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
|crud-apis|增删改查的接口函数|object|-| -
|multiple|是否多选|boolean|—|false
|show-hi-query|是否显示高级查询|boolean|—|true
|show-common-query|是否显示常规查询|boolean|—|true
|edit|是否可编辑|boolean|—|false
|column-cfgs|表头列配置项列表|Array|-|-



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

### crud-apis api列表

|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
list|查询api|Promise|—|—
add|新增api|Promise|—|—
edit|修改api|Promise|—|—
del|删除api|Promise|—|—
editSomeFields|批量修改部分字段|Promise|—|—
### Methods

|方法名|说明|参数|
|--------|------|--------|
focus|使 input 获取焦点|-
blur|使 input 失去焦点，并隐藏下拉框|-