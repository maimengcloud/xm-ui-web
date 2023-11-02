<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="140px" :rules="editFormRules" ref="editForm">  
				<el-card>
					<div slot="header" class="clearfix">
						<span>其它人【查询】分类数据(文章、附件等)的权限</span>
						<el-checkbox v-model="editForm.othQuery" true-label="1" false-label="0">可查询</el-checkbox>
					</div> 
					<span v-if="editForm.othQuery=='1'"> 
						<el-form-item label="允许哪些角色查询" prop="qryRoleids" >
							<mdp-select  :multiple="true" v-model="editForm.qryRoleids"   placeholder="请选择" split="," :options="roles" :props="{id:'roleid',name:'rolename'}"/>
						</el-form-item> 
						<el-form-item label="禁止哪些角色查询" prop="nqRoleids" > 
							<mdp-select :multiple="true" v-model="editForm.nqRoleids"   placeholder="请选择" split="," :options="roles" :props="{id:'roleid',name:'rolename'}"/>
						</el-form-item> 
						<el-form-item label="允许哪些部门查询" prop="qryDeptids"> 
							<mdp-select-dept  v-model="editForm.qryDeptids" multiple  split=","/>
						</el-form-item>  
						<el-form-item label="禁止哪些部门查询" prop="nqDeptids">
							<mdp-select-dept  v-model="editForm.nqDeptids" multiple  split=","/>
						</el-form-item> 
						<el-form-item label="允许哪些人查询" prop="qryUserids" >
							<mdp-select-user :multiple="true" v-model="editForm.qryUserids"   placeholder="请选择" split=","/>  
						</el-form-item> 
						<el-form-item label="禁止哪些人查询" prop="nqUserids"  > 
							<mdp-select-user :multiple="true" v-model="editForm.nqUserids"   placeholder="请选择" split=","/> 
						</el-form-item>   
					</span>
				</el-card> 
				
				<el-card>
					<div slot="header" class="clearfix">
						<span>其它人【修改】分类数据(文章、附件等)的权限</span>
						<el-checkbox v-model="editForm.othEdit" true-label="1" false-label="0">可修改</el-checkbox>
					</div> 
					<span v-if="editForm.othEdit=='1'"> 
						<el-form-item label="允许哪些角色修改" prop="editRoleids" >
							<mdp-select  :multiple="true" v-model="editForm.editRoleids"   placeholder="请选择" split="," :options="roles" :props="{id:'roleid',name:'rolename'}"/>
						</el-form-item> 
						<el-form-item label="禁止哪些角色修改" prop="neRoleids" > 
							<mdp-select :multiple="true" v-model="editForm.neRoleids"   placeholder="请选择" split="," :options="roles" :props="{id:'roleid',name:'rolename'}"/>
						</el-form-item> 
						<el-form-item label="允许哪些部门修改" prop="editDeptids"> 
							<mdp-select-dept  v-model="editForm.editDeptids" multiple  split=","/>
						</el-form-item>  
						<el-form-item label="禁止哪些部门修改" prop="neDeptids">
							<mdp-select-dept  v-model="editForm.neDeptids" multiple  split=","/>
						</el-form-item> 
						<el-form-item label="允许哪些人修改" prop="editUserids" >
							<mdp-select-user :multiple="true" v-model="editForm.editUserids"   placeholder="请选择" split=","/>  
						</el-form-item> 
						<el-form-item label="禁止哪些人修改" prop="neUserids"  > 
							<mdp-select-user :multiple="true" v-model="editForm.neUserids"   placeholder="请选择" split=","/> 
						</el-form-item>   
					</span>
				</el-card> 
				
				<el-card>
					<div slot="header" class="clearfix">
						<span>其它人【删除】分类数据(文章、附件等)的权限</span>
						<el-checkbox v-model="editForm.othDel" true-label="1" false-label="0">可删除</el-checkbox>
					</div> 
					<span v-if="editForm.othDel=='1'"> 
						<el-form-item label="允许哪些角色删除" prop="delRoleids" >
							<mdp-select  :multiple="true" v-model="editForm.delRoleids"   placeholder="请选择" split="," :options="roles" :props="{id:'roleid',name:'rolename'}"/>
						</el-form-item> 
						<el-form-item label="禁止哪些角色删除" prop="ndRoleids" > 
							<mdp-select :multiple="true" v-model="editForm.ndRoleids"   placeholder="请选择" split="," :options="roles" :props="{id:'roleid',name:'rolename'}"/>
						</el-form-item> 
						<el-form-item label="允许哪些部门删除" prop="delDeptids"> 
							<mdp-select-dept  v-model="editForm.delDeptids" multiple split=","/>
						</el-form-item>  
						<el-form-item label="禁止哪些部门删除" prop="ndDeptids">
							<mdp-select-dept  v-model="editForm.ndDeptids" multiple split=","/>
						</el-form-item> 
						<el-form-item label="允许哪些人删除" prop="delUserids" >
							<mdp-select-user :multiple="true" v-model="editForm.delUserids"   placeholder="请选择" split=","/>  
						</el-form-item> 
						<el-form-item label="禁止哪些人删除" prop="ndUserids"  > 
							<mdp-select-user :multiple="true" v-model="editForm.ndUserids"   placeholder="请选择" split=","/> 
						</el-form-item>   
					</span>
				</el-card> 
			</el-form>
		</el-row> 
		<el-row class="footer">   
			<el-button @click.native="close()">关闭</el-button>  
			<el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>   
		</el-row> 
	</section>
