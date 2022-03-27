<template>  
  <section> 
      <el-drawer title="选择标签" :visible.sync="visible" show-close append-to-body size="50%" @close="option=null"> 
          <tag-mng :jump="jump" :tagIds="tagIds" :visible="visible" @select-confirm="onSelectConfirm"></tag-mng>
      </el-drawer>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库 
  import {
    mapGetters
  } from 'vuex' 
  import TagMng from "./TagMng.vue"
  export default {
    name:"tagDialog",
    computed: {
      ...mapGetters([
        'workShop', 'userInfo'
      ])
    },
    //
    props: ['jump',   'tagIds'],
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
      onSelectConfirm(selectTags){ 
        this.$emit('select-confirm',selectTags,{...this.option})
        this.visible=false;
        this.option=null;
      }

    }, //end methods
    components: {  
      TagMng,
    },
    mounted() {
       
    }
  }
</script>

<style scoped>
 
</style>
