<template>
	<section>
		<el-row>
		<el-tree
			class="filter-tree"
			:data="categoryTreeData"
			:props="defaultTreeProps"
			:filter-node-method="filterNode"
			:show-checkbox="showCheckbox"
			:default-expand-all="defaultExpandAll"
			:expand-on-click-node="expandOnClickNode"
			:indent="8"
			:node-key="nodeKey_"
			:default-expanded-keys="defaultExpandedKeys"
			:default-checked-keys="defaultCheckedKeys"
			auto-expand-parent
			@check-change="handleCheckChange"
			@current-change="handleCurrentChange"
			@node-click="handleNodeClick"
			:check-strictly="true" 
			:check-on-click-node="true"
			ref="nodeTree">
			<div class="custom-tree-node" slot-scope="{ node, data}">  
				<span>{{data.name}}</span> 
				<span class="el-ic"> 
					<i class="el-icon-plus" @click.prevent.stop="addNode(data,node)" title="添加子分类"></i> 
					<i class="el-icon-edit" @click.prevent.stop="editNode(data,node)" title="修改名字"></i> 
					<i class="el-icon-delete" @click.prevent.stop="deleteNode(data,node)" title="删除该分类"> </i>
				</span>
			</div>
		</el-tree>
		<el-dialog
			title="提示"
			:visible.sync="addVisible"
			width="60%" append-to-body> 
				<el-form ref="addCategory" :model="addCategory" label-width="200" 	>
					<el-form-item label="上级分类名称">
						{{currentCategory.name}}
					</el-form-item> 
					<el-form-item label="分类编号">
						<el-input v-model="addCategory.id" placeholder="如果为空，则系统自动生成"></el-input>
					</el-form-item>
					<el-form-item label="分类名称"  prop="name"
					:rules="[
						{ required: true, message: '名称不能为空'}
						]">
						<el-input v-model="addCategory.name" ></el-input>
					</el-form-item>
					<el-form-item label=""> 
						<el-button @click="addVisible = false">取 消</el-button>
						<el-button type="primary" v-loading="addLoading"  @click="addCategorySubmit">确 定</el-button>
					</el-form-item>
				</el-form> 
		</el-dialog>	 
		
		<el-dialog
			title="提示"
			:visible.sync="editVisible"
			width="60%" append-to-body> 
				<el-form ref="editCategory" :model="editCategory" label-width="200" 	> 
					<el-form-item label="分类名称"  prop="name"
					:rules="[
						{ required: true, message: '名称不能为空'}
						]">
						<el-input v-model="editCategory.name" ></el-input>
					</el-form-item>
					<el-form-item label=""> 
						<el-button @click="editVisible = false">取 消</el-button>
						<el-button type="primary" v-loading="editLoading" @click="editCategorySubmit">确 定</el-button>
					</el-form-item>
				</el-form> 
		</el-dialog>
		</el-row>
	</section>
</template>

