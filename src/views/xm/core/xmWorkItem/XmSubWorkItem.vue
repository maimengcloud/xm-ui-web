<template>
  <section class="padding">
    <el-row>
       <font>共{{subWorkItemNum}}个子工作项</font>
      <span style="float:right;">
      <el-button v-if="parentXmMenu.dclass==='1'" icon="el-icon-plus" @click="showAdd"> 
          <div class="icon" style="background-color:  rgb(0, 153, 51);">
            <i class="el-icon-s-flag"></i>
          </div>  添加特性
      </el-button>
      <el-button v-if="parentXmMenu.dclass==='2'" icon="el-icon-plus" @click="showAdd">
        <div  class="icon" :style="{backgroundColor: calcMenuLabel.color }">
          <i :class="calcMenuLabel.icon"></i>
        </div>  
        添加用户故事
      </el-button>
      <el-button v-if="parentXmMenu.dclass==='3'" icon="el-icon-plus" @click="showAdd">
        
        <div class="icon" style="background-color:  #1CC7EA;">
            <i class="el-icon-s-operation"></i>
          </div>
        添加任务</el-button>
      <el-button v-if="parentXmMenu.dclass==='3'" icon="el-icon-plus" @click="showAdd">
        
        <div class="icon" style="background-color: #F56C6C;">
            <i class="el-icon-warning"></i>
          </div>
        添加缺陷</el-button>
      </span>
    </el-row>
    <el-row v-if="parentXmMenu.dclass<'3' && xmMenus.length>0">
      <el-row v-if="parentXmMenu.dclass==='1'">
         <div class="icon" style="background-color:  rgb(0, 153, 51);">
            <i class="el-icon-s-flag"></i>
          </div>特性
      </el-row>
      <el-row v-if="parentXmMenu.dclass==='2'">
        <div  class="icon" :style="{backgroundColor: calcMenuLabel.color }">
            <i :class="calcMenuLabel.icon"></i>
          </div>  
          用户故事  
      </el-row> 
      <el-row>
        <el-table :data="xmMenus" :show-header="false">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="menuName" label="名称"></el-table-column>
        </el-table> 
      </el-row>
    </el-row>
    
    <el-row v-if="parentXmMenu.dclass==='3' && xmTasks.length>0">
      <el-row>
         <div class="icon" style="background-color:  #1CC7EA;">
            <i class="el-icon-s-operation"></i>
          </div>
        任务</el-row> 
      <el-row>
        <el-table :data="xmTasks" :show-header="false">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
        </el-table> 
      </el-row>
    </el-row>
    
    <el-row v-if="parentXmMenu.dclass==='3' && xmBugs.length>0">
      <el-row>
        
        <div class="icon" style="background-color: #F56C6C;">
            <i class="el-icon-warning"></i>
          </div>
        缺陷</el-row> 
      <el-row>
        <el-table :data="xmBugs" :show-header="false">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
        </el-table> 
      </el-row>
    </el-row> 
  </section>
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
 import { initSimpleDicts } from '@/api/mdp/meta/item'; //下拉框数据查询
import { 
  listXmTask, 
} from "@/api/xm/core/xmTask"; 
	import { listXmQuestion} from '@/api/xm/core/xmQuestion';
	import { listXmMenu } from '@/api/xm/core/xmMenu';

	import { mapGetters } from 'vuex'

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
    'parentXmMenu'
  ],
  watch: { 
    'parentXmMenu.menuId':function(){
      this.initData();
    }
    
  },
  data() { 
    return{
      xmTasks:[],
      xmBugs:[],
      xmMenus:[],

    }
  }, //end data
  methods: {

    getXmTasks(){
      listXmTask({menuId:this.parentXmMenu.menuId}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          this.xmTasks=res.data.data
        }else{
          this.xmTasks=[];
        }
      })
    },
    getXmMenus(){
      listXmMenu({pmenuId:this.parentXmMenu.menuId}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          this.xmMenus=res.data.data
        }else{
          this.xmMenus=[];
        }
      })
    },
    
    getXmBugs(){
      listXmQuestion({menuId:this.parentXmMenu.menuId}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          this.xmBugs=res.data.data
        }else{
          this.xmBugs=[];
        }
      })
    },
    initData(){ 
      this.xmTasks=[]
      this.xmMenus=[]
      this.xmBugs=[]
      if(!this.parentXmMenu || !this.parentXmMenu.menuId){
        return;
      }
      var dclass=this.parentXmMenu.dclass;
      if(dclass<3){
        this.getXmMenus();
      }else{
        this.getXmTasks();
        this.getXmBugs();
      }
    },
    showAdd(){

    }
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: { 
  },
  mounted() { 
    this.initData();
  },
};
</script>

<style scoped> 
  
</style>
