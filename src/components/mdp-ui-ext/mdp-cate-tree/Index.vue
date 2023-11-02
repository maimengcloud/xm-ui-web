<template>
	<section>
		<el-row>

		<mdp-select v-if="!categoryType" v-model="filters.categoryType" item-code="categoryType" width="70%"  placeholder="请选择主题" clearable /> 
		<el-button v-if="showConfirm"  type="warning"  @click.native="confirm">确认</el-button>

 		<el-tree
			:data="categoryTreeData"
			:props="defaultTreeProps"
			:filter-node-method="filterNode"
			:show-checkbox="showCheckbox"
			:default-expand-all="defaultExpandAll"
			:expand-on-click-node="expandOnClickNode"
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
				<el-popover
					:open-delay="500"
					placement="top-start" 
					width="200"
					trigger="hover" >
					<el-button icon="el-icon-circle-plus" circle type="primary"  @click.prevent.stop="addTopNode()" title="添加顶级分类"></el-button>
					<el-button icon="el-icon-plus" circle type="success" v-if=" !(!data.id || data.id=='C0'||data.id=='0')" @click.prevent.stop="addNode(data,node)" title="添加子分类"></el-button>
					<el-button icon="el-icon-edit" circle type="warning" v-if=" !(!data.id || data.id=='C0'||data.id=='0')" @click.prevent.stop="editNode(data,node)" title="修改名字"></el-button>
					<el-button icon="el-icon-delete" circle type="danger" v-if=" !(!data.id || data.id=='C0'||data.id=='0')" @click.prevent.stop="deleteNode(data,node)" title="删除该分类"> </el-button>
 					<span slot="reference">{{data.name}}</span>
				</el-popover> 
 			</div>
		</el-tree>
		<el-dialog
			title="提示"
			:visible.sync="addVisible"
			width="60%" append-to-body>
				<el-form ref="addCategory" :model="addCategory" label-width="200" 	>
					<el-form-item label="主题"  prop="categoryType" :rules="[
						{ required: true, message: '主题不能为空'}
						]">
						<mdp-select v-model="addCategory.categoryType" :disabled="currentCategory.categoryType" item-code="categoryType" placeholder="请选择主题"/> 
						<el-tag>{{  currentCategory && currentCategory.id? "上级："+currentCategory.name:"顶级分类，无上级" }}</el-tag>

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


					<el-form-item label="配置" prop="name">
						<el-checkbox v-model="addCategory.isLeaf" auto-complete="off"  true-label="0" false-label="1">是否可添加子分类</el-checkbox>

						<el-checkbox v-model="addCategory.limitType" auto-complete="off"  true-label="1" false-label="2">文章数目是否限制为1篇</el-checkbox>

						<el-checkbox v-model="addCategory.isAuth" auto-complete="off" true-label="1" false-label="0">文章发布是否需要审核</el-checkbox>
					</el-form-item> 
					<el-form-item label="权限" >
						<el-radio v-model="addCategory.qxLvl" auto-complete="off"  label="0">全网公开</el-radio>
						<el-radio v-model="addCategory.qxLvl" auto-complete="off"  label="1">内部公开</el-radio>
						<el-radio v-model="addCategory.qxLvl" auto-complete="off"  label="2">受限</el-radio> 
 						<el-checkbox v-model="addCategory.pqx" auto-complete="off"  true-label="1" false-label="0">所有子类遵守上级权限规则</el-checkbox> 
					</el-form-item> 
				</el-form>
				
				<el-row slot="footer">
					<el-button @click="addVisible = false">关闭</el-button>
					<el-button type="primary" v-loading="addLoading"  @click="addCategorySubmit">确 定</el-button>
				</el-row>
		</el-dialog>

		<el-dialog
			title="提示"
			:visible.sync="editVisible"
			width="60%" append-to-body>
				<el-form ref="editCategory" :model="editCategory" label-width="200" 	>
					<el-form-item label="主题"  prop="categoryType" :rules="[
						{ required: true, message: '主题不能为空'}
						]">
						<mdp-select v-model="editCategory.categoryType" item-code="categoryType" placeholder="请选择主题" :disabled="currentCategory.categoryType"/> 
					</el-form-item>
					<el-form-item label="分类编号"  prop="id">
						{{editCategory.id}}
					</el-form-item>
					<el-form-item label="分类名称"  prop="name"
					:rules="[
						{ required: true, message: '名称不能为空'}
						]">
						<el-input v-model="editCategory.name" ></el-input>
					</el-form-item>


					<el-form-item label="配置" >
						<el-checkbox v-model="editCategory.isLeaf" auto-complete="off"  true-label="0" false-label="1">是否可添加子分类</el-checkbox>

						<el-checkbox v-model="editCategory.limitType" auto-complete="off"  true-label="1" false-label="2">文章数目是否限制为1篇</el-checkbox>

						<el-checkbox v-model="editCategory.isAuth" auto-complete="off" true-label="1" false-label="0">文章发布是否需要审核</el-checkbox>
					</el-form-item> 
					

					<el-form-item label="权限" >
						<el-radio v-model="editCategory.qxLvl" auto-complete="off"  label="0">全网公开</el-radio>
						<el-radio v-model="editCategory.qxLvl" auto-complete="off"  label="1">内部公开</el-radio>
						<el-radio v-model="editCategory.qxLvl" auto-complete="off"  label="2">受限</el-radio> 
						<el-button type="primary" v-if="editCategory.qxLvl=='2'" @click="$refs['qxSetDialog'].open({category:editCategory})">配置限制规则</el-button>
						<el-checkbox v-model="editCategory.pqx" auto-complete="off"  true-label="1" false-label="0">所有子类遵守上级权限规则</el-checkbox> 
					</el-form-item> 
				</el-form>
				
				<el-row slot="footer">
					<el-button @click="editVisible = false">关 闭</el-button>
					<el-button type="primary" v-loading="editLoading" @click="editCategorySubmit">确 定</el-button>
				</el-row>
		</el-dialog>
		<mdp-dialog ref="qxSetDialog">
			<template v-slot="{visible,data,dialog}">
				<category-qx-set :visible="visible" :category="data.category" @close="dialog.close()" @submit="dialog.close()"></category-qx-set>
			</template>
		</mdp-dialog>
		</el-row>
	</section>
