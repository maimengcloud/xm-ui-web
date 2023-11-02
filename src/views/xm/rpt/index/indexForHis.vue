<template>
	<section class="padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 30%;" placeholder="模糊查询"></el-input>
            <el-checkbox v-model="filters.myCreate" true-label="1" false-label="0">我的</el-checkbox>

            <mdp-date-range v-model="filters" start-key="startBizDate" style="width:250px;" end-key="endBizDate"></mdp-date-range>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmRptDatas" icon="el-icon-search"></el-button>
			<span style="float:right;">
 			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmRptData xm_rpt_data-->
			<el-table ref="xmRptDataTable" :data="xmRptDatas" height="100px" v-adaptive="{bottomOffset:50}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
                <el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
                <el-table-column prop="rptName" label="报告名称" min-width="250" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.rptName}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="bizDate" label="业务日期" min-width="100" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.bizDate}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="cusername" label="创建人名称" min-width="120" show-overflow-tooltip>
				    <template slot-scope="scope">
				        <span> {{scope.row.cusername}} </span>
                    </template>
				</el-table-column>
				<el-table-column label="操作" width="100" fixed="right">
				    <template scope="scope">
                        <el-button type="primary" @click="toRptDetail(scope.row)" icon="el-icon-s-data"  plain>查看</el-button>
				    </template>
				</el-table-column>
			</el-table>
		</el-row>
        <el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listXmRptData, delXmRptData, batchDelXmRptData,editSomeFieldsXmRptData } from '@/api/xm/core/xmRptData';
import { mapGetters } from 'vuex'

export default {
    name:'xmRptDataList',
    components: {
    },
    computed: {
        ...mapGetters(['userInfo']),

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData();
                this.searchXmRptDatas()
            }
        }
    },
    data() {
        return {
            filters: {
                key: '',
                startBizDate:'',
                endBizDate:'',
                myCreate:'0',
            },
            xmRptDatas: [],//查询结果
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
            addFormVisible: false,//新增xmRptData界面是否显示
            addForm: {
                cfgId:'',id:'',rptName:'',rptData:'',cuserid:'',cbranchId:'',cusername:'',ctime:'',bizDate:'',bizType:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                cfgId:'',id:'',rptName:'',rptData:'',cuserid:'',cbranchId:'',cusername:'',ctime:'',bizDate:'',bizType:''
            },
            maxTableHeight:300,
        }
    },//end data
    methods: {

        ...util,

        handleSizeChange(pageSize) {
            this.pageInfo.pageSize=pageSize;
            this.getXmRptDatas();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getXmRptDatas();
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
            this.getXmRptDatas();
        },
        searchXmRptDatas(){
             this.pageInfo.count=true;
             this.getXmRptDatas();
        },
        //获取列表 XmRptData xm_rpt_data
        getXmRptDatas() {
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
            if(this.filters.startBizDate){
                params.startBizDate=this.filters.startBizDate
                params.endBizDate=this.filters.endBizDate
            }

            if(this.filters.myCreate=='1'){
                params.cuserid=this.userInfo.userid
            }
            this.load.list = true;
            listXmRptData(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.count=false;
                    this.xmRptDatas = res.data.data;
                }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        },

        //显示编辑界面 XmRptData xm_rpt_data
        showEdit: function ( row,index ) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 XmRptData xm_rpt_data
        showAdd: function () {
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        afterAddSubmit(){
            this.addFormVisible=false;
            this.pageInfo.count=true;
            this.getXmRptDatas();
        },
        afterEditSubmit(){
            this.editFormVisible=false;
        },
        toRptDetail(row){
          this.$router.push({
            name:'rptHisDetail',
            query:{
              id:row.id
            }
          })
        },
        //选择行xmRptData
        selsChange: function (sels) {
            this.sels = sels;
        },
        //删除xmRptData
        handleDel: function (row,index) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                let params = {  id:row.id };
                delXmRptData(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchXmRptDatas();
                    }
                    this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err  => this.load.del=false );
            });
        },
        //批量删除xmRptData
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
                batchDelXmRptData(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){
                        this.searchXmRptDatas();
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
        var func = editSomeFieldsXmRptData
        func(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            if(this.sels.length>0){
                this.searchXmRptDatas();
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
            this.searchXmRptDatas();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmRptDataTable.$el)

        });
    }
}

</script>

<style scoped>
</style>
