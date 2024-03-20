<template>
	<section>
		<el-row :class="{'row-box':true,'cfg':isRptCfg}">
			<div class="rpt-title">{{ rawDatas.name }}</div>
			<el-input class="input" v-model="rawDatas.name" placeholder="报告名称"/>
		</el-row>
		<el-row :class="{'row-box':true,'cfg':isRptCfg}">
			<div class="title">{{ title?title:'报告概览' }}</div>
			<el-input class="input" v-model="title" placeholder="报告概览"/>
		</el-row>
		<el-row ref="table" class="padding">
		<el-row class="padding">
			<span>数据汇总</span>
		</el-row>
			<el-row class="box padding">
				<el-col :span="6" class="box-red">
					<div class="box-info">
							<div class="num">{{rawDatas.totalCases?rawDatas.totalCases:'0'}}个</div>
							<div class="label">用例数</div>
					</div>
				</el-col>
				<el-col :span="6" class="box-blue">
					<div class="box-info">
							<div class="num">{{caseFuGaiLv}}%</div>
							<div class="label">用例覆盖率</div>
					</div>
				</el-col>
				<el-col :span="6" class="box-green">
					<div class="box-info">
							<div class="num">{{caseTongGuoLv}}%</div>
							<div class="label">用例通过率</div>
					</div>
				</el-col>
				<el-col :span="6" class="box-orange">
					<div class="box-info">
							<div class="num">{{rawDatas.bugCnt?rawDatas.bugCnt:0}}个</div>
							<div class="label">缺陷数</div>
					</div>
				</el-col>
			</el-row>
		<!--编辑界面 XmTestPlan 测试计划-->
			<el-form :model="rawDatas"  label-width="120px" :rules="rawDatasRules" ref="rawDatasRef" label-position="left">
				<el-row class="padding">
					<el-col :span="8">
						<mdp-select-user show-style="x" size="medium" label="负责人" v-model="rawDatas.cuserid" :init-name="rawDatas.cusername"></mdp-select-user>
					</el-col>
					<el-col :span="8">
						<mdp-select  show-style="x" size="medium" label="状态" item-code="testPlanStatus" v-model="rawDatas.status"></mdp-select>
					</el-col>

					<el-col :span="8">
						<mdp-select  show-style="x" size="medium" label="测试结果" item-code="testPlanTcode" v-model="rawDatas.tcode"></mdp-select>
					</el-col>
				</el-row>
 				<el-form-item label="归属测试库" prop="casedbName">
					{{rawDatas.casedbName}}
				</el-form-item>
				<el-form-item label="归属项目" prop="projectId">

					<span v-if="opType=='add'">
					 	<xm-project-select show-style="tag" v-if="!selProject || !selProject.id" ref="xmProjectSelect" :link-product-id="xmTestCasedb? xmTestCasedb.productId:null"  @row-click="onPorjectConfirm" :auto-select="false">
							<span slot="title">选择项目</span>
						</xm-project-select>
						<div v-else>{{rawDatas.projectName}}</div>
					</span>
 					<div v-else>{{rawDatas.projectName}}</div>
				</el-form-item>
				<el-form-item label="归属产品" prop="productName">
					{{rawDatas.productName}}
				</el-form-item>

				<el-form-item label="起止时间" prop="stime">
					<mdp-date-range :auto-default="false" placeholder="选择日期" v-model="rawDatas" start-key="stime" end-key="etime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" ></mdp-date-range>
				</el-form-item>
			</el-form>

			<el-row>
				<span>报告总结</span>
			</el-row>
			<el-row>
				<el-input  type="textarea" :rows="8" v-model="remark"></el-input>
			</el-row>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addXmTestPlan,editXmTestPlan,editSomeFieldsXmTestPlan } from '@/api/xm/core/xmTestPlan';
	import { mapGetters } from 'vuex'
	import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';


	export default {
	    name:'xmTestPlanEdit',
	    components: {
			XmProjectSelect,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),
			caseFuGaiLv(){
				if(!this.rawDatas.totalCases){
					return 0
				}
				var okCases=parseInt(this.rawDatas.okCases>0?this.rawDatas.okCases:0)
				var errCases=parseInt(this.rawDatas.errCases>0?this.rawDatas.errCases:0)
				var igCases=parseInt(this.rawDatas.igCases>0?this.rawDatas.igCases:0)
				var blCases=parseInt(this.rawDatas.blCases>0?this.rawDatas.blCases:0)
				var totalExecs=okCases+errCases+igCases+blCases
				var rate=parseInt(totalExecs/this.rawDatas.totalCases*100)
				return rate;
			},
			caseTongGuoLv(){
				if(!this.rawDatas.totalCases){
					return 0
				}
				var okCases=parseInt(this.rawDatas.okCases>0?this.rawDatas.okCases:0)
				var errCases=parseInt(this.rawDatas.errCases>0?this.rawDatas.errCases:0)
				var igCases=parseInt(this.rawDatas.igCases>0?this.rawDatas.igCases:0)
				var blCases=parseInt(this.rawDatas.blCases>0?this.rawDatas.blCases:0)
				var totalExecs=okCases+igCases
				var rate=parseInt(totalExecs/this.rawDatas.totalCases*100)
				return rate;
			}

		},
		props:['xmTestPlan','visible','opType','selProject','xmTestCasedb','rptDatas','isRptCfg'],

		watch: {
	      'xmTestPlan':function( xmTestPlan ) {
	        if(xmTestPlan){
	            this.rawDatas = {...xmTestPlan};
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
				title:'',
				remark:'',
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{
					testPlanStatus:[],
					testPlanTcode:[],

				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				rawDatasRules: {

				},
				rawDatas: {
					id:'',name:'',casedbId:'',casedbName:'',projectId:'',projectName:'',cuserid:'',cusername:'',ctime:'',stime:'',etime:'',status:'',tcode:'',totalCases:'',okCases:'',errCases:'',igCases:'',blCases:'',productId:'',productName:'',flowState:'',summaryRemark:''
				},

				rawDatasBak: {
					id:'',name:'',casedbId:'',casedbName:'',projectId:'',projectName:'',cuserid:'',cusername:'',ctime:'',stime:'',etime:'',status:'',tcode:'',totalCases:'',okCases:'',errCases:'',igCases:'',blCases:'',productId:'',productName:'',flowState:'',summaryRemark:''
				},
                maxTableHeight:300,
				summaryRemarkEditVisible:false,
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="rawDatasVisible=false" 监听
			handleCancel:function(){
				this.$refs['rawDatasRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmTestPlan 测试计划父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.rawDatasRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.rawDatas);
							var func=addXmTestPlan
							if(this.currOpType=='edit'){
							    func=editXmTestPlan
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.data.tips;
                                if(tips.isOk){
                                    this.rawDatas=res.data.data
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
			    if(this.xmTestPlan){
                    this.rawDatas = Object.assign({},this.xmTestPlan);
                }
				if(this.rptDatas){
					this.rawDatas=Object.assign({},this.rptDatas)
				}
                this.rawDatasBak={...this.rawDatas}
            },

            editSomeFields(row,fieldName,$event){
                if(this.opType=='add'){
                    return;
                }
                let params={};
                params['ids']=[row].map(i=>i.id)

				if(fieldName=='stime'){
					params[fieldName]=$event.stime
					params.etime=$event.etime
				}else if(fieldName=='cuserid'){
					params[fieldName]=$event.userid
					params.cusername=$event.username
				}else{
					params[fieldName]=$event
				}
                var func = editSomeFieldsXmTestPlan
                func(params).then(res=>{
                  let tips = res.data.tips;
                  if(tips.isOk){
                    this.rawDatasBak=[...this.rawDatas]
					this.$emit('edit-fields',params)
                  }else{
                    Object.assign(this.rawDatas,this.rawDatasBak)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=>Object.assign(this.rawDatas,this.rawDatasBak))
            },
			onPorjectConfirm(row){
				this.rawDatas.projectId=row.id
				this.rawDatas.projectName=row.name
				this.rawDatas.name=this.rawDatas.projectName+'-测试计划-V1.0'
			},
			sizeAutoChange(){

			}
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

<style lang="scss" scoped>
@import '../index/overview.scss';
</style>
