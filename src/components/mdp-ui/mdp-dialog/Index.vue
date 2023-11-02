<template>     
    <el-dialog :title="myTitle" append-to-body modal-append-to-body :visible.sync="visible" :fullscreen="fullscreen" :width="width?width:'70%'" :close-on-click-modal="closeOnClickModal">
       <slot :visible="visible" :title="myTitle" :data="this.data?this.data:{}" :dialog="that">
          
       </slot>
       <template slot="footer" >
            <slot name="footer" :visible="visible" :title="myTitle" :data="this.data?this.data:{}" :dialog="that" >
  
            </slot>
          </template>
    </el-dialog>
</template>

<script> 
 export default {
  name: 'mdp-dialog', 
  computed:{
     
  },
  watch:{ 
  },
  props:{ 
    /**
     * 弹出框的宽度
     */
    width:{
      type:String,
      default:'70%'
    },
    title:{
      type:String,
      default:'',
    },  
    fullscreen:{
      type:Boolean,
      default:false
    },
    closeOnClickModal:{
      type:Boolean,
      default:false,
    }
  },
  data(){
    return {
      visible:false, 
      data:{},
      that:this,
      myTitle:'请选择',
    }
  },
  methods:{ 
    open(data){
      this.visible=true   
      this.data=data
      if(data && data.title){
        this.myTitle=data.title
      }
    },
    close(){
      this.visible=false; 
    }
     
  },
  mounted(){   
    this.myTitle=this.title
    
  },
  updated(){ 
    
  }
}
</script>
<style lang="scss" scoped>  
.el-dialog {
  max-height: 96%; 
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
} 


:root{
  --footer-height: 50px;
}
 
.footer{ 
  text-align: right;
  position: fixed;
  bottom: 0; 
  margin-top:10px;
  width: 100%;
  right: 50px;
  line-height: var(--footer-height); 
  color: #fff;
} 
/**
  修改弹出框关闭按钮，放大，原来的太小
**/
.el-dialog__headerbtn {
  top: 8px !important; 
  background-size: cover;
 }
 .el-dialog__headerbtn i { 
  font-size: 32px; 
 }

</style> 
