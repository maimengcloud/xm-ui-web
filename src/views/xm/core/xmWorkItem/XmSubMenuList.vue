<template>
  <section> 
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
        <el-table :data="xmMenus" :show-header="false" :max-height="400">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="menuName" label="名称"></el-table-column>
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
 	import { listXmMenu,addXmMenu } from '@/api/xm/core/xmMenu';

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
    'parentXmMenu'
  ],
  watch: { 
    'parentXmMenu.menuId':function(){
      this.initData();
    },
    'xmMenus':function(){
      this.$emit('menus-change',this.xmMenus);
    }
    
  },
  data() { 
    return{
      load:{edit:false,list:false,add:false}, 
      xmMenus:[],

    }
  }, //end data
  methods: { 
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
     
    initData(){  
      this.xmMenus=[] 
      if(!this.parentXmMenu || !this.parentXmMenu.menuId){
        return;
      }
      var dclass=this.parentXmMenu.dclass;
      if(dclass<3){
        this.getXmMenus();
      } 
    }, 
    addXmMenu(name){ 
       var menu={...this.parentXmMenu}
             menu.mmUserid=this.userInfo.userid
             menu.mmUsername=this.userInfo.username
             menu.seqNo=this.parentXmMenu.seqNo+"."+(parseInt(this.parentXmMenu.childrenCnt)+1)
             menu.pmenuId=this.parentXmMenu.menuId
             menu.pmenuName=this.parentXmMenu.menuName
             menu.dclass=(parseInt(this.parentXmMenu.dclass)+1)+'';
             menu.menuId=null;
             menu.menuName=name
             
             addXmMenu(menu).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('add-submit',res.data.data);//  @submit="afterAddSubmit"
                   this.xmMenus.push(res.data.data)
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
    },  
      showAdd() {
        this.$prompt('请输入标题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',  
        }).then(({ value }) => { 
            this.addXmMenu(value); 
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
