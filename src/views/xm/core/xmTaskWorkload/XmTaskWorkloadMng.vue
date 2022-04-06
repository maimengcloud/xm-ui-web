<template>
	<section class="page-container border padding">
		<el-row>
      <xm-project-select style="display:inline;" ref="xmProjectSelect" :auto-select="false"  @row-click="onProjectConfirm" @clear="clearProject"></xm-project-select>
      <el-select v-if="wstatuses && wstatuses.toString()=='0,2'" v-model="filters.wstatus" clearable @change="searchXmTaskWorkloads" placeholder="请选择工时单状态">
        <el-option label="全部状态" value=""></el-option>
        <el-option label="待确认" value="0"></el-option>
        <el-option label="无效" value="2"></el-option>
      </el-select>

      <el-select v-if="sstatuses && sstatuses.toString()!='1'" v-model="filters.sstatus" clearable @change="searchXmTaskWorkloads" placeholder="请选择工时单状态">
        <el-option label="全部结算状态" value=""></el-option>
        <el-option label="无需结算" value="0"></el-option>
        <el-option label="已提交" value="2"></el-option>
        <el-option label="已通过" value="3"></el-option>
        <el-option label="已结算" value="4"></el-option>
      </el-select>
			<el-input v-model="filters.key" style="width: 25%;" clearable placeholder="模糊查询:员工ID/员工名称/项目ID/任务编号"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTaskWorkloads" icon="el-icon-search">查询</el-button>
      <el-popover placement="top-start" title="更多查询条件" width="400" v-model="moreVisible" trigger="manual" >
        <el-row>
          <el-col :span="24"  style="padding-top:5px;">
            <span class="more-label-font">创建时间:</span>
            <el-date-picker v-model="dateRanger" type="daterange" align="right" unlink-panels range-separator="至"
                            start-placeholder="开始日期" end-placeholder="完成日期" value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions"></el-date-picker>
          </el-col>
          <el-col  :span="24"  style="padding-top:10px;">
            <span class="more-label-font">创建人:</span>
            <el-tag v-if="filters.pmUser" closable @click="selectFiltersPmUser" @close="clearFiltersPmUser()">{{filters.pmUser.username}}</el-tag>
            <el-button   v-else @click="selectFiltersPmUser()">选择</el-button>
            <el-button    @click="setFiltersPmUserAsMySelf()">我的</el-button>
          </el-col>
          <el-col  :span="24"  style="padding-top:10px;">
            <el-button type="text"  @click="moreVisible=false" >关闭</el-button><el-button type="primary"  @click="searchXmTaskWorkloads" >查询</el-button>
          </el-col>
        </el-row>
        <el-button slot="reference" @click="moreVisible=!moreVisible" icon="el-icon-more"></el-button>
      </el-popover>
<!--			<el-button type="primary" @click="showAdd" icon="el-icon-plus"> </el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>-->
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmTaskWorkload 工时登记表-->
			<el-table ref="xmTaskWorkloadTable" :data="xmTaskWorkloads" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row
                v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userid" label="员工编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="username" label="姓名" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="wstatuses && (wstatuses.toString()=='1')" prop="wstatus" label="工时状态" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.wstatus=='0'">待确认</el-tag>
            <el-tag type="success" v-else-if="scope.row.wstatus=='1'">已确认</el-tag>
            <el-tag type="danger" v-else-if="scope.row.wstatus=='2'">无效</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="wstatuses && (wstatuses.toString()=='0,2')" prop="wstatus" label="工时状态" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="cell-text">
              <el-button style="display:block;" :type="item.className" plain round v-for="(item,index) in [formatterStatusDicts(scope.row.wstatus)]" :key="index">{{item.name}}</el-button>
            </div>
            <span class="cell-bar">
              <el-select  v-model="scope.row.wstatus" placeholder="状态"  style="display:block;"  @change="editXmTaskWorkloadSomeFields(scope.row,'sstatus',$event)">
                <el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.wstatus" :key="index"></el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
				<el-table-column prop="workload" label="工时" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.workload}}h
          </template>
        </el-table-column>
				<el-table-column prop="amt" label="工时金额" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.amt">¥{{scope.row.amt}}</span>
            <span v-else>¥0</span>
          </template>
        </el-table-column>
				<el-table-column prop="samt" label="结算金额" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.samt">¥{{ scope.row.samt}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column v-if="sstatuses && sstatuses=='1'" prop="toSbill" label="结算单" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="cell-bar">
              <xm-task-sbill-select style="display:inline;" :auto-select="false"  :project-id="scope.row.projectId"    placeholder="结算"  @row-click="editXmWorkloadSomeFields(scope.row,$event)"></xm-task-sbill-select>
						</span>
          </template>
        </el-table-column>
         <el-table-column prop="projectId" label="归属项目" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="ctime" label="创建日期" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.ctime.substring(0,10)}}</span>
          </template>
        </el-table-column> 
				<el-table-column prop="taskId" label="任务编号" min-width="80" show-overflow-tooltip></el-table-column>
