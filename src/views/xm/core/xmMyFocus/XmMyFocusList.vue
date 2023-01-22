<template>
	<section> 
		<el-row :gutter="20">
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix"> 
                        <div class="avatar-container">
							<div class="avatar-wrapper">
 								<img   class="user-avatar" src="../../../myWork/img/cp.png">
								<span class="username"> 产品、项目</span> 
							</div>    
						</div>
                    </div>
                    <div v-for="(o,index) in pps" :key="index" class="list-item">
                        <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'focusType',o.focusType)" :key="index" :type="item.className">{{item.name}}</el-tag>
                        <el-link @click="toBizPage(o)">{{o.bizName }}</el-link>
                        <div class="tool-bar">
                            <span class="u-btn"> 
                                <el-button     type="text"  @click="handleDel(o,index)" icon="el-icon-remove-outline" title="取消关注" >取消关注 </el-button>     
                            </span>
                        </div>
                        
                    </div>
                </el-card>
            </el-col>
             
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix"> 
                        <div class="avatar-container">
							<div class="avatar-wrapper">
 								<img   class="user-avatar" src="../../../myWork/img/xmgl.png">
								<span class="username"> 迭代、需求</span> 
							</div>    
						</div>
                    </div>
                    <div v-for="(o,index) in ims" :key="index" class="list-item">
                        <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'focusType',o.focusType)" :key="index" :type="item.className">{{item.name}}</el-tag>
                        <el-link @click="toBizPage(o)">{{o.bizName }}</el-link>
                        <div class="tool-bar">
                            <span class="u-btn"> 
                                <el-button   type="text"  circle @click="handleDel(o,index)" icon="el-icon-remove-outline" title="取消关注">取消关注 </el-button>     
                            </span>
                        </div> 
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <div class="avatar-container">
							<div class="avatar-wrapper">
 								<img   class="user-avatar" src="../../../myWork/img/xqgl.png">
								<span class="username">任务、缺陷</span> 
							</div>    
						</div>
                    </div>
                    <div v-for="(o,index) in tbs" :key="index" class="list-item">
                        <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'focusType',o.focusType)" :key="index" :type="item.className">{{item.name}}</el-tag>
                        <el-link @click="toBizPage(o)"> {{o.bizName }}</el-link>
                        <div class="tool-bar">
                            <span class="u-btn"> 
                                <el-button   type="text" @click="handleDel(o,index)" icon="el-icon-remove-outline" title="取消关注"> 取消关注</el-button>     
                            </span>
                        </div> 
                    </div>
                </el-card>
            </el-col> 
 		</el-row> 
	</section>
</template>

<script>

import util from '@/common/js/util';//全局公共库
import config from '@/common/config';//全局公共库
import { initDicts,myFocusForIndex, delUserFocus, batchDelXmMyFocus,editSomeFieldsXmMyFocus } from '@/api/mdp/sys/userFocus';
import  XmMyFocusEdit from './XmMyFocusEdit';//新增修改界面
import { mapGetters } from 'vuex'

