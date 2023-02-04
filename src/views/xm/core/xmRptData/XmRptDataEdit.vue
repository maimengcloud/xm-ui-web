<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmRptData xm_rpt_data--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="报表配置主键" prop="cfgId">
					<el-input v-model="editForm.cfgId" placeholder="报表配置主键" :maxlength="50" @change="editSomeFields(editForm,'cfgId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="报表主键" prop="id">
					<el-input v-model="editForm.id" placeholder="报表主键" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="报表名称" prop="rptName">
					<el-input v-model="editForm.rptName" placeholder="报表名称" :maxlength="255" @change="editSomeFields(editForm,'rptName',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="报表数据json对象,比rptCfg.cfg多了rawDatas" prop="rptData">
					<el-input v-model="editForm.rptData" placeholder="报表数据json对象,比rptCfg.cfg多了rawDatas" :maxlength="2147483647" @change="editSomeFields(editForm,'rptData',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建人编号" prop="cuserid">
					<el-input v-model="editForm.cuserid" placeholder="创建人编号" :maxlength="50" @change="editSomeFields(editForm,'cuserid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建人机构号" prop="cbranchId">
					<el-input v-model="editForm.cbranchId" placeholder="创建人机构号" :maxlength="50" @change="editSomeFields(editForm,'cbranchId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建人名称" prop="cusername">
					<el-input v-model="editForm.cusername" placeholder="创建人名称" :maxlength="255" @change="editSomeFields(editForm,'cusername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建日期" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="归属业务日期yyyy-MM-dd型" prop="bizDate">
					<el-input v-model="editForm.bizDate" placeholder="归属业务日期yyyy-MM-dd型" :maxlength="10" @change="editSomeFields(editForm,'bizDate',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="业务类型，同rpt_config.biz_type" prop="bizType">
					<el-input v-model="editForm.bizType" placeholder="业务类型，同rpt_config.biz_type" :maxlength="1" @change="editSomeFields(editForm,'bizType',$event)"></el-input>
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
 	import { initDicts, addXmRptData,editXmRptData,editSomeFieldsXmRptData } from '@/api/xm/core/xmRptData';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmRptDataEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmRptData','visible','opType'],

		watch: {
	      'xmRptData':function( xmRptData ) {
	        if(xmRptData){
	            this.editForm = {...xmRptData};
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
						//{ required: true, message: '报表主键不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					cfgId:'',id:'',rptName:'',rptData:'',cuserid:'',cbranchId:'',cusername:'',ctime:'',bizDate:'',bizType:''
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
			//新增、编辑提交XmRptData xm_rpt_data父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmRptData
							if(this.currOpType=='edit'){
							    func=editXmRptData
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
			    if(this.xmRptData){
                    this.editForm = Object.assign({},this.xmRptData);
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
                var func = editSomeFieldsXmRptData
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