<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 XmTaskSbill 任务结算表-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
<!--				<el-form-item label="结算单据编号" prop="id">
					<el-input v-model="editForm.id" placeholder="结算单据编号"></el-input>
				</el-form-item>-->
        <el-form-item label="项目ID：" prop="projectId">
          <el-button v-if="!editForm.projectId" type="primary" @click="projSelVisible=true" round>选择项目</el-button>
          <span v-else>{{editForm.projectId}}</span>
        </el-form-item>
        <el-form-item label="项目名称：" prop="projectName">
          <el-input disabled v-model="editForm.projectName" placeholder="项目名称"></el-input>
        </el-form-item>
				<el-form-item label="结算单标题：" prop="title">
					<el-input v-model="editForm.title" placeholder="结算单标题"></el-input>
				</el-form-item>
<!--				<el-form-item label="金额=工时表中结算金额之和" prop="amt">
					<el-input v-model="editForm.amt" placeholder="金额=工时表中结算金额之和"></el-input>
				</el-form-item>
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="创建人编号" prop="cuserid">
					<el-input v-model="editForm.cuserid" placeholder="创建人编号"></el-input>
				</el-form-item>
				<el-form-item label="创建人姓名" prop="cusername">
					<el-input v-model="editForm.cusername" placeholder="创建人姓名"></el-input>
				</el-form-item>-->
				<el-form-item label="备注：" prop="remark">
          <el-input v-model="editForm.remark" type="textarea" :autosize="{ minRows: 3}" placeholder="请输入备注"
                    maxlength="200" show-word-limit></el-input>
				</el-form-item>
        <el-form-item>
          <el-button @click.native="handleCancel">取消</el-button>
          <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
        </el-form-item>
<!--				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号"></el-input>
				</el-form-item>
				<el-form-item label="部门编号" prop="deptid">
					<el-input v-model="editForm.deptid" placeholder="部门编号"></el-input>
				</el-form-item>
				<el-form-item label="相对方编号(机构写机构号，个人写个人编号)" prop="cpId">
					<el-input v-model="editForm.cpId" placeholder="相对方编号(机构写机构号，个人写个人编号)"></el-input>
				</el-form-item>
				<el-form-item label="相对方名称（机构写机构名称，个人写个人名称）" prop="cpName">
					<el-input v-model="editForm.cpName" placeholder="相对方名称（机构写机构名称，个人写个人名称）"></el-input>
				</el-form-item>
				<el-form-item label="结算工作量=工时表中工时之和" prop="workload">
					<el-input v-model="editForm.workload" placeholder="结算工作量=工时表中工时之和"></el-input>
				</el-form-item>
				<el-form-item label="业务月份yyyy-MM" prop="bizMonth">
					<el-input v-model="editForm.bizMonth" placeholder="业务月份yyyy-MM"></el-input>
				</el-form-item>
				<el-form-item label="业务日期yyyy-MM-dd" prop="bizDate">
					<el-input v-model="editForm.bizDate" placeholder="业务日期yyyy-MM-dd"></el-input>
				</el-form-item>
				<el-form-item label="结算流程状态" prop="bizFlowState">
					<el-input v-model="editForm.bizFlowState" placeholder="结算流程状态"></el-input>
				</el-form-item>
				<el-form-item label="结算流程实例" prop="bizProcInstId">
					<el-input v-model="editForm.bizProcInstId" placeholder="结算流程实例"></el-input>
				</el-form-item>
				<el-form-item label="更新时间" prop="ltime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ltime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="0-待提交，1-已提交，2-已通过，3-已付款，4-已完成" prop="status">
					<el-input v-model="editForm.status" placeholder="0-待提交，1-已提交，2-已通过，3-已付款，4-已完成"></el-input>
				</el-form-item>
				<el-form-item label="最后审核意见" prop="fmsg">
					<el-input v-model="editForm.fmsg" placeholder="最后审核意见"></el-input>
				</el-form-item>-->
			</el-form>
		</el-row>

    <!--新增 XmTaskSbill 任务结算表界面-->
    <el-drawer title="选择项目" :visible.sync="projSelVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
      <select-xm-project :visible="projSelVisible" @select="afterProjectSelect"></select-xm-project>
    </el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addXmTaskSbill,editXmTaskSbill } from '@/api/xm/core/xmTaskSbill';
	import { mapGetters } from 'vuex';
  import SelectXmProject from "./SelectXmProject";

	export default {
    components: {
      //XmTaskSbillEdit,
      SelectXmProject,

    },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmTaskSbill','visible','opType'],

		watch: {
	      'xmTaskSbill':function( xmTaskSbill ) {
	        if(xmTaskSbill){
	            this.editForm = xmTaskSbill;
	        }

	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      		this.initData();
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
						//{ required: true, message: '结算单据编号不能为空', trigger: 'blur' }
					]
				},

				//编辑界面数据  XmTaskSbill 任务结算表
				editForm: {
					id:'',title:'',amt:'',ctime:'',cuserid:'',cusername:'',remark:'',branchId:'',deptid:'',cpId:'',cpName:'',workload:'',bizMonth:'',bizDate:'',bizFlowState:'',bizProcInstId:'',ltime:'',status:'',fmsg:'',projectId:'',projectName:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
        projSelVisible:false,
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交XmTaskSbill 任务结算表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);

							let today = new Date();
							let year = today.getFullYear();
							let m = today.getMonth() + 1;
							let d = today.getDay();
							params.bizMonth = year+"-"+m;
							params.bizDate = year+"-"+m+"-"+d;

							if(this.currOpType=='edit'){
							    editXmTaskSbill(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.$emit('submit');//  @submit="afterEditSubmit"
                                    }
                                    this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}else{
							    addXmTaskSbill(params).then((res) => {
                                    this.load.edit=false
                                    var tips=res.data.tips;
                                    if(tips.isOk){
                                        this.$emit('submit');//  @submit="afterAddSubmit"

                                    }
                                    this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                                }).catch( err =>this.load.edit=false);
							}
						});
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
          if(this.opType=='edit'){
            if(this.xmTaskSbill){
              this.editForm = Object.assign({},this.xmTaskSbill);
            }
          }else{
            this.editForm = Object.assign({},{});
          }
      },
			/**begin 在下面加自定义方法**/
      afterProjectSelect(obj){
        this.projSelVisible = false;
        this.editForm.projectId = obj.projectId;
        this.editForm.projectName = obj.projectName;
      }
		},//end method
		mounted() {
		    this.$nextTick(() => {
                //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
                this.initData()
            });
		}
	}

</script>

<style scoped>

</style>
