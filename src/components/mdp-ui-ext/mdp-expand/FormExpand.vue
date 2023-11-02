<template> 
    <form-data :visible="visible" :label-width="labelWidth" :label-position="labelPosition" v-if="formFields&&formFields.length>0" ref="formDataRef" v-model="editForm" :formFields="formFields" :form-def="formDef" @change="onChange"><div></div></form-data>
</template>

<script>

import FormData from './FormData';
/**
 * 自能表单表单扩展
 */
export default {
    name:'FieldExpand',
     components: {
        FormData,
    },
    computed: {
    },
    props:{
        visible:{
            type:Boolean,
            default:false,
        },
        expandId:{
            type:String,
            default:null,
        },
        value:{
            type:[String,Object],
            default:null,
        },
        
		labelWidth:{type:String,default:null},
        labelPosition:{type:String,default:null}
    },
    watch: {
        expandId(){
            
            this.getFormFields();
        },
        value(){
          
            this.initCurrData();
        },
    },
    data() {
        return {
             load:{list:false},
            editForm: {
                 
            }, 
            formDef:{},
            formFields:[],
            formDataVisible:false,
        }
    },
    methods: {
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){
            
            if(this.value){
               if(this.value instanceof Object ){
                Object.assign(this.editForm,this.value)
                }else if(this.value instanceof String && this.value.startsWith('{')){
                 Object.assign(this.editForm,JSON.parse(this.value))
              }
            } 
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
                    //this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
                }
                this.load.list=false;
            }).catch(() => {
                this.load.list=false;
            });
        },
        onChange(val){
            if(this.value==null || this.value==''){
                this.$emit('input',JSON.stringify(this.editForm)) 
                this.$emit('change',this.editForm)
                return;
            }
            if(this.value instanceof Object ){
               this.$emit('input',this.editForm)
               this.$emit('change',this.editForm)
            }else if(this.value instanceof String && this.value.startsWith('{')){
                this.$emit('input',JSON.stringify(this.editForm)) 
                this.$emit('change',this.editForm)
            } 
        }
    },
    mounted() {
        this.initCurrData();
        this.getFormFields();
    }
}

</script>

<style scoped>

</style>