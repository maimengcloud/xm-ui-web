<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmBudgetLabor 项目人力成本预算--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="预算总金额" prop="totalBudgetAt">
					￥<el-input type="number" style="width:40%;" v-model="totalBudgetAt" placeholder="预算金额"></el-input> &nbsp;&nbsp;元 
					&nbsp;&nbsp;平均&nbsp;￥{{editForm.budgetAt}}  &nbsp;&nbsp;元 / 月
				</el-form-item>   
				<el-form-item label="用户名称" prop="username">
					<el-input v-model="editForm.username" placeholder="用户，如果不确定具体人员，可用岗位代替" ></el-input>
				</el-form-item>  
				<el-form-item label="用途说明" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注" ></el-input>
				</el-form-item>  
				<el-form-item label="预算科目" prop="subjectId">
					<el-select   placeholder="预算科目编号" v-model="editForm.subjectId">
						<el-option
							v-for="(item,i) in dicts.projectSubject"
							:key="i"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>   
				<el-form-item label="分摊月份" prop="bizMonth">
					  <el-date-picker
						v-model="bizYear"
						type="year"
						value-format="yyyy"
						placeholder="选择年">
					 </el-date-picker>
					 <div style="margin-top: 20px">
						<el-checkbox-group v-model="bizMonths" size="medium">
							<el-checkbox-button v-for="i in bizMonthList" :label="i" :key="i">{{i}}</el-checkbox-button>
						</el-checkbox-group>
					</div>  
					<div style="padding-top:20px;">下一年：{{secBizYear}}</div>
					 <div style="margin-top: 20px">
						<el-checkbox-group v-model="secBizMonths" size="medium">
							<el-checkbox-button v-for="i in bizMonthList" :label="i" :key="i">{{i}}</el-checkbox-button>
						</el-checkbox-group>
					</div> 
				</el-form-item>    
				<!--
				<el-form-item label="成本类型" prop="costType">
					<template>
						<el-radio v-model="editForm.costType" label="0">非人力</el-radio>
						<el-radio v-model="editForm.costType" label="1">内部人力</el-radio>
						<el-radio v-model="editForm.costType" label="2">外购人力</el-radio>
					</template> 
				</el-form-item> 
				-->
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
 	import { initDicts, addXmBudgetLabor,editXmBudgetLabor,batchAddXmBudgetLabor } from '@/api/xm/core/xmBudgetLabor';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmBudgetLaborEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]), 
		  'allMonths': function(){
			  var bizMonths=this.bizMonths.map(i=>this.bizYear+"-"+i);
				var secBizMonths=this.secBizMonths.map(i=>this.secBizYear+"-"+i); 
				var bizMonthAll=bizMonths.concat(secBizMonths);
				return bizMonthAll;
		  },
		  budgetAt:function(){
			  if( !this.allMonths || this.allMonths.length==0){
				  return 0;
			  }
			  if(!this.totalBudgetAt){
				  return 0;
			  }
			  return Math.round(parseFloat(this.totalBudgetAt)/this.allMonths.length);

		  }

		},
		props:['xmBudgetLabor','visible','opType','selProject'],

		watch: {
	      'xmBudgetLabor':function( xmBudgetLabor ) {
	        if(xmBudgetLabor){
	            this.editForm = {...xmBudgetLabor};
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
 	      		this.initData()
	      	}
	      },
		  'bizYear': function(year){
			  this.secBizYear=parseInt(year)+1+"";
		  } ,
		  
		  'budgetAt': function(budgetAt){ 
			  this.editForm.budgetAt=budgetAt;
		  } ,
		   
	      'editForm.subjectId':function(subjectId) { 
	      	var dicts=this.dicts.projectSubject.filter(i=>i.id==subjectId)
			if( dicts!=null && dicts.length>0){
				 this.editForm.subjectName=dicts[0].name
			}else{
				this.editForm.subjectName="";
			}
		 } 
	    },
		data() { 
			var year=new Date().getFullYear(); 
			var secYear=parseInt(year)+1;
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{
					projectSubject:[],
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: { 
					subjectId: [
						{ required: true, message: '科目不能为空', trigger: 'change' }
					], 
					username: [
						{ required: true, message: '姓名不能为空，如果不确定具体人，请填写岗位代替', trigger: 'change' }
					],  
					budgetAt: [
						{ required: true, message: '金额不能为空', trigger: 'change' }
					],
					
					remark: [
						{ required: true, message: '用途说明不能为空', trigger: 'change' }
					]
				},
				editForm: {
					projectId:'',userid:'',budgetAt:'',id:'',remark:'',username:'',subjectId:'',bizSdate:'',bizEdate:'',bizMonth:'',instId:'',bizFlowState:'',costType:'',subjectName:'',branchId:'',ubranchId:''
				},
                maxTableHeight:300,
				
				totalBudgetAt:0,
				bizYear:year+'',
				secBizYear:secYear+'',
				bizMonths:[],
				secBizMonths:[],
				bizMonthList:['01','02','03','04','05','06','07','08','09','10','11','12'],
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmBudgetLabor 项目人力成本预算父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				if(this.bizYear==null || this.bizYear==''){
					this.$notify({position:'bottom-left',showClose:true,message:"请选择需要分摊的年份", type: 'error' }); 
					return;
				}
				
				var list=this.allMonths.map(i=>{
					let params = Object.assign({}, this.editForm); 
					params.projectId=this.selProject.id
					params.bizMonth=i
					
					return params;

				});
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true 
							var func=batchAddXmBudgetLabor
							func(list).then((res) => {
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
			    if(this.xmBudgetLabor){
                    this.editForm = Object.assign({},this.xmBudgetLabor);
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