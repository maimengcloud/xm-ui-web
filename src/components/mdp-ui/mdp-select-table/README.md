### mdp-select-table 效果图
- 该组件与mdp-select效果一致，同样支持origin/tag/x三种风格，不同之处在于具有分页功能，适合超大表格数据的选择，如下图1所示，默认只会展示用过的数据，如果需要更多数据，需要点击【更多数据】按钮，将会弹出图2所示,当用户选中数据后，数据将填充到图1的下拉列表中，并且能够模拟select的选中事件
![mdp-select-table-select](/docs/images/ui-components/mdp-select-table-select.png)   

![mdp-select-table](/docs/images/ui-components/mdp-select-table.png)   

### 用法  

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
相关配置与mdp-table一摸一样，具体查看
[mdp-table](/src/components/mdp-ui/mdp-table)