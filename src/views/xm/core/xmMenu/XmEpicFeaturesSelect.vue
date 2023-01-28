<template>
	<section>
		<el-row>
			<el-col :span="24" class="padding-left">
					<el-row >

						<xm-product-select ref="xmProductSelect1" style="display:inline;" v-if="!xmProduct && !xmIteration"   :auto-select="false" :link-project-id="selProject?selProject.id:null" @row-click="onProductSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProductClearSelect"></xm-product-select> 
						 
						<el-input style="width:120px;" v-model="filters.key" placeholder="名称模糊查询"  clearable></el-input>
						<el-button icon="el-icon-search" @click="searchXmMenus()"></el-button> 
						<el-button v-if="showSelect!==false && multi===true" type="primary" @click="selectConfirm()">确认选择</el-button> 
					 </el-row>
					<el-row>
						<el-table element-loading-text="努力加载中" element-loading-spinner="el-icon-loading"    stripe fit border ref="table" :height="maxTableHeight" :data="xmMenusTreeData" current-row-key="menuId" row-key="menuId" :tree-props="{children: 'children'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick">
							<template v-if="showSelect!==false && multi===true">
								<el-table-column   label="" type="selection"  width="60"  >  
								</el-table-column> 
							</template>
							<el-table-column prop="menuName" label="史诗、特性名称" min-width="150" >
								<template slot="header">史诗、特性名称 &nbsp;<el-button type="text" @click="unselectRow()">清除选中的行</el-button></template>
								<template slot-scope="scope">
									<div  v-if="scope.row.dclass=='1'" class="icon" style="background-color:  rgb(255, 153, 51);">
									<i class="el-icon-s-promotion"></i>
									</div>
									<div v-if="scope.row.dclass=='2'" class="icon" style="background-color:  rgb(0, 153, 51);">
									<i class="el-icon-s-flag"></i>
									</div>
									<div v-if="scope.row.dclass=='3'" class="icon" style="background-color:  rgb(79, 140, 255);">
									<i class="el-icon-document"></i>
									</div>
									<span>{{scope.row.seqNo}} &nbsp; {{scope.row.menuName}} </span> 
									<span  
										:style="{borderRadius: '30px',color:scope.row.finishRate >= 100 ? 'green' : 'blue'}" 
									>
										{{ (scope.row.finishRate != null ? scope.row.finishRate : 0) + "%" }}
									</span> 
  								</template> 
							</el-table-column>  
							<template v-if="showSelect!==false && multi!==true">
							<el-table-column   label="操作"  width="100"  > 
								<template slot-scope="scope"> 
									<el-button      @click="select( scope.row,scope.$index)"   title="选择" type="primary"> 选择</el-button>     
								</template>
							</el-table-column> 
							</template>
						</el-table> 
						<el-pagination  layout="total, sizes, prev,  next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

					</el-row> 
			</el-col>
		</el-row>
		
 		 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmMenu, delXmMenu, batchDelXmMenu,batchAddXmMenu,batchEditXmMenu,listXmMenuWithState,listXmMenuWithPlan,batchChangeParentMenu,editXmMenuSomeFields } from '@/api/xm/core/xmMenu';
  	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//新增界面 

	import {sn} from '@/common/js/sequence'

	import { mapGetters } from 'vuex'

	export default {
		props:['selProject','xmIteration','xmProduct','showSelect','multi'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),

      		xmMenusTreeData() {
				let xmMenus = JSON.parse(JSON.stringify(this.xmMenus || []));
				let xmMenusTreeData = treeTool.translateDataToTree(xmMenus,"pmenuId","menuId");
				 return xmMenusTreeData;
			}, 
			toSearchCpd(){
				debugger;
				var key={iterationId:'',projectId:'',productId:''};
				if(this.xmIteration&&this.xmIteration.id){
					key.iterationId=this.xmIteration.id
					key.productId=this.xmIteration.productId
				}else{
					key.iterationId=''
				}
				if(this.xmProduct&&this.xmProduct.id){  
					key.productId=this.xmProduct.id
				}else{
					key.productId=''
				}
				if(this.selProject&&this.selProject.id){ 
					key.projectId=this.selProject.id
				}else{
					key.projectId=''
				} 
				return key.iterationId+key.projectId+key.productId
			}
		},
		watch:{
			xmIteration:function(){
				this.filters.iterationFilterType="join-curr-iteration"
				this.filters.iteration=this.xmIteration 
			},
			xmProduct:function(){
				this.filters.product=this.xmProduct 
			},
			selProject:function(){ 
			},
			toSearchCpd:function(){
				this.searchXmMenus();
			}
    	},
		data() { 
			return {
				columnsConfig:[/**{label:'',property:'',isShow:true} */],
				filters: {
					key: '',
					product:null,
					mmUser:null,
					iterationFilterType:'',//join、not-join、''
					taskFilterType:'',//join、not-join、''
					tags:[],
					status:'',
					iteration:null,
					dlvl:'',
					dtype:'',
					priority:'',
					source:'',
					dclasss:['1','2'],
					menuId:'',//需求编号
					productId:'',//产品编号
				},
				xmMenus: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:100,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					menuStatus:[

							{id:"0", name:"初始"},
							{id:"1", name:"待评审"},
							{id:"2", name:"待设计"},
							{id:"3", name:"待开发"},
							{id:"4", name:"待SIT"},
							{id:"5", name:"待UAT"},
							{id:"6", name:"待上线"},
							{id:"7", name:"运行中"},
							{id:"8", name:"已下线"},
							{id:"9", name:"已删除"},
					],
					dclass:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
 
 
 				//编辑xmMenu界面初始化数据
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',ntype:'0',childrenCnt:0,sinceVersion:'',proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',source:'1'
				},
				parentMenu:null, 
				maxTableHeight:300, 
				productVisible:false, 
				parentMenuVisible:false, 
			}
		},//end data
		methods: {
			selectVisible(row,visible){
				if(visible){
					this.rowClick(row)
				}
			},
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmMenus();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmMenus();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmMenus();
			},
			searchXmMenus(){
				 this.pageInfo.count=true;
				 this.getXmMenus();
			},
			getParams(params){

				if( this.filters.key){
					params.key="%"+this.filters.key+"%"
				}

				if(this.filters.mmUser){
					params.mmUserid=this.filters.mmUser.userid;
				}
				if(this.filters.iterationFilterType){
					params.iterationFilterType=this.filters.iterationFilterType
					if(params.iterationFilterType==='not-join-any-iteration'){

					}else if(params.iterationFilterType==='join-any-iteration'){

					}else if(params.iterationFilterType==='not-join-curr-iteration'){
						params.filterIterationId=this.filters.iteration.id
					}else if(params.iterationFilterType==='join-curr-iteration'){
						params.filterIterationId=this.filters.iteration.id
					}
					params.ntype="0"
				}else{
					if(this.filters.iteration){
						params.iterationId=this.filters.iteration.id
					}
				}
				if(this.xmIteration && this.xmIteration.id){
					params.linkIterationId=this.xmIteration.id
				}
				if(this.filters.taskFilterType){
					params.taskFilterType=this.filters.taskFilterType

					if(params.taskFilterType==='not-join-curr-project'){
						params.projectId=this.selProject.id
					}
					if(params.taskFilterType==='join-curr-project'){
						params.projectId=this.selProject.id
					}
					params.ntype="0"
				}
				if(this.selProject && this.selProject.id){
					params.linkProjectId=this.selProject.id
				}
				if(this.filters.product){
					params.productId=this.filters.product.id
				}
				if(this.filters.status){
					params.status=this.filters.status
				}

				if(this.filters.dlvl){
					params.dlvl=this.filters.dlvl
				}

				if(this.filters.dtype){
					params.dtype=this.filters.dtype
				}

				if(this.filters.priority){
					params.priority=this.filters.priority
				}

				if(this.filters.source){
					params.source=this.filters.source
				}
				if( this.dateRanger && this.dateRanger.length==2){
					params.ctimeStart=this.dateRanger[0]
					params.ctimeEnd=this.dateRanger[1]
				}
				if(this.filters.tags && this.filters.tags.length>0){
					params.tagIdList=this.filters.tags.map(i=>i.tagId)
				}
				if(this.filters.dclasss){
					params.dclasss=this.filters.dclasss
				}
				if(this.filters.menuId){
					params.menuId=this.filters.menuId
				}
				if(this.filters.productId){
					params.productId=this.filters.productId
				}
				return params;
			}, 
			//获取列表 XmMenu xm_project_menu
			getXmMenus() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				//this.xmMenus=[]
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if( this.filters.product  && this.filters.product.id){
					params.productId=this.filters.product.id
				}
				params=this.getParams(params); 
				if(!params.productId){
					return;
				}
				let callback= (res)=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenus = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}
				this.load.list = true;
				if(!this.selProject){
					listXmMenuWithState(params).then( callback ).catch( err => this.load.list = false );
				}else{
					listXmMenuWithPlan(params).then( callback ).catch( err => this.load.list = false );
				}
			}, 
			//选择行xmMenu
			selsChange: function (sels) {
				this.sels = sels;
			},
			onProductSelected:function(product){
				this.filters.product=product 
				this.xmMenus=[]
				this.getXmMenus()
				this.$emit("product-select",product)
			},
			onProductClearSelect:function(){
				this.filters.product=null 
				this.xmMenus=[]
				this.getXmMenus() 
				this.$emit("product-select",null)
			},  
			select(row){
				this.$emit("select",row)
			},
			calcMenuLabel(dclass){
				var params={label:'工作项',icon:'',color:''};
				if(dclass==='1'){
					params={label:'史诗',icon:'el-icon-s-promotion',color:'rgb(255, 153, 51)'};
				}else if(dclass==='2'){
					params={label:'特性',icon:'el-icon-s-flag',color:'rgb(0, 153, 51)'};
				}else if(dclass==='3'){
					params={label:'用户故事',icon:'el-icon-document',color:' rgb(79, 140, 255)'};
				}
				return params;
			},

			rowClick: function(row, event, column){ 
				this.editForm=row 
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
      		},
			selectConfirm(){
				this.$emit('menus-selected',this.sels)
			},
			
			unselectRow(){
				this.editForm=null;
				this.$emit('row-click',null)
				this.$refs.table.setCurrentRow(); 
			},
		},//end methods
		components: { 
			XmProductSelect, 
		    //在下面添加其它组件
		},
		mounted() {
  			initSimpleDicts("all",['menuStatus','demandSource','demandLvl','demandType','priority','dclass']).then(res=>{
				  Object.assign(this.dicts,res.data.data) 
			})
			this.filters.product=this.xmProduct

			if(this.xmIteration && this.xmIteration.id){
				this.filters.iterationFilterType='join-curr-iteration'
				this.filters.iteration=this.xmIteration
			}
			this.$nextTick(() => {
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
				
				if(this.xmProduct && this.xmProduct.id){ 
					this.getXmMenus();
				}
				
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
.align-right{
	float: right;
}
</style>

<style lang="scss">

</style>
