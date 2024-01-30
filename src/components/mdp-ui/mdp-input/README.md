### mdp-input



#### 基本使用

```vue
<form class="c1">
  <mdp-input show-style="origin" :disabled="false" label="" placeholder="" type="text"></mdp-input>
</form>
```

```css
.c1 {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
.c1 > * {
  max-width: 200px;
}
```

<img src="../../../../docs/images/ui-components/mdp-input/image-20240112102727553.png" alt="image-20240112102727553" style="zoom:50%;" />

#### 自定义

mdp-input 结构如下

```html
<slot>
  ├── <slot v-if="showStyle=='x'" name="avater"></slot>
  ├── <span>
  │   ├── <slot name="info">
  │   │   ├── <span v-if="showStyle=='x'">
  │   │   │   ├── <div>
  │   │   │   │   └── <slot name="value"></slot>
  │   │   │   ├── <div>
  │   │   │   │   └── <slot name="label"></slot>
  │   │   │   └── </div>
  │   │   ├── </span>
  │   │   └── <span v-else>
  │   │       └── <div>
  │   │           └── <slot name="value"></slot>
  │   │       </div>
  │   │   </span>
  │   └── </slot>
  │── </span>
  └── <span>
      └── <slot name="oper"></slot>
  		</span>
</slot>
```

```js
data() {
  return {
    status: "",
  }
}
```

```vue
  <mdp-input show-style="x">
    <template v-slot:default>
      <el-input placeholder="请输入内容" v-model="status">
        <i class="el-icon-edit el-input__icon" slot="suffix"></i>
      </el-input>
    </template>
  </mdp-input>
```

<img src="../../../../docs/images/ui-components/mdp-input/image-20240112105047494.png" alt="image-20240112105047494" style="zoom:50%;" />

-----

```js
data() {
  return {
    obj: ''
  }
}
```

```vue
    <mdp-input show-style="x">
      <template v-slot:avater>
        <i class="el-icon-s-custom"></i>
      </template>
      <template v-slot:info>
        <el-input placeholder="username" :disabled="true"></el-input>
      </template>
      <template v-slot:oper>
        <el-input v-model="obj"></el-input>
      </template>
    </mdp-input>
```

<img src="../../../../docs/images/ui-components/mdp-input/image-20240111190935618.png" alt="image-20240111190935618" style="zoom:50%;" />				<img src="../../../../docs/images/ui-components/mdp-input/image-20240111191052830.png" alt="image-20240111191052830" style="zoom:50%;" />





### Autocomplete Attributes

|    参数     |                    说明                    |  类型   |        可选值         |  默认值  |
| :---------: | :----------------------------------------: | :-----: | :-------------------: | :------: |
|  disabled   |                    禁用                    | boolean |           —           |  false   |
|    label    |                  标签字段                  | String  |           —           |    ''    |
| placeholder |                   占位符                   | String  |           —           |    ''    |
|    color    | showStyle=='x'时生效，设置avatar部分的样式 | String  |           —           |    —     |
|    icon     | showStyle=='x'时生效，设置avatar部分的Icon | String  |           —           |    —     |
|  showStyle  |               控制组件的布局               | String  |   origin/x/{other}    | 'origin' |
|    size     | 输入框尺寸，只在 `type!="textarea"` 时有效 | string  | medium / small / mini |  small   |



### Input Attributes

|   参数   |                             说明                             |       类型       |                            可选值                            | 默认值 |
| :------: | :----------------------------------------------------------: | :--------------: | :----------------------------------------------------------: | :----: |
|   type   |                             类型                             |      String      | text，textarea 和其他 [原生 input 的 type 值](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form__types) |  text  |
|   min    |                     原生属性，设置最小值                     |      Number      |                              —                               |  null  |
|   rows   |           输入框行数，只对 `type="textarea"` 有效            |      Number      |                              —                               |   2    |
|   max    |                     原生属性，设置最大值                     |      Number      |                              —                               |  null  |
|   step   |             原生属性，设置输入字段的合法数字间隔             |      Number      |                              —                               |  null  |
| autosize | 自适应内容高度，只对 `type="textarea"` 有效，可传入对象，如，{ minRows: 2, maxRows: 6 } | boolean / object |                              —                               | false  |
| readonly |                      原生属性，是否只读                      |     boolean      |                              —                               | false  |
|  resize  |                     控制是否能被用户缩放                     |      string      |               none, both, horizontal, vertical               |  null  |

### Events

| 事件名 |                  说明                  |                         回调参数                          |
| :----: | :------------------------------------: | :-------------------------------------------------------: |
| change | 仅在输入框失去焦点或用户按下回车时触发 | (currentVal: string \|number , oldVal: string \| number ) |