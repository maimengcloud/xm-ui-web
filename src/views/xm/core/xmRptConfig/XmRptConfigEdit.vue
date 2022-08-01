<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmRptConfig 测试报告配置表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="业务编号" prop="bizId">
					<el-input v-model="editForm.bizId" placeholder="业务编号" :maxlength="50" @change="editSomeFields(editForm,'bizId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="报告编号" prop="id">
					<el-input v-model="editForm.id" placeholder="报告编号" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="报告名称" prop="name">
					<el-input v-model="editForm.name" placeholder="报告名称" :maxlength="255" @change="editSomeFields(editForm,'name',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建人" prop="cuserid">
					<el-input v-model="editForm.cuserid" placeholder="创建人" :maxlength="50" @change="editSomeFields(editForm,'cuserid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建人姓名" prop="cusername">
					<el-input v-model="editForm.cusername" placeholder="创建人姓名" :maxlength="255" @change="editSomeFields(editForm,'cusername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="创建机构" prop="cbranchId">
					<el-input v-model="editForm.cbranchId" placeholder="创建机构" :maxlength="50" @change="editSomeFields(editForm,'cbranchId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="报告配置项" prop="cfg">
					<el-input v-model="editForm.cfg" placeholder="报告配置项" :maxlength="2147483647" @change="editSomeFields(editForm,'cfg',$event)"></el-input>
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
 	import { initDicts, addXmRptConfig,editXmRptConfig,editSomeFieldsXmRptConfig } from '@/api/xm/core/xmRptConfig';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmRptConfigEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmRptConfig','visible','opType'],

		watch: {
	      'xmRptConfig':function( xmRptConfig ) {
	        if(xmRptConfig){
	            this.editForm = {...xmRptConfig};
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
						//{ required: true, message: '报告编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					bizId:'',id:'',name:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',cfg:''
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
			//新增、编辑提交XmRptConfig 测试报告配置表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmRptConfig
							if(this.currOpType=='edit'){
							    func=editXmRptConfig
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
			    if(this.xmRptConfig){
                    this.editForm = Object.assign({},this.xmRptConfig);
                }

                if(this.opType=='edit'){

                }else{

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
                var func = editSomeFieldsXmRptConfig
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