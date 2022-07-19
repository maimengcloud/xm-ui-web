<template>
	<section>
	    <el-row>
	    </el-row>
		<el-row>
		<!--编辑界面 XmTestCase 测试用例--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left"> 
				<el-form-item label="标题" prop="caseName">
					<el-input v-model="editForm.caseName" placeholder="标题" :maxlength="255" @change="editSomeFields(editForm,'caseName',$event)"></el-input>
				</el-form-item>  
				
				<el-form-item label="版本号" prop="verNum">
					<el-input v-model="editForm.verNum" placeholder="版本号" :maxlength="50" @change="editSomeFields(editForm,'verNum',$event)"></el-input>
				</el-form-item>  
				<el-form-item label="测试步骤" prop="testStep">
					 <test-step-config v-model="editForm.testStep" @finish="editSomeFields(editForm,'testStep',$event)"></test-step-config>
				</el-form-item>    
				<el-form-item label="关联需求" prop="menuName">
					 {{editForm.menuName?editForm.menuName:'暂无关联需求'}} <el-button type="text" @click="menuVisible=true">选择需求</el-button>
				</el-form-item> 
				<el-form-item label="关联模块" prop="funcName">
					{{editForm.funcName?editForm.funcName:'暂无关联模块'}} <el-button type="text" @click="funcVisible=true">选择模块</el-button>
				</el-form-item>  
				<el-form-item label="状态" prop="caseStatus" v-if="opType!='add'">
 					    <el-select v-model="editForm.caseStatus" @change="editSomeFields(editForm,'caseStatus',$event)">
							<el-option v-for="(item,index) in dicts['testCaseStatus']" :key="index" :value="item.id" :label="item.name"></el-option>
						</el-select>
				</el-form-item>  
				<el-form-item label="负责人" prop="cusername">
					<el-input v-model="editForm.cusername" placeholder="负责人" :maxlength="255" @change="editSomeFields(editForm,'cusername',$event)"></el-input>
				</el-form-item>  
			</el-form>
		</el-row>

		<el-row v-if="opType=='add'" >
			<span style="float:right;">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
			</span>
		</el-row>
		<el-dialog append-to-body title="需求选择"  :visible.sync="menuVisible" width="80%" top="20px"  :close-on-click-modal="false">
			<xm-menu-select :is-select-menu="true" checkScope="3"  @selected="onMenuSelected" :xm-product="{id:editForm.productId}"></xm-menu-select>
		</el-dialog>
		<el-dialog append-to-body title="模块选择"  :visible.sync="funcVisible" width="60%" top="20px"  :close-on-click-modal="false">
			<xm-func-select  @row-click="onFuncSelected" :xm-product="{id:editForm.productId}"></xm-func-select>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addXmTestCase,editXmTestCase,editSomeFieldsXmTestCase } from '@/api/xm/core/xmTestCase';
	import { mapGetters } from 'vuex'
	import XmMenuSelect from '../xmMenu/XmMenuSelect' 
	import XmFuncSelect from '../xmFunc/XmFuncSelect'
import TestStepConfig from './TestStepConfig.vue';
	export default {
	    name:'xmTestCaseEdit',
	    components: {
			XmMenuSelect,XmFuncSelect,
TestStepConfig,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTestCase','visible','opType'],

		watch: {
	      'xmTestCase':function( xmTestCase ) {
	        if(xmTestCase){
	            this.editForm = {...xmTestCase};
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
 	      		this.initData()
	      	}
	      } 
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',caseName:'',caseRemark:'',testStep:'',expectResult:'',menuId:'',menuName:'',ctime:'',ltime:'',luserid:'',lusername:'',cbranchId:'',moduleId:'',moduleName:'',caseStatus:'',cuserid:'',cusername:'',productId:'',verNum:'',casedbId:'',casedbName:''
				},
                maxTableHeight:300,
				menuVisible:false,
				funcVisible:false,
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmTestCase 测试用例父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmTestCase
							if(this.currOpType=='edit'){
							    func=editXmTestCase
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.data.tips;
                                if(tips.isOk){
                                    this.editForm=res.data.data
                                    this.initData()
                                    this.currOpType="edit";
                                    this.$emit('submit');//  @submit="afterAddSubmit"
                                }
                                this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmTestCase){
                    this.editForm = Object.assign({},this.xmTestCase);
                }

                if(this.opType=='edit'){

                }else{
					if(this.xmTestCasedb && this.xmTestCasedb.id){
						this.editForm.productId=this.xmTestCasedb.productId
						this.editForm.productName=this.xmTestCasedb.productName
						this.editForm.casedbId=this.xmTestCasedb.id
						this.editForm.casedbName=this.xmTestCasedb.name
					}
					
                }
                this.editFormBak={...this.editForm}
            },

            editSomeFields(row,fieldName,$event){
                if(this.opType=='add'){
                    return;
                }
                let params={};
                params['ids']=[row].map(i=>i.id)
                params[fieldName]=$event
                var func = editSomeFieldsXmTestCase
                func(params).then(res=>{
                  let tips = res.data.tips;
                  if(tips.isOk){
                    this.editFormBak=[...this.editForm]
                  }else{
                    Object.assign(this.editForm,this.editFormBak)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
            },
			onMenuSelected(row){
				this.editForm.menuId=row.menuId
				this.editForm.menuName=row.menuName
				this.menuVisible=false;
			},
			onFuncSelected(row){
				this.editForm.funcId=row.id
				this.editForm.funcName=row.name
				this.funcVisible=false;
			}
		},//end method
		mounted() {
		    this.$nextTick(() => {
                initDicts(this);
                this.initData() 
            });
		}
	}

</script>

<style scoped>

</style>