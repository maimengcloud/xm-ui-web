<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 NotifyMsg 个人消息通知-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef"> 
            <el-form-item label="用户名称" prop="toUsername">
                <mdp-select-user v-model="toUserids" @change2="onUsersSelect" :plus-options="users" :multiple="multiple"></mdp-select-user>
            </el-form-item>   
            <el-form-item label="消息" prop="msg">
                <el-input v-model="editForm.msg" rows="6" type="textarea"></el-input>
            </el-form-item>   
            <el-form-item label="跳转链接" prop="url">
                <el-input v-model="editForm.url" rows="2" type="textarea"></el-input>
            </el-form-item>   
        </el-form>
    </el-row>
    <slot name="footer">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
            <el-button @click.native="close">关闭</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit2" :disabled="disabledJudge('addBtn')">发送</el-button>
        </el-row>
    </slot>
</el-row>
</template>

<script>
import * as NotifyMsgApi from '@/api/mdp/sys/notifyMsg';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'notifyMsgForm',
    mixins:[MdpFormMixin],
    components: {
    },
    computed: {
    },
    props:{
        users:{
            type:Array,
            default:null,
        },
        multiple:{
            type:Boolean,
            default:false
        }
    },
    watch: {
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                id:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                id:'',sendUserid:'',sendUsername:'',operTime:'',objType:'',msg:'',gloNo:'',branchId:'',ip:'',bizId:'',pbizId:'',bizName:'',toUserid:'',toUsername:'',hadRead:'',url:''
            },
            //增删改查(含批量)接口
            apis:{ 
                batchAdd:NotifyMsgApi.batchAddNotifyMsg
            },
            toUserids:[],
            toUsers:[],
            editable:true,//是否可编辑模式
        }
    },
    methods: {
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){
            if(this.users && this.users.length>0){
                this.toUserids=this.users.map(k=>k.userid)
                this.toUsers=this.users
            }else{
                this.toUserids=[]
                this.toUsers=[]
            }
         }, 
        onUsersSelect(users){  
            this.toUsers=this.multiple?users:[users]
            this.toUserids=this.toUsers.map(k=>k.userid)
        },
        saveSubmit2(){
            if(this.toUsers==null || this.toUsers.length==0){
                this.$notify.error("接收用户不能 为空")
                return ;
            }
            if(!this.editForm.msg){
                this.$notify.error("消息不能为空")
                return ;
            }
            var params=[]
            if(this.toUsers && this.toUsers.length>0){
                this.toUsers.forEach(u=>{
                    var addForm={sendUserid:this.userInfo.userid,sendUsername:this.userInfo.username,msg:this.editForm.msg,url:this.editForm.url}
                    addForm.toUserid=u.userid
                    addForm.toUsername=u.username 
                    params.push(addForm)
                })  
                this.apis.batchAdd(params).then(res=>{
                    var tips = res.data.tips
                    if(!tips.isOk){this.$notify.error(tips.msg)} 
                    if(tips.isOk){this.$notify.success(tips.msg)}
                })
            }
        }
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>