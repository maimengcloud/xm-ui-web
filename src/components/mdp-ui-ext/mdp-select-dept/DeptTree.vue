<template>
	<section>
	  <el-row>
		<el-col :span="24" style="display:inline-block;" >
		  <el-input style="width:70%;"  v-model="deptFilterText" v-if=" showFilter " placeholder="编号、名称过滤" auto-complete="off"></el-input> 

		  <el-button v-if="showConfirm"  type="warning"  @click.native="confirm">确认</el-button>
  
		</el-col>
		<el-col :span="24">
		  <el-tree v-loading="listLoading"
				   class="filter-tree"
				   :props="defaultDeptTreeProps"
				   :filter-node-method="filterDeptNode"
				   :show-checkbox="showCheckbox"
				   :expand-on-click-node="expandOnClickNode"
				   :indent="indent"
				   :node-key="'deptid'"
				   :default-expanded-keys="defaultExpandedKeys"
				   :default-checked-keys="defaultCheckedKeys"
				   auto-expand-parent
				   highlight-current
				   style="min-height:100px;"
				   @check-change="handleCheckChange"
				   @current-change="handleCurrentChange"
				   @node-click="handleNodeClick"
				   :check-on-click-node="true"
				   check-strictly
				   :render-content="renderContent"
				   lazy
				   :load="loadNode"
				   ref="deptTree">
		  </el-tree>
		</el-col>
   
	  </el-row>
	</section>
  </template>
  
  <script> 
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
		  },
		  components: { 
		  },
		  computed:{
			  defaultExpandedKeys(){
				  return this.expandRowKeys
			  },
			  defaultCheckedKeys(){
				  if(this.value){
					  return [this.value];
				  }
				  return this.checkedKeys;
			  },
			   ...mapGetters([
					'userInfo'
				  ]),
			  treeData(){
				  return this.translateDataToTree(this.depts)
			  }
		  },
		  props: {
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
		  'indent':Number
		
		 },
		  data() {
			  return {
				  deptFilterText: '',
				  depts:[],
				  defaultDeptTreeProps:{
  
					  id:'deptid',
					  label:'deptName',
					  children: 'children',
					  isLeaf:'leaf'
				  },
				  listLoading: false,
				  deptid:'',
				  branchVisible: false,
				  branch:null,
				  expandRowKeys:[],
				  root:null,
				  resolve:null,
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
					  if(value.childrenNum>0){
						  value.leaf=false
					  }else{
						  value.leaf=true
					  }
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
				  this.root.childNodes=[]
				   this.loadNode(this.root,this.resolve)
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
  
  
						   return h('span',node.label+(data.children?'('+data.children.length+')':'')) ;
					   }else{
						   return h('span',node.label) ;
					   }
  
				},
				showBranchSelect: function(){
					this.$refs['branchSelect'].showSelect()
				},
				confirm(){
				   var nodes= this.$refs.deptTree.getCheckedNodes(false,false)
				   if(this.multiple){
					this.$emit('confirm',nodes)
				   }else{
					this.$emit('confirm',nodes&&nodes.length>0?nodes[0]:null)
				   }
				   
				},
				loadNode(node, resolve) {
					  if (node.level === 0) {
						  this.root=node
						  this.resolve=resolve
						  let params = {
							  levelType:'L1'
						  };
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
							  // params.autoDetectParentDeptid="1"
						  }
						  this.listLoading = true;
						  this.$mdp.listDept(params).then((res) => {
							  var tips=res.data.tips;
							  var data=res.data.data;
							  this.listLoading = false;
							  var tempData=this.translateDataToTree(data);
							  this.expandRowKeys=tempData.map(i=>i.deptid)
							  return resolve(tempData )
  
						  }).catch(() => {
							  this.listLoading = false;
						  });
					  }else  {
						  if((!node.data.children||node.data.children.length==0)){
							  setTimeout(() => {
								  let params = {
									  pdeptid:node.data.deptid
								  };
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
									  // params.autoDetectParentDeptid="1"
								  }
								  this.listLoading = true;
								  this.$mdp.listDept(params).then((res) => {
									  var tips=res.data.tips;
									  var data=res.data.data;
									  this.listLoading = false;
									  resolve(this.translateDataToTree(data))
  
								  }).catch(() => {
									  this.listLoading = false;
								  });
							  }, 500);
						  }else if((node.data.children&&node.data.children.length>0)){
							  return resolve(node.data.children)
						  }else {
							  return resolve([])
						  }
  
					  }
				  }
		  },
		  mounted() {
			  this.deptid=this.value;
			  //this.getDeptTreeData();
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
  