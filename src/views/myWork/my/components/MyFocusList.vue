<template>
	<section> 
		<el-row :gutter="20">
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix"> 
                        <div class="avatar-container">
							<div class="avatar-wrapper">
 								<img   class="user-avatar" src="../../img/cp.png">
								<span class="username"> 产品、项目</span> 
							</div>    
						</div>
                    </div>
                    <div v-for="(o,index) in pps" :key="index" class="list-item">
                        <mdp-select show-style="tag" item-code="objType" v-model="o.focusType" :disabled="true"></mdp-select>
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
 								<img   class="user-avatar" src="../../img/xmgl.png">
								<span class="username"> 迭代、需求</span> 
							</div>    
						</div>
                    </div>
                    <div v-for="(o,index) in ims" :key="index" class="list-item">
                        <mdp-select show-style="tag" item-code="objType" v-model="o.focusType" :disabled="true"></mdp-select>
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
 								<img   class="user-avatar" src="../../img/xqgl.png">
								<span class="username">任务、缺陷</span> 
							</div>    
						</div>
                    </div>
                    <div v-for="(o,index) in tbs" :key="index" class="list-item">
                        <mdp-select show-style="tag" item-code="objType" v-model="o.focusType" :disabled="true"></mdp-select>
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

 import { mapGetters } from 'vuex'

export default {
    name:'userFocusMng',
    components: {
    },
    props:['visible'],
    computed: {
        ...mapGetters(['userInfo']),
        pps(){
            return this.userFocuss.filter(k=>k.focusType=='1'||k.focusType=='3')
        },
        ims(){
            return this.userFocuss.filter(k=>k.focusType=='4'||k.focusType=='6')
        }, 
        tbs(){
            return this.userFocuss.filter(k=>k.focusType=='2' || k.focusType=='5')
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
            userFocuss: [],//查询结果
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize:10,//每页数据
                count:false,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            load:{ list: false, edit: false, del: false, add: false },//查询中... 
            editForm: {
                userid:'',username:'',bizId:'',focusType:'',pbizId:'',bizName:'',pbizName:'',ftime:'',ubranchId:''
            }, 
        }
    },//end data
    methods: { 
        searchUserFocuss:function(){
             this.pageInfo.count=true;
             this.getUserFocuss();
        },
        //获取列表 UserFocus 我关注的项目或者任务
        getUserFocuss() {
            
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

            this.load.list = true;
            this.$mdp.myFocusForIndex(params).then((res) => {
                
                var tips=res.data.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.data.total;
                    this.pageInfo.count=false;
                    this.userFocuss = res.data.data;
                 }else{
                    this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        }, 
        toBizPage(bizObj){
            bizObj.objType=bizObj.focusType
            if(bizObj.url){
                this.$mdp.openWin(bizObj.url)
            }else{
                
                var curlDomain=window.location.protocol+"//"+window.location.host; //  
                var baseUrl=`${curlDomain}/${process.env.CONTEXT}/${process.env.VERSION}/`
                var xmContext=this.$mdp.getXmContext();
                if(bizObj.focusType=='1'){//项目 
                    var path="/xm/core/project/overview"
                    if(xmContext==process.env.CONTEXT){
                        this.$router.push({path:path,query:{projectId:bizObj.bizId}})
                    }else{
                        baseUrl=`${curlDomain}/${xmContext}/${process.env.VERSION}/${path}?projectId=${bizObj.bizId}`
                        this.$mdp.openWin(url)
                    }
                    
                }else if(bizObj.focusType=='2'){//任务
                    var path="/xm/core/task/detail"
                    if(xmContext==process.env.CONTEXT){
                        this.$router.push({path:path,query:{id:bizObj.bizId}})
                    }else{
                        baseUrl=`${curlDomain}/${xmContext}/${process.env.VERSION}/${path}?id=${bizObj.bizId}`
                        this.$mdp.openWin(url)
                    }
                }else if(bizObj.focusType=='3'){//产品
                    var path="/xm/core/product/overview"
                    if(xmContext==process.env.CONTEXT){
                        this.$router.push({path:path,query:{productId:bizObj.bizId}})
                    }else{
                        baseUrl=`${curlDomain}/${xmContext}/${process.env.VERSION}/${path}?productId=${bizObj.bizId}`
                        this.$mdp.openWin(url)
                    }
                }else if(bizObj.focusType=='4'){//需求
                    var path="/xm/core/menu/detail"
                    if(xmContext==process.env.CONTEXT){
                        this.$router.push({path:path,query:{menuId:bizObj.bizId}})
                    }else{
                        baseUrl=`${curlDomain}/${xmContext}/${process.env.VERSION}/${path}?menuId=${bizObj.bizId}`
                        this.$mdp.openWin(url)
                    }
                }else if(bizObj.focusType=='5'){//bug
                    var path="/xm/core/question/detail"
                    if(xmContext==process.env.CONTEXT){
                        this.$router.push({path:path,query:{id:bizObj.bizId}})
                    }else{
                        baseUrl=`${curlDomain}/${xmContext}/${process.env.VERSION}/${path}?id=${bizObj.bizId}`
                        this.$mdp.openWin(url)
                    }
                }else if(bizObj.focusType=='6'){//迭代
                    var path="/xm/core/iteration/overview"
                    if(xmContext==process.env.CONTEXT){
                        this.$router.push({path:path,query:{iterationId:bizObj.bizId}})
                    }else{
                        baseUrl=`${curlDomain}/${xmContext}/${process.env.VERSION}/${path}?iterationId=${bizObj.bizId}`
                        this.$mdp.openWin(url)
                    }
                }else if(bizObj.focusType=='7'){//团队
                    var path="/xm/core/project/group"
                    if(xmContext==process.env.CONTEXT){
                        this.$router.push({path:path,query:{projectId:bizObj.bizId}})
                    }else{
                        baseUrl=`${curlDomain}/${xmContext}/${process.env.VERSION}/${path}?projectId=${bizObj.bizId}`
                        this.$mdp.openWin(url)
                    }  
                }else if(bizObj.focusType=='8'){//组织
                     //待完善
                }else if(bizObj.focusType=='9'){//个人
                    //待完善
                }else if(bizObj.focusType=='H'){//合同
                     //待完善
                }
            }
        },   
        //删除userFocus
        handleDel: function (row,index) { 
            this.load.del=true;
            let params = {  userid:row.userid,  bizId:row.bizId,  pbizId:row.pbizId };
            this.$mdp.delUserFocus(params).then((res) => {
                this.load.del=false;
                var tips=res.data.tips;
                if(tips.isOk){
                    this.searchUserFocuss();
                }
                this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
            }).catch( err  => this.load.del=false );
            
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
            this.initData() 
            this.searchUserFocuss(); 
             

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