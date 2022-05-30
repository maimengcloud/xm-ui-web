<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchBranchInterestss" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 BranchInterests 机构权益关联表-->
			<el-table ref="branchInterestsTable" :data="branchInterestss" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				     <span class="cell-text">  {{scope.row.username}}}  </span>
                     <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>
				-->
				<el-table-column prop="branchId" label="公司ID" min-width="80" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="ilvlId" label="等级ID" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.ilvlId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ilvlName" label="等级名称" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.ilvlName}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="idesc" label="等级描述" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.idesc}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ilevel" label="1-粉丝,2-" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.ilevel}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="discount" label="权益，折扣" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.discount}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="istatus" label="等级状态" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.istatus}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ctime" label="创建时间" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.ctime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ltime" label="更新时间" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.ltime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="picUrl" label="等级图标url" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.picUrl}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="isFree" label="是否付费获取权益" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.isFree}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="rtimeRule" label="续会时间叠加规则：1.有效期日期后叠加续会时间" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.rtimeRule}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="rtimeType" label="续会时间类型：1.天数" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.rtimeType}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="rtime" label="下次续会时间yyyy-MM-dd型" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.rtime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="itype" label="权益分类" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.itype}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="shopId" label="商户编号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.shopId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="instId" label="当前流程实例编号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.instId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="flowState" label="当前流程状态，0初始1审批中2审批通过3审批不通过4流程取消或者删除" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.flowState}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="smaxAt" label="单个任务最大金额（任务型用户才有）0代表不限制" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.smaxAt}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="totalAt" label="累计接单金额（任务型用户才有）0代表不限制" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.totalAt}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="mtype" label="适用会员类型（2商户型、1普通型、3任务型）" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.mtype}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="totalExp" label="累计经验值0代表不限制" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.totalExp}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="smaxExp" label="单个任务最大经验值0代表不限制" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.smaxExp}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="bids" label="投标次数上限" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.bids}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="sfeeRate" label="服务费率0-100之间" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.sfeeRate}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="idBak" label="覆盖上一条的等级编号，即变成当前等级之前的等级编号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.idBak}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="currTotalExp" label="累计完成工作量" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.currTotalExp}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="currBids" label="当前月份投标次数（每月最后一天清零）" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.currBids}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="currTotalAt" label="当前累计完成金额" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.currTotalAt}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="currTotalBids" label="累计投标总数" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.currTotalBids}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="mfee" label="月均费用" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.mfee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="maxUsers" label="最大人员数" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.maxUsers}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="currUsers" label="当前人员数" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.currUsers}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="maxRtime" label="产品模块下次续费截止时间yyyy-MM-dd类型" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.maxRtime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="mver" label="产品版本0个人版1企业版" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.mver}} </span>
                    </template>
				</el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"  plain></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  plain></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 BranchInterests 机构权益关联表界面-->
			<el-drawer title="编辑机构权益关联表" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <branch-interests-edit op-type="edit" :branch-interests="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></branch-interests-edit>
			</el-drawer>

			<!--新增 BranchInterests 机构权益关联表界面-->
			<el-drawer title="新增机构权益关联表" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<branch-interests-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></branch-interests-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
 	import { initDicts,listBranchInterests, delBranchInterests, batchDelBranchInterests,editSomeFieldsBranchInterests } from '@/api/mdp/sys/branchInterests';
	import  BranchInterestsEdit from './BranchInterestsEdit';//新增修改界面
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'branchInterestsMng',
		components: {
		    BranchInterestsEdit,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchBranchInterestss()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				branchInterestss: [],//查询结果
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
				addFormVisible: false,//新增branchInterests界面是否显示
				addForm: {
					branchId:'',ilvlId:'',ilvlName:'',idesc:'',ilevel:'',discount:'',istatus:'',ctime:'',ltime:'',picUrl:'',isFree:'',rtimeRule:'',rtimeType:'',rtime:'',itype:'',shopId:'',instId:'',flowState:'',smaxAt:'',totalAt:'',mtype:'',totalExp:'',smaxExp:'',bids:'',sfeeRate:'',idBak:'',currTotalExp:'',currBids:'',currTotalAt:'',currTotalBids:'',mfee:'',maxUsers:'',currUsers:'',maxRtime:'',mver:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					branchId:'',ilvlId:'',ilvlName:'',idesc:'',ilevel:'',discount:'',istatus:'',ctime:'',ltime:'',picUrl:'',isFree:'',rtimeRule:'',rtimeType:'',rtime:'',itype:'',shopId:'',instId:'',flowState:'',smaxAt:'',totalAt:'',mtype:'',totalExp:'',smaxExp:'',bids:'',sfeeRate:'',idBak:'',currTotalExp:'',currBids:'',currTotalAt:'',currTotalBids:'',mfee:'',maxUsers:'',currUsers:'',maxRtime:'',mver:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: {

		    ...util,

			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getBranchInterestss();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getBranchInterestss();
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
				this.getBranchInterestss();
			},
			searchBranchInterestss(){
				 this.pageInfo.count=true; 
				 this.getBranchInterestss();
			},
			//获取列表 BranchInterests 机构权益关联表
			getBranchInterestss() {
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

				this.load.list = true;
				listBranchInterests(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.branchInterestss = res.data.data;
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 BranchInterests 机构权益关联表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 BranchInterests 机构权益关联表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getBranchInterestss();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行branchInterests
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除branchInterests
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = {  branchId:row.branchId };
					delBranchInterests(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.searchBranchInterestss();
						}
						this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除branchInterests
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { branchId:i.branchId}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelBranchInterests(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.searchBranchInterestss();
						}
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
          editSomeFields(row,fieldName,$event){
            let params={};
            if(this.sels.length>0){
              if(!this.sels.some(k=> k.branchId==row.branchId)){
                this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
                Object.assign(this.editForm,this.editFormBak)
                return;
              }
                params['branchIds']=this.sels.map(i=>i.branchId)
            }else{
                params['branchIds']=[row].map(i=>i.branchId)
            }
            params[fieldName]=$event
            var func = editSomeFieldsBranchInterests
            func(params).then(res=>{
              let tips = res.data.tips;
              if(tips.isOk){
                if(this.sels.length>0){
                    this.searchBranchInterestss();
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
				this.searchBranchInterestss();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.branchInterestsTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>