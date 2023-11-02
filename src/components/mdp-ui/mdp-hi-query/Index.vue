<template>    
    <span>
        <!--显示/隐藏列-->
        <el-button :type="type" @click="showHiQuery" :style="styleObj" icon="el-icon-magic-stick" :circle="circle" :round="round" :plain="plain">高级查询</el-button> 
        <el-badge :value="conditionCount"> 
        </el-badge>
        &nbsp;&nbsp;&nbsp;
        <el-dialog append-to-body :visible.sync="hiQueryVisible" :width="width">
            <el-tree class="my-hi-query"
                :data="treeDataCpd" 
                node-key="cid"
                default-expand-all
                :expand-on-click-node="false">
                <span slot-scope="{ node, data }">
                    <!--列名-->
                    
                    <el-row v-if="data.sqlLink=='AND' || data.sqlLink=='OR'" class="hi-query-row" :gutter="10" justify="start" type="flex" align="middle"> 
                        <el-col :span="14">
                            <div style="width:100%;min-width: 210px;"><mdp-select show-style="tag" key="0"  v-model="data.sqlLink" item-code="sql_link_and_sql_oper" :filter-fun="(o,i)=>filterFun(o,i,'SQL_LINK')" @change2="onSqlLinkChange($event,data)"/>
                            </div>
                        </el-col>  
                        <el-col :span="10">
                            
                            <el-button
                                type="text"
                                size="mini"
                                @click="() => appendSqlLink(node,data)">
                                新增连接符
                            </el-button>
                            <el-button
                                type="text"
                                size="mini"
                                @click="() => append(node,data)">
                                新增条件
                            </el-button>
                            <el-button v-if="node.parent.parent"
                                type="text"
                                size="mini"
                                @click="() => remove(node, data)">
                                删除
                            </el-button> 
                        </el-col>
                     </el-row>
                     <el-row v-else class="hi-query-row" :gutter="10">  
                        <!--列名----> 
                            <mdp-select key="1" style="width:10em;" v-model="data.property" :options="columnOptionsCpd" @change2="(c)=>onColumnChange(c,data)"/> 
               
                        <!--操作符--> 
                            <mdp-select  key="3" style="width:8em;" v-model="data.sqlOper" item-code="sql_link_and_sql_oper" :filter-fun="(o,i)=>filterFun(o,i,'SQL_OPER')"/>
 
                            <span v-if="data.sqlOper!='$IS NULL' && data.sqlOper!='$IS NOT NULL'">
                                <!--如果是数据字典-->
                                <span v-if="data.itemCode!=null && data.itemCode!=''">
                                    <mdp-select v-model="data.sqlVal" :item-code="data.itemCode" width="14rem" placeholder="空值将自动忽略"/>
                                </span> 
                                <span v-else-if="data.dictOptions">
                                    <mdp-select v-model="data.sqlVal" :options="data.dictOptions" width="14rem" placeholder="空值将自动忽略"/>
                                </span>
                                <span v-else-if="data.colType=='Date'">
                                    <el-date-picker  style="width:14rem;"
                                        v-model="data.sqlVal"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </span>
                                <span v-else-if="data.colType=='String'">
                                    <el-input v-model="data.sqlVal" style="width:14rem;"/>
                                </span>
                                <span v-else-if="data.colType=='Datetime'">
                                    <el-date-picker  style="width:14rem;"
                                        v-model="data.sqlVal"
                                        type="datetime" 
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期时间">
                                    </el-date-picker>
                                </span>
                                <span v-else-if="['int','Integer','long','Long'].some(k=>k==data.colType)">
                                    <el-input-number :precision="0" v-model="data.sqlVal" style="width:14rem;" placeholder="空值将自动忽略"/>
                                </span>
                                <span v-else-if="['float','Float','double','Double','BigDecimal'].some(k=>k==data.colType)">
                                    <el-input-number :precision="2" v-model="data.sqlVal" style="width:14rem;" placeholder="空值将自动忽略"/>
                                </span> 
                                <span v-else>
                                    <el-input v-model="data.sqlVal" style="width:14rem;" placeholder="空值将自动忽略"/>
                                </span> 
                            </span>
                            <span v-if="data.sqlOper=='$BETWEEN'">
                                ~
                                <!--如果是数据字典-->
                                <span v-if="data.itemCode">
                                    <mdp-select v-model="data.endVal" :item-code="data.itemCode" width="14rem" placeholder="空值将自动忽略"/>
                                </span> 
                                <span v-else-if="data.dictOptions">
                                    <mdp-select v-model="data.endVal" :options="data.dictOptions" width="14rem" placeholder="空值将自动忽略"/>
                                </span>
                                <span v-else-if="data.colType=='Date'">
                                    <el-date-picker style="width:14rem;"
                                        v-model="data.endVal"
                                        type="date"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </span>
                                <span v-else-if="data.colType=='String'">
                                    <el-input v-model="data.endVal" style="width:14rem;"/>
                                </span>
                                <span v-else-if="data.colType=='Datetime'">
                                    <el-date-picker style="width:14rem;"
                                        v-model="data.endVal"
                                        type="datetime" 
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期时间">
                                    </el-date-picker>
                                </span>
                                <span v-else-if="['int','Integer','long','Long'].some(k=>k==data.colType)">
                                    <el-input-number :precision="0" v-model="data.endVal" style="width:14rem;" placeholder="空值将自动忽略"/>
                                </span>
                                <span v-else-if="['float','Float','double','Double','BigDecimal'].some(k=>k==data.colType)">
                                    <el-input-number :precision="2" v-model="data.endVal" style="width:14rem;" placeholder="空值将自动忽略"/>
                                </span> 
                                <span v-else>
                                    <el-input v-model="data.endVal" style="width:14rem;" placeholder="空值将自动忽略"/>
                                </span> 
                            </span> 
                            <el-button
                                type="text"
                                size="mini"
                                @click="() => remove(node, data)">
                                删除
                            </el-button> 
                     </el-row>

                </span>
            </el-tree> 
            <div slot="footer"> 
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </el-dialog>
    </span>
  </template>
  
  <script>   
  import util from "../js/util.js"
  export default {
    name: 'mdp-hi-query', 
    computed:{
        conditionCount(){
            return this.countHiQueryParams(this.queryCondition)
        },
        columnOptionsCpd(){ 
            var columnConfigs=this.columnConfigs.filter(k=>k.showHiQuery!=false&&k.property) 
            var cols= columnConfigs.map(c=>{
                return {
                    id:c.property,
                    name:c.label,
                    colType:c.colType,
                    sqlVal:c.sqlVal,
                    colPrefix:c.colPrefix, 
                    endVal:c.endVal,
                    isCommon:c.isCommon,
                    itemCode:c.itemCode, 
                    dictOptions:c.dictOptions
                }
            })
            cols.sort((a,b)=>{
                if(a.isCommon==true && b.isCommon!=true){
                    return -1
                }else if(a.isCommon==true && b.isCommon==true){
                    return 0
                }else if(a.isCommon!=true && b.isCommon==true){
                    return 1
                }else {
                    return 9
                }
            })
            return cols
        },
        treeDataCpd(){
            var defVal={cid:util.createSeqNo("hq_"),label:'AND',property:'',children:[],sqlLink:'AND'}; 
            if(this.queryCondition==null||!this.queryCondition.cid){
                this.queryCondition=defVal;
                return [defVal]
            }else{
                return [this.queryCondition]
            }
        }
    },
    props:{
        columnConfigs:{
            type:Array,
            default:[]
        },
        value:{
            type:Object,
            default:null,
        },
        width:{
            type:[String,Number],
            default:'60%'
        },
        type:{
            type:String,
            default:'text'
        }, 
        plain:{
            type:Boolean,
            default:false
        },
        round:{
            type:Boolean,
            default:false
        },
        circle:{
            type:Boolean,
            default:false
        },
        styleObj:{
            type:Object,
            default:null
        }
    },
    watch:{
        value(val){
            this.queryCondition=val&&val.cid?val:this.createDefSqlLink();
        },
        columnOptionsCpd(val){
            
            if(val && val.length>0){
                this.queryCondition=this.createDefSqlLink();
            }
            
        }
    },
    data(){
        return {
            hiQueryVisible:false,//是否显示表格的列配置
            checkAllColumn:false,//是否全选
            isIndeterminate:false,

            /**
             * 根据表格头初始化columnConfigs
             * {
             * cid:'主键，自动生成',
             * label:'列名',
             * property:'属性名',
             * sortNo:'排序从0-999，越小越靠前',
             * isCommon:'是否常用',
             * colType:'数据库字段类型 string/int/date/datatime/',
             * showHiQuery:'是否显示在高级查询true/false',
             * showCol:'是否在表格中显示该列true/false',
             * sqlLink:'链接操作符 and or ',
             * sqlOper:'运算操作符，默认eq gt/lt/ge/le/eq/ne/left_like/right_like/like/in/nin/bwtween/sql',
             * sqlVal:'查询条件值，多选的话逗号分隔'，如果时bwtween，该值存开始值
             * endVal:'',
             * itemCode:'字典表中itemCode字段，填写了该值将从字典表加载下拉列表'
             * colPrefix:'属性需要添加前缀是使用，比如res.id=xxxxx,此次填写res.',
             * hiDisabled:'是否允许编辑查询条件',
             * children:[],
             * } 
             */
            queryCondition:{},
        }
    },
    mounted(){   
        if(this.value && this.value.cid){
            this.queryCondition=this.value
        }else{
            this.queryCondition=this.createDefSqlLink();
        }
         
    },
    methods:{
        createDefCondition(){
            var newChild = { cid: util.createSeqNo('hq_'), sqlLink:'', label: '', children: [],sqlOper:'=',sqlVal:'',endVal:'',colType:'',itemCode:'',dictOptions:[] };
            return newChild;
        },
        createDefSqlLink(){
            var newChild = this.createOneSqlLink();
            if(this.columnOptionsCpd.length>0){
                var defNum=this.columnOptionsCpd.length>5?5:this.columnOptionsCpd.length
                var children=[]; 
                for(var i=0;i<defNum;i++){
                    var condition=this.columnOption2Condition(this.columnOptionsCpd[i]);
                    children.push(condition)
                }
                newChild.children=children;
            }
            return newChild;
        },
        createOneSqlLink(){
            var newChild = { cid: util.createSeqNo('hq_'), sqlLink:"AND", label: 'AND', children: [],sqlOper:'',sqlVal:'',endVal:'',colType:'',itemCode:'',dictOptions:[] };
            return newChild;
        },
        append(node,data){
             if (!data.children) {
            this.$set(data, 'children', []);
            }
            data.children.push(this.createDefCondition());
        },
        appendSqlLink(node,data){
            if (!data.children) {
            this.$set(data, 'children', []);
            }
            data.children.push(this.createOneSqlLink());
        },
        
        remove(node,data){
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.cid === data.cid);
            children.splice(index, 1);
        },
        showHiQuery(){
            this.hiQueryVisible=true;
        }, 
        save(){ 
           this.$emit("input",this.queryCondition) 
           this.$emit("change",this.queryCondition) 
           this.hiQueryVisible=false;
        },
        filterFun(option,item,operType){
            if(!option.relyTypes){
                return true;
            }
            if(option.relyTypes.indexOf(operType)>=0){
                return true;
            }
            return false;
        },
        onSqlLinkChange(val,data){  
            if(val){
                data.label=val.name 
            }else{
                data.label=''
            }
            
        },
        columnOption2Condition(column,c){
            if(!c){
                c={cid:util.createSeqNo("hq_")}
            }else if(!c.cid){
                c.cid=util.createSeqNo("hq_")
            } 
            
            c.label=column.name
            c.colType=column.colType
            c.isCommon=column.isCommon
            c.colPrefix=column.colPrefix
            c.sqlVal=column.sqlVal
            c.endVal=column.endVal
            c.itemCode=column.itemCode
            c.dictOptions=column.dictOptions
            c.sqlOper='='
            c.property=column.id
            return c;
        },
        onColumnChange(column,c){ 
            this.columnOption2Condition(column,c)
        },
        /**
         * 计算有效的条件
         * @param {*} hi 
         * @returns 
         */
         countHiQueryParams(hi){
            var that=this;
            var count=0;
            if(hi==null || !hi.cid){
                return 0;
            }else{
                if(hi.children&&hi.children.length>0){
                    if(hi.sqlLink=='AND'||hi.sqlLink=='OR'){ 
                        hi.children.forEach(k=>{
                            var child=that.countHiQueryParams(k);
                            count=count+child
                        })
                        return count;
                    }else{
                        return 0;
                    }
                }else{
                    if(hi.sqlLink=='AND'||hi.sqlLink=='OR'){
                        return 0;
                    }else{
                        if(hi.sqlOper=='=' && !hi.sqlVal){
                            return 0;
                        }else if(!hi.sqlOper){
                            return 0;
                        }else if(hi.sqlOper!='$IS NULL' && hi.sqlOper!='$IS NOT NULL'){
                            if(hi.sqlVal==null || hi.sqlVal==''){
                                return 0;
                            }
                        }
                        return 1;
                    }
                }
            }
        },
    }
  }
  </script>
<style lang="scss" scoped>   
/deep/ .el-tree-node__content {
    height: 50px;
}
.hi-query-row { 
    margin-top: 20px;
    margin-bottom: 20px;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style> 
  