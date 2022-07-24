<template>
	<section class="padding"> 
		<el-row  ref="table">
		<!--编辑界面 XmTestCasedb 测试用例库--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left">
			

				<el-form-item label="归属产品" prop="productName">
					<span v-if="opType=='add'">
					 	<xm-product-select v-if="!xmProduct" style="display:inline;" :auto-select="false" :link-project-id="selProject?selProject.id:null" @row-click="onProductSelected" @clear="clearProduct"></xm-product-select>
						<div v-else>{{editForm.productName}}</div>
					</span> 
 					<div v-else>{{editForm.productName}}</div>
				</el-form-item>  
				<el-form-item label="用例库名称" prop="name">
					<my-input v-model="editForm.name" placeholder="用例库名称" :maxlength="255" @change="editSomeFields(editForm,'name',$event)"></my-input>
				</el-form-item>  
				<el-row class="padding">
					<el-col :span="8">
						<el-form-item prop="cuserid" label-width="0px">
							<mdp-select-user-xm label="负责人" userid-key="cuserid" username-key="cusername" v-model="editForm" @change="editSomeFields(editForm,'cuserid',$event)"></mdp-select-user-xm>
						</el-form-item>  
					</el-col>
					<el-col :span="8">
						 
						<mdp-select-user-xm label="状态" :dict="dicts['casedbStatus']" v-model="editForm.status"  @change="editSomeFields(editForm,'status',$event)"></mdp-select-user-xm>
						 
					</el-col>
					
					<el-col :span="8">
					 
						<mdp-date-x label="创建日期" v-model="editForm.ctime"  @change="editSomeFields(editForm,'ctime',$event)"></mdp-date-x>
					</el-col>
				</el-row>    
			</el-form>
		</el-row>

		<el-row v-if="opType=='add'" style="float:right;">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addXmTestCasedb,editXmTestCasedb,editSomeFieldsXmTestCasedb } from '@/api/xm/core/xmTestCasedb';
	import { mapGetters } from 'vuex'
	
import  XmUserField from '@/views/xm/core/components/MdpSelectUserXm';//修改界面
import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//修改界面

	export default {
	    name:'xmTestCasedbEdit',
	    components: {
			XmProductSelect,XmUserField,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTestCasedb','visible','opType','xmProduct','selProject'],

		watch: {
	      'xmTestCasedb':function( xmTestCasedb ) {
	        if(xmTestCasedb){
	            this.editForm = {...xmTestCasedb};
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
				dicts:{casedbStatus:[]},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					name: [
						{ required: true, message: '测试库名称不能为空', trigger: 'change' },
						{ max:50,min:2, message: '测试库名称2-50个字符之间', trigger: 'change' }
					],
					productName: [
						{ required: true, message: '产品不能为空', trigger: 'change' }
					]
				},
				editForm: {
					id:'',name:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',productId:'',productName:''
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmTestCasedb 测试用例库父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmTestCasedb
							if(this.currOpType=='edit'){
							    func=editXmTestCasedb
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
			    if(this.xmTestCasedb){
                    this.editForm = Object.assign({},this.xmTestCasedb);
                }

                if(this.opType=='edit'){

                }else{
					if(this.xmProduct && this.xmProduct.id){
						this.editForm.productId=this.xmProduct.id
						this.editForm.productName=this.xmProduct.productName
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
				if(fieldName=='cuserid'){
					params.cuserid=$event[0].userid
					params.cusername=$event[0].username
				}else{
					params[fieldName]=$event
				}
                
                var func = editSomeFieldsXmTestCasedb
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

			clearProduct(){  
				
				this.editForm.productId=''
				this.editForm.productName=''
			}, 
			onProductSelected(product){  
				this.editForm.productId=product.id
				this.editForm.productName=product.productName
				this.editForm.name=this.editForm.productName+"-测试库-V1.0"
			},
		},//end method
		mounted() {
		    this.$nextTick(() => {
                initDicts(this);
                this.initData()
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style scoped>

</style>