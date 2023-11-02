<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTaskEvals" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmTaskEval xm_task_eval-->
			<el-table ref="xmTaskEvalTable" :data="xmTaskEvals" height="100px" v-adaptive="{bottomOffset:50}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				    <span class="cell-text">  {{scope.row.username}}}  </span>
				    <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>
				-->
				<el-table-column prop="id" label="评价" min-width="120" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="type" label="评价类型1-雇主对服务商的评价，2-服务商对雇主的评价，3-组长对组员的评价" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.type}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="wspeed" label="工作速度0-5分" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.wspeed}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="wattit" label="工作态度0-5分" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.wattit}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="wquality" label="工作质量0-5分" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.wquality}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="totalStar" label="总体评价0-5分" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.totalStar}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="remark" label="评价内容" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.remark}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="evalUserid" label="评价人编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.evalUserid}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="evalUsername" label="评价人姓名" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.evalUsername}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="toUserid" label="被评价人编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.toUserid}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="toUsername" label="被评价人姓名" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.toUsername}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="evalBranchId" label="评价人归属机构" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.evalBranchId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="toBranchId" label="被评价人归属机构号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.toBranchId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="taskId" label="任务编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.taskId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="evalTime" label="评价时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.evalTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="paySpeed" label="付款及时度0-5分" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.paySpeed}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="coopHappy" label="合作愉快度0-5分" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.coopHappy}} </span>
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
			<!--编辑 XmTaskEval xm_task_eval界面-->
			<el-drawer title="编辑xm_task_eval" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
			    <xm-task-eval-edit op-type="edit" :xm-task-eval="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-task-eval-edit>
			</el-drawer>

			<!--新增 XmTaskEval xm_task_eval界面-->
			<el-drawer title="新增xm_task_eval" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
			    <xm-task-eval-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-task-eval-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listXmTaskEval, delXmTaskEval, batchDelXmTaskEval,editSomeFieldsXmTaskEval } from '@/api/xm/core/xmTaskEval';
import  XmTaskEvalEdit from './XmTaskEvalEdit';//新增修改界面
import { mapGetters } from 'vuex'

export default {
    name:'xmTaskEvalMng',
    components: {
        XmTaskEvalEdit,
    },
    props:['visible'],
    computed: {
        ...mapGetters(['userInfo']),

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData();
                this.searchXmTaskEvals()
            }
        }
    },
    data() {
        return {
            filters: {
                key: ''
            },
            xmTaskEvals: [],//查询结果
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize:10,//每页数据
                count:true,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            load:{ list: false, edit: false, del: false, add: false },//查询中...
            sels: [],//列表选中数据
            dicts:{
                //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
            },//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
            addFormVisible: false,//新增xmTaskEval界面是否显示
            addForm: {
                id:'',type:'',wspeed:'',wattit:'',wquality:'',totalStar:'',remark:'',evalUserid:'',evalUsername:'',toUserid:'',toUsername:'',evalBranchId:'',toBranchId:'',taskId:'',evalTime:'',paySpeed:'',coopHappy:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                id:'',type:'',wspeed:'',wattit:'',wquality:'',totalStar:'',remark:'',evalUserid:'',evalUsername:'',toUserid:'',toUsername:'',evalBranchId:'',toBranchId:'',taskId:'',evalTime:'',paySpeed:'',coopHappy:''
            },
            maxTableHeight:300,
        }
    },//end data
    methods: {

        ...util,

        handleSizeChange(pageSize) {
            this.pageInfo.pageSize=pageSize;
            this.getXmTaskEvals();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getXmTaskEvals();
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
            this.getXmTaskEvals();
        },
        searchXmTaskEvals(){
             this.pageInfo.count=true;
             this.getXmTaskEvals();
        },
        //获取列表 XmTaskEval xm_task_eval
        getXmTaskEvals() {
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
            listXmTaskEval(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.count=false;
                    this.xmTaskEvals = res.data.data;
                }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        },

        //显示编辑界面 XmTaskEval xm_task_eval
        showEdit: function ( row,index ) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 XmTaskEval xm_task_eval
        showAdd: function () {
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        afterAddSubmit(){
            this.addFormVisible=false;
            this.pageInfo.count=true;
            this.getXmTaskEvals();
        },
        afterEditSubmit(){
            this.editFormVisible=false;
        },
        //选择行xmTaskEval
        selsChange: function (sels) {
            this.sels = sels;
        },
        //删除xmTaskEval
        handleDel: function (row,index) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                let params = {  id:row.id };
                delXmTaskEval(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchXmTaskEvals();
                    }
                    this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err  => this.load.del=false );
            });
        },
        //批量删除xmTaskEval
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
                batchDelXmTaskEval(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){
                        this.searchXmTaskEvals();
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
        var func = editSomeFieldsXmTaskEval
        func(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            if(this.sels.length>0){
                this.searchXmTaskEvals();
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
            this.searchXmTaskEvals();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTaskEvalTable.$el)

        });
    }
}

</script>

<style scoped>
</style>
