<template>
<section>
 	    <el-row>
		<!--新增/编辑界面 User 用户表-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				 
				<el-form-item label="用户名称" prop="username">
					<el-input v-model="editForm.username" placeholder="用户名称" :maxlength="128" @change="editSomeFields(editForm,'username',$event)" :disabled="disabledJudge('username')"></el-input>
				</el-form-item>  
				<el-form-item label="用户状态" prop="ustatus">
					<mdp-select item-code="ustatus" v-model="editForm.ustatus" placeholder="用户账户状态" :maxlength="1" @change="editSomeFields(editForm,'ustatus',$event)" :disabled="disabledJudge('ustatus')"/>
				</el-form-item> 
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="editForm.nickname" placeholder="昵称" :maxlength="128" @change="editSomeFields(editForm,'nickname',$event)" :disabled="disabledJudge('nickname')"></el-input>
				</el-form-item> 
				<el-form-item label="登录编号" prop="displayUserid">
					<el-input v-model="editForm.displayUserid" placeholder="登录用户编号" :maxlength="64" @change="editSomeFields(editForm,'displayUserid',$event)" :disabled="disabledJudge('displayUserid')"></el-input>
				</el-form-item>  
				<el-form-item label="用户编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="内部用户编号" :maxlength="64" @change="editSomeFields(editForm,'userid',$event)" :disabled="disabledJudge('userid')"></el-input>
				</el-form-item> 
				
				<el-form-item label="归属部门" prop="deptid" v-if="currOpType=='add'">
					<mdp-select-dept v-model="editForm.deptid" placeholder="内部用户编号" :maxlength="64" />
				</el-form-item>  
				<el-form-item label="协作类型" prop="cpaType">
                    <el-row type="flex">
                    <mdp-select item-code="cpaType" width="8em" v-model="editForm.cpaType"  placeholder="协作类型" @change="editSomeFields(editForm,'cpaType',$event)"></mdp-select>   
                    <mdp-select-table show-style="tag" placeholder="协作组织" :props="{id:'id',name:'branchName'}" v-model="editForm.cpaOrg" :load-fun="$mdp.listBranch" @change="editSomeFields(editForm,'cpaOrg',$event)"></mdp-select-table>
                        </el-row>
				</el-form-item> 
				<el-form-item label="性别" prop="sex">
 					<el-radio-group v-model="editForm.sex" @change="editSomeFields(editForm,'sex',$event)" :disabled="disabledJudge('sex')" >
				      <el-radio v-model="editForm.sex" label="0" border>男</el-radio>
				      <el-radio v-model="editForm.sex" label="1" border>女</el-radio>
				      <el-radio v-model="editForm.sex" label="2" border>其它</el-radio>
				    </el-radio-group>
				</el-form-item> 
				
				<el-form-item label="生日" prop="birthday">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birthday"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('birthday')"></el-date-picker>
				</el-form-item> 
				<el-form-item label="锁定" prop="locked">
					
					<el-radio-group v-model="editForm.locked"  @change="editSomeFields(editForm,'locked',$event)" :disabled="disabledJudge('locked')">
				     <el-radio v-model="editForm.locked" label="0" border>正常</el-radio>
				      <el-radio v-model="editForm.locked" label="1" border>已锁定</el-radio>
				    </el-radio-group>
 				</el-form-item> 
				<el-form-item label="启用日期" prop="startdate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('startdate')"></el-date-picker>
				</el-form-item> 
				<el-form-item label="到期日期" prop="enddate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.enddate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('enddate')"></el-date-picker>
				</el-form-item> 
				<el-form-item label="移动电话" prop="phoneno">
					<el-input v-model="editForm.phoneno" placeholder="移动电话号码" :maxlength="20" @change="editSomeFields(editForm,'phoneno',$event)" :disabled="disabledJudge('phoneno')"></el-input>
				</el-form-item> 
				
				<el-form-item label="办公电话" prop="officePhoneno">
					<el-input v-model="editForm.officePhoneno" placeholder="办公室电话" :maxlength="20" @change="editSomeFields(editForm,'officePhoneno',$event)" :disabled="disabledJudge('officePhoneno')"></el-input>
				</el-form-item>  
				
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email" placeholder="邮箱" :maxlength="50" @change="editSomeFields(editForm,'email',$event)" :disabled="disabledJudge('email')"></el-input>
				</el-form-item> 
				
				<el-form-item label="备用邮箱" prop="emailBak">
					<el-input v-model="editForm.emailBak" placeholder="备用邮箱" :maxlength="50" @change="editSomeFields(editForm,'emailBak',$event)" :disabled="disabledJudge('emailBak')"></el-input>
				</el-form-item> 
				<el-form-item label="国家" prop="country">
					<el-breadcrumb separator="/">
					  <el-breadcrumb-item>国家</el-breadcrumb-item>
					  <el-breadcrumb-item>省</el-breadcrumb-item>
					  <el-breadcrumb-item>市</el-breadcrumb-item>
					  <el-breadcrumb-item>区县</el-breadcrumb-item> 
					</el-breadcrumb>
 				</el-form-item> 
				 
				<el-form-item label="详细地址" prop="address">
					<el-input v-model="editForm.address" placeholder="详细地址" :maxlength="200" @change="editSomeFields(editForm,'address',$event)" :disabled="disabledJudge('address')"></el-input>
				</el-form-item> 
				 
  
				<el-form-item label="身份证号码" prop="idCardNo">
					<el-input v-model="editForm.idCardNo" placeholder="身份证号码" :maxlength="500" @change="editSomeFields(editForm,'idCardNo',$event)" :disabled="disabledJudge('idCardNo')"></el-input>
				</el-form-item>  
				<el-form-item label="审批状态" prop="bizFlowState">
					<mdp-select v-model="editForm.bizFlowState" item-code="bizFlowState" :disabled="true"></mdp-select>
 				</el-form-item> 
				 
				<el-form-item label="更新日期" prop="ltime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ltime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('ltime')"></el-date-picker>
				</el-form-item>  
				<el-form-item label="归属机构号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="归属的机构编号" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)" :disabled="disabledJudge('branchId')"></el-input>
				</el-form-item> 
				  <!--
				<el-form-item label="职业类型" prop="profeType">
					<mdp-select item-code="profeType" v-model="editForm.profeType" placeholder="职业类型" :maxlength="50" @change="editSomeFields(editForm,'profeType',$event)" :disabled="disabledJudge('profeType')"/>
				</el-form-item> 
				<el-form-item label="职业" prop="profeId">
					<mdp-select v-model="editForm.profeId" item-code="profe_list" @change2="editSomeFields(editForm,'profeId',$event)" :disabled="disabledJudge('profeId')"></mdp-select>
 				</el-form-item>  
				 
				<el-form-item label="等级会员名称" prop="gradeName">
					<mdp-select item-code="mem_grade"  v-model="editForm.gradeName" placeholder="等级会员名称" :maxlength="50" @change="editSomeFields(editForm,'gradeName',$event)" :disabled="disabledJudge('gradeName')"/>
				</el-form-item>  
				<el-form-item label="权益等级" prop="ilvlName">
					<mdp-select item-code="memInterestLvl" v-model="editForm.ilvlName" placeholder="权益等级名称" :maxlength="255" @change2="editSomeFields(editForm,'ilvlName',$event)" :disabled="disabledJudge('ilvlName')"/>
				</el-form-item> 
				<el-form-item label="权益状态" prop="istatus">
					<mdp-select item-code="istatus" v-model="editForm.istatus" placeholder="会员权益状态" :maxlength="1" @change="editSomeFields(editForm,'istatus',$event)" :disabled="disabledJudge('istatus')"/>
				</el-form-item> 
				<el-form-item label="权益开始时间" prop="istime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.istime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('istime')"></el-date-picker>
				</el-form-item> 
				<el-form-item label="权益结束时间" prop="ietime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ietime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="disabledJudge('ietime')"></el-date-picker>
				</el-form-item> 
				 
				<el-form-item label="个性化签名" prop="features">
					<el-input v-model="editForm.features" placeholder="个性化签名" :maxlength="255" @change="editSomeFields(editForm,'features',$event)" :disabled="disabledJudge('features')"></el-input>
				</el-form-item> 
				<el-form-item label="信用等级编号" prop="creditId">
					<el-input v-model="editForm.creditId" placeholder="信用等级编号" :maxlength="50" @change="editSomeFields(editForm,'creditId',$event)" :disabled="disabledJudge('creditId')"></el-input>
				</el-form-item> 
				<el-form-item label="信用等级分数" prop="creditScore">
					<el-input-number v-model="editForm.creditScore" :min="0" :max="200" :disabled="disabledJudge('creditScore')"></el-input-number>
				</el-form-item> 
				<el-form-item label="服务保障等级0-初始，1-金，2-银，3-铜" prop="guardId">
					<el-input v-model="editForm.guardId" placeholder="服务保障等级0-初始，1-金，2-银，3-铜" :maxlength="1" @change="editSomeFields(editForm,'guardId',$event)" :disabled="disabledJudge('guardId')"></el-input>
				</el-form-item> 
				<el-form-item label="是否对互联网用户开放查询0-否1是" prop="open">
					<el-input v-model="editForm.open" placeholder="是否对互联网用户开放查询0-否1是" :maxlength="1" @change="editSomeFields(editForm,'open',$event)" :disabled="disabledJudge('open')"></el-input>
				</el-form-item> 
				<el-form-item label="简介备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="简介备注" :maxlength="255" @change="editSomeFields(editForm,'remark',$event)" :disabled="disabledJudge('remark')"></el-input>
				</el-form-item> 
				<el-form-item label="营业时间说明09:00-12:00" prop="bizHours">
					<el-input v-model="editForm.bizHours" placeholder="营业时间说明09:00-12:00" :maxlength="255" @change="editSomeFields(editForm,'bizHours',$event)" :disabled="disabledJudge('bizHours')"></el-input>
				</el-form-item> 
				<el-form-item label="技能编号列表" prop="skillIds">
					<el-input v-model="editForm.skillIds" placeholder="技能编号列表" :maxlength="255" @change="editSomeFields(editForm,'skillIds',$event)" :disabled="disabledJudge('skillIds')"></el-input>
				</el-form-item> 
				<el-form-item label="技能名称列表" prop="skillNames">
					<el-input v-model="editForm.skillNames" placeholder="技能名称列表" :maxlength="255" @change="editSomeFields(editForm,'skillNames',$event)" :disabled="disabledJudge('skillNames')"></el-input>
				</el-form-item> 
				-->
			</el-form>
		</el-row>

		<el-row  slot="footer"  v-if="showBtn==true">
		    <el-button @click.native="handleCancel">关闭</el-button>
            <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
		</el-row>
 </section>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as UserApi from '@/api/mdp/sys/user';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

