<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchGuardOrders" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 GuardOrder 购买服务保障订单表-->
			<el-table ref="guardOrderTable" :data="guardOrders" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				    <span class="cell-text">  {{scope.row.username}}}  </span>
				    <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>
				-->
				<el-table-column prop="id" label="订单编号" min-width="120" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="name" label="订单名称" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.name}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="obranchId" label="下单机构号码" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.obranchId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ouserid" label="下单用户编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ouserid}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ousername" label="下单用户名称" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ousername}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="finalFee" label="价格=orign_fee*odis_rate" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.finalFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="status" label="订单状态0-初始，1-待确认，2-待付款，3-已付款，4-已完成，5-已取消-未付款前可取消，取消后可删除，6-退单-退单后变为已取消，8已关闭-售后完成后可以关闭订单" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.status}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="sstatus" label="结算状态0-待结算，1-已结算" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.sstatus}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ctime" label="创建时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ctime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payTime" label="付款时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payCtime" label="付款确认时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payCtime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="orginFee" label="折扣前总价=sys_guard中价格" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.orginFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="poid" label="上级订单-如果是续费订单，记录原订单号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.poid}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="startTime" label="启用日期" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.startTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="endTime" label="结束日期" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.endTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payType" label="支付方式1-微信，2-支付宝，3-线下支付" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payType}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payId" label="付款流水号(内部生成，传给第三方原样传回，如果不正确，不允许更新数据库，防止作弊)" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="prepayId" label="预下单付款订单号（第三方返回）" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.prepayId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="topenId" label="第三方账号编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.topenId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="pbankId" label="收款银行编号(支付方式为3时必填)" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.pbankId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="pbankName" label="收款银行名称(支付方式为3时必填)" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.pbankName}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="pbankCardNo" label="收款银行卡号(支付方式为3时必填)" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.pbankCardNo}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="pbankUsername" label="收款账户姓名(支付方式为3时必填)" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.pbankUsername}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.remark}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="finishTime" label="完成时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.finishTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="closeTime" label="关闭时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.closeTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="setTime" label="结算时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.setTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ofinalFee" label="最终订单价格、最终付款金额=final_fee+oth_fee" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ofinalFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="odisRate" label="订单折扣率(下单后后台根据不同客户进行折扣调整)=将在模块表中执行折扣操作，再从新合计价格" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.odisRate}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="othFee" label="其它费用" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.othFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="otype" label="订单类型0-电商商城商品，1-应用模块使用购买，2-vip购买会员，3-购买服务保障" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.otype}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="osource" label="订单来源1-前端客户下单，2-后台待客下单" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.osource}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="memType" label="客户类型-参考sys_user表mem_type" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.memType}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="atype" label="账户类型-根据sys_user表atype" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.atype}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="saleUserid" label="销售经理编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.saleUserid}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="saleUsername" label="销售经理名称" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.saleUsername}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="custPhone" label="客户联系电话" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.custPhone}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="custAddress" label="客户联系地址" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.custAddress}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="payAt" label="最终付款金额-客户付款后回填" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.payAt}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="obranchName" label="下单机构名称" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.obranchName}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ooper" label="订单操作类型1-新购，2-续费" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ooper}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="tranId" label="第三方付款事务号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.tranId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="invoice" label="是否已开票" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.invoice}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="invoiceTime" label="开票时间" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.invoiceTime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="invoiceId" label="发票编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.invoiceId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="guardId" label="服务保障编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.guardId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="guardName" label="服务保障名称" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.guardName}} </span>
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
			<!--编辑 GuardOrder 购买服务保障订单表界面-->
			<el-drawer title="编辑购买服务保障订单表" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
			    <guard-order-edit op-type="edit" :guard-order="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></guard-order-edit>
			</el-drawer>

			<!--新增 GuardOrder 购买服务保障订单表界面-->
			<el-drawer title="新增购买服务保障订单表" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
			    <guard-order-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></guard-order-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import { listGuardOrder, delGuardOrder, batchDelGuardOrder,editSomeFieldsGuardOrder } from '@/api/mdp/sys/guardOrder';
