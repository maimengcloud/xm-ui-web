### mdp-Field

#### 基本用法

```vue
<mdp-field show-style="x" :disabled="false" :value="obj" label="" placeholder="占位符" color="#6BC8A2"
           icon="el-icon-goods" size="small" @change="change">
</mdp-field>
```

```js
data() {
  return {
    obj: ''
  }
},

methods: {
  change(currentVal, oldVal) {
    this.obj = currentVal
  },
},
```



#### 自定义

下列是 mdp-field 的插槽层次结构

```js
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
  ├── <span>
  │   └── <slot name="oper"></slot>
  └──	</span>
</slot>
```

例子

```js
data() {
  return {
    obj: ''
  }
}
```

```vue
    <mdp-field show-style="x">
      <template v-slot:avater>
        <i class="el-icon-s-custom"></i>
      </template>
      <template v-slot:info>
        <el-input placeholder="username" :disabled="true"></el-input>
      </template>
      <template v-slot:oper>
        <el-input v-model="obj"></el-input>
      </template>
    </mdp-field>
```

<img src="../../../../docs/images/ui-components/mdp-field/image-20240111190935618.png" alt="image-20240111190935618" style="zoom:50%;"/>
<img src="../../../../docs/images/ui-components/mdp-field/image-20240111191052830.png" alt="image-20240111191052830" style="zoom:50%;" />



### Attributes

| 参数        | 说明                       | 类型           | 可选值                          | 默认值 |
| ----------- | -------------------------- | -------------- | ------------------------------- | ------ |
| disabled    | css: pointer-events: none; | Boolean        | -                               | false  |
| value       | 文本框的内容               | String, Number | -                               | ''     |
| label       | 标签字段                   | String         | -                               | ''     |
| placeholder | 占位符                     | String         | -                               | ''     |
| color       | 背景色                     | String         | -                               | ''     |
| icon        | 图标                       | String         | -                               | ''     |
| showStyle   | 控制组件的布局             | String         | x / 不是x的任意值               | x      |
| size        | 设置头像的大小             | number/string  | number / large / medium / small | small  |

### Events

| 事件名 | 说明                                   | 回调参数                                                  |
| ------ | -------------------------------------- | --------------------------------------------------------- |
| change | 仅在输入框失去焦点或用户按下回车时触发 | (currentVal: string \|number , oldVal: string \| number ) |

