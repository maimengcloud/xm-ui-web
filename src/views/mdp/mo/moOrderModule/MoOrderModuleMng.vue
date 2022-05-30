<template>
	<section class="page-container border padding">
		<el-row v-if="!moOrder || !moOrder.id">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchMoOrderModules" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 MoOrderModule 订单与模块关系表-->
			<el-table ref="moOrderModuleTable" :data="moOrderModules" :max-height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				    <span class="cell-text">  {{scope.row.username}}}  </span>
				    <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>
				-->
 				<el-table-column prop="name" label="模块名称" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.name}} </span>
                    </template>
				</el-table-column> 
				<el-table-column prop="billMode" label="计费模式" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'moduleBillMode',scope.row.billMode)" :key="index" :type="item.className">{{item.name}}</el-tag>
                    </template>
				</el-table-column>
				<el-table-column prop="uniFee" label="人天费用" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span>￥ {{scope.row.uniFee}} </span>
                    </template>
				</el-table-column> 
				<el-table-column prop="ousers" label="可用人数" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.ousers}} </span>
                    </template>
				</el-table-column>  
				<el-table-column prop="musers" label="计价人数" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.musers}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="days" label="购买天数" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.days}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="orginFee" label="原始金额" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.orginFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="finalFee" label="应付金额" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.finalFee}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="disRate" label="订单折扣率" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.disRate}} %</span>
                    </template>
				</el-table-column>  
                <!--
				<el-table-column label="操作" width="180" fixed="right">
				    <template scope="scope">
				        <el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"  plain></el-button>
				        <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  plain></el-button>
				    </template>
				</el-table-column>
                -->
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 MoOrderModule 订单与模块关系表界面-->
			<el-drawer title="编辑订单与模块关系表" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
			    <mo-order-module-edit op-type="edit" :mo-order-module="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></mo-order-module-edit>
			</el-drawer>

			<!--新增 MoOrderModule 订单与模块关系表界面-->
			<el-drawer title="新增订单与模块关系表" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
			    <mo-order-module-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></mo-order-module-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listMoOrderModule, delMoOrderModule, batchDelMoOrderModule,editSomeFieldsMoOrderModule } from '@/api/mdp/mo/moOrderModule';
import  MoOrderModuleEdit from './MoOrderModuleEdit';//新增修改界面
import { mapGetters } from 'vuex'

export default {
    name:'moOrderModuleMng',
    components: {
        MoOrderModuleEdit,
    },
    props:['visible','moOrder'],
    computed: {
        ...mapGetters(['userInfo']),

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData();
                this.searchMoOrderModules()
            }
        }
    },
    data() {
        return {
            filters: {
                key: ''
            },
            moOrderModules: [],//查询结果
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
            addFormVisible: false,//新增moOrderModule界面是否显示
            addForm: {
                orderId:'',moduleId:'',name:'',fee:'',billMode:'',uniFee:'',discount:'',mcate:'',logoUrl:'',feeDesc:'',udisRate:'',udis:'',musers:'',finalFee:'',days:'',orginFee:'',disRate:'',ucheck:'',ousers:'',ver:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                orderId:'',moduleId:'',name:'',fee:'',billMode:'',uniFee:'',discount:'',mcate:'',logoUrl:'',feeDesc:'',udisRate:'',udis:'',musers:'',finalFee:'',days:'',orginFee:'',disRate:'',ucheck:'',ousers:'',ver:''
            },
            maxTableHeight:300,
        }
    },//end data
    methods: {

        ...util,

        handleSizeChange(pageSize) {
            this.pageInfo.pageSize=pageSize;
            this.getMoOrderModules();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getMoOrderModules();
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
            this.getMoOrderModules();
        },
        searchMoOrderModules(){
             this.pageInfo.count=true;
             this.getMoOrderModules();
        },
        //获取列表 MoOrderModule 订单与模块关系表
        getMoOrderModules() {
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
            if(this.moOrder && this.moOrder.id){
                params.orderId=this.moOrder.id
            }

            this.load.list = true;
            listMoOrderModule(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.count=false;
                    this.moOrderModules = res.data.data;
                }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        },

        //显示编辑界面 MoOrderModule 订单与模块关系表
        showEdit: function ( row,index ) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 MoOrderModule 订单与模块关系表
        showAdd: function () {
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        afterAddSubmit(){
            this.addFormVisible=false;
            this.pageInfo.count=true;
            this.getMoOrderModules();
        },
        afterEditSubmit(){
            this.editFormVisible=false;
        },
        //选择行moOrderModule
        selsChange: function (sels) {
            this.sels = sels;
        },
        //删除moOrderModule
        handleDel: function (row,index) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                let params = {  orderId:row.orderId,  moduleId:row.moduleId };
                delMoOrderModule(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchMoOrderModules();
                    }
                    this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err  => this.load.del=false );
            });
        },
        //批量删除moOrderModule
        batchDel: function () {
            if(this.sels.length<=0){
                return;
            }
            var params=this.sels.map(i=>{
                return { orderId:i.orderId,  moduleId:i.moduleId}
            })
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                batchDelMoOrderModule(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){
                        this.searchMoOrderModules();
                    }
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
                }).catch( err  => this.load.del=false );
            });
        },
      editSomeFields(row,fieldName,$event){
        let params={};
        if(this.sels.length>0){
          if(!this.sels.some(k=> k.orderId==row.orderId &&  k.moduleId==row.moduleId)){
            this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
            Object.assign(this.editForm,this.editFormBak)
            return;
          }
            params['pkList']=this.sels.map(i=>{ return { orderId:i.orderId,  moduleId:i.moduleId}})
        }else{
            params['pkList']=[row].map(i=>{ return { orderId:i.orderId,  moduleId:i.moduleId}})
        }
        params[fieldName]=$event
        var func = editSomeFieldsMoOrderModule
        func(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            if(this.sels.length>0){
                this.searchMoOrderModules();
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
            this.searchMoOrderModules();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.moOrderModuleTable.$el)

        });
    }
}

</script>

<style scoped>
</style>