<!--				<el-table-column prop="cuserid" label="创建人编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bizDate" label="业务日期yyyy-MM-dd" min-width="80" show-overflow-tooltip></el-table-column>-->
				<el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.remark">{{scope.row.remark}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
<!--				<el-table-column prop="ttype" label="任务类型-关联字典taskType" min-width="80" show-overflow-tooltip></el-table-column>-->
<!--				<el-table-column prop="sbillId" label="结算单据编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="stime" label="结算提交时间" min-width="80" show-overflow-tooltip></el-table-column>-->
<!--				<el-table-column prop="rworkload" label="剩余工时（同一天取最后日期更新到task表rworkload中）" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cusername" label="创建人姓名" min-width="80" show-overflow-tooltip></el-table-column>-->

<!--				<el-table-column label="操作" width="180" fixed="right">
					<template scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>-->
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 XmTaskWorkload 工时登记表界面-->
			<el-drawer title="编辑工时登记表" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-task-workload-edit op-type="edit" :xm-task-workload="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-task-workload-edit>
			</el-drawer>

			<!--新增 XmTaskWorkload 工时登记表界面-->
			<el-drawer title="新增工时登记表" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-task-workload-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-task-workload-edit>
			</el-drawer>
      <el-drawer title="选择员工" :visible.sync="selectFiltersPmUserVisible" size="60%" append-to-body>
        <users-select  @confirm="onFiltersPmUserSelected" ref="usersSelect"></users-select>
      </el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listXmTaskWorkload, delXmTaskWorkload, batchDelXmTaskWorkload } from '@/api/xm/core/xmTaskWorkload';
	import  XmTaskWorkloadEdit from './XmTaskWorkloadEdit';//新增修改界面
	import { mapGetters } from 'vuex'
  import XmProjectSelect from "../components/XmProjectSelect";
  import XmTaskSbillSelect from "./XmTaskSbillSelect";
  import {editWorkloadToSbill} from "@/api/xm/core/xmTaskWorkload";
  import {editXmWorkloadWstatus} from "../../../../api/xm/core/xmTaskWorkload";
  import UsersSelect from "@/views/mdp/sys/user/UsersSelect";

	export default {
	    name:'xmTaskWorkloadMng',
		components: {
		    XmTaskWorkloadEdit,
      XmProjectSelect,
      XmTaskSbillSelect,
      UsersSelect
		},
		props:['visible','wstatuses','sstatuses'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
      visible:{
        handler:function(o,n){
          if(n==true){
            this.initData();
            this.searchXmTaskWorkloads()
          }
        },
        immediate: true
      },
		},
		data() {
      const beginDate = new Date();
      const endDate = new Date();
      beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					key: '',
          wstatus:'',
          sstatus:'',
          pmUser:''
				},
				xmTaskWorkloads: [],//查询结果
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
          wstatus:[{id:'0',name:'待确认'},{id:'1',name: '已确认'},{id:'2',name:'无效'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmTaskWorkload界面是否显示
				addForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:'',rworkload:'',cusername:'',projectId:''
				},

				editFormVisible: false,//编辑界面是否显示
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:'',rworkload:'',cusername:'',projectId:''
				},
				maxTableHeight:300,
        selProject:'',
        moreVisible:false,
        pickerOptions:  util.pickerOptions('datarange'),
        dateRanger: [],
        selectFiltersPmUserVisible:false,
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmTaskWorkloads();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmTaskWorkloads();
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
				this.getXmTaskWorkloads();
			},
			searchXmTaskWorkloads(){
				 this.pageInfo.count=true;
				 this.getXmTaskWorkloads();
			},
			//获取列表 XmTaskWorkload 工时登记表
			getXmTaskWorkloads() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key){
					params.key= "%" + this.filters.key + "%"
				}
        if(this.selProject){
          params.projectId= this.selProject;
        }
        if(this.sstatuses){
          params.sstatuses=this.sstatuses.join();
        }
        if(this.wstatuses){
          params.wstatuses=this.wstatuses.join();
        }
        if(this.filters.wstatus){
          params.wstatuses = this.filters.wstatus;
        }
        if(this.filters.sstatus){
          params.sstatuses = this.filters.sstatus;
        }
        if(this.filters.pmUser){
          params.cuserid = this.filters.pmUser.userid;
        }
        if(this.dateRanger){
          params.startTime = this.dateRanger[0];
          params.endTime = this.dateRanger[1];
        }

				this.load.list = true;
				listXmTaskWorkload(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmTaskWorkloads = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmTaskWorkload 工时登记表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmTaskWorkload 工时登记表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmTaskWorkloads();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmTaskWorkload
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmTaskWorkload
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = {  id:row.id };
					delXmTaskWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmTaskWorkloads();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmTaskWorkload
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
					batchDelXmTaskWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmTaskWorkloads();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
			    this.editForm=row
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
      initData: function(){

      },
      onProjectConfirm(obj){
			  this.selProject = obj.projectId;
			  this.getXmTaskWorkloads();
      },
      clearProject(){
			  this.selProject = null;
        this.getXmTaskWorkloads();
      },
      editXmWorkloadSomeFields(workload,row,fieldName,$event){
			  if(row.status!='0'){
          this.$notify.error({position:'bottom-left',showClose:true,message:'该结算单已提交，请重新选择',type:'warning'})
          return;
        }
        let params={
          projectId:row.projectId
        };
        if(this.sels.length>0){
          if(!this.sels.some(k=>k.projectId==row.projectId)){
            this.$notify({position:'bottom-left',showClose:true,message:'存在不同项目的工时单，请重新选择',type:'warning'})
            return;
          }
          params.ids=this.sels.map(i=>i.id);
        }else{
          params.ids = [workload.id];
        }
        params.sbillId = row.id;

        editWorkloadToSbill(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            this.getXmTaskWorkloads();
          }else{
            this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
          }
        })
      },
      formatterStatusDicts: function(cellValue){
        let key="wstatus";
        if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
          return {id:cellValue,name:cellValue,className:'primary'};
        }
        let list=this.dicts[key].filter(i=>i.id==cellValue)
        if(list.length>0){
          let data= {...list[0],className:'primary'}
          if(data.id=='1'){
            data.className='success'
          }else if(data.id=='2'){
            data.className='info'
          }else{
            data.className='danger'
          }
          return data;
        }else{
          return {id:cellValue,name:cellValue,className:'primary'}
        }

      },
      editXmTaskWorkloadSomeFields(row,fieldName,$event){
        let params={ids:[row.id]};
        if(this.sels.length>0){
          if(!this.sels.some(k=>k.id==row.id)){
            this.$notify({position:'bottom-left',showClose:true,message:'请操作选中的行或者取消选中的行再操作其它行',type:'warning'})
            return;
          }
          params.ids=this.sels.map(i=>i.id)
        }else{
          params.ids = [row.id]
        }
        if(fieldName!=='sstatus') {
          this.$notify.error("不支持当前选项");
          return;
        }else{
          params.wstatus = row.wstatus;
        }

        editXmWorkloadWstatus(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            this.getXmTaskWorkloads();
          }else{
            this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
          }
        })
      },
      clearFiltersPmUser:function(){
        this.filters.pmUser=null;
        this.searchXmTaskWorkloads();
      },
      selectFiltersPmUser(){
        this.selectFiltersPmUserVisible=true;
      },
      onFiltersPmUserSelected(users){
        if(users && users.length>0){
          this.filters.pmUser=users[0]
        }else{
          this.filters.pmUser=null;
        }
        this.selectFiltersPmUserVisible=false;
        this.searchXmTaskWorkloads();
      },
      setFiltersPmUserAsMySelf(){
        this.filters.pmUser=this.userInfo;
        this.searchXmTaskWorkloads();
      },
    },//end methods
		mounted() {
			this.$nextTick(() => {
			    //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
			    this.initData()
				  this.searchXmTaskWorkloads();
          this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTaskWorkloadTable.$el)

      });
		},
    activated(){
      this.initData();
      this.searchXmTaskWorkloads();
    }
	}

</script>

<style scoped>
</style>
