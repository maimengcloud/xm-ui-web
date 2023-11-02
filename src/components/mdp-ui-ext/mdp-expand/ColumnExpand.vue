<template>
    <section>
        <el-table-column v-for="(field,idx) in formFields" :key="idx" :prop="expandFieldName+'.'+field.idCaml" :label="field.title">
            <template v-slot="scope">
                <div>{{ scope.row[expandFieldName][field.idCaml] }}</div>
            </template>
        </el-table-column>
    </section>
 </template>

<script>
 /**
  * 自能表单表格展示列扩展
  */
export default {
    name:'ColumnExpand',
     components: { 
    },
    computed: {
    },
    props:{
        /**
         * 存储自定义表单数据的字段
         */
        expandFieldName:{
            type:String,
            default:'extInfos'
        },
        expandId:{
            type:String,
            default:null,
        }, 
    },
    watch: {
        
    },
    data() {
        return { 
            load:{list:false},
            formDef:{},
            formFields:[],
        }
    },
    methods: {
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){
            
            this.getFormFields();
         },
        
        //获取列表 FormField 表单字段定义
        getFormFields() { 
                 
            if(!this.expandId){
                return;
            }
            let params = {
                formId:this.expandId
            };
            this.load.list=true;
            this.$mdp.listFormFieldCacheFirst(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){   
                    this.formFields = res.data.data.formFields; 
                    this.formDef=res.data.data.formDef
                }else{
                    this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
                }
                this.load.list=false;
            }).catch(() => {
                this.load.list=false;
            });
        } 
    },
    mounted() {
        this.initCurrData();
    }
}

</script>

<style scoped>

</style>