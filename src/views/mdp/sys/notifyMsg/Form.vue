<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 NotifyMsg 个人消息通知-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="消息编号" prop="id">
                <el-input show-style="origin" v-model="editForm.id" placeholder="消息编号" :maxlength="50" @change="editSomeFields(editForm,'id',$event)" :disabled="  disabledJudge('id')"/>
            </el-form-item>
            <el-form-item label="操作人id" prop="sendUserid">
                <el-input show-style="origin" v-model="editForm.sendUserid" placeholder="操作人id" :maxlength="50" @change="editSomeFields(editForm,'sendUserid',$event)" :disabled="  disabledJudge('sendUserid')"/>
            </el-form-item>
            <el-form-item label="操作人名字" prop="sendUsername">
                <el-input show-style="origin" v-model="editForm.sendUsername" placeholder="操作人名字" :maxlength="150" @change="editSomeFields(editForm,'sendUsername',$event)" :disabled="  disabledJudge('sendUsername')"/>
            </el-form-item>
            <el-form-item label="操作时间" prop="operTime">
                <el-date-picker type="date" placeholder="选择日期" show-style="origin" v-model="editForm.operTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="  disabledJudge('operTime')"></el-date-picker>
            </el-form-item>
            <el-form-item label="对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7/关注用户-8/点赞文章-9/评论文章-10/收藏文章-11/12-用户注销/13-商务合作" prop="objType">
                <el-input show-style="origin" v-model="editForm.objType" placeholder="对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7/关注用户-8/点赞文章-9/评论文章-10/收藏文章-11/12-用户注销/13-商务合作" :maxlength="50" @change="editSomeFields(editForm,'objType',$event)" :disabled="  disabledJudge('objType')"/>
            </el-form-item>
            <el-form-item label="备注-完整描述" prop="msg">
                <el-input show-style="origin" v-model="editForm.msg" placeholder="备注-完整描述" :maxlength="65535" @change="editSomeFields(editForm,'msg',$event)" :disabled="  disabledJudge('msg')"/>
            </el-form-item>
            <el-form-item label="全局根踪号，用于跟踪日志" prop="gloNo">
                <el-input show-style="origin" v-model="editForm.gloNo" placeholder="全局根踪号，用于跟踪日志" :maxlength="50" @change="editSomeFields(editForm,'gloNo',$event)" :disabled="  disabledJudge('gloNo')"/>
            </el-form-item>
            <el-form-item label="机构编号" prop="branchId">
                <el-input show-style="origin" v-model="editForm.branchId" placeholder="机构编号" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)" :disabled="  disabledJudge('branchId')"/>
            </el-form-item>
            <el-form-item label="ip地址" prop="ip">
                <el-input show-style="origin" v-model="editForm.ip" placeholder="ip地址" :maxlength="255" @change="editSomeFields(editForm,'ip',$event)" :disabled="  disabledJudge('ip')"/>
            </el-form-item>
            <el-form-item label="业务主键编号" prop="bizId">
                <el-input show-style="origin" v-model="editForm.bizId" placeholder="业务主键编号" :maxlength="50" @change="editSomeFields(editForm,'bizId',$event)" :disabled="  disabledJudge('bizId')"/>
            </el-form-item>
            <el-form-item label="对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号" prop="pbizId">
                <el-input show-style="origin" v-model="editForm.pbizId" placeholder="对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号" :maxlength="50" @change="editSomeFields(editForm,'pbizId',$event)" :disabled="  disabledJudge('pbizId')"/>
            </el-form-item>
            <el-form-item label="对象名称" prop="bizName">
                <el-input show-style="origin" v-model="editForm.bizName" placeholder="对象名称" :maxlength="255" @change="editSomeFields(editForm,'bizName',$event)" :disabled="  disabledJudge('bizName')"/>
            </el-form-item>
            <el-form-item label="接收用户编号" prop="toUserid">
                <el-input show-style="origin" v-model="editForm.toUserid" placeholder="接收用户编号" :maxlength="50" @change="editSomeFields(editForm,'toUserid',$event)" :disabled="  disabledJudge('toUserid')"/>
            </el-form-item>
            <el-form-item label="接收用户名称" prop="toUsername">
                <el-input show-style="origin" v-model="editForm.toUsername" placeholder="接收用户名称" :maxlength="150" @change="editSomeFields(editForm,'toUsername',$event)" :disabled="  disabledJudge('toUsername')"/>
            </el-form-item>
            <el-form-item label="是否已读" prop="hadRead">
                <el-input show-style="origin" v-model="editForm.hadRead" placeholder="是否已读" :maxlength="1" @change="editSomeFields(editForm,'hadRead',$event)" :disabled="  disabledJudge('hadRead')"/>
            </el-form-item>
            <el-form-item label="跳转地址" prop="url">
                <el-input show-style="origin" v-model="editForm.url" placeholder="跳转地址" :maxlength="255" @change="editSomeFields(editForm,'url',$event)" :disabled="  disabledJudge('url')"/>
            </el-form-item>
        </el-form>
    </el-row>
    <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
            <el-button @click.native="close">关闭</el-button>
            <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
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
                queryById: NotifyMsgApi.queryNotifyMsgById,
                add: NotifyMsgApi.addNotifyMsg,
                edit: NotifyMsgApi.editNotifyMsg,
                editSomeFields: NotifyMsgApi.editSomeFieldsNotifyMsg
            },
            editable:true,//是否可编辑模式
        }
    },
    methods: {
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){

         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
            return true;
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
            if(this.editable==false){
                return false;
            }
            params[fieldName]=$event
            return true;
        },
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>