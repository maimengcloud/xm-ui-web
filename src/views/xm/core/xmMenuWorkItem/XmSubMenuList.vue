<template>
  <section> 
    <el-row v-if="parentXmMenu.dclass<'3' && xmMenus.length>0"> 
      <el-row>
        <el-table :data="xmMenus" :max-height="400"  highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick">
          <el-table-column type="selection" label="全选"></el-table-column>
          <el-table-column prop="menuName" label="名称" min-width="350"> 
              <template slot-scope="scope" > 
                  <div class="cell-box">
 						<div  v-if="scope.row.dclass=='1'" class="icon" style="background-color:  rgb(255, 153, 51);">
						<i class="el-icon-s-promotion"></i>
						</div>
						<div v-if="scope.row.dclass=='2'" class="icon" style="background-color:  rgb(0, 153, 51);">
						<i class="el-icon-s-flag"></i>
						</div>
						<div v-if="scope.row.dclass=='3'" class="icon" style="background-color:  rgb(79, 140, 255);">
						<i class="el-icon-document"></i>
						</div>
 						<el-link @click="showEdit( scope.row,scope.$index)"   title="编辑" >{{scope.row.seqNo}}&nbsp;{{scope.row.menuName}}</el-link>
  
  
                    <div class="cell-bar">
                           <el-button @click="copyOne(scope.row,scope.$index)" icon="el-icon-document-copy" circle title="复制一行"></el-button> 
                   </div>
                  </div>
			  </template>
		  </el-table-column>
          <el-table-column prop="status" label="状态"  width="100"  sortable>
								<template slot-scope="scope"> 
										 <mdp-select-tag  @visible-change="selectVisible(scope.row,$event)" :dict="dicts.menuStatus"  v-model="scope.row.status" placeholder="需求状态"  style="display:block;"  @change="editXmMenuSomeFields(scope.row,'status',$event)">
 										 </mdp-select-tag> 
								</template>
							</el-table-column>
							<el-table-column prop="priority"  label="优先级" width="100" sortable>
								<template slot-scope="scope"> 
										 <mdp-select-tag  @visible-change="selectVisible(scope.row,$event)" :dict="dicts.priority"  v-model="scope.row.priority" placeholder="优先级"  style="display:block;" @change="editXmMenuSomeFields(scope.row,'priority',$event)">
 										 </mdp-select-tag> 
								</template>
							</el-table-column> 
							<el-table-column prop="iterationName" label="迭代" width="150" show-overflow-tooltip sortable>
								<template slot-scope="scope">
									<div class="cell-text">
										{{scope.row.iterationName}}
									</div>
									<span class="cell-bar">
										 <xm-iteration-select v-if="scope.row.dclass==='3'" style="display:inline;" :auto-select="false"  :product-id="scope.row.productId"    placeholder="迭代"  @row-click="editXmMenuSomeFields(scope.row,'iterationId',$event)"></xm-iteration-select>
									</span>
								</template>
							</el-table-column> 
							<el-table-column prop="finishRate" label="进度" width="100" show-overflow-tooltip sortable>
								<template slot-scope="scope">
									<div v-if="scope.row.calcType!=='2'">
										 <span v-if="scope.row.finishRate"><el-tag :type="scope.row.finishRate>=100?'success':'warning'">{{scope.row.finishRate}}%</el-tag></span>
									</div>
								</template>

							</el-table-column> 
							<el-table-column prop="mmUsername" label="跟进人"  width="150" show-overflow-tooltip  sortable>
								<template slot-scope="scope">
									 <mdp-select-user-xm @visible-change="selectVisible(scope.row,$event)" userid-key="mmUserid" username-key="mmUsername" :project-id="linkProjectId" v-model="scope.row" @change="editXmMenuSomeFields(scope.row,'mmUserid',$enent)"></mdp-select-user-xm>
								</template>
							</el-table-column>
        </el-table> 
      </el-row>
    </el-row> 
    <tag-dialog ref="tagDialog"  :jump="true" @select-confirm="onTagSelected">
			</tag-dialog> 

			
      <el-dialog :title="'新增'+calcMenuLabel.label" :visible.sync="addFormVisible" append-to-body modal-append-to-body>
          <el-form :model="addForm" :rules="addFormRules" ref="addForm">
            <el-form-item  prop="menuName">
				<template slot="label">
				<div  class="icon" :style="{backgroundColor: calcMenuLabel.color }">
					<i :class="calcMenuLabel.icon"></i>
				</div>
				{{calcMenuLabel.label}}名称
			</template>
              <el-input v-model="addForm.menuName" autocomplete="off" ></el-input>
            </el-form-item> 
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addFormVisible = false">关 闭</el-button>
            <el-button type="primary" @click="addXmMenu" v-loading="load.edit" :disabled="load.edit">确 定</el-button>
          </div>
      </el-dialog>
	<!--编辑 XmMenu xm_project_menu界面-->
	<el-dialog title="编辑故事" :visible.sync="editFormVisible" :with-header="false" width="90%" top="20px"    append-to-body   :close-on-click-modal="false" >
		<xm-menu-edit :xm-menu="editForm"   :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" @edit-fields="afterEditSubmit"></xm-menu-edit>
	</el-dialog>
  </section>
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
 import { initSimpleDicts } from '@/api/mdp/meta/item'; //下拉框数据查询 
 	import { listXmMenuWithState,addXmMenu,editXmMenuSomeFields,batchDelXmMenu } from '@/api/xm/core/xmMenu'; 
	import  XmMenuWorkload from '@/views/xm/core/components/XmMenuWorkload';//修改界面
 	import  XmGroupDialog from '@/views/xm/core/xmGroup/XmGroupDialog';//修改界面
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect.vue';//修改界面
	import  MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm/index';//修改界面
   	import TagDialog from "@/views/mdp/arc/tag/TagDialog";
	import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]), 
    
			calcMenuLabel(){ 
				var params={label:'工作项',icon:'',color:''};
				if(this.addForm.dclass==='1'){
					params={label:'史诗',icon:'el-icon-s-promotion',color:'rgb(255, 153, 51)'};
				}else if(this.addForm.dclass==='2'){
					params={label:'特性',icon:'el-icon-s-flag',color:'rgb(0, 153, 51)'};
				}else if(this.addForm.dclass==='3'){
					params={label:'故事',icon:'el-icon-document',color:' rgb(79, 140, 255)'};
				} 
				return params;
			},  
  },
  props: [ 
    'parentXmMenu','linkProjectId'
  ],
  watch: { 
    'parentXmMenu':function(){
      this.initData();
    },
    'xmMenus':function(){
      this.$emit('menus-change',this.xmMenus);
    }
    
  },
  data() { 
    return{
      load:{edit:false,list:false,add:false,del:false}, 
      xmMenus:[], 
		//编辑xmMenu界面初始化数据
		editForm: {
				menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',ntype:'0',childrenCnt:0,sinceVersion:'',proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',source:'1',dclass:'3'
		}, 
	  addForm:{menuName:'',dclass:'3'},
	  editFormVisible:false,
	  addFormVisible:false,
	  addFormRules:{
		  menuName:[
			  {required:true,message:'名称不能为空',trigger:'change'},
			  { min: 2, max: 250, message: '名称长度在 2 到 250 个字符', trigger: 'change' },//长度
		  ]
	  },
      dicts:{},
      sels:[],


    }
  }, //end data
  methods: { 
	...util,
    selectVisible(row,visible){
      if(visible){
        this.rowClick(row)
      }
    },
	//选择行xmMenu
	selsChange: function (sels) {
		this.sels = sels;
	},
	afterEditSubmit(row){
		Object.assign(this.editForm,row)
	},

	rowClick: function(row, event, column){ 
        this.editForm=row
		this.editFormBak=Object.assign({},this.editForm)
      },
       
    getXmMenus(){
      listXmMenuWithState({pmenuId:this.parentXmMenu.menuId}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          this.xmMenus=res.data.data
        }else{
          this.xmMenus=[];
        }
      })
    },
    
    showEdit(row,index){
      this.editForm=row
      this.editFormVisible=true
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
    addXmMenu( ){ 
		this.$refs.addForm.validate().then(valid=>{
       		var menu={...this.parentXmMenu}
             menu.mmUserid=this.userInfo.userid
             menu.mmUsername=this.userInfo.username
             menu.seqNo=this.parentXmMenu.seqNo+"."+(parseInt(this.parentXmMenu.childrenCnt)+1)
             menu.pmenuId=this.parentXmMenu.menuId
             menu.pmenuName=this.parentXmMenu.menuName  
             menu.menuId=null;
             menu.menuName=this.addForm.menuName
			 menu.dclass=this.addForm.dclass
             this.load.edit=true;
             addXmMenu(menu).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('add-submit',res.data.data);//  @submit="afterAddSubmit" 
                   this.xmMenus.push(res.data.data)
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
		});
    },  
      showAdd(dclass) {
		  this.addForm.menuName=this.parentXmMenu.menuName+'---请修改'
		  if(dclass){
			  this.addForm.dclass=dclass
		  }
         this.addFormVisible=true;
    },
    
			editXmMenuSomeFields(row,fieldName,$event){
				var params={menuIds:[row.menuId]};
				if(this.sels.length>0){
					if(!this.sels.some(k=>k.menuId==row.menuId)){
						this.$notify({position:'bottom-left',showClose:true,message:'请操作选中的行或者取消选中的行再操作其它行',type:'warning'})
						return;
					}
					params.menuIds=this.sels.map(i=>i.menuId)
				}
				if(fieldName==='iterationId'){
					if($event){
						params[fieldName]=$event.id;
						params.iterationName=$event.iterationName
					}else{
						return;
					}
				}else if(fieldName==='tagIds'){
					if($event){
						params[fieldName]=$event.map(i=>i.tagId).join(",");
						params.tagNames=$event.map(i=>i.tagName).join(",");
					}else{
						return;
					}
				}else if(fieldName==='workload'){
					params={...params,...$event}
				}else if(fieldName==='mmUserid'){
					params.mmUserid=$event[0].userid
					params.mmUsername=$event[0].username
				}else{
					params[fieldName]=$event
				}

				editXmMenuSomeFields(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						if(this.sels.length>0){
							 this.sels.forEach(i=>{
								 this.fieldTagVisible=false;
								Object.assign(i,params)
							 })
						}else{
							  Object.assign(row,params)
						}
						Object.assign(this.editFormBak,this.editForm)
					}else{
						
						Object.assign(this.editForm,this.editFormBak)
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				})
			},
    
			onTagSelected(tags,option){
				if(option.action=='editTagIds'){
					this.editXmMenuSomeFields(option.data,"tagIds",tags)
				} 

			}, 
      //批量删除xmMenu
			batchDel: function () {
				if(this.sels.length==0){
					this.$notify({position:'bottom-left',showClose:true,message: "请先选择要删除的需求", type: 'warning'});
					return;
				}
				this.$confirm('确认删除选中的'+this.sels.length+'条数据吗？删除后数据不可恢复', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmMenu(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.getXmMenus(); 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},

			
			copyOne(row,index){
				
				var params={...row}
				params.menuId=null; 
				params.status="0"
				params.menuName=row.menuName+'V'
				addXmMenu(params).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){ 
						var row2=res.data.data
						this.xmMenus.splice(index+1,0,row2)
						this.pageInfo.total=this.pageInfo.total+1
						this.$message.success("复制成功")
					}else{
						this.$message.error(tips.msg)
					}
				})
			}
  }, //end methods
  components: {  
		  TagDialog, 
			XmMenuWorkload,  
			XmIterationSelect,
			MdpSelectUserXm,
			'xm-menu-edit':()=>import('../xmMenu/XmMenuEdit')
  },
  mounted() { 
    this.initData();
    
  		initSimpleDicts("all",['menuStatus','demandSource','demandLvl','demandType','priority']).then(res=>{
				this.dicts=res.data.data;
			})
  },
};
</script>

<style lang="less" scoped> 
    .my-cell-bar{
    display: none; 
  }

.el-table__row td:hover{
	.my-cell-bar{
    width:90%;
    padding-right:0px;
	display: inline-block;  
	}
  .my-cell-text{
    display:none;
  }
}
</style>
