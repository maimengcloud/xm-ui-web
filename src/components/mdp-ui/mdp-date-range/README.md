### mdp-date-range
该组件相对于el-date-range，进行了以下两项优化：

#### 一、showStyle

- 提供origin\tag\x三种样式
- 可以直接传入一个对象，指定start-key,end-key，自动更新对象对应的属性。免去一堆的转换过程


1. `origin`

```vue
<mdp-date-range show-style="origin" :value="formData"/>
...
  data() {
    return {
      formData:
        [ '2024-01-09 00:00:00','2024-03-09 00:00:00']
    }
  },
```

<img src="../../../../docs/images/ui-components/mdp-date-range/image-20240111103632183.png" alt="image-20240111103632183" style="zoom:50%;" />

2. `x`

```vue
    <mdp-date-range show-style="x" :value="formData" style="border: 1px solid">
            <template v-slot:avater><p>&#9733;</p></template> 				<!--  自定义图标-->
            <template v-slot:info>自定义内容</template>
    </mdp-date-range>
```

<img src="../../../../docs/images/ui-components/mdp-date-range/image-20240111110136191.png" alt="image-20240111110136191" style="zoom:50%;" />

<img src="../../../../docs/images/ui-components/mdp-date-range/image-20240111110148521.png" alt="image-20240111110148521" style="zoom:50%;" />

3. tag 

```vue
    <mdp-date-range show-style="tag" style="border: 1px solid">
      <!-- 默认图标-->
      <template v-slot:info>自定义内容</template>
    </mdp-date-range>
```

<img src="../../../../docs/images/ui-components/mdp-date-range/image-20240111105902269.png" alt="image-202401111059022269" style="zoom:50%;" />

<img src="../../../../docs/images/ui-components/mdp-date-range/image-20240111105909638.png" alt="image-202401111105909638" style="zoom:50%;" />

####  二、value + @change事件



```vue
<mdp-date-range :value="formData" @change="change"/>
```

```js
data() {
  return {
    status: "login",
    formData:
      ['2024-01-09 00:00:00', '2024-03-09 00:00:00'] // 初始化值
  }
},

methods: {
  change(dates) {
    this.formData = dates
  }
},
```

#### 三、startKey 和 endKey

当传入的value是一个对象时，可以设置starKey和endKey来指定key

```vue
<mdp-date-range show-style="origin" :value="formData" start-key="startDate" end-key="endDate"
@change="change">
```

```js
data() {
  return {
    formData: {
      account:'xxxxx',
      ....
      startDate: '2024-01-09 00:00:00', 
      endDate: '2024-03-09 00:00:00'
    }
  }
},
  
methods: {
  change(dates) {
    this.formData = dates
  }
},
```

####  四、styleObj

组件的样式

```vue
<mdp-date-range :styleObj="{ backgroundColor: 'green' }"/>
```

<img src="../../../../docs/images/ui-components/mdp-date-range/image-20240111144543586.png" alt="image-20240111144543586" style="zoom:50%;" />

#### 五、autoDefault 和 defaultRange

autoDefault 是否根据 defaultRange 生成一个时间跨度

defaultRange = [-1, 1] = [ 当前时间 -1, 当前时间 +1 ]

```vue
<mdp-date-range :auto-default="true" :default-range="[-1, 1]"/>
```

<img src="../../../../docs/images/ui-components/mdp-date-range/image-20240111150728697.png" alt="image-20240111150728697" style="zoom:50%;" />

#### 六 icon

与Attributes表的 prefix-icon 想同，自定义头部图标，只有 x 和 tag 样式下

```vue
<mdp-date-range show-style="x" icon="el-icon-phone"/>

<mdp-date-range show-style="tag" icon="el-icon-phone"/>
```





showavater Disabled label type 



#### 自定义属性

| 参数      | 说明                   | 类型    | 可选值 | 默认值 |
| --------- | ---------------------- | ------- | ------ | ------ |
| showStyle | 设置组件的样式         | String  | —      | origin |
| disabled  | 是否禁止鼠标事件的触发 | Boolean | —      | false  |



### 用法
#### 对象的方式 
```js 
var formData={startDate:'',endDate:''}
```
```html 
<mdp-date-range v-model="formData" start-key='startDate' end-key="endDate"/>
```
#### 数组的方式
```js 
var dates=[]
```
```html 
<mdp-date-range v-model="dates"/>
```



#### element ui

### Attributes

