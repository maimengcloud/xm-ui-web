<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmTestCasedb 测试用例库--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
			
				<el-form-item label="用例库名称" prop="name">
					<el-input v-model="editForm.name" placeholder="用例库名称" :maxlength="255" @change="editSomeFields(editForm,'name',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="测试库编号" prop="id">
					<el-input v-if="opType=='add'" v-model="editForm.id" placeholder="测试库编号" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"></el-input>
					<div v-else>{{editForm.id}}</div>
				</el-form-item>  
				
				<el-form-item label="产品名称" prop="productName">
					 <xm-product-select v-if="!xmProduct" style="display:inline;" :auto-select="false" :link-project-id="selProject?selProject.id:null" @row-click="onProductSelected" @clear="clearProduct"></xm-product-select>
 					<div v-else>{{editForm.productName}}</div>
				</el-form-item> 
				<el-form-item label="创建人姓名" prop="cusername">
					<el-input v-if="opType=='add'" v-model="editForm.cusername" placeholder="创建人姓名" :maxlength="255" @change="editSomeFields(editForm,'cusername',$event)"></el-input>
					<div v-else>{{editForm.cusername}}</div>
				</el-form-item> 
				<el-form-item label="创建日期" prop="ctime">
					 {{editForm.ctime}}
				</el-form-item>   
			</el-form>
		</el-row>

		<el-row v-if="opType=='add'" class="page-bottom bottom-fixed">
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
	
import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//修改界面
	export default {
	    name:'xmTestCasedbEdit',
	    components: {
			XmProductSelect,
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
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
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
                params[fieldName]=$event
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