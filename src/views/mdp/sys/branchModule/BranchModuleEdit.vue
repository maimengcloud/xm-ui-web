<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 BranchModule 管理端机构表（机构下面若干部门）--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="机构编号" prop="branchId">
					 <span v-if="opType==='add'">
						 <el-input v-model="editForm.branchId" placeholder="机构编号" :maxlength="50">
							<el-button slot="append" @click="branchSelectVisible=true">选机构</el-button> 
						</el-input>
					 </span>
					  <span v-else>
						  {{editForm.branchId}}
					  </span>
						
				</el-form-item> 
				<el-form-item label="模块编号" prop="moduleId">

					<span v-if="opType==='add'">
					<el-input v-model="editForm.moduleId" placeholder="模块编号" :maxlength="50">
						<el-button slot="append" @click="moduleSelectVisible=true">选模块</el-button> 
					</el-input>
					 </span>
					  <span v-else>
						  {{editForm.moduleId}}
					  </span>
				</el-form-item>  
				<span v-if="opType==='edit'">
				<el-form-item label="状态" prop="status">
					<el-select v-model="editForm.status">
						<el-option v-for="(item,index) in dicts.status" :label="item.name" :value="item.id" :key="index"></el-option>
					</el-select>
				</el-form-item> 
				<el-form-item label="启用日期" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束日期" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="计费日期" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.feeDate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>  
				<el-form-item label="购买日期" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>  
				<el-form-item label="购买人姓名" prop="cusername">
					<el-input v-model="editForm.cusername" placeholder="创建人姓名" :maxlength="255"></el-input>
				</el-form-item>  
				<el-form-item label="购买用户数" prop="musers">
					<el-input-number v-model="editForm.musers" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="可投标次数" prop="mbidNum">
					<el-input-number v-model="editForm.mbidNum" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="服务费率" prop="sfeeRate">
					<el-input-number v-model="editForm.sfeeRate" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="购买版本" prop="ver">
					<el-input v-model="editForm.ver" placeholder="购买版本" :maxlength="50"></el-input>
				</el-form-item> 
				</span>
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
		<el-dialog width="60%" top="20px" :visible.sync="branchSelectVisible" append-to-body>
			<branch-select @row-click="onBranchRowClick"></branch-select>
		</el-dialog>
		
		<el-dialog width="60%" top="20px" :visible.sync="moduleSelectVisible" append-to-body>
			<module-select :single="true" @row-click="onModuleRowClick"></module-select>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addBranchModule,editBranchModule } from '@/api/mdp/sys/branchModule';
	import { mapGetters } from 'vuex'
	import BranchSelect from "@/views/mdp/sys/branch/BranchSelect"
	import ModuleSelect from "@/views/mdp/sys/module/ModuleSelect"
	export default {
	    name:'branchModuleEdit',
	    components: {
			BranchSelect,ModuleSelect,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['branchModule','visible','opType'],

		watch: {
	      'branchModule':function( branchModule ) {
	        if(branchModule){
	            this.editForm = {...branchModule};
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
						//{ required: true, message: '机构编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					branchId:'',moduleId:'',startTime:'',endTime:'',ctime:'',ltime:'',cuserid:'',cusername:'',luserid:'',lusername:'',status:'',musers:'',mbidNum:'',sfeeRate:'',ver:'',feeDate:''
				},
                maxTableHeight:300,
				branchSelectVisible:false,
				moduleSelectVisible:false,
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交BranchModule 管理端机构表（机构下面若干部门）父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addBranchModule
							if(this.currOpType=='edit'){
							    func=editBranchModule
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.data.tips;
                                if(tips.isOk){
                                    this.editForm=res.data.data
                                    this.initData()
                                    this.currOpType="edit";
                                    this.$emit('submit',res.data.data);//  @submit="afterAddSubmit"
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
			    if(this.branchModule){
                    this.editForm = Object.assign({},this.branchModule);
                }

                if(this.opType=='edit'){

                }else{

                }
            },
			onBranchRowClick(branch){
				this.editForm.branchId=branch.id
				this.branchSelectVisible=false;
			},
			onModuleRowClick(module){
				this.moduleSelectVisible=false;
				this.editForm.moduleId=module.id; 
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

<style scoped>

</style>