### Mdp-number

`计数器`

#### 基本使用

```vue
<mdp-number v-model="num" @change="handleChange" :min="1" :max="10"/>
```

```js
data() {
  return {
    num: 4,
  }
},
methods: {
  handleChange(value1, value2) {
    console.log(value1, value2);
  }
},
```

<img src="../../../../docs/images/ui-components/mdp-number/image-20240112114302491.png" alt="image-20240112114302491" style="zoom:50%;" />

#### 自定义

show-style !=='origin' 时的结构如下

```html
<slot>
  ├── <slot name="avater"></slot>
  ├── <span>
  │   ├── <slot name="info">
  │   │   ├── <span v-if="showStyle=='x'">
  │   │   │   ├── <span>
  │   │   │   │   └── <slot name="value"></slot> 
  │   │   │   ├── <span>
  │   │   │   │   └── <slot name="label"></slot> 
  │   │   │   └── </span>
  │   │   ├── </span>
  │   │   └── <span v-else>
  │   │       └── <slot name="value"></slot> 
  │   │   </span>  
  │   └── </slot>
  └── </span>  
  └── <span> 
      └── <slot name="oper"></slot>  
  </span>  
</slot>
```

例子1

```vue
<mdp-number show-style="x">
  <template v-slot:default>
    <el-input-number v-model="num"></el-input-number>
  </template>
</mdp-number>
```

```js
data() {
  return {
    num: 1,
  }
}
```

例子2

```vue
<mdp-number show-style="x">
  <template v-slot:avater>
    <i class="el-icon-s-order" style="font-size: 30px;"></i>
  </template>
  <template v-slot:info>
    <el-input-number :disabled="true"></el-input-number>
  </template>
  <template v-slot:oper>
    <el-input-number v-model="num"></el-input-number>
  </template>
</mdp-number>
```

<img src="../../../../docs/images/ui-components/mdp-number/image-20240112115454303.png" alt="image-20240112115454303" style="zoom:50%;" /><img src="../../../../docs/images/ui-components/mdp-number/image-20240112115522071.png" alt="image-20240112115522071" style="zoom:50%;" />



### Attributes

|       参数        |                说明                |  类型   |    可选值    |     默认值      |
| :---------------: | :--------------------------------: | :-----: | :----------: | :-------------: |
|        min        |       设置计数器允许的最小值       | number  |      —       |    -Infinity    |
|        max        |       设置计数器允许的最大值       | number  |      —       |    Infinity     |
|       step        |             计数器步长             | number  |      —       |        1        |
|   step-strictly   |      是否只能输入 step 的倍数      | boolean |      —       |      false      |
|     precision     |              数值精度              | number  |      —       |        2        |
|     controls      |          是否使用控制按钮          | boolean |      —       |      true       |
| controls-position |            控制按钮位置            | string  |      —       |      right      |
|     disabled      |           是否禁用计数器           | boolean |      —       |      false      |
|     style-obj     | 设置showStyle=='x'时，avatar的样式 | Object  |      —       | marginTop:'5px' |
|       label       |              标签字段              | String  |      —       |       ''        |
|    placeholder    |       输入框默认 placeh![img.png](img.png)older       | string  |      —       |        —        |
|       color       | 设置showStyle=='x'时，直接指定颜色 | string  |      —       |        —        |
|       icon        |   设置showStyle=='x'时，指定图标   | string  |      —       |        —        |
|     showStyle     |           控制组件的布局           | String  | origin/x/tag |    'origin'     |

### Events

| 事件名 |                  说明                  |                         回调参数                          |
| :----: | :------------------------------------: | :-------------------------------------------------------: |
| change | 仅在输入框失去焦点或用户按下回车时触发 | (currentVal: string \|number , oldVal: string \| number ) |