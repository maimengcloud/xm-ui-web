<template>
	<section>
		<el-row>
			<el-input v-model="filters.key" style="width: 15%;" placeholder="模糊查询"  clearable></el-input>
            <mdp-select style="width:15%;" clearable placeholder="状态" item-code="testPlanStatus" v-model="filters.status" effect="dark"></mdp-select>

            <mdp-select style="width:15%;" clearable placeholder="结果" item-code="testPlanTcode" v-model="filters.tcode" effect="dark" ></mdp-select>
            <mdp-select placeholder="测试方式" style="width:15%;" clearable item-code="testType" v-model="filters.testType" effect="dark"></mdp-select>

			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTestPlans" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus">测试计划</el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmTestPlan 测试计划-->
			<el-table ref="xmTestPlanTable" :data="xmTestPlans" v-adaptive="{bottomOffset:30}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
 				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				    <span class="cell-text">  {{scope.row.username}}}  </span>
				    <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>
				-->
 				<el-table-column prop="name" label="计划名称" min-width="250">
				    <template slot-scope="scope">
				        <span> <el-link type="primary" @click="goToTestPlanCase(scope.row)"> {{scope.row.name}}</el-link> </span>
                        <span  class="tool-bar">
                         <el-button  @click="showEdit(scope.row)" icon="el-icon-edit"  circle title="编辑"></el-button>
                         </span>
                    </template>
				</el-table-column>
                <el-table-column prop="projectName" label="项目" min-width="120">
				</el-table-column>
                <el-table-column prop="cusername" label="负责人" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
                        <mdp-select-user-xm  userid-key="cuserid" username-key="cusername" v-model="scope.row" :disabled="true">
                                    </mdp-select-user-xm>
                    </template>
				</el-table-column>
                <el-table-column prop="totalCases" label="用例数" width="120" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="status" label="状态" width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
                        <mdp-select show-style="tag" item-code="testPlanStatus" v-model="scope.row.status" effect="dark" @change="editSomeFields(scope.row,'status',$event)"></mdp-select>
                   </template>
				</el-table-column>

				<el-table-column prop="testType" label="测试方式" width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
                        <mdp-select show-style="tag" item-code="testType" v-model="scope.row.testType" effect="dark" @change="editSomeFields(scope.row,'testType',$event)"></mdp-select>
                   </template>
				</el-table-column>
				<el-table-column prop="tcode" label="测试结果" width="120" show-overflow-tooltip>
				    <template slot-scope="scope">

                        <mdp-select show-style="tag" item-code="testPlanTcode" v-model="scope.row.tcode" effect="dark" @change="editSomeFields(scope.row,'tcode',$event)"></mdp-select>

                    </template>
				</el-table-column>
				<el-table-column prop="totalCases" label="进度" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
                        <el-tooltip :open-delay="300" :content="'总用例数:'+scope.row.totalCases+'   成功:'+scope.row.okCases +'  失败:'+scope.row.errCases+'  忽略:'+scope.row.igCases+'  阻塞:'+scope.row.blCases">
                            <el-progress   :stroke-width="22" :text-inside="true"  :status="scope.row.totalCases>0 && scope.row.errCases<=0 ?'success':'exception'" :percentage="scope.row.totalCases>0?parseInt((parseInt(scope.row.okCases)+parseInt(scope.row.igCases)+parseInt(scope.row.errCases)+parseInt(scope.row.blCases))*100/parseInt(scope.row.totalCases)):0"></el-progress>
                        </el-tooltip>
                     </template>
				</el-table-column>
				<el-table-column prop="totalCases" label="统计" width="80" show-overflow-tooltip>
				    <template slot-scope="scope">
                        <el-tooltip content="点击统计进度"
                            ><el-button
                            icon="el-icon-video-play"
                            @click.stop="calcXmTestPlan(scope.row)"
                            ></el-button
                        ></el-tooltip>
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
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 XmTestPlan 测试计划界面-->
			<el-drawer title="编辑测试计划" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
			    <xm-test-plan-edit op-type="edit" :xm-test-plan="editForm" :xm-test-casedb="xmTestCasedb" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" @edit-fields="onEditFields"></xm-test-plan-edit>
			</el-drawer>

			<!--新增 XmTestPlan 测试计划界面-->
			<el-drawer title="新增测试计划" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
			    <xm-test-plan-edit op-type="add" :xm-test-plan="addForm" :xm-test-casedb="xmTestCasedb" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-test-plan-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listXmTestPlan, delXmTestPlan, batchDelXmTestPlan,editSomeFieldsXmTestPlan,calcXmTestPlan } from '@/api/xm/core/xmTestPlan';
import  XmTestPlanEdit from './XmTestPlanEdit';//新增修改界面
import  MdpSelectUserXm from '@/views/xm/core/components/MdpSelectUserXm';//修改界面
import { mapGetters } from 'vuex'

export default {
    name:'xmTestPlanMng',
    components: {
        XmTestPlanEdit,MdpSelectUserXm,
    },
    props:['visible','xmTestCasedb'],
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
            filters: {
                key: '',
                status:'',
                tcode:'',
                testType:'',
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
            if(this.filters.tcode){
                params.tcode=this.filters.tcode
            }
            if(this.filters.status){
                params.status=this.filters.status
            }
            if(this.filters.testType){
                params.testType=this.filters.testType
            }
            if(this.xmTestCasedb && this.xmTestCasedb.id){
                params.casedbId=this.xmTestCasedb.id
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

        //显示编辑界面 XmTestPlan 测试计划
        showEdit: function ( row,index ) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 XmTestPlan 测试计划
        showAdd: function () {
            this.addForm.casedbId=this.xmTestCasedb.id
            this.addForm.casedbName=this.xmTestCasedb.name
            this.addForm.productId=this.xmTestCasedb.productId
            this.addForm.productName=this.xmTestCasedb.productName
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        afterAddSubmit(){
            this.addFormVisible=false;
            this.pageInfo.count=true;
            this.getXmTestPlans();
        },
        afterEditSubmit(){
            this.editFormVisible=false;
        },
        onEditFields(row){
            Object.assign(this.editForm,row)
            this.editFormBak={...this.editForm}
        },
        //选择行xmTestPlan
        selsChange: function (sels) {
            this.sels = sels;
        },
        //删除xmTestPlan
        handleDel: function (row,index) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                let params = {  id:row.id };
                delXmTestPlan(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchXmTestPlans();
                    }
                    this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err  => this.load.del=false );
            });
        },
        //批量删除xmTestPlan
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
                batchDelXmTestPlan(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){
                        this.searchXmTestPlans();
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
        var func = editSomeFieldsXmTestPlan
        func(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            if(this.sels.length>0){
                this.searchXmTestPlans();
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
        goToTestPlanCase(row){
			var key="xm-test-plan-info-"+row.id
            sessionStorage.setItem(key,JSON.stringify(row))
            this.$router.push({
                path:'/xm/core/test/plan/detail',
                query:{
					casedbId:row.casedbId,
                    id:row.id
                }
            })
        },
        calcXmTestPlan(row){
            calcXmTestPlan({id:row.id}).then(res=>{
                var tips=res.data.tips
                this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                if(tips.isOk){
                    this.searchXmTestPlans();
                }
            })
        }

    },//end methods
    mounted() {
        this.$nextTick(() => {
            initDicts(this);
            this.initData()
            this.searchXmTestPlans();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTestPlanTable.$el)

        });
    }
}

</script>

<style scoped>
</style>
