<template>
	<section>
		<el-row>
			<el-input v-model="filters.key" style="width: 60%;" placeholder="模块名称 按回车" @keyup.enter.native="searchXmFuncs" clearable></el-input> 
			<span style="float:right;">
                <el-popover
                    placement="top-start"
                    title="增删改模块"
                    width="400"
                    trigger="click" >
                    <el-button type="primary" @click="showAdd" icon="el-icon-plus" title="添加顶级模块"> 添加顶级模块 </el-button>
                    <el-button      @click.stop="showEdit( editForm )" icon="el-icon-edit" title="编辑"  > 编辑</el-button>    
                    <el-button type="danger" v-loading="load.del" @click="handleDel(editForm)" :disabled=" !editForm || !editForm.id || load.del==true" icon="el-icon-delete"  >删除</el-button>
                    <el-button slot="reference" icon="el-icon-more"></el-button> 
                </el-popover>
			    
		    </span>
		</el-row>
		<el-row>
			<!--列表 XmFunc 功能模块表-->
			<el-table ref="xmFuncTable"  element-loading-text="努力加载中" element-loading-spinner="el-icon-loading"  :data="xmFuncsTreeData" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" current-row-key="id" row-key="id" :tree-props="{children: 'children'}" >
				 
                <el-table-column prop="name" label="模块" min-width="150" > 
								<template slot="header"> 模块 &nbsp;<slot name="title-bar"></slot><el-button type="text" @click="unselectRow()">清除选中的行</el-button></template>
								<template slot-scope="scope">
									 
									<span> {{scope.row.name}}</span> 
 									 <div class="tool-bar"> 
                                                    <el-button    @click.stop="showSubAdd( scope.row,scope.$index)" icon="el-icon-plus" title="新建子功能模块" circle > </el-button>
                                                    
                                            
                                         
									</div>
  								</template> 
							</el-table-column> 
			</el-table>
			<el-pagination  layout="total,sizes,prev,next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 XmFunc 功能模块表界面-->
			<el-dialog title="编辑模块" :visible.sync="editFormVisible"  width="500px"  append-to-body   :close-on-click-modal="false">
			    <xm-func-edit op-type="edit" :xm-func="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-func-edit>
			</el-dialog>

			<!--新增 XmFunc 功能模块表界面-->
			<el-dialog :title="'新增'+(parentFunc&&parentFunc.id?'【'+parentFunc.name+'】的子':'顶级')+'模块'" :visible.sync="addFormVisible"  width="500px"  append-to-body  :close-on-click-modal="false">
			    <xm-func-edit op-type="add" :xm-func="addForm" :parent-func="parentFunc" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-func-edit>
			</el-dialog>
	    </el-row>
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import treeTool from '@/common/js/treeTool';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,listXmFunc, delXmFunc, batchDelXmFunc,editSomeFieldsXmFunc } from '@/api/xm/core/xmFunc';
import  XmFuncEdit from './XmFuncEdit';//新增修改界面
import { mapGetters } from 'vuex'

export default {
    name:'xmFuncMng',
    components: {
        XmFuncEdit,
    },
    props:['visible','xmProduct'],
    computed: {
        ...mapGetters(['userInfo']),


        xmFuncsTreeData() {
            let xmFuncs = JSON.parse(JSON.stringify(this.xmFuncs || []));
            let xmFuncsTreeData = treeTool.translateDataToTree(xmFuncs,"pid","id");
                return xmFuncsTreeData;
        },
    },
    watch:{
        visible(val){
            if(val==true){
                this.initData();
                this.searchXmFuncs()
            }
        }
    },
    data() {
        return {
            filters: {
                key: ''
            },
            xmFuncs: [],//查询结果
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize:500,//每页数据
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
            addFormVisible: false,//新增xmFunc界面是否显示
            addForm: {
                id:'',name:'',pid:'',pname:'',pidPaths:'',productId:'',lvl:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                id:'',name:'',pid:'',pname:'',pidPaths:'',productId:'',lvl:''
            },
            parentFunc:{ id:'',name:'',pid:'',pname:'',pidPaths:'',productId:'',lvl:''},
            maxTableHeight:300,
        }
    },//end data
    methods: {

        ...util,

        handleSizeChange(pageSize) {
            this.pageInfo.pageSize=pageSize;
            this.getXmFuncs();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getXmFuncs();
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
            this.getXmFuncs();
        },
        searchXmFuncs(){
             this.pageInfo.count=true;
             this.getXmFuncs();
        },
        //获取列表 XmFunc 功能模块表
        getXmFuncs() {
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
            if(this.xmProduct && this.xmProduct.id){
                params.productId=this.xmProduct.id
            }

            this.load.list = true;
            listXmFunc(params).then((res) => {
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.count=false;
                    this.xmFuncs = res.data.data;
                }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        },

        //显示编辑界面 XmFunc 功能模块表
        showEdit: function ( row,index ) {
            if(!row||!row.id){
                this.$notify({ position:'bottom-left',showClose:true, message:"请选择一条数据再点击修改按钮", type: 'error' });
                return;
            }
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 XmFunc 功能模块表
        showAdd: function () {
            this.parentFunc=null;
            this.addForm.productId=this.xmProduct.id
            this.addForm.productName=this.xmProduct.productName
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        showSubAdd:function(row){
            this.$refs.xmFuncTable.setCurrentRow(row)
            if(this.editForm && row.id!=this.editForm.id){ 
                this.$refs.xmFuncTable.setCurrentRow(row); 
                this.$emit("row-click",row) 
            }
            this.addForm={...this.addFormInit}
            this.editForm=row
            this.parentFunc=row 
            this.addForm.productId=row.productId 

            if(this.xmProduct && row.productId==this.xmProduct.id){
                this.addForm.productName=this.xmProduct.productName
            }else{
                this.addForm.productName=null;
            }  
            this.addFormVisible=true
        },
        afterAddSubmit(){
            this.addFormVisible=false;
            this.pageInfo.count=true;
            this.getXmFuncs();
        },
        afterEditSubmit(){
            this.editFormVisible=false;
        },
        //选择行xmFunc
        selsChange: function (sels) {
            this.sels = sels;
        },
        //删除xmFunc
        handleDel: function (row,index) {
            if(!row||!row.id){
                this.$notify({ position:'bottom-left',showClose:true, message:"请选择一条数据再点击删除按钮", type: 'error' });
                return;
            }
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                let params = {  id:row.id };
                delXmFunc(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if(tips.isOk){
                        this.searchXmFuncs();
                    }
                    this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                }).catch( err  => this.load.del=false );
            });
        },
        //批量删除xmFunc
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
                batchDelXmFunc(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){
                        this.searchXmFuncs();
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
        var func = editSomeFieldsXmFunc
        func(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            if(this.sels.length>0){
                this.searchXmFuncs();
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

        unselectRow(){
            this.editForm=null;
            this.$emit('row-click',null)
            this.$refs.xmFuncTable.setCurrentRow(); 
        },
    },//end methods
    mounted() {
        this.$nextTick(() => {
            initDicts(this);
            this.initData()
            this.searchXmFuncs();
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmFuncTable.$el)

        });
    }
}

</script>

<style scoped>
</style>