</template>

<script>
 import { mapGetters } from 'vuex'
 
import { MdpFormMixin } from '../../mdp-ui/mixin/MdpFormMixin.js';
export default { 
    mixins:[MdpFormMixin],
	computed: {
		...mapGetters([
			'userInfo'
		])
	},
	props:{
		category:{
			type:Object,
			default:{},
		}
	},
	watch: {  
	},
	data() {
		return {
			menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["cateId"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                id:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },			
			editForm: {
				cateId:'',qryRoleids:'',qryDeptids:'',qryUserids:'',nqRoleids:'',nqDeptids:'',nqUserids:'',editRoleids:'',editDeptids:'',editUserids:'',neRoleids:'',neDeptids:'',neUserids:'',delRoleids:'',delDeptids:'',delUserids:'',ndRoleids:'',nddDeptids:'',ndUserids:'',othQuery:'0',othEdit:'0',othDel:'0',lvlCheck:'0',qryMinLvl:'',editMinLvl:'',delMinLvl:''
			},
            //增删改查(含批量)接口
            apis:{
                queryById: this.$mdp.queryCategoryQxById,
                add: this.$mdp.addCategoryQx,
                edit: this.$mdp.editCategoryQx,
                editSomeFields: this.$mdp.editSomeFieldsCategoryQx
            },
            editable:false,//是否可编辑模式

 
		}//end return
	},//end data
	methods: { 
		//由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
		initCurrData(){ 
			this.getCategoryQx();
			if(this.category && this.category.id){
				this.editForm.cateId=this.category.id
			}
         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
			if(this.currOpType=='add'){
				params.cateId=this.category.id
			}
			
            return true;
        },

        /**
          * 设置某个关键词、按钮、输入框禁用 disabledRules['addBtn']=false
          * 判断某个对象是否可编辑 this.disabledJudge('addBtn')==false
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
		 
		getCategoryQx: function(){
			if(!this.category || !this.category.id || this.category.id==''){
				return;
			}
			let params={cateId:this.category.id}
			this.load.list = true;
			this.apis.queryById(params).then((res) => {
				var tips=res.data.tips;
				if( tips.isOk){   
					if(res.data.data && res.data.data.cateId){
						this.currOpType='edit'
						this.editForm=Object.assign({}, res.data.data);     
					}else{
						this.currOpType='add'
						this.editForm={...this.formDataInit}  
					}
				}else{
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					this.editForm={...this.CategoryQxInit}  
				} 
				this.load.list = false;
			}).catch( err => this.load.list = false );
		}
		/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			
		/**end 在上面加自定义方法**/
	},//end method
	components: {   
	},
	mounted() { 
		this.$mdp.listRole({branchId:"$IN"+this.userInfo.branchId+","+"platform-branch-001"}).then(res=>this.roles=res.data.data) 
	}
}

</script>

<style scoped>

</style>