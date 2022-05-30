<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchMoOrders" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 MoOrder mo_order-->
			<el-table ref="moOrderTable" :data="moOrders" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				    <span class="cell-text">  {{scope.row.username}}}  </span>
				    <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>
				-->
				<el-table-column prop="id" label="订单编号" min-width="150" show-overflow-tooltip  fixed="left"></el-table-column> 
				<el-table-column prop="obranchName" label="下单机构名称" min-width="150" show-overflow-tooltip fixed="left">
				    <template slot-scope="scope">
				        <span> {{scope.row.obranchName}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="status" label="订单状态" min-width="120" show-overflow-tooltip fixed="left">
				    <template slot-scope="scope">
                        <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'mo_order_status',scope.row.status)" :key="index" :type="item.className">{{item.name}}</el-tag> 
                    </template>
				</el-table-column>  
				<el-table-column prop="payType" label="支付方式" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'tpAppPayType',scope.row.payType)" :key="index" :type="item.className">{{item.name}}</el-tag> 
                    </template>
				</el-table-column>  
				<el-table-column prop="ooper" label="操作类型" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'mo_ooper',scope.row.ooper)" :key="index" :type="item.className">{{item.name}}</el-tag> 
                    </template>
				</el-table-column>
				<el-table-column prop="odays" label="购买天数" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.odays}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ousers" label="购买人数" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ousers}} </span>
                    </template>
				</el-table-column> 
				<el-table-column prop="moOrginFee" label="折扣前总价" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span>￥ {{scope.row.moOrginFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ofinalFee" label="最终订单价格" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span>￥ {{scope.row.ofinalFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="othFee" label="其它费用" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span>￥ {{scope.row.othFee}} </span>
                    </template>
				</el-table-column>  
				<el-table-column prop="payAt" label="最终付款金额" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span>￥ {{scope.row.payAt}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="odisRate" label="订单折扣率" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.odisRate}} %</span>
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
				<el-table-column prop="omodules" label="购买模块数" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.omodules}} </span>
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
				<el-table-column prop="prepayId" label="付款订单号（第三方返回）" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.prepayId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="topenId" label="第三方账号编号" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.topenId}} </span>
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
				<el-table-column prop="ousername" label="下单用户名称" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ousername}} </span>
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
			<!--编辑 MoOrder mo_order界面-->
			<el-dialog title="订单详情" :visible.sync="editFormVisible"  width="80%" top="20px"  append-to-body   :close-on-click-modal="false">
			    <mo-order-edit op-type="edit" :mo-order="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></mo-order-edit>
			</el-dialog>

			<!--新增 MoOrder mo_order界面-->
			<el-drawer title="创建订单" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
			    <mo-order-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></mo-order-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listMoOrder, delMoOrder, batchDelMoOrder,editSomeFieldsMoOrder } from '@/api/mdp/mo/moOrder';
import  MoOrderEdit from './MoOrderEdit';//新增修改界面
import { mapGetters } from 'vuex'

export default {
    name:'moOrderMng',
    components: {
        MoOrderEdit,
    },
    props:['visible','isMyBranch'],
    computed: {
        ...mapGetters(['userInfo']),

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData();
                this.searchMoOrders()
            }
        }
    },
    data() {
        return {
            filters: {
                key: ''
            },
            moOrders: [],//查询结果
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
                'mo_order_status':[],'tpAppPayType':[],'mo_ooper':[]
                //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
            },//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
            addFormVisible: false,//新增moOrder界面是否显示
            addForm: {
                id:'',name:'',obranchId:'',ouserid:'',ousername:'',moFinalFee:'',status:'',sstatus:'',ctime:'',payTime:'',payCtime:'',moOrginFee:'',ousers:'',ocates:'',omodules:'',poid:'',startTime:'',endTime:'',payType:'',payId:'',prepayId:'',topenId:'',pbankId:'',pbankName:'',pbankCardNo:'',pbankUsername:'',remark:'',finishTime:'',closeTime:'',setTime:'',odays:'',ofinalFee:'',odisRate:'',othFee:'',otype:'',osource:'',memType:'',atype:'',saleUserid:'',saleUsername:'',custPhone:'',custAddress:'',payAt:'',obranchName:'',ooper:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                id:'',name:'',obranchId:'',ouserid:'',ousername:'',moFinalFee:'',status:'',sstatus:'',ctime:'',payTime:'',payCtime:'',moOrginFee:'',ousers:'',ocates:'',omodules:'',poid:'',startTime:'',endTime:'',payType:'',payId:'',prepayId:'',topenId:'',pbankId:'',pbankName:'',pbankCardNo:'',pbankUsername:'',remark:'',finishTime:'',closeTime:'',setTime:'',odays:'',ofinalFee:'',odisRate:'',othFee:'',otype:'',osource:'',memType:'',atype:'',saleUserid:'',saleUsername:'',custPhone:'',custAddress:'',payAt:'',obranchName:'',ooper:''
            },
            maxTableHeight:300,
        }
    },//end data
    methods: {

        ...util,

        handleSizeChange(pageSize) {
            this.pageInfo.pageSize=pageSize;
            this.getMoOrders();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getMoOrders();
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
            this.getMoOrders();
        },
        searchMoOrders(){
             this.pageInfo.count=true;
             this.getMoOrders();
        },
        //获取列表 MoOrder mo_order
        getMoOrders() {
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
            if(this.isMyBranch){
                params.obranchId=this.userInfo.branchId
            }

            this.load.list = true;
            listMoOrder(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.count=false;
                    this.moOrders = res.data.data;
                }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        },

        //显示编辑界面 MoOrder mo_order
        showEdit: function ( row,index ) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 MoOrder mo_order
        showAdd: function () {
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        afterAddSubmit(){
            this.addFormVisible=false;
            this.pageInfo.count=true;
            this.getMoOrders();
        },
        afterEditSubmit(){
            this.editFormVisible=false;
        },
        //选择行moOrder
        selsChange: function (sels) {
            this.sels = sels;
        },
        //删除moOrder
        handleDel: function (row,index) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                let params = {  id:row.id };
                delMoOrder(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchMoOrders();
                    }
                    this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err  => this.load.del=false );
            });
        },
        //批量删除moOrder
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
                batchDelMoOrder(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){
                        this.searchMoOrders();
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
        var func = editSomeFieldsMoOrder
        func(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            if(this.sels.length>0){
                this.searchMoOrders();
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
            this.searchMoOrders();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.moOrderTable.$el)

        });
    }
}

</script>

<style scoped>
</style>