<template>
<section>
 	    <el-row>
		<!--新增/编辑界面 Dept sys_dept-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="部门编号" prop="deptid">
					<el-input  v-model="editForm.deptid" placeholder="部门编号，为空则后台自动生成" :maxlength="40" @change="editSomeFields(editForm,'deptid',$event)" :disabled="disabledJudge('deptid') || currOpType=='edit'"></el-input>
                </el-form-item>  
				<el-form-item label="部门编码" prop="displayDeptid">
					<el-input v-model="editForm.displayDeptid" placeholder="部门编码外部使用" :maxlength="40" @change="editSomeFields(editForm,'displayDeptid',$event)" :disabled="disabledJudge('displayDeptid')"></el-input>
				</el-form-item> 
				<el-form-item label="部门全称" prop="deptName">
					<el-input v-model="editForm.deptName" placeholder="部门全称" :maxlength="64" @change="editSomeFields(editForm,'deptName',$event)" :disabled="disabledJudge('deptName') || true"></el-input>
				</el-form-item> 
                
				<el-form-item label="简称" prop="shortName">
					<el-input v-model="editForm.shortName" placeholder="简称" :maxlength="50" @change="editSomeFields(editForm,'shortName',$event)" :disabled="disabledJudge('shortName')"></el-input>
				</el-form-item> 
				<el-form-item label="上级部门编号" prop="pdeptid">
					<el-input v-model="editForm.pdeptid" placeholder="上级部门编号" :maxlength="40" @change="editSomeFields(editForm,'pdeptid',$event)" :disabled="disabledJudge('pdeptid')||true"></el-input>
				</el-form-item> 
                
				<el-form-item label="负责人名称" prop="manager">
					<mdp-select-user show-style="origin" v-model="editForm.manager" placeholder="负责人名称" :maxlength="40" @change2="editSomeFields(editForm,'manager',$event)" :disabled="disabledJudge('manager')"></mdp-select-user>
				</el-form-item> 
				<el-form-item label="上级领导名称" prop="leader">
					<mdp-select-user show-style="origin"  v-model="editForm.leader" placeholder="上级领导名称" :maxlength="40" @change2="editSomeFields(editForm,'leader',$event)" :disabled="disabledJudge('leader')"></mdp-select-user>
				</el-form-item>  
				<el-form-item label="机构类型" prop="deptType">
					<mdp-select item-code="orgType" v-model="editForm.orgType" placeholder="机构类型" :maxlength="40" @change="editSomeFields(editForm,'orgType',$event)" :disabled="disabledJudge('orgType')"/>
				</el-form-item> 
				<el-form-item label="部门性质" prop="deptType">
					<mdp-select item-code="deptType" v-model="editForm.deptType" placeholder="部门性质" :maxlength="40" @change="editSomeFields(editForm,'deptType',$event)" :disabled="disabledJudge('deptType')"/>
				</el-form-item> 
				<el-form-item label="协作类型" prop="cpaType">
                    <el-row type="flex">
                    <mdp-select item-code="cpaType" width="8em" v-model="editForm.cpaType"  placeholder="协作类型" @change="editSomeFields(editForm,'cpaType',$event)"></mdp-select>   
                    <mdp-select-table show-style="tag" placeholder="协作组织" :props="{id:'id',name:'branchName'}" v-model="editForm.cpaBranchId" :load-fun="$mdp.listBranch" @change="editSomeFields(editForm,'cpaBranchId',$event)"></mdp-select-table>
                        </el-row>
				</el-form-item> 

				<el-form-item label="状态" prop="state"> 
					<el-radio-group v-model="editForm.state" >
				      <el-radio v-model="editForm.state" label="A">启用</el-radio>
				      <el-radio v-model="editForm.state" label="E">停用</el-radio>
				    </el-radio-group>
 				</el-form-item> 
				<el-form-item label="层级" prop="levelType">
					<mdp-select item-code="deptLvl" v-model="editForm.levelType" placeholder="层级类型" :maxlength="20" @change="editSomeFields(editForm,'levelType',$event)" :disabled="disabledJudge('levelType')"/>
				</el-form-item> 
				<el-form-item label="审批状态" prop="bizFlowState">
					<mdp-select item-code="bizFlowState" v-model="editForm.bizFlowState" placeholder="当前流程状态" :maxlength="1" @change="editSomeFields(editForm,'bizFlowState',$event)" :disabled="disabledJudge('bizFlowState')"/>
				</el-form-item> 
				<el-form-item label="最后更新时间" prop="ltime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ltime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('ltime')"></el-date-picker>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row v-if="showBtn!==false" class="footer">
		    <el-button @click.native="close">关闭</el-button>
            <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
		</el-row> 
 </section>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as DeptApi from '@/api/mdp/sys/dept';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import UserSelect from '../user/UserSelect.vue'; 
export default {
    name:'deptForm',
    mixins:[MdpFormMixin],
    components: {
        UserSelect
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
            pkNames:["deptid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                deptid:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                deptid:'',deptName:'',pdeptid:'',deptType:'',state:'',manager:'',leader:'',shortName:'',displayDeptid:'',orgType:'',managerName:'',leaderName:'',branchId:'',levelType:'',idPath:'',bizProcInstId:'',bizFlowState:'',ltime:'',isCbCenter:'',cpaType:'',cpaBranchId:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: DeptApi.queryDeptById,
                add: DeptApi.addDept,
                edit: DeptApi.editDept,
                editSomeFields: DeptApi.editSomeFieldsDept
            }
        }
    },
    methods: {
        //由组件扩展添加其它的初始页面的逻辑
         initCurrData(){
            this.disabledRulesInit(this.disabledRules)
            
            if(this.currOpType=='subAdd'){
                var data=this.parentDept;
                this.editForm.pdeptid=data.deptid;
                this.editForm.branchId=data.branchId;
                this.editForm.levelType =data.levelType;
                var a=this.editForm.levelType.split("L").join("");//字符串转数字
                var leve = Number(a);
                this.editForm.levelType = "L"+(leve+1);//字母数字组合
            }else if(this.currOpType=='add'){
                this.editForm.pdeptid='A0'
                this.editForm.levelType="L1"
                this.editForm.branchId=this.userInfo.branchId
            }
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
            if(fieldName=='manager'){
                row.managerName=$event.username
                params.managerName=$event.username
                params.manager=$event.userid
            }else if(fieldName=='leader'){
                row.leaderName=$event.username
                params.leaderName=$event.username
                params.leader=$event.userid
            }else{
                params[fieldName]=$event
            }
           
            return true;
        }, 
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>