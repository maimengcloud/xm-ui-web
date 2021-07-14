<template>
	<section>
		 				<el-button v-if="userInfo.isSuperAdmin==true||userInfo.isPlatformAdmin==true" @click.native="showBranchSelect">点击切换机构</el-button>
						<el-input size="small" v-model="deptFilterText" v-if="showFilter==true" placeholder="分类名称、编号过滤" auto-complete="off"></el-input>
						<el-tree v-loading="listLoading"
						  class="filter-tree"
						  :data="deptTreeData"
						  :props="defaultDeptTreeProps"
						  :filter-node-method="filterDeptNode"
						  :show-checkbox="showCheckbox"
						  :default-expand-all="defaultExpandAll"
						  :expand-on-click-node="expandOnClickNode"
						  :indent="indent"
						  :node-key="nodeKey_"
						  :default-expanded-keys="defaultExpandedKeys"
  						  :default-checked-keys="defaultCheckedKeys"
  						  auto-expand-parent
  						  highlight-current
						  @check-change="handleCheckChange"
						  @current-change="handleCurrentChange"
						  @node-click="handleNodeClick"
						  check-strictly
						  :render-content="renderContent"
						  ref="deptTree">
						</el-tree>
		<el-dialog title="机构选择" :visible.sync="branchVisible"  width="50%" top="20" :close-on-click-modal="false" append-to-body>
			<branch-select :visible="branchVisible"  @cancel="branchVisible=false" @row-click="branchRowClick"></branch-select>
		</el-dialog>
					 
	</section>
</template>

<script>
	import util from './util'
	import {   listTreeDept  } from './dept'; 
	import  BranchSelect from './BranchSelect';//机构选择
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
	    	nodeKey_(){
	    		return this.nodeKey?this.nodeKey:'deptid'
	    	},
	    	 ...mapGetters([
			      'userInfo'
			    ])
	    },
	    props: ['value','branchId','visible','nodeKey','showCount','showRoot','countTips','showFilter','rootKey','multiple','checkedKeys','refresh','defaultExpandAll','expandOnClickNode','showCheckbox','indent'],
		data() {
			return { 
				deptFilterText: '',
				deptTreeData:[], 
				defaultDeptTreeProps:{
					
					id:this.nodeKey_,
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
							this.$refs.deptTree.setCheckedKeys([data[this.nodeKey_]]);
							this.$emit('check-change',data,checked,indeterminate);
							this.deptid=data[this.nodeKey_];
						}else{
							this.$emit('check-change',data,checked,indeterminate);
							this.deptid=data[this.nodeKey_];
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
			//获取分类树列表
			getDeptTreeData(refresh) {

				let id='';
				if(this.rootKey!='' && this.rootKey!=null){
					id=this.rootKey;
				}
				let params = { 
					id: id
				};
 				if(refresh){
 					params.refresh=true;
 				}
 				params.branchId=this.branchId
 				if(this.userInfo.isSuperAdmin==true || this.userInfo.isPlatformAdmin==true){
 					if(this.branch!=null){
 						params.branchId=this.branch.id
 					}else if(params.branchId==null || params.branchId==''){
 						params.branchId=this.userInfo.branchId
 					}
 				}else{
 					if(params.branchId==null || params.branchId==''){
 						params.branchId=this.userInfo.branchId
 					}
 				}
				this.listLoading = true;
				listTreeDept(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk==true){ 
						if( this.showRoot===undefined || this.showRoot===false||this.showRoot==='false'){
							let tree=res.data.data;
							if(tree==null){
								this.deptTreeData=[];
							}else{
								if(this.branch!=null){
									res.data.data.branchId=this.branch.id
									res.data.data.deptName=this.branch.branchName+'(机构)'
									res.data.data.isBranch=true
								}else {
									res.data.data.branchId=this.userInfo.branchId
									res.data.data.deptName=this.userInfo.branchName+'(机构)'
									res.data.data.isBranch=true
								}
								this.deptTreeData=tree.children;
							}
							
						}else{
							if(this.branch!=null){
								res.data.data.branchId=this.branch.id
								res.data.data.deptName=this.branch.branchName+'(机构)'
								res.data.data.isBranch=true
							}else {
								res.data.data.branchId=this.userInfo.branchId
								res.data.data.deptName=this.userInfo.branchName+'(机构)'
								res.data.data.isBranch=true
							}
							this.deptTreeData=[res.data.data];
						}
						
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error'});
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
				});
			}, 
			filterDeptNode(value, data) {
		        if (!value) return true;
		        return data.name.indexOf(value) !== -1;
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

</style>