<script> 
	import {   listTreeCategory,addCategory, editCategory,delCategory  } from '@/api/mdp/arc/category';
	import { mapGetters } from 'vuex'
	export default { 
		watch: {
	      nodeFilterText(val) {
	        this.$refs.nodeTree.filter(val);
	      },
	      checkedKeys(val){
	      	 this.$refs.nodeTree.setCheckedKeys(val);
	      },
	      refresh(val){ 
	      	this.getTreeData(val);
	      },
	      currentKey(val){ 
	    	  this.$refs.nodeTree.setCheckedKeys([val]);
		  },
		  value(val){
		  	this.nodeid=val;
		  },
		  nodeid(val){
		  	this.$emit('input',val);
		  }
	    },
	    computed:{
			
			categoryTreeData() {
				 return this.translateDataToTree(this.treeData);
			},
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
	    		return this.nodeKey?this.nodeKey:'id'
	    	},
			...mapGetters([
			  'workShop'
			])
	    },
	    props: ['value','isLeaf','visible','nodeKey','showCount','countTips','showFilter','rootKey','multiple','checkedKeys','refresh','defaultExpandAll','expandOnClickNode','showCheckbox','indent'],
		data() {
			return { 
				nodeFilterText: '',
				treeData:[],  
				defaultTreeProps:{
					
					id:this.nodeKey_,
					label:'name',
					children: 'children',
					disabled:function(data,node){   
							return !node.isLeaf; 
					} 
				},  
				listLoading: false,
				addLoading:false,
				editLoading:false,
				nodeid:'',
				currentCategory:{},
				addCategory:{},
				editCategory:{},
				addVisible:false,
				editVisible:false,
			}
		},
		methods: { 
			handleCheckChange(data, checked, indeterminate) {
				let checkedKeys=this.$refs.nodeTree.getCheckedKeys(); 
				console.log(this.multiple);
				if( this.multiple===undefined || this.multiple===false||this.multiple==='false'){
					if(checked==true){
						if(checkedKeys.length>1){ 
							this.$refs.nodeTree.setCheckedKeys([data[this.nodeKey_]]);
							this.$emit('check-change',data,checked,indeterminate);
							this.nodeid=data[this.nodeKey_];
						}else{
							this.$emit('check-change',data,checked,indeterminate);
							this.nodeid=data[this.nodeKey_];
						}
					}else{
						if(checkedKeys.length==0){
							this.nodeid='';
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
			handleAddCategoryClose(){
				this.addVisible=false;
			},
			addCategorySubmit(){
				this.addCategory.pid=this.currentCategory.id
				this.addCategory.isShow='1'
				this.addCategory.branchId=this.currentCategory.branchId
				if(!this.addCategory.branchId){
					this.addCategory.branchId=this.workShop.branchId
				}
				this.$refs.addCategory.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;  
							addCategory(this.addCategory).then(res=>{
								//console.log("res--"+JSON.stringify(res));
								if(res.data.tips.isOk){
									this.addLoading=false;
									this.$message.success(res.data.tips.msg); 
									this.getTreeData(true);
								}else{ 
									this.$message.error(res.data.tips.msg); 
								}
							}).catch(e=>this.addLoading = false  );
							
						});
					}
				});
				
			},
			
			editCategorySubmit(){
				this.$refs.editCategory.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;  
							editCategory({id:this.editCategory.id,name:this.editCategory.name}).then(res=>{
								//console.log("res--"+JSON.stringify(res));
								this.editLoading = false;  
								if(res.data.tips.isOk){
									this.editVisible=false;
									this.$message.success(res.data.tips.msg); 
									this.getTreeData(true);
								}else{ 
									this.$message.error(res.data.tips.msg); 
								}
							}).catch(e=>this.editLoading = false  );
							
						});
					}
				});
				
			},
		    addNode(data, node, comp) {  
				this.currentCategory=Object.assign({},data)
				this.addVisible=true;
				console.log("addNode___"+JSON.stringify(data));
				return false;
			}, 
		    editNode(data, node, comp) {  
				this.editCategory=Object.assign({},data)
				this.editVisible=true;
				console.log("editNode__"+JSON.stringify(data));
				return false;
		    }, 
		    deleteNode(data, node, comp) {  
				console.log("deleteNode__"+JSON.stringify(data));
						if(data.children){
							this.$message.error("请先删除子元素"); 
							return;
						}
						let params={
							id:data.id,
							branchId:data.branchId
						}
						if(!params.branchId){
							params.branchId=this.workShop.branchId
						}
						this.$confirm('确认删除吗？', '提示', {}).then(() => { 
							delCategory(params).then(res=>{
								//console.log("res--"+JSON.stringify(res));
								if(res.data.tips.isOk){
									this.editVisible=false;
									
									this.$message.success(res.data.tips.msg); 
									this.getTreeData(true);
								}else{ 
									this.$message.error(res.data.tips.msg); 
								}
							});
						})
					return false;
		    }, 
			//获取分类树列表
			getTreeData(refresh) {

				let id='';
				if(this.rootKey!='' && this.rootKey!=null){
					id=this.rootKey;
				}
				let params = { 
					id: id,
					branchId:this.workShop.branchId,
				};
 				if(refresh){
 					params.refresh=true;
 				}
				this.listLoading = true;
				listTreeCategory(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk==true){ 
						this.treeData=res.data.data;
						console.log("this.treeData----"+JSON.stringify(this.treeData));
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error'});
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
				});
			}, 
			filterNode(value, data) {
		        if (!value) return true;
		        return data.name.indexOf(value) !== -1;
		     },
		     renderContent(h, { node, data, store }) {
				var countMsg='';	
				var that=this;
				if(this.countTips){
					countMsg=this.countTips;
				} 
				if(this.showCount==true || this.showCount=='true'){ 
					return h('div'[h('span',node.label+"("+data.count+countMsg+")")]) ;
				}else{
					return h('div',[h('span',node.label+"("+data.count+countMsg+")")]) ;
					//return h('span',"@contextmenu.prevent='contextmenu('"+node.id+"')',"+node.label+"("+(data.children==null?0:data.children.length)+countMsg+")") ;
				}
			        
			  },
			translateDataToTree(data2) { 
				var data=JSON.parse(JSON.stringify(data2));

				let parents = data.filter(value =>{ 
					//如果我的上级为空，则我是最上级
					if(value.pid == 'undefined' || value.pid == null  || value.pid == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.pid==i.id)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.pid==i.id)){
						return true;
					}else{
						return false;
					} 
				})  
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.pid === parent.id) {
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
		},
		mounted() { 
			this.nodeid=this.value;
			this.getTreeData();  
			let that=this;
			this.defaultTreeProps.disabled=function(data,node){
				if(that.isLeaf && that.isLeaf==true){
					return !node.isLeaf; 
				}else{
					return false;
				}
				
			}
		}
	}

</script>

<style rel="stylesheet/scss" lang="scss" scoped> 
 
 
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px; 
    color: #4386c6;
 
  }
 
  .el-ic {
    display: none;
    i, span {
      padding: 0 8px;
      font-size: 18px;
      font-weight: 600;
    } 
  }
  
 
  .el-tree-node__content:hover .el-ic {
    color: #428bca !important;
    display: inline-block;
	margin-left: 20px;
	
  }
 
  .el-tree-node__content:hover {
    font-weight: bold;
  }
 
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content :hover {
    .el-tree-node__expand-icon.is-leaf {
      color: transparent;
      cursor: default;
    }
    /*background-color: #3998d9;*/
    .custom-tree-node {
      font-weight: bold;
    }
    .el-tree-node__expand-icon {
      font-weight: bold;
    }
 
  } 
 
</style>