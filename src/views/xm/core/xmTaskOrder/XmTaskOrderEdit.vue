<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmTaskOrder 任务相关费用订单表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="用户编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="用户编号" :maxlength="50" @change="editSomeFields(editForm,'userid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="公司ID-下单客户对应的企业" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="公司ID-下单客户对应的企业" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="订单状态0-初始，1-待确认，2-待付款，3-已付款，4-已完成，5-已取消-未付款前可取消，取消后可删除，6-退单-退单后变为已取消，8已关闭-售后完成后可以关闭订单" prop="ostatus">
					<el-input v-model="editForm.ostatus" placeholder="订单状态0-初始，1-待确认，2-待付款，3-已付款，4-已完成，5-已取消-未付款前可取消，取消后可删除，6-退单-退单后变为已取消，8已关闭-售后完成后可以关闭订单" :maxlength="1" @change="editSomeFields(editForm,'ostatus',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="更新时间" prop="ltime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ltime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="支付方式" prop="payType">
					<el-input v-model="editForm.payType" placeholder="支付方式" :maxlength="1" @change="editSomeFields(editForm,'payType',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="支付状态0待付款，1已付款" prop="payStatus">
					<el-input v-model="editForm.payStatus" placeholder="支付状态0待付款，1已付款" :maxlength="1" @change="editSomeFields(editForm,'payStatus',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="支付时间" prop="payTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.payTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="第三方支付订单编号" prop="prepayId">
					<el-input v-model="editForm.prepayId" placeholder="第三方支付订单编号" :maxlength="50" @change="editSomeFields(editForm,'prepayId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="订单编号" prop="id">
					<el-input v-model="editForm.id" placeholder="订单编号" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="最终总费用=origin_fee" prop="finalFee">
					<el-input v-model="editForm.finalFee" placeholder="最终总费用=origin_fee" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="其它费用" prop="othFee">
					<el-input v-model="editForm.othFee" placeholder="其它费用" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="原始价格=top_fee+urgent_fee+crm_sup_fee+hot_fee+efunds+share_fee" prop="originFee">
					<el-input v-model="editForm.originFee" placeholder="原始价格=top_fee+urgent_fee+crm_sup_fee+hot_fee+efunds+share_fee" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="最终付款金额-客户付款后回填" prop="payAt">
					<el-input v-model="editForm.payAt" placeholder="最终付款金额-客户付款后回填" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="支付授权码" prop="payAuthId">
					<el-input v-model="editForm.payAuthId" placeholder="支付授权码" :maxlength="50" @change="editSomeFields(editForm,'payAuthId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="支付账户对应的第三方openid,注意，下单根付款不一定是同一个人" prop="payOpenid">
					<el-input v-model="editForm.payOpenid" placeholder="支付账户对应的第三方openid,注意，下单根付款不一定是同一个人" :maxlength="50" @change="editSomeFields(editForm,'payOpenid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="付款用户编号" prop="payUserid">
					<el-input v-model="editForm.payUserid" placeholder="付款用户编号" :maxlength="50" @change="editSomeFields(editForm,'payUserid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="付款用户名称" prop="payUsername">
					<el-input v-model="editForm.payUsername" placeholder="付款用户名称" :maxlength="255" @change="editSomeFields(editForm,'payUsername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="折扣率0-199" prop="discount">
					<el-input-number v-model="editForm.discount" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="置顶费用" prop="topFee">
					<el-input v-model="editForm.topFee" placeholder="置顶费用" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="置顶开始时间" prop="topStime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.topStime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="置顶结束时间" prop="topEtime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.topEtime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="热搜费用" prop="hotFee">
					<el-input v-model="editForm.hotFee" placeholder="热搜费用" :maxlength="1" @change="editSomeFields(editForm,'hotFee',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="热搜开始时间" prop="hotStime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.hotStime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="热搜结束时间" prop="hotEtime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.hotEtime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="是否置顶0否1待付款2已开通3已过期" prop="top">
					<el-input v-model="editForm.top" placeholder="是否置顶0否1待付款2已开通3已过期" :maxlength="1" @change="editSomeFields(editForm,'top',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="是否热搜0否1待付款2已开通3已过期" prop="hot">
					<el-input v-model="editForm.hot" placeholder="是否热搜0否1待付款2已开通3已过期" :maxlength="1" @change="editSomeFields(editForm,'hot',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="客服包办费用" prop="crmSupFee">
					<el-input v-model="editForm.crmSupFee" placeholder="客服包办费用" :maxlength="1" @change="editSomeFields(editForm,'crmSupFee',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="加急费用" prop="urgentFee">
					<el-input v-model="editForm.urgentFee" placeholder="加急费用" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="是否加急0否1待付款2已开通3已过期" prop="urgent">
					<el-input v-model="editForm.urgent" placeholder="是否加急0否1待付款2已开通3已过期" :maxlength="1" @change="editSomeFields(editForm,'urgent',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="是否客服包办0否1待付款2已开通3已过期" prop="crmSup">
					<el-input v-model="editForm.crmSup" placeholder="是否客服包办0否1待付款2已开通3已过期" :maxlength="1" @change="editSomeFields(editForm,'crmSup',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="托管金额" prop="efunds">
					<el-input v-model="editForm.efunds" placeholder="托管金额" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="资金托管状况0-无须托管，1-待付款，2-已托管资金，3-已付款给服务商，4-已退款" prop="estate">
					<el-input v-model="editForm.estate" placeholder="资金托管状况0-无须托管，1-待付款，2-已托管资金，3-已付款给服务商，4-已退款" :maxlength="1" @change="editSomeFields(editForm,'estate',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="托管资金付款给平台的时间" prop="etoPlatTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.etoPlatTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="托管资金支付给服务商的时间" prop="etoDevTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.etoDevTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="托管资金退回甲方时间" prop="ebackTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ebackTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="任务编号" prop="taskId">
					<el-input v-model="editForm.taskId" placeholder="任务编号" :maxlength="50" @change="editSomeFields(editForm,'taskId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="置顶天数" prop="topDays">
					<el-input-number v-model="editForm.topDays" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="热搜天数" prop="hotDays">
					<el-input-number v-model="editForm.hotDays" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="加急天数" prop="urgentDays">
					<el-input-number v-model="editForm.urgentDays" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="加急开始时间" prop="urgentStime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.urgentStime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="加急结束时间" prop="urgentEtime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.urgentEtime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="定时检查日期是否已过期，已过期则取消任务中的置顶、加急、热搜状态计算状态0-无须计算，1-本周期已计算待下周期计算，2-结束" prop="calcStatus">
					<el-input v-model="editForm.calcStatus" placeholder="定时检查日期是否已过期，已过期则取消任务中的置顶、加急、热搜状态计算状态0-无须计算，1-本周期已计算待下周期计算，2-结束" :maxlength="1" @change="editSomeFields(editForm,'calcStatus',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="计算时间" prop="calcTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.calcTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="是否开启分享赚0否1待付款2已开通3已过期" prop="oshare">
					<el-input v-model="editForm.oshare" placeholder="是否开启分享赚0否1待付款2已开通3已过期" :maxlength="1" @change="editSomeFields(editForm,'oshare',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="分享赚佣金" prop="shareFee">
					<el-input v-model="editForm.shareFee" placeholder="分享赚佣金" :maxlength="20"></el-input>
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
 	import { initDicts, addXmTaskOrder,editXmTaskOrder,editSomeFieldsXmTaskOrder } from '@/api/xm/core/xmTaskOrder';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmTaskOrderEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTaskOrder','visible','opType'],

		watch: {
	      'xmTaskOrder':function( xmTaskOrder ) {
	        if(xmTaskOrder){
	            this.editForm = {...xmTaskOrder};
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
					userid:'',branchId:'',ostatus:'',ctime:'',ltime:'',payType:'',payStatus:'',payTime:'',prepayId:'',id:'',finalFee:'',othFee:'',originFee:'',payAt:'',payAuthId:'',payOpenid:'',payUserid:'',payUsername:'',discount:'',topFee:'',topStime:'',topEtime:'',hotFee:'',hotStime:'',hotEtime:'',top:'',hot:'',crmSupFee:'',urgentFee:'',urgent:'',crmSup:'',efunds:'',estate:'',etoPlatTime:'',etoDevTime:'',ebackTime:'',taskId:'',topDays:'',hotDays:'',urgentDays:'',urgentStime:'',urgentEtime:'',calcStatus:'',calcTime:'',oshare:'',shareFee:''
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
			//新增、编辑提交XmTaskOrder 任务相关费用订单表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmTaskOrder
							if(this.currOpType=='edit'){
							    func=editXmTaskOrder
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
			    if(this.xmTaskOrder){
                    this.editForm = Object.assign({},this.xmTaskOrder);
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
                var func = editSomeFieldsXmTaskOrder
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