<template>
	<section>
        <el-row>
            
            <el-col :span="6">
                <xm-func-select v-if="xmTestCasedb && xmTestCasedb.productId" class="padding-right padding-left" :xm-product="{id:xmTestCasedb.productId,productName:xmTestCasedb.productName}" @row-click="onXmFuncRowClick"> 
                </xm-func-select>
            </el-col>
            <el-col :span="18">
                <el-row>
                    <el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
                    <el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTestPlanCases" icon="el-icon-search">查询</el-button>
                    <span style="float:right;">
                        <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
                        <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
                    </span>
                </el-row>
                <el-row>
                    <!--列表 XmTestPlanCase 测试计划与用例关系表-->
                    <el-table ref="xmTestPlanCaseTable" :data="xmTestPlanCases" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
                        <el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
                        <!--
                        <el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
                            <span class="cell-text">  {{scope.row.username}}}  </span>
                            <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
                        </el-table-column>
                        -->
                        <el-table-column prop="caseId" label="用例编号" width="120" show-overflow-tooltip  fixed="left"></el-table-column>	 
                        
                        <el-table-column prop="execStatus" label="执行结果" width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                
                                <el-tag class="cell-text" v-for="(item,index) in formatDictsWithClass(dicts,'testStepTcode',scope.row.execStatus)" :key="index" :type="item.className">{{item.name}}</el-tag>
                                <el-select class="cell-bar" v-model="scope.row.execStatus" @change="editSomeFields(scope.row,'execStatus',$event)">
                                    <el-option v-for="(item,index) in dicts['testStepTcode']" :key="index" :value="item.id" :label="item.name"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="caseName" label="用例名称" min-width="250" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span> <el-link @click="showEdit( scope.row,scope.$index)">{{scope.row.caseName}} </el-link></span>
                                <span class="tool-bar">
                                    <el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit" circle plain size="mini"></el-button> 
                                </span>
                            </template>
                        </el-table-column>	 
                        <el-table-column prop="execUsername" label="执行人姓名" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span> {{scope.row.execUsername}} </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="priority" label="优先级" width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-tag class="cell-text" v-for="(item,index) in formatDictsWithClass(dicts,'priority',scope.row.execStatus)" :key="index" :type="item.className">{{item.name}}</el-tag>
                                <el-select class="cell-bar" v-model="scope.row.priority" @change="editSomeFields(scope.row,'priority',$event)">
                                    <el-option v-for="(item,index) in dicts['priority']" :key="index" :value="item.id" :label="item.name"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="执行备注" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span> {{scope.row.remark}} </span>
                            </template>
                        </el-table-column>  
                    </el-table>
                    <el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
                </el-row>
            </el-col>
        </el-row>
		<el-row>
			<!--编辑 XmTestPlanCase 测试计划与用例关系表界面-->
			<el-dialog title="测试执行" :visible.sync="editFormVisible"    width="90%" top="20px"  append-to-body   :close-on-click-modal="false">
			    <xm-test-plan-case-edit op-type="edit" :xm-test-plan-case="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" @edit-fields="onEditFields"></xm-test-plan-case-edit>
			</el-dialog>

			<!--新增 XmTestPlanCase 测试计划与用例关系表界面-->
			<el-dialog title="选择测试用例" :visible.sync="addFormVisible"  width="80%" top="20px" append-to-body  :close-on-click-modal="false">
			    <xm-test-case-select :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb" :visible="addFormVisible" @cancel="addFormVisible=false" @select="onXmTestCaseSelect"></xm-test-case-select>
			</el-dialog>
	    </el-row>
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listXmTestPlanCase, delXmTestPlanCase, batchDelXmTestPlanCase,editSomeFieldsXmTestPlanCase,importFromTestCase } from '@/api/xm/core/xmTestPlanCase';
import  XmTestPlanCaseEdit from './XmTestPlanCaseEdit';//新增修改界面
import  XmTestCaseSelect from '../xmTestCase/XmTestCaseSelect';//新增修改界面 
import  XmFuncSelect from '../xmFunc/XmFuncSelect';//新增修改界面
import { mapGetters } from 'vuex'

