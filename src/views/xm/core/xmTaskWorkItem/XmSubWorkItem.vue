<template>
  <section class="padding">
    <el-row>
       <font>共{{subWorkItemNum}}个子工作项</font> 
      <span style="float:right;"> 
      <el-button v-if="parentXmTask.ntype==='1'" icon="el-icon-plus" @click="showAdd('1')"> 
        <div class="icon" style="background-color:  #E6A23C;">
            <i class="el-icon-odometer"></i>
          </div>
        添加子计划
      </el-button>
      <el-button icon="el-icon-plus" @click="showAdd('0')">

        <div class="icon" style="background-color: #409EFF;">
            <i class="el-icon-s-operation"></i>
          </div>
        添加任务</el-button> 
      </span>
    </el-row> 
        <xm-sub-task-list  ref="taskList"  :parentXmTask="parentXmTask" @tasks-change="onTasksChange" @workload-submit="onWorkloadSubmit"></xm-sub-task-list>
   </section>
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
 import { initSimpleDicts } from '@/api/mdp/meta/item'; //下拉框数据查询

	import { mapGetters } from 'vuex'
   import XmSubTaskList from './XmSubTaskList.vue' 

export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]),

			calcMenuLabel(){
				var params={label:'工作项',icon:'',color:''};
				if(this.parentXmTask.ntype==='0'){
					params={label:'计划',icon:'el-icon-odometer',color:'#E6A23C'};
				}else if(this.parentXmTask.ntype==='1'){
					params={label:'任务',icon:'el-icon-s-operation',color:'#409EFF'};
				} 
				return params;
			},
      subWorkItemNum(){
        var num= this.xmTasks.length;
        this.$emit('sub-work-item-num',num);
        return num;
      }
  },
  props: [
    'parentXmTask','linkProductId'
  ],
  watch: {
    'parentXmTask.id':function(){
      this.initData();
    }

  },
  data() {
    return{
      load:{edit:false,list:false,add:false},
      xmTasks:[],  

    }
  }, //end data
  methods: {
    initData(){
      this.xmTasks=[]  
    },
      showAdd(ntype) { 
          this.$refs.taskList.showAdd(ntype); 
    },  
    onTasksChange(tasks){
      this.xmTasks=tasks
    },
    onWorkloadSubmit(xmTask){
      this.$emit('workload-submit',xmTask)
    }
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
     XmSubTaskList 
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped>

</style>