import  GuardOrderEdit from './GuardOrderEdit';//新增修改界面
import { mapGetters } from 'vuex'

export default {
    name:'guardOrderMng',
    components: {
        GuardOrderEdit,
    },
    props:['visible'],
    computed: {
        ...mapGetters(['userInfo']),

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData();
                this.searchGuardOrders()
            }
        }
    },
    data() {
        return {
            filters: {
                key: ''
            },
            guardOrders: [],//查询结果
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
            addFormVisible: false,//新增guardOrder界面是否显示
            addForm: {
                id:'',name:'',obranchId:'',ouserid:'',ousername:'',finalFee:'',status:'',sstatus:'',ctime:'',payTime:'',payCtime:'',orginFee:'',poid:'',startTime:'',endTime:'',payType:'',payId:'',prepayId:'',topenId:'',pbankId:'',pbankName:'',pbankCardNo:'',pbankUsername:'',remark:'',finishTime:'',closeTime:'',setTime:'',ofinalFee:'',odisRate:'',othFee:'',otype:'',osource:'',memType:'',atype:'',saleUserid:'',saleUsername:'',custPhone:'',custAddress:'',payAt:'',obranchName:'',ooper:'',tranId:'',invoice:'',invoiceTime:'',invoiceId:'',guardId:'',guardName:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                id:'',name:'',obranchId:'',ouserid:'',ousername:'',finalFee:'',status:'',sstatus:'',ctime:'',payTime:'',payCtime:'',orginFee:'',poid:'',startTime:'',endTime:'',payType:'',payId:'',prepayId:'',topenId:'',pbankId:'',pbankName:'',pbankCardNo:'',pbankUsername:'',remark:'',finishTime:'',closeTime:'',setTime:'',ofinalFee:'',odisRate:'',othFee:'',otype:'',osource:'',memType:'',atype:'',saleUserid:'',saleUsername:'',custPhone:'',custAddress:'',payAt:'',obranchName:'',ooper:'',tranId:'',invoice:'',invoiceTime:'',invoiceId:'',guardId:'',guardName:''
            },
            maxTableHeight:300,
        }
    },//end data
    methods: {

        ...util,

        handleSizeChange(pageSize) {
            this.pageInfo.pageSize=pageSize;
            this.getGuardOrders();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getGuardOrders();
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
            this.getGuardOrders();
        },
        searchGuardOrders(){
             this.pageInfo.count=true;
             this.getGuardOrders();
        },
        //获取列表 GuardOrder 购买服务保障订单表
        getGuardOrders() {
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
            listGuardOrder(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.count=false;
                    this.guardOrders = res.data.data;
                }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        },

        //显示编辑界面 GuardOrder 购买服务保障订单表
        showEdit: function ( row,index ) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 GuardOrder 购买服务保障订单表
        showAdd: function () {
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        afterAddSubmit(){
            this.addFormVisible=false;
            this.pageInfo.count=true;
            this.getGuardOrders();
        },
        afterEditSubmit(){
            this.editFormVisible=false;
        },
        //选择行guardOrder
        selsChange: function (sels) {
            this.sels = sels;
        },
        //删除guardOrder
        handleDel: function (row,index) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                let params = {  id:row.id };
                delGuardOrder(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchGuardOrders();
                    }
                    this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err  => this.load.del=false );
            });
        },
        //批量删除guardOrder
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
                batchDelGuardOrder(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){
                        this.searchGuardOrders();
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
        var func = editSomeFieldsGuardOrder
        func(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            if(this.sels.length>0){
                this.searchGuardOrders();
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
            
            this.initData()
            this.searchGuardOrders();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.guardOrderTable.$el)

        });
    }
}

</script>

<style scoped>
</style>