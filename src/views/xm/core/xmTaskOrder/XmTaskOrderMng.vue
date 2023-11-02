<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTaskOrders" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmTaskOrder 任务相关费用订单表-->
			<el-table ref="xmTaskOrderTable" :data="xmTaskOrders" v-adaptive="{bottomOffset:30}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				    <span class="cell-text">  {{scope.row.username}}}  </span>
				    <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>
				-->
				<el-table-column prop="id" label="订单编号" min-width="120" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="ouserid" label="下单用户编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ouserid}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="obranchId" label="公司ID-下单客户对应的企业" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.obranchId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ostatus" label="订单状态0-初始，1-待确认，2-待付款，3-已付款，4-已完成，5-已取消-未付款前可取消，取消后可删除，6-退单-退单后变为已取消，8已关闭-售后完成后可以关闭订单" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ostatus}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ctime" label="创建时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ctime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ltime" label="更新时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ltime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payType" label="支付方式1微信2支付宝" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payType}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payStatus" label="支付状态0待付款，1已付款" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payStatus}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payTime" label="支付时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="prepayId" label="第三方支付订单编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.prepayId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="finalFee" label="最终总费用=origin_fee" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.finalFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="othFee" label="其它费用" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.othFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="originFee" label="原始价格=top_fee+urgent_fee+crm_sup_fee+hot_fee+efunds+share_fee" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.originFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payAt" label="最终付款金额-客户付款后回填" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payAt}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payAuthId" label="支付授权码" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payAuthId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payOpenid" label="支付账户对应的第三方openid,注意，下单根付款不一定是同一个人" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payOpenid}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payUserid" label="付款用户编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payUserid}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payUsername" label="付款用户名称" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payUsername}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="discount" label="折扣率0-199" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.discount}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="topFee" label="置顶费用" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.topFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="topStime" label="置顶开始时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.topStime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="topEtime" label="置顶结束时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.topEtime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="hotFee" label="热搜费用" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.hotFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="hotStime" label="热搜开始时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.hotStime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="hotEtime" label="热搜结束时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.hotEtime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="top" label="是否置顶0否1待付款2已开通3已过期" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.top}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="hot" label="是否热搜0否1待付款2已开通3已过期" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.hot}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="crmSupFee" label="客服包办费用" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.crmSupFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="urgentFee" label="加急费用" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.urgentFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="urgent" label="是否加急0否1待付款2已开通3已过期" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.urgent}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="crmSup" label="是否客服包办0否1待付款2已开通3已过期" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.crmSup}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="efunds" label="托管金额" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.efunds}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="estate" label="资金托管状况0-无须托管，1-待付款，2-已托管资金，3-已付款给服务商，4-已退款" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.estate}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="etoPlatTime" label="托管资金付款给平台的时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.etoPlatTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="etoDevTime" label="托管资金支付给服务商的时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.etoDevTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ebackTime" label="托管资金退回甲方时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ebackTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="taskId" label="任务编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.taskId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="topDays" label="置顶天数" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.topDays}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="hotDays" label="热搜天数" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.hotDays}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="urgentDays" label="加急天数" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.urgentDays}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="urgentStime" label="加急开始时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.urgentStime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="urgentEtime" label="加急结束时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.urgentEtime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="calcStatus" label="定时检查日期是否已过期，已过期则取消任务中的置顶、加急、热搜状态计算状态0-无须计算，1-本周期已计算待下周期计算，2-结束" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.calcStatus}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="calcTime" label="计算时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.calcTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="oshare" label="是否开启分享赚0否1待付款2已开通3已过期" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.oshare}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="shareFee" label="分享赚佣金" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.shareFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payId" label="付款流水号(内部生成，传给第三方原样传回，如果不正确，不允许更新数据库，防止作弊)" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="tranId" label="第三方付款事务号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.tranId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="remark" label="订单备注" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.remark}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="name" label="订单名称" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.name}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="bizType" label="订单业务类型1-保证金，2-营销推广活动" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.bizType}} </span>
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
			<!--编辑 XmTaskOrder 任务相关费用订单表界面-->
			<el-drawer title="编辑任务相关费用订单表" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
			    <xm-task-order-edit op-type="edit" :xm-task-order="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-task-order-edit>
			</el-drawer>

			<!--新增 XmTaskOrder 任务相关费用订单表界面-->
			<el-drawer title="新增任务相关费用订单表" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
			    <xm-task-order-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-task-order-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listXmTaskOrder, delXmTaskOrder, batchDelXmTaskOrder,editSomeFieldsXmTaskOrder } from '@/api/xm/core/xmTaskOrder';
