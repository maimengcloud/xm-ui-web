<template>
	<section> 
		<el-row>
			<!--列表 XmIteration 迭代定义-->
			<el-table ref="table" :height="maxTableHeight" :data="xmIterationTreeData" row-key="id"  default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column type="index" label="序号" ></el-table-column>
				   <el-table-column prop="iterationName" label="迭代名称" >
					<template slot="header" slot-scope="scope">
					迭代名称 <el-button type="text" @click="clearSelectIteration">清空所选</el-button> &nbsp;<el-button type="text" @click="close">关闭</el-button>
					<el-popover v-if=" !menuId && !productId"
						placement="top-start"
						title=""
						width="400"
						trigger="hover" >
						<el-row>  
							<el-col :span="24" style="padding-top:5px;">
								<font class="more-label-font">
									迭代查询范围：
								</font>
								<el-select  v-model="filters.queryScope" style="width:100%;"   placeholder="迭代查询范围">
									<el-option :label="userInfo.branchName+'机构下所有的迭代'" value="branchId"></el-option>
									<el-option label="我相关的迭代" value="compete"></el-option>
									<el-option label="按迭代编号精确查找" value="iterationId"></el-option>
									<el-option label="后台智能匹配" value=""></el-option>
								</el-select>
							</el-col>
							<el-col v-if="filters.queryScope=='iterationId'" :span="24"  style="padding-top:5px;"> 
								<el-input   v-model="filters.id" style="width:100%;"  placeholder="输入迭代编号" @keyup.enter.native="searchXmProducts">  
								</el-input> 
							</el-col>
							<el-col v-if="filters.queryScope!='iterationId'" :span="24"  style="padding-top:5px;">
								<font class="more-label-font">上线时间:</font>
								<el-date-picker 
									v-model="dateRangerOnline"
									type="daterange"
									align="right"
									unlink-panels
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="完成日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									:default-time="['00:00:00','23:59:59']"
									:picker-options="pickerOptions"
								></el-date-picker>
							</el-col>
							<el-col :span="24" style="padding-top:5px;">
									<font class="more-label-font">迭代名称:</font><el-input  v-model="filters.key" style="width: 60%;" placeholder="模糊查询"></el-input>
							</el-col>
							
							<el-col :span="24" style="padding-top:5px;">
									<el-tag>默认只能查询本人创建的迭代、本人作为需求责任人参与的迭代</el-tag>
							</el-col>
							<el-col :span="24" style="padding-top:5px;">
								<el-button  type="primary" icon="el-icon-search" @click="getXmIterations">查询</el-button>
							</el-col> 
						</el-row>
						<el-button type="text" slot="reference">更多条件</el-button>
					</el-popover>
				</template>
					 <template slot-scope="scope">

						 {{scope.row.iterationName}}  <font   :color="calcFinishRate(scope.row)==100?'green':'#FF8C00'">{{calcFinishRate(scope.row)}}%</font>
					 </template>
				</el-table-column> 
			</el-table>
			<el-pagination  layout="total, prev,  next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmIteration,listXmIterationWithState, delXmIteration, batchDelXmIteration,loadTasksToXmIterationState } from '@/api/xm/core/xmIteration';
  

	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),

			xmIterationTreeData(){
				return this.translateDataToTree(this.xmIterations);
      },
		},
		props:[ 'productId','menuId','visible','selProject','autoSelect'],
		watch:{
			visible:function(visible){
				if(visible==true){
					this.clearSelectIteration();
					this.getXmIterations();
				}
			},
			productId:function(){
				this.getXmIterations();
			}
		},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 ); 
			endDate.setTime(endDate.getTime() + 3600 * 1000 * 24 * 7 * 4 * 12 ); 
			return {
				filters: {
					key: '',
					queryScope:'',//迭代查询范围 iterationId\branchId\compete\''
					id:'',//迭代编号
				},
				pickerOptions:  util.pickerOptions('datarange'), 
				dateRangerOnline: [ 
				],//上线时间选择范围
				xmIterations: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmIteration界面是否显示
				//新增xmIteration界面初始化数据
				addForm: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',seqNo:'',
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmIteration界面初始化数据
				editForm: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',seqNo:'',
				},
				editFormInit: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',seqNo:'',
				},

				/**begin 自定义属性请在下面加 请加备注**/
				valueChangeRows:[],
				parentIteration:null,
				iterationStateVisible:false,
				gstcVisible:false,
				maxTableHeight:300,
				ganrrColumns: {
				children: 'children',
				name: 'iterationName',
				id: 'id',
				pid: 'pid',
				startDate: 'startTime',
				endDate: 'endTime',
				}
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmIterations();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmIterations();
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
				this.getXmIterations();
			},
			searchXmIterations(){
				 this.pageInfo.count=true;
				 this.getXmIterations();
			},
			//获取列表 XmIteration 迭代定义
			getXmIterations() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				}; 
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key){
					params.key= "%"+this.filters.key+"%"
				}
				if(this.productId){
					params.productId=this.productId
				}
				if(this.menuId){
					params.menuId=this.menuId
				}  
				if( !this.menuId && !this.productId ){
					params.queryScope=this.filters.queryScope 
					if(this.filters.queryScope=='iterationId'){
						if(!this.filters.id){
							this.$notify({showClose: true, message:"您选择了按迭代编号精确查找模式，请输入迭代编号", type: 'error' });
							return;
						}
						params.id=this.filters.id
						
					}
					if(this.filters.queryScope=="branchId"){
						params.branchId=this.userInfo.branchId
					}
					
				}
				if(this.selProject && this.selProject.id){
					params.projectId=this.selProject.id
				}
				
				if(this.dateRangerOnline && this.dateRangerOnline.length==2){
					params.onlineTimeStart=this.dateRangerOnline[0] 
					params.onlineTimeEnd=this.dateRangerOnline[1] 
				}
				this.load.list = true;
				listXmIterationWithState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmIterations = res.data.data;
						
						if(this.autoSelect===true&&this.xmIterations.length>0){ 
							var row=this.xmIterations[0];
							this.$refs.table.setCurrentRow(row);
							this.rowClick(row);
						}
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
 
			//选择行xmIteration
			selsChange: function (sels) {
				this.sels = sels;
			},  
			rowClick: function(row, event, column){
				this.editForm=row
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/

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

			clearSelectIteration(){
				this.editForm=this.editFormInit
				
				this.$refs.table.setCurrentRow();
				this.$emit('clear-select',null );//  @row-click="rowClick"
			},
			fieldChange:function(row,fieldName){

				if(this.valueChangeRows.some(i=>i.id==row.id)){
					return;
				}else{
					this.valueChangeRows.push(row)
				}
			},
			 
			formatterDate(row,column,cellValue, index){
				if(cellValue){
					return cellValue.substr(0,10);
				}else{
					return cellValue;
				}
      		},
			/**end 自定义函数请在上面加**/
			calcFinishRate(row){
				if(row.finishRate){
					return parseInt(row.finishRate);
				}else{
					return 0;
				}
			},
			close(){
				this.$emit("close")
			},
			loadTasksToXmIterationState(row){

				this.load.edit=true;
				loadTasksToXmIterationState({id:row.id}).then(res=>{
					this.load.edit=false;
					var tips =res.data.tips;
					if(tips.isOk){
						this.getXmIterations();
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
				});
			},
		},//end methods
		components: { 
		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => { 
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 
				this.getXmIterations();
        	});
           
		}
	}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .more-label-font{
  	text-align:center;
  	float:left;
  	padding-top:5px; 
  }
  .font-class{
	  color: rgba(116, 85, 85, 0.493);
  }
  
.align-right{
	float: right; 
}
</style>
