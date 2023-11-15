<template> 
<span>
   <mdp-select-table v-model="myVal" ref="selectTableRef" show-style="tag" placeholder="选择迭代" :props="{id:'id',name:'iterationName'}" :load-fun="listXmIterationWithState" :params="{linkProjectId:linkProjectId}" @change2="onChange2" @clear="onClear" @change="onChange" @click="onRowClick">
      <el-row slot="toolbar"><el-button size="mini" icon="el-icon-plus" @click="$refs['addDialog'].open()">创建迭代</el-button><el-button size="mini" icon="el-icon-search" @click="$refs['selectTableRef'].$refs['tableDialog'].open()">更多迭代</el-button></el-row>
   </mdp-select-table> 
   
   <mdp-dialog ref="addDialog">
    <template v-slot="visible,data,dialog">
      <xm-iteration-add op-type="add"
            :xm-product="productId?{ id: productId, name: '' }:null"
			      :sel-project="linkProjectId?{id:linkProjectId,name:''}:null"
            @cancel="dialog.close()"
            @submit="afterAddSubmit"
          >
          </xm-iteration-add>
    </template>
  </mdp-dialog>
</span>
</template> 

<script>  

 import { listXmIterationWithState } from "@/api/xm/core/xmIteration";
import XmIterationAdd from "../xmIteration/XmIterationEdit.vue";
export default {
  components: { XmIterationAdd },
  name: 'xm-iteration-select',
    props:{ 
    /**
     * 项目编号
     */
      linkProjectId:{
      type:String,
      default:null,
    }, 
    productId:{
      type:String,
      default:null,
    }
    
  },
  data(){
    return { 
      myVal:null,
    }
  },
  methods:{
    listXmIterationWithState, 
    afterAddSubmit(row){  
      this.$refs['selectTableRef'].onTableDataSelect(this.multiple?[row]:row)
    },
    onChange2(row){ 
      debugger;
      this.$emit("selected", row); 
      this.$emit("change2", row);
    },
    onChange(val){ 
      this.$emit("change", val);
      this.$emit("input",val);
    },
    onClear(){ 
      this.$emit("clear");
    },
    onRowClick(row){
      this.$emit('row-click',row)
    }
  },
  mounted(){
       
  }, 
}
</script>
<style lang="scss" scoped>   

</style> 
  