| 参数              | 说明                                           | 类型                                      | 可选值                                                       | 默认值               |
| ----------------- | ---------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------ | -------------------- |
| value / v-model   | 绑定值                                         | date(DatePicker) / array(DateRangePicker) | —                                                            | —                    |
| readonly          | 完全只读                                       | boolean                                   | —                                                            | false                |
| disabled          | 禁用                                           | boolean                                   | —                                                            | false                |
| editable          | 文本框可输入                                   | boolean                                   | —                                                            | true                 |
| clearable         | 是否显示清除按钮                               | boolean                                   | —                                                            | true                 |
| size              | 输入框尺寸                                     | string                                    | large, small, mini                                           | —                    |
| placeholder       | 非范围选择时的占位内容                         | string                                    | —                                                            | —                    |
| start-placeholder | 范围选择时开始日期的占位内容                   | string                                    | —                                                            | 开始日期             |
| end-placeholder   | 范围选择时结束日期的占位内容                   | string                                    | —                                                            | 结束日期             |
| type              | 显示类型                                       | string                                    | year/month/date/dates/months/years week/datetime/datetimerange/ daterange/monthrange | date                 |
| format            | 显示在输入框中的格式                           | string                                    | 见[日期格式](https://element.eleme.cn/#/zh-CN/component/date-picker#ri-qi-ge-shi) | yyyy-MM-dd           |
| align             | 对齐方式                                       | string                                    | left, center, right                                          | left                 |
| popper-class      | DatePicker 下拉框的类名                        | string                                    | —                                                            | —                    |
| picker-options    | 当前时间日期选择器特有的选项参考下表           | object                                    | —                                                            | [{...略...}}]        |
| range-separator   | 选择范围时的分隔符                             | string                                    | —                                                            | '~'                  |
| default-value     | 可选，选择器打开时默认显示的时间               | Date                                      | 可被`new Date()`解析                                         | —                    |
| default-time      | 范围选择时选中日期所使用的当日内具体时刻       | string[]                                  | 数组，长度为 2，每项值为字符串，形如`12:00:00`，第一项指定开始日期的时刻，第二项指定结束日期的时刻，不指定会使用时刻 `00:00:00` | —                    |
| value-format      | 可选，绑定值的格式。不指定则绑定值为 Date 对象 | string                                    | 见[日期格式](https://element.eleme.cn/#/zh-CN/component/date-picker#ri-qi-ge-shi) | yyyy-MM-dd HH:mm:ss  |
| name              | 原生属性                                       | string                                    | —                                                            | —                    |
| unlink-panels     | 在范围选择器里取消两个日期面板之间的联动       | boolean                                   | —                                                            | false                |
| prefix-icon       | 自定义头部图标的类名                           | string                                    | —                                                            | el-icon-date         |
| clear-icon        | 自定义清空图标的类名                           | string                                    | —                                                            | el-icon-circle-close |
| validate-event    | 输入时是否触发表单的校验                       | boolean                                   | -                                                            | true                 |
| append-to-body    | DetePicker 自身是否插入至 body 元素上。        | boolean                                   | —                                                            | true                 |

### Picker Options

| 参数           | 说明                                                         | 类型                           | 可选值 | 默认值 |
| -------------- | ------------------------------------------------------------ | ------------------------------ | ------ | ------ |
| shortcuts      | 设置快捷选项，需要传入 { text, onClick } 对象用法参考 demo 或下表 | Object[]                       | —      | —      |
| disabledDate   | 设置禁用状态，参数为当前日期，要求返回 Boolean               | Function                       | —      | —      |
| cellClassName  | 设置日期的 className                                         | Function(Date)                 | —      | —      |
| firstDayOfWeek | 周起始日                                                     | Number                         | 1 到 7 | 7      |
| onPick         | 选中日期后会执行的回调，只有当 `daterange` 或 `datetimerange` 才生效 | Function({ maxDate, minDate }) | —      | —      |

### Shortcuts

| 参数    | 说明                                                         | 类型     | 可选值 | 默认值 |
| ------- | ------------------------------------------------------------ | -------- | ------ | ------ |
| text    | 标题文本                                                     | string   | —      | —      |
| onClick | 选中后的回调函数，参数是 vm，可通过触发 'pick' 事件设置选择器的值。例如 vm.$emit('pick', new Date()) | function | —      | —      |

### Events

| 事件名称 | 说明                    | 回调参数                                               |      |      |
| -------- | ----------------------- | ------------------------------------------------------ | ---- | ---- |
| change   | 用户确认选定的值时触发  | 组件绑定值。格式与绑定值一致，可受 `value-format` 控制 |      |      |
| blur     | 当 input 失去焦点时触发 | 组件实例                                               |      |      |
| focus    | 当 input 获得焦点时触发 | 组件实例                                               |      |      |

### Methods

| 方法名 | 说明              | 参数 |
| ------ | ----------------- | ---- |
| focus  | 使 input 获取焦点 | —    |

