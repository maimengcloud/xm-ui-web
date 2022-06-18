<template>
  <section> 
    <el-row v-if="parentXmMenu.dclass<'3' && xmMenus.length>0"> 
      <el-row>
        <el-table :data="xmMenus" :max-height="400"  highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick">
          <el-table-column type="selection" label="全选"></el-table-column>
          <el-table-column prop="menuName" label="名称" min-width="250" show-overflow-tooltip> 
              <template slot-scope="scope" >
				  <span style="display:inline;">
				<div  v-if="scope.row.dclass=='1'" class="icon" style="background-color:  rgb(255, 153, 51);">
				<i class="el-icon-s-promotion"></i>
				</div>
				<div v-if="scope.row.dclass=='2'" class="icon" style="background-color:  rgb(0, 153, 51);">
				<i class="el-icon-s-flag"></i>
				</div>
				<div v-if="scope.row.dclass=='3'" class="icon" style="background-color:  rgb(79, 140, 255);">
				<i class="el-icon-document"></i>
				</div>
				  </span>  
					<span class="my-cell-text">
						{{scope.row.seqNo}}&nbsp;&nbsp;{{scope.row.menuName}}
					</span>
					<span class="my-cell-bar">
							<el-input title="序号" style="width:18%;"  v-model="scope.row.seqNo" placeholder="序号"  @change="editXmMenuSomeFields(scope.row,'seqNo',$event)"></el-input><el-input title="名称" placeholder="名称" v-model="scope.row.menuName"  style="width:80%;"  @change="editXmMenuSomeFields(scope.row,'menuName',$event)"></el-input> 
					</span> 
			  </template>
		  </el-table-column>
          <el-table-column prop="status" label="状态"  min-width="80"  sortable>
								<template slot-scope="scope">
									<div class="cell-text">
										<el-button style="display:block;" :type="item.className" plain round v-for="(item,index) in formatterMenuStatusDicts(scope.row.status)" :key="index">{{item.name}}</el-button>
									</div>
									<span class="cell-bar">
										 <el-select @visible-change="selectVisible(scope.row,$event)"   v-model="scope.row.status" placeholder="需求状态"  style="display:block;"  @change="editXmMenuSomeFields(scope.row,'status',$event)">
												<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.menuStatus" :key="index"></el-option>
										 </el-select>
									</span>
								</template>
							</el-table-column>
							<el-table-column prop="priority"  label="优先级" width="100" sortable>
								<template slot-scope="scope">
									<div class="cell-text">
										<el-button style="display:block;" :type="item.className" plain round v-for="(item,index) in formatterPriorityDicts(scope.row.priority)" :key="index">{{item.name}}</el-button>
 									</div>
									<span class="cell-bar">
										 <el-select @visible-change="selectVisible(scope.row,$event)"   v-model="scope.row.priority" placeholder="优先级"  style="display:block;" @change="editXmMenuSomeFields(scope.row,'priority',$event)">
												<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.priority" :key="index"> </el-option>
										 </el-select>
									</span>
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
							<el-table-column prop="finishRate" label="进度"  min-width="80" show-overflow-tooltip sortable>
								<template slot-scope="scope">
									<div v-if="scope.row.calcType!=='2'">
										 <span v-if="scope.row.finishRate"><el-tag :type="scope.row.finishRate>=100?'success':'warning'">{{scope.row.finishRate}}%</el-tag></span>
									</div>
								</template>

							</el-table-column> 
							<el-table-column prop="mmUsername" label="跟进人"  min-width="100" show-overflow-tooltip  sortable>
								<template slot-scope="scope">
									<div class="cell-text">
										{{scope.row.mmUsername}}
									</div>
									<span class="cell-bar">
										 <el-button @click="$refs.xmGroupDialog.open({data:scope.row,action:'editMmUserid'})">选跟进人</el-button>
									</span>
								</template>
							</el-table-column>
        </el-table> 
      </el-row>
    </el-row> 
    <tag-dialog ref="tagDialog"  :jump="true" @select-confirm="onTagSelected">
			</tag-dialog>
 			<xm-group-dialog ref="xmGroupDialog" :isSelectSingleUser="true" :sel-project="linkProjectId?{id:linkProjectId}:null" :xm-product="parentXmMenu&&parentXmMenu.productId?{id:parentXmMenu.productId}:null" @user-confirm="onGroupUserSelect">
			</xm-group-dialog>

			
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
            <el-button @click="addFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addXmMenu">确 定</el-button>
          </div>
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
      editForm:{menuName:'',dclass:'3'},
	  addForm:{menuName:'',dclass:'3'},
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
    selectVisible(row,visible){
      if(visible){
        this.rowClick(row)
      }
    },
	//选择行xmMenu
	selsChange: function (sels) {
		this.sels = sels;
	},


	rowClick: function(row, event, column){ 
        this.editForm=row
		this.editFormBak=Object.assign({},this.editForm)
      },
      

			formaterByDicts(row,property,cellValue){
				var property=property
				var dict=null;
				if(property=='source'){
					dict=this.dicts['demandSource']
				}else if(property=='dlvl'){
					dict=this.dicts['demandLvl']
				}else if(property=='dtype'){
					dict=this.dicts['demandType']
				}else if(property=='priority'){
					dict=this.dicts['priority']
				}
				if(!dict){
					return cellValue;
				}else{
					var item=dict.find(i=>i.id==cellValue)
					return item?item.name:cellValue;
				}
			},
			formatterPriorityDicts(cellValue){
				if(!cellValue && cellValue!=='0'){
					return []
				}
				var key="priority";
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return [{id:cellValue,name:cellValue,className:'primary'}];
				}
				var list=this.dicts[key].filter(i=>i.id==cellValue)
				if(list.length>0){
					var data= {...list[0],className:'primary'}
					if(data.id=='0'){
						data.className='danger'
					}else if(data.id=='1'){
						data.className='warning'
					}else if(data.id=='2'){
						data.className='success'
					}else if(data.id=='3'){
						data.className='primary'
					}else if(data.id=='4'){
						data.className='info'
					}else{
						data.className='primary'
					}
					return [data];
				}else{
					return [{id:cellValue,name:cellValue,className:'primary'}]
				}

			},
			formatterMenuStatusDicts: function(cellValue){
				if(!cellValue && cellValue!=='0'){
					return []
				}
				var key="menuStatus";
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return [{id:cellValue,name:cellValue,className:'primary'}];
				}
				var list=this.dicts[key].filter(i=>i.id==cellValue)
				if(list.length>0){
					var data= {...list[0],className:'primary'}
					if(data.id=='0'){
						data.className='primary'
					}else if(data.id=='1'){
						data.className='warning'
					}else if(data.id=='2'){
						data.className='success'
					}else if(data.id=='3'){
						data.className='info'
					} else{
						data.className='danger'
					}
					return [data];
				}else{
					return [{id:cellValue,name:cellValue,className:'primary'}]
				}

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
             
             addXmMenu(menu).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('add-submit',res.data.data);//  @submit="afterAddSubmit"
									 this.addFormVisible=false;
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
      
			onGroupUserSelect(users,option){
				 this.editXmMenuSomeFields(option.data,"mmUserid",users);
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
  }, //end methods
  components: {  
		  TagDialog, 
			XmMenuWorkload, 
			XmGroupDialog,
			XmIterationSelect,
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
