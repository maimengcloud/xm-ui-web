### 高级查询 mdp-hi-query 效果图   
![mdp-hi-query](/docs/images/ui-components/hi-query.jpg)  

### 用法

```js
 data(){
  return {
    /**表格列信息 */
    columnConfigs:[],
    /**查询条件树状结构 */
    hiQueryParams:null,
  }
 },
 method:{
  /**
   * 监听高级查询参数编号
   */
    onHiQueryParamsChange(hiQueryParams){
      this.hiQueryParams=hiQueryParams
      this.searchTableDatas();
    }, 
 }

```
```html
  <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
```

### Attributes
|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
|columnConfigs|表的列信息|Array
|value / v-model|查询条件|Object 


### Events
|事件名称|说明|回调参数|
|--------|------|--------|
change|用户点击确认按钮后触发|hiQueryParams
 
### hiQueryParams的属性

|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
cid|条件编号，自动创建| String  
property|属性名(英文，驼峰命名)| String  
colType|数据库字段类型| String | String 、 int 、 long 、 double 、 float 、 Date 、 Datatime 、 BigDecimal 、 Long 、 Integer 、 Float 、 Double | String 
sqlLink|默认链接操作符| String | and 、 or  | and
sqlOper|默认运算操作符| String | >= 、 > 、 <= 、 < 、 != 、 = 、$IS NULL 、$IS NOT NULL 、$NOT IN 、$IN 、$BETWEEN 、$LIKE LEFT 、$LIKE RIGHT 、$LIKE | = 
sqlVal|默认取值
endVal|结束值，$BETWEEN时用到
colPrefix|列的前缀，比如res. 用于后端联表查询字段重复时区分| String  
children|子条件,属性参考 hiQueryParams |Array 


### columnConfigs的属性

|参数|说明|类型|可选值|默认值|
|--------|------|--------|-----------------|----------------|
label|列名(中文) | String 
property|属性名(英文，驼峰命名)| String 
sortNo|排序从0-999，越小越靠前| Number 
isCommon|是否常用| Boolean | true 、 false | false  
colType|数据库字段类型| String  | String 、 int 、 long 、 double 、 float 、 Date 、 Datatime 、 BigDecimal 、 Long 、 Integer 、 Float 、 Double | String 
showHiQuery|是否显示在高级查询| Boolean | true 、 false | true
sqlLink|默认链接操作符| String  | and 、 or  | and
sqlOper|默认运算操作符| String | >= 、 > 、 <= 、 < 、 != 、 = 、$IS NULL 、$IS NOT NULL 、$NOT IN 、$IN 、$BETWEEN 、$LIKE LEFT 、$LIKE RIGHT 、$LIKE | = 
sqlVal|默认取值
endVal|结束值，$BETWEEN时用到
itemCode|数据字典代码，如果时下拉选项必填| String 
colPrefix|列的前缀，比如res. 用于后端联表查询字段重复时区分| String   
