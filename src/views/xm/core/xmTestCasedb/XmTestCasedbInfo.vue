<template>
	<section>
        <el-row >
            <el-menu  :default-active="activeIndex"   mode="horizontal" @select="handleSelect" 
                background-color="rgb(48, 65, 86)"
                text-color="rgb(191, 203, 217)"
                active-text-color="#409eff"
            >
                 <el-menu-item index="测试库">
                    <span
                        slot="title"
                        style="font-size: 18px; color: #409eff" 
                        :title="xmTestCasedb.name"
                    > 
                        测试库:<strong>&nbsp;{{ xmTestCasedb.name }}</strong> 
                    </span> 
                    </el-menu-item>
                <el-menu-item index="testCase">用例管理</el-menu-item>
                <el-menu-item index="caseFlow">用例评审</el-menu-item>
                <el-menu-item index="testPlan">测试计划</el-menu-item>
                <el-menu-item index="testRpt">统计报表</el-menu-item> 
                
                <el-menu-item index="首页" @click.native="goHome">
                <span slot="title"
                    ><i class="el-icon-s-home"></i></span
                >
                </el-menu-item> 
                <el-menu-item index="上一页" class="hidden-md-and-down"  @click.native="goBack">
                <span slot="title"
                    ><i class="el-icon-back"></i></span
                >
                </el-menu-item> 
            </el-menu>
        </el-row>
		<el-row ref="xmTestCasedbTable">
            <xm-test-case-mng  v-if="activeIndex=='testCase'" :xm-test-casedb="xmTestCasedb" key="1"></xm-test-case-mng>  
            <xm-test-case-mng  v-if="activeIndex=='caseFlow'" :xm-test-casedb="xmTestCasedb" scene="caseFlow" key="2"></xm-test-case-mng>  
            <xm-test-plan-info v-else-if="activeIndex=='testPlan'" :xm-test-casedb="xmTestCasedb" ref="testPlan"> </xm-test-plan-info>
        </el-row>     
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listXmTestCasedb, delXmTestCasedb, batchDelXmTestCasedb,editSomeFieldsXmTestCasedb } from '@/api/xm/core/xmTestCasedb';
import  XmTestCasedbEdit from './XmTestCasedbEdit';//新增修改界面
import  XmTestCaseMng from '../xmTestCase/XmTestCaseMng';//新增修改界面
import  XmTestPlanInfo from '../xmTestPlan/XmTestPlanInfo';//新增修改界面
import { mapGetters } from 'vuex'
import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//修改界面

export default {
    name:'xmTestCasedbMng',
    components: {
        XmTestCasedbEdit,XmProductSelect,XmTestCaseMng,XmTestPlanInfo,
    },
    props:['visible','xmTestCasedb'],
    computed: {
        ...mapGetters(['userInfo']),

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData();
                this.searchXmTestCasedbs()
            }
        }
    },
    data() {
        return {
            filters: {
                key: ''
            },
            xmTestCasedbs: [],//查询结果
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
            addFormVisible: false,//新增xmTestCasedb界面是否显示
            addForm: {
                id:'',name:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',productId:'',productName:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                id:'',name:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',productId:'',productName:''
            },
            maxTableHeight:300,
            activeIndex:'testCase',
        }
    },//end data
    methods: {

        ...util,

        handleSizeChange(pageSize) {
            this.pageInfo.pageSize=pageSize;
            this.getXmTestCasedbs();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getXmTestCasedbs();
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
            this.getXmTestCasedbs();
        },
        searchXmTestCasedbs(){
             this.pageInfo.count=true;
             this.getXmTestCasedbs();
        },
        //获取列表 XmTestCasedb 测试用例库
        getXmTestCasedbs() {
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
            if(this.filters.product && this.filters.product.id){
                params.productId=this.filters.product.id
            }

            this.load.list = true;
            listXmTestCasedb(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.count=false;
                    this.xmTestCasedbs = res.data.data;
                }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        },

        //显示编辑界面 XmTestCasedb 测试用例库
        showEdit: function ( row,index ) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 XmTestCasedb 测试用例库
        showAdd: function () {
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        afterAddSubmit(){
            this.addFormVisible=false;
            this.pageInfo.count=true;
            this.getXmTestCasedbs();
        },
        afterEditSubmit(){
            this.editFormVisible=false;
        },
        //选择行xmTestCasedb
        selsChange: function (sels) {
            this.sels = sels;
        },
        //删除xmTestCasedb
        handleDel: function (row,index) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                let params = {  id:row.id };
                delXmTestCasedb(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchXmTestCasedbs();
                    }
                    this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err  => this.load.del=false );
            });
        },
        //批量删除xmTestCasedb
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
                batchDelXmTestCasedb(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){
                        this.searchXmTestCasedbs();
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
        var func = editSomeFieldsXmTestCasedb
        func(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            if(this.sels.length>0){
                this.searchXmTestCasedbs();
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
            this.filters.product=this.xmProduct
        },

        clearProduct(){
            this.filters.product=null;
            this.searchXmTestCasedbs();
        }, 
        onProductSelected(product){
            this.filters.product=product; 
            this.searchXmTestCasedbs();
        },
        goCasedbInfo(row){
            localStorage.setItem('xm-test-casedb-info',JSON.stringify(row));
            this.$route.push({path:'/xm/core/testCasedbRoute',query:{id:row.id}})
        },
        handleSelect(index){
            this.activeIndex=index
            if(index=='testPlan'){
                this.$nextTick(()=>{
                    this.$refs.testPlan.activeIndex='testPlan'
                })
                
            }
        },
        
        goBack() {
         this.$router.back(-1); 
        },
        goHome(){ 
         this.$router.push({path:'/'}) 
        },
    },//end methods
    mounted() {
        this.$nextTick(() => {
            initDicts(this);
            this.initData()
            this.searchXmTestCasedbs();
            //this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTestCasedbTable.$el)

        });
    }
}

</script>

<style lang="scss" scoped>
.center{
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
}
.el-menu{
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
}
</style>