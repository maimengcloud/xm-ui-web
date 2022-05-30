<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 BranchInterests 机构权益关联表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="公司ID" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="公司ID" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="等级ID" prop="ilvlId">
					<el-input v-model="editForm.ilvlId" placeholder="等级ID" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="等级名称" prop="ilvlName">
					<el-input v-model="editForm.ilvlName" placeholder="等级名称" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="等级描述" prop="idesc">
					<el-input v-model="editForm.idesc" placeholder="等级描述" :maxlength="2000"></el-input>
				</el-form-item> 
				<el-form-item label="1-粉丝,2-" prop="ilevel">
					<el-input-number v-model="editForm.ilevel" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="权益，折扣" prop="discount">
					<el-input-number v-model="editForm.discount" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="等级状态" prop="istatus">
					<el-input v-model="editForm.istatus" placeholder="等级状态" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="更新时间" prop="ltime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ltime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="等级图标url" prop="picUrl">
					<el-input v-model="editForm.picUrl" placeholder="等级图标url" :maxlength="255"></el-input>
				</el-form-item> 
				<el-form-item label="是否付费获取权益" prop="isFree">
					<el-input v-model="editForm.isFree" placeholder="是否付费获取权益" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="续会时间叠加规则：1.有效期日期后叠加续会时间" prop="rtimeRule">
					<el-input v-model="editForm.rtimeRule" placeholder="续会时间叠加规则：1.有效期日期后叠加续会时间" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="续会时间类型：1.天数" prop="rtimeType">
					<el-input v-model="editForm.rtimeType" placeholder="续会时间类型：1.天数" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="下次续会时间yyyy-MM-dd型" prop="rtime">
					<el-input v-model="editForm.rtime" placeholder="下次续会时间yyyy-MM-dd型" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="权益分类" prop="itype">
					<el-input v-model="editForm.itype" placeholder="权益分类" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="商户编号" prop="shopId">
					<el-input v-model="editForm.shopId" placeholder="商户编号" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="当前流程实例编号" prop="instId">
					<el-input v-model="editForm.instId" placeholder="当前流程实例编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="当前流程状态，0初始1审批中2审批通过3审批不通过4流程取消或者删除" prop="flowState">
					<el-input v-model="editForm.flowState" placeholder="当前流程状态，0初始1审批中2审批通过3审批不通过4流程取消或者删除" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="单个任务最大金额（任务型用户才有）0代表不限制" prop="smaxAt">
					<el-input v-model="editForm.smaxAt" placeholder="单个任务最大金额（任务型用户才有）0代表不限制" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="累计接单金额（任务型用户才有）0代表不限制" prop="totalAt">
					<el-input v-model="editForm.totalAt" placeholder="累计接单金额（任务型用户才有）0代表不限制" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="适用会员类型（2商户型、1普通型、3任务型）" prop="mtype">
					<el-input v-model="editForm.mtype" placeholder="适用会员类型（2商户型、1普通型、3任务型）" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="累计经验值0代表不限制" prop="totalExp">
					<el-input v-model="editForm.totalExp" placeholder="累计经验值0代表不限制" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="单个任务最大经验值0代表不限制" prop="smaxExp">
					<el-input v-model="editForm.smaxExp" placeholder="单个任务最大经验值0代表不限制" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="投标次数上限" prop="bids">
					<el-input-number v-model="editForm.bids" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="服务费率0-100之间" prop="sfeeRate">
					<el-input-number v-model="editForm.sfeeRate" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="覆盖上一条的等级编号，即变成当前等级之前的等级编号" prop="idBak">
					<el-input v-model="editForm.idBak" placeholder="覆盖上一条的等级编号，即变成当前等级之前的等级编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="累计完成工作量" prop="currTotalExp">
					<el-input v-model="editForm.currTotalExp" placeholder="累计完成工作量" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="当前月份投标次数（每月最后一天清零）" prop="currBids">
					<el-input-number v-model="editForm.currBids" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="当前累计完成金额" prop="currTotalAt">
					<el-input v-model="editForm.currTotalAt" placeholder="当前累计完成金额" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="累计投标总数" prop="currTotalBids">
					<el-input-number v-model="editForm.currTotalBids" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="月均费用" prop="mfee">
					<el-input v-model="editForm.mfee" placeholder="月均费用" :maxlength="20"></el-input>
				</el-form-item> 
				<el-form-item label="最大人员数" prop="maxUsers">
					<el-input-number v-model="editForm.maxUsers" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="当前人员数" prop="currUsers">
					<el-input-number v-model="editForm.currUsers" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="产品模块下次续费截止时间yyyy-MM-dd类型" prop="maxRtime">
					<el-input v-model="editForm.maxRtime" placeholder="产品模块下次续费截止时间yyyy-MM-dd类型" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="产品版本0个人版1企业版" prop="mver">
					<el-input v-model="editForm.mver" placeholder="产品版本0个人版1企业版" :maxlength="1"></el-input>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addBranchInterests,editBranchInterests } from '@/api/mdp/sys/branchInterests';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'branchInterestsEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['branchInterests','visible','opType'],

		watch: {
	      'branchInterests':function( branchInterests ) {
	        if(branchInterests){
	            this.editForm = {...branchInterests};
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
					branchId: [
						//{ required: true, message: '公司ID不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					branchId:'',ilvlId:'',ilvlName:'',idesc:'',ilevel:'',discount:'',istatus:'',ctime:'',ltime:'',picUrl:'',isFree:'',rtimeRule:'',rtimeType:'',rtime:'',itype:'',shopId:'',instId:'',flowState:'',smaxAt:'',totalAt:'',mtype:'',totalExp:'',smaxExp:'',bids:'',sfeeRate:'',idBak:'',currTotalExp:'',currBids:'',currTotalAt:'',currTotalBids:'',mfee:'',maxUsers:'',currUsers:'',maxRtime:'',mver:''
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
			//新增、编辑提交BranchInterests 机构权益关联表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addBranchInterests
							if(this.currOpType=='edit'){
							    func=editBranchInterests
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
			    if(this.branchInterests){
                    this.editForm = Object.assign({},this.branchInterests);
                }

                if(this.opType=='edit'){

                }else{

                }
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