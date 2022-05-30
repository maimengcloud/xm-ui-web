<template>
	<section>
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 MoOrder mo_order--> 
			<el-form :model="editForm"   label-width="120px" :rules="editFormRules" ref="editFormRef">  
				<el-descriptions :column="3" :size="size" border> 
					<el-descriptions-item label="订单编号">{{editForm.id}}</el-descriptions-item>
					<el-descriptions-item label="下单机构" :span="2">{{editForm.obranchName}}</el-descriptions-item>
					<el-descriptions-item label="订单金额">￥{{editForm.ofinalFee}}元</el-descriptions-item>
					<el-descriptions-item label="状态"><el-tag v-for="(item,index) in formatDictsWithClass(dicts,'mo_order_status',editForm.status)" :key="index" :type="item.className">{{item.name}}</el-tag></el-descriptions-item> 
					<el-descriptions-item label="操作类型"><el-tag v-for="(item,index) in formatDictsWithClass(dicts,'mo_ooper',editForm.ooper)" :key="index" :type="item.className">{{item.name}}</el-tag></el-descriptions-item> 
				</el-descriptions>
				<el-tabs v-model="activePane"> 
					<el-tab-pane label="订单信息" name="1" >  
						<el-row>
							<el-col :span="8">
								<el-form-item label="订单状态" prop="status"> 
									<el-select v-model="editForm.status" @change="editSomeFields(editForm,'status',$event)">
										<el-option v-for="(item,index) in dicts['mo_order_status']" :key="index" :value="item.id" :label="item.name"></el-option>
									</el-select>
								</el-form-item>   
							</el-col>
							<el-col :span="8">
								<el-form-item label="订单来源" prop="osource"> 
									<el-select v-model="editForm.status" @change="editSomeFields(editForm,'osource',$event)">
										<el-option v-for="(item,index) in dicts['osource']" :key="index" :value="item.id" :label="item.name"></el-option>
									</el-select>
								</el-form-item>    
							</el-col>
							<el-col :span="8"> 
								<el-form-item label="创建时间" prop="ctime">
									<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
								</el-form-item>      
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8"> 
								<el-form-item label="购买人数" prop="ousers">
									<el-input-number v-model="editForm.ousers" :min="0" :max="200"  @change="editSomeFields(editForm,'ousers',$event)"></el-input-number>
								</el-form-item>  
							</el-col>
							<el-col :span="8"> 
								<el-form-item label="购买天数" prop="odays">
									<el-input-number v-model="editForm.odays" :min="0" :max="200" @change="editSomeFields(editForm,'odays',$event)"></el-input-number>天
								</el-form-item> 
							</el-col>
							<el-col :span="8">  
								<el-form-item label="购买模块数" prop="omodules">
									<el-input-number v-model="editForm.omodules" :min="0" :max="200"  @change="editSomeFields(editForm,'omodules',$event)"></el-input-number>
								</el-form-item>  
							</el-col> 
						</el-row>
						<el-row>
							<el-col :span="8"> 
								<el-form-item label="购买天数" prop="odays">
									<el-input-number v-model="editForm.odays" :min="0" :max="200" @change="editSomeFields(editForm,'odays',$event)"></el-input-number>天
								</el-form-item> 
							</el-col>
							<el-col :span="8">
								<el-form-item label="开始日期" prop="startTime">
									<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"  @change="editSomeFields(editForm,'startTime',$event)"></el-date-picker>
								</el-form-item>  
							</el-col>
							<el-col :span="8">
								<el-form-item label="截止日期" prop="endTime">
									<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"  @change="editSomeFields(editForm,'endTime',$event)"></el-date-picker>
								</el-form-item>  
							</el-col>
							
						</el-row>
						<el-row>
							<el-col :span="8">
								<el-form-item label="完成时间" prop="finishTime">
									<el-date-picker type="date" placeholder="选择日期" v-model="editForm.finishTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
								</el-form-item> 

							</el-col>
							<el-col :span="8">
								<el-form-item label="关闭时间" prop="closeTime">
									<el-date-picker type="date" placeholder="选择日期" v-model="editForm.closeTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
								</el-form-item> 

							</el-col> 

							<el-col :span="8">
								<el-form-item label="结算时间" prop="setTime">
									<el-date-picker type="date" placeholder="选择日期" v-model="editForm.setTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
								</el-form-item>

							</el-col>  
						</el-row>
						<el-row> 
							<el-form-item label="备注" prop="remark">
								<el-input type="textarea" :rows="2" v-model="editForm.remark" placeholder="备注" :maxlength="255" @change="editSomeFields(editForm,'remark',$event)"></el-input>
							</el-form-item>  
						</el-row> 
					</el-tab-pane>
					<el-tab-pane label="客户信息" name="2" > 
						<el-form-item label="下单机构号码" prop="obranchId">
							<el-input v-model="editForm.obranchId" placeholder="下单机构号码" :maxlength="50"></el-input>
						</el-form-item> 
						<el-form-item label="下单用户编号" prop="ouserid">
							<el-input v-model="editForm.ouserid" placeholder="下单用户编号" :maxlength="50"></el-input>
						</el-form-item> 
						<el-form-item label="下单用户名称" prop="ousername"  >
							<el-input v-model="editForm.ousername" placeholder="下单用户名称" :maxlength="255" @change="editSomeFields(editForm,'ousername',$event)"></el-input>
						</el-form-item> 
						<el-form-item label="客户联系电话" prop="custPhone">
							<el-input v-model="editForm.custPhone" placeholder="客户联系电话" :maxlength="50" @change="editSomeFields(editForm,'custPhone',$event)"></el-input>
						</el-form-item> 
						<el-form-item label="客户联系地址" prop="custAddress"  >
							<el-input v-model="editForm.custAddress" placeholder="客户联系地址" :maxlength="255" @change="editSomeFields(editForm,'custAddress',$event)"></el-input>
						</el-form-item> 
						<el-form-item label="下单机构名称" prop="obranchName">
							<el-input v-model="editForm.obranchName" placeholder="下单机构名称" :maxlength="255"></el-input>
						</el-form-item> 
						
						<el-form-item label="第三方账号编号" prop="topenId">
							<el-input v-model="editForm.topenId" placeholder="第三方账号编号" :maxlength="50"></el-input>
						</el-form-item> 
					</el-tab-pane>
					<el-tab-pane label="销售经理" name="31" >  
						<el-form-item label="销售经理编号" prop="saleUserid"  >
							<el-input v-model="editForm.saleUserid" placeholder="销售经理编号" :maxlength="50" @change="editSomeFields(editForm,'saleUserid',$event)"></el-input>
						</el-form-item> 
						<el-form-item label="销售经理名称" prop="saleUsername"  >
							<el-input v-model="editForm.saleUsername" placeholder="销售经理名称" :maxlength="255" @change="editSomeFields(editForm,'saleUsername',$event)"></el-input>
						</el-form-item> 
					</el-tab-pane>
					<el-tab-pane label="付款信息" name="3" >   
						<el-form-item label="付款时间" prop="payTime" >
							<el-date-picker type="date" placeholder="选择日期" v-model="editForm.payTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
						</el-form-item> 
						<el-form-item label="付款确认时间" prop="payCtime" >
							<el-date-picker type="date" placeholder="选择日期" v-model="editForm.payCtime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
						</el-form-item> 
						<el-form-item label="支付方式" prop="payType"> 
							<el-select v-model="editForm.payType" @change="editSomeFields(editForm,'payType',$event)">
								<el-option v-for="(item,index) in dicts['tpAppPayType']" :key="index" :value="item.id" :label="item.name"></el-option>
							</el-select>
 						</el-form-item>  
						<el-form-item label="付款订单号" prop="prepayId">
							<el-input v-model="editForm.prepayId" placeholder="付款订单号（第三方返回）" :maxlength="50"  @change="editSomeFields(editForm,'prepayId',$event)"></el-input>
						</el-form-item>  
						<el-form-item label="其它费用" prop="othFee">
							<el-input v-model="editForm.othFee" placeholder="其它费用" :maxlength="10"  @change="editSomeFields(editForm,'othFee',$event)"></el-input>
						</el-form-item>  
						<el-form-item label="应付金额" prop="ofinalFee" >
							<el-input v-model="editForm.ofinalFee" placeholder="最终订单价格、最终付款金额" :maxlength="10" @change="editSomeFields(editForm,'ofinalFee',$event)"></el-input>
						</el-form-item> 
						<el-form-item label="付款金额" prop="payAt" >
							<el-input v-model="editForm.payAt" placeholder="最终付款金额-客户付款后回填" :maxlength="20" @change="editSomeFields(editForm,'payAt',$event)"></el-input>
						</el-form-item> 
					</el-tab-pane>
					<el-tab-pane label="收款信息" name="32" >    
						<el-form-item label="收款银行编号 " prop="pbankId"  >
							<el-input v-model="editForm.pbankId" placeholder="收款银行编号(支付方式为3时必填)" :maxlength="50" @change="editSomeFields(editForm,'pbankId',$event)"></el-input>
						</el-form-item> 
						<el-form-item label="收款银行名称 " prop="pbankName">
							<el-input v-model="editForm.pbankName" placeholder="收款银行名称(支付方式为3时必填)" :maxlength="255"  @change="editSomeFields(editForm,'pbankName',$event)"></el-input>
						</el-form-item> 
						<el-form-item label="收款银行卡号 " prop="pbankCardNo">
							<el-input v-model="editForm.pbankCardNo" placeholder="收款银行卡号(支付方式为3时必填)" :maxlength="50"  @change="editSomeFields(editForm,'pbankCardNo',$event)"></el-input>
						</el-form-item> 
						<el-form-item label="收款账户姓名 " prop="pbankUsername">
							<el-input v-model="editForm.pbankUsername" placeholder="收款账户姓名(支付方式为3时必填)" :maxlength="255"  @change="editSomeFields(editForm,'pbankUsername',$event)"></el-input>
						</el-form-item> 
					</el-tab-pane>
					<el-tab-pane label="折扣信息" name="4" > 
						
						<el-form-item label="订单折扣率" prop="odisRate">
							<el-input style="width:30%;" type="number" v-model="editForm.odisRate" :min="0" :max="200"  @change="editSomeFields(editForm,'odisRate',$event)"></el-input> %
						</el-form-item> 
					</el-tab-pane>
					<el-tab-pane label="产品列表" name="5" >
						<mo-order-module-mng :mo-order="moOrder"></mo-order-module-mng>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-row>

		<el-row  v-if="opType=='add'" class="page-bottom">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
