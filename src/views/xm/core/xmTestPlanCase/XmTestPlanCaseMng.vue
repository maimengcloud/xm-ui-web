<template>
	<section>
        <el-row :gutter="10">
            <el-col :span="6" v-if="!xmTestCase||!xmTestCase.id">
                <xm-func-select v-if="xmProductCpd && xmProductCpd.id" :xm-product="xmProductCpd" @row-click="onXmFuncRowClick">
                </xm-func-select>
            </el-col>
            <el-col :span="!xmTestCase||!xmTestCase.id?18:24">
                <el-row>
                    <el-input v-model="filters.key" style="width: 15%;" placeholder="模糊查询"  clearable></el-input>
                    <mdp-select style="width:15%;" placeholder="用例状态" clearable item-code="testCaseStatus" v-model="filters.caseStatus" effect="dark"></mdp-select>
                    <mdp-select placeholder="测试方式" style="width:15%;" clearable item-code="testType" v-model="filters.testType" effect="dark"></mdp-select>

                    <mdp-select style="width:15%;" placeholder="执行结果" clearable item-code="testStepTcode" v-model="filters.execStatus" effect="dark"></mdp-select>

                    <el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTestPlanCases" icon="el-icon-search">查询</el-button>
                    <span style="float:right;" v-if="!xmTestCase||!xmTestCase.id">
                        <el-button type="primary" @click="batchExec" icon="el-icon-video-play">批量执行</el-button>
                        <el-button type="primary" @click="showAdd" icon="el-icon-plus">将用例纳入计划</el-button>
                        <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
                    </span>
                </el-row>
                <el-row class="padding-top">
                    <!--列表 XmTestPlanCase 测试计划与用例关系表-->
                    <el-table ref="xmTestPlanCaseTable" :data="xmTestPlanCases" v-adaptive="{bottomOffset:30}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
                        <el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
                        <!--
                        <el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
                            <span class="cell-text">  {{scope.row.username}}}  </span>
                            <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
                        </el-table-column>
                        -->
                        <el-table-column prop="caseName" label="用例名称" min-width="250">
                            <template slot-scope="scope">
                                <span> <el-link @click="showEdit( scope.row,scope.$index)">{{scope.row.caseName}} </el-link></span>
                                <span class="tool-bar">
                                    <el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit" circle ></el-button>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="caseStatus" label="用例状态" width="100" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <mdp-select show-style="tag" @visible-change="selectVisible(scope.row,$event)" item-code="testCaseStatus" v-model="scope.row.caseStatus" effect="dark" @change="editSomeFields(scope.row,'caseStatus',$event)" :disabled="true"></mdp-select>
                            </template>
                        </el-table-column>
                        <template v-if="select!==true">
                            <el-table-column prop="testType" label="执行方式" width="120" >
                                <template slot-scope="scope">
                                    <mdp-select show-style="tag" @visible-change="selectVisible(scope.row,$event)" item-code="testType" v-model="scope.row.testType" @change="editSomeFields(scope.row,'testType',$event)" :disabled="true"></mdp-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="execStatus" label="执行结果" width="120" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <mdp-select show-style="tag" @visible-change="selectVisible(scope.row,$event)" item-code="testStepTcode" v-model="scope.row.execStatus" effect="dark" @change="editSomeFields(scope.row,'execStatus',$event)"></mdp-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="execUsername" label="执行人姓名" min-width="120" >
                                <template slot-scope="scope">
                                    <mdp-select-user-xm @visible-change="selectVisible(scope.row,$event)" :product-id="xmProductCpd?xmProductCpd.id:null" :project-id="xmProject?xmProject.id:null"  userid-key="execUserid" username-key="execUsername" v-model="scope.row"  @change="editSomeFields(scope.row,'execUserid',$event)">
                                    </mdp-select-user-xm>
                                </template>
                            </el-table-column>
                            <el-table-column prop="priority" label="优先级" width="120" >
                                <template slot-scope="scope">
                                    <mdp-select show-style="tag" @visible-change="selectVisible(scope.row,$event)" item-code="priority" v-model="scope.row.priority" @change="editSomeFields(scope.row,'priority',$event)"></mdp-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="remark" label="执行备注" min-width="150" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span> {{scope.row.remark}} </span>
                                </template>
                            </el-table-column>
                        </template>
                         <template v-if="select==true">

                            <el-table-column  label="操作" min-width="150">
                                <template slot-scope="scope">
                                    <el-button type="primary" @click="$emit('select',scope.row)">选择</el-button>
                                </template>
                            </el-table-column>
                         </template>
                    </el-table>
                    <el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
                </el-row>
            </el-col>
        </el-row>
		<el-row>
			<!--编辑 XmTestPlanCase 测试计划与用例关系表界面-->
			<el-dialog title="测试执行" :visible.sync="editFormVisible"  fullscreen  width="90%" top="20px"  append-to-body   :close-on-click-modal="false">
			    <xm-test-plan-case-edit op-type="edit" :xm-test-plan-case="editForm" :xm-test-casedb="xmTestCasedb" :xm-test-plan="xmTestPlan" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" @edit-fields="onEditFields" @next="nextEdit"></xm-test-plan-case-edit>
			</el-dialog>

			<!--新增 XmTestPlanCase 测试计划与用例关系表界面-->
			<el-dialog title="选择测试用例" :visible.sync="addFormVisible"  width="80%" top="20px" append-to-body  :close-on-click-modal="false">
			    <xm-test-case-select :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb" :visible="addFormVisible" @cancel="addFormVisible=false" @select="onXmTestCaseSelect"></xm-test-case-select>
			</el-dialog>


			<el-dialog title="批量执行自动化测试用例" :visible.sync="doBatchExecVisible"  width="600" top="20px" append-to-body  :close-on-click-modal="false">
                <el-result v-if="load.doBatch" icon="warning" title="警告提示" :subTitle="'正在批量执行测试用例，请勿关闭窗口,当前进度【'+batchProgress+'%】'">

                </el-result>
                <el-result v-if="!load.doBatch" icon="success" title="执行完毕" :subTitle="'成功用例【'+okCasesNum+'】,失败【'+errCasesNum+'】,忽略【'+igCasesNum+'】'">
                    <template slot="extra">
                        <el-button type="primary" size="medium" @click="doBatchBack">返回</el-button>
                    </template>
                </el-result>
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
import  MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm';//修改界面
import {autoStepToAxios,initEnvVars} from '@/api/xm/core/XmTestAutoStep.js';//全局公共库

