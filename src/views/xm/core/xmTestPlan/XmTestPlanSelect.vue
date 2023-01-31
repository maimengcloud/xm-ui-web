<template>
    
	<section class="page-container padding" ref="xmTestPlanTable">
        <el-dialog append-to-body modal-append-to-body width="60%" top="20px" :visible.sync="visible"> 
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"  clearable></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTestPlans" icon="el-icon-search">查询</el-button>
 
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmTestPlan 测试计划-->
			<el-table  :data="xmTestPlans" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
 				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				    <span class="cell-text">  {{scope.row.username}}}  </span>
				    <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>
				-->
 				<el-table-column prop="name" label="计划名称" min-width="250" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span>  {{scope.row.name}} </span> 
                    </template>
				</el-table-column>  
				<el-table-column prop="status" label="状态" width="120" show-overflow-tooltip>
				    <template slot-scope="scope"> 
                        <mdp-select-dict-tag :dict="dicts['testPlanStatus']" v-model="scope.row.status" effect="dark" :disabled="true"></mdp-select-dict-tag> 
                   </template>
				</el-table-column> 
				<el-table-column prop="stime" label="开始时间"  width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.stime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="etime" label="结束时间"  width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.etime}} </span>
                    </template>
				</el-table-column> 
				<el-table-column  label="操作"  width="120" fixed="right">
				    <template slot-scope="scope">
				        <el-button type="primary" @click="select(scope.row)">选择</el-button>
                    </template>
				</el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row> 
    </el-dialog>
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listXmTestPlan } from '@/api/xm/core/xmTestPlan'; 
 import { mapGetters } from 'vuex'

export default {
    name:'xmTestPlanSelect',
    components: { 
    },
    props:['casedbId','productId','projectId'],
    computed: {
        ...mapGetters(['userInfo']),

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData();
                this.searchXmTestPlans()
            }
        }
    },
    data() {
        return {
            visible:false,
            filters: {
                key: ''
            },
            xmTestPlans: [],//查询结果
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
                testPlanStatus:[],testPlanTcode:[],testStepTcode:[],priority:[],bizFlowState:[]
                //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
            },//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
            addFormVisible: false,//新增xmTestPlan界面是否显示
            addForm: {
                id:'',name:'',casedbId:'',casedbName:'',projectId:'',projectName:'',cuserid:'',cusername:'',ctime:'',stime:'',etime:'',status:'',tcode:'',totalCases:'',okCases:'',errCases:'',igCases:'',blCases:'',productId:'',productName:'',flowState:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                id:'',name:'',casedbId:'',casedbName:'',projectId:'',projectName:'',cuserid:'',cusername:'',ctime:'',stime:'',etime:'',status:'',tcode:'',totalCases:'',okCases:'',errCases:'',igCases:'',blCases:'',productId:'',productName:'',flowState:''
            },
            maxTableHeight:300,
        }
    },//end data
    methods: {

        ...util,

        handleSizeChange(pageSize) {
            this.pageInfo.pageSize=pageSize;
            this.getXmTestPlans();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getXmTestPlans();
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
            this.getXmTestPlans();
        },
        searchXmTestPlans(){
             this.pageInfo.count=true;
             this.getXmTestPlans();
        },
        //获取列表 XmTestPlan 测试计划
        getXmTestPlans() {
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

            if(this.projectId){
                params.projectId=this.projectId
            }
            if(this.casedbId){
                params.casedbId=this.casedbId
            } 
            if(this.productId){
                params.productId=this.productId
            }
            this.load.list = true;
            listXmTestPlan(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.count=false;
                    this.xmTestPlans = res.data.data;
                }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        },

        
        //选择行xmTestPlan
        selsChange: function (sels) {
            this.sels = sels;
        },
        
        rowClick: function(row, event, column){
            this.editForm=row
            this.editFormBak={...row};
            this.$emit('row-click',row, event, column);//  @row-click="rowClick"
        },
        initData: function(){

        },
         
        open(){
            this.visible=true
        },
        select(row){
            this.$emit("select",row)
            this.visible=false
        }

    },//end methods
    mounted() {
        this.$nextTick(() => {
            initDicts(this);
            this.initData()
            //this.searchXmTestPlans();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTestPlanTable.$el)

        });
    }
}

</script>

<style scoped>
</style>