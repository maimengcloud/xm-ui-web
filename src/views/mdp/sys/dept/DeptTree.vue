<template>
	<section>
		<el-row> 
			<el-col :span="24">
				<el-input :class="workShop.isSuperAdmin==true||workShop.isPlatformAdmin==true?'filter-input-admin':'filter-input-common'" v-model="deptFilterText" v-if=" showFilter!=false " placeholder="编号、名称过滤" auto-complete="off"></el-input>
				<el-button type="warning" icon="el-icon-star-off" v-if="workShop.isSuperAdmin==true||workShop.isPlatformAdmin==true" @click.native="showBranchSelect">机构</el-button>
			</el-col>
			<el-col :span="24">
						<el-tree v-loading="listLoading"
						  class="filter-tree"
						  :data="treeData"
						  :props="defaultDeptTreeProps"
						  :filter-node-method="filterDeptNode"
						  :show-checkbox="showCheckbox"
						  :default-expand-all="defaultExpandAll"
						  :expand-on-click-node="expandOnClickNode"
						  :indent="indent"
						  :node-key="'deptid'" 
						  :default-expanded-keys="defaultExpandedKeys"
  						  :default-checked-keys="defaultCheckedKeys"
  						  auto-expand-parent
  						  highlight-current
						  @check-change="handleCheckChange"
						  @current-change="handleCurrentChange"
						  @node-click="handleNodeClick"
						  :check-on-click-node="true"
						  check-strictly
						  :render-content="renderContent"
						  ref="deptTree">
						</el-tree>
			</el-col>
		<el-dialog title="机构选择" :visible.sync="branchVisible"  width="50%" top="20" :close-on-click-modal="false" append-to-body>
			<branch-select :visible="branchVisible"  @cancel="branchVisible=false" @row-click="branchRowClick"></branch-select>
		</el-dialog>
					 
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util'
	import {   listTreeDept  } from '../../../../api/mdp/sys/dept'; 
	import  BranchSelect from '../branch/BranchSelect';//机构选择
	import { mapGetters } from 'vuex' 
	
	export default {  
		watch: {
	      deptFilterText(val) {
	        this.$refs.deptTree.filter(val);
	      },
	      checkedKeys(val){
	      	 this.$refs.deptTree.setCheckedKeys(val);
	      },
	      refresh(val){ 
	      	this.getDeptTreeData(val);
	      },
	      currentKey(val){ 
	    	  this.$refs.deptTree.setCheckedKeys([val]);
		  },
		  value(val){
		  	this.deptid=val;
		  },
		  deptid(val){
		  	this.$emit('input',val);
		  },
		  branchId(val){ 
			  this.getDeptTreeData(true);                                           
		  }
	    },
		components: { 
		    'branch-select':BranchSelect
		},
	    computed:{
	    	defaultExpandedKeys(){
	    		return this.defaultCheckedKeys;
	    	},
	    	defaultCheckedKeys(){
	    		if(this.value){
	    			return [this.value];
	    		}
	    		return this.checkedKeys;
	    	}, 
	    	 ...mapGetters([
			      'workShop'
				]),
			treeData(){
				return this.translateDataToTree(this.depts)
			}
	    },
	    props: ['value','branchId','visible', 'showCount','showRoot','countTips','showFilter', 'multiple','checkedKeys','refresh','defaultExpandAll','expandOnClickNode','showCheckbox','indent'],
		data() {
			return { 
				deptFilterText: '',
				depts:[], 
				defaultDeptTreeProps:{
					
					id:'deptid',
					label:'deptName',
					children: 'children'
				},  
				listLoading: false,
				deptid:'',
				branchVisible: false,
				branch:null
			}
		},
		methods: { 
			handleCheckChange(data, checked, indeterminate) {
				let checkedKeys=this.$refs.deptTree.getCheckedKeys(); 
				
				if( this.multiple===undefined || this.multiple===false||this.multiple==='false'){
					if(checked==true){
						if(checkedKeys.length>1){ 
							this.$refs.deptTree.setCheckedKeys([data['deptid']]);
							this.$emit('check-change',data,checked,indeterminate);
							this.deptid=data['deptid'];
						}else{
							this.$emit('check-change',data,checked,indeterminate);
							this.deptid=data['deptid'];
						}
					}else{
						if(checkedKeys.length==0){
							this.deptid='';
							this.$emit('check-change',data,checked,indeterminate);
						} 
					}
				}else{
					this.$emit('check-change',data,checked,indeterminate);
				} 
		    },
			handleCurrentChange(data, node) {
		    	this.$emit('current-change',data, node); 
		    },
		    handleNodeClick(data, node, comp) { 
				this.$emit('node-click',data, node, comp); 
		    },
			branchRowClick: function(row, event, column){
				this.branchVisible=false
				if(this.branch==null || row.id!=this.branch.id){
					this.branch=row
					this.getDeptTreeData();
					
				} 
				this.$emit('branch-row-click',row, event, column);//  @branch-row-click="rowClick"
			}, 
			translateDataToTree(data) {  
				if(!data){
					return [];
				}
				let parents = data.filter(value =>{ 
					//如果我的上级为空，则我是最上级
					if(value.pdeptid == 'undefined' || value.pdeptid == null  || value.pdeptid == '' || value.pdeptid == 'A0'){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.pdeptid==i.deptid)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.pdeptid==i.deptid)){
						return true;
					}else{
						return false;
					} 
				})  
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.pdeptid === parent.deptid) {
								let temp = JSON.parse(JSON.stringify(children))
								temp.splice(index, 1)
								translator([current], temp)
								typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
							}
						}
						)
					}
					)
				}

				translator(parents, children)

				return parents
			},
			//获取分类树列表
			getDeptTreeData(refresh) {
 
				let params = { 
				}; 
 				params.branchId=this.branchId
 				if(this.workShop.isSuperAdmin==true || this.workShop.isPlatformAdmin==true){
 					if(this.branch!=null){
 						params.branchId=this.branch.id
 					}else if(params.branchId==null || params.branchId==''){
 						params.branchId=this.workShop.branchId
 					}
 				}else{
 					if(params.branchId==null || params.branchId==''){
 						params.branchId=this.workShop.branchId
					 }
					 params.autoDetectParentDeptid="1"
 				}
				this.listLoading = true;
				listTreeDept(params).then((res) => {
					var tips=res.data.tips;
					var data=res.data.data;
					if(tips.isOk==true){ 
						if( this.showRoot===undefined || this.showRoot===false||this.showRoot==='false'){ 
							if(data==null){
								this.depts=[];
							}else{
								if(this.branch!=null){
									res.data.data.branchId=this.branch.id
									res.data.data.deptName=this.branch.branchName+'(机构)'
									res.data.data.isBranch=true
								}else {
									res.data.data.branchId=this.workShop.branchId
									res.data.data.deptName=this.workShop.branchName+'(机构)'
									res.data.data.isBranch=true
								}
								this.depts=data
							}
							
						}else{
							if(this.branch!=null){
								res.data.data.branchId=this.branch.id
								res.data.data.deptName=this.branch.branchName+'(机构)'
								res.data.data.isBranch=true
							}else {
								res.data.data.branchId=this.workShop.branchId
								res.data.data.deptName=this.workShop.branchName+'(机构)'
								res.data.data.isBranch=true
							}
							this.depts=data;
						}
						
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error'});
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
				});
			}, 
			filterDeptNode(value, data) {
				if (!value) return true;
				if( data.deptid.indexOf(value)>=0 || data.deptName.indexOf(value)>=0  ){
					return true;
				}else{
					if( data.pdeptid &&  data.pdeptid.indexOf(value)>=0){
						return true;
					}
				}
				return false;
		     },
		     renderContent(h, { node, data, store }) {
		    	 var countMsg='';	
		    	 if(this.countTips){
	    	 			countMsg=this.countTips;
	    	 		}
		    	 	if(this.showCount==true || this.showCount=='true'){
		    	 		
		    	 		
		    	 		return h('span',node.label) ;
		    	 	}else{
		    	 		return h('span',node.label) ;
		    	 	}
			        
			  },
			  showBranchSelect: function(){
				  this.branchVisible=true
			  }
		},
		mounted() { 
			this.deptid=this.value;
			this.getDeptTreeData(); 
		}
	}

</script>

<style scoped>
.filter-tree{
	margin-top: 14px;
}
.filter-input-admin{
	width:60%;
}

.filter-input-common{
	width:100%;
}
</style>
