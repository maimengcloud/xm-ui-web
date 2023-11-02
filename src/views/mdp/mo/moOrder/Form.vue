<template>
<el-row>
    <el-row>
    <!--新增/编辑界面 MoOrder mo_order-->
        <el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef"> 
				<el-descriptions :column="3" :size="size" border> 
					<el-descriptions-item label="订单编号">{{editForm.id}}</el-descriptions-item>
					<el-descriptions-item label="下单机构" :span="2">{{editForm.obranchName}}</el-descriptions-item>
					<el-descriptions-item label="订单金额">￥{{editForm.ofinalFee}}元</el-descriptions-item>
					<el-descriptions-item label="状态"><mdp-select item-code="mo_order_status" v-model="editForm.status" /></el-descriptions-item> 
					<el-descriptions-item label="操作类型"><mdp-select item-code="mo_ooper" v-model="editForm.ooper" /></el-descriptions-item> 
 				</el-descriptions>
				<el-tabs v-model="activePane"> 
					<el-tab-pane label="订单信息" name="1" >  
						<el-row>
							<el-col :span="8"> 
								
								<el-form-item label="订单状态" prop="status">  
									<mdp-select item-code="mo_order_status" v-model="editForm.status" @change="editSomeFields(editForm,'status',$event)"/>
								</el-form-item>   
								
							</el-col>
							<el-col :span="8">
								<el-form-item label="订单来源" prop="osource">  
									<mdp-select item-code="osource" v-model="editForm.osource" @change="editSomeFields(editForm,'osource',$event)"/> 
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
							<mdp-select item-code="tpAppPayType" v-model="editForm.payType" @change="editSomeFields(editForm,'payType',$event)"/> 
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
						<mo-order-module-index :mo-order="editForm"></mo-order-module-index>
					</el-tab-pane>
				</el-tabs>
        </el-form>
    </el-row>
    <slot name="footer" :page="this">
        <el-row v-if="showBtn!==false" style="float:right;" class="footer">
            <el-button @click.native="close">关闭</el-button>
            <el-button v-if="currOpType=='add'" v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="disabledJudge('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
        </el-row>
    </slot>
</el-row>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import * as MoOrderApi from '@/api/mdp/mo/moOrder';
import { mapGetters } from 'vuex'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';

import MoOrderModuleIndex from '../moOrderModule/Index.vue';
export default {
    name:'moOrderForm',
    mixins:[MdpFormMixin],
    components: {
        MoOrderModuleIndex
    },
    computed: {
    },
    props:{
    },
    watch: {
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                id:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                id:'',name:'',obranchId:'',ouserid:'',ousername:'',moFinalFee:'',status:'',sstatus:'',ctime:'',payTime:'',payCtime:'',moOrginFee:'',ousers:'',ocates:'',omodules:'',poid:'',startTime:'',endTime:'',payType:'',payId:'',prepayId:'',topenId:'',pbankId:'',pbankName:'',pbankCardNo:'',pbankUsername:'',remark:'',finishTime:'',closeTime:'',setTime:'',odays:'',ofinalFee:'',odisRate:'',othFee:'',otype:'',osource:'',memType:'',atype:'',saleUserid:'',saleUsername:'',custPhone:'',custAddress:'',payAt:'',obranchName:'',ooper:'',tranId:'',invoice:'',invoiceTime:'',invoiceId:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: MoOrderApi.queryMoOrderById,
                add: MoOrderApi.addMoOrder,
                edit: MoOrderApi.editMoOrder,
                editSomeFields: MoOrderApi.editSomeFieldsMoOrder
            }
        }
    },
    methods: {
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){

         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
            return true;
        },

        /**
          * 设置某个关键词、按钮、输入框禁用 disabledRules['addBtn']=false
          * 判断某个对象是否可编辑 this.disabledJudge('addBtn')==false
          */
        disabledRulesInit(disabledRules){

        },
        /**
         * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
         * @param {*} row 当前选中的行
         * @param {*} fieldName 修改的字段名
         * @param {*} $event 修改后的值
         * @param {*} params 将要提交服务器的参数
         * @returns true/false 返回false ,将取消更新数据库
         */
        editSomeFieldsCheck(row,fieldName,$event,params){
            params[fieldName]=$event
            return true;
        },
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>