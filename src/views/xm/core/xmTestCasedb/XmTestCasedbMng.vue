<template>
	<section>
		<el-row>
            <xm-product-select v-if="!xmProduct" style="display:inline;" :auto-select="false" :link-project-id="selProject?selProject.id:null" @row-click="onProductSelected" @clear="clearProduct"></xm-product-select>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询" clearable></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTestCasedbs" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus">添加用例库 </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
		    </span>
		</el-row>
		<el-row  class="padding-top">
			<!--列表 XmTestCasedb 测试用例库-->
			<el-table ref="xmTestCasedbTable" :data="xmTestCasedbs" height="100px" v-adaptive="{bottomOffset:50}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				    <span class="cell-text">  {{scope.row.username}}}  </span>
				    <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>
				-->
 				<el-table-column prop="name" label="用例库名称" min-width="250">
				    <template slot-scope="scope">
				        <span v-if="select!==true"><el-link @click="goCasedbInfo(scope.row)">{{scope.row.name}} </el-link> </span>
                        <span v-else> {{scope.row.name}}  </span>
                        <span class="tool-bar">
                            <el-button type="warning" @click="goCasedbInfo(scope.row)" icon="el-icon-s-data"  circle title="视图"></el-button>
                         </span>
                    </template>
				</el-table-column>
                <template v-if="select!==true">
                    <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span> {{scope.row.productName}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cusername" label="创建人" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <mdp-select-user show-style="tag" v-model="scope.row.cuserid" :init-name="scope.row.cusername" :disabled="true">
                            </mdp-select-user>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ctime" label="创建日期" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span> {{scope.row.ctime}} </span>
                        </template>
                    </el-table-column>
                </template>
				<template v-else>
                    <el-table-column label="操作" width="180" fixed="right">
                        <template scope="scope">
                            <el-button type="primary" @click="$emit('select',scope.row)">选择</el-button>
                        </template>
				    </el-table-column>
                </template>

			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 XmTestCasedb 测试用例库界面-->
			<el-drawer title="编辑测试用例库" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
			    <xm-test-casedb-edit op-type="edit" :xm-test-casedb="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-test-casedb-edit>
			</el-drawer>

			<!--新增 XmTestCasedb 测试用例库界面-->
			<el-drawer title="新增测试用例库" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
			    <xm-test-casedb-edit op-type="add" :xm-product="filters.xmProduct" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-test-casedb-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listXmTestCasedb, delXmTestCasedb, batchDelXmTestCasedb,editSomeFieldsXmTestCasedb } from '@/api/xm/core/xmTestCasedb';
import  XmTestCasedbEdit from './XmTestCasedbEdit';//新增修改界面
import { mapGetters } from 'vuex'
import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//修改界面

import store from '@/store'

export default {
    name:'xmTestCasedbMng',
    components: {
        XmTestCasedbEdit,XmProductSelect
    },
    props:['visible','xmProduct','selProject','select'],
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
                key: '',
                xmProduct:null,
            },
            xmTestCasedbs: [],//查询结果
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
            if(this.filters.xmProduct && this.filters.xmProduct.id){
                params.productId=this.filters.xmProduct.id
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
            this.filters.xmProduct=this.xmProduct
        },

        clearProduct(){
            this.filters.xmProduct=null;
            this.searchXmTestCasedbs();
        },
        onProductSelected(product){
            this.filters.xmProduct=product;
            this.searchXmTestCasedbs();
        },
        goCasedbInfo(row){
            store.dispatch('setTestCasedb',row).then(res=>{
                this.$router.push({
                    name:'testOverview',
                    query:{
                        casedbId:row.id
                    }
                })
            })
        }
    },//end methods
    mounted() {
        this.$nextTick(() => {
            initDicts(this);
            this.initData()
            this.searchXmTestCasedbs();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTestCasedbTable.$el)

        });
    }
}

</script>

<style scoped>
</style>
