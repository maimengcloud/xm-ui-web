<template>
	<section class="page-container  padding border">
		<el-row>  
			<el-row >    
				<el-button    type="warning" @click="batchSaveMenu" icon="el-icon-finished">保存</el-button> 
				<el-button      @click="noBatchEdit" icon="el-icon-back">返回</el-button>  
			</el-row>
			<el-row style="padding-top:12px;"> 
				<el-table ref="table" :indent="16" lazy :load="loadXmMenusLazy" :height="maxTableHeight" :data="xmMenusTreeData" class="drag-table"   row-key="menuId" :tree-props="{children: 'children', hasChildren: 'childrenCnt'}"   highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column  type="selection" width="45"></el-table-column>
					<el-table-column  prop="seqNo"  label="序号" width="150">
						<template slot-scope="scope"> 
								<el-input   style="width:100%;"   v-model="scope.row.seqNo"  @change="fieldChange(scope.row,'seqNo')"></el-input>
						</template>
					
					</el-table-column>  
					<el-table-column prop="menuName" label="需求名称" min-width="140"  show-overflow-tooltip> 
						<template slot-scope="scope">
							<el-input    v-model="scope.row.menuName"  @change="fieldChange(scope.row,'menuName')"></el-input>
						</template>
					</el-table-column> 
					<el-table-column prop="mmUsername" label="跟进人" min-width="100" > 
						
						<template slot="header">
							<el-button type="text" icon="el-icon-user" title="批量修改跟进人" @click="showBatchMmUserSelectVisible">批量修改</el-button>
						</template>
						<template slot-scope="scope"> 
							<el-tag v-if="scope.row.mmUserid" @click="selectUser(scope.row)" closable @close="clearPmUser(scope.row)">{{scope.row.mmUsername}}</el-tag> 
							<el-button v-else type="text" @click="selectUser(scope.row)">选人</el-button>
						</template>
					</el-table-column> 
					
					<el-table-column  label="需求属性" width="500" >  
						<template slot-scope="scope"> 
							 <el-select v-model="scope.row.dtype" clearable placeholder="需求类型">
								<el-option v-for="i in dicts.demandType" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>    
							<el-select v-model="scope.row.source" placeholder="需求来源"  clearable>
								<el-option v-for="i in dicts.demandSource" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>     
							<el-select v-model="scope.row.dlvl" placeholder="需求层次"  clearable class="hidden-md-and-down">
								<el-option v-for="i in dicts.demandLvl" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>    
							<el-select v-model="scope.row.priority" placeholder="优先级"  clearable>
									<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option> 
							</el-select>  
						</template>
					</el-table-column> 


					
						
					<el-table-column prop="remark" label="描述" min-width="140"  show-overflow-tooltip> 
						<template slot-scope="scope">

							<el-input    v-model="scope.row.remark" type="textarea"  @change="fieldChange(scope.row,'remark')"></el-input>
						</template>
					</el-table-column>  
				</el-table>
				 
		</el-row>     	
			<el-drawer title="选择员工" :visible.sync="userSelectVisible" size="60%" append-to-body>
				<users-select  @confirm="onUserSelected" ref="usersSelect"></users-select>
			</el-drawer>	
			<el-drawer title="选择员工" :visible.sync="batchMmUserSelectVisible" size="60%" append-to-body>
				<users-select  @confirm="onBatchMmUserSelectConfirm" ref="batchMmUserSelect"></users-select>
			</el-drawer>	
			 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
 	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import {  batchEditXmMenu,listXmMenuWithState } from '@/api/xm/core/xmMenu';
    	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 
 

	import { mapGetters } from 'vuex'
	
	export default { 
		props:['product','xmMenus','options'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			
      xmMenusTreeData() {
        let xmMenus = JSON.parse(JSON.stringify(this.xmMenus || [])); 
        
        const xmMenusTreeData = treeTool.translateDataToTree(xmMenus,"pmenuId","menuId"); 
				 
				 return xmMenusTreeData;
			}, 
		},
		watch:{ 
			product(product){
				this.filters.product=product
			}
    	},
		data() {
			 
			return {
				filters: { 
				},  
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options2:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
 				//新增xmMenu界面初始化数据
				addForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:''
				},
				 
				//编辑xmMenu界面初始化数据
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:''
				},  
				valueChangeRows:[],  
 				userSelectVisible:false, 
				 batchMmUserSelectVisible:false,
				maxTableHeight:300, 
				pickerOptions:  util.pickerOptions('datarange'), 
				
				maps:new Map(),
			}
		},//end data
		methods: {
			
			//选择行xmMenu
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
      		},   
			noBatchEdit(){
				this.batchEditVisible=false; 
				this.valueChangeRows=[];
				this.$emit('no-batch-edit')
			},
			batchSaveMenu(){
				
				if(!this.roles.some(i=>i.roleid=='productAdmin') && !this.roles.some(i=>i.roleid=='productTeamAdmin')){
					this.$notify({showClose: true, message: "只有产品经理、产品组长能够修改需求", type: 'error'}); 
					return false;
				}
				if(this.valueChangeRows.length==0){
					this.$notify.success("没有数据被修改");
					return
				}
				batchEditXmMenu(this.valueChangeRows).then(res=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.valueChangeRows=[] 
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
				});
			},
			fieldChange:function(row,fieldName,nextReplace){
				 
				console.log('fieldChange--row==', row);
				if(nextReplace){
					row.nextReplace=nextReplace
				}
				if(row.opType){
					var index=this.valueChangeRows.findIndex(i=>i.menuId==row.menuId);
					
					if(index>=0){
						this.valueChangeRows.splice(index,1);
						this.valueChangeRows.push(row)
					}else{
						this.valueChangeRows.push(row)
					}
				}else{
					var oneRow=this.valueChangeRows.find(i=>i.menuId==row.menuId);
					if( oneRow  ){
						if(oneRow.nextReplace){ 
							var index=this.valueChangeRows.findIndex(i=>i.menuId==row.menuId);
							this.valueChangeRows.splice(index,1);
							this.valueChangeRows.push(row)
						}else{
							return;
						}
					}else{
						this.valueChangeRows.push(row)
					}
				} 
			},
			 
			selectUser(row){
				this.editForm=row
				this.userSelectVisible=true;
			},
			onUserSelected(users){
				if(users && users.length>0){
					this.editForm.mmUserid=users[0].userid
					this.editForm.mmUsername=users[0].username
					this.fieldChange(this.editForm,"mmUsername");

				}
				this.userSelectVisible=false
			},
			clearPmUser:function(row){
				this.editForm=row
				 row.mmUserid=''
				 row.mmUsername=''
				 this.fieldChange(row,"mmUsername");
			},
			 
			loadXmMenusLazy(tree, treeNode, resolve) {   
				
      			this.maps.set(tree.menuId, { tree, treeNode, resolve }) //储存数据
					var params={pmenuId:tree.menuId} 
					params.isTop=""
					this.load.list = true;
					var func=listXmMenuWithState 
					func(params).then(res=>{
						this.load.list = false
						var tips = res.data.tips;
						if(tips.isOk){
							resolve(res.data.data) 
						}else{
							resolve([])
						}
					}).catch( err => this.load.list = false );   
				
			},
			//查询时选择责任人
			showBatchMmUserSelectVisible() {
				if(!this.sels||this.sels.length==0){
					this.$notify({showClose:true,message:'请先选中一条或多条数据',type:'error'})
					return;
				}else{
					this.batchMmUserSelectVisible=true;
				}
			}, 
			//查询时选择责任人
			onBatchMmUserSelectConfirm(users) {
				var user={};
				if (users && users.length > 0) { 
					user=users[0]
				} 
				this.batchMmUserSelectVisible=false;
				this.sels.forEach(i=>{
					i.mmUserid=user.userid;
					i.mmUsername=user.username; 
					this.fieldChange(i,"mmUserid")
				})
			},
		},//end methods
		components: {  
			UsersSelect, 
		},
		mounted() { 
			 
			this.$nextTick(() => {   
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);  
          }); 
			 
		}
	}

</script>

<style lang="scss" scoped>

.more-label-font{
	text-align:center;
	float:left;
	padding-top:5px;
}  
.el-table{ 
	 box-sizing: border-box; 
	/deep/ .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
	display: flex;
	 }
}
</style>