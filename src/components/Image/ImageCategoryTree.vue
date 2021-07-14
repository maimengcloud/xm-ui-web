<template>
	<section style="margin-top: 10px;margin-right: 10px;">
		 
						<el-input  v-model="categoryFilterText" v-if="showFilter=='true'" placeholder="分类名称、编号过滤" auto-complete="off"></el-input>
						<el-tree
						  class="filter-tree"
						  :data="categoryTreeData"
						  :props="defaultCategoryTreeProps"
						  :filter-node-method="filterCategoryNode"
						  :show-checkbox="showCheckbox"
						  :default-expand-all="defaultExpandAll"
						  :expand-on-click-node="expandOnClickNode"
						  :indent="indent"
						  :node-key="nodeKey_"
						  :default-expanded-keys="defaultExpandedKeys"
  						  :default-checked-keys="defaultCheckedKeys"
  						  auto-expand-parent
						  @check-change="handleCheckChange"
						  @current-change="handleCurrentChange"
						  @node-click="handleNodeClick"
						  check-strictly
						  :accordion="true"
						  highlight-current
						  :render-content="renderContent"
						  ref="categoryTree"
						  :style="treeStyle">
						</el-tree>
					 
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { getImageCategoryTrees } from '@/api/mdp/arc/imageCategory';
		import { mapGetters } from 'vuex';
	export default { 
		watch: {
	      categoryFilterText(val) {
	        this.$refs.categoryTree.filter(val);
	      },
	   //    locationId(locationId) {
	   //  	  this.getCategoryTreeData(false);
		  // },branchId
		  	      branchId(branchId) {
		   	  this.getCategoryTreeData(false);
		  		  },
	      checkedKeys(val){
	      	 this.$refs.categoryTree.setCheckedKeys(val);
	      },
	      refresh(val){ 
	      	this.getCategoryTreeData(refresh);
	      },
	     /*  currentKey(val){ 
	    	  //console.log("111111111111111111111111111");
	    	  //console.log(val);
	    	  this.categoryTreeData=[];
	    	 // this.$refs.categoryTreeTag.getCategoryTreeData();
	    	 this.getCategoryTreeData();
	    	 //this.$refs.categoryTree.setCheckedKeys([val]);
	    	 this.$refs.categoryTree.setCurrentKey(val);
		  },  */
	    },
	    computed:{
	    	defaultExpandedKeys(){
	    		return this.defaultCheckedKeys;
	    	},
	    	defaultCheckedKeys(){
	    		if(!!this.currentKey){
	    			return [this.currentKey];
	    		}
	    		/* if(!!this.checkedKeys&&this.checkedKeys.length>0){
	    			return this.checkedKeys
	    		}; */
	    		if(!!this.checkedKeys&&this.checkedKeys.length>0){
		    		var flag=this.checkedKeys.some(y=>{
		    			if(!y){
		    				return true;
		    			}
		    		});
		    		if(!flag){
		    			return this.checkedKeys
		    		}
	    		}
	    		return ["0"];
	    	},
	    	nodeKey_(){
	    		return this.nodeKey?this.nodeKey:'id'
	    	},
			...mapGetters([
			  'userInfo'
			])
	    },
	    props: ['visible','currentKey','nodeKey','showCount','countTips','showFilter','rootKey','multiple','checkedKeys','refresh','defaultExpandAll','expandOnClickNode','showCheckbox','indent','treeStyle','locationId'],
		data() {
			return { 
				categoryFilterText: '',
				categoryTreeData:[], 
				defaultCategoryTreeProps:{
					
					id:this.nodeKey_,
					label:'categoryName',
					children: 'children'
				},  
				listLoading: false
			}
		},
		methods: { 
			handleCheckChange(data, checked, indeterminate) {
				let checkedKeys=this.$refs.categoryTree.getCheckedKeys(); 
				
				if( !this.multiple || this.multiple==false||this.multiple=='false'){
					if(checked==true){
						if(checkedKeys.length>1){ 
							this.$refs.categoryTree.setCheckedKeys([data[this.nodeKey_]]);
							this.$emit('check-change',data,checked,indeterminate);
						}else{
							this.$emit('check-change',data,checked,indeterminate);
						}
					}else{
						if(checkedKeys.length==0){
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
		    
			//获取分类树列表
			getCategoryTreeData(refresh) {
					console.log("进来这里");
				let id='';
				if(this.rootKey!='' && this.rootKey!=null){
					id=this.rootKey;
				}
				let params = { 
					id: id,
					branchId:this.userInfo.branchId
				};
				console.log("进来这里第二部");
				// if(this.branchId!=''&&this.branchId!=undefined){
				// 	params.branchId=this.branchId
				// }else{
				// 	this.categoryTreeData=[];
				// 	return ;
				// }
 				if(refresh==true){
 					params.refresh=1;
 				}
				this.listLoading = true;
				this.categoryTreeData=[];
				
				getImageCategoryTrees(params).then((res) => {
					var tips=res.data.tips;
					console.log("进来这里第三部");
					if(tips.isOk==true){ 
						console.log("进来这里第四部");
						var data = res.data.data;
						data.disabled=true;
						console.log("数据");
						console.log(data);
						this.categoryTreeData=[res.data.data];
						this.$refs.categoryTree.setCurrentKey(this.currentKey);
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error'});
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
				});
			}, 
			filterCategoryNode(value, data) {
		        if (!value) return true;
		        return data.categoryName.indexOf(value) !== -1;
		     },
		     renderContent(h, { node, data, store }) {
		    	 var countMsg='';	
		    	 if(this.countTips){
	    	 			countMsg=this.countTips;
	    	 		}
		    	 	if(this.showCount==true || this.showCount=='true'){
		    	 		
		    	 		
		    	 		return h('span',node.label) ;
		    	 	}else{
		    	 		return h('span',node.label+"("+(data.isPub=='1'?'公共分类':'')+countMsg+")") ;
		    	 	}
			        
			  }
		},
		mounted() { 
			this.getCategoryTreeData();
		}
	}

</script>

<style scoped>

</style>