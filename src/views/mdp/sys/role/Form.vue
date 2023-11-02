<template>
    <el-row>
 	    <el-row>
		<!--新增/编辑界面 Role 角色管理-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="角色编号" prop="roleid">
					<el-input v-model="editForm.roleid" placeholder="角色编号" :maxlength="50" @change="editSomeFields(editForm,'roleid',$event)" :disabled="disabledJudge('roleid')"></el-input>
				</el-form-item> 
				<el-form-item label="角色名" prop="rolename">
					<el-input v-model="editForm.rolename" placeholder="角色名" :maxlength="255" @change="editSomeFields(editForm,'rolename',$event)" :disabled="disabledJudge('rolename')"></el-input>
				</el-form-item> 
                
				<el-form-item label="是否启用" prop="enabled">
					<mdp-select item-code="enabled" v-model="editForm.enabled" placeholder="是否启用" :maxlength="1" @change="editSomeFields(editForm,'enabled',$event)" :disabled="disabledJudge('enabled')"/>
				</el-form-item>   
				<el-form-item label="角色类型" prop="roletype">
                    <el-switch @change="editSomeFields(editForm,'roletype',$event)" :disabled="disabledJudge('roletype')"
					  v-model="editForm.roletype"
					  active-text="公共角色"
					  inactive-text="自定义角色"
					  active-value="1"
					  inactive-value="0">
					</el-switch>
					<div class="label-font-color">公共角色为全平台共享，不区分机构，自定义角色按机构划分，本机构只能查询本机构的角色</div>
 				</el-form-item> 
                
				<el-form-item label="数据访问等级" prop="dataLvl">
					<mdp-select item-code="dataLvl" v-model="editForm.dataLvl" :min="0" :max="200" :disabled="disabledJudge('dataLvl')"/>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input type="texteara" v-model="editForm.remark" placeholder="备注" :maxlength="255" @change="editSomeFields(editForm,'remark',$event)" :disabled="disabledJudge('remark')"></el-input>
				</el-form-item> 
				 
				<el-form-item label="角色排序" prop="sortOrder">
					<el-input v-model="editForm.sortOrder" placeholder="角色排序" :maxlength="2" :disabled="disabledJudge('sortOrder')"></el-input>
				</el-form-item> 
				<el-form-item label="创建日期" prop="crdate" v-if="currOpType!='add'">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.crdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('crdate')||true"></el-date-picker>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId" v-if="currOpType!='add'">
					<el-input v-model="editForm.branchId" placeholder="云用户机构编号" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)" :disabled="disabledJudge('branchId')"></el-input>
				</el-form-item>  
			</el-form>
		</el-row>

		<el-row  slot="footer">
		    <el-button @click.native="close()">关闭</el-button>
            <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
		</el-row> 
    </el-row>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as RoleApi from '@/api/mdp/sys/role';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'roleForm',
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
            pkNames:["roleid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                roleid:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ],
                rolename: [
                    { required: true, message: '角色名必输', trigger: 'blur' }
                ],
                roletype: [
                    { required: true, message: '角色类型必输', trigger: 'blur' }
                ],
                enabled: [
                    { required: true, message: '是否启用必输', trigger: 'blur' }
                ]
            },
            editForm: {
                roleid:'',rolename:'',remark:'',roletype:'',rolebeg:'',roleend:'',crdate:'',enabled:'',deptid:'',sortOrder:'',branchId:'',dataLvl:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: RoleApi.queryRoleById,
                add: RoleApi.addRole,
                edit: RoleApi.editRole,
                editSomeFields: RoleApi.editSomeFieldsRole
            }
        }
    },
    methods: {
        //由组件扩展添加其它的初始页面的逻辑
         initCurrData(){ 
            this.disabledRulesInit(this.disabledRules)
            Object.assign(this.editForm,this.formData)
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
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>