export default {
    name:'xmMyFocusMng',
    components: {
        XmMyFocusEdit,
    },
    props:['visible'],
    computed: {
        ...mapGetters(['userInfo']),
        pps(){
            return this.xmMyFocuss.filter(k=>k.focusType=='1'||k.focusType=='3')
        },
        ims(){
            return this.xmMyFocuss.filter(k=>k.focusType=='4'||k.focusType=='6')
        }, 
        tbs(){
            return this.xmMyFocuss.filter(k=>k.focusType=='2' || k.focusType=='5')
        }

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData(); 
            }
        }
    },
    data() {
        return {
            filters: {
                key: ''
            },
            xmMyFocuss: [],//查询结果
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize:10,//每页数据
                countSql:true,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            load:{ list: false, edit: false, del: false, add: false },//查询中...
            sels: [],//列表选中数据
            dicts:{
                //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
            },//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
            addFormVisible: false,//新增xmMyFocus界面是否显示
            addForm: {
                userid:'',username:'',bizId:'',focusType:'',pbizId:'',bizName:'',pbizName:'',ftime:'',ubranchId:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                userid:'',username:'',bizId:'',focusType:'',pbizId:'',bizName:'',pbizName:'',ftime:'',ubranchId:''
            },
            maxTableHeight:300,
        }
    },//end data
    methods: {

        ...util,

        handleSizeChange(pageSize) {
            this.pageInfo.pageSize=pageSize;
            this.getXmMyFocuss();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.getXmMyFocuss();
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
            this.getXmMyFocuss();
        },
        searchXmMyFocuss:function(){
             this.pageInfo.countSql=true;
             this.getXmMyFocuss();
        },
        //获取列表 XmMyFocus 我关注的项目或者任务
        getXmMyFocuss() {
            
            let params = {
                pageSize: this.pageInfo.pageSize,
                pageNum: this.pageInfo.pageNum,
                total: this.pageInfo.total,
                countSql:this.pageInfo.countSql
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

            this.load.list = true;
            myFocusForIndex(params).then((res) => {
                
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.countSql=false;
                    this.xmMyFocuss = res.data.data;
                    localStorage.setItem('xm-my-focus-list',JSON.stringify( this.xmMyFocuss ))
                }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        },

        //显示编辑界面 XmMyFocus 我关注的项目或者任务
        showEdit: function ( row,index ) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        /**
         *  that.dicts['focusType']=[{id:'1',name:'项目'},{id:'2',name:'任务'},{id:'3',name:'产品'},{id:'4',name:'需求'},{id:'5',name:'缺陷'},]
         */
        toBizPage(bizObj){
            if(bizObj.focusType=='1'){
                this.$router.push({path:'/xm/core/project/overview',query:{projectId:bizObj.bizId}})
            }else if(bizObj.focusType=='3'){
                 this.$router.push({path:'/xm/core/product/overview',query:{productId:bizObj.bizId}})
            }else if(bizObj.focusType=='2'){
                 this.$router.push({path:'/xm/core/xmTask/XmTaskDetailRoute',query:{id:bizObj.bizId}})
            }else if(bizObj.focusType=='4'){
                 this.$router.push({path:'/xm/core/xmMenu/XmMenuDetailRoute',query:{id:bizObj.bizId}})
            }else if(bizObj.focusType=='5'){
                 this.$router.push({path:'/xm/core/xmQuestion/XmQuestionDetailRoute',query:{id:bizObj.bizId}})
            }else if(bizObj.focusType=='6'){
                 this.$router.push({path:'/xm/core/xmIteration/XmIterationInfoRoute',query:{id:bizObj.bizId}})
            }

            
        },
        //显示新增界面 XmMyFocus 我关注的项目或者任务
        showAdd: function () {
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        afterAddSubmit(){
            this.addFormVisible=false;
            this.pageInfo.countSql=true;
            this.getXmMyFocuss();
        },
        afterEditSubmit(){
            this.editFormVisible=false;
        },
        //选择行xmMyFocus
        selsChange: function (sels) {
            this.sels = sels;
        },
        //删除xmMyFocus
        handleDel: function (row,index) { 
            this.load.del=true;
            let params = {  userid:row.userid,  bizId:row.bizId,  pbizId:row.pbizId };
            delUserFocus(params).then((res) => {
                this.load.del=false;
                var tips=res.data.tips;
                if(tips.isOk){
                    this.searchXmMyFocuss();
                }
                this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
            }).catch( err  => this.load.del=false );
            
        },
        //批量删除xmMyFocus
        batchDel: function () {
            if(this.sels.length<=0){
                return;
            }
            var params=this.sels.map(i=>{
                return { userid:i.userid,  bizId:i.bizId,  pbizId:i.pbizId}
            })
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.load.del=true;
                batchDelXmMyFocus(params).then((res) => {
                    this.load.del=false;
                    var tips=res.data.tips;
                    if( tips.isOk ){
                        this.searchXmMyFocuss();
                    }
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
                }).catch( err  => this.load.del=false );
            });
        },
      editSomeFields(row,fieldName,$event){
        let params={};
        if(this.sels.length>0){
          if(!this.sels.some(k=> k.userid==row.userid &&  k.bizId==row.bizId &&  k.pbizId==row.pbizId)){
            this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
            Object.assign(this.editForm,this.editFormBak)
            return;
          }
            params['pkList']=this.sels.map(i=>{ return { userid:i.userid,  bizId:i.bizId,  pbizId:i.pbizId}})
        }else{
            params['pkList']=[row].map(i=>{ return { userid:i.userid,  bizId:i.bizId,  pbizId:i.pbizId}})
        }
        params[fieldName]=$event
        var func = editSomeFieldsXmMyFocus
        func(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            if(this.sels.length>0){
                this.searchXmMyFocuss();
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
            var myFocusList=localStorage.getItem('xm-my-focus-list')
            
            if(myFocusList){
                this.xmMyFocuss=JSON.parse(myFocusList)
            }else{
                this.searchXmMyFocuss();
            }
            
            //this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmMyFocusTable.$el)

        });
    }
}

</script>

<style lang="scss"  scoped>
.box-card{
    height: 450px;
}

.avatar-container {
    height: 20px;
    display: flex;
    align-items: center; 
    .avatar-wrapper {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        .user-avatar {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            margin-right: 12px;
        }
        .username{
            color: #7D7D7D;
            font-size: 18px;
            margin-right: 2px;
        }
        .el-icon-caret-bottom {
            font-size: 22px;
        }
    }
}


.tool-bar{
	visibility: hidden;
	float: right;
}

.list-item{
    margin-bottom: 15px;
}

.list-item:hover{
	.tool-bar{
		visibility: visible;
		.u-btn{   
			float: right;
		} 
	}
}
</style>