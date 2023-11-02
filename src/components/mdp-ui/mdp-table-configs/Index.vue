<template>    
    <span>
        <!--显示/隐藏列-->
        <el-button @click="showTableColumnConfigs" icon="el-icon-setting">配置</el-button>
        <el-dialog append-to-body :visible.sync="columnConfigsVisible" modal-append-to-body :width="width">
            <el-row>
                 <div style="margin: 15px 0;"></div> 
                <div class="edit_dev" style="text-align: center">

                    <el-transfer v-model="checkedColumns" :data="columnConfigsCpd" :props="{key:'property',label:'label'}"
                            style="text-align: left; display: inline-block;"  
                            :titles="['未选择', '已选择']"
                            :format="{
                                noChecked: '${total}',
                                hasChecked: '${checked}/${total}'
                            }"  
						    filterable
						    :render-content="renderFunc"
                            @change="onCheckColumnChange"
                    ></el-transfer>
                </div>
                
               
            </el-row> 
            <el-row slot="footer"> 
                <el-button type="text" @click="columnConfigsVisible=false">取消</el-button>
                <el-button v-if="formDefId"  @click="goToFormDesign" type="success">设计</el-button>
                <el-button @click="columnConfigSubmit" type="primary">确定</el-button>
            </el-row>
        </el-dialog> 
    </span>
  </template>
  
  <script>  
  export default {
    name: 'mdp-table-configs', 
    props:{
        
        /**
         * 自定义表单编号，用于加载表单配置信息,建议用表名进行编码
         */
         formDefId:{
            type:String,
            default:null,
        },
        columnConfigs:{
            type:Array,
            default:[]
        },
        width:{
            type:String,
            default:'60%'
        },
        value:{
            type:Array,
            default:[]
        },

    },
    watch:{
        value(val){
            if(!val){
                this.checkAllColumn=[]
                return;
            }
            if(typeof val == Array){
                this.checkedColumns=val
            }
            
        }
    },
    computed:{
        columnConfigsCpd:function(){
            return this.columnConfigs.filter(k=>k.property && k.label)
        }
    },
    data(){
        return {
            columnConfigsVisible:false,//是否显示表格的列配置
            checkAllColumn:false,//是否全选
            isIndeterminate:false,
            checkedColumns:[],
        }
    },
    mounted(){ 
        
        this.checkedColumns=this.value
    },
    methods:{
        showTableColumnConfigs(){
            this.columnConfigsVisible=true;
        },
        onCheckAllColumnChange(val){ 
            this.checkedColumns = val ? this.columnConfigs.map(c=>c.property) : [];
            this.isIndeterminate = false; 
        },
        onCheckColumnChange(value){
            let checkedCount = value.length;
            let columnCount=this.columnConfigs.length;
            this.checkAllColumn = checkedCount === columnCount;
            this.isIndeterminate = checkedCount > 0 && checkedCount < columnCount;
        },
        columnConfigSubmit(){
            
           this.$emit("input",this.checkedColumns) 
           this.$emit("checked-columns-change",this.checkedColumns) 
           this.columnConfigsVisible=false;
        },
        renderFunc(h, option) {
            return <span>{ option.label }</span>;
        },
        goToFormDesign(){
            this.columnConfigsVisible=false;
            this.$mdp.goToFormDesign(this.formDefId)
        }
    }
  }
  </script>
<style lang="scss" scoped>  
    @import '../index.scss';
    .edit_dev >>>.el-transfer-panel__list.is-filterable{
		width:250px !important;
		height:550px !important;
	}

	.edit_dev >>>.el-transfer-panel{
		width: 250px !important;
		height: 550px !important;
	} 
</style> 
  