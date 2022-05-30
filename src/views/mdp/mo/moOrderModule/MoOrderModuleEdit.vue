<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 MoOrderModule 订单与模块关系表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="订单编号" prop="orderId">
					<el-input v-model="editForm.orderId" placeholder="订单编号" :maxlength="50" @change="editSomeFields(editForm,'orderId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="模块编号" prop="moduleId">
					<el-input v-model="editForm.moduleId" placeholder="模块编号" :maxlength="50" @change="editSomeFields(editForm,'moduleId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="模块名称" prop="name">
					<el-input v-model="editForm.name" placeholder="模块名称" :maxlength="255" @change="editSomeFields(editForm,'name',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="模块费用" prop="fee">
					<el-input v-model="editForm.fee" placeholder="模块费用" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="计费模式：0-不计费，1-按购买人数计费，2-总包费用,3-按实际使用人数每月计费" prop="billMode">
					<el-input v-model="editForm.billMode" placeholder="计费模式：0-不计费，1-按购买人数计费，2-总包费用,3-按实际使用人数每月计费" :maxlength="1" @change="editSomeFields(editForm,'billMode',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="人均费用,单位人天" prop="uniFee">
					<el-input v-model="editForm.uniFee" placeholder="人均费用,单位人天" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="折扣比率，可折上折，叠加折扣。-按最大人数、按月数优惠" prop="discount">
					<el-input v-model="editForm.discount" placeholder="折扣比率，可折上折，叠加折扣。-按最大人数、按月数优惠" :maxlength="65535" @change="editSomeFields(editForm,'discount',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="分类(关联mo_cate)" prop="mcate">
					<el-input v-model="editForm.mcate" placeholder="分类(关联mo_cate)" :maxlength="50" @change="editSomeFields(editForm,'mcate',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="logo地址" prop="logoUrl">
					<el-input v-model="editForm.logoUrl" placeholder="logo地址" :maxlength="255" @change="editSomeFields(editForm,'logoUrl',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="费用解释" prop="feeDesc">
					<el-input v-model="editForm.feeDesc" placeholder="费用解释" :maxlength="255" @change="editSomeFields(editForm,'feeDesc',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="人数折算比例。购买总人数*折扣率为当前模块购买人数" prop="udisRate">
					<el-input-number v-model="editForm.udisRate" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="是否折算人数0否1是" prop="udis">
					<el-input v-model="editForm.udis" placeholder="是否折算人数0否1是" :maxlength="1" @change="editSomeFields(editForm,'udis',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="购买人数=订单表中购买总人数*人数折扣" prop="musers">
					<el-input-number v-model="editForm.musers" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="最终总费用=orgin_fee*dis_rate" prop="finalFee">
					<el-input v-model="editForm.finalFee" placeholder="最终总费用=orgin_fee*dis_rate" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="购买天数" prop="days">
					<el-input-number v-model="editForm.days" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="原始总费用，未进行折扣方案前的总费用如果计费模式为1，则为uni_fee*musers*days单价*折扣方案天数折扣*折扣方案中人数折扣，如果计费模式为2，则为fee" prop="orginFee">
					<el-input v-model="editForm.orginFee" placeholder="原始总费用，未进行折扣方案前的总费用如果计费模式为1，则为uni_fee*musers*days单价*折扣方案天数折扣*折扣方案中人数折扣，如果计费模式为2，则为fee" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="订单折扣率（可能会根据客户类型后台改订单折扣，从新计算订单价格）" prop="disRate">
					<el-input-number v-model="editForm.disRate" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="是否控制总人数0-否1-是" prop="ucheck">
					<el-input v-model="editForm.ucheck" placeholder="是否控制总人数0-否1-是" :maxlength="1" @change="editSomeFields(editForm,'ucheck',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="企业总人数=订单表中ousers" prop="ousers">
					<el-input-number v-model="editForm.ousers" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="购买的版本0免费版，1企业版" prop="ver">
					<el-input v-model="editForm.ver" placeholder="购买的版本0免费版，1企业版" :maxlength="1" @change="editSomeFields(editForm,'ver',$event)"></el-input>
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
 	import { initDicts, addMoOrderModule,editMoOrderModule,editSomeFieldsMoOrderModule } from '@/api/mdp/mo/moOrderModule';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'moOrderModuleEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['moOrderModule','visible','opType'],

		watch: {
	      'moOrderModule':function( moOrderModule ) {
	        if(moOrderModule){
	            this.editForm = {...moOrderModule};
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
					orderId: [
						//{ required: true, message: '订单编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					orderId:'',moduleId:'',name:'',fee:'',billMode:'',uniFee:'',discount:'',mcate:'',logoUrl:'',feeDesc:'',udisRate:'',udis:'',musers:'',finalFee:'',days:'',orginFee:'',disRate:'',ucheck:'',ousers:'',ver:''
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
			//新增、编辑提交MoOrderModule 订单与模块关系表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addMoOrderModule
							if(this.currOpType=='edit'){
							    func=editMoOrderModule
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
			    if(this.moOrderModule){
                    this.editForm = Object.assign({},this.moOrderModule);
                }

                if(this.opType=='edit'){

                }else{

                }
                this.editFormBak={...this.editForm}
            },

            editSomeFields(row,fieldName,$event){
				debugger;
                if(this.opType=='add'){
                    return;
                }
                let params={};
                params['pkList']=[row].map(i=>{ return { orderId:i.orderId,  moduleId:i.moduleId}})
                params[fieldName]=$event
                var func = editSomeFieldsMoOrderModule
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