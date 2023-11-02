### mdp-date-range
该组件相对于el-date-range，进行了以下两项优化：
- 提供origin\tag\x三种样式
- 可以直接传入一个对象，指定start-key,end-key，自动更新对象对应的属性。免去一堆的转换过程

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
