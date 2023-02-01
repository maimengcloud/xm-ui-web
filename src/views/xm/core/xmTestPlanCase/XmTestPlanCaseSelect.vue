<template>
	<section>
        <el-row> 
            <el-col :span="6" v-if="!xmTestCase||!xmTestCase.id">
                <xm-func-select   class="padding-right padding-left" :xm-product="xmProductCpd" @row-click="onXmFuncRowClick"> 
                </xm-func-select>
            </el-col>
            <el-col :span="(xmTestCase&&xmTestCase.id)?24:18">
                <el-row>
                    <el-input v-model="filters.key" style="width:20%;" placeholder="模糊查询"  clearable></el-input>
                     <mdp-select-dict style="width:20%;" placeholder="用例状态" clearable :dict="dicts['testCaseStatus']" v-model="filters.caseStatus" effect="dark"></mdp-select-dict> 
                    <mdp-select-dict style="width:20%;" placeholder="执行结果" clearable :dict="dicts['testStepTcode']" v-model="filters.execStatus" effect="dark"></mdp-select-dict> 

                    <el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTestPlanCases" icon="el-icon-search">查询</el-button> 
                </el-row>
                <el-row>
                    <!--列表 XmTestPlanCase 测试计划与用例关系表-->
                    <el-table ref="xmTestPlanCaseTable" :data="xmTestPlanCases" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
                         <!--
                        <el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
                            <span class="cell-text">  {{scope.row.username}}}  </span>
                            <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
                        </el-table-column>
                        -->       
                        
              
                        <el-table-column prop="caseName" label="用例名称" min-width="250"> 
                            <template slot-scope="scope"> 
                                <span :title="'归属测试计划'+scope.row.planId">{{ scope.row.caseName }}</span>
                             </template>
                        </el-table-column>	
                        <el-table-column prop="planId" label="测试计划" width="150" sortable> 
                        </el-table-column>	        
                        <el-table-column prop="caseStatus" label="用例状态" width="100" show-overflow-tooltip>
                            <template slot-scope="scope"> 
                                <mdp-select-dict-tag :dict="dicts['testCaseStatus']" v-model="scope.row.caseStatus" effect="dark" :disabled="true"></mdp-select-dict-tag> 
                            </template>
                        </el-table-column>    
                        
                        <el-table-column prop="execStatus" label="执行结果" width="100" show-overflow-tooltip>
                            <template slot-scope="scope"> 
                                <mdp-select-dict-tag :dict="dicts['testStepTcode']" v-model="scope.row.execStatus" effect="dark" :disabled="true"></mdp-select-dict-tag> 
                            </template>
                        </el-table-column>
                        <el-table-column prop="execUsername" label="执行人姓名" min-width="120" >
                            <template slot-scope="scope">  
                                <mdp-select-user-xm  userid-key="execUserid" username-key="execUsername" v-model="scope.row" :disabled="true"> 
                                </mdp-select-user-xm>
                            </template>
                        </el-table-column>
                        <el-table-column prop="priority" label="优先级" width="120" >
                            <template slot-scope="scope">
                                <mdp-select-dict-tag :dict="dicts['priority']" v-model="scope.row.priority" :disabled="true"></mdp-select-dict-tag>  
                            </template>
                        </el-table-column>
                        <el-table-column  label="操作" width="100" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="$emit('select',scope.row)">选择</el-button>
                            </template>
                        </el-table-column>   
                    </el-table>
                    <el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
                </el-row>
            </el-col>
        </el-row> 
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listXmTestPlanCase, delXmTestPlanCase, batchDelXmTestPlanCase,editSomeFieldsXmTestPlanCase,importFromTestCase } from '@/api/xm/core/xmTestPlanCase';
  import  XmFuncSelect from '../xmFunc/XmFuncSelect';//新增修改界面
import  MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm';//修改界面
import { mapGetters } from 'vuex'

export default {
    name:'xmTestPlanCaseSelect',
    components: {
        XmFuncSelect,MdpSelectUserXm,
    },
    props:['visible','xmTestPlan','xmTestCasedb','xmTestCase','xmProduct','select','xmProject'],
    computed: {
        ...mapGetters(['userInfo']),
        xmProductCpd(){ 
            if(this.xmProduct&& this.xmProduct.id){
                return this.xmProduct
            }
            if(this.xmTestCasedb && this.xmTestCasedb.id){
                return {id:this.xmTestCasedb.productId,productName:this.xmTestCasedb.productName}
            }
            if(this.xmTestPlan && this.xmTestPlan.id){
                return {id:this.xmTestPlan.productId,productName:this.xmTestPlan.productName}
            }
            if(this.xmTestCase && this.xmTestCase.id){
                return {id:this.xmTestCase.productId,productName:this.xmTestCase.productName}
            }
            return null
        }

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData();
                this.searchXmTestPlanCases()
            }
        }
    },
    data() {
        return {
            filters: {
                key: '',
                xmFunc:null,
                caseStatus:'',
                execStatus:''


            },
            xmTestPlanCases: [],//查询结果
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
                testCaseStatus:[],
                //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
            },//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
            addFormVisible: false,//新增xmTestPlanCase界面是否显示
            addForm: {
                bugs:'',execUserid:'',caseId:'',ltime:'',ctime:'',execStatus:'',execUsername:'',planId:'',caseName:'',priority:'',remark:'',testStep:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                bugs:'',execUserid:'',caseId:'',ltime:'',ctime:'',execStatus:'',execUsername:'',planId:'',caseName:'',priority:'',remark:'',testStep:''
            },
            maxTableHeight:300,
        }
    },//end data
    methods: {

        ...util,

        handleSizeChange(pageSize) {
            this.pageInfo.pageSize=pageSize;
            this.getXmTestPlanCases();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getXmTestPlanCases();
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
            this.getXmTestPlanCases();
        },
        searchXmTestPlanCases(){
             this.pageInfo.count=true;
             this.getXmTestPlanCases();
        },
        //获取列表 XmTestPlanCase 测试计划与用例关系表
        getXmTestPlanCases() {
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
            if(this.filters.caseStatus){
                params.caseStatus=this.filters.caseStatus
            }
            if(this.filters.execStatus){
                params.execStatus=this.filters.execStatus
            }
            if(this.xmTestCasedb && this.xmTestCasedb.id){
                params.casedbId=this.xmTestCasedb.id
            }
            
            if(this.xmTestCase && this.xmTestCase.id){
                params.caseId=this.xmTestCase.id
            }
            if(this.xmTestPlan && this.xmTestPlan.id){
                params.planId=this.xmTestPlan.id
            }
            if(this.filters.xmFunc && this.filters.xmFunc.id){
                params.funcPidPathsLike=this.filters.xmFunc.pidPaths
            }
            if(this.xmProductCpd && this.xmProductCpd.id){
                params.productId=this.xmProductCpd.id
            }
            if(this.xmProject && this.xmProject.id){
                params.projectId=this.xmProject.id
            }
            params.caseStatus="2"
            this.load.list = true;
            listXmTestPlanCase(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.count=false;
                    this.xmTestPlanCases = res.data.data;
                }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        },

         
        //选择行xmTestPlanCase
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
        onXmFuncRowClick(row){
            this.filters.xmFunc=row
            this.searchXmTestPlanCases();
        },
          
    },//end methods
    mounted() {
        this.$nextTick(() => {
            initDicts(this);
            this.initData()
            this.searchXmTestPlanCases();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTestPlanCaseTable.$el)

        });
    }
}

</script>

<style scoped>
</style>