export default {
    name:'userForm',
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
		var validatePhoneno = (rule, value, callback) => {
				if (!value) {
					callback();
				} else {
				if (value) {
					if(value.length<11 || value.length>11){
						callback(new Error('手机号码必须11位'));
					}
					if(!(/^1[3456789]\d{9}$/.test(value))){ 
						callback(new Error('手机号码格式不正确'));
					}

				}
				callback();
				}
			};
			
			var validateEmail = (rule, value, callback) => {
				if (!value) {
					callback();
				} else {
				if (value !== '') {
					var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
					if(!reg.test(value)){
						 callback(new Error('邮箱格式不正确'));
					}  
				}
				callback();
				}
			};
			
			var validateIdCardNo = (rule, value, callback) => {
				if (!value) {
				//callback(nPhonenoew Error('请输入密码'));
					callback();
				}else {
					if (value !== '' && value.length>15) {
						var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
						if(!reg.test(value)){
							callback(new Error('身份证号码格式不正确'));
						}else{
							callback();
						}
					}else if(value !== '' && value.length<15){
						callback(new Error('请输入15位或者18位长度身份证号码'));
					}else{
						callback();
					}
				
				}
			}; 
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["userid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
				displayUserid: [
					{ required: true, message: '账号必填', trigger: 'blur' }
				],
				username: [
					{ required: true, message: '用户名称必填', trigger: 'blur' }
				],
				nickname: [
					{ required: true, message: '昵称必填', trigger: 'blur' }
				],
				phoneno: [ 
					{ validator:validatePhoneno, trigger: 'blur' }
				]  , 
				email: [ 
					{ validator:validateEmail, trigger: 'blur' }
				] ,
				idCardNo: [ 
					{ validator:validateIdCardNo, trigger: 'blur' }
				] 
            },
            editForm: {
                unionid:'',displayUserid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',password:'',salt:'',pwdtype:'',headimgurl:'',country:'',city:'',province:'',address:'',sex:'',enddate:'',districtId:'',email:'',fgOne:'',fgTwo:'',fgThr:'',idCardNo:'',officePhoneno:'',bizProcInstId:'',bizFlowState:'',memType:'',orgId:'',emailBak:'',pwdStrong:'',lockType:'',lockRemark:'',ltime:'',atype:'',branchId:'',continent:'',cpaType:'',cpaOrg:'',roleids:'',birthday:'',shopId:'',profeId:'',profeName:'',gradeId:'',gradeName:'',ilvlId:'',ilvlName:'',istatus:'',istime:'',ietime:'',validLvls:'',features:'',profeType:'',ustatus:'',creditId:'',creditScore:'',guardId:'',open:'',remark:'',bizHours:'',skillIds:'',skillNames:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: UserApi.queryUserById,
                add: UserApi.addUser,
                edit: UserApi.editUser,
                editSomeFields: UserApi.editSomeFieldsUser
            },
			deptid:'',
        }
    },
    methods: {
        //由组件扩展添加其它的初始页面的逻辑
         initCurrData(){
            this.disabledRulesInit(this.disabledRules)
         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
			params={user:params}
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
		//新增、编辑提交@submit="afterFormSubmit"
        saveSubmit: function () {
            var form=this.$refs['editFormRef'];
            if(!form){ 
                form=this.$refs['editForm'];
            } 
            form.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => { 
                        this.load.edit=true
                        let params = Object.assign({}, this.editForm);
						params={user:params,userDept:{deptid:this.deptid}}
                        if(!this.preParamCheck(params)){
                            this.load.edit=false
                            return;
                        } 
                        var func=this.apis.add
                        if(this.currOpType=='edit'){
                            func=this.apis.edit
                        }
                        func(params).then((res) => { 
                            this.load.edit=false
                            var tips=res.data.tips;
                            if(tips.isOk){  
                                this.afterSubmit(res,tips.isOk,this.currOpType);
                            }
                            this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                        }).catch( err =>this.load.edit=false);
                    });
                }else{
                    this.$notify({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
                }
            });
        }, 
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>