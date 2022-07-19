<template>
	<section> 
		<el-row ref="table" class="padding">
		<!--编辑界面 XmFunc 功能模块表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">

				<el-form-item label="编号" prop="id">
					<el-input v-model="editForm.id" :disabled="opType!='add'" placeholder="编号，留空则后台自动生成" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"></el-input>
				</el-form-item>   
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" placeholder="名称" :maxlength="255" @change="editSomeFields(editForm,'name',$event)"></el-input>
				</el-form-item>    
			</el-form>
		</el-row>

		<el-row v-if="opType=='add'">
			<span class="padding" style="float:right;">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
			</span>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addXmFunc,editXmFunc,editSomeFieldsXmFunc } from '@/api/xm/core/xmFunc';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmFuncEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmFunc','visible','opType','parentFunc'],

		watch: {
	      'xmFunc':function( xmFunc ) {
	        if(xmFunc){
	            this.editForm = {...xmFunc};
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
					id:'',name:'',pid:'',pname:'',pidPaths:'',productId:'',lvl:''
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
			//新增、编辑提交XmFunc 功能模块表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmFunc
							if(this.currOpType=='edit'){
							    func=editXmFunc
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
			    if(this.xmFunc){
                    this.editForm = Object.assign({},this.xmFunc);
                }

                if(this.opType=='edit'){

                }else{
					if(this.parentFunc && this.parentFunc.id){ 
						this.editForm.pid=this.parentFunc.id
						this.editForm.pname=this.parentFunc.name 
					}else{
						this.editForm.pid=null
						this.editForm.pname=null
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
                var func = editSomeFieldsXmFunc
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