</template>

<script> 
	import { mapGetters } from 'vuex'
import CategoryQxSet from './QxSet.vue';
	export default {
		components:{
			CategoryQxSet
		},
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
		  },
		  categoryType(val){
			  this.getTreeData()
		  },
		  'filters.categoryType'(){
			this.getTreeData();
		  }
	    },
	    computed:{

			categoryTreeData() {
				 var datas= this.translateDataToTree(this.treeData);
				 if(datas==null || datas.length==0){
					 return [{pid:'',id:'C0',categoryType:'',name:'没有找到分类，点击创建'}]
				 }else{
					 return datas;
				 }
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
			  'userInfo'
			])
	    },
		props:{
			
			'value':String,Array,
			'branchId':String,
			'visible':{type:Boolean,default:false},
			'showCount':{type:Boolean,default:false},
			'showRoot':{type:Boolean,default:false},
			'countTips':String,
			'showFilter':{type:Boolean,default:false},
			'multiple':{type:Boolean,default:false},
			'checkedKeys':Array,
			'refresh':{type:Boolean,default:false},
			'defaultExpandAll':{type:Boolean,default:false},
			'expandOnClickNode':{type:Boolean,default:false},
			showCheckbox:{type:Boolean,default:false},
			showConfirm:{type:Boolean,default:false},
			'indent':Number,
			categoryType:{type:String,default:''}, 
			/**
			 * 上级分类
			 */
			pid:{
				type:String,
				default:''
			},
			crelyType:{
				type:String,
				default:''
			},
			crelyId:{
				type:String,
				default:''
			},
			crelyStype:{
				type:String,
				default:'',
			},
			crelySid:{
				type:String,
				default:''
			}
		},
 		data() {
			return {
				filters:{
					categoryType:'',
				},
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
				currentCategory:{id:'',pid:'',name:'',categoryType:''},
				addCategory:{id:'',pid:'',name:'',isLeaf:'0',isAuth:'0',limitType:'2',categoryType:'',pqx:'',qxLvl:''},
				editCategory:{id:'',pid:'',name:'',isLeaf:'0',isAuth:'0',limitType:'2',categoryType:'',pqx:'',qxLvl:''},
				addVisible:false,
				editVisible:false,
				options:{categoryType:[]},
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
					this.addCategory.branchId=this.userInfo.branchId
				}
				if(this.crelyType){
					this.addCategory.crelyType=this.crelyType
				}
				
				if(this.crelyId){
					this.addCategory.crelyId=this.crelyId
				}
				
				if(this.crelyStype){
					this.addCategory.crelyStype=this.crelyStype
				}
				
				if(this.crelySid){
					this.addCategory.crelySid=this.crelySid
				}
				this.$refs.addCategory.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							this.$mdp.addCategory(this.addCategory).then(res=>{
								this.addLoading=false;
								if(res.data.tips.isOk){

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
							this.$mdp.editCategory(this.editCategory).then(res=>{
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
			addTopNode(){

				this.currentCategory={};
				this.addVisible=true;
				this.addCategory.categoryType=this.categoryType
				return false;
			},
		    addNode(data, node, comp) {

				this.currentCategory=Object.assign({},data)
				this.addVisible=true;
				this.addCategory.categoryType=this.currentCategory.categoryType
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
							params.branchId=this.userInfo.branchId
						}
						this.$confirm('确认删除吗？', '提示', {}).then(() => {
							this.$mdp.delCategory(params).then(res=>{
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
					branchId:this.userInfo.branchId,
				};
 				if(refresh){
 					params.refresh=true;
 				}
				 if(this.categoryType!='' && this.categoryType!=null && this.categoryType!=undefined){
					 params.categoryType=this.categoryType
				 }

				 if(this.filters.categoryType){
					 params.categoryType=this.filters.categoryType
				 }
				 if(this.crelyType){
					params.crelyType=this.crelyType
				 }
				 
				 if(this.crelyStype){
					params.crelyStype=this.crelyStype
				 }
				 
				 if(this.crelyIds){
					params.crelyIdList=this.crelyIds
				 }
				 
				 if(this.crelySids){
					params.crelySidList=this.crelySids
				 }
				this.listLoading = true;
				this.$mdp.listCategory(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk==true){
						this.treeData=res.data.data;
						console.log("this.treeData----"+JSON.stringify(this.treeData));
					}else{
						this.$message({ message: tips.msg, type: 'error'});
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
					if(value.pid == 'undefined' || value.pid == null  || value.pid == ''||value.pid=='0'||value.pid=='C0'){
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
			
			confirm(){
				   var nodes= this.$refs.nodeTree.getCheckedNodes(false,false)
				   if(this.multiple){
					this.$emit('confirm',nodes)
				   }else{
					this.$emit('confirm',nodes&&nodes.length>0?nodes[0]:null)
				   }
				   
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
			if(this.categoryType){
				this.addCategory.categoryType=this.categoryType
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
      padding: 0 1px;
      font-size: 18px;
      font-weight: 600;
    }
  }


  .el-tree-node__content:hover .el-ic {
    color: #428bca !important;
    display: inline-block;
	margin-left: 2px; 
	z-index: 10000;
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