import  XmTaskOrderEdit from './XmTaskOrderEdit';//新增修改界面
import { mapGetters } from 'vuex'

export default {
    name:'xmTaskOrderMng',
    components: {
        XmTaskOrderEdit,
    },
    props:['visible'],
    computed: {
        ...mapGetters(['userInfo']),

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData();
                this.searchXmTaskOrders()
            }
        }
    },
    data() {
        return {
            filters: {
                key: ''
            },
            xmTaskOrders: [],//查询结果
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
            addFormVisible: false,//新增xmTaskOrder界面是否显示
            addForm: {
                ouserid:'',obranchId:'',ostatus:'',ctime:'',ltime:'',payType:'',payStatus:'',payTime:'',prepayId:'',id:'',finalFee:'',othFee:'',originFee:'',payAt:'',payAuthId:'',payOpenid:'',payUserid:'',payUsername:'',discount:'',topFee:'',topStime:'',topEtime:'',hotFee:'',hotStime:'',hotEtime:'',top:'',hot:'',crmSupFee:'',urgentFee:'',urgent:'',crmSup:'',efunds:'',estate:'',etoPlatTime:'',etoDevTime:'',ebackTime:'',taskId:'',topDays:'',hotDays:'',urgentDays:'',urgentStime:'',urgentEtime:'',calcStatus:'',calcTime:'',oshare:'',shareFee:'',payId:'',tranId:'',remark:'',name:'',bizType:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                ouserid:'',obranchId:'',ostatus:'',ctime:'',ltime:'',payType:'',payStatus:'',payTime:'',prepayId:'',id:'',finalFee:'',othFee:'',originFee:'',payAt:'',payAuthId:'',payOpenid:'',payUserid:'',payUsername:'',discount:'',topFee:'',topStime:'',topEtime:'',hotFee:'',hotStime:'',hotEtime:'',top:'',hot:'',crmSupFee:'',urgentFee:'',urgent:'',crmSup:'',efunds:'',estate:'',etoPlatTime:'',etoDevTime:'',ebackTime:'',taskId:'',topDays:'',hotDays:'',urgentDays:'',urgentStime:'',urgentEtime:'',calcStatus:'',calcTime:'',oshare:'',shareFee:'',payId:'',tranId:'',remark:'',name:'',bizType:''
            },
            maxTableHeight:300,
        }
    },//end data
    methods: {

        ...util,

        handleSizeChange(pageSize) {
            this.pageInfo.pageSize=pageSize;
            this.getXmTaskOrders();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getXmTaskOrders();
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
            this.getXmTaskOrders();
        },
        searchXmTaskOrders(){
             this.pageInfo.count=true;
             this.getXmTaskOrders();
        },
        //获取列表 XmTaskOrder 任务相关费用订单表
        getXmTaskOrders() {
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
            listXmTaskOrder(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.count=false;
                    this.xmTaskOrders = res.data.data;
                }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        },

        //显示编辑界面 XmTaskOrder 任务相关费用订单表
        showEdit: function ( row,index ) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 XmTaskOrder 任务相关费用订单表
        showAdd: function () {
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        afterAddSubmit(){
            this.addFormVisible=false;
            this.pageInfo.count=true;
            this.getXmTaskOrders();
        },
        afterEditSubmit(){
            this.editFormVisible=false;
        },
        //选择行xmTaskOrder
        selsChange: function (sels) {
            this.sels = sels;
        },
        //删除xmTaskOrder
        handleDel: function (row,index) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                let params = {  id:row.id };
                delXmTaskOrder(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchXmTaskOrders();
                    }
                    this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err  => this.load.del=false );
            });
        },
        //批量删除xmTaskOrder
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
                batchDelXmTaskOrder(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){
                        this.searchXmTaskOrders();
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
        var func = editSomeFieldsXmTaskOrder
        func(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            if(this.sels.length>0){
                this.searchXmTaskOrders();
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
            this.searchXmTaskOrders();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTaskOrderTable.$el)

        });
    }
}

</script>

<style scoped>
</style>