import { mapGetters } from 'vuex'
import axios from 'axios'//免登录访问

export default {
    name:'xmTestPlanCaseMng',
    components: {
        XmTestPlanCaseEdit,XmTestCaseSelect,XmFuncSelect,MdpSelectUserXm,
    },
    props:['visible','xmTestPlan','xmTestCasedb','xmTestCase','xmProduct','xmProject','select'],
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
                testType:'',
                caseStatus:'',
                execStatus:''
            },
            batchProgress:0,
            okCasesNum:0,
            errCasesNum:0,
            igCasesNum:0,

            xmTestPlanCases: [],//查询结果
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize:10,//每页数据
                count:true,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            load:{ list: false, edit: false, del: false, add: false,doBatch:false },//查询中...
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
            doBatchExecVisible:false,
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
            if(this.filters.testType){
                params.testType=this.filters.testType
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
        if(fieldName=='execUserid'){
            params.execUserid=$event[0].userid
            params.execUsername=$event[0].username
        }else{
            params[fieldName]=$event
        }

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
      doBatchBack(){
        this.doBatchExecVisible=false;
        this.searchXmTestPlanCases();
      },
      editSomeFieldsForExec(sels,fieldName,$event){
        let params={};
        params['pkList']=sels.map(i=>{ return { caseId:i.caseId,  planId:i.planId}})
        params[fieldName]=$event
        var func = editSomeFieldsXmTestPlanCase
        func(params).then(res=>{

        }).catch((e)=>{})
      },
        selectVisible(row,visible){
            if(visible==true){
                this.rowClick(row);
            }
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
            if(cases.some(k=>k.testType!=this.xmTestPlan.testType)){
                if(this.xmTestPlan.testType=='1'){
                    this.$notify({position:'bottom-left',showClose:true,message:"当前计划为自动化测试计划，请选择自动测试的用例加入",type:'error'})
                    return;
                }
            }
            this.addFormVisible=false;
            importFromTestCase({planId:this.xmTestPlan.id,caseIds:cases.map(i=>i.id)}).then(res=>{
                this.searchXmTestPlanCases();
            })
        } ,
        batchExec(){
            if(this.sels.length==0){
                this.$notify({ position:'bottom-left',showClose:true, message:'测试用例为0条，无须执行', type: 'error' });
                return;
            }
            if(this.sels.length>100){
                this.$notify({ position:'bottom-left',showClose:true, message:'一次批量执行测试用例不能超过'+(100)+'条', type: 'error' });
                return;
            }
            this.doBatchExec(this.sels)
        },
        async doBatchExec(planCases){
            this.doBatchExecVisible=true;
            this.load.doBatch=true;
            var igCases=planCases.filter(k=> !k.autoStep || k.testType!='1')
            if(igCases.length>0){
                this.editSomeFieldsForExec(igCases,"execStatus",'1')
            }
            this.igCasesNum=igCases.length;
            this.batchProgress=Math.round(igCases.length/planCases.length)
            var cases=planCases.filter(k=>k.autoStep && k.testType=='1')
            var execAll=[]
            var env=initEnvVars(this.xmTestCasedb?this.xmTestCasedb.envJson:null,this.xmTestPlan ?this.xmTestPlan.envJson:null);
            for( let k of cases ){
                var data= await this.sendMsgForTestSetting(k,env)
                 execAll.push(data)
                 this.batchProgress=Math.round((igCases.length+execAll.length)/planCases.length)

            }
            var okCases=execAll.filter(k=>k.execStatus=='2')
            this.okCasesNum=okCases.length
            if(okCases.length>0){
               this.editSomeFieldsForExec(okCases,"execStatus",'2')
            }

            var errCases=execAll.filter(k=>k.execStatus=='4')
            this.errCasesNum=errCases.length;
            if(errCases.length>0){
                this.editSomeFieldsForExec(errCases,"execStatus",'4')
            }
            this.load.doBatch=false;
         },
        sendMsgForTestSetting:function(planCase,env){
             return new Promise((resolve,reject)=>{
                var autoStepObj=JSON.parse(planCase.autoStep)
                if(!autoStepObj.url){
                    planCase.execStatus='1'
                    resolve(planCase)
                }else{
                    var axiosObj=autoStepToAxios(autoStepObj,env)
                    //axiosObj.headers['Access-Control-Allow-Origin']='*'
                    //axios.defaults.withCredentials = true // 若跨域请求需要带 cookie 身份识别
                    //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
                    axios(axiosObj).then(res=>{
                        if(autoStepObj.expectResult){
                            var func=new Function('res','env',autoStepObj.expectResult)
                            var result=func(res,env)
                            planCase.execStatus=result==true?"2":"4"
                        }else{
                            planCase.execStatus=res.status==200?"2":"4"

                        }
                        resolve(planCase)
                    }).catch(res=>{
                        var func=new Function('res','env',autoStepObj.expectResult)
                        var result=func(res,env)
                        if(result==true){
                            planCase.execStatus="2"
                        }else{
                            planCase.execStatus="4"
                        }
                        resolve(planCase)
                    })
                }
             })


        },
        onXmFuncRowClick(row){
            this.filters.xmFunc=row
            this.searchXmTestPlanCases();
        },
        onEditFields(row){
            Object.assign(this.editForm,row)
            this.editFormBak={...this.editForm}
        },
        nextEdit(){
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
