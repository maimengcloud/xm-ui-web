<template>
	<section>  
		<el-row>
		<el-table  lazy :load="loadXmProjectPhaseLazy" :height="tableHeight" ref="selectPhaseTable" :data="projectPhaseTreeData"    :show-summary="false"  row-key="id" :tree-props="{children: 'children', hasChildren: 'childrenCnt'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 			<el-table-column prop="phaseName" label="计划名称" min-width="160" show-overflow-tooltip> 
				 <template slot="header" slot-scope="scope">
					<div>计划  <el-tag  type="warning" v-if="editForm.id" closable @close="clearSelectPhase()"> {{editForm.phaseName}}</el-tag></div>
				</template>
				<template slot-scope="scope">  
					<i v-if="scope.row.ntype=='1'" class="el-icon-folder-opened"></i>{{scope.row.seqNo}} &nbsp;&nbsp;<el-tooltip v-if="scope.row.milestone=='1'" content="里程碑"><i  class="el-icon-star-on"></i></el-tooltip>{{scope.row.phaseName}}
				</template>
			</el-table-column>   
		</el-table>
 		<el-pagination    class="hidden-md-and-down"   layout="   prev,sizes, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectPhase  } from '@/api/xm/core/xmProjectPhase'; 

	import {sn} from '@/common/js/sequence'
	import { mapGetters } from 'vuex'
  
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
      projectPhaseTreeData() {
        let xmProjectPhases =  this.xmProjectPhases  
        
        var projectPhaseTreeData = this.translateDataToTree(xmProjectPhases); 

				 return projectPhaseTreeData;
      },
			 
		},
		props:['selProject','xmIteration'],
		watch:{
			selProject:function(selProject,old){ 
        
				if(!selProject){
					this.xmProjectPhases=[]
				}else{
					if( ( !old && selProject.id) || (old && selProject.id!=old.id)){
						
						this.searchXmProjectPhases();
					}
				}
			},
			xmIteration(){
				this.searchXmProjectPhases();
			}
    },
		data() {
 
			return {
				filters: {
					key: ''
				},
				xmProjectPhases: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:50,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{
					xmPhaseStatus:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProjectPhase界面是否显示
				//新增xmProjectPhase界面初始化数据
				addForm: {
					id:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',taskType:'kf',planType:'m1',projectId:'',beginDate:'',endDate:'',phaseBudgetHours:'',phaseBudgetStaffNu:'',ctime:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt:'',projectBaselineId:'',bizProcInstId:'',bizFlowState:'',phaseBudgetInnerUserCnt:'',phaseBudgetOutUserCnt:'',seqNo:'',phaseBudgetInnerUserPrice:80,phaseBudgetOutUserPrice:100,phaseBudgetInnerUserWorkload:0,phaseBudgetOutUserWorkload:0
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectPhase界面初始化数据
				editForm: {
					id:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',projectId:'',beginDate:'',endDate:'',phaseBudgetHours:'',phaseBudgetStaffNu:'',ctime:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt:'',projectBaselineId:'',bizProcInstId:'',bizFlowState:'',phaseBudgetInnerUserCnt:'',phaseBudgetOutUserCnt:'',seqNo:'',phaseBudgetInnerUserPrice:80,phaseBudgetOutUserPrice:100,phaseBudgetInnerUserWorkload:0,phaseBudgetOutUserWorkload:0
				},
				
				editFormInit: {
					id:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',taskType:'kf',planType:'m1',projectId:'',beginDate:'',endDate:'',phaseBudgetHours:'',phaseBudgetStaffNu:'',ctime:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt:'',projectBaselineId:'',bizProcInstId:'',bizFlowState:'',phaseBudgetInnerUserCnt:'',phaseBudgetOutUserCnt:'',seqNo:'',phaseBudgetInnerUserPrice:80,phaseBudgetOutUserPrice:100,phaseBudgetInnerUserWorkload:0,phaseBudgetOutUserWorkload:0
				},
				parentProjectPhase:null,
				/**begin 自定义属性请在下面加 请加备注**/
				phaseTemplateVisible:false,	
				xmRecordVisible:false,
				valueChangeRows:[],
				batchEditVisible:false,
				menuVisible:false,//由需求自动创建计划
        pickerOptions: util.pickerOptions('date'),
        gstcVisible:false,
		tableHeight:300,
        ganrrColumns: {
          children: 'children',
          name: 'phaseName',
          id: 'id',
          pid: 'parentPhaseId',
          startDate: 'beginDate',
          endDate: 'endDate',
        },
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectPhases();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectPhases();
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
				this.getXmProjectPhases();
			},
			searchXmProjectPhases(){
				 this.pageInfo.count=true; 
				 this.getXmProjectPhases();
			},
			
			getParams(params){

				if(this.filters.key){
					params.key='%'+this.filters.key+'%'
				}
				if(this.selProject!=null && this.selProject!=undefined){
					params.projectId=this.selProject.id

				}
				if(this.xmIteration){
					params.iterationId=this.xmIteration.id
				}
				if(this.xmProduct){
					params.productId=this.xmProduct.id
				}
				
				if(this.filters.milestone){
					params.milestone=this.filters.milestone
				}
				
				if(this.filters.isKeyPath){
					params.isKeyPath=this.filters.isKeyPath
				}

				if(this.filters.phaseStatus){
					params.phaseStatus=this.filters.phaseStatus
				}
				
				if(!(params.isKeyPath||params.milestone||params.productId||params.iterationId||params.phaseStatus)){
					params.isTop="1"
				}
				return params;
			},
			loadXmProjectPhaseLazy(row, treeNode, resolve) {  
				if(row.children&&row.children.length>0){
					resolve(row.children) 
				}else{
					var params={parentPhaseId:row.id}
					params=this.getParams(params);
					params.isTop=""
					this.load.list = true;
					var func=listXmProjectPhase 
					func(params).then(res=>{
						this.load.list = false
						var tips = res.data.tips;
						if(tips.isOk){
							resolve(res.data.data) 
						}else{
							resolve([])
						}
					}).catch( err => this.load.list = false );  
				}
				
			},
			//获取列表 XmProjectPhase xm_project_phase
			getXmProjectPhases() {
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
				params=this.getParams(params)
				this.load.list = true;
				listXmProjectPhase(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectPhases = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
 
			//选择行xmProjectPhase
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			 
			clearSelectPhase(){ 
				this.editForm=this.editFormInit
				this.$emit('clear-select',null );//  @row-click="rowClick"
			},
			rowClick: function(row, event, column){
				debugger;
				var myrow=JSON.parse(JSON.stringify(row))
				myrow.children=[];
				this.parentProjectPhase=myrow
				this.editForm=row;
				this.$emit('row-click',myrow, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			translateDataToTree(data2) { 
				var data=JSON.parse(JSON.stringify(data2));
				let parents = data.filter(value =>{
					//如果我的上级为空，则我是最上级  
					if(value.parentPhaseId == 'undefined' || value.parentPhaseId == null  || value.parentPhaseId == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.parentPhaseId==i.id)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.parentPhaseId==i.id)){
						return true;
					}else{
						return false;
					} 
				})  
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.parentPhaseId === parent.id) {
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
       
			getFloatValue(value,digit){
				if(value==null ||  value=='' || value==undefined){
					value=0;
					return value;
				}
				if(!digit){
					digit=2
				}
				if(typeof( value )=='string'){
					return parseFloat(value);
				}else{
					return value
				}
				
			},
			  
			formatDate(dateStr){
				if(dateStr==null || dateStr==""){
					return "";
				}else{
					return dateStr.substr(0,10);
				}
			}, 
			calcTaskStateByTime(startTime,endTime,actRate,phaseStatus){
				if(startTime==null || startTime=="" || endTime==null || endTime ==""){
					return  {remark:"未配置日期",status:'warning'}
				}
				var curDate=new Date();
				var start=new Date(startTime);
				var end=new Date(endTime);
				if(this.getDaysBetween(curDate, start)<=0){
					return {remark:this.toFixed(this.getDaysBetween(start,curDate))+"天后开始",status:'primary'};
				}else if( this.getDaysBetween(curDate, start) > 0 &&  this.getDaysBetween(curDate, end) <= 0 ){
					return {remark: this.toFixed(this.getDaysBetween(end, curDate))+"天后结束",status:'primary'};
				}else if( this.getDaysBetween(curDate, end) > 0 ){
					return {remark:"逾期"+( this.toFixed(this.getDaysBetween(curDate, end)) )+"天",status:'danger'};
				}
			},
			/**
			 * 计算两个日期之间的天数
			 * @param dateString1  开始日期 yyyy-MM-dd
			 * @param dateString2  结束日期 yyyy-MM-dd 
			 */
			getDaysBetween(startDate,endDate){  
				if (startDate==endDate){
					return 0;
				}
				var days=(startDate - endDate )/(1*24*60*60*1000);
				return  days;
			},
			getSummariesForBatchEdit:function(params){
				const { columns, data } = params;
				const sums = [];
				sums[0]=''
				sums[1]='总计'//名字
				sums[2]=''//进度
				sums[3]=''//开始结束时间
				sums[4]=''// 工期 工作量 成本金额
 
				var workload=this.phaseBudgetData.phaseBudgetInnerUserWorkload+this.phaseBudgetData.phaseBudgetOutUserWorkload
				var cost=this.phaseBudgetData.phaseBudgetNouserAt+this.phaseBudgetData.phaseBudgetInnerUserAt+this.phaseBudgetData.phaseBudgetOutUserAt
				sums[4]='工作量:'+workload.toFixed(0)+'人时,预算金额:'+cost.toFixed(0)+'元,'+(cost/10000).toFixed(2)+'万元'
				return sums;
			},
			getSummariesForNoBatchEdit:function(params){
				const { columns, data } = params;
				const sums = [];
				sums[0]=''
				sums[1]=''//
				sums[2]='总计'//名字
				sums[3]=''//时间
				sums[4]=''//进度
				sums[5]=''//工作量 计划、实际
				sums[6]=''// 成本 计划、实际 
				var budgetWorkload=this.phaseBudgetData.phaseBudgetInnerUserWorkload+this.phaseBudgetData.phaseBudgetOutUserWorkload
				
				var phaseActWorkload=this.phaseBudgetData.phaseActWorkload 
				var budgetCost=this.phaseBudgetData.phaseBudgetNouserAt+this.phaseBudgetData.phaseBudgetInnerUserAt+this.phaseBudgetData.phaseBudgetOutUserAt
				var actCost=this.phaseBudgetData.actInnerUserAt+this.phaseBudgetData.actNouserAt+this.phaseBudgetData.actOutUserAt
				sums[5]='预算工作量:'+budgetWorkload+'人时,实际:'+phaseActWorkload+'人时' 
				sums[6]='预算金额:'+budgetCost.toFixed(0)+'元,'+(budgetCost/10000).toFixed(2)+'万元,实际:'+actCost.toFixed(0)+'元,'+(actCost/10000).toFixed(2)+'万元'

				return sums;
			},
			toFixed(floatValue,xsd){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					if(xsd){
						if(typeof(floatValue)=='number'){
							return floatValue.toFixed(xsd)
						}else{
							
							return parseFloat(floatValue).toFixed(xsd);
						}
					}else{
						if(typeof(floatValue)=='number'){
							return floatValue.toFixed(0)
						}else{
							
							return parseFloat(floatValue).toFixed(0);
						}
					}
					
				}
			},
			showLog(row){
				this.editForm=row
				this.xmRecordVisible=true
      }, 
      // 判断前后两个数据是否存在同一回路里面
      // dict 为字典；sId拖拽到menuId; ePmeuId 是放置位置的祖先 menuId;
      judgePmenuId(dict, sId, ePmeuId) {
        if (sId === ePmeuId) {
          return true;
        } else if (dict[ePmeuId]) {
          return this.judgePmenuId(dict, sId, dict[ePmeuId]);
        } else {
          return false;
        }
      },
      changePmenuId(sId, eId) {
        let dict = {};
        this.xmProjectPhases.forEach(d => {
          dict[d.id] = d.parentPhaseId || '';
        });
        if (!dict[eId]) {
          this.xmProjectPhases.find(d => {
            if (d.id === sId) {
              d.parentPhaseId = eId;
              console.log('更新关系1');
              this.fieldChange(d,'parentPhaseId',true);
            }
          })
        } else {
          const isSynezesis = this.judgePmenuId(dict, sId, dict[eId]);
          if (!isSynezesis) {
            this.xmProjectPhases.find(d => {
              if (d.id === sId) {
                d.parentPhaseId = eId;
                console.log('更新关系2');
                this.fieldChange(d,'parentPhaseId',true);
              }
            })
          } else {
            console.log('形成闭合回路--拖拽不更新');
            
          }
        }
			}, 
			/**end 自定义函数请在上面加**/ 
			formateOption:function(itemCode,value){
				if(this.options[itemCode]){
					var options=this.options[itemCode].filter(i=>i.optionValue==value);
					if(options && options.length > 0){
						return options[0].optionName
					}else{
						return value;
					}
				}else{
					return value
				} 
			}, 
			  
		},//end methods
		components: {  
			
         //在下面添加其它组件
		},
		mounted() { 
       
			this.$nextTick(() => {
				var clientRect=this.$refs.selectPhaseTable.$el.getBoundingClientRect();
				var subHeight=70/1000 * window.innerHeight; 
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.selectPhaseTable.$el.offsetTop-subHeight; 
				if(this.selProject){
					this.getXmProjectPhases();
				}
				
				listOption([
					{categoryId:'all',itemCode:'xmPhaseStatus'} 
				]).then(res=>{
					this.options=res.data.data;
				})
      		}); 
		}
	}

</script>

<style lang="scss" scoped> 
</style>