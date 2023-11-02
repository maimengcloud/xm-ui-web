<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 GuardOrder 购买服务保障订单表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="订单编号" prop="id">
					<el-input v-model="editForm.id" placeholder="订单编号" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="订单名称" prop="name">
					<el-input v-model="editForm.name" placeholder="订单名称" :maxlength="255" @change="editSomeFields(editForm,'name',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="下单机构号码" prop="obranchId">
					<el-input v-model="editForm.obranchId" placeholder="下单机构号码" :maxlength="50" @change="editSomeFields(editForm,'obranchId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="下单用户编号" prop="ouserid">
					<el-input v-model="editForm.ouserid" placeholder="下单用户编号" :maxlength="50" @change="editSomeFields(editForm,'ouserid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="下单用户名称" prop="ousername">
					<el-input v-model="editForm.ousername" placeholder="下单用户名称" :maxlength="255" @change="editSomeFields(editForm,'ousername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="价格=orign_fee*odis_rate" prop="finalFee">
					<el-input v-model="editForm.finalFee" placeholder="价格=orign_fee*odis_rate" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="订单状态0-初始，1-待确认，2-待付款，3-已付款，4-已完成，5-已取消-未付款前可取消，取消后可删除，6-退单-退单后变为已取消，8已关闭-售后完成后可以关闭订单" prop="status">
					<el-input v-model="editForm.status" placeholder="订单状态0-初始，1-待确认，2-待付款，3-已付款，4-已完成，5-已取消-未付款前可取消，取消后可删除，6-退单-退单后变为已取消，8已关闭-售后完成后可以关闭订单" :maxlength="1" @change="editSomeFields(editForm,'status',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="结算状态0-待结算，1-已结算" prop="sstatus">
					<el-input v-model="editForm.sstatus" placeholder="结算状态0-待结算，1-已结算" :maxlength="1" @change="editSomeFields(editForm,'sstatus',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="付款时间" prop="payTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.payTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="付款确认时间" prop="payCtime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.payCtime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="折扣前总价=sys_guard中价格" prop="orginFee">
					<el-input v-model="editForm.orginFee" placeholder="折扣前总价=sys_guard中价格" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="上级订单-如果是续费订单，记录原订单号" prop="poid">
					<el-input v-model="editForm.poid" placeholder="上级订单-如果是续费订单，记录原订单号" :maxlength="50" @change="editSomeFields(editForm,'poid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="启用日期" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束日期" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="支付方式1-微信，2-支付宝，3-线下支付" prop="payType">
					<el-input v-model="editForm.payType" placeholder="支付方式1-微信，2-支付宝，3-线下支付" :maxlength="1" @change="editSomeFields(editForm,'payType',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="付款流水号(内部生成，传给第三方原样传回，如果不正确，不允许更新数据库，防止作弊)" prop="payId">
					<el-input v-model="editForm.payId" placeholder="付款流水号(内部生成，传给第三方原样传回，如果不正确，不允许更新数据库，防止作弊)" :maxlength="50" @change="editSomeFields(editForm,'payId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="预下单付款订单号（第三方返回）" prop="prepayId">
					<el-input v-model="editForm.prepayId" placeholder="预下单付款订单号（第三方返回）" :maxlength="50" @change="editSomeFields(editForm,'prepayId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="第三方账号编号" prop="topenId">
					<el-input v-model="editForm.topenId" placeholder="第三方账号编号" :maxlength="50" @change="editSomeFields(editForm,'topenId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="收款银行编号(支付方式为3时必填)" prop="pbankId">
					<el-input v-model="editForm.pbankId" placeholder="收款银行编号(支付方式为3时必填)" :maxlength="50" @change="editSomeFields(editForm,'pbankId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="收款银行名称(支付方式为3时必填)" prop="pbankName">
					<el-input v-model="editForm.pbankName" placeholder="收款银行名称(支付方式为3时必填)" :maxlength="255" @change="editSomeFields(editForm,'pbankName',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="收款银行卡号(支付方式为3时必填)" prop="pbankCardNo">
					<el-input v-model="editForm.pbankCardNo" placeholder="收款银行卡号(支付方式为3时必填)" :maxlength="50" @change="editSomeFields(editForm,'pbankCardNo',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="收款账户姓名(支付方式为3时必填)" prop="pbankUsername">
					<el-input v-model="editForm.pbankUsername" placeholder="收款账户姓名(支付方式为3时必填)" :maxlength="255" @change="editSomeFields(editForm,'pbankUsername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注" :maxlength="255" @change="editSomeFields(editForm,'remark',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="完成时间" prop="finishTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.finishTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="关闭时间" prop="closeTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.closeTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结算时间" prop="setTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.setTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="最终订单价格、最终付款金额=final_fee+oth_fee" prop="ofinalFee">
					<el-input v-model="editForm.ofinalFee" placeholder="最终订单价格、最终付款金额=final_fee+oth_fee" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="订单折扣率(下单后后台根据不同客户进行折扣调整)=将在模块表中执行折扣操作，再从新合计价格" prop="odisRate">
					<el-input-number v-model="editForm.odisRate" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="其它费用" prop="othFee">
					<el-input v-model="editForm.othFee" placeholder="其它费用" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="订单类型0-电商商城商品，1-应用模块使用购买，2-vip购买会员，3-购买服务保障" prop="otype">
					<el-input v-model="editForm.otype" placeholder="订单类型0-电商商城商品，1-应用模块使用购买，2-vip购买会员，3-购买服务保障" :maxlength="1" @change="editSomeFields(editForm,'otype',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="订单来源1-前端客户下单，2-后台待客下单" prop="osource">
					<el-input v-model="editForm.osource" placeholder="订单来源1-前端客户下单，2-后台待客下单" :maxlength="1" @change="editSomeFields(editForm,'osource',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="客户类型-参考sys_user表mem_type" prop="memType">
					<el-input v-model="editForm.memType" placeholder="客户类型-参考sys_user表mem_type" :maxlength="1" @change="editSomeFields(editForm,'memType',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="账户类型-根据sys_user表atype" prop="atype">
					<el-input v-model="editForm.atype" placeholder="账户类型-根据sys_user表atype" :maxlength="1" @change="editSomeFields(editForm,'atype',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="销售经理编号" prop="saleUserid">
					<el-input v-model="editForm.saleUserid" placeholder="销售经理编号" :maxlength="50" @change="editSomeFields(editForm,'saleUserid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="销售经理名称" prop="saleUsername">
					<el-input v-model="editForm.saleUsername" placeholder="销售经理名称" :maxlength="255" @change="editSomeFields(editForm,'saleUsername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="客户联系电话" prop="custPhone">
					<el-input v-model="editForm.custPhone" placeholder="客户联系电话" :maxlength="50" @change="editSomeFields(editForm,'custPhone',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="客户联系地址" prop="custAddress">
					<el-input v-model="editForm.custAddress" placeholder="客户联系地址" :maxlength="255" @change="editSomeFields(editForm,'custAddress',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="最终付款金额-客户付款后回填" prop="payAt">
					<el-input v-model="editForm.payAt" placeholder="最终付款金额-客户付款后回填" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="下单机构名称" prop="obranchName">
					<el-input v-model="editForm.obranchName" placeholder="下单机构名称" :maxlength="255" @change="editSomeFields(editForm,'obranchName',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="订单操作类型1-新购，2-续费" prop="ooper">
					<el-input v-model="editForm.ooper" placeholder="订单操作类型1-新购，2-续费" :maxlength="1" @change="editSomeFields(editForm,'ooper',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="第三方付款事务号" prop="tranId">
					<el-input v-model="editForm.tranId" placeholder="第三方付款事务号" :maxlength="50" @change="editSomeFields(editForm,'tranId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="是否已开票" prop="invoice">
					<el-input v-model="editForm.invoice" placeholder="是否已开票" :maxlength="1" @change="editSomeFields(editForm,'invoice',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="开票时间" prop="invoiceTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.invoiceTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="发票编号" prop="invoiceId">
					<el-input v-model="editForm.invoiceId" placeholder="发票编号" :maxlength="50" @change="editSomeFields(editForm,'invoiceId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="服务保障编号" prop="guardId">
					<el-input v-model="editForm.guardId" placeholder="服务保障编号" :maxlength="50" @change="editSomeFields(editForm,'guardId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="服务保障名称" prop="guardName">
					<el-input v-model="editForm.guardName" placeholder="服务保障名称" :maxlength="255" @change="editSomeFields(editForm,'guardName',$event)"></el-input>
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
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
 	import {  addGuardOrder,editGuardOrder,editSomeFieldsGuardOrder } from '@/api/mdp/sys/guardOrder';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'guardOrderEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['guardOrder','visible','opType'],

		watch: {
	      'guardOrder':function( guardOrder ) {
	        if(guardOrder){
	            this.editForm = {...guardOrder};
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
						//{ required: true, message: '订单编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',name:'',obranchId:'',ouserid:'',ousername:'',finalFee:'',status:'',sstatus:'',ctime:'',payTime:'',payCtime:'',orginFee:'',poid:'',startTime:'',endTime:'',payType:'',payId:'',prepayId:'',topenId:'',pbankId:'',pbankName:'',pbankCardNo:'',pbankUsername:'',remark:'',finishTime:'',closeTime:'',setTime:'',ofinalFee:'',odisRate:'',othFee:'',otype:'',osource:'',memType:'',atype:'',saleUserid:'',saleUsername:'',custPhone:'',custAddress:'',payAt:'',obranchName:'',ooper:'',tranId:'',invoice:'',invoiceTime:'',invoiceId:'',guardId:'',guardName:''
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
			//新增、编辑提交GuardOrder 购买服务保障订单表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addGuardOrder
							if(this.currOpType=='edit'){
							    func=editGuardOrder
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
			    if(this.guardOrder){
                    this.editForm = Object.assign({},this.guardOrder);
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
                var func = editSomeFieldsGuardOrder
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
                
                this.initData()
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style scoped>

</style>