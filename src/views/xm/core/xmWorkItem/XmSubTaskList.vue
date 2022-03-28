<template>
    <el-row v-if="parentXmMenu.dclass==='3' && xmTasks.length>0"> 
      <el-row>
         <div class="icon" style="background-color:  #1CC7EA;">
            <i class="el-icon-s-operation"></i>
          </div>
        任务
      </el-row>
      <el-row>
        <el-table :data="xmTasks" :show-header="false" :max-height="400">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
        </el-table> 
      </el-row>
    </el-row> 
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
 import { initSimpleDicts } from '@/api/mdp/meta/item'; //下拉框数据查询 
 	import { listXmTask ,addTask } from '@/api/xm/core/xmTask';

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
  },
  props: [ 
    'parentXmMenu','linkProjectId'
  ],
  watch: { 
    'parentXmMenu.menuId':function(){
      this.initData();
    },
    'xmTasks':function(){
      this.$emit("bugs-change",this.xmTasks)
    }
    
  },
  data() { 
    return{
      load:{edit:false,list:false,add:false}, 
      xmTasks:[],

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
     
    initData(){  
      this.xmTasks=[] 
      if(!this.parentXmMenu || !this.parentXmMenu.menuId){
        return;
      }
      var dclass=this.parentXmMenu.dclass;
      if(dclass==='3'){
        this.getXmTasks();
      } 
    }, 
    addXmTask(name){ 
       var task={name:name,menuId:this.parentXmMenu.menuId,menuName:this.parentXmMenu.menuName,productId:this.parentXmMenu.productId,iterationId:this.parentXmMenu.iterationId,iterationName:this.parentXmMenu.iterationName}
             task.priority='3'
             task.verNum=this.parentXmMenu.sinceVersion;
             task.pverNum=this.parentXmMenu.sinceVersion;
             task.askUserid=this.userInfo.userid
             task.askUsername=this.userInfo.username 
             task.qtype="1"
             task.ntype="0"
             task.ptype="0"
             task.id=null;
             task.name=name
             task.projectId=this.linkProjectId
             addTask(task).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
                   this.xmTasks.push(res.data.data)
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
    },  
      showAdd() {
        this.$prompt('请输入任务标题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',  
        }).then(({ value }) => { 
            this.addXmTask(value); 
        }).catch(() => {
              
        }); 
    },
    
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
