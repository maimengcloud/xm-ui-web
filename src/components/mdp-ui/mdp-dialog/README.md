### mdp-dialog
该组件相对于el-dialog，进行了以下三项优化：
- 放大右上角x字体
- 无须传入visible变量，避免出现界面上的一堆控制弹框的变量，直接通过$refs['xxxDialog'].open(params)打开弹框。页面变得整洁
- 提供了两个插槽，body,footer用于装载任意页面

### 用法

#### 假设需要弹框方式打开组件item-form.vue,并且需要把subOpType,formData两个参数在打开窗口的时候传递给item-form组件  
```html 
<mdp-dialog ref="xxFormDialog">
    <template v-slot="{visible,data,dialog}">
        <item-form ref="xxForm" :show-btn="false" :sub-op-type="data.subOpType" :form-data="data.formData" :visible="visible" :parent-op-type="currOpType" @close="dialog.close()" @submit="afterFormSubmit"></item-form>
    </template>
</mdp-dialog>
```
```js 
// 打开弹框
this.$refs['xxFormDialog'].open({subOpType:'add',formData:this.formData})

// 关闭弹框
this.$refs['xxFormDialog'].close()
```

#### 假设需要外部定制底部按钮
```html 
<mdp-dialog ref="xxFormDialog"> 
    <template v-slot#footer="{visible,data,dialog}">
         <el-row>
            <el-button @click="dialog.close()">关闭</el-button> 
         </el-row>
    </template>
</mdp-dialog>
```
```js 
//打开弹框
this.$refs['xxFormDialog'].open({subOpType:'add',formData:this.formData})
```



#### `Attributes`

| 参数                 | 说明                                            | 类型    | 可选值 | 默认值 |
| -------------------- | ----------------------------------------------- | ------- | ------ | ------ |
| title                | Dialog 的标题，也可通过具名 slot （见下表）传入 | string  | —      | ''     |
| width                | Dialog 的宽度                                   | string  | —      | 70%    |
| fullscreen           | 是否为全屏 Dialog                               | boolean | —      | false  |
| close-on-click-modal | 是否可以通过点击 modal 关闭 Dialog              | boolean | —      | False  |