import util from '@/common/js/util';//全局公共库
import config from "@/common/config"; //全局公共库import
import { initDicts, addMoOrder,editMoOrder,editSomeFieldsMoOrder  } from '@/api/mdp/mo/moOrder';
import { mapGetters } from 'vuex'
import MoOrderModuleMng from '../moOrderModule/MoOrderModuleMng.vue';
	
	export default {
	    name:'moOrderEdit',
	    components: {
MoOrderModuleMng

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['moOrder','visible','opType'],

		watch: {
	      'moOrder':function( moOrder ) {
	        if(moOrder){
	            this.editForm = {...moOrder};
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
				dicts:{ 
                	'mo_order_status':[],'tpAppPayType':[],'mo_ooper':[]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '订单编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',name:'',obranchId:'',ouserid:'',ousername:'',moFinalFee:'',status:'',sstatus:'',ctime:'',payTime:'',payCtime:'',moOrginFee:'',ousers:'',ocates:'',omodules:'',poid:'',startTime:'',endTime:'',payType:'',payId:'',prepayId:'',topenId:'',pbankId:'',pbankName:'',pbankCardNo:'',pbankUsername:'',remark:'',finishTime:'',closeTime:'',setTime:'',odays:'',ofinalFee:'',odisRate:'',othFee:'',otype:'',osource:'',memType:'',atype:'',saleUserid:'',saleUsername:'',custPhone:'',custAddress:'',payAt:'',obranchName:'',ooper:''
				},
                maxTableHeight:300,
				activePane:'1'
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交MoOrder mo_order父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addMoOrder
							if(this.currOpType=='edit'){
							    func=editMoOrder
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
			    if(this.moOrder){
                    this.editForm = Object.assign({},this.moOrder);
                }

                if(this.opType=='edit'){

                }else{

                }
				this.activePane='1'
            },


            editSomeFields(row,fieldName,$event){
				;
                if(this.opType=='add'){
                    return;
                }
                let params={};
                params['ids']=[row.id]
                params[fieldName]=$event
                var func = editSomeFieldsMoOrder
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
            });
		}
	}

</script>

<style scoped>

</style>