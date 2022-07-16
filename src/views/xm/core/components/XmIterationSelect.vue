<template>
	<section>  
		<el-popover style="display:inline;"
			placement="bottom"
			width="400"
			v-model="iterationVisible"
			trigger="manual" >  
			<el-row>
				<el-button
				type="text"
				icon="el-icon-refresh"
				@click="refreshSelect"
				title="重新从后台刷新数据回来"
				>刷新</el-button>&nbsp;&nbsp;
				<el-button v-if="clearable!==false && editForm && editForm.id" type="text" icon="el-icon-circle-close" @click="clearSelectIteration" title="清空当前选中的迭代">清空&nbsp;&nbsp;</el-button> 
				
				<el-button
					@click="addIterationVisible = true"
					icon="el-icon-plus"
					type="text"
					>创建迭代</el-button>&nbsp;&nbsp;
				<el-popover 
					placement="top-start"
					title=""
					v-model="moreVisible"
					width="400"
					trigger="manual" >
					<el-row>   
						<el-col :span="24"  style="padding-top:5px;"> 
							<font class="more-label-font">迭代编号:</font><el-input  v-model="filters.id"   placeholder="输入迭代编号">  
							</el-input> 
						</el-col>
						<el-col  :span="24"  style="padding-top:5px;">
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
								<font class="more-label-font">迭代名称:</font><el-input  v-model="filters.key"  placeholder="模糊查询"></el-input>
						</el-col> 
						<el-col :span="24" style="padding-top:5px;">
							<el-button  type="text"   @click="moreVisible=false">关闭</el-button>
							<el-button  type="primary" icon="el-icon-search" @click="searchXmIterations">查询</el-button>
						</el-col> 
					</el-row>
					<el-button type="text" slot="reference" @click="moreVisible=!moreVisible"  icon="el-icon-search">更多条件</el-button>
				</el-popover>
				<el-button type="text" @click="close" style="float:right;" icon="el-icon-close">关闭</el-button> 
			</el-row>
			<el-row
        v-if="load.list == false && (!xmIterations || xmIterations.length == 0)"
      >
        <el-row v-if="linkProjectId">
          <el-row
            >没有查到与项目【{{
              linkProjectId
            }}】关联的迭代,您可以尝试&nbsp;&nbsp;
            <el-button
              type="text"
              icon="el-icon-refresh"
              @click="refreshSelect"
              title="重新从后台刷新数据回来"
              >刷新</el-button
            >&nbsp;&nbsp; 重新从后台加载，或者<el-button
              @click="addIterationVisible = true"
              icon="el-icon-plus"
              type="text"
              >创建迭代</el-button
            >
            ，并自动关联项目【{{
              linkProjectId
            }}】。
          </el-row>
        </el-row>
        <el-row v-else>
          <el-row
            >没有查到相关迭代,您可以尝试&nbsp;&nbsp;
            <el-button
              type="text"
              icon="el-icon-refresh"
              @click="refreshSelect"
              title="重新从后台刷新数据回来"
              >刷新</el-button
            >&nbsp;&nbsp; 重新从后台加载，或者<el-button
              @click="addIterationVisible = true"
              icon="el-icon-plus"
              type="text"
              >创建迭代</el-button
            >
          </el-row>
        </el-row>
      </el-row>
			<el-row>
				<el-table ref="table" :height="maxTableHeight" :data="xmIterations" row-key="id"    @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 					<el-table-column prop="iterationName" label="迭代" > 
						<template slot-scope="scope"> 
							{{scope.row.iterationName}}  <font   :color="calcFinishRate(scope.row)==100?'green':'#FF8C00'">{{calcFinishRate(scope.row)}}%</font>
						</template>
					</el-table-column> 
				</el-table>
				<el-pagination  layout="total, prev,  next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

			</el-row>
			<el-link title="点击选中迭代" @click="referenceClick"  type="warning" slot="reference" icon="el-icon-search"><font style="font-size:14px;"><slot name="title">{{editForm&&editForm.id?editForm.iterationName:'选择迭代'}}</slot></font></el-link> 
		</el-popover> 
		
	
        <el-dialog append-to-body :visible.sync="addIterationVisible" width="70%">
          <xm-iteration-add
            :xm-product="productId?{ id: productId, name: '' }:null"
			:sel-project="linkProjectId?{id:linkProjectId,name:''}:null"
            @cancel="addIterationVisible = false"
            @submit="afterAddSubmit"
          >
          </xm-iteration-add>
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmIteration,listXmIterationWithState, delXmIteration, batchDelXmIteration } from '@/api/xm/core/xmIteration';
	import {  loadTasksToXmIterationState } from '@/api/xm/core/xmIterationState';
  
	const map=new Map();
	import { mapGetters } from 'vuex' 
	import XmIterationAdd from "../xmIteration/XmIterationAdd.vue";

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]), 
		},
		props:['clearable', 'productId', 'linkProjectId','autoSelect'],
		watch:{ 
			productId:function(){
				this.initData();
			},
			linkProjectId:function(){
				this.initData();
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
				pickerOptions:  util.getPickerOptions('datarange'), 
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

 				//新增xmIteration界面初始化数据
				addForm: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',seqNo:'',
				}, 
				//编辑xmIteration界面初始化数据
				editForm: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',seqNo:'',
				}, 

				editFormInit: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',seqNo:'',
				},
				/**begin 自定义属性请在下面加 请加备注**/ 
				maxTableHeight:300, 
				iterationVisible:false,
				moreVisible:false,
				hadInit:false,
				addIterationVisible:false,
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
				 
				if(this.linkProjectId){
					params.linkProjectId=this.linkProjectId
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
						if(this.productId){
							 map.set(this.productId,this.xmIterations)
						}else if(this.linkProjectId){
							 map.set(this.linkProjectId,this.xmIterations)
						}
						if(this.autoSelect===true&&this.xmIterations.length>0){ 
							if(this.autoSelect!==false&&this.xmIterations.length>0 && this.iterationVisible==false){ 
								var row=this.xmIterations[0]; 
								this.$refs.table.setCurrentRow(row); 
								this.rowClick(row)
							} 
						}else{
							if(this.xmIterations.length==0 ){
								if(this.editForm && this.editForm.id){
									this.clearSelectIteration()
								}
							}
						}
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
 
			//选择行xmIteration
			selsChange: function (sels) {
				this.sels = sels;
			},  
			rowClick: function(row, event, column){ 
				var oldId=this.editForm&&this.editForm.id?this.editForm.id:null
				this.editForm=row
				this.iterationVisible=false;
				this.moreVisible=false;
				if(oldId!=this.editForm.id){
					this.$emit("change",row)
				} 
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
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
				this.iterationVisible=false;
				this.$emit("close")
			}, 
			initData(){
				
				if(this.productId){
					var xmIterations=map.get(this.productId);
					if(xmIterations){
						this.xmIterations=xmIterations;
						if(this.autoSelect!==false&&this.xmIterations.length>0 && this.iterationVisible==false){ 
							var row=this.xmIterations[0]; 
							this.$refs.table.setCurrentRow(row); 
							this.rowClick(row)
						}else{
							this.clearSelectIteration()
						}
					}else{
						this.searchXmIterations();
					}
				}else if(this.linkProjectId){
					var xmIterations=map.get(this.linkProjectId);
					if(xmIterations){
						this.xmIterations=xmIterations;
						if(this.autoSelect!==false&&this.xmIterations.length>0 && this.iterationVisible==false){ 
							var row=this.xmIterations[0]; 
							this.$refs.table.setCurrentRow(row); 
							this.rowClick(row)
						}
					}else{
						this.searchXmIterations();
					}
				}else{
					this.searchXmIterations();
				}
			},
			

			clearSelectIteration(){
				var oldId=this.editForm.id
				this.editForm=this.editFormInit 
				this.$refs.table.setCurrentRow();
				if(oldId!=this.editForm.id){
					this.$emit("change",null)
				}
				this.iterationVisible=false;
				this.moreVisible=false;
				this.$emit('clear',null );//  @row-click="rowClick"
			}, 
			refreshSelect() {
				this.searchXmIterations();
				this.moreVisible = false;
			},
			referenceClick(){
				if(!this.hadInit){
					this.initData();
					this.hadInit=true;
				}
				this.iterationVisible=!this.iterationVisible;
			},
			reloadOne(){
				listXmIterationWithState({id:this.editForm.id}).then((res) => {
					var tips = res.data.tips; 
					if(tips.isOk && res.data.data && res.data.data.length>0){
						Object.assign(this.editForm,res.data.data[0])
						this.rowClick(this.editForm)
					}
				})
			},
			
			afterAddSubmit(row) {
				this.xmIterations.push(row);
				if (this.productId) {
					map.set(this.productId, this.xmIterations);
				} else if (this.linkProjectId) {
					map.set(this.linkProjectId, this.xmIterations);
				}
				if (
					this.autoSelect !== false &&
					this.xmIterations.length > 0 &&
					this.iterationVisible == false
				) {
					var row = this.xmIterations[0];
					this.$refs.table.setCurrentRow(row);
					this.rowClick(row);
				}
				this.addIterationVisible = false;
			}, 
		},//end methods
		components: { 
			XmIterationAdd,
		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {  
				 
			this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 

			if(this.autoSelect!==false){
					this.initData();
					this.hadInit=true;
				}
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
