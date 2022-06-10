<template>  
  <section> 
      <el-drawer title="选择组员" :visible.sync="visible" show-close append-to-body size="50%" @close="option=null"> 
          <xm-group-select :xm-product="xmProduct" :sel-project="selProject" :isSelectSingleUser="isSelectSingleUser"  :visible="visible" @user-confirm="onUserConfirm"></xm-group-select>
      </el-drawer>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库 
  import {
    mapGetters
  } from 'vuex' 
  import XmGroupSelect from "./XmGroupSelect.vue"
  export default {
    name:"tagDialog",
    computed: {
      ...mapGetters([
        'userInfo', 'userInfo'
      ])
    },
    //
    props: ['selProject', 'xmProduct','isSelectSingleUser'],
    watch: {  
       
    },

    data() {
      return {
        visible:false,
        option:null/**{data:'',action:''} */,
      }
    }, //end data
    methods: {
      open(option){
        this.visible=true;
        this.option=option;
      },
      close(){
        this.visible=false;
        this.option=null;
      },
      /**
       * @select-confirm
       * 
       * 
       */
      onUserConfirm(users){ 
        this.$emit('user-confirm',users,{...this.option})
        this.visible=false;
        this.option=null;
      }

    }, //end methods
    components: {  
      XmGroupSelect,
    },
    mounted() {
       
    }
  }
</script>

<style scoped>
 
</style>
