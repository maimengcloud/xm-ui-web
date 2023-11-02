<template>
<section>
 	    <el-row  :gutter="20"> 
		<!--编辑界面 UserDept 用户部门关系表--> 
		<el-col :span="6"  style=" overflow-x:auto; height:550px;"> 
			<dept-tree v-loading="load.list" :branch-id="branch.id" :checked-keys="defaultChecked" default-expand-all show-checkbox multiple :expand-on-click-node="false" ref="nodeTree" @check-change="deptTreeCheckChange" @branch-row-click="branchChange"></dept-tree> 
 		</el-col>
		<el-col :span="18">
			<el-form :model="editForm"   label-width="160px" label-position="left" v-loading="load.list" :rules="editFormRules" ref="editFormRef"> 
			 <h3>【{{user.username}}】加入的部门及拥有的岗位如下：  
			 </h3>
			 <el-row class="padding-top">
				<el-card class="box-card" v-for="(item,index) in allDeptDeptPosts" :key="index" :body-style="{background: 'rgba(244, 245, 248, 1)'}">
			    	<div slot="header" class="card-header"> 
						<span>部门： {{item.deptName}} </span>	 
					</div> 
					<el-row :gutter="50">
						<el-col :span="10">
							<span v-if=" !item.deptPosts || item.deptPosts.filter(i=>i.checked==='1').length<=0">
								请选择岗位
							</span>
							<span v-else>
								<el-checkbox v-for="deptPost in item.deptPosts.filter(i=>i.checked==='1')" v-model="deptPost.checked" :true-label="'1'" :false-label="'0'" :key="deptPost.postId" :disabled="deptPost.disabled">{{deptPost.postName}}</el-checkbox>
							</span> 
						</el-col>
						<el-col :span="14"  class="" v-if="item.deptPosts && item.deptPosts.filter(i=>i.checked!=='1').length>0">
							<div class="bg-right border padding">
							 <el-checkbox   v-for="deptPost in item.deptPosts.filter(i=>i.checked!=='1')" v-model="deptPost.checked" :true-label="'1'" :false-label="'0'" :key="deptPost.postId" :disabled="deptPost.disabled">{{deptPost.postName}}</el-checkbox>
							</div>
						</el-col>
						<span v-if="!item.deptPosts || item.deptPosts.length<=0">
							该部门还没有设立岗位
						</span>
					</el-row>  
			    </el-card>
			</el-row> 
			</el-form>
			</el-col>
		</el-row>

		<el-row  slot="footer"  v-if="showBtn!==false">
		    <el-button @click.native="handleCancel">关闭</el-button>
            <el-button v-if="currOpType=='edit'" v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
		</el-row>
 </section>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as UserDeptApi from '@/api/mdp/sys/userDept'; 
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js'; 
import { listDeptPostUserWithDeptPosts } from '@/api/mdp/sys/deptPostUser';  
import DeptTree from '../dept/DeptTree.vue';//下拉框数据查询
export default {
    name:'userDeptForm',
    mixins:[MdpFormMixin],
    components: {
        DeptTree
    },
    computed: {
        
        noQxDeptids(){ 
            return [];
        },
        defaultChecked(){
            if( !this.userDepts || this.userDepts.length==0){
                return []
            }
            return this.userDepts.map(i=>i.deptid);
        },
    },
    props:{
        user:{}
    },
    watch: { 
        treeCheckDeptids(val){
            if(val==null || val.length==0){
                return;
            }
            this.getDeptPostUserWithDeptPosts(val)
        }
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["userid", "deptid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                userid:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ],
                deptid:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                userid:'',deptid:'',enabled:'',seq:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: UserDeptApi.queryUserDeptById,
                add: UserDeptApi.addUserDept,
                edit: UserDeptApi.editUserDept,
                editSomeFields: UserDeptApi.editSomeFieldsUserDept
            },
            branch:{}, 
            userDepts:[],
            treeCheckDeptids:[],
            allDeptDeptPosts:[],
        }
    },
    methods: {
        //由组件扩展添加其它的初始页面的逻辑
         initCurrData(){ 
            this.disabledInit();
            this.$nextTick(()=>{
                this.branch={id:this.userInfo.branchId,branchName:this.userInfo.branchName}
                if(this.user==null || !this.user.userid){
                    this.user=this.useerInfo
                }  
                this.dataBak=Object.assign({},this.editForm) 
                this.allDeptDeptPosts=[]
                this.userDepts=[];  
                this.treeCheckDeptids=[];
                if(this.$refs.nodeTree.branch!=null){
                    this.getUserDepts(this.$refs.nodeTree.branch);
                }else{
                    this.getUserDepts(this.branch);
                }
            })
         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
            return true;
        },

        /**
         * 此函数由组件自行扩展
         */
        disabledRulesInit(disabledRules){

        },
        /**
         * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
         * @param {*} row 当前选中的行
         * @param {*} fieldName 修改的字段名
         * @param {*} $event 修改后的值
         * @param {*} params 将要提交服务器的参数
         * @returns true/false 返回false ,将取消更新数据库
         */
        editSomeFieldsCheck(row,fieldName,$event,params){
            params[fieldName]=$event
            return true;
        },
        //上级调用该函数打开页面，参数通过res传入
        openForm(res ){
            
        },
        branchChange: function(branch){
            this.branch=branch
            this.allDeptDeptPosts=[]; 
            this.geetUserDepts(branch)
        },
        getUserDepts(branch){
            if(branch==null || !branch.id || this.user==null || !this.user.userid){
                return;
            }
            this.load.list=true
            let params={'res.userid':this.user.userid}; 
                params.branchId=branch.id; 
            
            UserDeptApi.listUserDept(params).then(res=>{ 
                this.load.list=false
                let uds=res.data.data
                this.userDepts=uds; 
                this.treeCheckDeptids=this.userDepts.map(i=>i.deptid)  
                
            }).catch(()=>this.load.list=false);
        },
        deptTreeCheckChange: function(data,checked,indeterminate){ 
            if(checked==false){
                this.treeCheckDeptids=this.treeCheckDeptids.filter(i=>i!=data.deptid)
            }else{
                if(!this.treeCheckDeptids.some(i=>i==data.deptid)){
                    this.treeCheckDeptids.push(data.deptid)
                }
            } 
            
        },
        
        getDeptPostUserWithDeptPosts: function(deptids){ 
            this.load.list=true 
            let params={userid: this.user.userid,deptid:deptids}
            this.allDeptDeptPosts=[]
            listDeptPostUserWithDeptPosts(params).then(res=>{ 
                this.load.list=false 
                let allDeptDeptPosts=[];
                let deptPosts=res.data.deptPosts
                if(!deptPosts){
                    deptPosts=[]
                }
                let deptPostUsers=res.data.deptPostUsers
                if(!deptPostUsers){
                    deptPostUsers=[]
                }
                deptPosts.forEach(i=>{
                    i.id='';
                    i.checked='0'
                    i.disabled=this.noQxDeptids.some(n=>n==i.deptid)
                    if(deptPostUsers.some(k=>{ 
                        if(k.deptid==i.deptid && k.postId==i.postId){
                            i.id=k.id
                            return true
                        }else{
                            return false
                        }
                    })){
                        i.checked='1'
                    }
                })
                deptPosts.forEach(i=>{
                    if(allDeptDeptPosts.some(k=>k.deptid==i.deptid )){
                        allDeptDeptPosts.forEach(j=>{
                            if(j.deptid==i.deptid){
                                j.deptPosts.push(i)
                            }
                        })
                    }else{
                        allDeptDeptPosts.push({deptid:i.deptid,deptName:i.deptName,deptPosts:[i]})
                    }
                    
                })
                this.allDeptDeptPosts=allDeptDeptPosts 
            }).catch((e)=>{ 
                this.load.list=false; 
            })
        },
        goToSetDeptPostPage:function(){
            this.$router.push({path:'/mdp/sys/dept/DeptMng'});
        },
        //编辑提交UserDept 用户部门关系表父组件监听@submit="afterEditSubmit"
        editSubmit: function () { 
                    if(this.user.userid==''){
                        this.$notify.error('用户不能为空');
                        return;
                    }
                    this.load.edit=true
                    var msg="确认提交吗？";
                    this.$confirm(msg, '提示', {}).then(() => { 
                        console.log("xxxxxxxxxxxxxx");
                        let delDeptids=[];
                        let deptids=this.treeCheckDeptids; 
                        this.userDepts.forEach(ud=>{
                            if(!this.noQxDeptids.some(d=>d==ud.deptid)){
                                if(!deptids.some(deptid=>deptid==ud.deptid)){
                                    delDeptids.push(ud.deptid)
                                }
                            }
                        })
                        let addDeptPostUsers=[];
                        let delDeptPostUsers=[];
                        this.allDeptDeptPosts.forEach(i=>{
                            i.deptPosts.forEach(k=>{
                                if(k.checked=='1'){
                                    k.userid=this.user.userid
                                    addDeptPostUsers.push(k)
                                }else if(k.checked=='0' && k.id!=''){ 
                                    delDeptPostUsers.push(k)
                                }
                            })
                        })
                        console.log("ffffffffffffffffffffffffffffffffffffffffffffffffff");
                        
                        let branch=this.$refs.nodeTree.branch; 
                        let params = {branchId:branch==null?this.branch.id:branch.id,userid:this.user.userid,deptids:deptids,delDeptids:delDeptids,delDeptPostUsers:delDeptPostUsers,addDeptPostUsers:addDeptPostUsers}
                        UserDeptApi.batchEditUserDept(params).then((res) => {
                            this.load.edit=false
                            var tips=res.data.tips;
                            if(tips.isOk){
                                this.$refs['editFormRef'].resetFields();
                                this.$emit('submit');//  @submit="afterEditSubmit"
                            }
                            this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
                        }).catch((e) => {
                            console.log(e)
                            this.load.edit=false
                        });
                    }).catch((e)=>{
                        console.log(e)
                        this.load.edit=false; 
                    })
        },
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>