<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTaskSbillDetails" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmTaskSbillDetail 工时登记表-->
			<el-table ref="xmTaskSbillDetailTable" :data="xmTaskSbillDetails" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				     <span class="cell-text">  {{scope.row.username}}}  </span>
                     <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>
				--> 
				<el-table-column prop="username" label="姓名" min-width="120" show-overflow-tooltip fixed="left">
                    <template slot-scope="scope"> 
						<span class="cell-text">
							{{scope.row.username}}
						</span>
						<span class="cell-bar">
							<el-popover :title="'【'+scope.row.username+'】在本任务的所有工时记录'" fixed="left">
							<xm-task-workload-simple-list :visible="scope.row.id==editForm.id" :userid="scope.row.userid" :xm-task="{id:scope.row.taskId,name:scope.row.taskName,projectName:scope.row.projectName,projectId:scope.row.projectId,budgetWorkload:scope.row.budgetWorkload,actWorkload:scope.row.actWorkload}"  ref="xmTaskWorkloadSimpleList1" @edit-some-fields="searchXmTaskSbillDetails"></xm-task-workload-simple-list>
							<el-button slot="reference" icon="el-icon-search" style="display:inline;">所有工时记录</el-button>
							</el-popover>
						</span>
                    </template>
				</el-table-column> 
				<el-table-column prop="taskName" label="任务" min-width="120" show-overflow-tooltip fixed="left">
                    <template slot-scope="scope">  
						<span class="cell-text">
						{{scope.row.taskName}}
						</span>
						<span class="cell-bar">
						<el-popover title="当前任务所有工时记录">
							<xm-task-workload-simple-list :visible="scope.row.id==editForm.id" :xm-task="{id:scope.row.taskId,name:scope.row.taskName,projectName:scope.row.projectName,projectId:scope.row.projectId,budgetWorkload:scope.row.budgetWorkload,actWorkload:scope.row.actWorkload}"  ref="xmTaskWorkloadSimpleList2"  @edit-some-fields="searchXmTaskSbillDetails"></xm-task-workload-simple-list>
							<el-button slot="reference" icon="el-icon-search" style="display:inline;">所有工时记录</el-button>
						</el-popover>
               
						</span>
                    </template>
				</el-table-column> 
				<el-table-column label="结算信息">    
					<el-table-column  prop="sstatus" label="结算状态" width="120" show-overflow-tooltip  sortable>
						<template slot-scope="scope">
							<div class="cell-text">
								<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'sstatus',scope.row.sstatus)" :key="index" :type="item.className">{{item.name}}</el-tag> 
							</div>
							<span class="cell-bar">
								<el-select  v-model="scope.row.sstatus" placeholder="结算状态"  style="display:block;"  @change="editSomeFields(scope.row,'sstatus',$event)">
									<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.sstatus" :key="index"></el-option>
								</el-select>
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="sschemel" label="结算方案" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope"> 
								<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'xmTaskSettleSchemel',scope.row.sschemel)" :key="index" :type="item.className">{{item.name}}</el-tag> 
							 
						</template>
					</el-table-column>
					<el-table-column prop="uniPrice" label="工时单价" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">
							<span> ￥ {{scope.row.uniPrice}}&nbsp;元 &nbsp;/ &nbsp;h </span>
						</template>
					</el-table-column>
					<el-table-column prop="budgetAt" label="预算金额" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">
							<span> ￥ {{scope.row.budgetAt}}元 </span>
						</template>
					</el-table-column>
					<el-table-column prop="quoteAt" label="报价金额" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">
							<span> ￥ {{scope.row.quoteAt}}元 </span>
						</template>
					</el-table-column>
					<el-table-column prop="tactAt" label="已结金额" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">  
							￥ {{scope.row.tactAt}}元   
 						</template>
					</el-table-column>  
					<el-table-column prop="sfee" label="服务费" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">  
							￥ {{scope.row.sfee}}元   
 						</template>
					</el-table-column>  
					<el-table-column prop="shareFee" label="分享赚费用" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">  
							￥ {{scope.row.sfee}}元   
 						</template>
					</el-table-column>  
					<el-table-column prop="othFee" label="其它费用" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope"> 
						 	<span class="cell-text">  ￥ {{scope.row.othFee}} 元 </span>
                     		<span class="cell-bar"><el-input style="display:inline;" type="number" v-model="scope.row.othFee" placeholder="" @change="editSomeFields(scope.row,'othFee',$event)"></el-input></span>
						</template>
					</el-table-column>
					<el-table-column prop="samt" label="结算金额" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">
							  ￥ {{scope.row.samt}}元   
						</template>
					</el-table-column>
					<el-table-column prop="bizMonth" label="月份" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">
							<span> {{scope.row.bizMonth}} </span>
						</template>
					</el-table-column>
					<el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope"><span class="cell-text">  {{scope.row.remark}}  </span>
                     		<span class="cell-bar"><el-input type="textarea" style="display:inline;" v-model="scope.row.remark" placeholder="" @change="editSomeFields(scope.row,'remark',$event)"></el-input></span>
 						</template>
					</el-table-column>  
				</el-table-column>
				<el-table-column label="任务信息">
					<el-table-column  prop="taskState" label="任务状态" width="120" show-overflow-tooltip  sortable >
						<template slot-scope="scope"> 
							<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'taskState',scope.row.taskState)" :key="index" :type="item.className">{{item.name}}</el-tag>
						</template>
					</el-table-column>   
					<el-table-column prop="initWorkload" label="初始工时" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">
							<span> {{scope.row.initWorkload}} </span>
						</template>
					</el-table-column>
					<el-table-column prop="budgetWorkload" label="预算工时" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">
							<span> {{scope.row.budgetWorkload}} </span>
						</template>
					</el-table-column>
					<el-table-column prop="workload" label="登记工时" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">
							<span> {{scope.row.workload}} </span>
						</template>
					</el-table-column> 
					<el-table-column prop="budgetAt" label="预算金额" min-width="120" show-overflow-tooltip>
						<template slot-scope="scope">
							<span> ￥  {{scope.row.budgetAt}}元 </span>
						</template>
					</el-table-column>
				</el-table-column> 
				<el-table-column label="报价信息">
				<el-table-column prop="quoteAt" label="报价金额" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>  ￥ {{scope.row.quoteAt}}元 </span>
                    </template>
				</el-table-column>
				<el-table-column prop="quoteWorkload" label="报价工时" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.quoteWorkload}} </span>
                    </template>
				</el-table-column>
				
				<el-table-column prop="qendTime" label="结束时间" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.qendTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="qstartTime" label="开始时间" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.qstartTime}} </span>
                    </template>
				</el-table-column>
				</el-table-column>
				<el-table-column prop="actEndTime" label="实际完工时间" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.actEndTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="actStartTime" label="实际开始时间" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.actStartTime}} </span>
                    </template>
				</el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 XmTaskSbillDetail 工时登记表界面-->
			<el-drawer title="编辑工时登记表" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-task-sbill-detail-edit op-type="edit" :xm-task-sbill-detail="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-task-sbill-detail-edit>
			</el-drawer>

			<!--新增 XmTaskSbillDetail 工时登记表界面-->
			<el-drawer title="新增工时登记表" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-task-sbill-detail-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-task-sbill-detail-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
 	import { initDicts,listXmTaskSbillDetail, delXmTaskSbillDetail, batchDelXmTaskSbillDetail,editSomeFieldsXmTaskSbillDetail } from '@/api/xm/core/xmTaskSbillDetail';
	import  XmTaskSbillDetailEdit from './XmTaskSbillDetailEdit';//新增修改界面
	import { mapGetters } from 'vuex'
  	import XmTaskWorkloadSimpleList from '../xmTaskWorkload/XmTaskWorkloadSimpleList';
	
	export default {
	    name:'xmTaskSbillDetailMng',
		components: {
		    XmTaskSbillDetailEdit,XmTaskWorkloadSimpleList,
		},
		props:['visible','branchId','userid','bizMonth','projectId'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchXmTaskSbillDetails()
                }
            }, 
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmTaskSbillDetails: [],//查询结果
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
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmTaskSbillDetail界面是否显示
				addForm: {
					userid:'',username:'',ctime:'',taskId:'',bizDate:'',remark:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:'',projectId:'',sworkload:'',bizMonth:'',budgetAt:'',budgetWorkload:'',initWorkload:'',quoteAt:'',quoteWorkload:'',sschemel:'',uniPrice:'',qendTime:'',qstartTime:'',actEndTime:'',actStartTime:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',bizDate:'',remark:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:'',projectId:'',sworkload:'',bizMonth:'',budgetAt:'',budgetWorkload:'',initWorkload:'',quoteAt:'',quoteWorkload:'',sschemel:'',uniPrice:'',qendTime:'',qstartTime:'',actEndTime:'',actStartTime:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: {

		    ...util,

			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmTaskSbillDetails();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmTaskSbillDetails();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=[];
					this.pageInfo.orderDirs=[]; 
				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}
					 
					this.pageInfo.orderFields=[util.toLine(obj.prop)]; 
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmTaskSbillDetails();
			},
			searchXmTaskSbillDetails(){
				 this.pageInfo.count=true; 
				 this.getXmTaskSbillDetails();
			},
			//获取列表 XmTaskSbillDetail 工时登记表
			getXmTaskSbillDetails() {
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
					params.key=this.filters.key
				}

				if(this.branchId){
					params.branchId=this.branchId
				}

				if(this.userid){
					params.userid=this.userid
				}

				if(this.projectId){
					params.projectId=this.projectId
				} 

				if(this.bizMonth){
					params.bizMonth=this.bizMonth
				} 
				 
				this.load.list = true;
				listXmTaskSbillDetail(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmTaskSbillDetails = res.data.data;
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmTaskSbillDetail 工时登记表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmTaskSbillDetail 工时登记表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmTaskSbillDetails();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmTaskSbillDetail
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmTaskSbillDetail
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = {  id:row.id };
					delXmTaskSbillDetail(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.searchXmTaskSbillDetails();
						}
						this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmTaskSbillDetail
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { id:i.id}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmTaskSbillDetail(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.searchXmTaskSbillDetails();
						}
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
          editSomeFields(row,fieldName,$event){
            let params={};
            if(this.sels.length>0){
              if(!this.sels.some(k=> k.id==row.id)){
                this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
                Object.assign(this.editForm,this.editFormBak)
                return;
              }
                params['ids']=this.sels.map(i=>i.id)
            }else{
                params['ids']=[row].map(i=>i.id)
            }
            params[fieldName]=$event
			if(fieldName==='sschemel'){
				if(this.sels.length>1){
					 this.$notify({position:'bottom-left',showClose:true,message:'该数据不允许批量修改，请不要选择数据,直接编辑即可',type:'warning'})
					 Object.assign(this.editForm,this.editFormBak)
					 return;
				}
				//1|按工期延迟比率打折 2|按报价结算不打折 3|按工期提前或者延迟进行奖罚
				if("1"==$event){
					if(!row.quoteAt){
						params['samt']=row.budgetAt
					}else{ 
						params['samt']=row.quoteAt
					}
				}else if("2"==$event){
					if(!row.quoteAt){
						params['samt']=row.budgetAt
					}else{ 
						params['samt']=row.quoteAt
					}
				}else if("3"==$event){
					if(!row.quoteAt){
						params['samt']=row.budgetAt
					}else{ 
						params['samt']=row.quoteAt
					}
				}
				
			}
            var func = editSomeFieldsXmTaskSbillDetail
            func(params).then(res=>{
              let tips = res.data.tips;
              if(tips.isOk){
                if(this.sels.length>0){
                    this.searchXmTaskSbillDetails();
                }
                this.editFormBak=[...this.editForm]
              }else{
                Object.assign(this.editForm,this.editFormBak)
                this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
              }
            }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
          },
			rowClick: function(row, event, column){
			    this.editForm=row
			    this.editFormBak={...row};
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },
			
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    initDicts(this);
			    this.initData()
				this.searchXmTaskSbillDetails();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTaskSbillDetailTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>