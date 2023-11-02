<template>
  <section>
    <el-dialog :visible.sync="visible" append-to-body modal-append-to-body :width="width">
      <dept-index :visible="visible" :params="data" :multiple="multiple" :sub-op-type="'select'" @select="(v)=>{$emit('select',v);visible=false;}"/>
    </el-dialog>
  </section>
</template>

<script> 
import DeptIndex from './Index'
export default {
  
  name:"DeptSelect",
  computed: {  
  },
  props:['multiple'],
  data() {
    return {
       data:{}
    };
  }, //end data
  methods: {
    open(data){
      this.visible=true;
    },
    close(){
      this.visible=false;
    }
  }, //end methods
  components: { 
  },
  mounted() {  
			 
  }
};
</script>

<style scoped>
</style>