export default {
    name:'xmTestPlanCaseMng',
    components: {
        XmTestPlanCaseEdit,XmTestCaseSelect,XmFuncSelect,
    },
    props:['visible','xmTestPlan','xmTestCasedb'],
    computed: {
        ...mapGetters(['userInfo']),

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
            },
            xmTestPlanCases: [],//查询结果
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
            if(this.xmTestCasedb && this.xmTestCasedb.id){
                params.casedbId=this.xmTestCasedb.id
            }
            if(this.xmTestPlan && this.xmTestPlan.id){
                params.planId=this.xmTestPlan.id
            }
            if(this.filters.xmFunc && this.filters.xmFunc.id){
                params.funcPidPathsLike=this.filters.xmFunc.pidPaths
            }

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

        //显示编辑界面 XmTestPlanCase 测试计划与用例关系表
        showEdit: function ( row,index ) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 XmTestPlanCase 测试计划与用例关系表
        showAdd: function () {
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        afterAddSubmit(){
            this.addFormVisible=false;
            this.pageInfo.count=true;
            this.getXmTestPlanCases();
        },
        afterEditSubmit(){
            this.editFormVisible=false;
        },
        //选择行xmTestPlanCase
        selsChange: function (sels) {
            this.sels = sels;
        },
        //删除xmTestPlanCase
        handleDel: function (row,index) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                let params = {  caseId:row.caseId,  planId:row.planId };
                delXmTestPlanCase(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchXmTestPlanCases();
                    }
                    this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err  => this.load.del=false );
            });
        },
        //批量删除xmTestPlanCase
        batchDel: function () {
            if(this.sels.length<=0){
                return;
            }
            var params=this.sels.map(i=>{
                return { caseId:i.caseId,  planId:i.planId}
            })
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                batchDelXmTestPlanCase(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){
                        this.searchXmTestPlanCases();
                    }
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
                }).catch( err  => this.load.del=false );
            });
        },
      editSomeFields(row,fieldName,$event){
        let params={};
        if(this.sels.length>0){
          if(!this.sels.some(k=> k.caseId==row.caseId &&  k.planId==row.planId)){
            this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
            Object.assign(this.editForm,this.editFormBak)
            return;
          }
            params['pkList']=this.sels.map(i=>{ return { caseId:i.caseId,  planId:i.planId}})
        }else{
            params['pkList']=[row].map(i=>{ return { caseId:i.caseId,  planId:i.planId}})
        }
        params[fieldName]=$event
        var func = editSomeFieldsXmTestPlanCase
        func(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            if(this.sels.length>0){
                this.searchXmTestPlanCases();
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
        onXmTestCaseSelect(cases){
            if(cases==null || cases.length<=0){
                this.$notify({position:'bottom-left',showClose:true,message:"请至少选择一条用例进行导入",type:'error'})
                return;

            }
            this.addFormVisible=false;
            importFromTestCase({planId:this.xmTestPlan.id,caseIds:cases.map(i=>i.id)}).then(res=>{
                this.searchXmTestPlanCases();
            })
        } ,
        onXmFuncRowClick(row){
            this.filters.xmFunc=row
            this.searchXmTestPlanCases();
        },
        onEditFields(row){
            Object.assign(this.editForm,row)
            this.editFormBak={...this.editForm} 
            if(row.execStatus && row.next){
                var index=this.xmTestPlanCases.findIndex(k=>k.caseId==this.editForm.caseId) 
                if(index==this.xmTestPlanCases.length-1){
                    this.editFormVisible=false;
                    this.$notify({position:'bottom-left',showClose:true,message:"已是最后一条数据",type:'error'})
                    return;
                }
                this.editForm=this.xmTestPlanCases[index+1]
                this.$refs.xmTestPlanCaseTable.setCurrentRow(this.editForm)
                this.editFormBak={...this.editForm}
            }
        }
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