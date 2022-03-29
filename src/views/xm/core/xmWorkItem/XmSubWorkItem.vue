<template>
  <section class="padding">
    <el-row>
       <font>共{{subWorkItemNum}}个子工作项</font> &nbsp;&nbsp;
      <span style="float:right;">
        <xm-project-select style="display:inline;" v-if="parentXmMenu&&parentXmMenu.menuId && parentXmMenu.dclass==='3' && !linkProjectId" :link-product-id="parentXmMenu.productId" @row-click="xmProject=$event"></xm-project-select>
      <el-button v-if="parentXmMenu.dclass==='1'" icon="el-icon-plus" @click="showAdd(2)">
          <div class="icon" style="background-color:  rgb(0, 153, 51);">
            <i class="el-icon-s-flag"></i>
          </div>  添加特性
      </el-button>
      <el-button v-if="parentXmMenu.dclass==='2'" icon="el-icon-plus" @click="showAdd(3)">
        <div  class="icon" :style="{backgroundColor: calcMenuLabel.color }">
          <i :class="calcMenuLabel.icon"></i>
        </div>
        添加用户故事
      </el-button>
      <el-button v-if="parentXmMenu.dclass==='3'" icon="el-icon-plus" @click="showAdd('4')">

        <div class="icon" style="background-color:  #1CC7EA;">
            <i class="el-icon-s-operation"></i>
          </div>
        添加任务</el-button>
      <el-button v-if="parentXmMenu.dclass==='3'" icon="el-icon-plus" @click="showAdd('5')">

        <div class="icon" style="background-color: #F56C6C;">
            <i class="el-icon-warning"></i>
          </div>
        添加缺陷</el-button>
      </span>
    </el-row>
       <xm-sub-menu-list ref="menuList" :link-project-id="linkProjectId?linkProjectId:(xmProject?xmProject.id:null)" :parentXmMenu="parentXmMenu" @menus-change="onMenusChange" @add-submit="$emit('add-sub-menu',$event)"></xm-sub-menu-list>

        <xm-sub-task-list  ref="taskList" :link-project-id="linkProjectId?linkProjectId:(xmProject?xmProject.id:null)" :parentXmMenu="parentXmMenu" @tasks-change="onTasksChange" @workload-submit="onWorkloadSubmit"></xm-sub-task-list>

        <xm-sub-bug-list class="padding-top" ref="bugList" :link-project-id="linkProjectId?linkProjectId:(xmProject?xmProject.id:null)" :parentXmMenu="parentXmMenu" @bugs-change="onBugsChange"></xm-sub-bug-list>
  </section>
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
 import { initSimpleDicts } from '@/api/mdp/meta/item'; //下拉框数据查询

	import { mapGetters } from 'vuex'
  import XmSubMenuList from './XmSubMenuList.vue'
  import XmSubTaskList from './XmSubTaskList.vue'
  import XmSubBugList from './XmSubBugList.vue'
  import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect'

export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]),

			calcMenuLabel(){
				var params={label:'工作项',icon:'',color:''};
				if(this.parentXmMenu.dclass==='0'){
					params={label:'史诗',icon:'el-icon-s-promotion',color:'rgb(255, 153, 51)'};
				}else if(this.parentXmMenu.dclass==='1'){
					params={label:'特性',icon:'el-icon-s-flag',color:'rgb(0, 153, 51)'};
				}else if(this.parentXmMenu.dclass==='2'){
					params={label:'故事',icon:'el-icon-document',color:' rgb(79, 140, 255)'};
				}
				return params;
			},
      subWorkItemNum(){
        var num= this.xmTasks.length+this.xmMenus.length+this.xmBugs.length;
        this.$emit('sub-work-item-num',num);
        return num;
      }
  },
  props: [
    'parentXmMenu','linkProjectId'
  ],
  watch: {
    'parentXmMenu.menuId':function(){
      this.initData();
    }

  },
  data() {
    return{
      load:{edit:false,list:false,add:false},
      xmTasks:[],
      xmBugs:[],
      xmMenus:[],
      xmProject:null,

    }
  }, //end data
  methods: {
    initData(){
      this.xmTasks=[]
      this.xmMenus=[]
      this.xmBugs=[]
    },
      showAdd(dclass) {
        if(dclass<4){
        this.$refs.menuList.showAdd();
        }else if(dclass==='4'){
          if(!this.linkProjectId && !this.xmProject){
            this.$notify({showClose:true,message:'请先选择一个项目',type:'warning'})
            return;
          }
         this.$refs.taskList.showAdd();
        }else if(dclass==='5'){
          if(!this.linkProjectId && !this.xmProject){
            this.$notify({showClose:true,message:'请先选择一个项目',type:'warning'})
            return;
          }
          this.$refs.bugList.showAdd();
        }
    },
    onMenusChange(menus){
      this.xmMenus=menus
    },
    onBugsChange(bugs){
      this.xmBugs=bugs
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
    XmSubMenuList,XmSubTaskList,XmSubBugList,XmProjectSelect
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped>

</style>
